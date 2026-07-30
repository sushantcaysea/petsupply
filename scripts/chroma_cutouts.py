from PIL import Image
import os

pairs = [
    (
        r"C:\Users\Asus\.cursor\projects\c-Users-Asus-Desktop-pet\assets\scroll-chew-large-v2.png",
        r"C:\Users\Asus\Desktop\pet\public\images\scroll\chew-large.png",
    ),
    (
        r"C:\Users\Asus\.cursor\projects\c-Users-Asus-Desktop-pet\assets\scroll-chew-medium-v2.png",
        r"C:\Users\Asus\Desktop\pet\public\images\scroll\chew-medium.png",
    ),
    (
        r"C:\Users\Asus\.cursor\projects\c-Users-Asus-Desktop-pet\assets\scroll-chew-xlarge.png",
        r"C:\Users\Asus\Desktop\pet\public\images\scroll\chew-xlarge.png",
    ),
    (
        r"C:\Users\Asus\.cursor\projects\c-Users-Asus-Desktop-pet\assets\scroll-chew-stack.png",
        r"C:\Users\Asus\Desktop\pet\public\images\scroll\chew-stack.png",
    ),
]


def is_bg(r, g, b):
    if g > 90 and g >= r + 25 and g >= b + 15:
        return True
    if g > 140 and r > 100 and b < 120 and g >= r - 10:
        return True
    if g > 180 and r > 150 and b > 80 and abs(r - g) < 60 and b < r:
        return True
    return False


for src, dst in pairs:
    im = Image.open(src).convert("RGBA")
    pixels = im.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = pixels[x, y]
            if is_bg(r, g, b):
                pixels[x, y] = (0, 0, 0, 0)
            elif g > r + 20 and g > b + 20:
                nr = min(255, int(r * 1.05))
                ng = max(0, int(g * 0.85))
                nb = min(255, int(b * 1.05))
                pixels[x, y] = (nr, ng, nb, a)

    bbox = im.getbbox()
    if bbox:
        im = im.crop(bbox)
        pad = 24
        canvas = Image.new("RGBA", (im.width + pad * 2, im.height + pad * 2), (0, 0, 0, 0))
        canvas.paste(im, (pad, pad), im)
        im = canvas

    os.makedirs(os.path.dirname(dst), exist_ok=True)
    im.save(dst, "PNG")
    print("saved", dst, im.size)
