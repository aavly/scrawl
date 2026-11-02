// v2.1: compact native layout for phones narrower than 390 or shorter than 720.
const C=require('./common');const {INK,CO,BG,MI,BU,WH,M,avatar,board,wchip,icon,mono,ME,LONG,scoreFs,pill,castOf,page}=C;
const fit=(W,H,top,bot)=>{const g=8;const avail=H-top-bot;const plate=Math.min(W-24,avail-160);const t=Math.min(80,Math.floor((plate-22-3*g)/4));return {t,g}};
function small(name,W,H,top,bot,o){
 const {t,g}=fit(W,H,top,bot);
 const card=(who,av,label,score,sub,bg,fg)=>`<div style="flex:1;min-width:0;background:${bg};color:${fg};border:3px solid var(--line);border-radius:18px;box-shadow:3px 4px 0 var(--shadow);padding:5px 8px;display:flex;align-items:center;gap:6px;box-sizing:border-box">${avatar(av,24,{badge:false})}<div style="display:flex;flex-direction:column;line-height:1.05;min-width:0"><span style="font-family:${M};font-size:9px;font-weight:700;white-space:nowrap">${label}</span><span style="font-weight:800;font-size:${scoreFs(score,26)}px;white-space:nowrap">${score}</span><span style="font-family:${M};font-size:8px;font-weight:700;white-space:nowrap">${sub}</span></div></div>`;
 const hdr=`<div style="display:flex;gap:8px;align-items:stretch">${card('you',ME.av,'YOU',o.you,o.youSub,'var(--card)','var(--card-text)')}<div style="width:58px;height:58px;flex:none;border-radius:50%;background:${o.hot?BG:INK};color:${o.hot?INK:BU};border:3px solid var(--line);box-shadow:0 3px 0 var(--shadow);display:flex;align-items:center;justify-content:center;font-family:${M};font-weight:700;font-size:16px;align-self:center">${o.time}</div>${card('opp',o.oppAv,o.oppLabel,o.opp,o.oppSub,BG,INK)}</div>`;
 const wb=`<div style="height:48px;box-sizing:border-box;border:3px solid var(--line);border-radius:18px;background:var(--card);color:var(--card-text);box-shadow:3px 4px 0 var(--shadow);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:32px;letter-spacing:.08em;position:relative">${o.word}<span style="position:absolute;right:12px;font-family:${M};font-size:10px;letter-spacing:.06em">${o.extra}</span></div>`;
 const row=o.coach?`<div style="display:flex;gap:10px;align-items:center;padding:8px 12px;border:3px solid var(--line);border-radius:18px;background:var(--card);color:var(--card-text);box-shadow:3px 4px 0 var(--shadow)">${avatar('pip',44)}<div style="display:flex;flex-direction:column;gap:2px"><span style="font-family:${M};font-weight:700;font-size:9px">PIP · YOUR PRACTICE PARTNER</span><span style="font-weight:700;font-size:13px;line-height:1.2">Drag across touching letters. Diagonals count! Slide on to the E to finish ONE.</span></div></div>`:C.chips(LONG.slice(0,o.nChips||22));
 const sticker=o.last10?`<span style="position:absolute;left:12px;top:${top+58+8+48-6}px;z-index:9;padding:0 8px;border:3px solid ${INK};border-radius:9px;background:${BG};font-family:${M};font-weight:700;font-size:11px;transform:rotate(-3deg)">LAST 10!</span>`:'';
 const frame=o.last10?`<div style="position:absolute;inset:0;z-index:15;pointer-events:none;border:6px solid #FF5FA2;box-sizing:border-box"></div>`:'';
 const body=`<div style="position:relative;z-index:1;height:100%;box-sizing:border-box;padding:${top}px 12px ${bot}px;display:flex;flex-direction:column;gap:8px">${hdr}${wb}${row}<div style="margin-top:auto;display:flex;justify-content:center">${board({t,g,pad:8,path:o.path,state:o.state})}</div></div>${sticker}${frame}`;
 page(name,'Scrawl board small phone',{theme:'light',w:W,h:H,dots:true,body});
 return {t};
}
const kai={oppAv:'p6',oppLabel:'KAIJUMO',oppSub:'RATING 1,655'};
const aheadS='▲ AHEAD 600';
const sizes=[['360',360,640,28,16],['375',375,667,24,14]];
const res={};
for(const [k,W,H,top,bot] of sizes){
 res[k]=small('Board-'+k,W,H,top,bot,{you:'3,700',youSub:aheadS,opp:'3,100',...kai,time:'0:23',word:'STRID',extra:'5 LETTERS',path:[3,7,6,10,14]});
 small('Tutorial-'+k,W,H,top,bot,{you:'0',youSub:'wordfox_',opp:'0',oppAv:'pip',oppLabel:'PIP',oppSub:'LV 1 · EASY',time:'1:18',word:'ON',extra:'2 LETTERS',path:[5,9],state:{8:'hint'},coach:true});
 small('Board-Last10-'+k,W,H,top,bot,{you:'4,700',youSub:'▲ AHEAD 700',opp:'4,000',...kai,time:'0:07',hot:true,last10:true,word:'DIN',extra:'3 LETTERS',path:[14,10,9]});
}
small('Board-HighScore-360',360,640,28,16,{you:'12,400',youSub:'▲ AHEAD 500',opp:'11,900',...kai,time:'0:31',word:'ASTRIDE',extra:'7 LETTERS',path:[2,3,7,6,10,14,11],state:Object.fromEntries([2,3,7,6,10,14,11].map(i=>[i,'valid']))});
console.log('tiles',JSON.stringify(res));
