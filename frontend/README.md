# Digitalshop frontend

## Local development

1. Copy `.env.example` to `.env`.
2. Set `VITE_API_URL` to the backend URL, for example `http://localhost:8800`.
3. Run `npm install`, then `npm run dev`.

## Vercel deployment

Deploy the `frontend` directory as a Vercel project with the Vite framework.
Set this environment variable for Production, Preview, and Development as needed:

```text
VITE_API_URL=https://your-backend.vercel.app
```

Vite embeds this variable at build time, so redeploy after changing it. The
backend must allow the deployed frontend origin through `FRONTEND_URLS`.

## Checks

```bash
npm run lint
npm run build
```
