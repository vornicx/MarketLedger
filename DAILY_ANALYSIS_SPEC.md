# Market Ledger — Daily Edition Specification

## Schedule

Target publication: **09:00 Europe/Madrid every day**.

The edition is a dated market record, not disposable news. Every edition must preserve what was knowable at publication time and define claims that can later be reviewed in `Then vs Now`.

## Mandatory structure

1. **Daily Brief** — editorial headline, deck and 5–10 key changes.
2. **Regime** — risk-on, neutral, risk-off or mixed, justified by observable data.
3. **World & Macro** — geopolitics, growth, inflation and fiscal/monetary transmission.
4. **Rates & Bonds** — Fed, ECB, BoJ; US 2Y/10Y, real yields, curve and credit when relevant.
5. **Energy & Commodities** — Brent, WTI, gas, gold, silver, copper; explain whether moves come from supply, demand or geopolitics.
6. **United States** — S&P 500, Nasdaq, Dow, Russell 2000, VIX, breadth, sectors, semis, megacaps, earnings and flows.
7. **Europe** — STOXX/Euro Stoxx, DAX, CAC, IBEX, FTSE and sensitivities to energy, ECB, FX and growth.
8. **Asia** — Japan, China, Hong Kong, Korea, Taiwan, yen/yuan and policy.
9. **FX** — DXY, EUR/USD, USD/JPY, GBP/USD and relevant crosses.
10. **Crypto** — BTC, ETH and only materially relevant assets; spot trend, market cap, volume, open interest, funding, liquidations, futures basis, options/skew when reliable, ETF flows, exchange flows, stablecoin liquidity and on-chain evidence.
11. **Whale Watch** — only verified wallet activity. A transfer is never automatically interpreted as a buy or sell. Classify `Noise`, `Interesting` or `High conviction` according to evidence.
12. **Institutional positioning** — 13F, Form 4, insiders, large managers and ETF/fund flows with explicit data date and reporting lag.
13. **Positioning & flows** — CFTC, put/call, options/gamma and fund flows only when data quality is sufficient.
14. **Opportunities to study** — 3–7 maximum; thesis, why now, catalyst, risk, confirmation, invalidation, horizon and one action label: `study`, `wait for confirmation`, `scale in`, or `do not chase`.
15. **Watchlist** — concise asset + concrete trigger.
16. **24–72h calendar** — macro releases, central banks, earnings, auctions, expiries/unlocks and other catalysts.
17. **Today's Playbook** — constructive/risk-on, base/mixed and adverse/risk-off scenarios with confirmation and invalidation conditions.
18. **Decision framework** — distinguish long-term allocation, tactical positions and high-risk speculation.
19. **Final dashboard** — 10–15 variables with level, direction, interpretation and the level/event that would change the reading.
20. **60-second close** — what changed / what to watch / where opportunity may exist / what not to chase.
21. **Sources** — dated primary/reputable links.
22. **Market Ledger Record** — ISO date, headline, regime, three falsifiable theses, review horizon and invalidation condition for each.

## Source hierarchy

Prefer central banks, exchanges, CME/CFTC/SEC/EDGAR, official releases and major reputable financial reporting. For crypto/on-chain, use verifiable explorers and reputable providers such as CoinGlass, Glassnode, CryptoQuant or Arkham while stating data limitations.

## Writing rules

- Facts, interpretation and scenarios must be distinguishable.
- Never invent missing data.
- Explain causal chains rather than listing headlines.
- No imperative `buy X` language.
- Use short paragraphs, tables where useful and explicit invalidation conditions.
- Avoid repeating the same point across sections.

## Archive contract

Each edition should be stored under `editions/YYYY-MM-DD` and remain immutable after publication, except for a separate retrospective layer. Later outcome reviews must never rewrite the original thesis.
