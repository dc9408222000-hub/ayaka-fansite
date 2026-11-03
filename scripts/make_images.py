#!/usr/bin/env python3
"""為相簿照片產生 WebP 版本與分享用的 og.jpg。

用法（在 repo 根目錄執行）：
    python3 scripts/make_images.py            # 處理 photos/ 裡所有 ayaka-*.jpg
    python3 scripts/make_images.py --out DIR  # 把結果輸出到別的資料夾（測試用）

每張 photos/xxx.jpg 會產生：
    photos/xxx-480.webp   寬 480px（手機）
    photos/xxx-800.webp   寬 800px（平板／桌機格子）
    photos/xxx-full.webp  原始尺寸（放大檢視）
另外從 photos/ayaka-07.jpg 裁出 photos/og.jpg（1200×630，分享預覽圖）。

需要 Pillow：pip install Pillow
換照片之後請重新執行一次，網頁才找得到對應的 WebP 檔。
"""
import argparse
import pathlib
import sys

try:
    from PIL import Image, ImageOps
except ImportError:  # pragma: no cover
    sys.exit("需要 Pillow 套件：pip install Pillow")

ROOT = pathlib.Path(__file__).resolve().parent.parent
PHOTOS = ROOT / "photos"
SIZES = (480, 800)
WEBP_QUALITY = 82
OG_SOURCE = "ayaka-07.jpg"
OG_SIZE = (1200, 630)
OG_FOCUS_Y = 0.30   # 裁切時以高度 30% 處（臉的位置）為中心


def show(path: pathlib.Path) -> str:
    """顯示用的相對路徑（輸出到 repo 以外時就印完整路徑）。"""
    try:
        return str(path.relative_to(ROOT))
    except ValueError:
        return str(path)


def make_webp(src: pathlib.Path, out_dir: pathlib.Path) -> None:
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        stem = src.stem
        for width in SIZES:
            target = out_dir / f"{stem}-{width}.webp"
            w = min(width, im.width)                      # 不放大
            h = round(im.height * w / im.width)
            resized = im.resize((w, h), Image.LANCZOS)
            resized.save(target, "WEBP", quality=WEBP_QUALITY, method=6)
            print(f"  {show(target)}  {w}x{h}")
        full = out_dir / f"{stem}-full.webp"
        im.save(full, "WEBP", quality=WEBP_QUALITY, method=6)
        print(f"  {show(full)}  {im.width}x{im.height}")


def make_og(src: pathlib.Path, out_dir: pathlib.Path) -> None:
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im).convert("RGB")
        target_w, target_h = OG_SIZE
        scale = target_w / im.width
        crop_h = round(target_h / scale)
        center = round(im.height * OG_FOCUS_Y)
        top = max(0, min(im.height - crop_h, center - crop_h // 2))
        box = (0, top, im.width, top + crop_h)
        og = im.crop(box).resize(OG_SIZE, Image.LANCZOS)
        out = out_dir / "og.jpg"
        og.save(out, "JPEG", quality=86, optimize=True, progressive=True)
        print(f"  {show(out)}  {target_w}x{target_h} (裁自 {src.name} y={top}..{top + crop_h})")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--out", type=pathlib.Path, default=PHOTOS, help="輸出資料夾（預設 photos/）")
    args = parser.parse_args()
    out_dir = args.out.resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    sources = sorted(p for p in PHOTOS.glob("*.jpg") if p.name != "og.jpg")
    if not sources:
        sys.exit("photos/ 裡找不到 jpg 檔")
    print("產生 WebP：")
    for src in sources:
        make_webp(src, out_dir)
    og_src = PHOTOS / OG_SOURCE
    if og_src.exists():
        print("產生分享圖：")
        make_og(og_src, out_dir)
    else:
        print(f"（找不到 {OG_SOURCE}，略過 og.jpg）")
    print("完成。")


if __name__ == "__main__":
    main()
