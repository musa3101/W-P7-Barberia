#!/usr/bin/env python3
"""Compila src/head.html, src/header.html, src/sections/*.html y src/footer.html en x/v1/index.html."""

from pathlib import Path


def build() -> None:
    base_dir = Path(__file__).resolve().parent.parent
    src_dir = base_dir / "src"
    sections_dir = src_dir / "sections"
    output_file = base_dir / "index.html"

    parts: list[Path] = [
        src_dir / "head.html",
        src_dir / "header.html",
        *sorted(sections_dir.glob("*.html")),
        src_dir / "footer.html",
    ]

    chunks: list[str] = []
    for part in parts:
        if not part.exists():
            raise FileNotFoundError(f"Falta el archivo requerido: {part}")
        chunks.append(part.read_text(encoding="utf-8").rstrip())

    html = "\n\n".join(chunks) + "\n"
    output_file.write_text(html, encoding="utf-8")
    print(f"Compilado {output_file} ({len(parts)} bloques, {len(html)} bytes)")


if __name__ == "__main__":
    build()
