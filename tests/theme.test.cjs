const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../shared/theme.js'), 'utf8');
function boot({ dark = false, saved = null, blocked = false } = {}) {
  const events = {}, docEvents = {}, system = { matches: dark, addEventListener(_, fn) { this.change = fn; } };
  let value = saved, meta;
  const select = { value: '', addEventListener(_, fn) { this.change = fn; } };
  const document = {
    documentElement: { dataset: {}, style: {} },
    head: { appendChild(node) { meta = node; } }, body: { appendChild() {} },
    querySelector() { return meta; },
    createElement(tag) { return tag === 'label' ? { querySelector() { return select; } } : {}; },
    addEventListener(name, fn) { docEvents[name] = fn; }
  };
  const localStorage = {
    getItem() { if (blocked) throw Error('blocked'); return value; },
    setItem(_, v) { if (blocked) throw Error('blocked'); value = v; }
  };
  vm.runInNewContext(source, { document, localStorage, window: {
    matchMedia() { return system; }, addEventListener(name, fn) { events[name] = fn; }
  } });
  return { document, system, select, events, docEvents, saved: () => value, meta: () => meta };
}
for (const dark of [false, true]) {
  const app = boot({ dark });
  assert.equal(app.document.documentElement.dataset.theme, dark ? 'dark' : 'light');
  app.system.matches = !dark; app.system.change();
  assert.equal(app.document.documentElement.dataset.theme, dark ? 'light' : 'dark');
}
const app = boot({ dark: true, saved: 'light' });
assert.equal(app.document.documentElement.dataset.theme, 'light');
app.docEvents.DOMContentLoaded();
app.select.value = 'dark'; app.select.change();
assert.equal(app.saved(), 'dark');
assert.equal(app.meta().content, '#171020');
app.system.matches = false; app.system.change();
assert.equal(app.document.documentElement.dataset.theme, 'dark');
app.select.value = 'system'; app.select.change();
assert.equal(app.document.documentElement.dataset.theme, 'light');
app.events.storage({ key: 'carta-appearance', newValue: 'dark' });
assert.equal(app.document.documentElement.dataset.theme, 'dark');
app.events.pageshow();
assert.equal(app.document.documentElement.dataset.theme, 'light');
assert.equal(boot({ saved: 'invalid', dark: true }).document.documentElement.dataset.theme, 'dark');
const privateMode = boot({ blocked: true, dark: true });
privateMode.docEvents.DOMContentLoaded();
privateMode.select.value = 'light'; privateMode.select.change();
assert.equal(privateMode.document.documentElement.dataset.theme, 'light');
const repo = path.join(__dirname, '..');
const pages = ['index.html', ...fs.readdirSync(path.join(repo, 'designs')).filter(x => x.endsWith('.html')).map(x => `designs/${x}`)];
for (const page of pages) {
  const html = fs.readFileSync(path.join(repo, page), 'utf8');
  assert.equal((html.match(/src="(?:\.\.\/)?shared\/theme.js"/g) || []).length, 1, page);
  assert.equal((html.match(/href="(?:\.\.\/)?shared\/theme.css"/g) || []).length, 1, page);
  assert.ok(html.indexOf('theme.js') < html.indexOf('<style>'), 'theme must apply before first paint');
  assert.ok(html.indexOf('theme.css') > html.indexOf('</style>'), 'shared palette must override layout colors');
}
console.log(`PASS: automatic mode, live system changes, manual override, persistence, tab sync, back navigation, storage failure, and ${pages.length} pages.`);
