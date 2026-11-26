// node tests/demo_test.js <webkit|chromium> <wasm> [seconds]
process.env.PLAYWRIGHT_BROWSERS_PATH = process.env.PLAYWRIGHT_BROWSERS_PATH || require('path').join(process.env.HOME, 'workspace/.pw/browsers');
const path = require('path');
const pw = require(path.join(process.env.HOME, 'workspace/.pw/node_modules/playwright'));
const http = require('http'), fs = require('fs');
const root = path.join(__dirname, '..', 'web');
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split('?')[0])); if (!fs.existsSync(f)) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': f.endsWith('.js') ? 'text/javascript' : f.endsWith('.html') ? 'text/html' : 'application/wasm' }); r.end(fs.readFileSync(f)); }).listen(0);
(async () => {
  const bn = process.argv[2] || 'chromium', w = process.argv[3] || 'ball.async.wasm', secs = +(process.argv[4] || 4);
  const b = await pw[bn].launch(bn === 'chromium' ? { args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] } : {});
  const p = await b.newPage({ viewport: { width: 900, height: 600 } });
  p.on('console', m => console.log('console:', m.text())); p.on('pageerror', e => console.log('pageerror:', e.message));
  await p.goto(`http://127.0.0.1:${srv.address().port}/demo.html?w=${w}`);
  await p.waitForTimeout(secs * 1000);
  const st = await p.evaluate(() => window.R && window.R.stats());
  console.log('stats', JSON.stringify(st));
  await p.screenshot({ path: path.join(__dirname, '..', 'shots', `demo_${bn}_${w.replace(/\W/g, '_')}.png`) });
  await p.keyboard.down('Space'); await p.waitForTimeout(100); await p.keyboard.up('Space');
  await p.evaluate(() => window.R.stop());
  await p.waitForFunction(() => window.RESULT, null, { timeout: 5000 }).catch(() => {});
  console.log('result', JSON.stringify(await p.evaluate(() => window.RESULT)), 'out:', await p.evaluate(() => document.getElementById('o').textContent.slice(-400)));
  await b.close(); srv.close();
})();
