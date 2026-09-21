# Market Ledger

**Intelligence, without the noise.**

Market Ledger is a personal daily financial newspaper and market research journal. It combines a concise editorial front page with deeper macro, equities, crypto, on-chain, scenario and thesis-tracking sections, while keeping a dated archive for later review.

## Current product

- Daily Brief homepage with Market Ledger branding
- Mobile-first editorial layout and horizontally scrollable market tape
- Full dated edition route: `/edition/2026-09-21`
- Archive: `/archive`
- Research journal: `/ideas` and `/ideas/:slug`
- Thesis scorecard: `/scorecard`
- Whale Watch journal: `/whales`
- Source citations and scenario-based playbook
- No Lovable branding or runtime dependency
- No fabricated live data; observed values are sourced and dated

## Development

```bash
npm install
npm run build
```

The app is intentionally lightweight: vanilla TypeScript, semantic HTML and CSS with no runtime framework dependency.

## Deployment

The repository includes `vercel.json` for SPA routing. Connect this repository to Vercel and deploy from `main`.

## Daily workflow

The target workflow is:

`09:00 research → Market Ledger edition → dated archive → email delivery → later Then vs Now review`

The daily edition should preserve a compact record of falsifiable theses, their review horizon and invalidation conditions so that the archive becomes a learning system rather than a feed of disposable commentary.
