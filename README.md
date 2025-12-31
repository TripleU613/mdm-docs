# MDM Docs

MkDocs site for internal system docs.

## Local dev
```bash
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

## Build
```bash
pip install -r requirements.txt
mkdocs build
```

## Cloudflare Pages
- Build command: `mkdocs build`
- Build output directory: `site`

## Access control
Basic Auth is enforced in `functions/_middleware.js`.

Set these Pages secrets:
- `BASIC_AUTH_USER`
- `BASIC_AUTH_PASS`
