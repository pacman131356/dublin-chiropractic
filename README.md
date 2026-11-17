# Dublin Family Chiropractic website

Static site for Dublin Family Chiropractic (Dublin, OH): plain HTML, CSS and JavaScript with no build step.

## Pages
- `index.html`: home (about, services, new patient center, insurance, testimonial, FAQ, contact, online payment)
- `shock-wave-therapy/`: Focused Shock Wave Therapy
- `faq/`, `our-services/`, `insurance-list/`, `make-a-payment-online/`: redirects from the old site's addresses to the matching home-page section

## Preview locally
Open `index.html` in a browser, or run `python3 -m http.server` in this folder.

## Deploy
Netlify reads `netlify.toml` (publish directory is the repo root).

## Before going live on dublinfamilychiropractic.com
- Remove the `X-Robots-Tag = "noindex"` header block in `netlify.toml`.
- Photos and patient-form PDFs are still served from GoDaddy (`img1.wsimg.com`). Download them into `assets/` and update the links before cancelling GoDaddy.
