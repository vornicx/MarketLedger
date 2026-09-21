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
  const header = h('header','brand-header');
  const bar = h('div','shell brand-header__bar');

  const brand = link('',withLang('/'),'brand-lockup');
  append(
    brand,
    h('span','brand-monogram','ML'),
    h('span','brand-divider',''),
    h('span','brand-copy')
  );
  const copy = brand.querySelector('.brand-copy');
  append(copy,h('strong','brand-name','MARKET LEDGER'),h('span','brand-strap',t.brandStrap));

  const nav = h('nav','brand-nav');
  nav.setAttribute('aria-label',lang==='es'?'Navegación principal':'Primary navigation');
  const items=[
    ['today',t.nav.today,'/'],
    ['ideas',t.nav.ideas,'/ideas'],
    ['whales',t.nav.whales,'/whales'],
    ['scorecard',t.nav.scorecard,'/scorecard'],
    ['archive',t.nav.archive,'/archive'],
  ];
  items.forEach(([key,label,href])=>nav.appendChild(link(label,withLang(href),`brand-nav__link${active===key?' is-active':''}`)));

  const utility=h('div','brand-header__utility');
  append(utility,languageSwitch(),link(t.readEdition,withLang(`/edition/${current.date}`),'brand-cta'));

  append(bar,brand,nav,utility);
  header.appendChild(bar);
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

function splitMarketValue(value, note='') {
  const dotParts=value.split('·').map(x=>x.trim()).filter(Boolean);
  if(dotParts.length>=2) return {price:dotParts[0],change:dotParts.slice(1).join(' · ')};
  if(value.includes('→')) {
    const parts=value.split('→').map(x=>x.trim());
    return {price:parts[parts.length-1],change:note.toLowerCase().includes('high')?(lang==='es'?'Máximo de 8 meses':'8-month high'):(lang==='es'?'Sesión alcista':'Session high')};
  }
  return {price:value,change:''};
}

function marketLogo(symbol) {
  const wrap=h('span',`market-logo market-logo--${symbol.toLowerCase()}`);
  if(symbol==='BTC') wrap.textContent='₿';
  else if(symbol==='ETH') {
    append(wrap,h('span','eth-diamond eth-diamond--top',''),h('span','eth-diamond eth-diamond--bottom',''));
  } else if(symbol==='SOL') {
    append(wrap,h('span','sol-bar',''),h('span','sol-bar',''),h('span','sol-bar',''));
  } else if(symbol==='BRENT') wrap.textContent='●';
  else if(symbol==='STOXX') wrap.textContent='EU';
  else if(symbol==='IBEX') wrap.textContent='ES';
  else wrap.textContent=symbol.slice(0,2);
  return wrap;
}

function marketPulse(current = editionNow()) {
  const t=strings();
  const priority=['STOXX','IBEX','BTC','ETH','SOL','BRENT'];
  const items=priority.map(symbol=>current.indicators.find(i=>i.symbol===symbol)).filter(Boolean);
  const section=h('section','premium-section market-pulse');
  section.id='market-pulse';

  const head=h('div','premium-section__head');
  const titles=h('div','premium-section__titles');
  append(titles,h('h2','premium-section__title',t.marketPulse),h('span','premium-section__eyebrow',lang==='es'?'Mercados reales. Snapshot de la edición.':'Real markets. Edition snapshot.'));
  append(head,titles,link(t.viewAllData,withLang(`/edition/${current.date}#snapshot`),'section-link'));
  section.appendChild(head);

  const grid=h('div','market-cards');
  items.forEach(item=>{
    const parsed=splitMarketValue(item.value,item.note);
    const card=link('',withLang(`/edition/${current.date}#snapshot`),`market-card market-card--${item.state||'neutral'}`);
    const top=h('div','market-card__top');
    const identity=h('div','market-card__identity');
    append(identity,marketLogo(item.symbol),h('div','market-card__name'));
    const name=identity.querySelector('.market-card__name');
    append(name,h('strong','',item.label),h('span','',item.symbol));
    append(top,identity,h('span','market-card__arrow','›'));

    const quote=h('div','market-card__quote');
    append(quote,h('strong','market-card__price',parsed.price),h('span','market-card__change',parsed.change));

    const move=h('div','market-card__move');
    const rail=h('div','market-card__rail');
    rail.appendChild(h('span','market-card__rail-fill',''));
    move.appendChild(rail);

    const foot=h('div','market-card__foot');
    append(foot,h('span','market-card__period','1D'),h('span','market-card__source',item.note));

    append(card,top,quote,move,foot);
    grid.appendChild(card);
  });
  section.appendChild(grid);
  return section;
}

function quickRead(current = editionNow()) {
  const t=strings();
  const labels=[t.changed,t.reaction,t.mainRisk];
  const glyphs=['▥','↗','△'];
  const section=h('section','premium-section quick-read');
  section.id='overview';

  const head=h('div','premium-section__head');
  const titles=h('div','premium-section__titles');
  append(titles,h('h2','premium-section__title',t.sixtySeconds),h('span','premium-section__eyebrow',lang==='es'?'El contexto clave, sin ruido.':'The key context, without the noise.'));
  head.appendChild(titles);
  section.appendChild(head);

  const grid=h('div','quick-read__grid');
  current.brief.slice(0,3).forEach((text,i)=>{
    const item=h('article',`quick-read__item quick-read__item--${i}`);
    append(item,h('div','quick-read__glyph',glyphs[i]),h('div','quick-read__content'),h('span','quick-read__chevron','›'));
    const content=item.querySelector('.quick-read__content');
    append(content,h('h3','quick-read__label',labels[i]||''),h('p','quick-read__text',text));
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

function storyMedia(id) {
  const map={
    hero:{
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/NYSE%20facade.jpg?width=1800',
      alt:lang==='es'?'Fachada de la Bolsa de Nueva York en Wall Street':'New York Stock Exchange facade on Wall Street',
      credit:'NYSE · Wikimedia Commons',
      href:'https://commons.wikimedia.org/wiki/File:NYSE_facade.jpg'
    },
    'oil-relief':{
      src:'https://images.unsplash.com/photo-1759956214507-af3b18cf292f?auto=format&fit=crop&w=1200&q=82',
      alt:lang==='es'?'Plataforma petrolífera marina':'Offshore oil platform',
      credit:'Oil platform · Unsplash',
      href:'https://unsplash.com/s/photos/offshore-oil-rig'
    },
    'crypto-breakout':{
      src:'https://images.unsplash.com/photo-1671723421822-0044e89e4618?auto=format&fit=crop&w=1200&q=82',
      alt:lang==='es'?'Moneda física de Bitcoin':'Physical Bitcoin coin',
      credit:'Bitcoin · Unsplash',
      href:'https://unsplash.com/photos/i-ExpRgiSYo'
    },
    'fed-ceiling':{
      src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Eccles%20Federal%20Reserve%20Board%20Building.jpg?width=1200',
      alt:lang==='es'?'Edificio de la Reserva Federal en Washington':'Federal Reserve Board building in Washington',
      credit:'Federal Reserve · Wikimedia Commons',
      href:'https://commons.wikimedia.org/wiki/File:Eccles_Federal_Reserve_Board_Building.jpg'
    }
  };
  return map[id]||map.hero;
}

function mediaFigure(meta,className) {
  const figure=h('figure',className);
  const img=h('img',className+'__img');
  img.src=meta.src;
  img.alt=meta.alt;
  img.loading=className.includes('hero')?'eager':'lazy';
  img.decoding='async';
  const cap=link(meta.credit,meta.href,className+'__credit');
  cap.target='_blank';
  cap.rel='noreferrer';
  append(figure,img,cap);
  return figure;
}

function home() {
  const t=strings();
  const current=editionNow();
  setPageMeta('Market Ledger — Daily Brief',current.dek);
  const frag=document.createDocumentFragment();
  append(frag,masthead('today'));

  const main=h('main','shell premium-home');

  const hero=h('section','premium-hero');
  const copy=h('div','premium-hero__copy');
  const meta=h('div','premium-hero__meta');
  append(meta,h('span','',current.displayDate),h('span','premium-hero__edition',t.lastUpdate));
  append(
    copy,
    h('div','premium-hero__label',t.leadLabel),
    meta,
    h('h1','premium-hero__headline',current.headline),
    h('p','premium-hero__dek',current.dek)
  );
  const actions=h('div','premium-hero__actions');
  append(actions,link(t.readEdition,withLang(`/edition/${current.date}`),'premium-button'),link(t.briefing,withLang('#overview'),'premium-text-link'));
  copy.appendChild(actions);

  const notes=h('div','premium-hero__notes');
  [t.calmerSignals,t.broaderView,t.certainTomorrow].forEach((label,i)=>{
    const n=h('div','premium-hero__note');
    const text=(current.brief[i]||'').split('. ')[0]+'.';
    append(n,h('span','premium-hero__note-label',label),h('p','',text));
    notes.appendChild(n);
  });
  copy.appendChild(notes);

  const visual=mediaFigure(storyMedia('hero'),'premium-hero__visual');
  const visualCopy=h('div','premium-hero__visual-copy');
  append(visualCopy,h('div','premium-hero__visual-title',t.premiumPromise),h('div','premium-hero__visual-rule',''),h('p','premium-hero__visual-caption',t.disciplineLine));
  visual.appendChild(visualCopy);
  append(hero,copy,visual);
  main.appendChild(hero);

  main.appendChild(quickRead(current));
  main.appendChild(marketPulse(current));

  const stories=h('section','premium-section premium-stories');
  stories.id='stories';
  const storiesHead=h('div','premium-section__head');
  const storiesTitles=h('div','premium-section__titles');
  append(storiesTitles,h('h2','premium-section__title',t.topStories),h('span','premium-section__eyebrow',lang==='es'?'Tres piezas. Una visión más nítida.':'Three stories. A sharper view.'));
  append(storiesHead,storiesTitles,link(t.fullEdition,withLang(`/edition/${current.date}`),'section-link'));
  stories.appendChild(storiesHead);

  const storyGrid=h('div','premium-stories__grid');
  ['oil-relief','crypto-breakout','fed-ceiling'].forEach((id,index)=>{
    const story=current.stories.find(s=>s.id===id);
    if(!story)return;
    const card=link('',withLang(`/edition/${current.date}#${story.id}`),'premium-story');
    const media=storyMedia(story.id);
    const visual=mediaFigure(media,`premium-story__visual premium-story__visual--${story.id}`);
    append(visual,h('span','premium-story__rank',String(index+1)));
    const body=h('div','premium-story__body');
    append(
      body,
      h('div','premium-story__category',story.category),
      h('h3','premium-story__title',story.title),
      h('p','premium-story__dek',story.dek),
      h('div','premium-story__foot',t.readStory)
    );
    append(card,visual,body);
    storyGrid.appendChild(card);
  });
  stories.appendChild(storyGrid);
  main.appendChild(stories);

  const scenarios=h('section','premium-section premium-scenarios');
  scenarios.id='scenarios';
  const sHead=h('div','premium-section__head');
  const sTitles=h('div','premium-section__titles');
  append(sTitles,h('h2','premium-section__title',t.playbook),h('span','premium-section__eyebrow',lang==='es'?'Tres caminos. Plan por delante.':'Three paths. Plan ahead.'));
  sHead.appendChild(sTitles);
  scenarios.appendChild(sHead);
  const sGrid=h('div','premium-scenarios__grid');
  current.scenarios.forEach((s,i)=>{
    const row=h('article',`premium-scenario premium-scenario--${s.tone}`);
    const glyph=i===0?'↗':i===1?'—':'↓';
    append(row,h('span','premium-scenario__icon',glyph),h('div','premium-scenario__copy'));
    const sc=row.querySelector('.premium-scenario__copy');
    append(sc,h('div','premium-scenario__top'),h('p','premium-scenario__text',s.thesis));
    const top=sc.querySelector('.premium-scenario__top');
    append(top,h('strong','',s.name));
    sGrid.appendChild(row);
  });
  scenarios.appendChild(sGrid);
  main.appendChild(scenarios);

  const bottom=h('section','premium-bottom-grid');

  const watch=h('div','premium-module premium-watch');
  const watchHead=h('div','premium-module__head');
  append(watchHead,h('h2','premium-module__title',t.watchlist),h('span','premium-module__eyebrow',lang==='es'?'Niveles clave. Lecturas claras.':'Key levels. Clear stances.'));
  watch.appendChild(watchHead);
  const table=h('div','premium-watch__table');
  current.watchlist.slice(0,4).forEach(item=>{
    const indicator=current.indicators.find(i=>i.symbol===item.asset.toUpperCase()||i.label.toLowerCase().includes(item.asset.toLowerCase()));
    const row=h('div','premium-watch__row');
    append(row,h('strong','premium-watch__asset',item.asset),h('span','premium-watch__trigger',item.reason),h('span','premium-watch__stance',item.status));
    table.appendChild(row);
  });
  watch.appendChild(table);

  const whale=h('div','premium-module premium-whale');
  const whaleHead=h('div','premium-module__head');
  append(whaleHead,h('h2','premium-module__title',t.whaleWatch),link(t.walletJournal,withLang('/whales'),'section-link'));
  whale.appendChild(whaleHead);
  const localizedWhales=whalesNow();
  if(localizedWhales.length){
    localizedWhales.slice(0,2).forEach((w,i)=>{
      const row=h('div','premium-signal-row');
      append(row,h('span','premium-signal-row__icon',i===0?'◉':'◇'),h('div','premium-signal-row__copy'),h('span','premium-signal-row__time',w.time||''));
      const cp=row.querySelector('.premium-signal-row__copy');
      append(cp,h('strong','',`${w.token} · ${w.action}`),h('span','',w.note));
      whale.appendChild(row);
    });
  }else{
    const empty=h('div','premium-empty');
    append(empty,h('span','premium-empty__icon','◌'),h('div','premium-empty__copy'));
    const ec=empty.querySelector('.premium-empty__copy');
    append(ec,h('strong','',t.noWhaleSignal),h('span','',t.noWhaleSignalCopy));
    whale.appendChild(empty);
  }

  const research=h('div','premium-module premium-research');
  const rHead=h('div','premium-module__head');
  append(rHead,h('h2','premium-module__title',t.researchIdeas),link((lang==='es'?'Ver todas':'See all')+' →',withLang('/ideas'),'section-link'));
  research.appendChild(rHead);
  ideasNow().slice(0,3).forEach((idea,i)=>{
    const row=link('',withLang(`/ideas/${idea.slug}`),'premium-research__row');
    append(row,h('span','premium-research__index',String(i+1).padStart(2,'0')),h('div','premium-research__copy'),h('span','premium-research__arrow','›'));
    const cp=row.querySelector('.premium-research__copy');
    append(cp,h('strong','',idea.title),h('span','',idea.summary));
    research.appendChild(row);
  });

  append(bottom,watch,whale,research);
  main.appendChild(bottom);

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
