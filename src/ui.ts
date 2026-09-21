export function h<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function append(parent: Node, ...children: Array<Node | null | undefined | false>): void {
  for (const child of children) if (child) parent.appendChild(child);
}

export function link(label: string, href: string, className = ''): HTMLAnchorElement {
  const a = h('a', className, label);
  a.href = href;
  return a;
}

export function rule(label?: string): HTMLElement {
  const wrap = h('div', 'section-rule');
  if (label) append(wrap, h('span', 'section-rule__label', label));
  return wrap;
}

export function badge(text: string, tone: 'accent' | 'muted' | 'positive' | 'negative' = 'muted'): HTMLElement {
  return h('span', `badge badge--${tone}`, text);
}

export function setPageMeta(title: string, description: string): void {
  document.title = title;
  let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'description';
    document.head.appendChild(meta);
  }
  meta.content = description;
}
