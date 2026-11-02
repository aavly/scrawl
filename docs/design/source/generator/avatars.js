// Scrawl avatar art. All in a 100x100 viewBox, clipped to the circular slot.
const INK='#141414', CO='#2F4BFF', BG='#FF5FA2', MI='#19D3A2', BU='#FFD84A', CR='#FFF6D6', WH='#FFFFFF';
const S=(w=4)=>`stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const eye=(x,y,r=5.5,look=0)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${WH}" ${S(3)}/><circle cx="${x+look}" cy="${y+1}" r="${r*0.5}" fill="${INK}"/><circle cx="${x+look+1.2}" cy="${y-0.6}" r="${r*0.16}" fill="${WH}"/>`;

// ---------- CHARACTERS (creatures, bold bg, level badge) ----------
const CHAR={
 pip:{name:'Pip',level:1,label:'EASY',bg:MI,ink:INK,svg:`
  <path d="M43 22 L40 8 L49 17 L52 4 L57 17 L65 9 L60 24Z" fill="${BU}" ${S()}/>
  <ellipse cx="50" cy="56" rx="34" ry="31" fill="${BU}" ${S()}/>
  <ellipse cx="24" cy="62" rx="6" ry="4" fill="${BG}" opacity=".85"/><ellipse cx="76" cy="62" rx="6" ry="4" fill="${BG}" opacity=".85"/>
  ${eye(36,50,8)}${eye(64,50,8)}
  <path d="M42 62 L58 62 L50 74Z" fill="#FF8A2A" ${S(3.5)}/>`},
 dash:{name:'Dash',level:2,label:'CASUAL',bg:BU,ink:INK,svg:`
  <path d="M30 46 C20 20 24 -4 36 -2 C46 0 46 26 44 44Z" fill="${WH}" ${S()}/><path d="M34 40 C28 22 30 6 35 6 C40 8 40 24 40 40Z" fill="${BG}"/>
  <path d="M60 44 C58 24 64 6 76 14 C86 22 82 32 70 52Z" fill="${WH}" ${S()}/>
  <ellipse cx="50" cy="62" rx="33" ry="29" fill="${WH}" ${S()}/>
  <path d="M30 52 q6 -5 12 0" fill="none" ${S(3.5)}/><circle cx="36" cy="56" r="4" fill="${INK}"/>
  <path d="M58 52 q6 -5 12 0" fill="none" ${S(3.5)}/><circle cx="64" cy="56" r="4" fill="${INK}"/>
  <path d="M38 70 Q50 82 62 70" fill="${INK}" ${S(3.5)}/><path d="M46 76 Q50 90 56 76Z" fill="${BG}" ${S(3)}/>
  <path d="M46 63 L54 63 L50 68Z" fill="${BG}" ${S(3)}/>
  <path d="M10 70 L22 66 M10 78 L22 72" ${S(3)}/>`},
 bolt:{name:'Bolt',level:3,label:'SKILLED',bg:BG,ink:INK,svg:`
  <path d="M16 46 L20 12 L44 30Z" fill="${CR}" ${S()}/><path d="M84 46 L80 12 L56 30Z" fill="${CR}" ${S()}/>
  <path d="M22 36 L24 22 L35 31Z" fill="${CO}"/><path d="M78 36 L76 22 L65 31Z" fill="${CO}"/>
  <ellipse cx="50" cy="58" rx="36" ry="30" fill="${CR}" ${S()}/>
  <path d="M52 30 L44 46 L51 46 L47 58 L60 40 L52 40 L57 30Z" fill="${BU}" ${S(3)}/>
  <path d="M14 46 H86 L82 62 Q78 68 66 66 Q56 64 52 58 H48 Q44 64 34 66 Q22 68 18 62Z" fill="${INK}"/>
  <path d="M24 50 L34 50 L30 56Z" fill="${WH}" opacity=".55"/><path d="M58 50 L68 50 L64 56Z" fill="${WH}" opacity=".55"/>
  <path d="M44 72 Q50 76 56 72 M44 72 Q40 80 33 78 M56 72 Q60 80 67 78" fill="none" ${S(3.5)}/>
  <path d="M46 68 h8 l-4 4Z" fill="${BG}" ${S(3)}/>
  <path d="M6 66 L22 64 M6 74 L22 70 M94 66 L78 64 M94 74 L78 70" ${S(3)}/>`},
 nova:{name:'Nova',level:4,label:'HARD',bg:CO,ink:WH,svg:`
  <path d="M20 40 L14 8 L42 24Z" fill="${CR}" ${S()}/><path d="M80 40 L86 8 L58 24Z" fill="${CR}" ${S()}/>
  <ellipse cx="50" cy="56" rx="37" ry="34" fill="${CR}" ${S()}/>
  <circle cx="34" cy="50" r="15" fill="${WH}" ${S(4.5)}/><circle cx="66" cy="50" r="15" fill="${WH}" ${S(4.5)}/>
  <path d="M49 50 H51" ${S(4.5)}/>
  <path d="M34 41 L37 47 L43 48 L38 52 L40 58 L34 54 L28 58 L30 52 L25 48 L31 47Z" fill="${INK}"/>
  <path d="M66 41 L69 47 L75 48 L70 52 L72 58 L66 54 L60 58 L62 52 L57 48 L63 47Z" fill="${INK}"/>
  <path d="M42 66 L58 66 L50 82Z" fill="${BU}" ${S(3.5)}/>
  <path d="M22 76 q6 6 10 -2 M30 82 q6 6 10 -2 M60 82 q6 6 10 -2 M68 76 q6 6 10 -2" fill="none" ${S(2.5)} opacity=".6"/>`},
 titan:{name:'Titan',level:5,label:'BRUTAL',bg:INK,ink:BU,svg:`
  <circle cx="22" cy="28" r="12" fill="${WH}" stroke="${BU}" stroke-width="4"/><circle cx="78" cy="28" r="12" fill="${WH}" stroke="${BU}" stroke-width="4"/>
  <circle cx="22" cy="28" r="5" fill="${BG}"/><circle cx="78" cy="28" r="5" fill="${BG}"/>
  <ellipse cx="50" cy="56" rx="38" ry="35" fill="${WH}" stroke="${BU}" stroke-width="4"/>
  <path d="M24 40 L44 50 M76 40 L56 50" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
  <circle cx="36" cy="54" r="4.5" fill="${INK}"/><circle cx="64" cy="54" r="4.5" fill="${INK}"/>
  <ellipse cx="50" cy="72" rx="15" ry="11" fill="${CR}" stroke="${INK}" stroke-width="3.5"/>
  <path d="M43 66 h14 l-7 7Z" fill="${INK}"/><path d="M42 80 q8 -5 16 0" fill="none" ${S(3.5)}/>
  <path d="M66 36 L74 62" stroke="${BG}" stroke-width="4" stroke-linecap="round"/><path d="M62 46 l9 -3 M65 54 l9 -3" stroke="${BG}" stroke-width="3" stroke-linecap="round"/>`},
};

// ---------- PLAYER AVATARS (humans, shoulders up, no badge, never creatures) ----------
function human({bg,skin,hair,shirt,style,glasses,beard,hat}){
 const hairBack={bun:`<circle cx="50" cy="14" r="9" fill="${hair}" ${S(3.5)}/>`,long:`<path d="M26 44 Q22 80 30 88 L70 88 Q78 80 74 44Z" fill="${hair}" ${S(3.5)}/>`,afro:`<circle cx="50" cy="38" r="28" fill="${hair}" ${S(3.5)}/>`,bob:`<path d="M26 40 Q24 70 30 72 L70 72 Q76 70 74 40Z" fill="${hair}" ${S(3.5)}/>`}[style]||'';
 const hairFront={
  crop:`<path d="M32 38 Q34 22 50 22 Q66 22 68 38 Q58 30 50 31 Q40 30 32 38Z" fill="${hair}" ${S(3.5)}/>`,
  bun:`<path d="M31 40 Q32 22 50 22 Q68 22 69 40 Q58 31 50 32 Q40 31 31 40Z" fill="${hair}" ${S(3.5)}/>`,
  long:`<path d="M30 42 Q30 20 50 20 Q70 20 70 42 Q60 30 50 30 Q40 30 30 42Z" fill="${hair}" ${S(3.5)}/>`,
  afro:`<path d="M32 38 Q40 28 50 29 Q60 28 68 38 Q58 33 50 33 Q42 33 32 38Z" fill="${hair}" ${S(3.5)}/>`,
  bob:`<path d="M30 44 Q28 20 50 20 Q72 20 70 44 Q64 30 50 31 Q36 30 30 44Z" fill="${hair}" ${S(3.5)}/>`,
  bald:'' , curl:`<path d="M30 40 q-4 -14 8 -16 q4 -10 14 -6 q12 -4 14 8 q10 4 4 14 Q58 32 50 32 Q40 32 30 40Z" fill="${hair}" ${S(3.5)}/>`}[style==='afro'||style==='bun'||style==='long'||style==='bob'?style:style]||'';
 return `
  ${hairBack}
  <path d="M10 104 Q10 76 36 72 L64 72 Q90 76 90 104Z" fill="${shirt}" ${S()}/>
  <path d="M42 72 Q50 82 58 72Z" fill="${skin}" ${S(3)}/>
  <rect x="43" y="60" width="14" height="14" fill="${skin}" ${S(3.5)}/>
  <ellipse cx="50" cy="46" rx="18" ry="21" fill="${skin}" ${S()}/>
  <ellipse cx="32" cy="48" rx="3.5" ry="5" fill="${skin}" ${S(3)}/><ellipse cx="68" cy="48" rx="3.5" ry="5" fill="${skin}" ${S(3)}/>
  ${beard?`<path d="M33 52 Q34 70 50 70 Q66 70 67 52 Q60 62 50 62 Q40 62 33 52Z" fill="${hair}" ${S(3)}/>`:''}
  ${hairFront}
  <circle cx="42" cy="47" r="2.6" fill="${INK}"/><circle cx="58" cy="47" r="2.6" fill="${INK}"/>
  <path d="M43 57 Q50 63 57 57" fill="none" ${S(3)}/>
  ${glasses?`<circle cx="42" cy="47" r="7" fill="none" ${S(3)}/><circle cx="58" cy="47" r="7" fill="none" ${S(3)}/><path d="M49 47h2" ${S(3)}/>`:''}
  ${hat==='beanie'?`<path d="M31 38 Q32 16 50 16 Q68 16 69 38Z" fill="${BU}" ${S()}/><rect x="29" y="34" width="42" height="9" rx="4" fill="${BG}" ${S(3.5)}/><circle cx="50" cy="13" r="4" fill="${BG}" ${S(3)}/>`:''}
  ${hat==='cap'?`<path d="M31 38 Q32 17 50 17 Q68 17 69 38Z" fill="${CO}" ${S()}/><path d="M60 36 L88 40 Q86 46 60 44Z" fill="${CO}" ${S(3.5)}/>`:''}`;
}
const PLAYER={
 p1:{name:'Sprout',bg:BU,svg:human({skin:'#F6C9A3',hair:'#5A3B22',shirt:MI,style:'bun'})},
 p2:{name:'Haze',bg:MI,svg:human({skin:'#8A5A3C',hair:INK,shirt:BG,style:'afro'})},
 p3:{name:'Marlow',bg:BG,svg:human({skin:'#E8AD7E',hair:'#2B1B12',shirt:CO,style:'crop',glasses:true})},
 p4:{name:'Juno',bg:CO,svg:human({skin:'#C98A5E',hair:'#1E1410',shirt:BU,style:'long'})},
 p5:{name:'Kit',bg:CR,svg:human({skin:'#F6C9A3',hair:'#D9822B',shirt:CO,style:'crop',hat:'cap'})},
 p6:{name:'Ash',bg:BG,svg:human({skin:'#5E3A26',hair:INK,shirt:MI,style:'bald',beard:true})},
 p7:{name:'Wren',bg:MI,svg:human({skin:'#F2D2B3',hair:'#8C3B2A',shirt:BG,style:'bob',glasses:true})},
 p8:{name:'Teddy',bg:BU,svg:human({skin:'#B77A52',hair:INK,shirt:INK,style:'crop',hat:'beanie'})},
};
const LOCKED={l1:{name:'Locked',price:'250'},l2:{name:'Locked',price:'250'},l3:{name:'Premium',price:'PRO'}};

// Slot: circular, fixed size, border scales with size.
function avatar(id,size=52,o={}){
 const bw=size<=36?2:size>=88?4:3;
 const c=CHAR[id], p=PLAYER[id];
 const bg=c?c.bg:(p?p.bg:CR);
 const inner=c?c.svg:(p?p.svg:'');
 const showBadge=c&&size>=40&&o.badge!==false;
 const bd=Math.round(size*.36);
 const badge=showBadge?`<span style="position:absolute;right:${-Math.round(size*.04)}px;bottom:${-Math.round(size*.04)}px;width:${bd}px;height:${bd}px;border-radius:50%;border:${bw>2?2:2}px solid ${INK};background:${WH};color:${INK};display:flex;align-items:center;justify-content:center;font-family:'Space Mono',monospace;font-weight:700;font-size:${Math.max(9,Math.round(bd*.5))}px;line-height:1;box-sizing:border-box">${c.level}</span>`:'';
 const ring=o.ring?`box-shadow:0 0 0 3px ${o.ring};`:'';
 return `<span style="position:relative;display:inline-block;width:${size}px;height:${size}px;flex:none"><span style="display:block;width:${size}px;height:${size}px;border-radius:50%;border:${bw}px solid ${INK};background:${bg};box-sizing:border-box;overflow:hidden;${ring}"><svg width="${size-bw*2}" height="${size-bw*2}" viewBox="0 0 100 100" aria-hidden="true">${inner}</svg></span>${badge}</span>`;
}
function lockedAvatar(size=64,kind='l1'){
 return `<span style="position:relative;display:inline-block;width:${size}px;height:${size}px;flex:none"><span style="display:block;width:${size}px;height:${size}px;border-radius:50%;border:3px dashed ${INK};background:#E9E4D0;box-sizing:border-box;overflow:hidden"><svg width="${size-6}" height="${size-6}" viewBox="0 0 100 100" aria-hidden="true"><g opacity=".35"><path d="M10 104 Q10 76 36 72 L64 72 Q90 76 90 104Z" fill="${INK}"/><ellipse cx="50" cy="46" rx="18" ry="21" fill="${INK}"/></g></svg></span><span style="position:absolute;right:-2px;bottom:-2px;width:${Math.round(size*.4)}px;height:${Math.round(size*.4)}px;border-radius:50%;border:3px solid ${INK};background:${kind==='l3'?BU:WH};display:flex;align-items:center;justify-content:center"><svg width="${Math.round(size*.22)}" height="${Math.round(size*.22)}" viewBox="0 0 24 24" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg></span></span>`;
}
module.exports={CHAR,PLAYER,LOCKED,avatar,lockedAvatar,INK,CO,BG,MI,BU,CR,WH};
