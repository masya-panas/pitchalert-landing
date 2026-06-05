# PitchAlert Landing Site

Static marketing site for PitchAlert — hosted on GitHub Pages.
Used for Paddle merchant verification and as the Privacy Policy host for the Chrome Web Store.

---

## Before deploying: replace all placeholders

Search the entire `landing/` folder for each token below and replace with the real value.

| Token | Where it appears | What to put |
|---|---|---|
| `__DOMAIN__` | `CNAME` | Your custom domain, e.g. `pitchalert.app` |
| `__STORE_URL__` | `index.html`, `privacy.html`, `terms.html`, `refund.html` | Full Chrome Web Store listing URL, e.g. `https://chromewebstore.google.com/detail/pitchalert/...` |
| `__PADDLE_CHECKOUT_URL__` | `index.html` | Paddle checkout link for the Pro product |
| `__CONTACT_EMAIL__` | `index.html`, `privacy.html`, `terms.html`, `refund.html` | Support email address, e.g. `support@pitchalert.app` |
| `__JURISDICTION__` | `terms.html` (2 occurrences) | Governing-law jurisdiction, e.g. `England and Wales` or `the State of Delaware, USA` |

---

## Assets to copy before deploying

The fonts and logo are NOT included in the `landing/` folder (they live in the extension
`assets/` tree). Copy them before you push:

```
# Fonts (from extension root)
cp assets/fonts/poppins-600.woff2  landing/assets/fonts/
cp assets/fonts/poppins-700.woff2  landing/assets/fonts/
cp assets/fonts/inter-400.woff2    landing/assets/fonts/
cp assets/fonts/inter-500.woff2    landing/assets/fonts/

# Logo
cp assets/logo/mark.png            landing/assets/logo/

# Screenshots
cp store/screenshots/cws-1280x800/1.png  landing/assets/screenshots/
cp store/screenshots/cws-1280x800/2.png  landing/assets/screenshots/
cp store/screenshots/cws-1280x800/4.png  landing/assets/screenshots/
```

---

## How to deploy to GitHub Pages

1. Create a new public GitHub repository (e.g. `pitchalert-landing`).
2. Copy the entire `landing/` folder contents into the repository root (so `index.html`
   is at the repo root, not inside a sub-folder).
3. Push to the `main` branch.
4. In the repository Settings → Pages:
   - Source: "Deploy from a branch", branch `main`, folder `/` (root).
5. (Optional) Add a custom domain:
   - The `CNAME` file already contains your domain — just make sure DNS is configured.
   - At your DNS provider, add a CNAME record pointing `www.yourdomain.com` → `<username>.github.io`
     (or an A record for the apex domain; see GitHub Pages docs for current IPs).
   - Enable "Enforce HTTPS" in the Pages settings once DNS has propagated.
6. The Privacy Policy URL to paste into the Chrome Web Store and Paddle is:
   `https://__DOMAIN__/privacy.html`

---

## File structure

```
landing/
  index.html          — main landing page
  privacy.html        — Privacy Policy (required for CWS and Paddle)
  terms.html          — Terms of Service (required for Paddle)
  refund.html         — Refund Policy (required for Paddle)
  CNAME               — GitHub Pages custom domain file
  README.md           — this file
  assets/
    css/
      style.css       — all styles (self-contained, no CDN)
    js/
      faq.js          — FAQ accordion (vanilla JS)
    fonts/            — copy woff2 files here (see above)
    logo/             — copy mark.png here
    screenshots/      — copy 1.png, 2.png, 4.png here
```
