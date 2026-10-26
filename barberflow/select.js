const now=Date.now(); return $input.all().filter(({json:r})=>{
 const start=Date.parse(r.start), delta=start-now;
 const key=r.booking_key+'|'+new Date(Number.isFinite(start)?start:0).toISOString();
 return r.status==='confirmed' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email||'') && delta>0 && delta<=86400000 && delta>=84600000 && !(r.reminder_key===key && ['sending','sent','uncertain'].includes(r.reminder_state));
}).map(({json:r})=>({json:{...r,reminder_key:r.booking_key+'|'+new Date(r.start).toISOString()}}));