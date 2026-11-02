const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const PROJ=process.env.PROJ, OUT=process.env.OUT, FONTS=__dirname+'/fonts/node_modules/@fontsource';
const files=process.argv.slice(2);
function css(){let c='';
for(const w of [400,500,600,700,800]) c+=`@font-face{font-family:'Bricolage Grotesque';font-weight:${w};src:url(http://fonts.local/b-${w}.woff2) format('woff2')}\n`;
for(const w of [400,700]) c+=`@font-face{font-family:'Space Mono';font-weight:${w};src:url(http://fonts.local/m-${w}.woff2) format('woff2')}\n`;return c}
(async()=>{const b=await chromium.launch();
for(const f of files){
 const [name,w,h]=f.split(':');const W=+w||390,H=+h||844;
 const ctx=await b.newContext({viewport:{width:W,height:H},deviceScaleFactor:2});const p=await ctx.newPage();
 p.on('console',m=>{if(m.type()==='error')console.log('ERR',name,m.text().slice(0,200))});
 await p.route('**/*',async r=>{const u=new URL(r.request().url());
  if(u.host==='fonts.googleapis.com')return r.fulfill({contentType:'text/css',body:css()});
  if(u.host==='fonts.local'){const m=u.pathname.match(/\/([bm])-(\d+)/);const pk=m[1]==='b'?'bricolage-grotesque':'space-mono';
    return r.fulfill({contentType:'font/woff2',body:fs.readFileSync(`${FONTS}/${pk}/files/${pk}-latin-${m[2]}-normal.woff2`)})}
  if(u.host==='proj.local'){let fp=path.join(PROJ,decodeURIComponent(u.pathname));if(u.pathname==='/support.js')fp=__dirname+'/support.js';
    if(fs.existsSync(fp))return r.fulfill({body:fs.readFileSync(fp),contentType:fp.endsWith('.js')?'text/javascript':'text/html'});return r.fulfill({status:404,body:''})}
  r.abort()});
 await p.goto('http://proj.local/'+name+'.dc.html');await p.waitForTimeout(1500);
 await p.screenshot({path:`${OUT}/${name}.png`});await ctx.close();console.log('ok',name)}
await b.close()})();
