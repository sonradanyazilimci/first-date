# First Date Invitation 💌 ("İlk Randevu Daveti")

A single-page, no-backend "will you go on a date with me?" invitation. The sender picks an invitation type and color theme, fills in their name and WhatsApp number, gets a personal link, and sends it to the person they like. The recipient answers a playful question (the "No" button runs away), then plans the day/time/place together. A ticket is generated — with a live countdown, a downloadable image, and a QR code — and can be sent straight back to the sender on WhatsApp.

**Everything — HTML, CSS, and JS — lives in the single `index.html` file.** No build step, no server. Open it directly as a local file (double-click it) or upload it to any static host; both work identically since the app makes no server calls. Two small libraries are still loaded from a CDN for the QR code and the ticket-image download (see "Dependencies" below) — those need an internet connection, everything else works fully offline.

## Files

- `index.html` — the entire app: markup for all six screens, all CSS (inline `<style>`), and all JS (inline `<script>`) — screen flow, confetti, the escaping "No" button, date/time/place pickers, WhatsApp links, sound effects, QR code, ticket download, countdown, and the translation system
- `og-image.svg` — social-preview image used by the `og:image`/`twitter:image` meta tags (only matters when hosted on a URL that gets shared — irrelevant when used as a local file)
- `instagram-post.txt` — sample marketing copy (Turkish)

## Using it as a single file vs. hosting it

- **As a file**: just open `index.html` directly in a browser (double-click, or drag into a browser window). The setup screen, link generation, and the full question/plan/ticket flow all work — the only caveat is that a link generated this way starts with `file:///...`, which only works on the same computer. Useful for demos, previews, or handing someone a single file.
- **Hosted** (GitHub Pages, Netlify, Vercel, Cloudflare Pages, plain cPanel/FTP — anything static): upload `index.html` (and `og-image.svg` if you want social-preview cards). Now the generated links are real `https://...` URLs anyone can open. This is what you want for actually sending invitations to other people.

## Deploying

Any static host works. Just upload `index.html` — no server-side code required. An internet connection is needed at view-time only for the Google Font and the two CDN libraries (see below).

## How the personalized link works

The "sender" opens the page with no URL parameters and sees the setup screen. Submitting it builds a URL with query parameters:

- `sn` — sender's name
- `sp` — sender's WhatsApp number (digits only, with country code)
- `rn` — recipient's name (optional)
- `lg` — the sender's selected language, so the recipient sees the same language
- `tp` — the chosen invitation type/template (`date`, `anniversary`, `valentine`, `proposal`)
- `th` — the chosen color theme (`pink`, `sunset`, `ocean`, `lavender`, `mint`)

That URL (and its QR code, shown right under it) is what gets sent to the recipient. When the recipient opens it, the inline script reads those parameters and skips straight to the welcome/question screens, styled and worded to match what the sender picked. When the recipient confirms the date plan, the "Notify via WhatsApp" button opens a `wa.me`/`api.whatsapp.com` link pre-filled with the ticket details, addressed to `sp` if present.

No data is stored or sent to any server — everything lives in the URL, the browser's `localStorage` (for the visitor's own language/theme/dark-mode/sound preferences), and generated client-side images.

## Languages

Supported: Turkish (`tr`), English (`en`), French (`fr`), German (`de`).

- All UI strings live in the `I18N` object near the top of the inline `<script>` in `index.html`.
- Language is picked in this order: `lg` URL parameter → last choice saved in `localStorage` → browser language → English fallback.
- The floating switcher (top-right, all screens) lets anyone override it on the spot.
- To add another language: copy one of the existing blocks in `I18N` (including its `templates` sub-object), translate every value, and add the language code to `SUPPORTED_LANGS` plus a switcher button in the `.lang-switcher` markup.

## Invitation templates

Four flavors of the same flow, switchable from the setup screen: **First Date**, **Anniversary**, **Valentine's Day**, and **Marriage Proposal**. Each only changes the emotional copy (page title, welcome/question/yes text, ticket header/footer, initial emoji) — the date/time/place planner and ticket mechanics stay the same. Defined per language under `I18N[lang].templates`; `t(key)` checks the current template's overrides before falling back to the language's top-level strings. To add a template: add a key to `TEMPLATE_KEYS`, add a block under `templates` in every language, and add it to `templateOptions` (for the picker) in every language.

## Color themes & dark mode

Five color themes (Pink, Sunset, Ocean, Lavender, Mint) selectable on the setup screen, plus a separate light/dark mode toggle (top bar, every screen). Both are implemented as CSS custom properties in the inline `<style>` block:

- Theme colors: `:root[data-theme-color="..."]` blocks override `--brand-1`, `--brand-2`, and the background gradient stops.
- Dark mode: `:root[data-mode="dark"]` overrides text/card/field colors.
- The script keeps a small `THEME_SWATCH_COLORS` map in sync with the CSS for rendering the swatch buttons — update both places together when changing theme colors.

The visitor's dark-mode and sound preferences are personal (saved to their own `localStorage`); the chosen invitation theme is part of the sender's link (`th` param) since it's part of what's being sent.

## Sound effects

Short tones synthesized with the Web Audio API (no audio files to host) play on key actions (button taps, the "No" button escaping, saying "Yes"). Muted via the speaker icon in the top bar; the preference is remembered per browser.

## QR code & ticket download

- The generated link is also rendered as a QR code (via `qrcode.js`) right under the "Copy Link" button — handy for printed or in-person invitations.
- On the ticket screen, "Download Ticket" renders the ticket card to a PNG (via `html2canvas`) so it can be saved or shared as an image outside WhatsApp.

## Countdown

The ticket screen shows a live days/hours/minutes/seconds countdown to the confirmed date, computed from the selected day + time slot.

## Dependencies (CDN)

Loaded in `index.html`, before the inline `<script>`:

- `qrcode.js` (davidshimjs) — QR code rendering
- `html2canvas` — ticket-to-image download

Both are optional in the sense that the app degrades gracefully (no QR code / no download button effect) if the CDN is unreachable — everything else still works.

## Accessibility

- All interactive pickers (day/time/place/template/theme/language) are real `<button>` elements with `aria-pressed` state, reachable and operable by keyboard (Tab + Enter/Space).
- The funny "No"-button messages and the countdown are in `aria-live="polite"` regions so screen readers announce updates.
- Focus is visibly outlined (`:focus-visible`) using the current theme's brand color.

## Customizing

- **Colors**: see "Color themes & dark mode" above.
- **Font**: currently "Baloo 2" from Google Fonts, loaded in `index.html`'s `<head>`.
- **Date/time/place options**: edit the `timeOptions` / `placeOptions` arrays inside each language block in `I18N`.
- **Funny "No"-button messages**: edit the `funnyMessages` array per language.
- **Social preview image**: replace `og-image.svg` (and the `og:image`/`twitter:image` meta tags in `index.html`) with a PNG/JPG if a specific platform doesn't render the SVG.

## License

This template is provided for resale/distribution by its owner under whatever license terms accompany the purchase (e.g. a single-site or extended license). Add your own `LICENSE` file with the exact terms before distributing.
