import { edition as rawEdition, editions as rawEditions, ideas as rawIdeas, thesisReviews as rawThesisReviews, whaleEvents } from './data.js';
import { ui, editionTranslations, ideaTranslations, thesisTranslations, whaleEventTranslations } from './i18n.js';
import { append, badge, h, link, rule, setPageMeta } from './ui.js';

const app = document.querySelector('#app');
if (!app) throw new Error('Missing #app root');

function initialLanguage() {
  const q = new URLSearchParams(location.search).get('lang');
  if (q === 'es' || q === 'en') return q;
  const saved = localStorage.getItem('market-ledger-language');
  if (saved === 'es' || saved === 'en') return saved;
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en';
}
let lang = initialLanguage();

function strings() { return ui[lang]; }

function setLanguage(next) {
  lang = next;
  localStorage.setItem('market-ledger-language', next);
  document.documentElement.lang = next;
  const url = new URL(location.href);
  url.searchParams.set('lang', next);
  history.replaceState({}, '', url.pathname + url.search + url.hash);
  render();
}

function localizeEdition(base) {
  const t = editionTranslations[lang]?.[base.date];
  if (!t) return base;
  return {
    ...base,
    ...t,
    indicators: base.indicators.map(x => ({ ...x, ...(t.indicators?.[x.symbol] || {}) })),
    stories: base.stories.map(x => ({ ...x, ...(t.stories?.[x.id] || {}) })),
    scenarios: base.scenarios.map(x => ({ ...x, ...(t.scenarios?.[x.id] || {}) })),
    watchlist: base.watchlist.map(x => ({ ...x, ...(t.watchlist?.[x.asset] || {}) })),
    sources: base.sources.map((x, i) => ({ ...x, ...(t.sources?.[i] || {}) })),
  };
}

function localizeIdea(base) {
  return { ...base, ...(ideaTranslations[lang]?.[base.slug] || {}) };
}
function localizeThesis(base) {
  return { ...base, ...(thesisTranslations[lang]?.[base.id] || {}) };
}
function localizeWhale(base) {
  return { ...base, ...(whaleEventTranslations[lang]?.[base.id] || {}) };
}

function editionNow() { return localizeEdition(rawEdition); }
function editionsNow() { return rawEditions.map(localizeEdition); }
function ideasNow() { return rawIdeas.map(localizeIdea); }
function thesesNow() { return rawThesisReviews.map(localizeThesis); }
function whalesNow() { return whaleEvents.map(localizeWhale); }

function languageSwitch() {
  const wrap = h('div', 'language-switch');
  wrap.setAttribute('aria-label', strings().language);
  ['es','en'].forEach(code => {
    const b = h('button', `language-switch__button${lang === code ? ' is-active' : ''}`, code.toUpperCase());
    b.type = 'button';
    b.setAttribute('aria-pressed', String(lang === code));
    b.addEventListener('click', () => setLanguage(code));
    wrap.appendChild(b);
  });
  return wrap;
}

function masthead(active = 'today') {
  const t = strings();
  const current = editionNow();
  const header = h('header', 'masthead');
  const utility = h('div', 'masthead__utility shell');
  append(utility, h('div', 'eyebrow', current.displayDate), languageSwitch());

  const nameRow = h('div', 'masthead__name-row shell');
  const brand = link('', withLang('/'), 'masthead__brand');
  append(brand, h('span', 'brand-mark', 'ML'), h('span', 'brand-wordmark', 'MARKET LEDGER'));
  const meta = h('div', 'masthead__right');
  append(meta, h('div', 'masthead__tagline', t.tagline), h('div', 'masthead__edition', `${current.label} · ${t.personalJournal}`));
  append(nameRow, brand, meta);

  const nav = h('nav', 'topnav');
  nav.setAttribute('aria-label', lang === 'es' ? 'Navegación principal' : 'Primary navigation');
  const inner = h('div', 'shell topnav__inner');
  const items = [
    ['today', t.nav.today, '/'],
    ['ideas', t.nav.ideas, '/ideas'],
    ['whales', t.nav.whales, '/whales'],
    ['scorecard', t.nav.scorecard, '/scorecard'],
    ['archive', t.nav.archive, '/archive'],
  ];
  items.forEach(([key,label,href]) => inner.appendChild(link(label, withLang(href), `topnav__link${active === key ? ' is-active' : ''}`)));
  nav.appendChild(inner);
  append(header, utility, nameRow, nav);
  return header;
}

function withLang(href) {
  const [path, hash=''] = href.split('#');
  const url = new URL(path || '/', location.origin);
  url.searchParams.set('lang', lang);
  return url.pathname + url.search + (hash ? `#${hash}` : '');
}

function footer() {
  const t = strings();
  const f = h('footer', 'footer');
  const inner = h('div', 'shell footer__grid');
  append(inner, h('div', 'footer__brand', 'ML / MARKET LEDGER'), h('p', 'footer__copy', t.footer1), h('p', 'footer__copy', t.footer2));
  f.appendChild(inner);
  return f;
}

function marketPulse(current = editionNow()) {
  const t = strings();
  const priority = ['BTC','BRENT','STOXX','DXY'];
  const items = priority.map(symbol => current.indicators.find(i => i.symbol === symbol)).filter(Boolean);
  const section = h('section','market-pulse');
  section.id = 'market-pulse';

  const head = h('div','market-pulse__head');
  append(
    head,
    h('div','market-pulse__heading'),
    link(t.viewAllData,withLang(`/edition/${current.date}#snapshot`),'text-link')
  );
  const heading = head.querySelector('.market-pulse__heading');
  append(heading,h('div','kicker',t.marketPulse),h('p','market-pulse__hint',t.marketPulseHint));

  const grid = h('div','market-pulse__grid');
  items.forEach(item => {
    const cell = h('div',`market-pulse__item market-pulse__item--${item.state || 'neutral'}`);
    append(
      cell,
      h('div','market-pulse__top'),
      h('div','market-pulse__value',item.value),
      h('div','market-pulse__label',item.label)
    );
    const top = cell.querySelector('.market-pulse__top');
    append(top,h('span','market-pulse__symbol',item.symbol),h('span','market-pulse__dot',''));
    grid.appendChild(cell);
  });
  append(section,head,grid);
  return section;
}

function quickRead(current = editionNow()) {
  const t = strings();
  const labels = [t.changed,t.reaction,t.mainRisk];
  const section = h('section','quick-read');
  section.id='overview';
  const title = h('div','quick-read__title');
  append(title,h('div','kicker',t.sixtySeconds));
  section.appendChild(title);
  const grid = h('div','quick-read__grid');
  current.brief.slice(0,3).forEach((text,i)=>{
    const item=h('article','quick-read__item');
    append(item,h('div','quick-read__index',String(i+1).padStart(2,'0')),h('h3','quick-read__label',labels[i]||''),h('p','quick-read__text',text));
    grid.appendChild(item);
  });
  section.appendChild(grid);
  return section;
}

function jumpNav(current, fullEdition = false) {
  const t = strings();
  const nav=h('nav','jump-nav');
  nav.setAttribute('aria-label',t.jumpTo);
  const inner=h('div','jump-nav__inner');
  const items = fullEdition
    ? [[t.overview,'#overview'],[t.marketSnapshot,'#snapshot'],[t.analysis,'#analysis'],[t.scenariosLabel,'#scenarios'],[t.sourcesLabel,'#sources']]
    : [[t.overview,'#overview'],[t.marketPulse,'#market-pulse'],[t.topStories,'#stories'],[t.scenariosLabel,'#scenarios'],[t.watchlist,'#watchlist']];
  items.forEach(([label,hash])=>inner.appendChild(link(label,withLang(`/${fullEdition ? 'edition/'+current.date : ''}${hash}`),'jump-nav__link')));
  nav.appendChild(inner);
  return nav;
}

function storyCard(story, compact = false) {
  const t = strings();
  const article = h('article', compact ? 'story story--compact' : 'story');
  article.id = story.id;
  append(article,h('div','story__kicker',story.category),h('h3','story__title',story.title));

  const why = h('div','story__explain story__explain--why');
  append(why,h('div','story__explain-label',t.whyMatters),h('p','story__dek',story.dek));
  article.appendChild(why);

  if (!compact) {
    const meaning=h('div','story__explain');
    append(meaning,h('div','story__explain-label',t.analysisLabel),h('p','story__body',story.analysis));
    const watch=h('div','story__explain story__explain--watch');
    append(watch,h('div','story__explain-label',t.watch),h('p','story__watch',story.watch));
    append(article,meaning,watch);
  }
  return article;
}

function scenarioCard(s, index, compact = false) {
  const t = strings();
  const card = h('article', `scenario scenario--${s.tone}${compact ? ' scenario--compact' : ''}`);
  const labels = [t.scenarioA,t.scenarioB,t.scenarioC];
  append(card, h('div', 'scenario__meta', labels[index] || `Scenario ${index+1}`), h('h3', 'scenario__title', s.name), h('p', 'scenario__thesis', s.thesis));
  const conditions = h('div', 'scenario__block');
  conditions.appendChild(h('div', 'scenario__label', t.confirm));
  const ul = h('ul', 'clean-list');
  (compact ? s.conditions.slice(0,2) : s.conditions).forEach(x => ul.appendChild(h('li','',x)));
  conditions.appendChild(ul);
  append(card, conditions);
  if (!compact) {
    const watch = h('div', 'scenario__block');
    watch.appendChild(h('div', 'scenario__label', t.watchNext));
    const ul2 = h('ul', 'clean-list');
    s.watch.forEach(x => ul2.appendChild(h('li','',x)));
    watch.appendChild(ul2);
    card.appendChild(watch);
  }
  return card;
}

function whaleRow(event) {
  const row = h('article','whale-row');
  append(row, h('time','whale-row__time',event.time), h('div','whale-row__main'));
  const main = row.querySelector('.whale-row__main');
  const top = h('div','whale-row__top');
  append(top, h('strong','',`${event.wallet} · ${event.chain}`), badge(event.classification,event.classification === 'High conviction' ? 'accent' : 'muted'));
  append(main, top, h('div','whale-row__action',`${event.action} ${event.token} · ${event.approxValue}`), h('div','whale-row__note',event.note), h('code','whale-row__address',event.address));
  return row;
}

function home() {
  const t = strings();
  const current = editionNow();
  setPageMeta('Market Ledger — Daily Brief', current.dek);
  const frag = document.createDocumentFragment();
  append(frag,masthead('today'));

  const main=h('main','shell home-page');

  const lead=h('section','lead lead--simple');
  const leadCopy=h('div','lead__copy');
  append(
    leadCopy,
    h('div','kicker',t.dailyBrief),
    h('h1','lead__headline',current.headline),
    h('p','lead__dek',current.dek),
    h('div','lead__meta',`${current.label} · 12 min · ${current.displayDate}`),
    link(t.fullEdition,withLang(`/edition/${current.date}`),'primary-link')
  );
  const oneLine=h('aside','lead-summary');
  append(oneLine,h('div','lead-summary__label',t.todayOneLine),h('p','lead-summary__text',t.oneLine));
  append(lead,leadCopy,oneLine);
  main.appendChild(lead);

  main.appendChild(jumpNav(current,false));
  main.appendChild(quickRead(current));
  main.appendChild(marketPulse(current));

  const storiesHead=h('div','section-heading');
  storiesHead.id='stories';
  append(storiesHead,h('div','kicker',t.topStories),h('h2','section-heading__title',t.topStories));
  main.appendChild(storiesHead);

  const keyStories=h('section','key-stories');
  ['oil-relief','crypto-breakout','fed-ceiling'].forEach((id,index)=>{
    const story=current.stories.find(s=>s.id===id);
    if(!story)return;
    const card=h('article',`key-story key-story--${index===0?'primary':'secondary'}`);
    append(card,h('div','story__kicker',story.category),h('h3','key-story__title',story.title));
    const why=h('div','key-story__why');
    append(why,h('span','key-story__label',t.whyMatters),h('p','',story.dek));
    const watch=h('div','key-story__watch');
    append(watch,h('span','key-story__label',t.watch),h('p','',story.watch));
    append(card,why,watch,link(t.readStory,withLang(`/edition/${current.date}#${story.id}`),'text-link'));
    keyStories.appendChild(card);
  });
  main.appendChild(keyStories);

  const moreWrap=h('section','more-section');
  const moreHead=h('div','more-section__head');
  append(moreHead,h('h2','more-section__title',t.moreToday),link(t.fullEdition,withLang(`/edition/${current.date}`),'text-link'));
  moreWrap.appendChild(moreHead);
  const more=h('div','more-today');
  current.stories.filter(s=>!['oil-relief','crypto-breakout','fed-ceiling'].includes(s.id)).forEach(story=>{
    const a=link('',withLang(`/edition/${current.date}#${story.id}`),'more-today__item');
    append(a,h('div','more-today__category',story.category),h('h3','more-today__title',story.title),h('p','more-today__dek',story.dek),h('span','more-today__arrow','→'));
    more.appendChild(a);
  });
  moreWrap.appendChild(more);
  main.appendChild(moreWrap);

  const scenariosHead=h('div','section-heading');
  scenariosHead.id='scenarios';
  append(scenariosHead,h('div','kicker',t.playbook),h('h2','section-heading__title',t.playbook));
  main.appendChild(scenariosHead);
  const scenarios=h('section','scenario-grid scenario-grid--front');
  current.scenarios.forEach((s,i)=>scenarios.appendChild(scenarioCard(s,i,true)));
  main.appendChild(scenarios);

  const watchHead=h('div','section-heading');
  watchHead.id='watchlist';
  append(watchHead,h('div','kicker',t.watchlist),h('h2','section-heading__title',t.watchlist));
  main.appendChild(watchHead);
  const watch=h('section','watchlist watchlist--front');
  const header=h('div','watchlist__header');
  append(header,h('div','',t.watchAsset),h('div','',t.watchTrigger),h('div','',t.watchAction));
  watch.appendChild(header);
  current.watchlist.slice(0,5).forEach(item=>{
    const row=h('div','watchlist__row');
    append(row,h('div','watchlist__asset',item.asset),h('div','watchlist__reason',item.reason),h('div','watchlist__status',item.status));
    watch.appendChild(row);
  });
  main.appendChild(watch);

  const lower=h('section','home-lower');
  const whale=h('div','home-lower__block');
  const localizedWhales=whalesNow();
  append(whale,h('div','kicker',t.whaleWatch),h('h3','home-lower__title',localizedWhales.length?t.whaleActivity:t.noWhaleSignal),h('p','home-lower__text',localizedWhales.length?t.whaleActivityCopy:t.noWhaleSignalCopy),link(t.walletJournal,withLang('/whales'),'text-link'));
  const research=h('div','home-lower__block');
  const firstIdea=ideasNow()[0];
  append(research,h('div','kicker',t.researchIdeas),h('h3','home-lower__title',firstIdea?.title||t.researchIdeas),h('p','home-lower__text',firstIdea?.summary||''),link(t.nav.ideas+' →',withLang('/ideas'),'text-link'));
  append(lower,whale,research);
  main.appendChild(lower);

  append(frag,main,footer());
  return frag;
}

function editionPage(date) {
  const t=strings();
  const current=editionsNow().find(e=>e.date===date);
  if(!current)return notFound(`${t.noEdition} ${date}.`);
  setPageMeta(`Market Ledger — ${current.displayDate}`,current.dek);

  const frag=document.createDocumentFragment();
  append(frag,masthead('today'));
  const main=h('main','shell edition-page');

  const head=h('header','edition-head');
  append(
    head,
    h('div','kicker',`${current.label} · ${t.dailyEdition}`),
    h('h1','edition-head__title',current.headline),
    h('p','edition-head__dek',current.dek),
    h('div','edition-head__meta',current.displayDate)
  );
  main.appendChild(head);
  main.appendChild(jumpNav(current,true));
  main.appendChild(quickRead(current));

  const snapshotHead=h('div','section-heading');snapshotHead.id='snapshot';
  append(snapshotHead,h('div','kicker',t.marketSnapshot),h('h2','section-heading__title',t.marketSnapshot));
  main.appendChild(snapshotHead);
  const snapshot=h('section','snapshot-grid');
  current.indicators.forEach(i=>{
    const cell=h('div',`snapshot-cell snapshot-cell--${i.state||'neutral'}`);
    append(cell,h('div','snapshot-cell__symbol',i.symbol),h('div','snapshot-cell__label',i.label),h('div','snapshot-cell__value',i.value),h('div','snapshot-cell__note',i.note));
    snapshot.appendChild(cell);
  });
  main.appendChild(snapshot);

  const analysisHead=h('div','section-heading');analysisHead.id='analysis';
  append(analysisHead,h('div','kicker',t.analysis),h('h2','section-heading__title',t.analysis));
  main.appendChild(analysisHead);
  const stories=h('section','edition-stories');
  current.stories.forEach(s=>stories.appendChild(storyCard(s)));
  main.appendChild(stories);

  const scenariosHead=h('div','section-heading');scenariosHead.id='scenarios';
  append(scenariosHead,h('div','kicker',t.playbook),h('h2','section-heading__title',t.playbook));
  main.appendChild(scenariosHead);
  const scenarios=h('section','scenario-grid');
  current.scenarios.forEach((s,i)=>scenarios.appendChild(scenarioCard(s,i)));
  main.appendChild(scenarios);

  const thenHead=h('div','section-heading');
  append(thenHead,h('div','kicker',t.thenNow),h('h2','section-heading__title',t.thenNow));
  main.appendChild(thenHead);
  const tvn=h('section','then-now');
  const left=h('div','then-now__column');append(left,h('div','kicker',t.whatKnew),h('h3','',t.frozen),h('p','',t.frozenCopy));
  const right=h('div','then-now__column');append(right,h('div','kicker',t.whatHappened),h('h3','',t.retrospective),h('p','',t.retrospectiveCopy));
  append(tvn,left,right);main.appendChild(tvn);

  const sourcesHead=h('div','section-heading');sourcesHead.id='sources';
  append(sourcesHead,h('div','kicker',t.sourcesNotes),h('h2','section-heading__title',t.sourcesNotes));
  main.appendChild(sourcesHead);
  const sources=h('section','sources');
  current.sources.forEach((s,i)=>{
    const row=h('div','sources__row');
    const label=s.href?link(s.label,s.href,'sources__label sources__link'):h('div','sources__label',s.label);
    if(label instanceof HTMLAnchorElement){label.target='_blank';label.rel='noreferrer';}
    append(row,h('div','sources__index',String(i+1).padStart(2,'0')),label,h('div','sources__note',s.note));
    sources.appendChild(row);
  });
  main.appendChild(sources);

  const pager=h('nav','edition-pager');
  append(pager,link(t.backArchive,withLang('/archive'),'text-link'),h('span','edition-pager__current',current.displayDate),h('span','edition-pager__disabled',t.nextEdition));
  main.appendChild(pager);

  append(frag,main,footer());
  return frag;
}

function archivePage() {
  const t=strings(); const editions=editionsNow();
  setPageMeta(`Market Ledger — ${t.nav.archive}`,t.archiveDek);
  const frag=document.createDocumentFragment();append(frag,masthead('archive'));
  const main=h('main','shell page');
  append(main,h('div','kicker',t.archiveKicker),h('h1','page-title',t.archiveTitle),h('p','page-dek',t.archiveDek));
  const searchWrap=h('div','archive-search');const label=h('label','archive-search__label',t.searchEditions);label.htmlFor='archive-q';const input=h('input','archive-search__input');input.id='archive-q';input.type='search';input.placeholder=t.searchPlaceholder;input.autocomplete='off';append(searchWrap,label,input);main.appendChild(searchWrap);main.appendChild(rule(t.september));
  const list=h('section','archive-list');
  const draw=()=>{list.replaceChildren();const q=input.value.trim().toLowerCase();const filtered=editions.filter(e=>!q||`${e.displayDate} ${e.headline} ${e.dek}`.toLowerCase().includes(q));if(!filtered.length){list.appendChild(h('p','empty-state',t.noSearch));return;}filtered.forEach(e=>{const a=link('',withLang(`/edition/${e.date}`),'archive-item');append(a,h('time','archive-item__date',e.date.slice(8,10)+' SEP'),h('div','archive-item__body'));const body=a.querySelector('.archive-item__body');append(body,h('h2','archive-item__title',e.headline),h('p','archive-item__dek',e.dek),h('div','archive-item__meta',`${e.label} · ${e.displayDate}`));list.appendChild(a);});};input.addEventListener('input',draw);draw();main.appendChild(list);append(frag,main,footer());return frag;
}

function ideasPage() {
  const t=strings();setPageMeta(`Market Ledger — ${t.nav.ideas}`,t.ideasDek);const frag=document.createDocumentFragment();append(frag,masthead('ideas'));const main=h('main','shell page');append(main,h('div','kicker',t.ideasKicker),h('h1','page-title',t.ideasTitle),h('p','page-dek',t.ideasDek));main.appendChild(rule(t.openResearch));const grid=h('section','ideas-list');ideasNow().forEach(item=>{const a=link('',withLang(`/ideas/${item.slug}`),'research-row');append(a,h('div','research-row__asset',item.asset),h('div','research-row__content'),h('div','research-row__status',item.status));const content=a.querySelector('.research-row__content');append(content,h('h2','research-row__title',item.title),h('p','research-row__summary',item.summary),h('div','research-row__meta',`${t.lastReviewed} ${item.lastReviewed}`));grid.appendChild(a);});main.appendChild(grid);append(frag,main,footer());return frag;
}

function ideaPage(itemRaw) {
  const t=strings();const item=localizeIdea(itemRaw);setPageMeta(`Market Ledger — ${item.asset}: ${item.title}`,item.summary);const frag=document.createDocumentFragment();append(frag,masthead('ideas'));const main=h('main','shell research-page');const head=h('header','research-head');append(head,h('div','kicker',`${item.asset} · ${item.status.toUpperCase()}`),h('h1','research-head__title',item.title),h('p','research-head__dek',item.summary),h('div','research-head__meta',`${t.lastReviewed} ${item.lastReviewed}`));main.appendChild(head);main.appendChild(rule(t.thesis));main.appendChild(h('p','research-prose research-prose--lead',item.thesis));const cases=h('section','case-grid');[[t.bull,item.bullCase],[t.base,item.baseCase],[t.bear,item.bearCase]].forEach(([title,text])=>{const c=h('article','case-card');append(c,h('div','case-card__label',title),h('p','',text));cases.appendChild(c);});main.appendChild(cases);main.appendChild(rule(t.catalystsRisks));const lists=h('section','dual-list');const buildList=(title,items)=>{const x=h('div','dual-list__col');x.appendChild(h('h2','dual-list__title',title));const ul=h('ul','editorial-list');items.forEach(v=>ul.appendChild(h('li','',v)));x.appendChild(ul);return x;};append(lists,buildList(t.catalysts,item.catalysts),buildList(t.risks,item.risks));main.appendChild(lists);main.appendChild(rule(t.changeMind));const ol=h('ol','change-list');item.changeMind.forEach(v=>ol.appendChild(h('li','',v)));main.appendChild(ol);main.appendChild(rule(t.revisionHistory));main.appendChild(h('p','empty-state',t.firstVersion));append(frag,main,footer());return frag;
}

function scorecardPage() {
  const t=strings();const theses=thesesNow();setPageMeta(`Market Ledger — ${t.nav.scorecard}`,t.scoreDek);const frag=document.createDocumentFragment();append(frag,masthead('scorecard'));const main=h('main','shell page');append(main,h('div','kicker',t.scoreKicker),h('h1','page-title',t.scoreTitle),h('p','page-dek',t.scoreDek));const stats=h('section','score-stats');[[t.tracked,String(theses.length)],[t.supported,'0'],[t.invalidated,'0'],[t.inconclusive,'0']].forEach(([k,v])=>{const x=h('div','score-stat');append(x,h('div','score-stat__value',v),h('div','score-stat__label',k));stats.appendChild(x);});main.appendChild(stats);main.appendChild(h('p','demo-disclaimer',t.demoScore));main.appendChild(rule(t.openReviews));const table=h('div','score-table');theses.forEach(th=>{const row=h('article','score-row');append(row,h('div','score-row__date',th.date),h('div','score-row__category',th.category),h('div','score-row__body'),badge(th.outcome,'muted'));const body=row.querySelector('.score-row__body');append(body,h('h3','score-row__thesis',th.thesis),h('p','score-row__evidence',th.evidence),h('div','score-row__horizon',`${t.reviewHorizon}: ${th.horizon}`));table.appendChild(row);});main.appendChild(table);append(frag,main,footer());return frag;
}

function whalesPage() {
  const t=strings();const localizedWhales=whalesNow();setPageMeta(`Market Ledger — ${t.nav.whales}`,t.whalesDek);const frag=document.createDocumentFragment();append(frag,masthead('whales'));const main=h('main','shell page');append(main,h('div','kicker',t.whalesKicker),h('h1','page-title',t.whalesTitle),h('p','page-dek',t.whalesDek));const filters=h('div','filter-row');const chain=h('select','filter-select');[[t.allChains,''],['Solana','Solana'],['Ethereum','Ethereum'],['Base','Base']].forEach(([label,val])=>{const o=h('option','',label);o.value=val;chain.appendChild(o);});const klass=h('select','filter-select');[[t.allClassifications,''],[t.noise,'Noise'],[t.interesting,'Interesting'],[t.highConviction,'High conviction']].forEach(([label,val])=>{const o=h('option','',label);o.value=val;klass.appendChild(o);});append(filters,chain,klass);main.appendChild(filters);main.appendChild(rule(t.trackedEvents));const list=h('section','whale-list');const draw=()=>{list.replaceChildren();const filtered=localizedWhales.filter(w=>(!chain.value||w.chain===chain.value)&&(!klass.value||w.classification===klass.value));if(!filtered.length){list.appendChild(h('p','empty-state',t.noEvents));return;}filtered.forEach(w=>list.appendChild(whaleRow(w)));};chain.addEventListener('change',draw);klass.addEventListener('change',draw);draw();main.appendChild(list);main.appendChild(rule(t.method));const method=h('section','method-grid');[[t.noise,t.noiseDesc],[t.interesting,t.interestingDesc],[t.highConviction,t.highDesc]].forEach(([a,b])=>{const x=h('article','method-card');append(x,h('h3','',a),h('p','',b));method.appendChild(x);});main.appendChild(method);append(frag,main,footer());return frag;
}

function notFound(message) {
  const t=strings();setPageMeta('Market Ledger — 404',message||t.notFoundTitle);const frag=document.createDocumentFragment();append(frag,masthead());const main=h('main','shell not-found');append(main,h('div','kicker',t.notFoundKicker),h('h1','page-title',t.notFoundTitle),h('p','page-dek',message||t.notFoundTitle),link(t.returnToday,withLang('/'),'text-link text-link--large'));append(frag,main,footer());return frag;
}

function normalizePath(pathname){return pathname.length>1&&pathname.endsWith('/')?pathname.slice(0,-1):pathname;}

function render(){
  document.documentElement.lang=lang;
  const path=normalizePath(location.pathname);let page;
  if(path==='/')page=home();
  else if(path==='/archive')page=archivePage();
  else if(path==='/ideas')page=ideasPage();
  else if(path==='/scorecard')page=scorecardPage();
  else if(path==='/whales')page=whalesPage();
  else if(path.startsWith('/edition/')){const date=path.slice('/edition/'.length);page=/^\d{4}-\d{2}-\d{2}$/.test(date)?editionPage(date):notFound(strings().badDate);}
  else if(path.startsWith('/ideas/')){const slug=path.slice('/ideas/'.length);const item=rawIdeas.find(i=>i.slug===slug);page=item?ideaPage(item):notFound(strings().noResearch);}
  else page=notFound();
  app.replaceChildren(page);
  if(location.hash){requestAnimationFrame(()=>document.querySelector(location.hash)?.scrollIntoView({block:'start'}));}
  else window.scrollTo({top:0,behavior:'instant'});
}

document.addEventListener('click',e=>{
  if(!(e.target instanceof Element))return;
  const a=e.target.closest('a');
  if(!(a instanceof HTMLAnchorElement)||a.origin!==location.origin||a.target||a.hasAttribute('download')||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const url=new URL(a.href);
  e.preventDefault();
  history.pushState({},'',url.pathname+url.search+url.hash);
  const q=url.searchParams.get('lang');if(q==='es'||q==='en')lang=q;
  render();
});
window.addEventListener('popstate',()=>{lang=initialLanguage();render();});
render();
