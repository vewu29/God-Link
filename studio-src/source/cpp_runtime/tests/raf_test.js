process.env.PLAYWRIGHT_BROWSERS_PATH = require('path').join(process.env.HOME, 'workspace/.pw/browsers');
const pw = require(require('path').join(process.env.HOME, 'workspace/.pw/node_modules/playwright'));
(async()=>{const b=await pw[process.argv[2]].launch();const p=await b.newPage();await p.goto('file://'+__dirname+'/../web/raf.html');await p.waitForTimeout(3500);console.log(process.argv[2],'plain rAF fps',await p.evaluate(()=>window.FPS));await b.close();})();
