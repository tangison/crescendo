#!/usr/bin/env python3
"""Preflight a PDF, render every page, and build a contact sheet for visual QA."""

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw
from pypdf import PdfReader


A4_PT = (595.276, 841.89)


def near(value: float, target: float, tolerance: float = 4.0) -> bool:
    return abs(value - target) <= tolerance


def page_size(page) -> tuple[float, float]:
    box = page.mediabox
    return float(box.width), float(box.height)


def render_pdf(pdf: Path, render_dir: Path, dpi: int) -> list[Path]:
    tool = shutil.which("pdftoppm")
    if not tool:
        raise RuntimeError("pdftoppm is required for rendering but was not found")
    render_dir.mkdir(parents=True, exist_ok=True)
    prefix = render_dir / "page"
    subprocess.run(
        [tool, "-png", "-r", str(dpi), str(pdf), str(prefix)],
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    return sorted(render_dir.glob("page-*.png"))


def contact_sheet(images: list[Path], output: Path) -> None:
    opened = [Image.open(path).convert("RGB") for path in images]
    thumb_width = 420
    gap = 24
    label_height = 34
    thumbs = []
    for image in opened:
        height = round(image.height * thumb_width / image.width)
        thumbs.append(image.resize((thumb_width, height), Image.Resampling.LANCZOS))
    cell_height = max(image.height for image in thumbs) + label_height
    columns = 2 if len(thumbs) > 1 else 1
    rows = (len(thumbs) + columns - 1) // columns
    sheet = Image.new(
        "RGB",
        (columns * thumb_width + (columns + 1) * gap, rows * cell_height + (rows + 1) * gap),
        "#E8E8E8",
    )
    draw = ImageDraw.Draw(sheet)
    for index, image in enumerate(thumbs):
        row, column = divmod(index, columns)
        x = gap + column * (thumb_width + gap)
        y = gap + row * cell_height
        sheet.paste(image, (x, y + label_height))
        draw.text((x, y + 8), f"PAGE {index + 1}", fill="#222222")
    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output, quality=92)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("pdf", type=Path)
    parser.add_argument("--render-dir", type=Path, required=True)
    parser.add_argument("--dpi", type=int, default=144)
    parser.add_argument("--allow-non-a4", action="store_true")
    args = parser.parse_args()

    if not args.pdf.is_file():
        print(f"ERROR: PDF not found: {args.pdf}", file=sys.stderr)
        return 2

    reader = PdfReader(str(args.pdf))
    if not reader.pages:
        print("ERROR: PDF has no pages", file=sys.stderr)
        return 2

    errors: list[str] = []
    warnings: list[str] = []
    for index, page in enumerate(reader.pages, 1):
        width, height = page_size(page)
        portrait_a4 = near(width, A4_PT[0]) and near(height, A4_PT[1])
        landscape_a4 = near(width, A4_PT[1]) and near(height, A4_PT[0])
        if not args.allow_non_a4 and not (portrait_a4 or landscape_a4):
            errors.append(f"page {index}: non-A4 media box {width:.1f} x {height:.1f} pt")
        text = (page.extract_text() or "").strip()
        resources = page.get("/Resources")
        has_xobject = bool(resources and resources.get("/XObject"))
        if not text and not has_xobject:
            errors.append(f"page {index}: appears blank")
        elif len(text) < 30 and not has_xobject:
            warnings.append(f"page {index}: very little extractable content; inspect intent")

    try:
        renders = render_pdf(args.pdf, args.render_dir, args.dpi)
    except (RuntimeError, subprocess.CalledProcessError) as exc:
        print(f"ERROR: rendering failed: {exc}", file=sys.stderr)
        return 2

    if len(renders) != len(reader.pages):
        errors.append(f"render count {len(renders)} does not match page count {len(reader.pages)}")
    elif renders:
        contact_sheet(renders, args.render_dir / "contact-sheet.jpg")

    print(f"PDF: {args.pdf}")
    print(f"Pages: {len(reader.pages)}")
    print(f"Renders: {args.render_dir}")
    print(f"Contact sheet: {args.render_dir / 'contact-sheet.jpg'}")
    for warning in warnings:
        print(f"WARNING: {warning}")
    for error in errors:
        print(f"ERROR: {error}")
    print("MANUAL CHECK REQUIRED: inspect every rendered page for clipping, overflow, logo fidelity, watermark opacity, hierarchy, and print quality.")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
