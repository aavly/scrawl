const L=require('./lib');const {INK,CO,BG,MI,BU,CR,WH,mono,pill,card,icon,iconBtn,btn,slam,chip,avatar,lockedAvatar,CHAR,PLAYER,board,F,M}=L;
const ME={av:'p3',name:'wordfox_',rating:'1,642',tier:'GOLD II',cc:'US'};
const CAST=[
 {id:'pip',name:'Pip',label:'EASY',lv:1,band:'Up to 1,399',tiers:'Bronze',line:'Learns the ropes with you',intro:'Pip is a chick who just discovered words. Friendly and slow.'},
 {id:'dash',name:'Dash',label:'CASUAL',lv:2,band:'1,400 – 1,599',tiers:'Silver',line:'Quick, but a bit sloppy',intro:'Dash is a hare who types first, thinks later.'},
 {id:'bolt',name:'Bolt',label:'SKILLED',lv:3,band:'1,600 – 1,799',tiers:'Gold',line:'A solid all-rounder',intro:'Bolt is a cool cat. Rarely rattled, always finds a few long ones.'},
 {id:'nova',name:'Nova',label:'HARD',lv:4,band:'1,800 – 2,099',tiers:'Platinum & Diamond II',line:'Always finds the long ones',intro:'Nova is an owl who has read the dictionary. Twice.'},
 {id:'titan',name:'Titan',label:'BRUTAL',lv:5,band:'2,100+',tiers:'Diamond I & Legend',line:'Hardly ever misses',intro:'Titan is a bear. A very focused bear.'},
];
const castOf=id=>CAST.find(c=>c.id===id);
// level pips ●●●○○
const pips=(n,o={})=>`<span style="display:inline-flex;gap:3px" aria-label="Level ${n} of 5">${[1,2,3,4,5].map(k=>`<span style="width:${o.w||9}px;height:${o.h||16}px;border:2px solid ${o.line||'var(--line)'};border-radius:3px;box-sizing:border-box;background:${k<=n?(o.fill||'var(--card-text)'):'transparent'}"></span>`).join('')}</span>`;
const houseTag=(c,x='')=>pill(`HOUSE PLAYER · LV ${c.lv}`,INK,WH,x);
// phone screen wrapper
function phone(name,title,theme,inner,o={}){L.page(name,title,{theme,dots:!!o.dots,w:390,h:844,body:`${o.pre||''}<div style="position:relative;z-index:1;height:100%;box-sizing:border-box;padding:${o.pad||'56px 20px 34px'};display:flex;flex-direction:column;gap:${o.gap??14}px">${inner}</div>${o.post||''}`})}
const topBar=(title,back='Home.dc.html',right='')=>`<div style="display:flex;align-items:center;gap:12px;min-height:44px">${iconBtn('back',back,'Back')}<span style="font-weight:800;font-size:32px;flex:1">${title}</span>${right}</div>`;
// Board header
const scoreFs=(s,b)=>{const n=String(s).length;return n<=5?b:n===6?Math.round(b*.85):Math.round(b*.75)};
function scoreCard(side,o){const you=side==='you';
 const bg=you?'var(--card)':BG, fg=you?'var(--card-text)':INK;
 return `<div style="position:relative;flex:1;min-width:0;background:${bg};color:${fg};border:3px solid var(--line);border-radius:22px;box-shadow:4px 5px 0 var(--shadow);padding:8px 10px 9px;box-sizing:border-box;display:flex;flex-direction:column;gap:2px;${o.dim?'opacity:.9;':''}">
 <div style="display:flex;align-items:center;gap:6px">${avatar(o.av,28,{badge:false})}<span style="font-family:${M};font-weight:700;font-size:11px;letter-spacing:.04em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${o.name}</span></div>
 <span style="font-weight:800;font-size:${scoreFs(o.score,40)}px;line-height:1.05;white-space:nowrap;${o.frozen?'opacity:.55;':''}">${o.score}</span>
 ${o.sub||''}${o.bubble?`<span style="position:absolute;right:6px;top:-18px;padding:1px 9px;border:2px solid var(--line);border-radius:99px;background:${WH};color:${INK};font-family:${M};font-weight:700;font-size:12px">${o.bubble}</span>`:''}</div>`}
const subPill=(t,bg,fg=INK,ic='')=>`<span style="align-self:flex-start;display:inline-flex;gap:4px;align-items:center;padding:0 9px;border:2px solid var(--line);border-radius:99px;background:${bg};color:${fg};font-family:${M};font-size:10px;font-weight:700;white-space:nowrap">${ic}${t}</span>`;
const ahead=n=>subPill(`AHEAD ${n}`,MI,INK,'<svg width="9" height="9" viewBox="0 0 16 16"><path d="M2 13 8 2l6 11z" fill="#141414"/></svg>');
const behind=n=>subPill(`BEHIND ${n}`,'#FFFFFF',INK,'<svg width="9" height="9" viewBox="0 0 16 16"><path d="M2 3 8 14l6-11z" fill="#141414"/></svg>');
const oppHuman=(r='1,655')=>`<span style="font-family:${M};font-weight:700;font-size:10px;letter-spacing:.04em">RATING ${r}</span>`;
const oppChar=c=>`<span style="align-self:flex-start;padding:0 9px;border:2px solid ${INK};border-radius:99px;background:${INK};color:${WH};font-family:${M};font-size:10px;font-weight:700;white-space:nowrap">LV ${c.lv} · ${c.label}</span>`;
function timer(t,hot){return `<div style="position:relative;width:74px;height:74px;flex:none;border-radius:50%;border:3px solid var(--line);background:${hot?BG:INK};color:${hot?INK:BU};box-shadow:0 4px 0 var(--shadow);display:flex;align-items:center;justify-content:center;font-family:${M};font-weight:700;font-size:21px;align-self:center">${t}</div>`}
function wordBar(st,word,extra=''){
 const base=`display:flex;align-items:center;gap:10px;height:62px;box-sizing:border-box;padding:0 16px;border:3px ${st==='dupe'?'dashed':'solid'} var(--line);border-radius:22px;box-shadow:4px 5px 0 var(--shadow);position:relative;`;
 const bg={trace:'var(--card)',valid:MI,dupe:'var(--card)',bad:BG,idle:'var(--card)'}[st],fg=st==='trace'||st==='idle'||st==='dupe'?'var(--card-text)':INK;
 const lead={trace:`<svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="6 5"/></svg>`,
  valid:`<span style="width:32px;height:32px;border-radius:50%;background:${INK};color:${MI};display:flex;align-items:center;justify-content:center">${icon('check',18,4)}</span>`,
  dupe:icon('refresh',30,3),bad:`<span style="width:32px;height:32px;border-radius:50%;background:${INK};color:${BG};display:flex;align-items:center;justify-content:center">${icon('x',16,4)}</span>`,idle:''}[st];
 const tag={valid:`<span style="position:absolute;right:-6px;top:-16px;padding:0 12px;border:3px solid ${INK};border-radius:12px;background:${CO};color:${WH};font-weight:800;font-size:20px;transform:rotate(3deg)">${extra}</span>`,
  dupe:`<span style="position:absolute;right:-4px;top:-16px;padding:1px 10px;border:3px solid ${INK};border-radius:10px;background:${BU};color:${INK};font-family:${M};font-weight:700;font-size:11px;transform:rotate(3deg)">ALREADY FOUND</span>`,
  bad:`<span style="position:absolute;right:-4px;top:-16px;padding:1px 10px;border:3px solid ${INK};border-radius:10px;background:${WH};color:${INK};font-family:${M};font-weight:700;font-size:11px;transform:rotate(3deg)">NOT A WORD</span>`}[st]||'';
 const right=st==='trace'?`<span style="font-family:${M};font-weight:700;font-size:11px;letter-spacing:.06em">${extra}</span>`:'';
 return `<div style="${base}background:${bg};color:${fg}">${lead}<span style="flex:1;text-align:center;font-weight:800;font-size:40px;letter-spacing:.08em;line-height:1;${st==='dupe'?'opacity:.6;':''}">${word}</span>${right}${tag}</div>`}
const wchip=(w,o={})=>`<span style="padding:1px 10px;border:2px ${o.dashed?'dashed':'solid'} var(--line);border-radius:12px;background:${o.bg||'var(--card)'};color:${o.fg||'var(--card-text)'};box-shadow:2px 3px 0 var(--shadow);font-weight:800;font-size:16px;transform:rotate(${o.r||0}deg)">${w}</span>`;
const FOUND=['SPEND','CLONE','CHART','EDIT','HORN','TIDE','ARID','SEND','LENS','ONE'];
const LONG=['SIDE','TIED','RIDE','SPEND','CLONE','CHART','EDIT','HORN','TIDE','ARID','SEND','LENS','ONE','HAS','TIE','DIE','LEND','RITE','ORT','DIN','HORNS','CHARTS'];
// v2.1: found words are ONE bounded row (38px), newest first, scrolls sideways, fade at right edge, count pinned right.
const chips=(list=LONG,hl,o={})=>{const n=o.count||list.length;
 const items=list.map((w,i)=>{const dupe=o.dupe===i;return wchip(hl&&i===0?`${w} ${hl}`:w,{bg:hl&&i===0?MI:dupe?BU:undefined,fg:(hl&&i===0)||dupe?INK:undefined,dashed:dupe,r:dupe?-3:(i%3-1)*1})}).join('');
 const m='linear-gradient(90deg,#000 78%,transparent 94%)';
 return `<div style="position:relative;height:38px;flex:none"><div style="display:flex;gap:8px;align-items:center;height:100%;overflow:hidden;white-space:nowrap;padding:0 2px;-webkit-mask-image:${m};mask-image:${m}">${items}</div><span style="position:absolute;right:0;top:50%;transform:translateY(-50%);min-width:30px;height:30px;box-sizing:border-box;padding:0 6px;border-radius:99px;border:2px solid var(--line);background:${INK};color:${BU};font-family:${M};font-weight:700;font-size:12px;display:flex;align-items:center;justify-content:center">${n}</span></div>`};
module.exports={...L,scoreFs,LONG,ME,CAST,castOf,pips,houseTag,phone,topBar,scoreCard,subPill,ahead,behind,oppHuman,oppChar,timer,wordBar,wchip,chips,FOUND};
