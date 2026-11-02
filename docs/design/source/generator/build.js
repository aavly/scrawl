const L=require('./lib');
for(const f of ['s_board','s_main','s_acc','s_desk','s_misc','s_small'])require('./'+f);
const fs=require('fs');
const uniq={};L.MANIFEST.forEach(m=>uniq[m.name]=m);
fs.writeFileSync(__dirname+'/manifest.json',JSON.stringify(Object.values(uniq),null,1));
console.log(Object.keys(uniq).length,'screens');
