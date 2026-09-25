"""Generate the CramDesk social card from the site's editorial design."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "og-image.png"
SIZE = (1200, 630)


def font(size: int, kind: str = "sans"):
    candidates = {
        "sans": ["C:/Windows/Fonts/segoeui.ttf", "DejaVuSans.ttf"],
        "bold": ["C:/Windows/Fonts/segoeuib.ttf", "DejaVuSans-Bold.ttf"],
        "serif": ["C:/Windows/Fonts/georgia.ttf", "DejaVuSerif.ttf"],
        "italic": ["C:/Windows/Fonts/georgiai.ttf", "DejaVuSerif-Italic.ttf"],
    }[kind]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size)
        except OSError:
            pass
    return ImageFont.load_default()


image = Image.new("RGB", SIZE, "#fffaf5")
glow = Image.new("RGBA", SIZE, (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow)
glow_draw.ellipse((-130, 55, 760, 700), fill=(255, 215, 189, 155))
glow_draw.ellipse((630, -180, 1330, 620), fill=(255, 227, 207, 125))
glow = glow.filter(ImageFilter.GaussianBlur(85))
image = Image.alpha_composite(image.convert("RGBA"), glow)
draw = ImageDraw.Draw(image)

# Brand mark and wordmark.
draw.rounded_rectangle((70, 57, 126, 113), radius=16, fill="#ffe1cf", outline="#f2c2aa", width=2)
draw.line([(88, 75), (98, 72), (98, 95), (88, 97), (88, 75)], fill="#b84432", width=3, joint="curve")
draw.line([(100, 72), (110, 75), (110, 97), (100, 95), (100, 72)], fill="#b84432", width=3, joint="curve")
draw.text((145, 56), "CramDesk.", font=font(40, "serif"), fill="#33252b")

draw.rounded_rectangle((70, 155, 367, 196), radius=20, fill="#ffebe1", outline="#f2d1c4", width=1)
draw.text((87, 165), "LE STUDIO DE RÉVISION", font=font(16, "bold"), fill="#b84432")

draw.text((68, 222), "Ton cours,", font=font(78, "serif"), fill="#33252b")
draw.text((69, 309), "enfin", font=font(84, "italic"), fill="#c25334")
draw.text((67, 402), "facile à réviser.", font=font(65, "serif"), fill="#33252b")
draw.text((73, 520), "Du PDF à la compréhension, puis à la pratique.", font=font(24), fill="#6e6470")

# A small, truthful product preview; no ratings or invented user counts.
draw.rounded_rectangle((760, 165, 1130, 565), radius=27, fill="#ffffff", outline="#e7dfe5", width=2)
draw.rounded_rectangle((785, 190, 829, 234), radius=12, fill="#ffe1cf")
draw.text((799, 198), "P", font=font(25, "bold"), fill="#b84432")
draw.text((845, 190), "Biologie cellulaire.pdf", font=font(17, "bold"), fill="#342937")
draw.text((845, 216), "Document prêt à réviser", font=font(13), fill="#837a84")
draw.line((785, 254, 1105, 254), fill="#eee8ed", width=2)
draw.rounded_rectangle((785, 275, 881, 310), radius=17, fill="#b84432")
draw.text((802, 284), "Synthèse", font=font(14, "bold"), fill="#ffffff")
draw.rounded_rectangle((890, 275, 1006, 310), radius=17, fill="#f7f3f6")
draw.text((904, 284), "Flashcards", font=font(14, "bold"), fill="#6f6470")
draw.rounded_rectangle((1015, 275, 1105, 310), radius=17, fill="#f7f3f6")
draw.text((1032, 284), "Quiz", font=font(14, "bold"), fill="#6f6470")
draw.text((786, 338), "La membrane cellulaire", font=font(25, "serif"), fill="#33252b")
draw.text((786, 388), "Une structure souple qui régule", font=font(15), fill="#665b67")
draw.text((786, 412), "les échanges de la cellule.", font=font(15), fill="#665b67")
draw.rounded_rectangle((785, 463, 1105, 518), radius=12, fill="#faf7f9")
draw.ellipse((802, 482, 819, 499), fill="#e6eee4", outline="#718e65", width=2)
draw.text((830, 478), "L’essentiel, en clair.", font=font(15, "bold"), fill="#554958")

image.convert("RGB").save(OUTPUT, optimize=True)
print(OUTPUT)
