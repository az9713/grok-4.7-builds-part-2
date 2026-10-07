"""Chroma-key magenta sprites and pack walk/idle sheets."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent
FRAMES = ROOT / "frames"
SHEETS = ROOT / "sheets"
SHEETS.mkdir(exist_ok=True)


def key_magenta(im: Image.Image, thresh: int = 70) -> Image.Image:
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if r > 160 and b > 160 and g < r - thresh and g < b - thresh:
                px[x, y] = (0, 0, 0, 0)
    return im


def bbox(im: Image.Image):
    alpha = im.split()[-1]
    box = alpha.getbbox()
    return box or (0, 0, im.width, im.height)


def cell(im: Image.Image, size: int = 192) -> Image.Image:
    im = key_magenta(im)
    box = bbox(im)
    cropped = im.crop(box)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    cw, ch = cropped.size
    scale = min((size - 8) / cw, (size - 8) / ch)
    nw, nh = max(1, int(cw * scale)), max(1, int(ch * scale))
    cropped = cropped.resize((nw, nh), Image.Resampling.NEAREST)
    canvas.paste(cropped, ((size - nw) // 2, size - nh - 4), cropped)
    return canvas


def pick(folder: Path, count: int = 8) -> list[Path]:
    files = sorted(folder.glob("*.png"))
    if not files:
        return []
    # skip the first/last 4 to avoid hold frames
    inner = files[4:-4] if len(files) > 12 else files
    step = max(1, len(inner) // count)
    picked = inner[::step][:count]
    return picked


def sheet(name: str, paths: list[Path], size: int = 192) -> Path:
    cells = [cell(Image.open(p), size) for p in paths]
    n = len(cells)
    out = Image.new("RGBA", (size * n, size), (0, 0, 0, 0))
    for i, c in enumerate(cells):
        out.paste(c, (i * size, 0), c)
    dest = SHEETS / f"{name}.png"
    out.save(dest)
    print(f"{name}: {n} cells -> {dest}")
    return dest


def key_still(src: Path, dest: Path, size: int = 192):
    dest.parent.mkdir(parents=True, exist_ok=True)
    cell(Image.open(src), size).save(dest)
    print("still", dest.name)


def main():
    idle = pick(FRAMES / "idle", 8)
    walk = pick(FRAMES / "walk", 8)
    if idle:
        sheet("hero-idle", idle)
    if walk:
        sheet("hero-walk", walk)
    locks = ROOT / "locks"
    variants = ROOT / "variants"
    stills = [
        (locks / "hero.jpg", "hero.png"),
        (locks / "guard.jpg", "guard.png"),
        (locks / "creature-ancestor.jpg", "creature.png"),
        (locks / "elevator.jpg", "elevator.png"),
        (locks / "shelf.jpg", "shelf.png"),
        (variants / "guard-full.jpg", "guard-full.png"),
        (variants / "elevator-clean.jpg", "elevator-clean.png"),
        (variants / "hero-side.jpg", "hero-side.png"),
    ]
    out_dir = SHEETS / "stills"
    for src, name in stills:
        if src.exists():
            key_still(src, out_dir / name)


if __name__ == "__main__":
    main()
