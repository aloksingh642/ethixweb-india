#!/usr/bin/env python3
"""
Generates the icon set, brand cuts and OG image from the source Ethixweb
mark and wordmark (downloaded from ethixweb.com).

    python3 scripts/generate-assets.py

Requires Pillow and the two Google Fonts files in /tmp/fonts (the script
downloads them if missing).
"""
from __future__ import annotations

import os
import subprocess
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
BRAND = PUBLIC / "brand"
FONTS = Path("/tmp/fonts")

INK = (20, 17, 16, 255)
WHITE = (255, 255, 255, 255)
BONE = (250, 247, 242, 255)
BRAND_RED = (209, 58, 64, 255)

FONTS_URLS = {
    "PJS.ttf": "https://github.com/google/fonts/raw/main/ofl/plusjakartasans/PlusJakartaSans%5Bwght%5D.ttf",
    "InstrumentSerif-Italic.ttf": "https://github.com/google/fonts/raw/main/ofl/instrumentserif/InstrumentSerif-Italic.ttf",
}


def ensure_fonts() -> None:
    FONTS.mkdir(parents=True, exist_ok=True)
    for name, url in FONTS_URLS.items():
        target = FONTS / name
        if target.exists() and target.stat().st_size > 20_000:
            continue
        print(f"  downloading {name}…")
        urllib.request.urlretrieve(url, target)


def load(path: Path, size: float, variant: str = "Regular") -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(str(path), int(size))
    try:
        font.set_variation_by_name(variant)
    except Exception:
        pass
    return font


def recolor(img: Image.Image, rgb: tuple[int, int, int]) -> Image.Image:
    """Replace all opaque pixels with `rgb`, preserving the original alpha."""
    r, g, b, a = img.split()
    solid = Image.new("RGBA", img.size, rgb + (255,))
    recolored = Image.new("RGBA", img.size, rgb + (0,))
    recolored.paste(solid, (0, 0))
    return Image.merge("RGBA", (*solid.split()[:3], a))


def rounded(size: int, radius: int, color: tuple[int, int, int, int]) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=color)
    return img


def main() -> None:
    BRAND.mkdir(parents=True, exist_ok=True)
    PUBLIC.mkdir(parents=True, exist_ok=True)

    print("→ Preparing fonts…")
    ensure_fonts()

    print("→ Brand cuts…")
    emblem_src = Image.open(ROOT / "assets-src/emblem.webp").convert("RGBA")
    wordmark_src = Image.open(ROOT / "assets-src/wordmark.webp").convert("RGBA")

    # Emblem: trim the transparent padding so layout maths stays honest.
    emblem = emblem_src.crop(emblem_src.getbbox())

    # The shipped wordmark is pure white — designed for dark backgrounds.
    # Recolour it for light surfaces instead of inverting (which would grey it).
    wordmark_ink = recolor(wordmark_src, INK[:3])
    wordmark_white = recolor(wordmark_src, WHITE[:3])

    emblem.save(BRAND / "emblem.png", optimize=True)
    wordmark_ink.save(BRAND / "wordmark-ink.png", optimize=True)
    wordmark_white.save(BRAND / "wordmark-white.png", optimize=True)

    print("→ Icons…")
    # Square canvas with even optical padding around the mark.
    def icon(size: int, bg: tuple[int, int, int, int], pad_ratio: float = 0.14, radius_ratio: float = 0.22):
        canvas_size = int(size / (1 - pad_ratio * 2))
        mark = emblem.resize((canvas_size, canvas_size), Image.LANCZOS)
        canvas = Image.new("RGBA", (size, size), bg)
        if radius_ratio and bg[3] > 0:
            mask_canvas = rounded(size, int(size * radius_ratio), (255, 255, 255, 255))
            canvas.putalpha(mask_canvas.split()[3])
        offset = (size - canvas_size) // 2
        canvas.alpha_composite(mark, (offset, offset))
        return canvas

    for px in (16, 32, 48):
        icon(px, (0, 0, 0, 0), radius_ratio=0).save(PUBLIC / f"favicon-{px}.png", optimize=True)

    icon(180, WHITE, radius_ratio=0).save(PUBLIC / "apple-touch-icon.png", optimize=True)
    icon(192, WHITE, radius_ratio=0).save(PUBLIC / "icon-192.png", optimize=True)
    icon(512, WHITE, radius_ratio=0).save(PUBLIC / "icon-512.png", optimize=True)

    # ICO container for browsers that still ask for /favicon.ico.
    # Pillow only writes a single ICO frame here; browsers that still request
    # /favicon.ico get the 32px cut. The 16/32/48 PNGs are declared in metadata.
    icon(32, (0, 0, 0, 0), radius_ratio=0).save(PUBLIC / "favicon.ico", format="ICO", sizes=[(32, 32)])

    print("→ OG image…")
    og = Image.new("RGBA", (1200, 630), BONE)
    d = ImageDraw.Draw(og)

    # Brand web motif, top-right, very low contrast.
    web = Image.new("RGBA", (1200, 630), (0, 0, 0, 0))
    wd = ImageDraw.Draw(web)
    cx, cy = 1200, 0
    for i in range(1, 15):
        wd.line([(cx, cy), (cx - i * 62, cy + i * 46)], fill=(209, 58, 64, 26), width=2)
    for r in range(1, 8):
        wd.arc([cx - r * 92, cy - r * 92, cx + r * 92, cy + r * 92], 90, 180, fill=(209, 58, 64, 22), width=2)
    og.alpha_composite(web.filter(ImageFilter.GaussianBlur(0.4)))

    mark = emblem.resize((96, 100), Image.LANCZOS)
    og.alpha_composite(mark, (80, 72))

    f_h1 = load(FONTS / "PJS.ttf", 76, "ExtraBold")
    f_sub = load(FONTS / "PJS.ttf", 30, "Regular")
    f_ital = load(FONTS / "InstrumentSerif-Italic.ttf", 76)
    f_small = load(FONTS / "PJS.ttf", 24, "SemiBold")

    wm = wordmark_ink.resize((300, 45), Image.LANCZOS)
    og.alpha_composite(wm, (196, 92))

    d.text((80, 232), "We run the tech.", font=f_h1, fill=INK)
    italic_w = d.textlength("We run the tech. ", font=f_h1)
    d.text((80 + italic_w, 232), "You run the business.", font=f_ital, fill=BRAND_RED)

    d.text(
        (80, 344),
        "Digital operations for India’s ambitious businesses —",
        font=f_sub,
        fill=(76, 66, 61, 255),
    )
    d.text(
        (80, 386),
        "websites, AI receptionists, WhatsApp automation, SEO and",
        font=f_sub,
        fill=(76, 66, 61, 255),
    )
    d.text((80, 428), "dashboards — run end to end in IST.", font=f_sub, fill=(76, 66, 61, 255))

    # Chip
    d.rounded_rectangle([80, 512, 470, 566], radius=27, fill=BRAND_RED)
    d.text((108, 525), "ethixweb.in  ·  Jaipur  ·  9:30–19:00 IST", font=f_small, fill=WHITE)

    og.convert("RGB").save(PUBLIC / "og.png", optimize=True)

    print("\n✓ Assets written:")
    for p in sorted([*BRAND.glob("*"), *PUBLIC.glob("*.png"), *PUBLIC.glob("*.ico")]):
        print(f"   {p.relative_to(ROOT)}  ({p.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
