/* Page wiring: controls, chapter list, transcript, formula sheet, flashcards, question list. */
'use strict';
(function () {
  const svg = document.querySelector('svg.stage');
  const subs = document.querySelector('.subs');
  // shared defs survive scene changes
  const defs = el('defs', {}, svg);
  defs.innerHTML = `<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  Player.init(svg, subs);

  /* harvest every scene's captions once (for the transcript and the time map) */
  const scratch = el('svg', { width: 1600, height: 900, style: 'position:absolute;left:-99999px;top:0;visibility:hidden' }, document.body);
  const TRANSCRIPT = SCENES.map((s) => {
    try { const S = makeCtx(scratch, s); s.build(S); S.stops.forEach((st) => Budget.count(st.src)); const caps = S.caps.sort((a, b) => a.t - b.t); while (scratch.firstChild) scratch.removeChild(scratch.firstChild); return caps; } catch (e) { console.error('scene', s.title, e); return []; }
  });
  scratch.remove();

  /* controls */
  const $ = (q) => document.querySelector(q);
  const playBtn = $('#play'), timeEl = $('.time'), fill = $('.fill'), knob = $('.knob'), bar = $('.bar');
  const total = Player.total();
  const offs = Player.offsets();
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  CHAPTERS.forEach((c) => { const o = offs[c.scenes[0].index]; const tk = document.createElement('div'); tk.className = 'tick'; tk.style.left = (100 * o) / total + '%'; bar.appendChild(tk); });
  playBtn.onclick = () => Player.toggle();
  $('#prev').onclick = () => { const i = Player.cur(); const lt = Player.time() - offs[i]; Player.seek(lt > 2 || i === 0 ? offs[i] : offs[i - 1], true); };
  $('#next').onclick = () => { const i = Player.cur(); if (i < SCENES.length - 1) Player.seek(offs[i + 1], true); };
  $('#back').onclick = () => Player.seek(Player.time() - 10, true);
  $('#speed').onchange = (e) => Player.setSpeed(+e.target.value);
  const vb = $('#voice');
  const vp = $('#vpick');
  const fillVoices = () => {
    const vs = Voice.list(); if (!vs.length) return;
    const cur = Voice.current() || Voice.pick();
    vp.innerHTML = vs.slice(0, 40).map((v) => `<option${v === cur ? ' selected' : ''}>${v.name}</option>`).join('');
  };
  vp.onchange = () => { Voice.choose(vp.value); if (Player.voice()) Player.repeat(); };
  try { window.speechSynthesis.onvoiceschanged = fillVoices; } catch (_) { /* no speech */ }
  fillVoices();
  const setV = (on) => { Player.setVoice(on); vb.classList.toggle('on', on); vb.textContent = on ? '🔊 Voice on' : '🔈 Voice'; vp.style.display = on && vp.options.length ? '' : 'none'; Voice.store('alab.voiceOn', on ? '1' : '0'); };
  vb.onclick = () => { fillVoices(); setV(!Player.voice()); };
  if (Voice.store('alab.voiceOn') === '1' && (window.speechSynthesis || Voice.hasStudio)) { Player.setVoice(true); vb.classList.add('on'); vb.textContent = '🔊 Voice on'; setTimeout(() => { vp.style.display = vp.options.length ? '' : 'none'; }, 400); }
  $('#again').onclick = () => Player.repeat();
  const pc = $('#pace');
  pc.innerHTML = Pace.LEVELS.map((l, i) => `<option value="${i}"${i === Pace.level() ? ' selected' : ''}>${l.name}</option>`).join('');
  pc.onchange = () => Pace.set(+pc.value);
  const db = $('#drills');
  if (!SCENES.some((s) => s.recall)) db.style.display = 'none';
  const setD = (on) => { Player.setDrills(on); db.classList.toggle('on', on); Voice.store('alab.drills', on ? '1' : '0'); };
  setD(Voice.store('alab.drills') !== '0');
  db.onclick = () => setD(!Player.drills());
  let drag = false;
  const seekX = (e) => { const r = bar.getBoundingClientRect(); Player.seek(clamp((e.clientX - r.left) / r.width, 0, 1) * total, true); };
  bar.addEventListener('pointerdown', (e) => { drag = true; bar.setPointerCapture(e.pointerId); seekX(e); });
  bar.addEventListener('pointermove', (e) => { if (drag) seekX(e); });
  bar.addEventListener('pointerup', () => { drag = false; });
  document.addEventListener('keydown', (e) => {
    if (Try.isOpen() || Drill.isOpen() || /INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName)) return;
    if (e.key === ' ') { e.preventDefault(); Player.toggle(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); $('#next').click(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); $('#prev').click(); }
    else if (e.key === 'j') Player.seek(Player.time() - 10, true);
    else if (e.key === 'l') Player.seek(Player.time() + 10, true);
    else if (e.key === 'r') Player.repeat();
  });

  /* chapter list */
  const side = $('.side .list');
  CHAPTERS.forEach((c, ci) => {
    const d = document.createElement('div'); d.className = 'ch';
    const b = document.createElement('button');
    const mins = Math.round(c.scenes.reduce((a, s) => a + s.dur, 0) / 60);
    b.innerHTML = `<span class="n">${ci + 1}</span><span>${c.name} <span style="color:var(--muted);font-weight:500;font-size:12px">· ${mins} min</span></span>`;
    b.onclick = () => { Player.seek(offs[c.scenes[0].index], true); };
    const list = document.createElement('div'); list.className = 'scs';
    c.scenes.forEach((s) => {
      const sb = document.createElement('button');
      sb.innerHTML = s.q ? `<span class="q">Q</span> ${s.title}` : s.title;
      sb.onclick = () => Player.seek(offs[s.index], true);
      s.btn = sb; list.appendChild(sb);
    });
    d.append(b, list); side.appendChild(d); c.div = d;
  });

  /* below: transcript, formula sheet, flashcards, questions */
  const tabs = document.querySelectorAll('.tabs button');
  const panes = document.querySelectorAll('.pane');
  tabs.forEach((t, i) => (t.onclick = () => { tabs.forEach((x) => x.classList.remove('on')); panes.forEach((p) => (p.style.display = 'none')); t.classList.add('on'); panes[i].style.display = ''; }));
  const notes = $('.notes');
  let notesCh = -1;
  function renderNotes(chIdx) {
    notesCh = chIdx;
    notes.innerHTML = '';
    CHAPTERS[chIdx].scenes.forEach((s) => {
      const h = document.createElement('h4'); h.textContent = s.title; notes.appendChild(h);
      TRANSCRIPT[s.index].forEach((c) => {
        if (!c.html) return;
        const p = document.createElement('p'); p.innerHTML = rt(c.html); p.dataset.t = offs[s.index] + c.t;
        p.onclick = () => Player.seek(+p.dataset.t, true);
        notes.appendChild(p);
      });
    });
  }
  const fs = $('.fs');
  FORMULAS.forEach(([grp, items]) => {
    const h = document.createElement('h4'); h.textContent = grp; h.style.gridColumn = '1 / -1'; h.style.margin = '8px 0 0'; h.style.color = 'var(--acc)'; fs.appendChild(h);
    items.forEach(([l, t]) => { const d = document.createElement('div'); d.className = 'f'; d.innerHTML = `<div class="l">${l}</div>` + katex.renderToString(t, { displayMode: true, throwOnError: false }); fs.appendChild(d); });
  });
  const fl = $('.flash');
  CARDS.forEach(([q, a]) => { const b = document.createElement('button'); b.innerHTML = `<div class="h">${rt(q)}</div><div class="a">${rt(a)}</div>`; b.onclick = () => b.classList.toggle('flip'); fl.appendChild(b); });
  const ql = $('.qlist');
  SCENES.filter((s) => s.q).forEach((s) => { const b = document.createElement('button'); b.innerHTML = `<b>${s.title}</b><span>${s.q} · ${s.ch}</span>`; b.onclick = () => { Player.seek(offs[s.index], true); window.scrollTo({ top: 0, behavior: 'smooth' }); }; ql.appendChild(b); });

  /* keep UI in sync */
  let lastScene = -1;
  Player.on((t) => {
    playBtn.textContent = Player.playing() ? '❚❚ Pause' : '▶ Play';
    timeEl.textContent = `${fmt(t)} / ${fmt(total)}`;
    const pc = (100 * t) / total; fill.style.width = pc + '%'; knob.style.left = pc + '%';
    const i = Player.cur();
    if (i !== lastScene) {
      lastScene = i;
      const s = SCENES[i];
      CHAPTERS.forEach((c) => c.div.classList.toggle('cur', c.name === s.ch));
      SCENES.forEach((x) => x.btn && x.btn.classList.toggle('cur', x === s));
      const ci = CHAPTERS.findIndex((c) => c.name === s.ch);
      if (ci !== notesCh) renderNotes(ci);
      try { history.replaceState(null, '', '#s=' + i); } catch (_) { /* file:// */ }
    }
    notes.querySelectorAll('p').forEach((p) => p.classList.remove('cur'));
    const ps = [...notes.querySelectorAll('p')].filter((p) => +p.dataset.t <= t + 1e-6);
    if (ps.length) ps[ps.length - 1].classList.add('cur');
  });
  const m = location.hash.match(/s=(\d+)/);
  Player.seek(m ? offs[+m[1]] || 0 : 0, true);
  Player.start();
  window.__seek = (t) => Player.seek(t, true);
  window.__scenes = () => SCENES.map((s, i) => ({ i, title: s.title, ch: s.ch, off: offs[i], dur: s.dur }));
})();
