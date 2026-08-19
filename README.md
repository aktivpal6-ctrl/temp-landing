# AKTIVPAL Landing

Next.js (App Router) landing page and founding community survey for AKTIVPAL.

## Getting started

```bash
yarn install
```

## Available scripts

| Script          | Description                                            |
| --------------- | ------------------------------------------------------ |
| `yarn dev`      | Start the dev server at http://localhost:3000          |
| `yarn build`    | Create an optimized production build                   |
| `yarn start`    | Serve the production build                             |

## Routes

- `/` — landing page
- `/survey` — founding community survey
- `POST /api/survey` — submits a survey response via email (server-side only)

## Environment variables

Loaded from `.env` (server-side only, never exposed to the browser):

- `SMTP_USER` / `SMTP_PASS` — Gmail SMTP credentials used to send survey responses
- `MAIL_TO` — recipient address for survey responses
