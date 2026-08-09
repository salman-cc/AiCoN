#!/usr/bin/env python3
"""Small dependency-free check for the Blogger theme source."""
from pathlib import Path
from xml.etree import ElementTree

THEME = Path(__file__).resolve().parents[1] / "blogger" / "theme.xml"

ElementTree.parse(THEME)
source = THEME.read_text(encoding="utf-8")
required = (
    "b:layoutsVersion='3'",
    "b:responsive='true'",
    "<b:widget id='Blog1'",
    "values='data:posts'",
    "<data:post.body/>",
    "<data:post.title/>",
    "data:post.url",
    "data:post.labels",
    "data:post.author",
)
missing = [needle for needle in required if needle not in source]
if missing:
    raise SystemExit("Missing required theme markers: " + ", ".join(missing))
print(f"Valid XML and required Blogger markers: {THEME}")
