# KHOSHA website

Static site for Khosha by Desired Mill, Faisalabad. No build step: deploy the folder as is (Vercel, Netlify, any static host).

- `index.html` home with the 3D pouch carousel (three.js, self-hosted in `js/vendor`)
- `shop.html`, `product.html#<id>`, `story.html`, `order.html`
- Product data, prices, bundles and the WhatsApp number: `js/data.js`
- Pouch textures: `assets/tex/`

To edit page markup, change `src/*.html` and run `python3 src/build.py` (it injects `src/_head.html`).
