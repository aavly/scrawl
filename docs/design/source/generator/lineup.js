const A=require('./avatars');const fs=require('fs');
let h='<body style="margin:0;background:#FFD84A;font-family:sans-serif;padding:20px;width:900px">';
for(const sizes of [[92,52,44,34]]){
 for(const id of ['pip','dash','bolt','nova','titan','p1','p2','p3','p4','p5','p6','p7','p8']){
  h+=`<div style="display:flex;align-items:center;gap:16px;margin-bottom:10px"><b style="width:60px">${id}</b>`+sizes.map(s=>A.avatar(id,s)).join('')+`</div>`}
 h+=`<div style="display:flex;gap:10px">${A.lockedAvatar(64,'l1')}${A.lockedAvatar(64,'l3')}</div>`}
fs.writeFileSync('../render/lineup.html',h);
