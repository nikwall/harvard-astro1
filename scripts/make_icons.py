"""Draw the app icons (same orbit motif as favicon.svg) as PNGs for the web app manifest and iOS.

    python scripts/make_icons.py

Writes icons/icon-192.png, icons/icon-512.png (rounded tile), icons/maskable-512.png (full bleed,
motif inside the 80% safe zone), icons/apple-touch-icon.png (180 px, full bleed; iOS rounds it)
and icons/favicon-32.png."""
import math
import os
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "icons")
BG = (4, 6, 11)
CYAN = (111, 227, 255)
AMBER = (255, 200, 110)
VIOLET = (169, 150, 255)
SS = 4  # supersampling factor
TILT = -28  # degrees, as in favicon.svg (SVG coordinates, y down)


def motif(size, scale, rounded):
    """Draw the motif on a size×size tile. `scale` = share of the tile that the 32-unit design spans."""
    S = size * SS
    u = S * scale / 32.0                 # one design unit in pixels
    o = (S - 32 * u) / 2                 # offset of the 32-unit design box
    P = lambda x, y: (o + x * u, o + y * u)
    cx, cy = P(16, 16)

    def layer():
        im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
        return im, ImageDraw.Draw(im)

    # base tile
    base, d = layer()
    if rounded:
        d.rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * 0.225), fill=BG + (255,))
    else:
        d.rectangle([0, 0, S, S], fill=BG + (255,))
    mask = base.split()[3]

    # soft glow behind the sun
    glow, g = layer()
    for r, a in ((11, 20), (8, 30), (6, 40)):
        g.ellipse([cx - r * u, cy - r * u, cx + r * u, cy + r * u], fill=AMBER + (a,))
    base = Image.alpha_composite(base, glow.filter(ImageFilter.GaussianBlur(radius=4 * u)))

    # stars and the faint outer ring
    fx, f = layer()
    for (x, y, r, c, a) in ((6.5, 7.5, .45, (255, 255, 255), 220), (24, 26.5, .4, (207, 230, 255), 200), (8.5, 24.5, .35, (255, 255, 255), 190), (28, 19, .3, (255, 255, 255), 170), (19, 5.0, .3, (255, 231, 194), 190)):
        X, Y = P(x, y)
        f.ellipse([X - r * u, Y - r * u, X + r * u, Y + r * u], fill=c + (a,))
    R = 12.5 * u
    f.ellipse([cx - R, cy - R, cx + R, cy + R], outline=CYAN + (64,), width=max(1, round(.5 * u)))
    base = Image.alpha_composite(base, fx)

    # the tilted orbit: draw an upright ellipse ring, then rotate the layer about the center
    orb, ob = layer()
    w = max(2, round(1.25 * u))
    ob.ellipse([cx - 12 * u, cy - 4.2 * u, cx + 12 * u, cy + 4.2 * u], outline=CYAN + (255,), width=w)
    orb = orb.rotate(-TILT, resample=Image.BICUBIC, center=(cx, cy))  # PIL rotates counter-clockwise for positive angles
    base = Image.alpha_composite(base, orb)

    def on_orbit(t):
        th = math.radians(TILT)
        X, Y = 12 * math.cos(t), 4.2 * math.sin(t)
        return P(16 + X * math.cos(th) - Y * math.sin(th), 16 + X * math.sin(th) + Y * math.cos(th))

    bodies, b = layer()
    r = 4.1 * u
    b.ellipse([cx - r, cy - r, cx + r, cy + r], fill=AMBER + (255,))
    px, py = on_orbit(-0.15)
    r, gap = 1.9 * u, .75 * u
    b.ellipse([px - r - gap, py - r - gap, px + r + gap, py + r + gap], fill=BG + (255,))
    b.ellipse([px - r, py - r, px + r, py + r], fill=CYAN + (255,))
    mx, my = on_orbit(math.pi + 0.55)
    r = 1.05 * u
    b.ellipse([mx - r - gap * .7, my - r - gap * .7, mx + r + gap * .7, my + r + gap * .7], fill=BG + (255,))
    b.ellipse([mx - r, my - r, mx + r, my + r], fill=VIOLET + (255,))
    base = Image.alpha_composite(base, bodies)

    base.putalpha(mask)  # keep the tile's own outline (rounded corners stay transparent)
    return base.resize((size, size), Image.LANCZOS)


def main():
    os.makedirs(OUT, exist_ok=True)
    motif(192, 0.86, True).save(os.path.join(OUT, "icon-192.png"))
    motif(512, 0.86, True).save(os.path.join(OUT, "icon-512.png"))
    motif(512, 0.70, False).convert("RGB").save(os.path.join(OUT, "maskable-512.png"))
    motif(180, 0.80, False).convert("RGB").save(os.path.join(OUT, "apple-touch-icon.png"))
    motif(32, 0.92, True).save(os.path.join(OUT, "favicon-32.png"))
    print("icons written to", OUT)


if __name__ == "__main__":
    main()
