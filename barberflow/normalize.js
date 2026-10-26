const out=[];
for(const {json:e} of $input.all()) {
 if(!e.id || e.recurringEventId || e.recurrence) continue;
 const guest=(e.attendees||[]).find(a=>!a.self&&!a.organizer&&a.responseStatus!=='declined');
 if(e.status!=='cancelled' && (!guest || !e.start?.dateTime)) continue;
 const calendar_id='REPLACE_CALENDAR_ID';
 out.push({json:{booking_key:calendar_id+'|'+e.id,calendar_id,event_id:e.id,service:e.summary||'',start:e.start?.dateTime||'',end:e.end?.dateTime||'',name:guest?.displayName||'',email:guest?.email||'',status:e.status||'confirmed',updated:e.updated||''}});
} return out;