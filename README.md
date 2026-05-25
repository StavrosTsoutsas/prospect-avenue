# ProspectAvenue — Live-Data-Ready MVP

This folder preserves the original uploaded HTML as `original-index.html` and adds a deployable Vercel-ready copy in `index.html`.

## What changed

The UI and core voyage-estimator layout are preserved. The app now has a backend-ready data layer using Vercel serverless functions:

- `/api/bunkers?port=`
- `/api/route?from=&to=&canal=`
- `/api/carbon`
- `/api/port-costs?port=&vesselType=`
- `/api/canal-dues?canal=&vesselType=`
- `/api/weather-risk` placeholder, intentionally not integrated yet

Every endpoint currently returns mock/estimated data with:

- value or range
- source
- updatedAt
- confidence
- status: mock / estimated / manual / licensed

No paid APIs are used. No scraping is used. No API keys are exposed in the frontend.

## Important note

This version is architecture-ready, not commercially data-ready. Before charging customers or relying on real estimates, replace mock providers with properly licensed data sources.

## Local/dev use

On Vercel, the API routes work automatically.

For local Vercel testing:

```bash
npm install -g vercel
vercel dev
```

Then open the local URL Vercel provides.

Static opening of `index.html` in a browser will show the app, but API calls to `/api/...` only work in a Vercel/server environment.

## Check

```bash
npm run check
```

This checks frontend script syntax and smoke-tests each mock endpoint.
