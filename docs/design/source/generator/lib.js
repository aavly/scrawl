const fs=require('fs');const path=require('path');
const A=require('./avatars');
const {INK,CO,BG,MI,BU,CR,WH}=A;
const OUT=process.env.OUTDIR||path.join(__dirname,'../wh/project');
const FONT='https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&family=Space+Mono:wght@400;700&display=swap';
const CSS=`body{margin:0}a{color:inherit}.sc{--bg:#FFD84A;--dot:rgba(20,20,20,.13);--text:#141414;--muted:#3B3B3B;--card:#FFFFFF;--card-text:#141414;--line:#141414;--shadow:#141414;--tile:#FFFFFF;--board:#2F4BFF;--soft:rgba(20,20,20,.08)}
.sc-dark{--bg:#17142E;--dot:rgba(255,246,214,.07);--text:#FFF6D6;--muted:#C9C3E8;--card:#2A2552;--card-text:#FFF6D6;--line:#0B0A1A;--shadow:#0B0A1A;--soft:rgba(255,246,214,.1)}
.sc-dark .keep{background:#FFFFFF;color:#141414}
@keyframes sc-slam{0%{transform:rotate(-3deg) scale(1.6);opacity:0}60%{transform:rotate(-3deg) scale(.95);opacity:1}100%{transform:rotate(-3deg) scale(1);opacity:1}}
@keyframes sc-pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
.sc a{cursor:pointer}`;
const F=`'Bricolage Grotesque', system-ui, sans-serif`, M=`'Space Mono', monospace`;
let MANIFEST=[];
// page shell. w,h frame; dots on/off
function page(name,title,{theme='light',w=390,h=844,dots=false,body,pad=''}){
 const dk=theme==='dark';
 const html=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${title}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<link rel="stylesheet" href="${FONT}">
<style>
${CSS}
</style>
</helmet>
<div class="sc ${dk?'sc-dark':''}" style="position: relative; width: ${w}px; height: ${h}px; overflow: hidden; background-color: var(--bg); ${dots?'background-image: radial-gradient(var(--dot) 1.5px, transparent 1.6px); background-size: 18px 18px; ':''}font-family: ${F}; color: var(--text)">
${body}
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"$preview":{"width":${w},"height":${h}}}'>
class Component extends DCLogic {
renderVals() { return {}; }
}
</script>
</body>
</html>
`;
 fs.writeFileSync(path.join(OUT,name+'.dc.html'),html);
 MANIFEST.push({name,title,w,h,theme});
}
// ---- primitives
const mono=(t,s=11,x='')=>`<span style="font-family:${M};font-weight:700;font-size:${s}px;letter-spacing:.06em;${x}">${t}</span>`;
const pill=(t,bg=BU,fg=INK,x='')=>`<span style="padding:1px 10px;border:2px solid var(--line);border-radius:99px;background:${bg};color:${fg};font-family:${M};font-weight:700;font-size:11px;white-space:nowrap;${x}">${t}</span>`;
const card=(inner,o={})=>`<div style="background:${o.bg||'var(--card)'};color:${o.fg||'var(--card-text)'};border:3px ${o.dashed?'dashed':'solid'} var(--line);border-radius:${o.r||22}px;${o.noshadow?'':`box-shadow:${o.sh||'4px 5px 0'} var(--shadow);`}padding:${typeof o.pad==="string"?o.pad:(o.pad??14)+"px"};box-sizing:border-box;${o.x||''}">${inner}</div>`;
const ic={
 back:'<path d="M15 5l-7 7 7 7"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>',
 play:'<path d="M7 4l13 8-13 8z" fill="currentColor"/>',trophy:'<path d="M8 4h8v6a4 4 0 0 1-8 0z"/><path d="M8 6H4v2a4 4 0 0 0 4 4M16 6h4v2a4 4 0 0 1-4 4M12 14v4M8 20h8"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.5 3.5-7 8-7s8 2.5 8 7"/>',pencil:'<path d="M4 20l1-5L16 4l4 4L9 19z"/>',check:'<path d="M5 12l5 5 9-10"/>',x:'<path d="M6 6l12 12M18 6L6 18"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',mail:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M4 8l8 6 8-6"/>',
 wifioff:'<path d="M3 3l18 18M5 9.5a11 11 0 0 1 4-2.2M19 9.5a11 11 0 0 0-5.5-2.9M8.5 13a6 6 0 0 1 2.5-1.4M15.5 13a6 6 0 0 0-1.5-1.1M12 18h.01"/>',
 flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',refresh:'<path d="M20 11a8 8 0 0 0-14-4M4 4v4h4M4 13a8 8 0 0 0 14 4M20 20v-4h-4"/>',
 arrow:'<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',sound:'<path d="M4 9v6h4l5 4V5L8 9zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 close:'<path d="M6 6l12 12M18 6L6 18"/>',globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
 out:'<path d="M9 4H5v16h4M16 8l4 4-4 4M20 12H9"/>',link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
 alert:'<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',cursor:'<path d="M5 3l14 7-6 2-2 6z" fill="currentColor"/>',
};
const icon=(n,s=22,sw=3,x='')=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex:none;${x}">${ic[n]}</svg>`;
const iconBtn=(n,href,label,s=44)=>`<a href="${href}" aria-label="${label}" style="width:${s}px;height:${s}px;flex:none;border-radius:50%;border:3px solid var(--line);background:var(--card);color:var(--card-text);box-sizing:border-box;display:flex;align-items:center;justify-content:center;text-decoration:none">${icon(n,s/2)}</a>`;
const btn=(label,href='#',o={})=>`<a href="${href}" style="width:${o.w||'100%'};height:${o.h||76}px;box-sizing:border-box;border:3px solid var(--line);border-radius:${o.r||24}px;background:${o.bg||CO};color:${o.fg||WH};box-shadow:0 ${o.sh??7}px 0 var(--shadow);display:flex;align-items:center;justify-content:center;gap:12px;text-decoration:none;font-weight:800;font-size:${o.size||30}px;${o.x||''}"><span>${label}</span>${o.icon?icon(o.icon,o.size?o.size*.8:24):''}</a>`;
const slam=(t,bg=MI,s=40,fg=INK)=>`<div style="padding:4px 22px;border:4px solid ${INK};border-radius:18px;background:${bg};color:${fg};font-weight:800;font-size:${s}px;line-height:1.05;letter-spacing:.02em;box-shadow:5px 6px 0 var(--shadow);animation:sc-slam .5s ease-out forwards;text-align:center">${t}</div>`;
const confetti=`<svg width="390" height="200" viewBox="0 0 390 200" style="position:absolute;left:0;top:40px;z-index:0;pointer-events:none" aria-hidden="true"><rect x="24" y="34" width="14" height="14" rx="3" fill="#FF5FA2" stroke="#141414" stroke-width="2" transform="rotate(20 31 41)"/><circle cx="352" cy="30" r="8" fill="#2F4BFF" stroke="#141414" stroke-width="2"/><polygon points="344,98 358,124 330,124" fill="#19D3A2" stroke="#141414" stroke-width="2" stroke-linejoin="round"/><rect x="40" y="108" width="12" height="12" rx="3" fill="#FFFFFF" stroke="#141414" stroke-width="2" transform="rotate(-25 46 114)"/><polygon points="84,8 98,34 70,34" fill="#2F4BFF" stroke="#141414" stroke-width="2" stroke-linejoin="round"/><circle cx="18" cy="76" r="7" fill="#19D3A2" stroke="#141414" stroke-width="2"/></svg>`;

// ---- tiers
const TIERS=[
 {k:'bronze2',n:'BRONZE II',min:1200,bg:'#E39A5B',fg:INK,shape:'shield1'},{k:'bronze1',n:'BRONZE I',min:1300,bg:'#E39A5B',fg:INK,shape:'shield2'},
 {k:'silver2',n:'SILVER II',min:1400,bg:'#DADDE8',fg:INK,shape:'shield1'},{k:'silver1',n:'SILVER I',min:1500,bg:'#DADDE8',fg:INK,shape:'shield2'},
 {k:'gold2',n:'GOLD II',min:1600,bg:BU,fg:INK,shape:'star1'},{k:'gold1',n:'GOLD I',min:1700,bg:BU,fg:INK,shape:'star2'},
 {k:'plat2',n:'PLATINUM II',min:1800,bg:'#9FE8F2',fg:INK,shape:'hex1'},{k:'plat1',n:'PLATINUM I',min:1900,bg:'#9FE8F2',fg:INK,shape:'hex2'},
 {k:'dia2',n:'DIAMOND II',min:2000,bg:CO,fg:WH,shape:'gem1'},{k:'dia1',n:'DIAMOND I',min:2100,bg:CO,fg:WH,shape:'gem2'},
 {k:'legend',n:'LEGEND',min:2200,bg:INK,fg:BU,shape:'crown'},
];
const glyph=(shape,c)=>{const s=`fill="${c}" stroke="${c}" stroke-width="1.2" stroke-linejoin="round"`;
 const base={shield1:`<path d="M12 2l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5z" ${s}/>`,shield2:`<path d="M12 2l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5z" ${s}/>`,
 star1:`<path d="M12 2l3 7 7 .6-5.3 4.7 1.7 7L12 17.5 5.6 21.3l1.7-7L2 9.6 9 9z" ${s}/>`,star2:`<path d="M12 2l3 7 7 .6-5.3 4.7 1.7 7L12 17.5 5.6 21.3l1.7-7L2 9.6 9 9z" ${s}/>`,
 hex1:`<path d="M12 2l9 5v10l-9 5-9-5V7z" ${s}/>`,hex2:`<path d="M12 2l9 5v10l-9 5-9-5V7z" ${s}/>`,
 gem1:`<path d="M6 3h12l4 6-10 13L2 9z" ${s}/>`,gem2:`<path d="M6 3h12l4 6-10 13L2 9z" ${s}/>`,
 crown:`<path d="M2 18L4 7l5 5 3-8 3 8 5-5 2 11z" ${s}/>`}[shape];
 const dots=shape.endsWith('1')?'<circle cx="12" cy="12" r="2" fill="#141414"/>':shape.endsWith('2')?'<circle cx="9.5" cy="12" r="1.8" fill="#141414"/><circle cx="14.5" cy="12" r="1.8" fill="#141414"/>':'';
 return `<svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">${base}${shape==='crown'?'':dots.replace(/#141414/g,c==='#FFFFFF'?'#2F4BFF':INK)}</svg>`};
function tierOf(r){let t=TIERS[0];for(const x of TIERS)if(r>=x.min)t=x;return t}
function chip(tierName,o={}){const t=TIERS.find(x=>x.n===tierName||x.k===tierName)||TIERS[4];const s=o.size||'m';
 const fs=s==='s'?10:s==='l'?15:12, pad=s==='s'?'0 7px':s==='l'?'3px 14px':'1px 10px';
 return `<span style="display:inline-flex;align-items:center;gap:5px;padding:${pad};border:${s==='l'?3:2}px solid var(--line);border-radius:99px;background:${t.bg};color:${t.fg};font-family:${M};font-weight:700;font-size:${fs}px;letter-spacing:.04em;white-space:nowrap">${glyph(t.shape,t.fg)}${t.n}</span>`}
// ---- board
const LET='CHASLORTENIEPSDA'.split('');
function xy(i,t,g,pad=0){return [pad+t/2+(i%4)*(t+g),pad+t/2+Math.floor(i/4)*(t+g)]}
// states: {i:'sel'|'valid'|'dupe'|'bad'|'hint'|'focus'|'hover'}; path array of idx
function board(o={}){
 const t=o.t||80,g=o.g||8,pad=o.pad??8,bw=o.bw??3,state=o.state||{},path=o.path||[],order=Object.fromEntries(path.map((p,i)=>[p,i+1]));
 const inner=4*t+3*g, plate=inner+pad*2+bw*2, fs=Math.round(t*.52);
 const lineCol=o.lineCol||BU;
 let pts=path.map(i=>xy(i,t,g,0).join(',')).join(' ');
 let tiles='';
 for(let i=0;i<16;i++){const st=state[i]||(order[i]?o.sel||'sel':'idle');
  let bg=WH,fg=INK,bd=`${Math.max(2,Math.round(t/27))}px solid ${INK}`,x='',extra='',sh=`0 ${Math.round(t*.07)}px 0 ${INK}`,tr='';
  if(st==='sel'){bg=BG;sh=`0 ${Math.round(t*.02)}px 0 ${INK}`;tr='transform:translateY(3px);'}
  if(st==='valid'){bg=MI;sh=`0 ${Math.round(t*.02)}px 0 ${INK}`;tr='transform:translateY(3px);'}
  if(st==='dupe'){bg=BU;bd=`${Math.max(2,Math.round(t/27))}px dashed ${INK}`;tr='transform:translateY(3px);'}
  if(st==='bad'){bg=`repeating-linear-gradient(135deg,#E9E4D0 0 6px,#CFC8AE 6px 12px)`;fg='#4A4A4A';tr='transform:translateY(3px);'}
  if(st==='hover'){bg='#FFF1A8';sh=`0 ${Math.round(t*.1)}px 0 ${INK}`;tr='transform:translateY(-3px);'}
  if(st==='focus'){extra=`outline:4px solid ${CO};outline-offset:3px;`}
  if(st==='hint'){extra=`outline:3px dashed ${BG};outline-offset:2px;`}
  const num=order[i]&&o.nums!==false?`<span style="position:absolute;left:${Math.round(t*.06)}px;top:${Math.round(t*.06)}px;width:${Math.round(t*.27)}px;height:${Math.round(t*.27)}px;border-radius:50%;background:${INK};color:${BU};font-family:${M};font-weight:700;font-size:${Math.round(t*.16)}px;display:flex;align-items:center;justify-content:center">${order[i]}</span>`:'';
  const nm=st==='bad'?'':'';
  tiles+=`<div style="position:relative;width:${t}px;height:${t}px;box-sizing:border-box;border-radius:${Math.round(t*.2)}px;border:${bd};background:${bg};color:${fg};box-shadow:${sh};${tr}${extra}display:flex;align-items:center;justify-content:center;font-weight:800;font-size:${fs}px;line-height:1">${num}${LET[i]}</div>`;
 }
 const line=path.length>1?`<svg width="${inner}" height="${inner}" viewBox="0 0 ${inner} ${inner}" style="position:absolute;left:${pad}px;top:${pad}px;pointer-events:none" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="${INK}" stroke-width="${Math.round(t*.2)}" stroke-linecap="round" stroke-linejoin="round"/><polyline points="${pts}" fill="none" stroke="${lineCol}" stroke-width="${Math.round(t*.11)}" stroke-linecap="round" stroke-linejoin="round"/></svg>`:'';
 const cur=o.cursor?(()=>{const [cx,cy]=xy(o.cursor,t,g,pad);return `<div style="position:absolute;left:${cx+t*.12}px;top:${cy+t*.12}px;z-index:5;color:${INK};filter:drop-shadow(2px 2px 0 #fff)">${icon('cursor',Math.round(t*.4),1.5)}</div><div style="position:absolute;left:${cx-t*.65}px;top:${cy-t*.65}px;width:${t*1.3}px;height:${t*1.3}px;border-radius:50%;border:3px dashed ${BU};opacity:.9;z-index:4"></div>`})():'';
 return `<div style="position:relative;width:${plate}px;height:${plate}px;box-sizing:border-box;padding:${pad}px;border:${bw}px solid ${INK};border-radius:${Math.round(plate*.082)}px;background:var(--board);box-shadow:${o.sh||'5px 6px 0'} var(--shadow);${o.x||''}"><div style="position:relative;width:${inner}px;height:${inner}px">${line}<div style="position:relative;display:grid;grid-template-columns:repeat(4,${t}px);gap:${g}px">${tiles}</div>${cur}</div></div>`;
}
module.exports={...A,page,mono,pill,card,icon,iconBtn,btn,slam,confetti,chip,TIERS,tierOf,board,xy,F,M,MANIFEST,OUT,LET,fs,path};
