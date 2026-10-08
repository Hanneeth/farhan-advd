"""Render the lesson narration with Kokoro (neural TTS, runs offline): one mp3 per line in audio/mp3/<k>.mp3 (shared by all lessons).
Usage: python3 scripts/anim/tts.py c   (needs: pip install kokoro-onnx soundfile; ffmpeg; model + voices, see KOKORO_DIR)
Only lines without an mp3 are rendered, so edits re-render just what changed."""
import json, os, re, subprocess, sys, tempfile
import numpy as np, soundfile as sf
from kokoro_onnx import Kokoro

here = os.path.dirname(os.path.abspath(__file__))
lesson = sys.argv[1] if len(sys.argv) > 1 else 'c'
kdir = os.environ.get('KOKORO_DIR', os.path.join(here, '.kokoro'))
VOICE, SPEED = os.environ.get('KOKORO_VOICE', 'af_heart'), float(os.environ.get('KOKORO_SPEED', '0.92'))
lines = json.load(open(os.path.join(here, 'audio', lesson + '.json')))
out = os.path.join(here, 'audio', 'mp3'); os.makedirs(out, exist_ok=True)  # shared by all lessons
todo = [l for l in lines if not os.path.exists(os.path.join(out, l['k'] + '.mp3'))]
print(len(lines), 'lines,', len(todo), 'to render')
if not todo: sys.exit(0)
k = Kokoro(os.path.join(kdir, 'kokoro-fp16.onnx'), os.path.join(kdir, 'voices.npz'))

def sentences(t):
    parts = re.split(r'(?<=[.!?])\s+(?=[A-Z0-9(])', t)
    return [p for s in parts for p in (re.split(r'(?<=[;:])\s+', s) if len(s) > 220 else [s]) if p.strip()]

for i, l in enumerate(todo):
    chunks, sr = [], 24000
    for j, s in enumerate(sentences(l['text'])):
        a, sr = k.create(s, voice=VOICE, speed=SPEED, lang='en-us')
        if j: chunks.append(np.zeros(int(sr * 0.32), dtype=np.float32))  # a breath between sentences
        chunks.append(a)
    chunks.append(np.zeros(int(sr * 0.08), dtype=np.float32))
    with tempfile.NamedTemporaryFile(suffix='.wav') as w:
        sf.write(w.name, np.concatenate(chunks), sr)
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', w.name, '-ac', '1', '-ar', '24000', '-b:a', '40k',
                        os.path.join(out, l['k'] + '.mp3')], check=True)
    print(f'{i + 1}/{len(todo)}', l['text'][:70], flush=True)
