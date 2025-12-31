# MDM Docs

MkDocs site for internal system docs.

## Local dev
```bash
npm install
npm run docs:dev
```

## Build
```bash
npm install
npm run docs:build
```

## Cloudflare Pages
This site is connected to GitHub and deploys automatically on every push to `main`.

Build settings:
- Build command: `npm run docs:build`
- Build output directory: `docs/.vitepress/dist`

## Access control
Basic Auth is enforced in `functions/_middleware.js`.

Set these Pages secrets:
- `BASIC_AUTH_USER`
- `BASIC_AUTH_PASS`
