"""Resize public source thumbnails for the static Marosim catalog."""

import io
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests
from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent.parent
ITEMS = json.loads((ROOT / "docs/research/olx-verified-100.json").read_text(encoding="utf-8"))
TARGET = ROOT / "public/catalog/real"
TARGET.mkdir(parents=True, exist_ok=True)


def save_image(item: dict) -> tuple[str, int]:
    path = TARGET / f"{item['sourceId']}.webp"
    if path.exists() and path.stat().st_size > 0:
        return item["sourceId"], path.stat().st_size
    response = requests.get(item["imageUrl"], timeout=25)
    response.raise_for_status()
    if not response.headers.get("content-type", "").startswith("image/"):
        raise ValueError(f"Not an image: {item['sourceId']}")
    if len(response.content) > 12_000_000:
        raise ValueError(f"Image too large: {item['sourceId']}")
    with Image.open(io.BytesIO(response.content)) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")
        image.thumbnail((960, 960), Image.Resampling.LANCZOS)
        image.save(path, "WEBP", quality=77, method=5)
    return item["sourceId"], path.stat().st_size


errors = []
sizes = []
with ThreadPoolExecutor(max_workers=6) as pool:
    futures = {pool.submit(save_image, item): item for item in ITEMS}
    for future in as_completed(futures):
        try:
            sizes.append(future.result()[1])
        except Exception as error:  # Keep all failures visible for a complete retry.
            errors.append((futures[future]["sourceId"], str(error)))

print(f"Saved {len(sizes)}/{len(ITEMS)} images, {sum(sizes) // 1024} KiB total")
for source_id, error in errors:
    print(f"FAILED {source_id}: {error}")
if errors:
    raise SystemExit(1)
