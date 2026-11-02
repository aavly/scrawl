// registers each non-board screen as phone (390x844) and desktop (1440x900, "D-" prefix) from one builder
const C=require('./common');const {INK,CO,BG,MI,BU,CR,WH,mono,pill,card,icon,iconBtn,btn,slam,chip,avatar,lockedAvatar,F,M,castOf,CAST,pips,houseTag,ME}=C;
const L=C;
const TILES=(s=64)=>{const t=(l,bg,fg=INK,r=0)=>`<span style="width:${s}px;height:${s}px;border:3px solid ${INK};border-radius:${s*.22}px;background:${bg};color:${fg};box-shadow:0 4px 0 ${INK};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:${s*.5}px;transform:rotate(${r}deg)">${l}</span>`;
 return `<div style="display:grid;grid-template-columns:repeat(2,${s}px);gap:8px">${t('F',BG,INK,-4)}${t('I',WH,INK,3)}${t('N',MI,INK,2)}${t('D',CO,WH,-3)}</div>`};
const logo=(s=34)=>{const cols=[[BG,'S'],[WH,'C'],[MI,'R'],[WH,'A'],[CO,'W'],[BG,'L']];return `<span style="display:inline-flex;gap:4px">${cols.map(([b,l],i)=>`<span style="width:${s}px;height:${s}px;border:3px solid ${INK};border-radius:${s*.24}px;background:${b};color:${b===CO?WH:INK};box-shadow:0 3px 0 ${INK};display:flex;align-items:center;justify-content:center;font-weight:800;font-size:${s*.55}px;transform:rotate(${[-4,2,-2,3,-3,2][i]}deg)">${l}</span>`).join('')}</span>`};
const REG=[];
function S(name,title,build,o={}){
 const themes=o.themes||['light'];
 for(const th of themes){const sfx=th==='dark'?'-Dark':'';
  C.phone(name+sfx,title,th,build({d:false,th}),{dots:!!o.dots,pad:o.pad,gap:o.gap,pre:o.pre?o.pre({d:false,th}):'',post:o.post?o.post({d:false,th}):''});
  if(!o.noDesk) desk(name+sfx,title+' (desktop)',th,build({d:true,th}),o);
 }}
const NAV=['Play','Practice','Ranks','Profile'];
const NAVHREF={Play:'Home.dc.html',Practice:'Practice.dc.html',Ranks:'Leaderboard.dc.html',Profile:'Profile.dc.html'};
function topnav(active,guest){return `<div style="height:76px;flex:none;display:flex;align-items:center;gap:28px;padding:0 40px;box-sizing:border-box;border-bottom:3px solid var(--line);background:var(--card);color:var(--card-text)">${logo(32)}<div style="display:flex;gap:10px;flex:1;margin-left:20px">${NAV.map(n=>`<a href="${NAVHREF[n]}" style="padding:7px 20px;border:3px solid var(--line);border-radius:99px;background:${n===active?INK:'transparent'};color:${n===active?BU:'var(--card-text)'};font-weight:800;font-size:18px;text-decoration:none;${n===active?'':'border-color:transparent'}">${n}</a>`).join('')}</div>
 ${guest?`<span style="font-family:${M};font-weight:700;font-size:11px;letter-spacing:.06em">GUEST</span><a href="SignIn.dc.html" style="padding:8px 18px;border:3px solid var(--line);border-radius:99px;background:${INK};color:${WH};font-weight:800;font-size:16px;text-decoration:none">Sign in</a>`:`<div style="display:flex;align-items:center;gap:10px">${avatar(ME.av,44,{badge:false})}<div style="display:flex;flex-direction:column;gap:2px;align-items:flex-start"><span style="font-weight:800;font-size:17px;line-height:1">wordfox_</span>${chip('GOLD II',{size:'s'})}</div></div>`}</div>`}
function desk(name,title,theme,inner,o={}){
 const w=o.colW||520,dots=!!o.dots,z=o.z||1.25;
 const confettiShapes=o.dots?'':`<svg width="1440" height="900" viewBox="0 0 1440 900" style="position:absolute;inset:0;pointer-events:none" aria-hidden="true"><rect x="86" y="230" width="22" height="22" rx="5" fill="#FF5FA2" stroke="#141414" stroke-width="3" transform="rotate(20 97 241)"/><circle cx="1330" cy="180" r="12" fill="#2F4BFF" stroke="#141414" stroke-width="3"/><polygon points="1350,640 1372,680 1328,680" fill="#19D3A2" stroke="#141414" stroke-width="3" stroke-linejoin="round"/><circle cx="120" cy="760" r="10" fill="#19D3A2" stroke="#141414" stroke-width="3"/></svg>`;
 const nav=o.nav===false?`<div style="height:76px;flex:none;display:flex;align-items:center;padding:0 40px;gap:20px">${logo(30)}<span style="flex:1"></span>${o.navRight||''}</div>`:topnav(o.nav||'Play',o.guest);
 L.page('D-'+name.replace(/^D-/,''),title,{theme,w:1440,h:900,dots,body:`${confettiShapes}<div style="position:relative;z-index:1;height:100%;display:flex;flex-direction:column">${nav}<div style="flex:1;min-height:0;display:flex;justify-content:center;padding:${o.dpad||'20px 0 20px'};box-sizing:border-box"><div style="width:${w}px;zoom:${z};display:flex;flex-direction:column;gap:${o.gap??16}px;${o.dx||''}">${inner}</div></div></div>${o.dpost?o.dpost:''}`});
}
// patch: S registers D- via desk() which calls L.page with the D- name; avoid double prefix
module.exports={...C,S,desk,logo,TILES,topnav,REG};
