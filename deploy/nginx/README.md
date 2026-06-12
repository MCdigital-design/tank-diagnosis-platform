# Nginx preview hosting (optional)

Use on **Tencent Lighthouse** when you want **edge** username/password protection in addition to the in-app preview login.

## Setup

1. Build preview bundle locally or in CI: `npm run build:preview`
2. Copy `dist/` to the server: `/var/www/tank-preview/dist`
3. Generate htpasswd **on the server** (do not commit real hashes):

```bash
sudo apt install apache2-utils   # provides htpasswd
sudo htpasswd -cb /etc/nginx/tank-preview.htpasswd Z-Float 'YOUR_PASSWORD'
```

4. Copy [`preview.conf`](./preview.conf) and include it from your main `nginx.conf`
5. `sudo nginx -t && sudo systemctl reload nginx`

## Notes

- `htpasswd.example` is illustrative only — replace with a server-generated file.
- Nginx `auth_basic` shows a browser popup; the React login gate still runs after static files load unless you disable `VITE_PREVIEW_AUTH` for that deploy path.
