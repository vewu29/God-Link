process.env.PLAYWRIGHT_BROWSERS_PATH = require('path').join(process.env.HOME, 'workspace/.pw/browsers');
const pw = require(require('path').join(process.env.HOME, 'workspace/.pw/node_modules/playwright'));
(async()=>{const b=await pw[process.argv[2]].launch(process.argv[2]==='chromium'?{args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}:{});const p=await b.newPage();await p.goto('file://'+__dirname+'/../web/depth.html');console.log(process.argv[2],await p.evaluate(()=>window.D));await b.close();})();
