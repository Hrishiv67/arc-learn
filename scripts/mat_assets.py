"""
ARC Learn hero — asset pipeline.

Decomposes one real photograph of a high-power competition rocket launch into
the animatable layers the hero needs: a clean "waiting" plate, the airframe,
the exhaust plume, and a set of photographic smoke puffs.

Everything comes out of a single frame, so lighting, perspective, grain and
white balance match across every layer by construction.

Source: "Backlit Beauty" (Wikimedia Commons, CC BY 2.0)
Run:    python scripts/mat_assets.py
"""

from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "src"
OUT = ROOT / "public" / "hero"
WORK = ROOT / "assets" / "work"
for d in (OUT, WORK):
    d.mkdir(parents=True, exist_ok=True)

# --- measured geometry of the source frame (3041 x 3272) -------------------
ROCKET = dict(x0=1424, x1=1590, y0=100, y1=1395)   # airframe, nose to fin root
FLAME = dict(x0=1395, x1=1700, y0=1360, y1=2290)   # visible plume above smoke
SMOKE_REGION = dict(x0=800, x1=2980, y0=2290, y1=2930)   # sampling: dense cloud only
SMOKE_CLEAN = dict(x0=780, x1=3000, y0=2170, y1=2930)    # cleaning: include the treeline
POWERLINE = dict(y0=1900, y1=2200)                  # wires + pole across sky
TREELINE_Y = 2255                                   # horizon


def load():
    return np.asarray(Image.open(SRC / "backlit.jpg").convert("RGB")).astype(np.float32)


def lum(a):
    return 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]


def sky_model(a):
    """Per-row sky colour, sampled away from the rocket, plume and pole."""
    H, W, _ = a.shape
    cols = np.r_[np.arange(150, 700), np.arange(1850, 2600)]
    rows = np.median(a[:, cols, :], axis=1)             # (H,3)
    # smooth vertically so wires/birds can't bias a row
    k = 61
    pad = np.pad(rows, ((k // 2, k // 2), (0, 0)), mode="edge")
    ker = np.ones(k) / k
    sm = np.stack([np.convolve(pad[:, c], ker, mode="valid") for c in range(3)], axis=1)
    return sm[:H]


def recentre(img):
    """
    Shift a sprite so its alpha centroid sits on the image's centre line.

    The airframe and the plume were matted from different crops of the source
    frame, so their centres of mass sat 27px apart. Drawn at the same pad
    position that put the exhaust visibly off the vehicle's axis — the launch
    read as smeared rather than symmetric. Centring each sprite on its own mass
    means "image centre" is the vehicle axis for all of them.
    """
    a = np.asarray(img).astype(np.float32)
    alpha = a[..., 3]
    if alpha.sum() <= 0:
        return img
    xs = np.arange(a.shape[1])
    cx = float((xs * alpha.sum(axis=0)).sum() / alpha.sum())
    shift = int(round(a.shape[1] / 2 - cx))
    if shift == 0:
        return img
    pad = abs(shift) * 2
    out = np.zeros((a.shape[0], a.shape[1] + pad, 4), dtype=np.float32)
    x0 = pad // 2 + shift
    out[:, x0:x0 + a.shape[1], :] = a
    return Image.fromarray(out.astype(np.uint8), "RGBA")


def unmix(obs, bg, alpha):
    """Recover foreground colour given observed = a*F + (1-a)*BG."""
    a = np.clip(alpha, 1e-3, 1.0)[..., None]
    f = (obs - (1 - a) * bg) / a
    return np.clip(f, 0, 255)


# ---------------------------------------------------------------- airframe
def mat_rocket(a, sky):
    r = ROCKET
    sub = a[r["y0"]:r["y1"], r["x0"]:r["x1"]]
    bg = np.broadcast_to(sky[r["y0"]:r["y1"], None, :], sub.shape)
    L, Lb = lum(sub), lum(bg)
    # the airframe is far darker than the overcast sky behind it
    alpha = np.clip((Lb - L) / 105.0, 0, 1)
    alpha = np.asarray(
        Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6)),
        dtype=np.float32,
    ) / 255.0
    alpha[alpha < 0.06] = 0.0
    # the last few rows are plume, not airframe — trim so the sprite ends at the fins
    alpha[-26:, :] = 0.0
    rgb = unmix(sub, bg, alpha)

    # match the plate's grade, or the airframe reads as a colour cut-out pasted
    # onto a monochrome frame
    g = rgb / 255.0
    Lg = (0.299 * g[..., 0] + 0.587 * g[..., 1] + 0.114 * g[..., 2])[..., None]
    g = g * 0.34 + Lg * 0.66
    g = g * np.array([0.94, 0.99, 1.06])
    g = np.clip((g - 0.5) * 1.12 + 0.5, 0, 1) * 0.88
    rgb = g * 255

    out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    recentre(Image.fromarray(out, "RGBA")).save(OUT / "rocket.png")
    return alpha


# ------------------------------------------------------------------- plume
def mat_flame(a, sky):
    f = FLAME
    sub = a[f["y0"]:f["y1"], f["x0"]:f["x1"]]
    bg = np.broadcast_to(sky[f["y0"]:f["y1"], None, :], sub.shape)
    # plume is a saturated magenta/orange core against neutral sky
    chroma = np.abs(sub - bg).max(axis=2)
    hot = np.clip((sub[..., 0] - sub[..., 1] - 10) / 60.0, 0, 1)
    alpha = np.clip(np.maximum(chroma / 70.0, hot), 0, 1)
    alpha = np.asarray(
        Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2)),
        dtype=np.float32,
    ) / 255.0
    alpha[alpha < 0.08] = 0.0
    rgb = unmix(sub, bg, alpha)
    # The source plume is backlit, which reads magenta. Scaled down into the
    # composite that looks like a cartoon flame, so pull it toward the
    # white-amber a composite motor actually burns.
    g = rgb / 255.0
    Lf = (0.299 * g[..., 0] + 0.587 * g[..., 1] + 0.114 * g[..., 2])[..., None]
    g = g * 0.32 + Lf * 0.68
    g = g * np.array([1.16, 1.02, 0.86])              # amber, not pink
    core = np.clip((Lf - 0.45) / 0.4, 0, 1)           # hottest part goes white
    g = g * (1 - core) + np.clip(g + 0.42, 0, 1.25) * core
    rgb = np.clip(g, 0, 1) * 255
    out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    recentre(Image.fromarray(out, "RGBA")).save(OUT / "flame.png")


# ------------------------------------------------------------------- smoke
def mat_smoke(a):
    """Cut photographic puffs from the pad cloud, radially feathered to tile."""
    s = SMOKE_REGION
    sub = a[s["y0"]:s["y1"], s["x0"]:s["x1"]]
    L = lum(sub)
    sat = sub.max(axis=2) - sub.min(axis=2)
    # smoke reads bright and desaturated against the dark green crop
    dens = np.clip((L - 120) / 95.0, 0, 1) * np.clip(1 - (sat - 18) / 45.0, 0, 1)

    H, W = dens.shape
    # Find the densest non-overlapping windows rather than guessing coordinates —
    # hand-picked tiles landed on thin wisps and matted out to almost nothing.
    size = 460
    step = 60
    cand = []
    for py in range(0, H - size, step):
        for px in range(0, W - size, step):
            cand.append((float(dens[py:py + size, px:px + size].mean()), px, py))
    cand.sort(reverse=True)

    chosen = []
    for score, px, py in cand:
        if score < 0.18:
            break
        if any(abs(px - qx) < size * 0.55 and abs(py - qy) < size * 0.55 for qx, qy in chosen):
            continue
        # reject tiles carrying dark field or debris through the matte
        w = dens[py:py + size, px:px + size]
        if (lum(sub[py:py + size, px:px + size]) * w).sum() / max(w.sum(), 1) < 150:
            continue
        chosen.append((px, py))
        if len(chosen) == 8:
            break

    n = 0
    for (px, py) in chosen:
        tile = sub[py:py + size, px:px + size]
        d = dens[py:py + size, px:px + size].copy()
        # gentle radial feather: enough to kill the square edge, not the puff
        yy, xx = np.mgrid[0:size, 0:size]
        c = (size - 1) / 2.0
        rad = np.sqrt((xx - c) ** 2 + (yy - c) ** 2) / c
        d *= np.clip(1.55 - rad * 1.45, 0, 1) ** 0.9
        d = np.clip(d * 1.5, 0, 1)
        d = np.asarray(
            Image.fromarray((d * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(size / 70)),
            dtype=np.float32,
        ) / 255.0
        rgb = tile / 255.0
        Ls = (0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2])[..., None]
        rgb = rgb * 0.22 + Ls * 0.78                     # smoke is neutral, not pink
        rgb = np.clip(rgb * 0.88 + 0.04, 0, 1) * np.array([0.98, 1.0, 1.03])
        rgb = np.clip(rgb, 0, 1) * 255
        img = Image.fromarray(np.dstack([rgb, d * 255]).astype(np.uint8), "RGBA")
        img = img.resize((256, 256), Image.LANCZOS)
        n += 1
        img.save(OUT / f"smoke-{n:02d}.png")
    return n


# ------------------------------------------------------------------- plate
def clean_plate(a, sky):
    """Remove rocket, plume, wires and pad smoke to get the 'waiting' frame."""
    p = a.copy()
    H, W, _ = p.shape
    rng = np.random.default_rng(7)
    sky_h = TREELINE_Y - 6                                # everything above is sky

    def sky_plate(y0, y1, x0, x1):
        """Sky model + matched grain for a region."""
        band = np.broadcast_to(sky[y0:y1, None, :], (y1 - y0, x1 - x0, 3)).copy()
        return np.clip(band + rng.normal(0, 1.7, band.shape), 0, 255)

    def feather(x0, x1, y0, y1, b=60):
        """Blend the two vertical seams of a replaced band into their surroundings."""
        for sx in (x0, x1):
            a0, a1 = max(0, sx - b), min(W, sx + b)
            if a1 - a0 < 4:
                continue
            seg = p[y0:y1, a0:a1, :]
            blur = np.asarray(
                Image.fromarray(seg.astype(np.uint8)).filter(ImageFilter.GaussianBlur(7)),
                dtype=np.float32,
            )
            w = (1 - np.abs(np.linspace(-1, 1, a1 - a0)))[None, :, None]
            p[y0:y1, a0:a1, :] = seg * (1 - w) + blur * w

    # 1. rocket + plume column, from the top of frame down to the treeline
    rx0, rx1 = ROCKET["x0"] - 16, FLAME["x1"] + 16
    p[0:sky_h, rx0:rx1, :] = sky_plate(0, sky_h, rx0, rx1)
    feather(rx0, rx1, 0, sky_h, b=75)

    # 2. wires, poles, birds: anything in the sky meaningfully darker than the model
    band = p[0:sky_h, :, :]
    model = np.broadcast_to(sky[0:sky_h, None, :], band.shape)
    d = np.clip((lum(model) - lum(band)) / 26.0, 0, 1)
    d = np.asarray(
        Image.fromarray((d * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(5)),
        dtype=np.float32,
    ) / 255.0
    d = np.asarray(
        Image.fromarray((d * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2.5)),
        dtype=np.float32,
    ) / 255.0
    d = np.clip(d * 1.6, 0, 1)[..., None]
    p[0:sky_h, :, :] = band * (1 - d) + sky_plate(0, sky_h, 0, W) * d

    # pad smoke: rebuild treeline + field by mirroring clean texture from the left
    s = SMOKE_CLEAN
    src_w = s["x0"]
    for y in range(s["y0"], min(s["y1"], H)):
        row_src = p[y, 0:src_w, :]
        reps = int(np.ceil((s["x1"] - s["x0"]) / src_w)) + 1
        tiled = np.concatenate(
            [row_src if i % 2 == 0 else row_src[::-1] for i in range(reps)], axis=0
        )[: s["x1"] - s["x0"]]
        p[y, s["x0"]:s["x1"], :] = tiled
    # feather the two vertical seams
    for sx in (s["x0"], s["x1"]):
        b = 90
        x0, x1 = max(0, sx - b), min(W, sx + b)
        seg = p[s["y0"]:s["y1"], x0:x1, :]
        blur = np.asarray(
            Image.fromarray(seg.astype(np.uint8)).filter(ImageFilter.GaussianBlur(9)),
            dtype=np.float32,
        )
        w = 1 - np.abs(np.linspace(-1, 1, x1 - x0))[None, :, None]
        p[s["y0"]:s["y1"], x0:x1, :] = seg * (1 - w * 0.85) + blur * (w * 0.85)
    return p


def replace_sky(p):
    """
    Swap in the sky from the real ARC national-finals frame.

    The launch photo has the right camera (low and close, so the vehicle towers
    over the horizon) but a featureless overcast sky. The finals photo has real
    cumulus depth and scale but a standing-height camera. Both horizons are flat
    and level, so the skies are interchangeable — this takes the atmosphere from
    one and the geometry from the other.

    Source: Defense.gov 070519-D-7203T-003 (public domain)
    """
    H, W, _ = p.shape
    s = np.asarray(Image.open(SRC / "plate-field.jpg").convert("RGB")).astype(np.float32)
    SH, SW, _ = s.shape
    S_HORIZON = 1990

    # The finals frame has its own launch in it, trail included, at x≈2377-2473.
    # Rather than inpaint it — every repair left either a seam or a smear — take a
    # band of sky that simply never contains it. Using the lower band and scaling
    # up puts the trail far outside the crop window, and costs nothing: the
    # graduated ND below manufactures the dark zenith anyway.
    S_TOP = 560
    sky_h = TREELINE_Y
    scale = sky_h / (S_HORIZON - S_TOP)
    nw = int(round(SW * scale))
    sky = Image.fromarray(s[S_TOP:S_HORIZON].astype(np.uint8)).resize((nw, sky_h), Image.LANCZOS)
    sky = np.asarray(sky).astype(np.float32)[:, 0:W, :]
    assert 2377 * scale > W, "crop window must exclude the source frame's own trail"
    if sky.shape[1] < W:
        sky = np.pad(sky, ((0, 0), (0, W - sky.shape[1]), (0, 0)), mode="edge")

    # blend the last stretch into the existing haze so the treeline still sits in air
    out = p.copy()
    blend_h = 190
    out[0:sky_h - blend_h, :, :] = sky[0:sky_h - blend_h]
    t = np.linspace(0, 1, blend_h)[:, None, None]
    out[sky_h - blend_h:sky_h, :, :] = (
        sky[sky_h - blend_h:sky_h] * (1 - t) + p[sky_h - blend_h:sky_h] * t
    )
    return out


def regrade(p):
    """
    Photographic grade, not a synthetic sky.

    The source is flat, bright overcast — there is no hidden blue to recover, so
    faking a polarised gradient reads as CGI. Instead this applies what a stills
    photographer would: a graduated ND from the top, a cool silver cast, an S-curve,
    and a held-back foreground. All original texture survives.
    """
    H, W, _ = p.shape
    out = p / 255.0
    y = np.linspace(0, 1, H)[:, None, None]
    hz = TREELINE_Y / H

    # 1. polariser — deepen blue sky hard while leaving cloud highlights alone.
    #    This is the single move that makes a daylight frame read as cinematic.
    mx = out.max(axis=2)[..., None]
    mn = out.min(axis=2)[..., None]
    blueness = np.clip((out[..., 2:3] - (out[..., 0:1] + out[..., 1:2]) / 2) * 3.2, 0, 1)
    sat = np.clip((mx - mn) * 2.6, 0, 1)
    sky_sel = np.clip(blueness * sat, 0, 1) * (y < hz)
    out = out * (1 - sky_sel * 0.62)

    # 2. graduated ND — strongest at the top, feathered out well before the
    #    horizon so there is no edge anywhere in the frame.
    grad = np.clip(y / (hz * 0.98), 0, 1) ** 0.85
    nd = 0.46 + 0.54 * grad                         # 0.46 at zenith -> 1.0 at horizon
    out = out * nd

    # 3. cool the shadows, hold the highlights close to neutral silver
    L = (0.299 * out[..., 0] + 0.587 * out[..., 1] + 0.114 * out[..., 2])[..., None]
    cool = np.array([0.90, 0.975, 1.10])
    warm = np.array([1.03, 1.0, 0.98])
    out = out * (cool * (1 - L) + warm * L)

    # 4. desaturate — the natural colour underneath is kept, but quietly
    Lg = (0.299 * out[..., 0] + 0.587 * out[..., 1] + 0.114 * out[..., 2])[..., None]
    out = out * 0.26 + Lg * 0.74

    # 5. ARC navy grade. The brand carried by the photograph itself rather than
    #    a tint laid over it: shadows resolve to navy-800, midtones to ARC navy
    #    #113d55, highlights stay clean so cloud structure survives.
    Ln = np.clip((0.299 * out[..., 0] + 0.587 * out[..., 1] + 0.114 * out[..., 2]), 0, 1)[..., None]
    shadow = np.array([0.031, 0.114, 0.161])   # #081d29
    midn = np.array([0.067, 0.239, 0.333])     # #113d55
    high = np.array([0.949, 0.957, 0.961])
    lo = shadow + (midn - shadow) * np.clip(Ln / 0.46, 0, 1)
    hi = midn + (high - midn) * np.clip((Ln - 0.46) / 0.54, 0, 1)
    ramp = np.where(Ln < 0.46, lo, hi)
    out = out * 0.45 + ramp * 0.55

    # 4. filmic S-curve, lifted toe so the ground keeps detail rather than crushing
    out = np.clip(out, 0, 1)
    out = out * out * (3 - 2 * out)                 # smoothstep contrast
    out = out * 0.94 + 0.035

    # 6. ground: hold it back a stop and cool it, no hard mask — a soft ramp only
    gm = np.clip((y - hz + 0.02) / 0.06, 0, 1)
    out = out * (1 - gm * 0.30)
    out = out * (1 - gm * 0.16 * np.clip((y - hz) / (1 - hz), 0, 1))

    # 7. vignette + grain
    yy, xx = np.mgrid[0:H, 0:W]
    r = np.sqrt(((xx / W - 0.5) * 1.02) ** 2 + ((yy / H - 0.5) * 0.95) ** 2)
    out = out * np.clip(1.04 - r * 0.42, 0, 1)[..., None]
    out = out + np.random.default_rng(3).normal(0, 0.0042, out.shape)
    return np.clip(out, 0, 1) * 255


# --------------------------------------------------------------- sections
# The airframe cut into the sections a real vehicle is built from. A Y-slice of
# a silhouette *is* a rocket section, so the parts stay photographic and stay
# consistent with the whole vehicle in the hero — no redrawing, no second style.
#
# Fractions are nose-to-tail on the matted sprite, and each carries the module
# that teaches it.
SECTIONS = [
    ("nose", 0.000, 0.180, "Nose cone"),
    ("payload", 0.180, 0.360, "Payload bay"),
    ("body-upper", 0.360, 0.570, "Body tube"),
    ("body-lower", 0.570, 0.775, "Recovery bay"),
    ("fincan", 0.775, 1.000, "Fin can and motor"),
]


def slice_sections():
    """Cut rocket.png into stackable section sprites plus a placement manifest."""
    import json

    img = Image.open(OUT / "rocket.png")
    W, H = img.size

    # The hero's airframe is graded for a bright sky, which leaves it nearly
    # black. On the dark shell of the exploded view that reads as nothing at all,
    # so the sections get their own grade: the same photograph, its luminance
    # range remapped as if lit against a dark studio backdrop. Real surface
    # variation survives — this is an exposure change, not a repaint.
    arr = np.asarray(img).astype(np.float32)
    rgb, alpha = arr[..., :3] / 255.0, arr[..., 3:4] / 255.0
    body = alpha[..., 0] > 0.5
    if body.any():
        lum_body = (0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2])[body]
        lo, hi = float(np.percentile(lum_body, 2)), float(np.percentile(lum_body, 98))
        if hi - lo > 1e-3:
            rgb = (rgb - lo) / (hi - lo)
    rgb = np.clip(rgb, 0, 1)
    rgb = 0.20 + rgb * 0.58                      # target range on the shell
    rgb = rgb * np.array([0.95, 0.99, 1.06])     # a touch of steel
    arr = np.dstack([np.clip(rgb, 0, 1) * 255, alpha[..., 0] * 255])
    img = Image.fromarray(arr.astype(np.uint8), "RGBA")

    manifest = []

    for name, f0, f1, label in SECTIONS:
        y0, y1 = int(round(f0 * H)), int(round(f1 * H))
        part = img.crop((0, y0, W, y1))

        # soften the cut edges very slightly so a stacked vehicle reads as one
        # object rather than five pasted rectangles
        a = np.asarray(part).astype(np.float32)
        fade = 3
        if f0 > 0:
            a[:fade, :, 3] *= np.linspace(0.35, 1, fade)[:, None]
        if f1 < 1:
            a[-fade:, :, 3] *= np.linspace(1, 0.35, fade)[:, None]
        Image.fromarray(a.astype(np.uint8), "RGBA").save(OUT / f"section-{name}.png")

        manifest.append(
            {
                "id": name,
                "label": label,
                "top": round(f0, 4),
                "height": round(f1 - f0, 4),
                "width": W,
                "pixelHeight": y1 - y0,
            }
        )

    (OUT / "sections.json").write_text(json.dumps(manifest, indent=2))
    return len(manifest)


def main():
    a = load()
    sky = sky_model(a)

    mat_rocket(a, sky)
    mat_flame(a, sky)
    n = mat_smoke(a)

    plate = clean_plate(a, sky)
    Image.fromarray(plate.astype(np.uint8)).save(WORK / "plate-clean.jpg", quality=92)

    plate = replace_sky(plate)
    Image.fromarray(plate.astype(np.uint8)).save(WORK / "plate-sky.jpg", quality=92)

    graded = regrade(plate)
    # crop to a cinematic 16:9 with the horizon at ~0.71
    H, W, _ = graded.shape
    ch = int(W * 9 / 16)
    top = int(TREELINE_Y - ch * 0.71)
    top = max(0, min(top, H - ch))
    frame = graded[top:top + ch, :, :].astype(np.uint8)
    img = Image.fromarray(frame)
    img.save(WORK / "plate-graded.jpg", quality=92)
    img.resize((2560, int(2560 * ch / W)), Image.LANCZOS).save(OUT / "plate.jpg", quality=88)
    img.resize((1280, int(1280 * ch / W)), Image.LANCZOS).save(OUT / "plate-sm.jpg", quality=86)

    print(f"plate {img.size}  horizon_frac={(TREELINE_Y - top) / ch:.3f}  smoke_tiles={n}")


if __name__ == "__main__":
    main()
