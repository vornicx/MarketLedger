# Market Ledger — Brand System

## Positioning

**Market Ledger** is a personal financial newspaper and market-intelligence journal. It should feel editorial, sober and evidence-led — closer to a serious printed financial publication than to a trading dashboard or an AI SaaS product.

**Tagline:** `Intelligence, without the noise.`

## Identity

- Primary wordmark: `MARKET LEDGER`
- Monogram: `ML`
- Signature device: black editorial square with a small oxblood corner mark
- Paper: `#f2e7d8`
- Ink: `#171513`
- Oxblood accent: `#8f2f2d`
- Muted ink: `#655e56`
- Positive green: `#25533f`

## Typography

- Display/editorial: Iowan Old Style / Baskerville / Georgia / Times fallback
- Utility/data/navigation: Inter / system sans
- Headlines should be tight, large and deliberately newspaper-like.
- Avoid generic rounded SaaS cards, glassmorphism, neon crypto aesthetics and oversized gradients.

## Mobile rules

Mobile is designed as its own reading experience, not a compressed desktop page:

- Compact monogram + wordmark masthead
- Horizontally scrollable primary navigation
- Dark market tape for quick scanning
- Large editorial lead headline with reduced line length
- One-column stories and scenarios
- Clear rules between sections instead of boxed cards
- Watchlists and sources collapse into readable semantic rows
- No horizontal overflow except deliberate nav/ticker scrolling
- Respect `prefers-reduced-motion`

## Editorial voice

Calm, analytical and falsifiable. Separate observed facts from interpretation. Do not manufacture certainty, urgency or trade signals. Prefer conditions, catalysts, risks and invalidation criteria.

## Editorial lightness

The interface should feel **edited**, not merely dense.

- Prefer whitespace and hierarchy over repeated borders.
- Use one strong headline at a time; secondary stories should step down clearly.
- Reading columns should stay around 760–860px for long prose.
- Market data should be scannable but visually quieter than editorial analysis.
- Use thin rules and subtle paper contrast rather than heavy boxes.
- Avoid presenting every section with equal visual weight.
- Scenario, watchlist and archive modules should feel like supporting editorial furniture.
- Mobile should preserve rhythm and whitespace rather than compress density.

## Languages

Market Ledger is bilingual: **English and Spanish**.

- The language control must be visible in the masthead as `ES / EN`.
- It changes navigation, interface labels and the complete editorial content.
- Preference is persisted locally and can also be represented by the `?lang=es|en` query parameter.
- New daily editions must be generated in both languages at publication time.
- There is one canonical archive and one set of market facts; translations must never diverge on numbers, dates, sources, scenarios or thesis logic.


## Front page vs. full edition

The homepage is a **cover**, not the entire report.

- Show one dominant cover story, two supporting stories and a concise index of the rest.
- Keep the three-point Daily Brief near the top.
- Use compact scenarios on the cover; reserve full conditions and watch items for the dated edition.
- Show only the highest-value watchlist items on the cover.
- Whale Watch should stay visually quiet unless a verified event actually deserves attention.
- The complete analysis, all stories, sources and full scenario detail live inside `/edition/YYYY-MM-DD`.
- When choosing between adding more content to the homepage and linking into the edition, prefer the link.
