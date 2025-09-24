# Amazon Advertising What's New RSS Feed

This Vercel app fetches Amazon Advertising's "What's New" updates and converts them to RSS format.

## Deployment

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`

## API Endpoint

Once deployed, the RSS feed will be available at:
```
https://your-app.vercel.app/api/rss
```

Optional query parameters:
- `locale`: Language/region code (default: `de-de`)
  - Examples: `en-us`, `fr-fr`, `es-es`, `it-it`, `ja-jp`

## Example URLs

- German feed: `https://your-app.vercel.app/api/rss?locale=de-de`
- English (US) feed: `https://your-app.vercel.app/api/rss?locale=en-us`
- French feed: `https://your-app.vercel.app/api/rss?locale=fr-fr`

## Local Development

```bash
npm install
npm run dev
```

Access locally at: `http://localhost:3000/api/rss`