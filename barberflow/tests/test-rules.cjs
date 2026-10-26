const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const run=(file,items)=>new Function('$input',fs.readFileSync(path.join(root,file),'utf8'))({all:()=>items.map(json=>({json}))}).map(x=>x.json);
test('normalizes guest and stable event identity; ignores busy blocks',()=>{
 const e={id:'a',status:'confirmed',start:{dateTime:'2026-11-01T10:00:00+01:00'},attendees:[{email:'owner@test.com',self:true},{email:'guest@test.com'}]};
 assert.equal(run('normalize.js',[e])[0].email,'guest@test.com');
 assert.equal(run('normalize.js',[{...e,attendees:[]}]).length,0);
 assert.equal(run('normalize.js',[{id:'a',status:'cancelled'}])[0].status,'cancelled');
});
test('24h window, cancellation, duplicate and ambiguous send protection',()=>{
 const start=new Date(Date.now()+86300000).toISOString();
 const r={booking_key:'cal|a',start,email:'guest@test.com',status:'confirmed'};
 const key=r.booking_key+'|'+start;
 assert.equal(run('select.js',[r]).length,1);
 for(const state of ['sent','sending','uncertain']) assert.equal(run('select.js',[{...r,reminder_key:key,reminder_state:state}]).length,0);
 assert.equal(run('select.js',[{...r,status:'cancelled'}]).length,0);
 assert.equal(run('select.js',[{...r,start:new Date(Date.now()-1000).toISOString()}]).length,0);
 assert.equal(run('select.js',[{...r,email:'bad'}]).length,0);
 assert.equal(run('select.js',[{...r,reminder_key:'old-date',reminder_state:'sent'}]).length,1);
});
test('all workflows inactive, connected, no embedded credentials; JS parses',()=>{
 for(const f of fs.readdirSync(path.join(root,'workflows'))){
 const w=JSON.parse(fs.readFileSync(path.join(root,'workflows',f)));
 assert.equal(w.active,false);
 const names=new Set(w.nodes.map(n=>n.name));
 for(const n of w.nodes){assert.equal(n.credentials,undefined); if(n.type.endsWith('.code'))new Function('$input','$',n.parameters.jsCode);}
 for(const c of Object.values(w.connections))for(const lane of c.main)for(const edge of lane)assert(names.has(edge.node));
 }
});
