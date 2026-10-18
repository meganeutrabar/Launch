# MegaNeutraBar — Coming Soon

Static launch page. Plain HTML/CSS/JS, no build step.

```
index.html   style.css   script.js   assets/{logo.png, og-image.jpg, favicon.svg}
```

- Launch target: `2026-10-21T10:00:00+05:00` (set in `script.js`, line 4)
- Preview the launched state: `index.html?preview=live`

## Swapping the brand files

| What | How |
|---|---|
| Logo | Replace `assets/logo.png` (transparent PNG, ~400x60). Then in `index.html` delete the `<h1 class="brand">` line and uncomment the `<img class="logo">` line above it. |
| Share image | Replace `assets/og-image.jpg` (1200x630 JPG, under ~300 KB). |
| Favicon | Replace `assets/favicon.svg`, or drop in a `favicon.png` and point the two `<link rel="icon">` tags at it. |

After going live, set `og:url` and `og:image` in `index.html` to full `https://...` URLs — WhatsApp will not show the preview image from a relative path.
