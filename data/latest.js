export const edition = {
    date: '2026-09-21',
    displayDate: 'Monday, 21 September 2026',
    label: 'Morning Edition · 13:20 CEST snapshot',
    headline: 'Oil relief reopens the risk-on trade — but the Fed still sets the ceiling',
    dek: 'Technology and crypto are rebounding as crude retreats for a fourth session. The move is constructive, but it is still a relief rally inside a tighter-rate regime rather than a clean return to easy financial conditions.',
    brief: [
        'The most important change today is energy. Brent has fallen for a fourth consecutive session as more Gulf supply reaches the market and diplomatic hopes improve. Cheaper oil reduces the immediate inflation impulse, lowers pressure on bond yields and gives duration-sensitive assets room to breathe.',
        'Risk assets are responding in the expected order: technology leads, Europe is broadly higher, US equity futures are positive and crypto has accelerated. Bitcoin traded above $82,000 in early coverage and later reached an eight-month high above $85,000, while Ether and Solana also advanced.',
        'The constraint has not disappeared. The Federal Reserve raised rates last week to 3.75%–4.00% and retained a hawkish tone. The correct reading is therefore “risk-on relief with macro confirmation still required”, not “all clear”.'
    ],
    indicators: [
        { symbol: 'STOXX', label: 'STOXX Europe 600', value: '640.55 · +0.8%', note: 'Tech-led Europe rally, 08:20 GMT Reuters snapshot', state: 'positive' },
        { symbol: 'IBEX', label: 'IBEX 35', value: '~19,700 · +1%', note: 'Spain among stronger European markets', state: 'positive' },
        { symbol: 'BTC', label: 'Bitcoin', value: '$82k → $85.1k', note: 'Eight-month high later in session; volatile intraday', state: 'positive' },
        { symbol: 'ETH', label: 'Ether', value: '$2,668 · +3.5%', note: 'CoinDesk snapshot', state: 'positive' },
        { symbol: 'SOL', label: 'Solana', value: '$111.83 · +2.9%', note: 'CoinDesk snapshot', state: 'positive' },
        { symbol: 'BRENT', label: 'Brent crude', value: '~$101 · -2%', note: 'Fourth straight decline; inflation relief channel', state: 'negative' },
        { symbol: 'DXY', label: 'Dollar index', value: '100.23', note: 'Still firm after Fed tightening', state: 'neutral' },
        { symbol: 'USDJPY', label: 'USD/JPY', value: '~157', note: 'Intervention risk after BoJ hike', state: 'neutral' }
    ],
    stories: [
        {
            id: 'oil-relief', category: 'Macro', title: 'Oil is the transmission mechanism that matters most this morning',
            dek: 'Lower crude is doing more than helping consumers: it is relaxing the inflation-and-rates chain that has been punishing long-duration assets.',
            analysis: 'Brent is down for a fourth consecutive session, with Reuters reporting that more oil is leaving the Gulf than markets had feared. That matters because the latest tightening cycle has been reinforced by inflation risk. When energy falls, the market can price a slightly less hostile inflation path, Treasury prices improve, yields ease and technology and crypto receive immediate relief. The key distinction is cause: a fall in oil because supply normalises is generally friendlier for risk assets than a fall caused by collapsing demand.',
            watch: 'Whether Brent can stay near or below the low-$100s area without a fresh geopolitical supply shock.'
        },
        {
            id: 'fed-ceiling', category: 'Rates', title: 'The Fed remains the ceiling on enthusiasm',
            dek: 'Last week’s 25 bp hike to 3.75%–4.00% was the first increase in three years and the message remained hawkish.',
            analysis: 'The relief rally is occurring after a material tightening step, not after a pivot. Sixteen of eighteen Fed policymakers projected at least one more increase during 2026. That leaves rate-sensitive assets vulnerable if inflation data, wages or energy re-accelerate. Lower oil buys the market breathing room, but the bar for durable multiple expansion remains high while real yields and the dollar are elevated.',
            watch: 'US 2-year and 10-year yields, real yields, October hike expectations and any change in Fed language after incoming inflation data.'
        },
        {
            id: 'equities-tech', category: 'Markets', title: 'Technology is leading the rebound across regions',
            dek: 'Europe’s tech sector gained around 2%, while US futures pointed higher and AI-linked names led pre-market strength.',
            analysis: 'This is the cross-asset confirmation we wanted to see from an energy-relief move. The STOXX 600 rose about 0.8%, European technology led, travel benefited from lower fuel prices and energy stocks lagged. In the US, Reuters reported S&P 500 futures up around 0.6% and Nasdaq futures close to 1%, with Intel, Marvell, Meta and Dell among notable pre-market gainers. The breadth is better than a single-name squeeze, but the rally still needs cash-session follow-through.',
            watch: 'Whether US cash trading confirms futures, whether market breadth improves beyond AI/semis, and whether yields stay cooperative.'
        },
        {
            id: 'europe-asia', category: 'Markets', title: 'Europe and Asia are confirming a broader risk bid',
            dek: 'The move is not isolated to Wall Street: Korea, Taiwan, China and Europe are participating.',
            analysis: 'South Korea’s tech-heavy index rose roughly 1.4%–1.5%, Taiwan gained around 1% and Chinese blue chips were positive while Japan was closed for Silver Week. Europe then extended the pattern, led by technology and banks. This geographic breadth improves the quality of today’s signal, although holiday-thinned Japanese trading and the upcoming Trump–Xi summit mean positioning can still shift quickly.',
            watch: 'Trump–Xi headlines, semiconductor trade policy and whether the yuan’s strength persists after the summit.'
        },
        {
            id: 'china-fx', category: 'Macro', title: 'The yuan is quietly sending a stability signal ahead of Trump–Xi',
            dek: 'The yuan reached a fresh multi-year high as the PBOC eased resistance to appreciation before this week’s summit.',
            analysis: 'Reuters reported the onshore yuan around 6.695 per dollar, its strongest in more than three and a half years. The PBOC set its midpoint at the strongest level since February 2023. That looks less like a new structural appreciation regime and more like an effort to enter the summit with stable financial conditions. Still, a calmer currency backdrop reduces one source of global risk and supports Asian assets at the margin.',
            watch: 'Whether the fixing remains supportive after the summit and whether US–China discussions produce concrete trade or AI outcomes.'
        },
        {
            id: 'crypto-breakout', category: 'Crypto', title: 'Bitcoin is breaking higher — but part of the move is a short squeeze',
            dek: 'BTC moved from above $82,000 to an eight-month high around $85,100 as oil fell, ETF demand improved and short positions were forced out.',
            analysis: 'The move is strong enough to respect, but its composition matters. CoinDesk showed BTC above $82,000 alongside broad crypto gains; later reporting put Bitcoin above $85,000. Separate liquidation data cited by market coverage showed hundreds of millions of dollars of short liquidations, which means some acceleration came from forced buying rather than fresh discretionary spot demand. Ether and Solana also advanced, confirming breadth. The next test is whether price can hold after the squeeze impulse fades.',
            watch: 'Spot ETF flows, spot-versus-perpetual volume, funding, open interest rebuilding and whether BTC can hold above the prior $80k resistance zone.'
        },
        {
            id: 'alt-beta', category: 'Crypto', title: 'SOL is participating, but BTC remains the cleaner macro barometer',
            dek: 'Solana is up with the market, yet the current catalyst is macro liquidity rather than a Solana-specific fundamental break.',
            analysis: 'SOL traded around $111.83 in a CoinDesk snapshot, up roughly 2.9%, while broader reports showed larger intraday gains as the crypto rally accelerated. For now, the move should be interpreted as high-beta participation in improving risk appetite. A higher-conviction SOL thesis would need confirmation from network activity, stablecoin growth and the tracked-wallet cluster rather than price alone.',
            watch: 'SOL/BTC relative strength, DEX activity quality, stablecoin flows and coordinated accumulation among tracked wallets.'
        },
        {
            id: 'onchain-discipline', category: 'On-chain', title: 'No wallet move enters the ledger without context',
            dek: 'The hourly wallet monitor is active separately; the daily edition only promotes events that survive a higher evidence threshold.',
            analysis: 'A raw transfer is not a trade. Market Ledger will only publish a whale event when we can classify the destination, size it relative to the wallet, compare it with historical behaviour and, ideally, see confirmation across unrelated wallets or market liquidity. That prevents the journal from turning into a stream of noisy transaction alerts.',
            watch: 'Clusters of same-token accumulation, fresh DEX buys by historically profitable wallets and exchange inflow/outflow patterns that repeat.'
        }
    ],
    scenarios: [
        {
            id: 'risk-on', name: 'Relief becomes a broader risk-on move', tone: 'constructive',
            thesis: 'Lower oil continues to ease inflation pressure, yields remain contained and today’s tech/crypto strength broadens rather than fading after the opening impulse.',
            conditions: ['Brent holds near/below the low-$100s', 'US yields do not re-accelerate', 'Nasdaq cash breadth confirms futures', 'BTC holds above the prior $80k breakout area'],
            watch: ['Brent', 'US 10Y / real yields', 'Nasdaq breadth', 'BTC spot demand and ETF flows']
        },
        {
            id: 'base', name: 'Relief rally, then digestion', tone: 'neutral',
            thesis: 'Markets keep today’s gains but remain range-bound as investors balance lower oil against a still-hawkish Fed and upcoming Trump–Xi event risk.',
            conditions: ['Oil stabilises rather than collapses', 'Dollar remains firm but not surging', 'Equity leadership rotates', 'Crypto funding stays controlled'],
            watch: ['DXY', '2Y yield', 'Trump–Xi headlines', 'Crypto funding/open interest']
        },
        {
            id: 'risk-off', name: 'Macro pressure returns', tone: 'defensive',
            thesis: 'A renewed oil shock, hotter inflation signal or hawkish repricing pushes yields and the dollar higher, reversing the relief trade in high-beta assets.',
            conditions: ['Brent rebounds sharply', 'US yields break higher', 'Dollar strengthens', 'BTC loses the $80k area with leverage still elevated'],
            watch: ['Middle East supply headlines', 'Fed repricing', 'Credit spreads', 'Crypto liquidations']
        }
    ],
    watchlist: [
        { asset: 'BTC', reason: 'Hold above the former $80k resistance zone after the short-squeeze impulse', status: 'Constructive, wait for hold' },
        { asset: 'SOL', reason: 'Need SOL/BTC strength plus on-chain/stablecoin confirmation', status: 'Study, do not chase' },
        { asset: 'Nasdaq', reason: 'Cash-session breadth must confirm strong futures and AI leadership', status: 'Confirmation needed' },
        { asset: 'Brent', reason: 'The entire relief narrative weakens if crude rapidly retakes recent highs', status: 'Macro trigger' },
        { asset: 'US 10Y', reason: 'A renewed yield spike would pressure growth equities and crypto', status: 'Risk control' },
        { asset: 'USD/JPY', reason: 'Near 157 with intervention risk after the BoJ hike', status: 'Event risk' }
    ],
    sources: [
        { label: 'Reuters · Europe', note: 'STOXX 600, sector leadership and oil-relief transmission. Published 21 Sep 2026.', href: 'https://www.reuters.com/markets/europe/europes-stoxx-600-gains-tech-rallies-oil-retreat-eases-nerves-2026-09-21/' },
        { label: 'Reuters · Asia', note: 'Asian equities, USD/JPY and oil backdrop. Published 21 Sep 2026.', href: 'https://in.marketscreener.com/news/tech-lifts-share-markets-in-asia-as-oil-slips-ce785adbd88ff227' },
        { label: 'Reuters · FX', note: 'Yuan, PBOC fixing and Trump–Xi summit context. Published 21 Sep 2026.', href: 'https://www.reuters.com/world/asia-pacific/yuan-hits-fresh-multi-year-peak-pboc-eases-curb-ahead-trump-xi-summit-2026-09-21/' },
        { label: 'Reuters · Fed context', note: 'Fed hike to 3.75%–4.00% and hawkish policy backdrop from 17 Sep 2026.', href: 'https://www.reuters.com/commentary/reuters-open-interest/global-markets-view-usa-2026-09-17/' },
        { label: 'CoinDesk · Crypto', note: 'BTC, ETH and SOL snapshot plus cross-asset risk context. Published 21 Sep 2026.', href: 'https://www.coindesk.com/business/2026/09/21/live-updates-bitcoin-rises-above-usd82-000-as-falling-oil-lifts-risk-assets' },
        { label: 'WSJ · Bitcoin', note: 'Bitcoin eight-month high near $85,117 and ETF/risk-sentiment context. Published 21 Sep 2026.', href: 'https://www.wsj.com/finance/currencies/bitcoin-jumps-above-85-000-to-8-month-high-050f3578' },
        { label: 'Cinco Días · Spain', note: 'IBEX near 19,700 and Brent near $101 snapshot. Published 21 Sep 2026.', href: 'https://cincodias.elpais.com/mercados-financieros/2026-09-21/la-bolsa-y-el-ibex-35.html' }
    ]
};
export const editions = [edition];
// The hourly Solana wallet watcher is active separately. Only events that clear the
// evidence threshold are promoted into a daily Market Ledger edition.
export const whaleEvents = [];
export const ideas = [
    {
        slug: 'solana-liquidity', asset: 'SOL', title: 'Solana as a liquidity and activity barometer', status: 'Researching', lastReviewed: '2026-09-21',
        summary: 'Use Solana not only as a directional asset thesis but as a high-frequency window into speculative liquidity, wallet clustering and risk appetite.',
        thesis: 'If network activity, stablecoin liquidity and spot-led demand expand together while leverage remains controlled, SOL can become a useful proxy for improving crypto risk appetite.',
        bullCase: 'Sustained real usage, stablecoin growth and broad on-chain participation coincide with improving spot demand and manageable leverage.',
        baseCase: 'Activity stays healthy but valuation and positioning limit upside, leaving SOL useful mainly as a liquidity signal rather than a high-conviction allocation.',
        bearCase: 'Activity quality deteriorates, leverage dominates price action or network economics fail to justify valuation.',
        catalysts: ['Stablecoin supply growth', 'DEX activity quality', 'Developer / application traction', 'Spot-led breakout versus BTC'],
        risks: ['Leverage-driven false breakouts', 'Memecoin activity masking weak fundamentals', 'Network concentration', 'Regulatory or exchange shocks'],
        changeMind: ['Persistent activity decline despite higher token price', 'Repeated exchange inflows from tracked long-term wallets', 'Funding and open interest become structurally overheated']
    },
    {
        slug: 'asml-semiconductor-cycle', asset: 'ASML', title: 'ASML and the durability of the semiconductor capex cycle', status: 'Watching', lastReviewed: '2026-09-21',
        summary: 'Track whether AI-led capital expenditure broadens into a durable semiconductor equipment cycle or becomes concentrated in a narrower set of customers.',
        thesis: 'ASML remains structurally advantaged if advanced-node demand and customer capex stay resilient enough to offset cyclicality and export constraints.',
        bullCase: 'Leading-edge demand broadens, bookings recover and customer capex remains disciplined but strong.',
        baseCase: 'Long-term positioning stays intact while near-term order volatility creates uneven periods of growth.',
        bearCase: 'Capex normalises faster than expected, export restrictions tighten or customer concentration produces a prolonged order gap.',
        catalysts: ['Foundry capex updates', 'High-NA EUV adoption', 'Order intake', 'AI infrastructure demand'],
        risks: ['Export controls', 'Customer concentration', 'Semiconductor capex cyclicality', 'Valuation compression'],
        changeMind: ['Sustained deterioration in leading-edge demand', 'Evidence that AI capex does not translate into equipment demand', 'Structural margin deterioration']
    }
];
export const thesisReviews = [
    { id: 't1', date: '2026-09-21', category: 'Crypto', thesis: 'BTC can hold the former $80k resistance zone after today’s short-squeeze acceleration.', horizon: '7 days', outcome: 'Open', evidence: 'Initial edition thesis. Review after the squeeze impulse and ETF-flow follow-through can be observed.' },
    { id: 't2', date: '2026-09-21', category: 'Macro', thesis: 'If Brent remains near the low-$100s and yields stay contained, technology and crypto should retain part of today’s relief bid.', horizon: '5 days', outcome: 'Open', evidence: 'Initial cross-asset thesis based on the oil → inflation → yields → duration transmission chain.' }
];
