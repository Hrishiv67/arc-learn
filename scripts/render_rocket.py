"""
ARC Learn — exploded rocket renderer.

Draws the competition rocket the course builds, one section per file, in the
register of a CAD screenshot rather than an illustration: real cylindrical
shading, a single light, a tight specular, and hard silhouettes.

It is a renderer rather than a drawing because the parts have to be lit
consistently with each other and re-renderable at any size — and because a
hand-drawn vector rocket is the exact thing this project keeps rejecting.

Run: python scripts/render_vehicle.py
"""

from pathlib import Path
import json
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "rocket"
OUT.mkdir(parents=True, exist_ok=True)

# --- scale -----------------------------------------------------------------
# One unit is one body diameter. The airframe is ~7.8 diameters long, which is
# the proportion of the real matted photograph the hero flies.
PX = 150            # pixels per diameter, before downsampling
SS = 3              # supersample factor for edge quality
R = PX / 2

# --- palette: ARC brand, read as anodised metal ----------------------------
STEEL = np.array([0.735, 0.755, 0.775])
NAVY = np.array([0.067, 0.239, 0.333])
RED = np.array([0.706, 0.125, 0.145])
SKY = np.array([0.49, 0.706, 0.82])
GRAPHITE = np.array([0.16, 0.175, 0.19])

# a single key light, high and slightly toward the viewer
LIGHT = np.array([0.0, -0.62, 0.78])
LIGHT /= np.linalg.norm(LIGHT)
VIEW = np.array([0.0, 0.0, 1.0])
HALF = LIGHT + VIEW
HALF /= np.linalg.norm(HALF)


def shade(ny, nz, base, shininess=18.0, spec_strength=0.22):
    """Lambert + Blinn-Phong for a surface whose normal has no x component."""
    diffuse = np.clip(ny * LIGHT[1] + nz * LIGHT[2], 0, 1)
    spec = np.clip(ny * HALF[1] + nz * HALF[2], 0, 1) ** shininess
    col = base[None, None, :] * (0.34 + 0.72 * diffuse)[..., None]
    col = col + spec[..., None] * spec_strength
    # a darker line where the surface turns away, which is what reads as round
    col *= (0.62 + 0.38 * np.clip(nz, 0, 1))[..., None]
    return col


def cylinder(length_u, radius_fn, bands=(), base=STEEL, shininess=18.0):
    """
    Render one axial section. `radius_fn` takes x in [0,1] and returns the radius
    as a fraction of R. `bands` are (start, end, colour) in the same x space.
    """
    W = int(round(length_u * PX)) * SS
    H = int(round(PX)) * SS + 2
    xs = (np.arange(W) + 0.5) / W
    ys = (np.arange(H) + 0.5) - H / 2.0

    rad = np.clip(radius_fn(xs), 1e-4, None) * R * SS
    radg = rad[None, :]
    yg = ys[:, None]

    # fractional coverage at the silhouette, which is where aliasing shows
    dist = np.abs(yg)
    cover = np.clip(radg - dist + 0.5, 0, 1)

    ny = np.clip(yg / np.maximum(radg, 1e-6), -1, 1)
    nz = np.sqrt(np.clip(1 - ny * ny, 0, 1))

    colour = np.repeat(base[None, :], W, axis=0)
    for start, end, band_colour in bands:
        m = (xs >= start) & (xs < end)
        colour[m] = band_colour

    rgb = shade(ny, nz, np.array([1.0, 1.0, 1.0]), shininess)
    rgb = rgb * colour[None, :, :]
    rgba = np.dstack([np.clip(rgb, 0, 1) * 255, cover * 255])
    return Image.fromarray(rgba.astype(np.uint8), "RGBA")


def fin_can(length_u):
    """Body tube, three swept fins seen edge-on and in plan, and the nozzle."""
    W = int(round(length_u * PX)) * SS
    span = int(round(1.52 * PX)) * SS         # fin tip to fin tip
    H = span + 2
    canvas = np.zeros((H, W, 4), dtype=np.float32)

    xs = (np.arange(W) + 0.5) / W
    ys = (np.arange(H) + 0.5) - H / 2.0
    yg = ys[:, None]

    # --- fins: a swept trapezoid mirrored above and below the axis ----------
    root_start, root_end = 0.2, 0.95
    tip_start, tip_end = 0.68, 0.99
    half_body = R * SS
    tip = span / 2.0

    for sign in (1, -1):
        # leading and trailing edge as functions of the distance out from the body
        t = np.clip((np.abs(yg) - half_body) / max(tip - half_body, 1e-6), 0, 1)
        lead = root_start + (tip_start - root_start) * t
        trail = root_end + (tip_end - root_end) * t
        inside = (
            (xs[None, :] >= lead)
            & (xs[None, :] <= trail)
            & (np.sign(yg) == sign)
            & (np.abs(yg) >= half_body * 0.72)
            & (np.abs(yg) <= tip)
        )
        # fins are flat, so they take a constant tone with a slight taper out
        shade_f = 0.62 - 0.18 * t                      # (H, 1)
        col = NAVY[None, None, :] * (0.55 + shade_f)[..., None]
        canvas[..., :3] = np.where(inside[..., None], col, canvas[..., :3])
        canvas[..., 3] = np.where(inside, 1.0, canvas[..., 3])

    # --- body over the fin roots -------------------------------------------
    body = cylinder(
        length_u,
        lambda x: np.ones_like(x),
        bands=((0.0, 0.06, SKY), (0.93, 1.0, GRAPHITE)),
    )
    body_arr = np.asarray(body).astype(np.float32) / 255.0
    bh = body_arr.shape[0]
    y0 = (H - bh) // 2
    region = canvas[y0:y0 + bh]
    a = body_arr[..., 3:4]
    region[..., :3] = region[..., :3] * (1 - a) + body_arr[..., :3] * a
    region[..., 3] = np.clip(region[..., 3] + body_arr[..., 3], 0, 1)

    return Image.fromarray((np.clip(canvas, 0, 1) * 255).astype(np.uint8), "RGBA")


def ogive(x):
    """Tangent-ogive-ish nose profile — pointed, not conical."""
    return np.clip(x, 0, 1) ** 0.62


PARTS = [
    ("nose", 1.75, lambda: cylinder(1.75, ogive, bands=((0.88, 1.0, RED),), shininess=26)),
    ("payload", 1.35, lambda: cylinder(
        1.35, lambda x: np.ones_like(x),
        bands=((0.0, 0.07, GRAPHITE), (0.07, 0.93, NAVY), (0.93, 1.0, GRAPHITE)),
    )),
    ("body", 1.7, lambda: cylinder(
        1.7, lambda x: np.ones_like(x), bands=((0.44, 0.5, RED),),
    )),
    ("recovery", 1.35, lambda: cylinder(
        1.35, lambda x: np.ones_like(x),
        bands=((0.0, 0.06, SKY), (0.88, 1.0, GRAPHITE)),
    )),
    ("fincan", 1.65, lambda: fin_can(1.65)),
]


def main():
    manifest = []
    total = sum(p[1] for p in PARTS)
    for name, length_u, render in PARTS:
        img = render()
        w, h = img.size
        img = img.resize((w // SS, h // SS), Image.LANCZOS)
        img.save(OUT / f"cad-{name}.png")
        manifest.append(
            {
                "id": name,
                "lengthUnits": round(length_u, 3),
                "share": round(length_u / total, 4),
                "width": img.size[0],
                "height": img.size[1],
                # Width measured in body diameters. The layout must scale parts
                # by this and not by width/height: the fin can's image is taller
                # than a diameter because the fins stick out past the tube, so
                # sizing it by aspect shrinks its body against every other part.
                "widthDiameters": round(img.size[0] / PX, 4),
                "heightDiameters": round(img.size[1] / PX, 4),
            }
        )
    (OUT / "rocket.json").write_text(json.dumps(manifest, indent=2))
    print(f"rendered {len(manifest)} parts, {total:.2f} diameters long")
    for m in manifest:
        print(f"  {m['id']:9s} {m['width']}x{m['height']}  w={m['widthDiameters']}d h={m['heightDiameters']}d")


if __name__ == "__main__":
    main()
