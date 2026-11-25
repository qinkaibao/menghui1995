"""Import the published v19 snapshot. Every file is verified before it is committed."""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import hashlib, json, time, urllib.request, urllib.parse

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / "import-manifest.json").read_text())
base = manifest["source"].rstrip("/") + "/"
out = ROOT / "docs"
files = {}
for part in manifest["parts"]:
    files.update(json.loads((ROOT / part).read_text()))
assert len(files) == manifest["count"]

def fetch(item):
    name, expected = item
    path = out / name
    if not path.resolve().is_relative_to(out.resolve()):
        raise ValueError(name)
    if path.is_file() and hashlib.sha256(path.read_bytes()).hexdigest() == expected:
        return
    url = base + urllib.parse.quote(name, safe="/")
    for attempt in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent":"Menghui1995-Pages-Import/1.0"}), timeout=35) as response:
                data = response.read()
            if hashlib.sha256(data).hexdigest() != expected:
                raise ValueError("SHA256 mismatch")
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(data)
            return
        except Exception as exc:
            if attempt == 3:
                raise RuntimeError(f"{name}: {exc}") from exc
            time.sleep(2 ** attempt)

with ThreadPoolExecutor(max_workers=8) as pool:
    for i, _ in enumerate(pool.map(fetch, files.items()), 1):
        if i % 100 == 0:
            print(f"Verified {i}/{len(files)}")
(out / ".nojekyll").touch()
print(f"Verified all {len(files)} files.")
