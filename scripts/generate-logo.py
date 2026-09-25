"""Create the CramDesk app icon from the site's book mark."""

from pathlib import Path
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "logo.png"
SCALE = 4
SIZE = 512 * SCALE

image = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
gradient = Image.new("RGBA", (SIZE, SIZE))
gradient_draw = ImageDraw.Draw(gradient)
for y in range(SIZE):
    ratio = y / (SIZE - 1)
    color = tuple(round(a + (b - a) * ratio) for a, b in zip((234, 113, 58), (178, 57, 46)))
    gradient_draw.line((0, y, SIZE, y), fill=(*color, 255))
mask = Image.new("L", (SIZE, SIZE), 0)
ImageDraw.Draw(mask).rounded_rectangle((0, 0, SIZE - 1, SIZE - 1), radius=112 * SCALE, fill=255)
image.paste(gradient, (0, 0), mask)
draw = ImageDraw.Draw(image)

# Two open pages, simplified so the silhouette stays legible as a favicon.
left = [(112, 150), (154, 137), (199, 135), (245, 150), (245, 367), (205, 354), (158, 352), (112, 364)]
right = [(267, 150), (313, 135), (358, 137), (400, 150), (400, 364), (354, 352), (307, 354), (267, 367)]
for page in (left, right):
    draw.line([(x * SCALE, y * SCALE) for x, y in page + [page[0]]], fill="#fffaf5", width=18 * SCALE, joint="curve")

draw.line((256 * SCALE, 147 * SCALE, 256 * SCALE, 373 * SCALE), fill="#ffe1cf", width=11 * SCALE)
draw.line((147 * SCALE, 201 * SCALE, 206 * SCALE, 199 * SCALE), fill="#ffd2b7", width=9 * SCALE)
draw.line((147 * SCALE, 241 * SCALE, 207 * SCALE, 240 * SCALE), fill="#ffd2b7", width=9 * SCALE)
draw.line((306 * SCALE, 199 * SCALE, 365 * SCALE, 201 * SCALE), fill="#ffd2b7", width=9 * SCALE)
draw.line((305 * SCALE, 240 * SCALE, 365 * SCALE, 241 * SCALE), fill="#ffd2b7", width=9 * SCALE)

image.resize((512, 512), Image.Resampling.LANCZOS).save(OUTPUT, optimize=True)
print(OUTPUT)
