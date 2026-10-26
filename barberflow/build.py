import json
from pathlib import Path
ROOT=Path(__file__).parent
CAL='REPLACE_CALENDAR_ID'
SHEET='REPLACE_SPREADSHEET_ID'
HEADERS=['booking_key','calendar_id','event_id','service','start','end','name','email','status','updated','reminder_key','reminder_state','sent_at']
def node(name,kind,params,version=1):
 return {'id':name,'name':name,'type':'n8n-nodes-base.'+kind,'typeVersion':version,'position':[0,0],'parameters':params}
def code(name,js): return node(name,'code',{'jsCode':js},2)
def schedule(minutes):return node('Schedule','scheduleTrigger',{'rule':{'interval':[{'field':'minutes','minutesInterval':minutes}]}},1.2)
def sheet(name,op,mapping=None):
 p={'operation':op,'documentId':{'__rl':True,'value':SHEET,'mode':'id'},'sheetName':{'__rl':True,'value':'Bookings','mode':'name'},'options':{}}
 if mapping is not None:p['columns']={'mappingMode':'defineBelow','value':mapping,'matchingColumns':['booking_key'],'schema':[{'id':h,'displayName':h,'required':False,'defaultMatch':h=='booking_key','display':True,'type':'string','canBeUsedToMatch':True} for h in HEADERS],'attemptToConvertTypes':False,'convertFieldsToString':False}
 return node(name,'googleSheets',p,4.5)
def save(name,nodes):
 connections={}
 for i,n in enumerate(nodes):
  n['position']=[i*240,0]
  if i+1<len(nodes):connections[n['name']]={'main':[[{'node':nodes[i+1]['name'],'type':'main','index':0}]]}
 data={'name':'BARBERFLOW '+name,'nodes':nodes,'connections':connections,'active':False,'settings':{'executionOrder':'v1','timezone':'Europe/Madrid','saveDataSuccessExecution':'none','saveDataErrorExecution':'none'},'pinData':{}}
 (ROOT/'workflows'/f'{name}.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
normalize="""const out=[];
for(const {json:e} of $input.all()) {
 if(!e.id || e.recurringEventId || e.recurrence) continue;
 const guest=(e.attendees||[]).find(a=>!a.self&&!a.organizer&&a.responseStatus!=='declined');
 if(e.status!=='cancelled' && (!guest || !e.start?.dateTime)) continue;
 const calendar_id='REPLACE_CALENDAR_ID';
 out.push({json:{booking_key:calendar_id+'|'+e.id,calendar_id,event_id:e.id,service:e.summary||'',start:e.start?.dateTime||'',end:e.end?.dateTime||'',name:guest?.displayName||'',email:guest?.email||'',status:e.status||'confirmed',updated:e.updated||''}});
} return out;"""
(ROOT/'normalize.js').write_text(normalize)
save('01-sync',[schedule(5),node('Calendar events','googleCalendar',{'operation':'getAll','calendar':{'__rl':True,'value':CAL,'mode':'id'},'returnAll':True,'options':{'showDeleted':True}},1.3),code('Normalize',normalize),sheet('Upsert bookings','appendOrUpdate',{h:'={{ $json.'+h+' }}' for h in HEADERS[:10]})])
select="""const now=Date.now(); return $input.all().filter(({json:r})=>{
 const start=Date.parse(r.start), delta=start-now;
 const key=r.booking_key+'|'+new Date(Number.isFinite(start)?start:0).toISOString();
 return r.status==='confirmed' && /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(r.email||'') && delta>0 && delta<=86400000 && delta>=84600000 && !(r.reminder_key===key && ['sending','sent','uncertain'].includes(r.reminder_state));
}).map(({json:r})=>({json:{...r,reminder_key:r.booking_key+'|'+new Date(r.start).toISOString()}}));"""
(ROOT/'select.js').write_text(select)
# Each candidate is processed as an item through native Google nodes. Revalidation before claim.
validate="""const rows=$('Due bookings').all(); return $input.all().flatMap(({json:e},i)=>{
 const r=rows[i]?.json; if(!r || e.status!=='confirmed' || Date.parse(e.start?.dateTime)!==Date.parse(r.start)) return [];
 const guest=(e.attendees||[]).find(a=>a.email===r.email && a.responseStatus!=='declined');
 if(!guest || Date.parse(r.start)<=Date.now()) return [];
 return [{json:{...r,reminder_state:'sending'},pairedItem:{item:i}}];
});"""
claim={h:'={{ $json.'+h+' }}' for h in ['booking_key','reminder_key','reminder_state']}
# Read back original candidate via item linking after Sheets writes.
restore=code('Message',"return $input.all().map((item,i)=>{const r=$('Revalidate').itemMatching(i).json; const date=new Intl.DateTimeFormat('es-ES',{timeZone:'Europe/Madrid',dateStyle:'full',timeStyle:'short'}).format(new Date(r.start)); return {json:{...r,subject:'Recordatorio de tu cita — BARBERFLOW DEMO',message:'Hola '+(r.name||'')+',\\nTe recordamos tu cita: '+r.service+' el '+date+'.\\nPara cambiar o cancelar, utiliza el correo de confirmación de Google Calendar.\\nBARBERFLOW DEMO',reminder_state:'sent'},pairedItem:{item:i}};});")
save('02-reminders',[schedule(15),sheet('Read bookings','read'),code('Due bookings',select),node('Get current event','googleCalendar',{'operation':'get','calendar':{'__rl':True,'value':CAL,'mode':'id'},'eventId':'={{ $json.event_id }}','options':{}},1.3),code('Revalidate',validate),sheet('Claim reminder','appendOrUpdate',claim),restore,node('Send reminder','gmail',{'resource':'message','operation':'send','sendTo':'={{ $json.email }}','subject':'={{ $json.subject }}','emailType':'text','message':'={{ $json.message }}','options':{'appendAttribution':False}},2.1),sheet('Record sent','appendOrUpdate',{'booking_key':"={{ $('Message').item.json.booking_key }}",'reminder_key':"={{ $('Message').item.json.reminder_key }}",'reminder_state':'sent','sent_at':'={{ $now.toISO() }}'})])
save('03-errors',[node('Workflow error','errorTrigger',{}),code('Safe error message',"return [{json:{message:'BARBERFLOW: ha fallado una ejecución. Revisar n8n y las filas sending antes de reintentar. Workflow: '+($json.workflow?.name||'desconocido')+'. No reenviar automáticamente.'}}];"),node('Notify operator','gmail',{'resource':'message','operation':'send','sendTo':'REPLACE_OPERATOR_EMAIL','subject':'BARBERFLOW — revisar incidencia','emailType':'text','message':'={{ $json.message }}','options':{'appendAttribution':False}},2.1)])
(ROOT/'bookings-header.csv').write_text(','.join(HEADERS)+'\n')
