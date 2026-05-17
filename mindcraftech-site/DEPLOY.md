# Deploy mindcraftech-site and map mindcraftech.ai

## 0) Why the loca.lt link is failing

`https://giant-hairs-warn.loca.lt/` is a temporary tunnel URL. When the local machine/tunnel process stops, the link returns Service Unavailable.

For production, deploy the static site to permanent hosting (Hostinger) and point your domain there.

## 1) Recommended: Cloudflare Pages (static)

1. Push this folder to a Git repository.
2. In Cloudflare Pages: Create project -> Connect repo.
3. Framework preset: None.
4. Build command: leave empty.
5. Output directory: `/` (repo root if this folder is repo root).
6. Deploy.

## 2) Map custom domain

1. In Cloudflare Pages project -> Custom domains -> Add `mindcraftech.ai`.
2. If Cloudflare manages DNS, it auto-creates records.
3. If external DNS provider:
   - Add CNAME `www` -> your Pages domain (example `project.pages.dev`).
   - Add A/ALIAS/ANAME for apex `mindcraftech.ai` per host instructions.

## 3) API endpoints used by forms

The contact and assessment forms post to endpoints configured in:
- `/assets/api-config.js`

Current defaults:
- `contactEndpoint: /api/contact`
- `assessmentEndpoint: /api/assessment`

Update to your real backend URLs, for example:

```js
window.MINDCRAFTECH_API = {
  contactEndpoint: "https://api.mindcraftech.ai/contact",
  assessmentEndpoint: "https://api.mindcraftech.ai/assessment"
};
```

## 4) Post-deploy verification checklist

1. Open `/` and confirm CSS/images load.
2. Submit contact form and confirm API receives payload.
3. Submit AI assessment and confirm score + API sync.
4. Verify domain SSL is active.
5. Verify robots and sitemap:
   - `/robots.txt`
   - `/sitemap.xml`

## 5) If you want me to deploy from here

Provide one of these:
1. Hosting platform + CLI auth available in terminal.
2. Git remote repo URL and hosting account access already configured.

Then I can run the exact deploy commands and verify live routing to `mindcraftech.ai`.

## 6) Hostinger deployment steps (recommended for this project)

This project is a static site (HTML/CSS/JS), so Hostinger File Manager is enough.

1. Zip site files:
   - Zip everything inside this folder:
     - `mindcraftech-site/`
   - Include: `index.html`, `assets/`, page folders, `robots.txt`, `sitemap.xml`.

2. Open Hostinger hPanel:
   - Websites -> Manage (your domain) -> Files -> File Manager.

3. Upload to the correct web root:
   - If this is your main domain, upload into `public_html/`.
   - If this is an addon/subdomain, upload to that domain's document root.

4. Extract and verify structure:
   - Ensure `index.html` sits directly under the web root (not nested under another folder level).
   - Ensure `assets/` is next to `index.html`.

5. Configure contact/assessment APIs:
   - Edit `assets/api-config.js` with your real backend URLs, for example:

```js
window.MINDCRAFTECH_API = {
  contactEndpoint: "https://api.mindcraftech.ai/contact",
  assessmentEndpoint: "https://api.mindcraftech.ai/assessment"
};
```

6. Domain and DNS setup:
   - If domain is at Hostinger: verify A record points to your Hostinger server IP.
   - If domain is external: set A record to Hostinger IP, and optional CNAME `www` -> apex domain.

7. Enable SSL:
   - hPanel -> Security -> SSL -> Install/Activate for domain.
   - Force HTTPS once certificate is active.

8. Clear cache and test:
   - Hard refresh browser (Cmd+Shift+R).
   - Test homepage, menu links, and both forms.
   - Confirm `/robots.txt` and `/sitemap.xml` open correctly.

9. Optional redirects:
   - If needed, add `.htaccess` to enforce non-www or www canonical redirect.

## 7) Quick troubleshooting on Hostinger

1. Blank or broken styles:
   - Usually wrong folder nesting. Move site so `index.html` is in web root.

2. 404 on subpages:
   - Confirm folders like `/about/` contain their own `index.html`.

3. Form errors:
   - Static hosting has no built-in `/api/*`. Use real external API endpoints in `assets/api-config.js`.
