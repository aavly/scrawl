const C=require('./common');const {phone,scoreCard,timer,wordBar,chips,board,ahead,behind,oppHuman,oppChar,castOf,ME,mono,pill,card,icon,btn,avatar,INK,CO,BG,MI,BU,WH,M,F,subPill}=C;
const you=(score,sub,o={})=>scoreCard('you',{av:ME.av,name:'YOU',score,sub,...o});
const kai=(score,o={})=>scoreCard('opp',{av:'p6',name:'KAIJUMO',score,sub:oppHuman(),...o});
const bolt=(score,o={})=>{const c=castOf('bolt');return scoreCard('opp',{av:'bolt',name:'BOLT',score,sub:C.oppChar(c),...o})};
function boardScreen(name,theme,o){
 const body=`<div style="display:flex;gap:8px;align-items:stretch;padding-top:6px">${o.you}${timer(o.time,o.hot)}${o.opp}</div>
 ${wordBar(o.ws,o.word,o.extra)}
 ${o.chips||''}
 ${o.mid||''}
 <div style="margin-top:auto;padding-bottom:6px">${board({path:o.path,state:o.state,sel:o.sel,lineCol:o.lineCol,hint:o.hint})}</div>`;
 C.phone(name,'Scrawl board',theme,body,{dots:true,pad:'56px 12px 22px',gap:14,post:o.post||''});
}
const P={trace:[3,7,6,10,14],valid:[3,7,6,10,14,11],invalid:[3,6,7],last10:[14,10,9]};
const vstate=(p)=>Object.fromEntries(p.map(i=>[i,'valid']));
const dstate=(p)=>Object.fromEntries(p.map(i=>[i,'dupe']));
const bstate=(p)=>Object.fromEntries(p.map(i=>[i,'bad']));
for(const th of ['light','dark']){const sfx=th==='dark'?'-Dark':'';
 boardScreen('Board'+sfx,th,{you:you('3,700',ahead(600)),opp:kai('3,100'),time:'0:23',ws:'trace',word:'STRID',extra:'5 LETTERS',chips:chips(),path:P.trace});
 boardScreen('Board-Valid'+sfx,th,{you:you('4,700',ahead(1300)),opp:kai('3,400'),time:'0:21',ws:'valid',word:'STRIDE',extra:'+1,000',chips:chips(['STRIDE',...C.LONG],'+1,000'),path:P.valid,state:vstate(P.valid)});
}
boardScreen('Board-Dupe','light',{you:you('4,700',ahead(1300)),opp:kai('3,400'),time:'0:17',ws:'dupe',word:'STRIDE',chips:chips(['STRIDE',...C.LONG],undefined,{dupe:0}),path:P.valid,state:dstate(P.valid)});
boardScreen('Board-Invalid','light',{you:you('4,700',ahead(1000)),opp:kai('3,700',{bubble:'+300'}),time:'0:14',ws:'bad',word:'SRT',chips:chips(['STRIDE',...C.LONG]),path:P.invalid,state:bstate(P.invalid)});
const L10FRAME=`<div style="position:absolute;inset:0;z-index:15;pointer-events:none;border:6px solid #FF5FA2;box-sizing:border-box"></div>`;
boardScreen('Board-Last10','light',{post:L10FRAME,you:you('4,700',ahead(700)),opp:kai('4,000'),time:'0:07',hot:true,ws:'trace',word:'DIN',extra:'3 LETTERS',chips:chips(['STRIDE',...C.LONG]),path:P.last10,mid:`<div style="align-self:flex-start;margin:-6px 0 0 6px"><span style="padding:1px 10px;border:3px solid ${INK};border-radius:10px;background:${BG};font-family:${M};font-weight:700;font-size:13px;transform:rotate(-3deg);display:inline-block">LAST 10!</span></div>`});
// vs Bolt (ranked fallback) – the new default opponent look
boardScreen('Board-VsBolt','light',{you:you('2,100',behind(300)),opp:bolt('2,400'),time:'0:52',ws:'trace',word:'CLO',extra:'3 LETTERS',chips:chips(['TIDE','ONE','SEND']),path:[0,4,5]});
boardScreen('Board-VsBolt-Dark','dark',{you:you('2,100',behind(300)),opp:bolt('2,400'),time:'0:52',ws:'trace',word:'CLO',extra:'3 LETTERS',chips:chips(['TIDE','ONE','SEND']),path:[0,4,5]});
// opponent disconnects: score freezes with a mark, keep playing, round continues
const dcCard=scoreCard('opp',{av:'p6',name:'KAIJUMO',score:'3,400',frozen:true,sub:subPill('DISCONNECTED',WH,INK,icon('wifioff',11,3))});
boardScreen('Board-Disconnected','light',{you:you('4,300',ahead(900)),opp:dcCard,time:'0:31',ws:'trace',word:'ARI',extra:'3 LETTERS',chips:chips(['STRIDE',...C.LONG.slice(0,8)]),path:[2,6,10],
 mid:`<div style="display:flex;align-items:center;gap:8px;padding:8px 14px;border:3px solid ${INK};border-radius:16px;background:${BU};color:${INK};box-shadow:3px 4px 0 var(--shadow);font-weight:700;font-size:14px;margin-top:-2px">${icon('wifioff',18,3)}<span style="flex:1">Kaijumo lost connection. Their score is frozen — keep playing. If they don't return, you win by walkover.</span></div>`});
// you are offline mid-round: round keeps running locally, banner
boardScreen('Board-Offline','light',{you:you('3,700',ahead(600)),opp:kai('3,100',{sub:oppHuman('1,655')}),time:'0:23',ws:'trace',word:'STRID',extra:'5 LETTERS',chips:chips(),path:P.trace,
 mid:`<div style="display:flex;align-items:center;gap:8px;padding:8px 14px;border:3px solid ${INK};border-radius:16px;background:${INK};color:${WH};box-shadow:3px 4px 0 var(--shadow);font-weight:700;font-size:14px;margin-top:-2px">${icon('wifioff',18,3)}<span style="flex:1">You're offline. Reconnecting… your words are saved on this phone for 15 s.</span><span style="font-family:${M};font-size:12px;color:${BU}">12s</span></div>`});
// forfeit confirm (Android back / iOS Quit)
boardScreen('Board-Forfeit','light',{you:you('3,700',ahead(600)),opp:kai('3,100'),time:'0:23',ws:'trace',word:'STRID',extra:'5 LETTERS',chips:chips(),path:P.trace,
 post:`<div style="position:absolute;inset:0;z-index:20;background:rgba(20,20,20,.55);display:flex;align-items:center;justify-content:center;padding:0 28px;box-sizing:border-box"><div style="width:100%;background:var(--card);color:var(--card-text);border:4px solid ${INK};border-radius:28px;box-shadow:6px 7px 0 ${INK};padding:22px 20px;box-sizing:border-box;display:flex;flex-direction:column;gap:14px;text-align:center"><span style="font-weight:800;font-size:30px;line-height:1.05">Leave the round?</span><span style="font-size:16px;font-weight:500;line-height:1.3">Leaving counts as a loss. Your opponent keeps their score and you lose rating.</span>${btn('Keep playing','#',{h:60,size:24,r:20,bg:CO})}${btn('Forfeit','#',{h:52,size:20,r:18,bg:'var(--card)',fg:'var(--card-text)',sh:5})}<span style="font-family:${M};font-weight:700;font-size:10px;letter-spacing:.06em;opacity:.8">ANDROID BACK BUTTON AND IOS ✕ OPEN THIS SAME DIALOG</span></div></div>`});
// error toast on the board
boardScreen('Board-Toast','light',{you:you('3,700',ahead(600)),opp:kai('3,100'),time:'0:23',ws:'trace',word:'STRID',extra:'5 LETTERS',chips:chips(),path:P.trace,
 post:`<div style="position:absolute;left:14px;right:14px;top:252px;z-index:30;display:flex;align-items:center;gap:10px;padding:10px 14px;border:3px solid ${INK};border-radius:18px;background:${BG};color:${INK};box-shadow:4px 5px 0 var(--shadow);font-weight:700;font-size:15px">${icon('alert',20,3)}<span style="flex:1">Connection is slow. Your score is still counting.</span></div>`});
// tutorial coach (Pip)
const pipc=castOf('pip');
boardScreen('Tutorial','light',{you:scoreCard('you',{av:ME.av,name:'YOU',score:'0',sub:`<span style="font-family:${M};font-size:10px;font-weight:700">wordfox_</span>`}),opp:scoreCard('opp',{av:'pip',name:'PIP',score:'0',sub:C.oppChar(pipc)}),time:'1:18',ws:'trace',word:'ON',extra:'2 LETTERS',path:[5,9],state:{8:'hint'},
 chips:`<div style="display:flex;gap:12px;align-items:center;padding:12px 14px;border:3px solid var(--line);border-radius:22px;background:var(--card);color:var(--card-text);box-shadow:4px 5px 0 var(--shadow);margin-top:-4px;position:relative"><div style="position:absolute;left:-1px;top:-1px"></div>${avatar('pip',52)}<div style="flex:1;display:flex;flex-direction:column;gap:3px"><span style="font-family:${M};font-weight:700;font-size:11px;letter-spacing:.04em">PIP · YOUR PRACTICE PARTNER</span><span style="font-weight:700;font-size:16px;line-height:1.25">Drag across touching letters. Diagonals count! Slide on to the E to finish ONE.</span></div></div>`});

// v2.1: five-digit scores
const AP=[2,3,7,6,10,14,11];
boardScreen('Board-HighScore','light',{you:you('12,400',ahead(500)),opp:kai('11,900'),time:'0:31',ws:'valid',word:'ASTRIDE',extra:'+1,600',chips:chips(['ASTRIDE',...C.LONG],'+1,600'),path:AP,state:vstate(AP)});
module.exports={boardScreen,you,kai,bolt};
