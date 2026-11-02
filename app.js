(()=>{
'use strict';
const APP_VERSION='3.1.0';
const DB_NAME='pracownia_db_v1';
const DATA_KEY='snapshot';
const RECOVERY_KEY='safety-previous-v1';
const $=s=>document.querySelector(s);
const htmlEscape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const now=()=>new Date().toISOString();
const uid=()=> (crypto?.randomUUID?.() || 'id_'+Date.now()+'_'+Math.random().toString(16).slice(2));
const fMoney=n=>new Intl.NumberFormat('pl-PL',{style:'currency',currency:'PLN',minimumFractionDigits:0,maximumFractionDigits:2}).format(Number(n)||0);
const fNum=n=>new Intl.NumberFormat('pl-PL',{maximumFractionDigits:1}).format(Number(n)||0);
const fHours=n=>new Intl.NumberFormat('pl-PL',{maximumFractionDigits:2}).format(Number(n)||0);
const fDate=s=>s?new Intl.DateTimeFormat('pl-PL',{day:'numeric',month:'short',year:'numeric'}).format(new Date(s+'T12:00:00')):'Bez terminu';
const val=v=>Math.max(0,Number(v)||0);
const money=v=>Math.round((val(v)+Number.EPSILON)*100)/100;
const $ico={home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-7h6v7"/>',folder:'<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v11H3z"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',wallet:'<rect x="3" y="6" width="18" height="15" rx="2"/><path d="M3 9V5a2 2 0 0 1 2-2h13M16 14h5"/>',check:'<path d="m5 12 4 4L19 6"/>',checks:'<path d="m3 8 2 2 4-4M13 8h8M3 17l2 2 4-4M13 17h8"/>',plus:'<path d="M12 5v14M5 12h14"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l-1.1 1.1a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.06 1.57V21h-3.4v-1.79A1.7 1.7 0 0 0 11.24 17.6a1.7 1.7 0 0 0-1.88.34l-1.1-1.1A1.7 1.7 0 0 0 8.6 15 1.7 1.7 0 0 0 7 13.95H5v-3.4h2A1.7 1.7 0 0 0 8.6 9a1.7 1.7 0 0 0-.34-1.88l1.1-1.1a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.06-1.57V3h3.4v1.79A1.7 1.7 0 0 0 16.76 6.4a1.7 1.7 0 0 0 1.88-.34l1.1 1.1A1.7 1.7 0 0 0 19.4 9 1.7 1.7 0 0 0 21 10.55h1v3.4h-1A1.7 1.7 0 0 0 19.4 15z"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M5 18v3h14v-3"/>',upload:'<path d="M12 21V9m-5 5 5-5 5 5M5 6V3h14v3"/>',brief:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',users:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 4a6 6 0 0 1 3 5"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',trend:'<path d="M3 17 9 11l4 4 8-8M15 7h6v6"/>',pencil:'<path d="m4 20 4-.8L20 7a2 2 0 0 0-3-3L5 16z"/>',trash:'<path d="M4 7h16M10 4h4M6 7l1 14h10l1-14M10 11v6M14 11v6"/>',archive:'<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v12h14V9m-9 5h4"/>',spark:'<path d="m12 3 2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z"/>',arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>', 'arrow-left':'<path d="M19 12H5m6-6-6 6 6 6"/>',filter:'<path d="M4 7h16M7 12h10M10 17h4"/>',copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',shield:'<path d="m12 2 9 4v6c0 6-4 9-9 10-5-1-9-4-9-10V6z"/><path d="m9 12 2 2 4-4"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.5"/>',map:'<path d="M3 6 9 3l6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',money:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5c-1.5-1.5-6-1.5-6 1s6 2 6 4.5-4 2.5-7 1M12 5v14"/>'};
function icon(n){return `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${$ico[n]||$ico.folder}</svg>`;}
const validStatus=['Planowane','W trakcie','Zakończone','Anulowane'];
const blank=()=>({version:12,projects:[],tasks:[],reminders:[],quotes:[],lastSaved:now()});
let state=blank(),view='home',filter='all',search='',taskFilter='open',installEvent=null,isDemo=false;
let notebookTurn='';
let calendarMonth='',calendarSelected='';
let detailReturnScroll=null;
let financeMonth=[new Date().getFullYear(),String(new Date().getMonth()+1).padStart(2,'0')].join('-');
let db=null, dbAvailable=true;
function openDb(){return new Promise((resolve,reject)=>{if(!('indexedDB' in window)){reject(new Error('IndexedDB niedostępna'));return;}const request=indexedDB.open(DB_NAME,1);request.onupgradeneeded=()=>{request.result.createObjectStore('kv')};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)})}
function idbGet(key=DATA_KEY){return new Promise((resolve,reject)=>{let req=db.transaction('kv','readonly').objectStore('kv').get(key);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
function idbSet(snapshot,keepPrevious=true){
 return new Promise((resolve,reject)=>{
  const tx=db.transaction('kv','readwrite'),store=tx.objectStore('kv');
  if(keepPrevious){
   const old=store.get(DATA_KEY);
   old.onsuccess=()=>{if(old.result!=null)store.put(old.result,RECOVERY_KEY);store.put(snapshot,DATA_KEY)};
  }else store.put(snapshot,DATA_KEY);
  tx.oncomplete=()=>resolve();
  tx.onerror=()=>reject(tx.error||new Error('Nie udało się zapisać bazy'));
  tx.onabort=()=>reject(tx.error||new Error('Zapis został przerwany'));
 });
}
let writeQueue=Promise.resolve(),pendingWrites=0,storageBlocked=false,saveStatus='ready',lastSaveError='',pendingBackup=null;
function saveMessage(){
 if(storageBlocked)return 'Wstrzymany zapis — sprawdź odzyskiwanie danych';
 if(saveStatus==='error')return 'BŁĄD zapisu — wyeksportuj kopię i sprawdź pamięć telefonu';
 if(pendingWrites||saveStatus==='saving')return 'Zapisywanie na urządzeniu…';
 return state.lastSaved&&Number.isFinite(Date.parse(state.lastSaved))?'Zapis lokalny · '+new Intl.DateTimeFormat('pl-PL',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(state.lastSaved)):'Dane tylko na tym urządzeniu';
}
function updateSaveIndicator(){const el=$('#manu-save-status');if(el){el.textContent=saveMessage();el.classList?.toggle('is-error',storageBlocked||saveStatus==='error')}}
async function load(){
 try{db=await openDb()}catch(e){dbAvailable=false;console.warn('IndexedDB niedostępna — localStorage',e)}
 try{
  let raw=dbAvailable?await idbGet():null;
  if(raw==null){const legacy=localStorage.getItem(DATA_KEY);if(legacy)raw=JSON.parse(legacy)}
  if(raw!=null)state=normalize(raw);
  saveStatus='saved';
 }catch(e){
  storageBlocked=true;saveStatus='error';lastSaveError=String(e?.message||e);
  console.error('MANU: wstrzymano zapis, aby nie nadpisać danych',e);
 }
}
function writeLocalSnapshot(snapshot,keepPrevious){
 const old=localStorage.getItem(DATA_KEY);
 if(keepPrevious && old!=null)localStorage.setItem(RECOVERY_KEY,old);
 localStorage.setItem(DATA_KEY,JSON.stringify(snapshot));
}
function save(candidate=state,force=false){
 if(storageBlocked&&!force){saveStatus='error';updateSaveIndicator();toast('Zapis wstrzymany. Otwórz Ustawienia i sprawdź dane.');return Promise.resolve(false)}
 const snapshot=structuredClone(candidate);
 snapshot.lastSaved=now();
 const keepPrevious=!storageBlocked;
 pendingWrites++;saveStatus='saving';updateSaveIndicator();
 const operation=writeQueue.then(async()=>{
  if(storageBlocked&&!force)throw Error('Zapis wstrzymany z powodu wcześniejszego błędu');
  if(dbAvailable)await idbSet(snapshot,keepPrevious);
  else writeLocalSnapshot(snapshot,keepPrevious);
 }).then(()=>{
  if(candidate===state)state.lastSaved=snapshot.lastSaved;
  if(force)storageBlocked=false;
  lastSaveError='';
  return true;
 }).catch(e=>{
  saveStatus='error';storageBlocked=true;lastSaveError=String(e?.message||e);
  console.error('MANU: nie zapisano zmian',e);
  toast('BŁĄD zapisu! Nie zamykaj aplikacji; pobierz kopię danych.');
  return false;
 }).finally(()=>{
  pendingWrites--;
  if(!storageBlocked)saveStatus=pendingWrites?'saving':'saved';
  updateSaveIndicator();
 });
 writeQueue=operation.then(()=>{});
 return operation;
}
async function readRecovery(){
 try{
  await writeQueue;
  const old=dbAvailable?await idbGet(RECOVERY_KEY):localStorage.getItem(RECOVERY_KEY);
  if(old==null)return null;
  return typeof old==='string'?JSON.parse(old):old;
 }catch(e){console.error('Nie można odczytać poprzedniej wersji',e);throw Error('Nie udało się odczytać lokalnego punktu przywracania')}
}
const validTime=t=>typeof t==='string'&&Number.isFinite(Date.parse(t))?t:'';
const TIMER_LIMIT=24*3600;
function defaultStages(type,status='Planowane'){
 const labels=type==='Warsztat'?['Plan i program','Zapisy uczestników','Przygotowanie materiałów','Prowadzenie warsztatu','Rozliczenie']:['Plan i projekt','Materiały','Wykonanie','Wykończenie','Odbiór zlecenia'];
 return labels.map((title,index)=>({id:'s'+index,title,done:status==='Zakończone'}));
}
function normalizeStages(p){
 const list=Array.isArray(p.stages)?p.stages:defaultStages(p.type,p.status);
 return list.slice(0,40).filter(x=>x&&typeof x==='object').map(x=>({id:String(x.id||uid()),title:String(x.title||'Etap').slice(0,120),done:!!x.done}));
}
function normalizeWorkLog(list){
 return(Array.isArray(list)?list:[]).slice(-2500).filter(x=>x&&typeof x==='object').map(x=>({
 id:String(x.id||uid()),date:validTime(x.date)||now(),seconds:Math.min(31536000,Math.max(0,Math.floor(Number(x.seconds)||0))),
 note:String(x.note||'').slice(0,350),source:x.source==='timer'?'timer':'manual'
 }));
}
function normalizeActivityLog(list){
 return(Array.isArray(list)?list:[]).slice(-200).filter(x=>x&&typeof x==='object').map(x=>({id:String(x.id||uid()),date:validTime(x.date)||now(),message:String(x.message||'').slice(0,200)}));
}
function normalizeTimer(timer){
 if(!timer||typeof timer!=='object')return {startedAt:'',seconds:0};
 return {startedAt:validTime(timer.startedAt),seconds:Math.min(TIMER_LIMIT,Math.max(0,Math.floor(Number(timer.seconds)||0)))};
}
function recordActivity(p,message){p.activityLog=(p.activityLog||[]).concat({id:uid(),date:now(),message}).slice(-200)}
function durationSecs(s){
 const n=Math.max(0,Math.floor(Number(s)||0)),h=Math.floor(n/3600),m=Math.floor((n%3600)/60),sec=n%60;
 return h?h+' godz. '+String(m).padStart(2,'0')+' min':m?m+' min '+String(sec).padStart(2,'0')+' s':sec+' s';
}
function activeTimerSeconds(p,at=Date.now()){
 const t=p.timer||{startedAt:'',seconds:0};
 const started=t.startedAt?Math.max(0,Math.floor((at-Date.parse(t.startedAt))/1000)):0;
 return Math.min(TIMER_LIMIT,Math.max(0,Math.floor(t.seconds||0))+started);
}
function progressPercent(p){const stages=p.stages||[];return stages.length?Math.round(stages.filter(s=>s.done).length/stages.length*100):p.status==='Zakończone'?100:0}
function workSessionsTotal(p){return (p.workLog||[]).reduce((total,e)=>total+Number(e.seconds||0),0)}
function timerButtons(p){
 const active=!!p.timer?.startedAt,paused=!active&&!!p.timer?.seconds,id=htmlEscape(p.id);
 const btns=active?'<button type="button" class="btn secondary sm" data-action="timer-pause" data-id="'+id+'">'+icon('clock')+' Pauza</button>':'<button type="button" class="btn sm" data-action="timer-start" data-id="'+id+'">'+icon('clock')+(paused?' Wznów':' Start')+'</button>';
 return '<div class="work-timer"><span class="work-timer-value" data-timer-value="'+id+'" aria-live="off">'+durationSecs(activeTimerSeconds(p))+'</span><span class="work-timer-state">'+(active?'Stoper pracuje · liczy także przy zablokowanym ekranie':paused?'Pauza · wznów lub zakończ sesję':'Gotowy do mierzenia czasu pracy')+'</span><div class="work-timer-buttons">'+btns+'<button type="button" class="btn ghost sm" data-action="timer-stop" data-id="'+id+'" '+(active||paused?'':'disabled')+'>'+icon('check')+' Stop i zapisz</button></div></div>';
}
function liveTimerRefresh(){
 for(const p of state.projects){
  if(!p.timer?.startedAt)continue;
  const el=$('[data-timer-value="'+p.id.replace(/"/g,'')+'"]');
  if(el)el.textContent=durationSecs(activeTimerSeconds(p));
 }
}

function normalizeReminders(items){
 return (Array.isArray(items)?items:[]).slice(0,3000).filter(x=>x&&typeof x==='object').map(x=>({
  id:String(x.id||uid()),title:String(x.title||'').slice(0,180),
  date:validDate(x.date),time:/^([01]\d|2[0-3]):[0-5]\d$/.test(String(x.time||''))?x.time:'',
  projectId:String(x.projectId||''),done:!!x.done,createdAt:validTime(x.createdAt)||now()
 })).filter(x=>x.title&&x.date);
}

function normalizeQuotes(records){
 return(Array.isArray(records)?records:[]).slice(0,3000).filter(q=>q&&typeof q==='object'&&!Array.isArray(q)).map(q=>({
 id:String(q.id||uid()),number:String(q.number||'').slice(0,55),projectId:String(q.projectId||''),
 title:String(q.title||'Wycena').slice(0,140),issuer:String(q.issuer||'').slice(0,180),
 issuerContact:String(q.issuerContact||'').slice(0,350),client:String(q.client||'').slice(0,180),
 issued:validDate(q.issued)||localDay(),validUntil:validDate(q.validUntil),notes:String(q.notes||'').slice(0,900),
 discount:money(q.discount),createdAt:validTime(q.createdAt)||now(),
 items:(Array.isArray(q.items)?q.items:[]).slice(0,80).filter(i=>i&&typeof i==='object'&&!Array.isArray(i)).map(i=>({
 id:String(i.id||uid()),description:String(i.description||'').slice(0,180),quantity:Math.min(100000,Math.max(0,Number(i.quantity)||0)),unit:String(i.unit||'szt.').slice(0,24),unitPrice:money(i.unitPrice)
 }))
 }));
}
function quoteSubtotal(q){return Math.round((q.items||[]).reduce((sum,i)=>sum+(Number(i.quantity)||0)*money(i.unitPrice),0)*100)/100}
function quoteTotal(q){return Math.max(0,Math.round((quoteSubtotal(q)-money(q.discount))*100)/100)}
function quoteNewNumber(){
 const year=new Date().getFullYear();
 const nums=(state.quotes||[]).map(q=>String(q.number).split('MANU-'+year+'-')[1]).map(Number).filter(n=>Number.isInteger(n)&&n>0);
 return 'MANU-'+year+'-'+String(Math.max(0,...nums)+1).padStart(3,'0');
}
function normalize(obj){if(!obj || !Array.isArray(obj.projects)||!Array.isArray(obj.tasks))throw Error('Nieprawidłowy plik danych');return {version:12,lastSaved:obj.lastSaved||now(),projects:obj.projects.map(p=>({id:String(p.id||uid()),title:String(p.title||''),type:p.type==='Warsztat'?'Warsztat':'Zlecenie',client:String(p.client||''),date:validDate(p.date),paymentDue:validDate(p.paymentDue),status:validStatus.includes(p.status)?p.status:'Planowane',price:money(p.price),paid:money(p.paid),financeMode:p.financeMode==='participants'?'participants':'manual',participantFee:money(p.participantFee),hours:val(p.hours),capacity:val(p.capacity),quantity:Math.max(1,Math.floor(val(p.quantity)||1)),estimatedHours:val(p.estimatedHours),estimatedMaterials:money(p.estimatedMaterials),workLocation:String(p.workLocation||''),transportType:p.transportType==='paid'?'paid':p.transportType==='none'?'none':p.transportType==='car'?'car':(val(p.travelKm)>0||val(p.fuelConsumption)>0||val(p.fuelPrice)>0||val(p.travelRate)>0||val(p.travelExtra)>0?'car':'none'),paidTransportCost:money(p.paidTransportCost),paidTransportLabel:String(p.paidTransportLabel||''),travelKm:val(p.travelKm),travelMode:p.travelMode==='fuel'?'fuel':p.travelMode==='rate'?'rate':money(p.travelRate)>0?'rate':'fuel',fuelConsumption:val(p.fuelConsumption),fuelPrice:money(p.fuelPrice),travelRate:money(p.travelRate),travelExtra:money(p.travelExtra),location:String(p.location||''),startTime:/^([01]\d|2[0-3]):[0-5]\d$/.test(String(p.startTime||''))?String(p.startTime):'',durationHours:val(p.durationHours),notes:String(p.notes||''),expenses:Array.isArray(p.expenses)?p.expenses.map(x=>({id:String(x.id||uid()),title:String(x.title||''),amount:money(x.amount),date:validDate(x.date),category:validExpenseCategory(x.category)})):[],payments:normalizePayments(p.payments),workshopMaterials:normalizeWorkshopMaterials(p.workshopMaterials),participants:Array.isArray(p.participants)?p.participants.map(x=>({id:String(x.id||uid()),name:String(x.name||''),fee:money(x.fee),paidAmount:money(x.paidAmount),payments:normalizePayments(x.payments),legacyPaid:!!x.legacyPaid||(x.paidAmount==null&&x.paid===true),bookingStatus:x.bookingStatus==='waitlist'?'waitlist':'confirmed',attendance:['present','absent'].includes(x.attendance)?x.attendance:'unknown',joinedAt:validTime(x.joinedAt)||String(x.createdAt||p.createdAt||now())})):[],createdAt:p.createdAt||now(),stages:normalizeStages(p),workLog:normalizeWorkLog(p.workLog),activityLog:normalizeActivityLog(p.activityLog),timer:normalizeTimer(p.timer)})),tasks:obj.tasks.map(t=>({id:String(t.id||uid()),title:String(t.title||''),due:validDate(t.due),done:!!t.done,projectId:String(t.projectId||''),createdAt:t.createdAt||now()})),reminders:normalizeReminders(obj.reminders),quotes:normalizeQuotes(obj.quotes)};}
const enteredExpenses=p=>money((p.expenses||[]).reduce((n,x)=>n+val(x.amount),0));
const transportType=p=>p.transportType==='paid'?'paid':p.transportType==='none'?'none':p.transportType==='car'?'car':(val(p.travelKm)>0||val(p.fuelConsumption)>0||val(p.fuelPrice)>0||val(p.travelRate)>0||val(p.travelExtra)>0?'car':'none');
const travelMode=p=>p.travelMode==='rate'?'rate':p.travelMode==='fuel'?'fuel':money(p.travelRate)>0?'rate':'fuel';
const travelFuelLitres=p=>val(p.travelKm)*val(p.fuelConsumption)/100;
const travelCost=p=>p.type!=='Zlecenie'||transportType(p)==='none'?0:money((transportType(p)==='paid'?money(p.paidTransportCost):(travelMode(p)==='rate'?val(p.travelKm)*val(p.travelRate):travelFuelLitres(p)*val(p.fuelPrice)))+val(p.travelExtra));
const expenses=p=>money(enteredExpenses(p)+estimatedTravelApplied(p));
const validDate=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d+'T12:00:00'))&&new Date(d+'T12:00:00').toISOString().slice(0,10)===d?d:'';
const validExpenseCategory=x=>['materialy','dojazd','uslugi','inne'].includes(x)?x:'inne';
const expenseCategoryName=k=>({materialy:'Materiały',dojazd:'Dojazd faktyczny',uslugi:'Usługi',inne:'Inne'})[validExpenseCategory(k)];
function normalizePayments(v){
 return(Array.isArray(v)?v:[]).slice(-3000).filter(x=>x&&typeof x==='object').map(x=>({
  id:String(x.id||uid()),date:validDate(x.date),amount:money(x.amount),kind:x.kind==='zaliczka'?'zaliczka':'wplata',note:String(x.note||'').slice(0,220)
 }));
}
const paymentListTotal=list=>money((list||[]).reduce((sum,x)=>sum+money(x.amount),0));
const projectExtraPayments=p=>paymentListTotal(p.payments);
const participantPaid=p=>money(p.paidAmount+paymentListTotal(p.payments));
const actualTravelExpenses=p=>(p.expenses||[]).filter(e=>e.category==='dojazd');
const estimatedTravelApplied=p=>actualTravelExpenses(p).length?0:travelCost(p);
const projectPlannedCost=p=>money(val(p.estimatedMaterials)+travelCost(p));
const projectActualCost=p=>money((p.expenses||[]).reduce((sum,x)=>sum+money(x.amount),0));
function projectFinanceNotes(p){
 const actual=projectActualCost(p),planned=projectPlannedCost(p),estimatedTravel=estimatedTravelApplied(p);
 return {actual,planned,estimatedTravel,hasActualTravel:actualTravelExpenses(p).length>0};
}
function normalizeWorkshopMaterials(list){
 return (Array.isArray(list)?list:[]).slice(0,150).filter(x=>x&&typeof x==='object').map(x=>({
  id:String(x.id||uid()),title:String(x.title||'').slice(0,130),
  quantity:Math.min(9999,Math.max(1,Math.floor(Number(x.quantity)||1))),
  done:!!x.done
 }));
}
function confirmedParticipants(p){return (p.participants||[]).filter(x=>x.bookingStatus!=='waitlist')}
function waitlistedParticipants(p){return (p.participants||[]).filter(x=>x.bookingStatus==='waitlist')}
function freePlaces(p){return p.capacity>0?Math.max(0,Math.floor(p.capacity)-confirmedParticipants(p).length):Infinity}
function attendanceSummary(p){
 const confirmed=confirmedParticipants(p);
 return {present:confirmed.filter(x=>x.attendance==='present').length,absent:confirmed.filter(x=>x.attendance==='absent').length,unmarked:confirmed.filter(x=>x.attendance==='unknown').length}
}
function materialsSummary(p){
 const list=p.workshopMaterials||[];
 return {total:list.length,ready:list.filter(x=>x.done).length}
}
function paymentSummary(p){
 const list=confirmedParticipants(p);
 const fee=money(list.reduce((s,x)=>s+money(x.fee),0));
 const received=money(list.reduce((s,x)=>s+participantPaid(x),0));
 const outstanding=money(list.reduce((s,x)=>s+Math.max(0,money(x.fee)-participantPaid(x)),0));
 return {fee,received,outstanding};
}
const projectIncome=p=>p.type==='Warsztat'&&p.financeMode==='participants'?paymentSummary(p).fee:money(p.price);
const projectPaid=p=>p.type==='Warsztat'&&p.financeMode==='participants'?paymentSummary(p).received:money(p.paid+projectExtraPayments(p));
const profit=p=>projectIncome(p)-expenses(p);
const active=()=>state.projects.filter(p=>p.status!=='Anulowane');
function metrics(){const list=active();return {count:list.filter(x=>x.status!=='Zakończone').length,income:list.reduce((s,p)=>s+projectIncome(p),0),cost:list.reduce((s,p)=>s+expenses(p),0),paid:list.reduce((s,p)=>s+projectPaid(p),0),profit:list.reduce((s,p)=>s+profit(p),0),hours:list.reduce((s,p)=>s+val(p.hours),0),unpaid:list.reduce((s,p)=>s+Math.max(0,projectIncome(p)-projectPaid(p)),0),todo:state.tasks.filter(t=>!t.done).length}}
const pillStatus=p=>{const key=p.status==='Zakończone'?'done':p.status==='W trakcie'?'progress':p.status==='Anulowane'?'cancel':'';return `<span class="pill ${key}">${htmlEscape(p.status)}</span>`};
const projectTypeIcon=p=>`<div class="proj-icon ${p.type==='Warsztat'?'workshop':''}">${icon(p.type==='Warsztat'?'users':'brief')}</div>`;
function bar(part,total){let percentage=total>0?Math.min(100,Math.max(0,(part/total)*100)):0;return `<div class="bar-track"><div class="bar-fill" style="width:${percentage}%"></div></div>`;}
function empty(title,desc,button=''){return `<div class="empty">${icon('spark')}<h3>${title}</h3><p>${desc}</p>${button}</div>`;}
function navBtn(tab,ic,label){return `<button class="nav-link ${tab===view?'active':''}" data-action="nav" data-view="${tab}">${icon(ic)}${label}</button>`;}
function mobileBtn(tab,ic,label){return `<button class="mobile-tab ${tab===view?'active':''}" data-action="nav" data-view="${tab}">${icon(ic)}<span>${label}</span></button>`;}
function openNotebook(content,page,turn=''){
 const pageLabels={projects:'REJESTR PROJEKTÓW',finance:'KSIĘGA FINANSÓW',tasks:'LISTA ZADAŃ',calendar:'KALENDARZ I TERMINY'};
 const edge=['finance','calendar'].includes(page)?'right':'left';
 const animation=turn==='next'||turn==='prev'?' page-turn-'+turn:'';
 return `<section class="open-notebook open-notebook--${edge}${animation}" aria-label="${pageLabels[page]||'Wnętrze notesu'}" data-book-page="${htmlEscape(page)}" data-book-edge="${edge}">
  <div class="open-notebook-binding" aria-hidden="true">
   <span class="book-cover-edge"></span><span class="book-binding-seam"></span><span class="book-paper-edges"></span>
  </div>
  <div class="open-notebook-sheet">
   <div class="open-notebook-ribbon" aria-hidden="true"></div>
   <div class="open-notebook-lead"><span>MANU <b>·</b> ORGANIZER TWÓRCY</span><span>${pageLabels[page]||''}</span></div>
   <div class="open-notebook-content">${content}</div>
   <div class="open-notebook-footer"><span>MANU</span><span>TWÓJ NOTES TWÓRCY</span></div>
  </div>
 </section>`;
}
function render(){let m=metrics();const turn=notebookTurn;notebookTurn='';const inside=['projects','finance','tasks','calendar'].includes(view);const pageContent=view==='home'?homePage(m):view==='projects'?projectsPage():view==='finance'?financePage(m):view==='tasks'?tasksPage():view==='calendar'?calendarPage():settingsPage();$('#app').innerHTML=`<div class="app-shell"><aside class="sidebar"><div class="brand"><div class="brandmark"><img class="brand-symbol" src="manu48-mark.svg" alt="" width="40" height="40"></div><div><h2>MANU</h2><p>Organizer twórcy</p></div></div><nav class="nav-list" aria-label="Nawigacja">${navBtn('home','home','Pulpit')}${navBtn('projects','folder','Projekty i warsztaty')}${navBtn('finance','wallet','Finanse')}${navBtn('tasks','checks','Zadania')}${navBtn('calendar','calendar','Kalendarz')}${navBtn('settings','settings','Ustawienia')}</nav><div class="sidebar-end">${icon('shield')}<strong>Twoja przestrzeń</strong><p>Wersja testowa · Dane przechowywane na tym urządzeniu. Regularnie eksportuj kopię.</p></div></aside><main class="main-area ${view==='home'?'manu-cover-home':inside?'manu-open-workspace':''}">${view==='home'?'<div class="cover-stitch" aria-hidden="true"></div><button type="button" class="cover-strap" data-action="new-project" aria-label="Otwórz notes i dodaj nowe zlecenie" title="Otwórz notes"><span class="cover-strap-button">M</span></button>':''}<header class="topbar"><div class="eyebrow">MANU · ORGANIZER TWÓRCY</div><div class="mobile-brand"><img src="manu48-mark.svg" alt="" width="34" height="34"><div><strong>MANU</strong><small>ORGANIZER TWÓRCY</small></div></div><div class="topbar-right"><div class="date-chip">${new Intl.DateTimeFormat('pl-PL',{day:'numeric',month:'short'}).format(new Date())}</div><button class="avatar" data-action="nav" data-view="settings" aria-label="Ustawienia" title="Ustawienia">${icon('settings')}</button></div></header>${inside?openNotebook(pageContent,view,turn):pageContent}</main><nav class="mobile-nav" aria-label="Nawigacja mobilna">${mobileBtn('home','home','Start')}${mobileBtn('projects','folder','Projekty')}${mobileBtn('add','plus','Dodaj')}${mobileBtn('finance','wallet','Finanse')}${mobileBtn('tasks','checks','Zadania')}${mobileBtn('calendar','calendar','Terminy')}</nav></div>`;}
function pageHeading(title,desc,btn=''){return `<div class="page-heading"><div><h1 class="page-title">${title}</h1><p class="page-lede">${desc}</p></div>${btn}</div>`}
function statsCard(label,number,note,ic,cls=''){return `<div class="stat"><div class="stat-top"><span>${label}</span><div class="stat-icon">${icon(ic)}</div></div><strong class="${cls}">${number}</strong><small>${note}</small></div>`}
function homePage(m){const recent=[...state.projects].sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||'')).slice(0,4);let next=[...state.tasks].filter(t=>!t.done).sort((a,b)=>(a.due||'9999').localeCompare(b.due||'9999')).slice(0,5);return `<div class="cover-signature" aria-label="MANU — Organizer twórcy"><img src="manu48-mark.svg" alt="" width="58" height="58"><strong>MANU</strong><span>ORGANIZER TWÓRCY</span><small>TWÓJ OSOBISTY NOTES</small></div>${pageHeading('Dzień dobry, twórco 👋','Twoje dzieła, projekty i plany w jednym eleganckim miejscu.',`<button class="btn" data-action="new-project">${icon('plus')}<span class="hide-small">Nowy projekt</span><span class="hide-small"> / warsztat</span></button>`)}<section class="hero"><div><div class="label">TWÓJ WYNIK · WSZYSTKIE AKTYWNE PROJEKTY</div><h1>${fMoney(m.profit)}</h1><p>Szacunkowo zostaje po wpisanych kosztach, w tym planowanym dojeździe.<br>Bez podatków, składek i nieujętych kosztów działalności.</p></div><div class="hero-stats"><strong>${m.count}</strong><span>otwartych projektów</span></div></section><section class="stat-grid">${statsCard('Wartość zleceń',fMoney(m.income),'Wpisany przychód','trend')}${statsCard('Koszty',fMoney(m.cost),'Wydatki projektowe','wallet')}${statsCard('Do zapłaty',fMoney(m.unpaid),'Pozostałe wpłaty','money')}${statsCard('Otwarte zadania',m.todo,'Do wykonania','checks')}</section><section class="content-grid"><div class="surface"><div class="section-head"><h2>Ostatnie projekty</h2><button class="link" data-action="nav" data-view="projects">Wszystkie ${icon('arrow')}</button></div>${recent.length?recent.map(projectRow).join(''):empty('Tu zacznie się Twoja historia','Dodaj pierwsze zlecenie albo warsztat. Możesz też wgrać dane demonstracyjne.',`<button class="btn sm" data-action="new-project">${icon('plus')} Dodaj projekt</button><button class="btn secondary sm" data-action="demo">Wstaw demo</button>`)}</div><div class="surface"><div class="section-head"><h2>Najbliższe zadania</h2><button class="link" data-action="new-task">${icon('plus')} Dodaj</button></div>${next.length?next.map(taskRow).join(''):empty('Wszystko pod kontrolą','Nie masz aktualnie otwartych zadań.',`<button class="btn secondary sm" data-action="new-task">Utwórz zadanie</button>`)}</div></section><section class="surface home-upcoming"><div class="section-head"><h2>Terminy i przypomnienia</h2><button class="link" data-action="nav" data-view="calendar">Kalendarz ${icon('arrow')}</button></div>${calendarAlertMarkup(5)}</section>`}
function projectRow(p){return `<div class="project-row" role="button" tabindex="0" data-action="open-project" data-id="${htmlEscape(p.id)}">${projectTypeIcon(p)}<div class="project-row-info"><b>${htmlEscape(p.title)}</b><span>${htmlEscape(p.type)} · ${htmlEscape(p.client||'Bez klienta')} · ${fDate(p.date)}</span></div><div class="right-stats"><b class="${profit(p)>=0?'money-positive':'money-negative'}">${fMoney(profit(p))}</b><small>po kosztach</small></div></div>`;}
function quoteItemRow(item={}){
 return `<div class="quote-line" data-quote-row>
  <div class="field quote-line-description"><label>Pozycja</label><input name="description" maxlength="180" value="${htmlEscape(item.description||'')}" required placeholder="Np. Matowienie lustra"></div>
  <div class="field"><label>Ilość</label><input name="quantity" type="number" min="0.01" max="100000" step="any" value="${item.quantity||1}" required></div>
  <div class="field"><label>Jednostka</label><input name="unit" maxlength="24" value="${htmlEscape(item.unit||'szt.')}" required></div>
  <div class="field"><label>Cena jedn. (zł)</label><input name="unitPrice" type="number" min="0" max="100000000" step="0.01" value="${money(item.unitPrice)}" required></div>
  <button type="button" class="btn ghost sm quote-remove-line" data-action="quote-remove-line" aria-label="Usuń pozycję">${icon('trash')}</button>
 </div>`;
}
function quoteForm(projectId='',quoteId=''){
 const existing=(state.quotes||[]).find(q=>q.id===quoteId);
 const p=state.projects.find(p=>p.id===(existing?.projectId||projectId));
 const qty=Math.max(1,Math.floor(p?.quantity||1));
 const itemDefault={description:p?.title||'',quantity:qty,unit:'szt.',unitPrice:p?money(projectIncome(p)/qty):0};
 const q=existing||{number:quoteNewNumber(),projectId:p?.id||'',title:p?.title?'Wycena — '+p.title:'Nowa wycena',client:p?.client||'',issued:localDay(),validUntil:'',issuer:'',issuerContact:'',notes:'',discount:0,items:[itemDefault]};
 modal(existing?'Edytuj wycenę':'Nowa wycena',`<form id="quote-form" data-id="${htmlEscape(q.projectId)}" data-quote="${htmlEscape(existing?.id||'')}">
 <p class="form-note">Wycena nie zmienia ceny projektu, kosztów ani historii wpłat. To dokument ofertowy, nie faktura.</p>
 <div class="form-cols"><div class="field"><label>Numer</label><input value="${htmlEscape(q.number)}" disabled></div><div class="field"><label>Data wystawienia *</label><input name="issued" type="date" required value="${htmlEscape(q.issued)}"></div><div class="field"><label>Ważna do</label><input name="validUntil" type="date" value="${htmlEscape(q.validUntil)}"></div><div class="field"><label>Projekt (opcjonalnie)</label><select name="projectId"><option value="">Bez projektu</option>${state.projects.map(project=>`<option value="${htmlEscape(project.id)}" ${project.id===q.projectId?'selected':''}>${htmlEscape(project.title)}</option>`).join('')}</select></div></div>
 <div class="field"><label>Tytuł wyceny *</label><input name="title" required maxlength="140" value="${htmlEscape(q.title)}" placeholder="Np. Lustro Ø50 cm — matowienie"></div>
 <div class="form-cols"><div class="field"><label>Wystawiający / pracownia</label><input name="issuer" maxlength="180" value="${htmlEscape(q.issuer)}" placeholder="Nazwa pracowni"></div><div class="field"><label>Klient</label><input name="client" maxlength="180" value="${htmlEscape(q.client)}" placeholder="Odbiorca wyceny"></div></div>
 <div class="field"><label>Kontakt wystawiającego</label><textarea name="issuerContact" rows="2" maxlength="350" placeholder="E-mail lub telefon">${htmlEscape(q.issuerContact)}</textarea></div>
 <div class="quote-form-head"><h3>Pozycje wyceny</h3><button type="button" class="btn secondary sm" data-action="quote-add-line">${icon('plus')} Dodaj pozycję</button></div>
 <div id="quote-lines">${(q.items.length?q.items:[itemDefault]).map(quoteItemRow).join('')}</div>
 <div class="field quote-discount-field"><label>Rabat kwotowy (zł)</label><input name="discount" type="number" min="0" step="0.01" max="100000000" value="${money(q.discount)}"></div>
 <div class="quote-form-summary"><span>Suma po rabacie</span><strong id="quote-live-total">${fMoney(quoteTotal(q))}</strong></div>
 <div class="field"><label>Warunki / uwagi</label><textarea name="notes" maxlength="900" rows="3" placeholder="Np. Termin realizacji ustalany indywidualnie">${htmlEscape(q.notes)}</textarea></div>
 <div class="modal-actions"><button type="button" class="btn ghost" data-action="close">Anuluj</button><button class="btn" type="submit">${icon('check')} Zapisz wycenę</button></div>
 </form>`);
}
function quoteFormItems(form){
 return [...form.querySelectorAll('[data-quote-row]')].map(line=>({
 id:uid(),description:String(line.querySelector('[name="description"]')?.value||'').trim().slice(0,180),
 quantity:Number(line.querySelector('[name="quantity"]')?.value),
 unit:String(line.querySelector('[name="unit"]')?.value||'szt.').trim().slice(0,24),
 unitPrice:Number(line.querySelector('[name="unitPrice"]')?.value)
 }));
}
function refreshQuoteTotal(){
 const form=$('#quote-form');if(!form)return;
 const rows=quoteFormItems(form),discount=money(form.querySelector('[name="discount"]')?.value);
 const el=$('#quote-live-total');if(el)el.textContent=fMoney(quoteTotal({items:rows,discount}));
}
function quotesPage(){
 const list=(state.quotes||[]).slice().sort((a,b)=>b.issued.localeCompare(a.issued)||(b.createdAt||'').localeCompare(a.createdAt||''));
 const rows=list.map(q=>{
  const p=state.projects.find(p=>p.id===q.projectId);
  return `<article class="surface quote-list-card"><div><small>${htmlEscape(q.number)} · ${htmlEscape(q.issued)}</small><h3>${htmlEscape(q.title)}</h3><p>${htmlEscape(q.client||'Klient niepodany')}${p?' · '+htmlEscape(p.title):''}</p></div><div class="quote-list-aside"><strong>${fMoney(quoteTotal(q))}</strong><div><button type="button" class="btn secondary sm" data-action="quote-preview" data-id="${htmlEscape(q.id)}">Podgląd / PDF</button><button type="button" class="btn ghost sm" data-action="quote-edit" data-id="${htmlEscape(q.id)}">${icon('pencil')} Edytuj</button><button type="button" class="btn ghost sm" data-action="quote-delete" data-id="${htmlEscape(q.id)}" aria-label="Usuń wycenę">${icon('trash')}</button></div></div></article>`;
 }).join('');
 return `${pageHeading('Wyceny dla klientów','Przygotuj wycenę i zapisz ją jako PDF.',`<button class="btn" data-action="quote-new">${icon('plus')} Nowa wycena</button>`)}
 <div class="quote-list">${rows||'<div class="surface quote-empty"><h3>Nie masz jeszcze wycen</h3><p>Dodaj pierwszą wycenę albo rozpocznij ją ze zlecenia.</p><button class="btn" data-action="quote-new">Przygotuj wycenę</button></div>'}</div><p class="muted tiny">Wyceny są przechowywane lokalnie. Zapisuj kopie JSON w Ustawieniach. Wycena nie jest fakturą.</p>`;
}
function quoteDocument(q){
 const sub=quoteSubtotal(q),total=quoteTotal(q),discount=Math.min(sub,money(q.discount));
 const rows=q.items.map((item,i)=>`<tr><td>${i+1}</td><td class="quote-doc-description">${htmlEscape(item.description)}</td><td>${new Intl.NumberFormat('pl-PL',{maximumFractionDigits:3}).format(item.quantity)}</td><td>${htmlEscape(item.unit)}</td><td>${fMoney(item.unitPrice)}</td><td>${fMoney(item.quantity*item.unitPrice)}</td></tr>`).join('');
 return `<article class="quote-document" aria-label="Wycena ${htmlEscape(q.number)}">
 <header class="quote-doc-header"><div class="quote-doc-brand"><img src="manu48-mark.svg" alt="" width="45" height="45"><div><strong>MANU</strong><span>ORGANIZER TWÓRCY</span></div></div><div class="quote-doc-identity"><span>WYCENA</span><strong>${htmlEscape(q.number)}</strong></div></header>
 <div class="quote-doc-meta"><div><small>Data wystawienia</small><b>${htmlEscape(q.issued)}</b></div><div><small>Ważna do</small><b>${htmlEscape(q.validUntil||'Do uzgodnienia')}</b></div></div>
 <div class="quote-doc-parties"><div><small>PRZYGOTOWAŁ</small><b>${htmlEscape(q.issuer||'Twórca / pracownia')}</b><p>${htmlEscape(q.issuerContact||'')}</p></div><div><small>DLA KLIENTA</small><b>${htmlEscape(q.client||'Klient')}</b></div></div>
 <h2>${htmlEscape(q.title)}</h2><table class="quote-doc-table"><thead><tr><th>Lp.</th><th>Opis pozycji</th><th>Ilość</th><th>Jedn.</th><th>Cena jedn.</th><th>Wartość</th></tr></thead><tbody>${rows}</tbody></table>
 <div class="quote-doc-totals"><div><span>Suma pozycji</span><strong>${fMoney(sub)}</strong></div>${discount>0?`<div><span>Rabat</span><strong>− ${fMoney(discount)}</strong></div>`:''}<div class="quote-doc-grand"><span>DO ZAPŁATY</span><strong>${fMoney(total)}</strong></div></div>
 ${q.notes?`<section class="quote-doc-notes"><h3>Warunki i uwagi</h3><p>${htmlEscape(q.notes)}</p></section>`:''}
 <footer class="quote-doc-footer"><span>Dokument ofertowy · Wycena nie jest fakturą ani potwierdzeniem płatności.</span><span>MANU · Organizer twórcy</span><small>Kwoty w PLN. Aplikacja nie oblicza podatku VAT — sprawdź właściwe zasady rozliczeń.</small></footer></article>`;
}
function quotePreview(id){
 const q=(state.quotes||[]).find(q=>q.id===id);if(!q)return;
 const printable=$('#quote-print-root');if(printable)printable.innerHTML=quoteDocument(q);
 modal('Wycena '+q.number,`<div class="quote-preview-actions"><button type="button" class="btn" data-action="quote-print" data-id="${htmlEscape(q.id)}">${icon('download')} Drukuj / zapisz PDF</button><button type="button" class="btn secondary" data-action="quote-edit" data-id="${htmlEscape(q.id)}">${icon('pencil')} Edytuj</button><button type="button" class="btn ghost" data-action="close">Zamknij</button></div><p class="muted small">Na telefonie w systemowym oknie drukowania wybierz „Zapisz jako PDF”.</p><div class="quote-preview-paper">${quoteDocument(q)}</div>`,{detail:true,projectId:q.projectId});
}
function projectsPage(){return `${pageHeading('Projekty i warsztaty','Wszystkie realizacje, klienci, koszty i terminy.',`<button class="btn" data-action="new-project">${icon('plus')}<span>Dodaj nowy</span></button>`)}<div class="toolbar"><input class="search" id="search-projects" placeholder="Szukaj nazwy lub klienta…" value="${htmlEscape(search)}" aria-label="Wyszukaj projekt"><select id="project-filter" class="select"><option value="all" ${filter==='all'?'selected':''}>Wszystkie typy</option><option value="Zlecenie" ${filter==='Zlecenie'?'selected':''}>Zlecenia</option><option value="Warsztat" ${filter==='Warsztat'?'selected':''}>Warsztaty</option></select></div><div id="project-list" class="projects-grid">${renderProjectGrid()}</div>`;}
function renderProjectGrid(){let list=[...state.projects].filter(p=>(filter==='all'||p.type===filter)&&[p.title,p.client,p.notes].some(x=>String(x||'').toLowerCase().includes(search.toLowerCase()))).sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||''));return list.length?list.map(projectCard).join(''):`<div style="grid-column:1/-1">${empty('Brak projektów','Dodaj pierwszą realizację albo zmień filtr.',`<button class="btn sm" data-action="new-project">Dodaj projekt</button>`)}</div>`;}
function projectCard(p){let expense=expenses(p);return `<article class="project-card" data-action="open-project" data-id="${htmlEscape(p.id)}" role="button" tabindex="0"><div class="pcard-head">${projectTypeIcon(p)}${pillStatus(p)}</div><h3>${htmlEscape(p.title)}</h3><div class="project-progress"><span>Postęp</span><strong>${progressPercent(p)}%</strong><div class="workflow-bar"><span style="width:${progressPercent(p)}%"></span></div></div><p>${htmlEscape(p.client||'Bez klienta')} · ${fDate(p.date)}</p><div class="pcard-metrics"><div><small>Wartość</small><b>${fMoney(projectIncome(p))}</b></div><div><small>Koszty</small><b>${fMoney(expense)}</b></div><div><small>Po kosztach</small><b class="${profit(p)>=0?'money-positive':'money-negative'}">${fMoney(profit(p))}</b></div></div><div class="pcard-footer"><span>${icon('clock')} ${fNum(p.hours)} godz. pracy</span><span>${p.type==='Warsztat'?`${confirmedParticipants(p).length}/${p.capacity||'∞'} miejsc${waitlistedParticipants(p).length?' · '+waitlistedParticipants(p).length+' rezerwowych':''}`:`Wpłacono ${fMoney(projectPaid(p))}`}</span></div></article>`;}
function monthCashflow(period){
 const incoming=[],outgoing=[];
 for(const p of state.projects){
  const automatic=p.type==='Warsztat'&&p.financeMode==='participants';
  const rows=automatic?p.participants.flatMap(person=>(person.payments||[]).map(item=>({...item,origin:person.name,project:p.title}))):(p.payments||[]).map(item=>({...item,origin:p.client||'Zlecenie',project:p.title}));
  for(const pay of rows)if(pay.date?.startsWith(period))incoming.push(pay);
  for(const ex of p.expenses||[])if(ex.date?.startsWith(period))outgoing.push({...ex,project:p.title});
 }
 const received=money(incoming.reduce((n,x)=>n+money(x.amount),0)),spent=money(outgoing.reduce((n,x)=>n+money(x.amount),0));
 return {received,spent,balance:Math.round((received-spent)*100)/100,incoming,outgoing};
}
function monthlyReportMarkup(period){
 const m=monthCashflow(period),records=[
 ...m.incoming.map(x=>({date:x.date,amount:x.amount,label:x.project+' · '+x.origin,kind:x.kind==='zaliczka'?'Zaliczka':'Wpłata',positive:true})),
 ...m.outgoing.map(x=>({date:x.date,amount:x.amount,label:x.project+' · '+x.title,kind:expenseCategoryName(x.category),positive:false}))
 ].sort((a,b)=>b.date.localeCompare(a.date));
 const sumParts=[['Wpłaty w miesiącu',m.received],['Wydatki w miesiącu',m.spent],['Przepływ środków',m.balance]];
 const rows=records.length?records.map(x=>`<div class="monthly-row"><div><strong>${htmlEscape(x.label)}</strong><small>${htmlEscape(x.date)} · ${htmlEscape(x.kind)}</small></div><b class="${x.positive?'money-positive':'money-negative'}">${x.positive?'+':'−'} ${fMoney(x.amount)}</b></div>`).join(''):'<p class="muted small">Brak datowanych wpłat i wydatków w wybranym miesiącu.</p>';
 const max=Math.max(1,m.received,m.spent);
 return `<div class="monthly-stat-grid">${sumParts.map(([label,v],i)=>`<div><small>${label}</small><strong class="${i===2?(m.balance>=0?'money-positive':'money-negative'):''}">${fMoney(v)}</strong></div>`).join('')}</div><div class="monthly-bars"><div><span>Wpłaty</span><div><i style="width:${Math.round(m.received/max*100)}%"></i></div></div><div><span>Wydatki</span><div><i style="width:${Math.round(m.spent/max*100)}%"></i></div></div></div><h3>Transakcje w miesiącu (${records.length})</h3><div class="monthly-records">${rows}</div><p class="muted tiny">Raport pokazuje tylko NOWE wpłaty i wydatki z przypisaną datą. Dawne kwoty bez daty nie są tutaj wliczone. Przepływ środków nie jest zyskiem księgowym ani przychodem podatkowym. Nie uwzględnia szacowanego dojazdu i niezapłaconych należności.</p>`;
}
function financePage(m){
 const perHour=m.hours?m.profit/m.hours:0,margin=m.income?Math.round(m.profit/m.income*100):0,projects=active().sort((a,b)=>profit(b)-profit(a)),pct=m.income?Math.min(100,Math.max(0,Math.round(m.cost/m.income*100))):0;
 const metricsBlock=(!m.income&&!m.cost)?empty('Finanse czekają na pierwszy projekt','Dodaj zlecenie lub warsztat z ceną i kosztami, aby zobaczyć podsumowanie.',`<button class="btn" data-action="new-project">Dodaj projekt</button>`):`<div class="stat-grid">${statsCard('Wartość realizacji',fMoney(m.income),'Wpisane ceny wszystkich nieanulowanych projektów','wallet')}${statsCard('Koszty do wyniku',fMoney(m.cost),'Wydatki + szacowany dojazd, gdy brak kosztu faktycznego','folder')}${statsCard('Po kosztach',fMoney(m.profit),'Przed podatkami i kosztami stałymi','trend',m.profit>=0?'accent':'warning')}${statsCard('Za godzinę',m.hours?fMoney(perHour):'—','Na podstawie zapisanych godzin','clock')}</div><div class="finance-grid"><section class="surface"><div class="section-head"><h2>Rentowność wszystkich realizacji</h2><span class="muted small">Bez anulowanych</span></div><div class="donut" style="--pct:${pct}%"><div class="donut-inner"><b>${fNum(margin)}%</b><small>marży*</small></div></div><div class="summary-line"><span>Wartość projektów</span><b>${fMoney(m.income)}</b></div><div class="summary-line"><span>Koszty</span><b>${fMoney(m.cost)}</b></div><div class="summary-line"><span>Otrzymano łącznie</span><b>${fMoney(m.paid)}</b></div><div class="summary-line"><span>Pozostało do zapłaty</span><b>${fMoney(m.unpaid)}</b></div></section><section class="surface"><div class="section-head"><h2>Opłacalność realizacji</h2></div>${projects.slice(0,12).map(p=>`<div class="detail-entry" role="button" tabindex="0" data-action="open-project" data-id="${htmlEscape(p.id)}"><span>${htmlEscape(p.title)} <small>· ${fHours(p.hours)} h</small></span><b class="${profit(p)>=0?'money-positive':'money-negative'}">${fMoney(profit(p))}</b></div>`).join('')}</section></div><div class="form-note finance-detail">* Marża = (wpisana wartość projektów − ujęte koszty) / wartość. To wynik orientacyjny, nie księgowy zysk netto. Koszt faktycznego dojazdu zastępuje szacunek, jeśli został wpisany.</div>`;
 return `${pageHeading('Finanse','Rentowność realizacji i rzeczywisty przepływ wpłat.')}${metricsBlock}<section class="surface finance-month-section"><div class="section-head"><div><h2>Raport miesięczny</h2><p class="muted small">Wpłaty i wydatki z datą transakcji</p></div><label class="finance-month-select">Wybierz miesiąc<input id="finance-month-picker" type="month" value="${htmlEscape(financeMonth)}" min="2020-01" max="2100-12"></label></div><div id="finance-month-results">${monthlyReportMarkup(financeMonth)}</div></section>`;
}
function taskRow(t){let p=state.projects.find(p=>p.id===t.projectId);return `<div class="task-row"><button class="check-btn ${t.done?'checked':''}" data-action="toggle-task" data-id="${htmlEscape(t.id)}" aria-label="${t.done?'Cofnij wykonanie':'Oznacz jako wykonane'}">${t.done?icon('check'):''}</button><div class="task-text"><b class="${t.done?'done':''}">${htmlEscape(t.title)}</b><small>${p?htmlEscape(p.title)+' · ':''}${t.due?'Termin: '+fDate(t.due):'Bez terminu'}</small></div><button class="btn ghost sm" data-action="edit-task" data-id="${htmlEscape(t.id)}" aria-label="Edytuj zadanie">${icon('pencil')}</button><button class="btn ghost sm" data-action="delete-task" data-id="${htmlEscape(t.id)}" aria-label="Usuń zadanie">${icon('trash')}</button></div>`;}
function calendarEvents(){
 const events=[];
 for(const p of state.projects){
  if(p.status==='Anulowane')continue;
  if(validDate(p.date))events.push({key:'project:'+p.id,date:p.date,time:p.type==='Warsztat'?p.startTime:'',kind:p.type==='Warsztat'?'workshop':'project',title:p.title,info:p.type==='Warsztat'?'Termin warsztatu':'Termin realizacji',projectId:p.id,done:p.status==='Zakończone'});
  if(validDate(p.paymentDue)&&projectIncome(p)-projectPaid(p)>0.001)events.push({key:'payment:'+p.id,date:p.paymentDue,time:'',kind:'payment',title:p.title,info:'Do otrzymania: '+fMoney(Math.max(0,projectIncome(p)-projectPaid(p))),projectId:p.id,done:false});
 }
 for(const t of state.tasks){
  if(validDate(t.due))events.push({key:'task:'+t.id,date:t.due,time:'',kind:'task',title:t.title,info:'Zadanie',taskId:t.id,projectId:t.projectId,done:!!t.done});
 }
 for(const r of state.reminders||[]){
  if(validDate(r.date))events.push({key:'reminder:'+r.id,date:r.date,time:r.time||'',kind:'reminder',title:r.title,info:'Przypomnienie',reminderId:r.id,projectId:r.projectId,done:!!r.done});
 }
 return events.sort((a,b)=>a.date.localeCompare(b.date)||(a.time||'').localeCompare(b.time||'')||a.kind.localeCompare(b.kind));
}
function plusDaysDate(day,count){
 const [y,m,d]=day.split('-').map(Number);
 const next=new Date(Date.UTC(y,m-1,d+count));
 return [next.getUTCFullYear(),String(next.getUTCMonth()+1).padStart(2,'0'),String(next.getUTCDate()).padStart(2,'0')].join('-');
}
function calendarAlerts(today=localDay()){
 const end=plusDaysDate(today,7);
 return calendarEvents().filter(e=>!e.done&&e.date<=end).sort((a,b)=>a.date.localeCompare(b.date)||(a.time||'').localeCompare(b.time||''));
}
function calendarEventType(kind){
 return ({project:'Zlecenie',workshop:'Warsztat',task:'Zadanie',payment:'Płatność',reminder:'Przypomnienie'})[kind]||'Termin';
}
function calendarAgendaRow(ev){
 const action=ev.kind==='task'?'calendar-task':ev.kind==='reminder'?'calendar-reminder':'open-project';
 const id=ev.taskId||ev.reminderId||ev.projectId||'';
 const project=ev.projectId?state.projects.find(p=>p.id===ev.projectId):null;
 const status=ev.done?'Zrobione':ev.date<localDay()?'Po terminie':ev.date===localDay()?'Dzisiaj':'';
 const label=ev.time?ev.time+' · '+ev.info:ev.info;
 const actionButton=ev.kind==='task'?`<button type="button" data-action="calendar-task" data-id="${htmlEscape(id)}" class="calendar-check ${ev.done?'is-done':''}" aria-label="${ev.done?'Cofnij wykonanie':'Oznacz zadanie jako wykonane'}">${ev.done?icon('check'):'○'}</button>`:ev.kind==='reminder'?`<button type="button" data-action="calendar-reminder" data-id="${htmlEscape(id)}" class="calendar-check ${ev.done?'is-done':''}" aria-label="${ev.done?'Cofnij przypomnienie':'Oznacz przypomnienie jako zrobione'}">${ev.done?icon('check'):'○'}</button>`:'';
 const links=ev.kind==='reminder'?`<button type="button" class="btn ghost sm" data-action="reminder-edit" data-id="${htmlEscape(id)}">${icon('pencil')} Edytuj</button><button type="button" class="btn ghost sm" data-action="reminder-delete" data-id="${htmlEscape(id)}" aria-label="Usuń przypomnienie">${icon('trash')}</button>`:ev.kind==='task'?`<button type="button" class="btn ghost sm" data-action="edit-task" data-id="${htmlEscape(id)}">${icon('pencil')} Termin</button>`:`<button type="button" class="btn secondary sm" data-action="open-project" data-id="${htmlEscape(ev.projectId)}">Otwórz</button>`;
 return `<div class="calendar-agenda-row calendar-kind-${ev.kind} ${ev.done?'calendar-done':''}">${actionButton}<div class="calendar-agenda-info"><div class="calendar-agenda-meta"><span>${calendarEventType(ev.kind)}</span>${status?`<small class="${status==='Po terminie'?'calendar-late':''}">${status}</small>`:''}</div><strong>${htmlEscape(ev.title)}</strong><small>${htmlEscape(label)}${project&&ev.kind!=='project'&&ev.kind!=='workshop'?' · '+htmlEscape(project.title):''}</small></div><div class="calendar-agenda-actions">${links}</div></div>`;
}
function calendarMonthMarkup(){
 const month=/^\d{4}-(0[1-9]|1[0-2])$/.test(calendarMonth)?calendarMonth:localDay().slice(0,7);
 const [yr,mo]=month.split('-').map(Number),first=(new Date(Date.UTC(yr,mo-1,1)).getUTCDay()+6)%7;
 const total=new Date(Date.UTC(yr,mo,0)).getUTCDate();
 const events=calendarEvents(),perDay=new Map();
 for(const e of events)perDay.set(e.date,(perDay.get(e.date)||[]).concat(e));
 const cells=[];
 for(let i=0;i<Math.ceil((first+total)/7)*7;i++){
  const day=plusDaysDate(month+'-01',i-first);
  const inside=day.startsWith(month),count=perDay.get(day)||[],selected=day===calendarSelected;
  cells.push(`<button type="button" class="calendar-day ${inside?'':'is-outside'} ${day===localDay()?'is-today':''} ${selected?'is-selected':''}" data-action="calendar-day" data-date="${day}" aria-label="${htmlEscape(day)}${count.length?' · '+count.length+' wydarzeń':''}" aria-pressed="${selected}"><span>${Number(day.slice(-2))}</span><span class="calendar-dots">${count.slice(0,3).map(e=>`<i class="calendar-dot calendar-dot-${e.kind}" aria-hidden="true"></i>`).join('')}</span></button>`);
 }
 const dayEvents=events.filter(e=>e.date===calendarSelected);
 const chosen=validDate(calendarSelected)?new Intl.DateTimeFormat('pl-PL',{weekday:'long',day:'numeric',month:'long'}).format(new Date(calendarSelected+'T12:00:00')):'';
 return `<div class="calendar-head"><h2 id="calendar-month-label">${htmlEscape(new Intl.DateTimeFormat('pl-PL',{month:'long',year:'numeric'}).format(new Date(Date.UTC(yr,mo-1,1))))}</h2><div class="calendar-month-actions"><button class="btn secondary sm" data-action="calendar-prev" aria-label="Poprzedni miesiąc">${icon('arrow-left')}</button><button class="btn secondary sm" data-action="calendar-today">Dziś</button><button class="btn secondary sm" data-action="calendar-next" aria-label="Następny miesiąc">${icon('arrow')}</button></div></div><div class="calendar-weekdays">${['Pn','Wt','Śr','Cz','Pt','So','Nd'].map(x=>`<span>${x}</span>`).join('')}</div><div class="calendar-days">${cells.join('')}</div><div class="calendar-agenda"><div class="section-head"><h3>${htmlEscape(chosen)}</h3><span class="muted small">${dayEvents.length} terminów</span></div>${dayEvents.length?dayEvents.map(calendarAgendaRow).join(''):'<p class="muted small">Na ten dzień nie ma zaplanowanych wpisów.</p>'}<button class="btn secondary sm" data-action="reminder-add" data-date="${htmlEscape(calendarSelected)}">${icon('plus')} Przypomnienie na ten dzień</button></div>`;
}
function calendarAlertMarkup(limit=6){
 const alerts=calendarAlerts();
 if(!alerts.length)return '<p class="muted small">Brak zaległych i nadchodzących terminów w ciągu 7 dni.</p>';
 return `<div class="calendar-alert-list">${alerts.slice(0,limit).map(ev=>`<button type="button" class="calendar-alert-item ${ev.date<localDay()?'is-overdue':''}" data-action="calendar-jump" data-date="${htmlEscape(ev.date)}"><span>${ev.date<localDay()?'Zaległe':ev.date===localDay()?'Dzisiaj':ev.date.slice(8)+'.'+ev.date.slice(5,7)}</span><b>${htmlEscape(ev.title)}</b><small>${calendarEventType(ev.kind)}</small></button>`).join('')}${alerts.length>limit?`<small class="muted">I jeszcze ${alerts.length-limit} terminów.</small>`:''}</div>`;
}
function calendarPage(){
 return `${pageHeading('Kalendarz i przypomnienia','Terminy realizacji, warsztatów, zadań i płatności w jednym miejscu.',`<button class="btn" data-action="reminder-add">${icon('plus')} Przypomnienie</button>`)}<section class="surface calendar-alert-surface"><div class="section-head"><h2>Najbliższe terminy</h2><span class="muted small">Zaległe, dziś i następne 7 dni</span></div><div id="calendar-alert-results">${calendarAlertMarkup()}</div></section><section class="surface manu-calendar-surface" id="calendar-panel">${calendarMonthMarkup()}</section><p class="muted tiny calendar-privacy">Przypomnienia są lokalne. MANU pokazuje je po otwarciu aplikacji — ta wersja nie wysyła automatycznych powiadomień, gdy jest całkowicie zamknięta.</p>`;
}
function calendarShift(direction){
 const [y,m]=calendarMonth.split('-').map(Number),date=new Date(Date.UTC(y,m-1+direction,1));
 calendarMonth=[date.getUTCFullYear(),String(date.getUTCMonth()+1).padStart(2,'0')].join('-');
 const maxDay=new Date(Date.UTC(date.getUTCFullYear(),date.getUTCMonth()+1,0)).getUTCDate();
 calendarSelected=calendarMonth+'-'+String(Math.min(maxDay,Number(calendarSelected.slice(-2))||1)).padStart(2,'0');
 refreshCalendarPanel();
}
function refreshCalendarPanel(){
 const panel=$('#calendar-panel'),alertPanel=$('#calendar-alert-results');
 if(panel)panel.innerHTML=calendarMonthMarkup();
 if(alertPanel)alertPanel.innerHTML=calendarAlertMarkup();
}
function reminderForm(id='',date=''){
 const r=(state.reminders||[]).find(x=>x.id===id),due=validDate(date)||r?.date||calendarSelected||localDay();
 modal(r?'Edytuj przypomnienie':'Nowe przypomnienie',`<form id="reminder-form" data-id="${htmlEscape(id)}"><div class="field"><label>Co chcesz zapamiętać? *</label><input name="title" required maxlength="180" placeholder="Np. Zamówić materiały" value="${htmlEscape(r?.title||'')}"></div><div class="form-cols"><div class="field"><label>Data *</label><input name="date" type="date" required value="${htmlEscape(due)}"></div><div class="field"><label>Godzina (opcjonalnie)</label><input name="time" type="time" value="${htmlEscape(r?.time||'')}"></div></div><div class="field"><label>Powiązany projekt (opcjonalnie)</label><select name="projectId"><option value="">Bez projektu</option>${state.projects.filter(p=>p.status!=='Anulowane').map(p=>`<option value="${htmlEscape(p.id)}" ${p.id===r?.projectId?'selected':''}>${htmlEscape(p.title)}</option>`).join('')}</select></div><div class="modal-actions"><button type="button" class="btn ghost" data-action="close">Anuluj</button><button type="submit" class="btn">${r?'Zapisz zmiany':'Dodaj przypomnienie'}</button></div></form>`);
}
function tasksPage(){let tasks=[...state.tasks].filter(t=>taskFilter==='all'||(taskFilter==='done'?t.done:!t.done)).sort((a,b)=>Number(a.done)-Number(b.done)||(a.due||'9999').localeCompare(b.due||'9999'));return `${pageHeading('Zadania','Nie zapomnij o tym, co trzeba zrobić.',`<button class="btn" data-action="new-task">${icon('plus')}<span>Nowe zadanie</span></button>`)}<div class="surface"><div class="section-head"><h2>Lista zadań</h2><div class="filters"><button class="filter ${taskFilter==='open'?'active':''}" data-action="task-filter" data-filter="open">Do zrobienia</button><button class="filter ${taskFilter==='done'?'active':''}" data-action="task-filter" data-filter="done">Gotowe</button><button class="filter ${taskFilter==='all'?'active':''}" data-action="task-filter" data-filter="all">Wszystkie</button></div></div>${tasks.length?tasks.map(taskRow).join(''):empty('Lista jest pusta','Dodaj zadanie albo wybierz inny filtr.',`<button class="btn sm" data-action="new-task">Nowe zadanie</button>`)}</div>`;}
function settingsPage(){return `${pageHeading('Ustawienia i dane','To tutaj dbamy o bezpieczeństwo Twoich informacji.')}<div class="stack"><div class="surface settings-group"><h3>${icon('shield')} Zabezpieczenia i kopie danych</h3>
 <p id="manu-save-status" class="save-state-line ${storageBlocked?'is-error':''}" role="status" aria-live="polite">${htmlEscape(saveMessage())}</p>
 <p class="small">MANU zapisuje dane na tym urządzeniu po każdej zmianie. Zostawia też jeden poprzedni lokalny stan, który możesz przywrócić. Nie chroni to przed utratą telefonu ani usunięciem danych przeglądarki.</p>
 <div class="settings-actions"><button class="btn" data-action="export">${icon('download')} Pobierz kopię JSON</button>
 <button class="btn secondary" data-action="backup-check">${icon('shield')} Sprawdź plik kopii</button>
 <button class="btn secondary" data-action="import">${icon('upload')} Przywróć z pliku</button>
 <button class="btn secondary" data-action="backup-recovery">${icon('archive')} Przywróć poprzedni zapis</button></div>
 <p class="muted tiny">Kopia JSON jest przenośna: zachowaj ją również poza telefonem, np. na własnym dysku. Import pokazuje zawartość przed zastąpieniem obecnych danych.</p>
 </div><div class="surface settings-group"><h3>${icon('info')} Dostępność i praca offline</h3>
 <p id="manu-network-status" class="small">${navigator.onLine===false?'Brak internetu — wpisy pozostają na tym urządzeniu.':'Połączenie internetowe jest dostępne. Zapis nadal odbywa się lokalnie.'}</p>
 <p class="muted small">Aplikacja może działać bez sieci po wcześniejszym wczytaniu zasobów. Offline nie oznacza synchronizacji ani tworzenia kopii w chmurze.</p>
 <div class="settings-actions"><button class="btn secondary" data-action="storage-persist">${icon('shield')} Zwiększ trwałość lokalnej pamięci</button></div>
 <p class="muted tiny">Jeśli przeglądarka pozwala, poprosimy o ochronę pamięci przed automatycznym czyszczeniem. Nie zastępuje to pobierania kopii JSON.</p></div><div class="surface settings-group"><h3>${icon('plus')} MANU na ekranie telefonu</h3><p>Nowa nazwa instalacji to MANU, a nowa ikona to miedziana litera M na czarnej skórze. Chrome aktualizuje ikonę i nazwę zainstalowanej aplikacji osobno — zmiana może pojawić się później, czasem po zatwierdzeniu aktualizacji na telefonie. Otwórz MANU w Chrome i uruchom je ponownie po aktualizacji. Nie odinstalowuj aplikacji ani nie czyść jej danych bez wykonania i sprawdzenia kopii JSON.</p><p>Jeśli MANU nie jest jeszcze zainstalowane, otwórz stronę w Chrome, wejdź w menu i wybierz „Zainstaluj aplikację”.</p><div class="settings-actions"><button class="btn secondary" data-action="install" ${installEvent?'':'disabled'}>${icon('plus')} ${installEvent?'Zainstaluj aplikację':'Użyj menu przeglądarki'}</button></div></div><div class="surface settings-group"><h3>${icon('info')} Testowanie aplikacji</h3><p>Chcesz poznać funkcje bez wpisywania własnych danych? Dodaj przykładowe realizacje. Możesz je potem usunąć osobno lub wyczyścić wszystko. Przykładowe dane są fikcyjne.</p><div class="settings-actions"><button class="btn secondary" data-action="demo">${icon('spark')} Wstaw dane demonstracyjne</button><button class="btn danger" data-action="clear">${icon('trash')} Usuń wszystkie dane</button></div></div><div class="surface settings-group"><h3>${icon('spark')} Animacja otwierania MANU</h3><p>Krótka animacja skórzanego notesu przy uruchomieniu aplikacji. Możesz ją wyłączyć, jeśli wolisz natychmiastowy dostęp do pulpitu.</p><label class="manu-motion-control"><input id="manu-intro-preference" type="checkbox" ${introEnabled()?'checked':''}><span>Pokazuj animację otwarcia</span></label><p class="muted tiny">Ustawienie dotyczy tej przeglądarki. Systemowe ograniczenie animacji zawsze ma pierwszeństwo.</p></div><div class="form-note">MANU v${APP_VERSION} · Wersja testowa. Brak kont, serwera, synchronizacji, fakturowania i obsługi prawdziwych płatności. Nie wpisuj w testach danych osobowych uczestników bez odpowiedniego zabezpieczenia i podstawy prawnej.</div></div>`;}
function modal(title,body,options={}){
 const detail=options.detail===true;
 const paper=detail||body.trimStart().startsWith('<form');
 const right=detail;
 // Zachowaj pozycję otwartej kartki przed otwarciem formularza projektu.
 const previous=$('.modal');
 if(!detail&&paper&&previous?.classList?.contains('notebook-detail-page')){
  const formProjectId=body.trimStart().match(/^<form\b[^>]*\bdata-id="([^"]+)"/i)?.[1];
  if(formProjectId)detailReturnScroll={
   projectId:formProjectId,top:previous.scrollTop,pageX:window.scrollX,pageY:window.scrollY
  };
 }
 const paperBinding=paper?'<div class="paper-binding" aria-hidden="true"><span class="paper-binding-edge"></span><span class="paper-binding-stitches"></span><span class="paper-binding-pages"></span></div>':'';
 const pageLabel=detail?'MANU · KARTA REALIZACJI':'MANU · KARTA PRACY';
 $('#modal-root').innerHTML=`<div class="modal-overlay ${paper?'paper-overlay':''}" data-action="close-overlay"><div class="modal ${paper?'notebook-page':''} ${detail?'notebook-detail-page':''} ${right?'notebook-page--right':''}" role="dialog" aria-modal="true" aria-label="${htmlEscape(title)}">${paper&&!right?paperBinding:''}<div class="${paper?'paper-sheet':'modal-sheet'}"><div class="modal-header"><div class="modal-page-title">${paper?'<small class="paper-kicker">'+pageLabel+'</small>':''}<h2>${htmlEscape(title)}</h2></div><button class="close" data-action="close" aria-label="Zamknij">×</button></div><div class="modal-body">${body}</div></div>${paper&&right?paperBinding:''}</div></div>`;
 const next=$('.modal');
 if(detail&&detailReturnScroll?.projectId===options.projectId&&next){
  next.classList.add('notebook-refresh');
  next.scrollTop=detailReturnScroll.top;
  const {pageX,pageY}=detailReturnScroll;
  detailReturnScroll=null;
  if(window.scrollX!==pageX||window.scrollY!==pageY)window.scrollTo(pageX,pageY);
 }else{
  next?.scrollTo(0,0);
  if(detail)detailReturnScroll=null;
 }
}
function closeModal(){detailReturnScroll=null;pendingBackup=null;$('#modal-root').innerHTML='';}
function optionsStatus(selected){return validStatus.map(x=>`<option value="${x}" ${x===selected?'selected':''}>${x}</option>`).join('');}
function projectForm(p){
  const edit=!!p;
  const x=p||{title:'',type:'Zlecenie',client:'',date:'',status:'Planowane',price:0,paid:0,hours:0,quantity:1,estimatedHours:0,estimatedMaterials:0,workLocation:'',transportType:'none',paidTransportCost:0,paidTransportLabel:'',travelKm:0,travelMode:'fuel',fuelConsumption:0,fuelPrice:0,travelRate:0,travelExtra:0,capacity:0,participantFee:0,location:'',startTime:'',durationHours:0,financeMode:'manual',notes:''};
  const oldManualWorkshop=edit&&x.type==='Warsztat'&&x.financeMode!=='participants';
  const autoWorkshop=edit&&x.type==='Warsztat'&&x.financeMode==='participants';
  const moneyFieldValue=autoWorkshop?projectIncome(x):x.price||0;
  const paidFieldValue=autoWorkshop?projectPaid(x):x.paid||0;
  modal(edit?'Edytuj projekt lub warsztat':'Nowy projekt lub warsztat',`<form id="project-form" data-id="${htmlEscape(x.id||'')}" data-old-manual="${oldManualWorkshop?'yes':'no'}" data-is-edit="${edit?'yes':'no'}" data-original-type="${htmlEscape(x.type)}" data-original-auto="${autoWorkshop?'yes':'no'}">
  <div class="form-cols type-select-row">
    <div class="field"><label>Rodzaj działalności</label><select name="type"><option value="Zlecenie" ${x.type==='Zlecenie'?'selected':''}>Zlecenie / realizacja</option><option value="Warsztat" ${x.type==='Warsztat'?'selected':''}>Warsztat</option></select></div>
    <div class="field"><label>Status</label><select name="status">${optionsStatus(x.status)}</select></div>
  </div>
  <div class="field"><label>Nazwa *</label><input name="title" required maxlength="120" placeholder="Np. Lustro z grawerem" value="${htmlEscape(x.title)}"></div>
  <div class="form-cols">
    <div class="field"><label data-label="client">Klient / zamawiający</label><input name="client" maxlength="100" placeholder="Opcjonalnie" value="${htmlEscape(x.client)}"></div>
    <div class="field"><label data-label="date">Termin wykonania</label><input name="date" type="date" value="${htmlEscape(x.date)}"></div>
    <div class="field"><label>Termin płatności / rozliczenia (opcjonalnie)</label><input name="paymentDue" type="date" value="${htmlEscape(x.paymentDue||'')}"></div>
  </div>

  <section class="project-kind-section" data-kind="Zlecenie">
    <div class="kind-heading"><span class="kind-symbol">${icon('brief')}</span><div><h3>Szczegóły realizacji</h3><p>Zaplanuj wykonanie i przewidywany koszt.</p></div></div>
    <details class="location-accordion" ${x.workLocation||travelCost(x)>0||val(x.travelKm)>0||val(x.paidTransportCost)>0?'open':''}>
      <summary class="location-accordion-trigger">
        <span class="location-icon">${icon('map')}</span>
        <span class="location-summary-copy"><strong>Miejsce realizacji i dojazd</strong><small>Adres, sposób transportu i jego koszty · opcjonalnie</small></span>
        <span class="location-chevron" aria-hidden="true">⌄</span>
      </summary>
      <div class="location-accordion-content">
        <div class="field"><label>Miejsce wykonania zlecenia</label><input name="workLocation" maxlength="220" placeholder="Np. własna pracownia lub pełny adres muralu" value="${htmlEscape(x.workLocation||'')}"></div>
        <div class="travel-fields">
          <div class="travel-heading">${icon('map')} <strong>Sposób dojazdu</strong></div>
          <div class="transport-choices" role="radiogroup" aria-label="Sposób dojazdu">
            <label class="transport-choice"><input type="radio" name="transportType" value="none" ${transportType(x)==='none'?'checked':''}><span>Bez dojazdu</span></label>
            <label class="transport-choice"><input type="radio" name="transportType" value="car" ${transportType(x)==='car'?'checked':''}><span>Własne auto</span></label>
            <label class="transport-choice"><input type="radio" name="transportType" value="paid" ${transportType(x)==='paid'?'checked':''}><span>Transport płatny</span></label>
          </div>
          <div class="transport-panel" data-transport-type="none">
            <p class="muted tiny">Pracujesz w swojej pracowni lub nie ponosisz kosztów dojazdu? Nie musisz wypełniać kolejnych pól.</p>
          </div>
          <div class="transport-panel" data-transport-type="car" hidden>
            <div class="field"><label>Trasa łącznie tam i z powrotem (km)</label><input name="travelKm" type="number" min="0" max="100000" step="0.1" placeholder="Np. 80" value="${val(x.travelKm)}"></div>
            <div class="field"><label>Jak obliczyć koszt?</label><select name="travelMode">
              <option value="fuel" ${travelMode(x)==='fuel'?'selected':''}>Spalanie i cena paliwa</option>
              <option value="rate" ${travelMode(x)==='rate'?'selected':''}>Stawka zł/km (opcjonalnie)</option>
            </select></div>
            <div class="form-cols" data-travel-mode="fuel">
              <div class="field"><label>Spalanie auta (l/100 km)</label><input name="fuelConsumption" type="number" min="0" max="100" step="0.1" placeholder="Np. 7" value="${val(x.fuelConsumption)}"></div>
              <div class="field"><label>Cena paliwa (zł/l)</label><input name="fuelPrice" type="number" min="0" max="100" step="0.01" placeholder="Np. 6,20" value="${money(x.fuelPrice)}"></div>
            </div>
            <div class="field" data-travel-mode="rate" hidden>
              <label>Ustalony koszt przejazdu (zł/km)</label><input name="travelRate" type="number" min="0" max="10000" step="0.01" placeholder="Np. 0,90" value="${money(x.travelRate)}">
            </div>
          </div>
          <div class="transport-panel" data-transport-type="paid" hidden>
            <div class="field"><label>Rodzaj transportu (opcjonalnie)</label><input name="paidTransportLabel" maxlength="100" placeholder="Np. taxi, pociąg, wynajęty samochód" value="${htmlEscape(x.paidTransportLabel||'')}"></div>
            <div class="field"><label>Cena transportu w obie strony (zł)</label><input name="paidTransportCost" type="number" min="0" max="100000" step="0.01" placeholder="Np. 120" value="${money(x.paidTransportCost)}"></div>
          </div>
          <div data-transport-extra hidden>
            <div class="field"><label>Inne opłaty związane z dojazdem (zł)</label><input name="travelExtra" type="number" min="0" max="100000" step="0.01" placeholder="Parking, autostrada..." value="${money(x.travelExtra)}"></div>
            <div class="travel-live-preview" data-travel-preview aria-live="polite"></div>
          </div>
          <p class="muted tiny">Kwoty podajesz samodzielnie. Koszty dojazdu są wliczane do wyniku zlecenia tylko raz; dla własnego auta spalanie nie obejmuje amortyzacji.</p>
        </div>
      </div>
    </details>
    <div class="form-cols">
      <div class="field"><label>Liczba sztuk</label><input name="quantity" type="number" min="1" step="1" value="${Math.max(1,Math.floor(val(x.quantity)||1))}"></div>
      <div class="field"><label>Szacowany czas pracy (godz.)</label><input name="estimatedHours" type="number" min="0" step="0.25" value="${val(x.estimatedHours)}"></div>
      <div class="field"><label>Szacowany koszt materiałów (zł)</label><input name="estimatedMaterials" type="number" min="0" step="0.01" value="${money(x.estimatedMaterials)}"></div>
      <div class="field"><label>Przepracowano (godz.)</label><input name="hours" type="number" min="0" step="any" value="${val(x.hours)}"></div>
    </div>
  </section>
  <section class="project-kind-section" data-kind="Warsztat" hidden>
    <div class="kind-heading"><span class="kind-symbol">${icon('users')}</span><div><h3>Organizacja warsztatu</h3><p>Ustal miejsce, uczestników i przebieg zajęć.</p></div></div>
    <div class="field"><label>Miejsce warsztatu</label><input name="location" maxlength="180" placeholder="Np. sala, pracownia lub adres" value="${htmlEscape(x.location||'')}"></div>
    <div class="form-cols">
      <div class="field"><label>Godzina rozpoczęcia</label><input name="startTime" type="time" value="${htmlEscape(x.startTime||'')}"></div>
      <div class="field"><label>Czas trwania zajęć (godz.)</label><input name="durationHours" type="number" min="0" step="0.25" value="${val(x.durationHours)}"></div>
      <div class="field"><label>Liczba dostępnych miejsc</label><input name="capacity" type="number" min="0" step="1" value="${Math.floor(val(x.capacity))}"></div>
      <div class="field"><label>Cena za uczestnika (zł)</label><input name="participantFee" type="number" min="0" step="0.01" value="${money(x.participantFee)}"></div>
      <div class="field field-full"><label>Szacowany czas przygotowania i prowadzenia (godz.)</label><input name="workshopEstimatedHours" type="number" min="0" step="0.25" value="${val(x.estimatedHours)}"></div><div class="field field-full"><label>Przepracowano łącznie przy warsztacie (godz.)</label><input name="workshopHours" type="number" min="0" step="any" value="${val(x.hours)}"></div>
    </div>
    <div class="form-note">Po zapisaniu warsztatu dodasz uczestników i ich wpłaty. Cena za osobę będzie automatycznie proponowana w formularzu uczestnika.</div>
  </section>

  <section class="project-kind-section" data-field="money">
    <div class="kind-heading"><span class="kind-symbol">${icon('wallet')}</span><div><h3>Rozliczenie ${oldManualWorkshop?'warsztatu':'realizacji'}</h3><p data-money-description>Cena dla klienta i otrzymane wpłaty.</p></div></div>
    <div class="form-cols">
      <div class="field"><label data-label="price">Cena realizacji (zł)</label><input name="price" type="number" min="0" step="0.01" value="${money(moneyFieldValue)}"></div>
      <div class="field"><label data-label="paid">Wpłaty wcześniejsze, bez daty (zł)</label><input name="paid" type="number" min="0" step="0.01" value="${money(paidFieldValue)}"></div>
    </div>
  </section>

  <div class="field"><label>Notatki i ustalenia</label><textarea name="notes" maxlength="5000" placeholder="Materiały, ustalenia, pomysły, informacje…">${htmlEscape(x.notes)}</textarea></div>
  <div class="modal-actions"><button type="button" class="btn ghost" data-action="close">Anuluj</button><button type="submit" class="btn">${icon('check')} ${edit?'Zapisz zmiany':'Utwórz projekt'}</button></div>
  </form>`);
  syncProjectFields();
}
function syncTravelFields(){
  const form=document.getElementById('project-form');
  if(!form)return;
  const transport=form.querySelector('input[name="transportType"]:checked')?.value||'none';
  const mode=form.elements.namedItem('travelMode')?.value==='rate'?'rate':'fuel';
  form.querySelectorAll('[data-transport-type]').forEach(el=>el.hidden=el.dataset.transportType!==transport);
  form.querySelectorAll('[data-travel-mode]').forEach(el=>el.hidden=transport!=='car'||el.dataset.travelMode!==mode);
  const extra=form.querySelector('[data-transport-extra]');
  if(extra)extra.hidden=transport==='none';
  const get=k=>val(form.elements.namedItem(k)?.value);
  const distance=get('travelKm'),litres=distance*get('fuelConsumption')/100;
  const fuelCharge=litres*get('fuelPrice'),rateCharge=distance*get('travelRate');
  const charge=transport==='car'?(mode==='rate'?rateCharge:fuelCharge):transport==='paid'?get('paidTransportCost'):0;
  const total=money(transport==='none'?0:charge+get('travelExtra'));
  const preview=form.querySelector('[data-travel-preview]');
  if(preview)preview.innerHTML=`<strong>Szacowany koszt dojazdu: ${fMoney(total)}</strong><small>${transport==='paid'?'Koszt transportu: '+fMoney(charge)+' · plus dodatkowe opłaty':mode==='rate'?'Dystans × stawka za km + dodatkowe opłaty':'Paliwo: '+fNum(litres)+' l · koszt paliwa: '+fMoney(fuelCharge)+' · plus dodatkowe opłaty'}</small>`;
}
function syncProjectFields(){
  const form=document.getElementById('project-form');
  if(!form)return;
  const workshop=form.elements.namedItem('type').value==='Warsztat';
  form.querySelectorAll('[data-kind]').forEach(el=>el.hidden=el.dataset.kind!==(workshop?'Warsztat':'Zlecenie'));
  const isOldManualWorkshop=workshop&&form.dataset.oldManual==='yes';
  const moneySection=form.querySelector('[data-field="money"]');
  moneySection.hidden=workshop&&!isOldManualWorkshop;
  const autoWorkshop=workshop&&form.dataset.originalAuto==='yes';
  for(const key of ['price','paid'])form.elements.namedItem(key).disabled=autoWorkshop;
  form.querySelector('[data-label="client"]').textContent=workshop?'Organizator / prowadzący':'Klient / zamawiający';
  form.querySelector('[data-label="date"]').textContent=workshop?'Data warsztatu':'Termin wykonania';
  form.elements.namedItem('title').placeholder=workshop?'Np. Warsztaty kaligrafii – Gotyk':'Np. Lustro z grawerem, stół dębowy';
  form.querySelector('[data-label="price"]').textContent=workshop?'Wartość warsztatu (zł)':'Cena realizacji (zł)';
  form.querySelector('[data-label="paid"]').textContent='Wcześniejsze wpłaty (bez historii) (zł)';
  form.querySelector('[data-money-description]').textContent=workshop?'Zachowane ręczne rozliczenie starszego warsztatu. Nowe wpłaty zapisuj w historii na karcie realizacji.':'Tutaj zachowujesz tylko kwoty bez daty. Nowe zaliczki i dopłaty dopisuj w historii wpłat na karcie realizacji, aby nie liczyć ich drugi raz.';
  syncTravelFields();
}
function setWorkshopAttendance(id,participantId,attendance){
 const p=state.projects.find(x=>x.id===id),person=p?.participants.find(x=>x.id===participantId);
 if(!p||p.type!=='Warsztat'||!person||person.bookingStatus==='waitlist'||!['unknown','present','absent'].includes(attendance))return;
 person.attendance=attendance;
 recordActivity(p,'Obecność: '+person.name+' — '+(attendance==='present'?'obecny':attendance==='absent'?'nieobecny':'nieustalona'));
 afterDataChange('Zapisano obecność',id);
}
function promoteWorkshopParticipant(id,participantId){
 const p=state.projects.find(x=>x.id===id);if(!p||p.type!=='Warsztat'||freePlaces(p)<=0){toast('Brak wolnych miejsc');return}
 const first=waitlistedParticipants(p)[0];if(!first||first.id!==participantId){toast('Najpierw potwierdź pierwszą osobę z kolejki');return}
 first.bookingStatus='confirmed';first.attendance='unknown';
 recordActivity(p,'Potwierdzono miejsce z listy rezerwowej: '+first.name);
 afterDataChange('Potwierdzono miejsce uczestnika',id);
}
function moveWorkshopToWaitlist(id,participantId){
 const p=state.projects.find(x=>x.id===id),person=p?.participants.find(x=>x.id===participantId);
 if(!p||p.type!=='Warsztat'||!person||person.bookingStatus==='waitlist')return;
 if(participantPaid(person)>0||person.attendance!=='unknown'){alert('Nie można przenieść osoby z wpłatą lub oznaczoną obecnością. Najpierw popraw rozliczenie lub obecność.');return}
 if(!confirm('Przenieść '+person.name+' na koniec listy rezerwowej?'))return;
 person.bookingStatus='waitlist';person.joinedAt=now();
 p.participants=p.participants.filter(x=>x.id!==person.id).concat(person);
 recordActivity(p,'Przeniesiono na listę rezerwową: '+person.name);
 afterDataChange('Przeniesiono na listę rezerwową',id);
}
function toggleWorkshopMaterial(id,materialId){
 const p=state.projects.find(x=>x.id===id),item=p?.workshopMaterials?.find(x=>x.id===materialId);
 if(!p||p.type!=='Warsztat'||!item)return;
 item.done=!item.done;recordActivity(p,(item.done?'Przygotowano: ':'Cofnięto przygotowanie: ')+item.title);
 afterDataChange('Zapisano przygotowanie',id);
}
function removeWorkshopMaterial(id,materialId){
 const p=state.projects.find(x=>x.id===id),item=p?.workshopMaterials?.find(x=>x.id===materialId);
 if(!p||!item||!confirm('Usunąć z listy przygotowań: '+item.title+'?'))return;
 p.workshopMaterials=p.workshopMaterials.filter(x=>x.id!==materialId);
 recordActivity(p,'Usunięto z przygotowań: '+item.title);
 afterDataChange('Usunięto pozycję z listy',id);
}
function finishWorkshop(id){
 const p=state.projects.find(x=>x.id===id);if(!p||p.type!=='Warsztat'||p.status==='Zakończone')return;
 const attendance=attendanceSummary(p),prep=materialsSummary(p);
 const warning=(attendance.unmarked?'Nieoznaczone obecności: '+attendance.unmarked+'. ':'')+(prep.ready<prep.total?'Nieprzygotowane pozycje: '+(prep.total-prep.ready)+'. ':'');
 if(!confirm('Oznaczyć warsztat „'+p.title+'” jako zakończony? '+warning+'Rozliczenia i lista obecności pozostaną edytowalne.'))return;
 p.status='Zakończone';recordActivity(p,'Warsztat oznaczono jako zakończony');
 afterDataChange('Warsztat zakończony',id);
}
function showParticipants(p){
 const total=paymentSummary(p),automatic=p.financeMode==='participants';
 const confirmed=confirmedParticipants(p),waitlist=waitlistedParticipants(p),spots=freePlaces(p),att=attendanceSummary(p);
 const confirmCards=confirmed.map(person=>{
   const remaining=money(Math.max(0,money(person.fee)-participantPaid(person)));
   const paymentList=(person.payments||[]).map(x=>`${htmlEscape(x.date)} · ${fMoney(x.amount)} <button type="button" class="finance-inline-delete" data-action="payment-delete" data-id="${htmlEscape(p.id)}" data-participant="${htmlEscape(person.id)}" data-payment="${htmlEscape(x.id)}" aria-label="Usuń wpłatę">×</button>`).join('; ');
   const attendanceButtons=[['present','Obecny'],['absent','Nieobecny'],['unknown','Nieustalone']].map(([code,label])=>`<button type="button" class="workshop-attendance-btn ${person.attendance===code?'active':''}" data-action="workshop-attendance" data-id="${htmlEscape(p.id)}" data-participant="${htmlEscape(person.id)}" data-attendance="${code}" aria-pressed="${person.attendance===code}">${label}</button>`).join('');
   return `<div class="workshop-person-card"><div class="workshop-person-top"><div class="participant-info"><b>${htmlEscape(person.name)}</b><small>Cena ${fMoney(person.fee)} · Otrzymano ${fMoney(participantPaid(person))}</small><small class="${remaining>0?'money-negative':'money-positive'}">${remaining>0?'Do dopłaty '+fMoney(remaining):person.fee>0?'Opłacono':'Cena do ustalenia'}</small>${person.legacyPaid?'<small class="money-negative">Stara wpłata bez kwoty — zweryfikuj ręcznie</small>':''}${paymentList?`<small>Wpłaty: ${paymentList}</small>`:''}</div><div class="participant-actions"><button class="btn secondary sm" data-action="payment-add" data-id="${htmlEscape(p.id)}" data-participant="${htmlEscape(person.id)}">${icon('plus')} Wpłata</button><button class="btn secondary sm" data-action="edit-participant" data-id="${htmlEscape(p.id)}" data-participant="${htmlEscape(person.id)}">${icon('pencil')} Edytuj</button><button class="btn ghost sm" data-action="delete-participant" data-id="${htmlEscape(p.id)}" data-participant="${htmlEscape(person.id)}" aria-label="Usuń uczestnika">${icon('trash')}</button></div></div><div class="workshop-attendance"><span>Obecność:</span><div>${attendanceButtons}</div></div>${participantPaid(person)===0&&person.attendance==='unknown'?`<button type="button" class="workshop-soft-action" data-action="workshop-waitlist" data-id="${htmlEscape(p.id)}" data-participant="${htmlEscape(person.id)}">Przenieś na listę rezerwową</button>`:''}</div>`;
 }).join('');
 const waitingCards=waitlist.map((person,index)=>`<div class="workshop-waiting-row"><span class="workshop-queue-index">${index+1}</span><div><b>${htmlEscape(person.name)}</b><small>Cena udziału: ${fMoney(person.fee)}</small></div><div class="participant-actions">${index===0&&spots>0?`<button type="button" class="btn secondary sm" data-action="workshop-promote" data-id="${htmlEscape(p.id)}" data-participant="${htmlEscape(person.id)}">Potwierdź miejsce</button>`:''}<button class="btn ghost sm" data-action="edit-participant" data-id="${htmlEscape(p.id)}" data-participant="${htmlEscape(person.id)}" aria-label="Edytuj rezerwację">${icon('pencil')}</button><button class="btn ghost sm" data-action="delete-participant" data-id="${htmlEscape(p.id)}" data-participant="${htmlEscape(person.id)}" aria-label="Usuń z rezerwowej">${icon('trash')}</button></div></div>`).join('');
 return `<section class="detail-section workshop-registration"><div class="section-head"><h3>Zapisy na warsztat</h3><button class="btn sm secondary" data-action="add-participant" data-id="${htmlEscape(p.id)}">${icon('plus')} Zapisz osobę</button></div><div class="workshop-counts"><span><strong>${confirmed.length}</strong> potwierdzonych${p.capacity?' / '+Math.floor(p.capacity):' · bez limitu'}</span><span><strong>${waitlist.length}</strong> rezerwowych</span><span><strong>${att.present}</strong> obecnych</span></div><div class="participant-summary"><div><small>Wartość potwierdzonych miejsc</small><strong>${fMoney(total.fee)}</strong></div><div><small>Otrzymane wpłaty</small><strong class="money-positive">${fMoney(total.received)}</strong></div><div><small>Do otrzymania</small><strong class="${total.outstanding>0?'money-negative':'money-positive'}">${fMoney(total.outstanding)}</strong></div></div><h4>Potwierdzone miejsca (${confirmed.length})</h4>${confirmCards||'<p class="muted small">Brak potwierdzonych zapisów.</p>'}<h4>Lista rezerwowa (${waitlist.length})</h4>${waitingCards||'<p class="muted small">Lista rezerwowa jest pusta.</p>'}${waitlist.length&&spots>0?'<p class="muted tiny">Zwolniło się miejsce. Możesz potwierdzić pierwszą osobę z kolejki.</p>':''}<p class="muted tiny">Limit dotyczy tylko potwierdzonych miejsc. Rezerwowi nie są wliczani do przychodu ani wpłat warsztatu. Rezerwowych nie rozliczamy do czasu potwierdzenia miejsca.</p><div class="form-note">${automatic?'Wartość warsztatu i wpłaty liczone są z potwierdzonych uczestników.':'Finanse warsztatu są liczone ręcznie. Powyższe sumy uczestników służą do kontroli zapisów.'}</div><button class="btn secondary sm" data-action="finance-mode" data-id="${htmlEscape(p.id)}">${automatic?'Wróć do ręcznego rozliczania':'Licz finanse z uczestników'}</button></section>`;
}
function workshopMaterialForm(id){
 const p=state.projects.find(x=>x.id===id);if(!p||p.type!=='Warsztat')return;
 modal('Lista przygotowań',`<form id="workshop-material-form" data-id="${htmlEscape(id)}"><p class="muted small">${htmlEscape(p.title)}</p><div class="field"><label>Co trzeba przygotować? *</label><input required maxlength="130" name="title" placeholder="Np. 12 zestawów kaligrafii, papier, atrament"></div><div class="field"><label>Ile sztuk / kompletów?</label><input name="quantity" type="number" min="1" max="9999" step="1" value="1"></div><p class="form-note">To lista przygotowań, a nie wydatek. Koszt zakupów wpisuj osobno w finansach, aby nie policzyć ich podwójnie.</p><div class="modal-actions"><button type="button" class="btn ghost" data-action="open-project" data-id="${htmlEscape(id)}">Wróć</button><button class="btn" type="submit">Dodaj do listy</button></div></form>`);
}
function workshopOperations(p){
 const materials=p.workshopMaterials||[],prep=materialsSummary(p),attendance=attendanceSummary(p),confirmed=confirmedParticipants(p),wait=waitlistedParticipants(p);
 const sums=paymentSummary(p),income=projectIncome(p),cost=expenses(p),paid=projectPaid(p),net=profit(p);
 const isComplete=p.status==='Zakończone';
 const materialRows=materials.length?materials.map(item=>`<div class="workshop-material-row"><button type="button" class="workflow-check ${item.done?'is-done':''}" aria-label="${item.done?'Cofnij przygotowanie':'Oznacz jako gotowe'}: ${htmlEscape(item.title)}" aria-pressed="${item.done}" data-action="workshop-material-toggle" data-id="${htmlEscape(p.id)}" data-material="${htmlEscape(item.id)}">${item.done?icon('check'):'○'}</button><span class="${item.done?'stage-completed':''}">${htmlEscape(item.title)} <small>× ${item.quantity}</small></span><button type="button" class="btn ghost sm" data-action="workshop-material-remove" data-id="${htmlEscape(p.id)}" data-material="${htmlEscape(item.id)}" aria-label="Usuń materiał">${icon('trash')}</button></div>`).join(''):'<p class="muted small">Dodaj materiały, które trzeba przygotować przed warsztatem.</p>';
 const checklistPct=prep.total?Math.round(100*prep.ready/prep.total):0;
 return `<section class="detail-section workshop-preparation"><div class="section-head"><h3>Przygotowanie warsztatu</h3><button class="btn secondary sm" data-action="workshop-material-add" data-id="${htmlEscape(p.id)}">${icon('plus')} Dodaj materiał</button></div><p class="muted small">Gotowe ${prep.ready} z ${prep.total} pozycji</p><div class="workflow-bar" role="progressbar" aria-label="Przygotowanie materiałów" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${checklistPct}"><span style="width:${checklistPct}%"></span></div><div class="workshop-material-list">${materialRows}</div><p class="muted tiny">Lista przygotowań nie zwiększa kosztów projektu. Zakupy zapisuj w sekcji kosztów.</p></section><section class="detail-section workshop-outcome"><div class="section-head"><h3>Podsumowanie warsztatu</h3>${isComplete?'<span class="workshop-completed-tag">Zakończony</span>':''}</div><div class="workshop-outcome-stats"><div><small>Potwierdzeni</small><strong>${confirmed.length}</strong></div><div><small>Obecni / nieobecni</small><strong>${attendance.present} / ${attendance.absent}</strong></div><div><small>Nieoznaczone obecności</small><strong>${attendance.unmarked}</strong></div><div><small>Lista rezerwowa</small><strong>${wait.length}</strong></div><div><small>Przychód według ${p.financeMode==='participants'?'uczestników':'wyceny'}</small><strong>${fMoney(income)}</strong></div><div><small>Otrzymane wpłaty</small><strong>${fMoney(paid)}</strong></div><div><small>Koszty ujęte w wyniku</small><strong>${fMoney(cost)}</strong></div><div><small>Wynik orientacyjny</small><strong class="${net>=0?'money-positive':'money-negative'}">${fMoney(net)}</strong></div><div><small>Średnio za godzinę pracy</small><strong>${p.hours>0?fMoney(net/p.hours):'—'}</strong></div></div><p class="muted tiny">Do zapłaty od potwierdzonych uczestników: ${fMoney(sums.outstanding)}. Wynik orientacyjny nie jest zyskiem księgowym; nie uwzględnia podatków ani kosztów stałych. Obecność nie zmienia automatycznie ceny ani wpłat.</p>${isComplete?'<p class="muted small">Warsztat oznaczono jako zakończony. Możesz nadal poprawiać listę uczestników i rozliczenia.</p>':`<button class="btn secondary sm" data-action="workshop-finish" data-id="${htmlEscape(p.id)}">${icon('check')} Oznacz warsztat jako zakończony</button>`}</section>`;
}
function projectSpecificDetail(p){
  if(p.type==='Warsztat'){
    const items=[
      p.location?['Miejsce',htmlEscape(p.location)]:null,
      p.startTime?['Rozpoczęcie',htmlEscape(p.startTime)]:null,
      p.durationHours>0?['Czas zajęć',fNum(p.durationHours)+' godz.']:null,
      p.capacity>0?['Dostępne miejsca',String(p.capacity)]:null,
      p.participantFee>0?['Standardowa cena za osobę',fMoney(p.participantFee)]:null
    ].filter(Boolean);
    if(!items.length)return '';
    return `<div class="detail-section"><h3>Plan warsztatu</h3><div class="specific-detail-grid">${items.map(([label,v])=>`<div><small>${label}</small><b>${v}</b></div>`).join('')}</div></div>`;
  }
  const predicted=money(projectIncome(p)-money(p.estimatedMaterials)-travelCost(p));
  return `<div class="detail-section"><h3>Plan realizacji</h3><div class="specific-detail-grid">
    ${p.workLocation?`<div class="specific-detail-location"><small>Miejsce wykonania</small><b>${htmlEscape(p.workLocation)}</b><a class="btn secondary sm location-navigation" href="https://www.google.com/maps/dir/?api=1&amp;destination=${encodeURIComponent(p.workLocation.trim())}&amp;travelmode=driving" target="_blank" rel="noopener noreferrer">${icon('map')} Nawiguj w Mapach Google</a></div>`:''}
    <div><small>Liczba sztuk</small><b>${Math.max(1,Math.floor(val(p.quantity)||1))}</b></div>
    <div><small>Szacowany czas pracy</small><b>${p.estimatedHours?fNum(p.estimatedHours)+' godz.':'Nie podano'}</b></div>
    <div><small>Szacowane materiały</small><b>${p.estimatedMaterials?fMoney(p.estimatedMaterials):'Nie podano'}</b></div>
    ${p.estimatedHours>0?`<div><small>Szacunkowa stawka za godzinę*</small><b>${fMoney(predicted/p.estimatedHours)}/h</b></div>`:''}
    ${transportType(p)!=='none'&&(travelCost(p)>0||val(p.travelKm)>0||val(p.paidTransportCost)>0)?`<div class="specific-detail-location"><small>Planowany dojazd</small>
      ${transportType(p)==='paid'?`<b>Transport płatny${p.paidTransportLabel?' · '+htmlEscape(p.paidTransportLabel):''}</b><small>Opłata za transport: ${fMoney(p.paidTransportCost)}</small>`:
        `<b>Własny samochód · ${fNum(p.travelKm)} km łącznie</b>
        ${travelMode(p)==='rate'?`<small>Stawka: ${fMoney(p.travelRate)}/km</small>`:`<small>Spalanie: ${fNum(p.fuelConsumption)} l/100 km · paliwo: ${fMoney(p.fuelPrice)}/l</small><small>Zużycie paliwa: ${fNum(travelFuelLitres(p))} l</small>`}`}
      <small>Dodatkowe opłaty: ${fMoney(p.travelExtra)}</small><strong class="travel-estimate">Koszt dojazdu: ${fMoney(travelCost(p))}</strong>
    </div>`:''}
    </div><p class="muted tiny">*Prognoza uwzględnia planowane materiały i dojazd, ale nie inne nieujęte koszty. W finansach rzeczywiste wydatki z listy i szacowany dojazd są liczone oddzielnie od tej prognozy.</p></div>`;
}
function workSection(p){
 const stages=p.stages||defaultStages(p.type,p.status),pr=progressPercent(p),planned=val(p.estimatedHours),actual=val(p.hours),logged=workSessionsTotal(p),over=planned>0&&actual>planned;
 const steps=stages.map(x=>`<div class="workflow-step"><button type="button" class="workflow-check ${x.done?'is-done':''}" data-action="stage-toggle" data-id="${htmlEscape(p.id)}" data-stage="${htmlEscape(x.id)}" aria-label="${x.done?'Oznacz jako niewykonany':'Zakończ etap'}: ${htmlEscape(x.title)}" aria-pressed="${x.done}">${x.done?icon('check'):'○'}</button><span class="${x.done?'stage-completed':''}">${htmlEscape(x.title)}</span><button type="button" class="btn ghost sm stage-remove" data-action="stage-remove" data-id="${htmlEscape(p.id)}" data-stage="${htmlEscape(x.id)}" aria-label="Usuń etap ${htmlEscape(x.title)}">${icon('trash')}</button></div>`).join('');
 const entries=[...(p.workLog||[]).map(e=>({date:e.date,label:e.note||(e.source==='timer'?'Sesja ze stopera':'Ręcznie wpisany czas'),sub:durationSecs(e.seconds),id:e.id,kind:'time'})),...(p.activityLog||[]).map(e=>({date:e.date,label:e.message,sub:'Zmiana w projekcie',id:e.id,kind:'event'}))].sort((a,b)=>(b.date||'').localeCompare(a.date||'')).slice(0,18);
 const history=entries.length?entries.map(x=>`<div class="work-history-row"><div><small>${htmlEscape(new Date(x.date).toLocaleString('pl-PL',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}))}</small><b>${htmlEscape(x.label)}</b><small>${htmlEscape(x.sub)}</small></div>${x.kind==='time'?`<button class="btn secondary sm" type="button" data-action="work-note" data-id="${htmlEscape(p.id)}" data-entry="${htmlEscape(x.id)}">${icon('pencil')} Opisz</button><button class="btn ghost sm" type="button" data-action="work-remove" data-id="${htmlEscape(p.id)}" data-entry="${htmlEscape(x.id)}" aria-label="Usuń wpis czasu">${icon('trash')}</button>`:''}</div>`).join(''):'<p class="muted small">Historia wypełni się przy wykonywaniu etapów i zapisywaniu sesji.</p>';
 const plan=planned>0?`<div class="workflow-plan"><div><small>Planowany czas</small><strong>${fHours(planned)} godz.</strong></div><div><small>Przepracowano łącznie</small><strong>${fHours(actual)} godz.</strong></div><div><small>${over?'Przekroczono plan o':'Do planu pozostało'}</small><strong class="${over?'money-negative':''}">${fHours(Math.abs(planned-actual))} godz.</strong></div></div><div class="workflow-bar" role="progressbar" aria-label="Czas względem planu" aria-valuenow="${Math.min(100,Math.round(actual/planned*100))}" aria-valuemin="0" aria-valuemax="100"><span style="width:${Math.min(100,Math.round(actual/planned*100))}%"></span></div>`:`<p class="muted small">Możesz określić planowany czas w edycji projektu. Aktualnie zapisano ${fHours(actual)} godz. pracy.</p>`;
 return `<section class="detail-section workflow-section"><div class="section-head"><h3>Przebieg realizacji</h3><span class="workflow-percent">${pr}% etapów</span></div><div class="workflow-bar" role="progressbar" aria-label="Ukończenie etapów projektu" aria-valuenow="${pr}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pr}%"></span></div><div class="workflow-stages">${steps}</div><button type="button" class="btn secondary sm" data-action="stage-add" data-id="${htmlEscape(p.id)}">${icon('plus')} Dodaj etap</button><div class="workflow-plan-area"><h3>Plan i rzeczywisty czas</h3>${plan}<p class="muted tiny">Zapisany czas obejmuje ręcznie wpisane godziny oraz zakończone sesje. W nowej historii zarejestrowano ${durationSecs(logged)}.</p></div><div class="workflow-time-area"><h3>Stoper pracy</h3>${timerButtons(p)}<div class="workflow-time-actions"><button type="button" class="btn secondary sm" data-action="work-add" data-id="${htmlEscape(p.id)}">${icon('plus')} Dopisz czas ręcznie</button></div><p class="muted tiny">Stoper liczy również po wygaszeniu ekranu, o ile zegar telefonu jest poprawny. Jedna sesja może mieć maksymalnie 24 godziny. Zatrzymanie zapisuje czas do projektu.</p></div><div class="workflow-log"><div class="section-head"><h3>Historia wykonanych prac</h3></div>${history}</div></section>`;
}
function stageForm(id){
 const p=state.projects.find(x=>x.id===id);if(!p)return;
 modal('Dodaj etap projektu',`<form id="stage-form" data-id="${htmlEscape(id)}"><p class="muted small">${htmlEscape(p.title)}</p><div class="field"><label>Nazwa etapu *</label><input required name="title" maxlength="120" placeholder="Np. Przygotowanie szablonu" autofocus></div><div class="modal-actions"><button class="btn ghost" type="button" data-action="open-project" data-id="${htmlEscape(id)}">Wróć</button><button class="btn" type="submit">Dodaj etap</button></div></form>`);
}
function workEntryForm(id){
 const p=state.projects.find(x=>x.id===id);if(!p)return;
 const day=new Date();const date=[day.getFullYear(),String(day.getMonth()+1).padStart(2,'0'),String(day.getDate()).padStart(2,'0')].join('-');
 modal('Dopisz czas pracy',`<form id="work-entry-form" data-id="${htmlEscape(id)}"><p class="muted small">${htmlEscape(p.title)}</p><div class="form-cols"><div class="field"><label>Data pracy</label><input name="date" type="date" required value="${date}"></div><div class="field"><label>Przepracowane minuty *</label><input name="minutes" type="number" min="1" max="1440" step="1" required placeholder="Np. 90"></div></div><div class="field"><label>Co zostało zrobione?</label><textarea name="note" maxlength="350" rows="3" placeholder="Np. Szkic muralu i przygotowanie kolorów"></textarea></div><p class="form-note">Wpis zostanie doliczony do łącznego czasu pracy i pojawi się w historii. Nie dodawaj ponownie godzin już ujętych w projekcie.</p><div class="modal-actions"><button type="button" class="btn ghost" data-action="open-project" data-id="${htmlEscape(id)}">Wróć</button><button class="btn" type="submit">Zapisz czas</button></div></form>`);
}
function startTimer(id){
 const p=state.projects.find(x=>x.id===id);if(!p)return;
 const another=state.projects.find(x=>x.id!==id&&x.timer?.startedAt);
 if(another){alert('Stoper już pracuje przy: '+another.title+'. Najpierw go wstrzymaj albo zakończ.');return}
 p.timer=p.timer||{startedAt:'',seconds:0};if(p.timer.startedAt)return;
 if(activeTimerSeconds(p)>=TIMER_LIMIT){alert('Sesja osiągnęła limit 24 godzin. Zakończ ją przed następną.');return}
 p.timer.startedAt=now();afterDataChange('Stoper uruchomiony',id);
}
function pauseTimer(id){
 const p=state.projects.find(x=>x.id===id);if(!p?.timer?.startedAt)return;
 p.timer={startedAt:'',seconds:activeTimerSeconds(p)};afterDataChange('Stoper wstrzymany',id);
}
function registerWork(p,seconds,note,source='manual',date=now()){
 p.workLog=(p.workLog||[]).concat({id:uid(),date,seconds,note,source}).slice(-2500);
 p.hours=Math.round((val(p.hours)+seconds/3600)*10000)/10000;
 recordActivity(p,'Zarejestrowano '+durationSecs(seconds)+' pracy');
}
function finishTimer(id){
 const p=state.projects.find(x=>x.id===id);if(!p?.timer)return;
 const seconds=activeTimerSeconds(p);if(seconds<1){toast('Sesja jest krótsza niż 1 sekunda.');return}
 const exceeded=p.timer.startedAt&&((Date.now()-Date.parse(p.timer.startedAt))/1000+p.timer.seconds)>=TIMER_LIMIT;
 registerWork(p,seconds,'Praca zmierzona stoperem','timer');
 p.timer={startedAt:'',seconds:0};
 afterDataChange(exceeded?'Zapisano maksymalnie 24 godziny — sprawdź czas pracy.':'Sesja zapisana: '+durationSecs(seconds),id);
}
function toggleStage(id,stageId){
 const p=state.projects.find(x=>x.id===id);if(!p)return;
 p.stages=p.stages||defaultStages(p.type,p.status);
 const st=p.stages.find(x=>x.id===stageId);if(!st)return;
 st.done=!st.done;recordActivity(p,(st.done?'Ukończono etap: ':'Cofnięto etap: ')+st.title);
 afterDataChange('Postęp realizacji zapisany',id);
}
function removeStage(id,stageId){
 const p=state.projects.find(x=>x.id===id);if(!p)return;
 p.stages=p.stages||defaultStages(p.type,p.status);
 const st=p.stages.find(x=>x.id===stageId);if(!st)return;
 if(!confirm('Usunąć etap „'+st.title+'” z realizacji?'))return;
 p.stages=p.stages.filter(x=>x.id!==stageId);recordActivity(p,'Usunięto etap: '+st.title);
 afterDataChange('Etap usunięty',id);
}
function removeWork(id,entryId){
 const p=state.projects.find(x=>x.id===id);if(!p)return;
 const entry=(p.workLog||[]).find(e=>e.id===entryId);if(!entry)return;
 if(!confirm('Usunąć zapis '+durationSecs(entry.seconds)+' i odjąć czas od projektu?'))return;
 p.workLog=p.workLog.filter(x=>x.id!==entryId);
 p.hours=Math.max(0,Math.round((val(p.hours)-entry.seconds/3600)*10000)/10000);
 recordActivity(p,'Usunięto zapis pracy: '+durationSecs(entry.seconds));
 afterDataChange('Usunięto zapis czasu',id);
}
function workNoteForm(id,entryId){
 const p=state.projects.find(x=>x.id===id),e=p?.workLog?.find(x=>x.id===entryId);if(!e)return;
 modal('Opis sesji pracy',`<form id="work-note-form" data-id="${htmlEscape(id)}" data-entry="${htmlEscape(entryId)}"><p class="muted small">${htmlEscape(p.title)} · ${durationSecs(e.seconds)}</p><div class="field"><label>Co zostało zrobione?</label><textarea name="note" rows="4" maxlength="350" placeholder="Np. Malowanie konturów i poprawki">${htmlEscape(e.note)}</textarea></div><div class="modal-actions"><button type="button" class="btn ghost" data-action="open-project" data-id="${htmlEscape(id)}">Wróć</button><button type="submit" class="btn">Zapisz opis</button></div></form>`);
}
function projectDetail(id){const p=state.projects.find(p=>p.id===id);if(!p)return;let cost=expenses(p),perHour=p.hours?profit(p)/p.hours:0;modal(p.title,`<div class="detail-top"><div class="detail-badges"><span class="pill">${htmlEscape(p.type)}</span>${pillStatus(p)}</div><button class="btn secondary sm" data-action="edit-project" data-id="${htmlEscape(p.id)}">${icon('pencil')} Edytuj</button></div><p class="muted small">${htmlEscape(p.client||'Bez wskazanego klienta')} · ${fDate(p.date)}</p><div class="detail-metrics"><div><small>Wartość</small><b>${fMoney(projectIncome(p))}</b></div><div><small>Koszty</small><b>${fMoney(cost)}</b></div><div><small>Po kosztach</small><b class="${profit(p)>=0?'money-positive':'money-negative'}">${fMoney(profit(p))}</b></div></div><div class="detail-metrics"><div><small>Wpłacono</small><b>${fMoney(projectPaid(p))}</b></div><div><small>Czas pracy</small><b>${fHours(p.hours)} h</b></div><div><small>Za godzinę</small><b>${p.hours?fMoney(perHour):'—'}</b></div></div>${projectSpecificDetail(p)}${financeDetail(p)}<div class="detail-section"><div class="section-head"><h3>Koszty projektu</h3><button class="btn sm secondary" data-action="add-expense" data-id="${htmlEscape(p.id)}">${icon('plus')} Dodaj koszt</button></div>${p.expenses.length?p.expenses.map(e=>`<div class="detail-entry"><span>${htmlEscape(e.title)} <small>· ${expenseCategoryName(e.category)} ${e.date?'· '+htmlEscape(e.date):'· bez daty'}</small></span><div><b>${fMoney(e.amount)}</b> <button class="btn ghost sm" data-action="delete-expense" data-id="${htmlEscape(p.id)}" data-expense="${htmlEscape(e.id)}" aria-label="Usuń koszt">${icon('trash')}</button></div></div>`).join(''):travelCost(p)>0?'':'<p class="muted small">Brak dodanych kosztów.</p>'}${estimatedTravelApplied(p)>0?`<div class="detail-entry travel-cost-entry"><span>Planowany dojazd <small>(wyliczony automatycznie)</small></span><b>${fMoney(travelCost(p))}</b></div><p class="muted tiny">Szacowany koszt dojazdu jest już uwzględniony w wyniku projektu. Nie dodawaj tej samej kwoty ponownie jako wydatek ręczny.</p>`:''}</div>${p.type==='Warsztat'?showParticipants(p)+workshopOperations(p):''}<div class="detail-section"><h3>Notatki</h3><p class="muted small">${p.notes?htmlEscape(p.notes):'Brak notatek.'}</p></div>${workSection(p)}<div class="detail-section"><button class="btn secondary" data-action="duplicate-project" data-id="${htmlEscape(p.id)}">${icon('copy')} Powiel projekt / warsztat</button></div><div class="danger-zone"><button class="btn danger sm" data-action="delete-project" data-id="${htmlEscape(p.id)}">${icon('trash')} Usuń projekt</button></div>`,{detail:true,projectId:p.id});}
const localDay=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
function paymentForm(id,participantId=''){
 const p=state.projects.find(x=>x.id===id);if(!p)return;
 const participant=participantId?p.participants.find(x=>x.id===participantId):null;
 if(participantId&&!participant)return;
 if(participant?.bookingStatus==='waitlist'){alert('Rezerwowy nie ma jeszcze potwierdzonego miejsca. Najpierw potwierdź zapis.');return}
 if(!participant&&p.type==='Warsztat'&&p.financeMode==='participants'){alert('Dla tego warsztatu dodaj wpłatę przy konkretnym uczestniku.');return}
 const due=participant?Math.max(0,money(participant.fee-participantPaid(participant))):Math.max(0,money(projectIncome(p)-projectPaid(p)));
 const title=participant?'Wpłata uczestnika':'Wpłata za realizację';
 modal(title,`<form id="payment-form" data-id="${htmlEscape(id)}" data-participant="${htmlEscape(participantId)}"><p class="muted small">${htmlEscape(p.title)}${participant?' · '+htmlEscape(participant.name):''}</p><p class="form-note">Pozostało do zapłaty: <b>${fMoney(due)}</b>. Wcześniej wpisane kwoty są zachowane — nowy wpis zostanie do nich doliczony.</p><div class="form-cols"><div class="field"><label>Data otrzymania *</label><input name="date" type="date" required value="${localDay()}"></div><div class="field"><label>Kwota wpłaty (zł) *</label><input name="amount" type="number" required min="0.01" step="0.01" max="${due||''}" value="${due||''}" placeholder="0,00"></div></div><div class="field"><label>Rodzaj</label><select name="kind"><option value="zaliczka">Zaliczka</option><option value="wplata">Wpłata / dopłata</option></select></div><div class="field"><label>Opis (opcjonalnie)</label><input name="note" maxlength="220" placeholder="Np. przelew, gotówka"></div><div class="modal-actions"><button type="button" class="btn ghost" data-action="open-project" data-id="${htmlEscape(id)}">Wróć</button><button class="btn" type="submit">Zapisz wpłatę</button></div></form>`);
}
function financeDetail(p){
 const automatic=p.type==='Warsztat'&&p.financeMode==='participants',pr=projectPlannedCost(p),actual=projectActualCost(p),travel=estimatedTravelApplied(p),total=expenses(p);
 const paymentDeadline=p.paymentDue&&projectIncome(p)>projectPaid(p)?`<p class="finance-due-note">${icon('calendar')} Termin pozostałej płatności: <strong>${htmlEscape(p.paymentDue)}</strong> · ${fMoney(Math.max(0,projectIncome(p)-projectPaid(p)))}</p>`:'';
 const entries=(p.payments||[]).slice().sort((a,b)=>b.date.localeCompare(a.date));
 const payments=automatic?'<p class="muted small">Wpłaty za warsztat prowadź przy uczestnikach poniżej. Nie doliczamy ich ponownie do ręcznej kwoty warsztatu.</p>':(entries.length?entries.map(x=>`<div class="finance-record"><div><small>${htmlEscape(x.date)} · ${x.kind==='zaliczka'?'Zaliczka':'Wpłata'}</small><strong>${fMoney(x.amount)}</strong>${x.note?'<small>'+htmlEscape(x.note)+'</small>':''}</div><button class="btn ghost sm" type="button" data-action="payment-delete" data-id="${htmlEscape(p.id)}" data-payment="${htmlEscape(x.id)}" aria-label="Usuń tę wpłatę">${icon('trash')}</button></div>`).join(''):'<p class="muted small">Brak nowych wpłat z przypisaną datą.</p>');
 return `<section class="detail-section finance-ledger"><div class="section-head"><h3>Historia wpłat i zaliczek</h3>${automatic?'':`<button class="btn secondary sm" data-action="payment-add" data-id="${htmlEscape(p.id)}">${icon('plus')} Dodaj wpłatę</button>`}</div>${paymentDeadline}<div class="finance-quick-grid"><div><small>Wartość projektu</small><b>${fMoney(projectIncome(p))}</b></div><div><small>Otrzymane łącznie</small><b>${fMoney(projectPaid(p))}</b></div><div><small>Do otrzymania</small><b>${fMoney(Math.max(0,projectIncome(p)-projectPaid(p)))}</b></div></div>${!automatic&&p.paid?`<p class="muted tiny">Wpłaty wpisane wcześniej, bez przypisanej daty: ${fMoney(p.paid)}. Poniższa historia obejmuje tylko nowe wpłaty.</p>`:''}${payments}<div class="finance-comparison"><h3>Budżet i rzeczywiste koszty</h3><div class="finance-quick-grid"><div><small>Plan: materiały + dojazd</small><b>${fMoney(pr)}</b></div><div><small>Faktycznie wpisane wydatki</small><b>${fMoney(actual)}</b></div><div><small>Koszt w wyniku*</small><b>${fMoney(total)}</b></div></div><p class="muted tiny">* Faktyczne wydatki + ${travel>0?'szacowany dojazd '+fMoney(travel):'bez doliczania szacowanego dojazdu'}. Wpisanie kosztu w kategorii „Dojazd faktyczny” zastępuje szacowany koszt dojazdu, aby nie liczyć go podwójnie. Plan nie jest dodatkowym wydatkiem.</p></div></section>`;
}
function expenseForm(id){
 const p=state.projects.find(x=>x.id===id);if(!p)return;
 modal('Nowy wydatek',`<form id="expense-form" data-id="${htmlEscape(id)}"><p class="muted small">${htmlEscape(p.title)}</p><div class="field"><label>Nazwa wydatku *</label><input name="title" maxlength="100" required placeholder="Np. lustro, materiały, transport"></div><div class="form-cols"><div class="field"><label>Kwota (zł) *</label><input name="amount" required type="number" step="0.01" min="0.01"></div><div class="field"><label>Data poniesienia kosztu *</label><input name="date" type="date" required value="${localDay()}"></div></div><div class="field"><label>Kategoria</label><select name="category"><option value="materialy">Materiały</option><option value="uslugi">Usługi / podwykonawcy</option><option value="dojazd">Dojazd faktyczny</option><option value="inne">Inne</option></select></div><p class="form-note">Dojazd faktyczny zastępuje wyliczony koszt szacunkowy. Nie doliczaj tego samego transportu drugi raz.</p><div class="modal-actions"><button type="button" class="btn ghost" data-action="open-project" data-id="${htmlEscape(id)}">Wróć</button><button class="btn" type="submit">Zapisz wydatek</button></div></form>`);
}
function participantForm(id,pid=''){
 const project=state.projects.find(p=>p.id===id);if(!project||project.type!=='Warsztat')return;
 const person=project.participants.find(x=>x.id===pid),fee=person?person.fee:money(project.participantFee);
 const newWaitlist=!person&&freePlaces(project)===0,waitlisted=person?.bookingStatus==='waitlist'||newWaitlist;
 modal(person?'Edytuj zapis uczestnika':'Nowy zapis na warsztat',`<form id="participant-form" data-id="${htmlEscape(id)}" data-participant="${htmlEscape(pid)}"><p class="muted small">${htmlEscape(project.title)}</p>${newWaitlist?'<div class="form-note workshop-queue-notice">Limit miejsc został osiągnięty. Nowy uczestnik zostanie dopisany do listy rezerwowej bez wpłaty.</div>':''}${person?`<p class="muted small">Status: ${waitlisted?'Lista rezerwowa':'Potwierdzony uczestnik'}</p>`:''}<div class="field"><label>Imię lub pseudonim *</label><input name="name" required maxlength="100" value="${person?htmlEscape(person.name):''}" placeholder="Np. Uczestnik 1"></div><div class="form-cols"><div class="field"><label>Cena udziału (zł)</label><input name="fee" type="number" required min="0" step="0.01" value="${fee}"></div><div class="field"><label>Wpłacono wcześniej, bez historii (zł)</label><input name="paidAmount" type="number" required min="0" step="0.01" value="${person?money(person.paidAmount):0}" ${waitlisted?'readonly':''}></div></div><div class="form-note">${waitlisted?'Lista rezerwowa nie przyjmuje wpłat. Potwierdź miejsce, gdy się zwolni.':'Starsze wpłaty wpisuj w polu wyżej. Nowe zaliczki i dopłaty dodawaj przyciskiem „Wpłata” przy uczestniku, aby ich nie liczyć dwukrotnie.'}${person?.legacyPaid?' W starej wersji wysokość wpłaty nie była znana — zweryfikuj kwotę.':''}</div><div class="modal-actions"><button type="button" class="btn ghost" data-action="open-project" data-id="${htmlEscape(id)}">Wróć</button><button class="btn" type="submit">${person?'Zapisz zmiany':'Zapisz osobę'}</button></div></form>`);
}
function taskForm(t){
 const edit=!!t,selected=t||{title:'',due:view==='calendar'?calendarSelected:'',projectId:''};
 modal(edit?'Edytuj zadanie':'Nowe zadanie',`<form id="task-form" data-id="${htmlEscape(t?.id||'')}"><div class="field"><label>Co trzeba zrobić? *</label><input name="title" required maxlength="180" value="${htmlEscape(selected.title)}" placeholder="Np. Kupić materiały na warsztaty"></div><div class="field"><label>Termin</label><input name="due" type="date" value="${htmlEscape(selected.due||'')}"></div><div class="field"><label>Powiązany projekt</label><select name="projectId"><option value="">Bez projektu</option>${state.projects.map(p=>`<option value="${htmlEscape(p.id)}" ${selected.projectId===p.id?'selected':''}>${htmlEscape(p.title)}</option>`).join('')}</select></div><div class="modal-actions"><button type="button" class="btn ghost" data-action="close">Anuluj</button><button class="btn" type="submit">${edit?'Zapisz zmiany':'Dodaj zadanie'}</button></div></form>`);
}
function toast(message){const root=$('#toast-root');root.innerHTML=`<div class="toast">${htmlEscape(message)}</div>`;clearTimeout(toast.timer);toast.timer=setTimeout(()=>root.innerHTML='',2900);}
function demo(){let base=Date.now();const future=days=>new Date(base+days*86400000).toISOString().slice(0,10);state.projects.push({id:uid(),title:'Lustro z grawerem 50 cm',type:'Zlecenie',client:'Klient demonstracyjny',date:future(15),status:'W trakcie',price:550,paid:200,hours:4,capacity:0,notes:'Dane demonstracyjne. Po testach usuń projekt.',expenses:[{id:uid(),title:'Lustro i rama',amount:95},{id:uid(),title:'Materiały do matowienia',amount:30}],participants:[],createdAt:new Date(base).toISOString()},{id:uid(),title:'Warsztaty kaligrafii – Gotyk',type:'Warsztat',client:'Pracownia demonstracyjna',date:future(22),status:'Planowane',price:1200,paid:600,hours:8,capacity:10,notes:'Przykład, nie rzeczywiste warsztaty Adama.',expenses:[{id:uid(),title:'Wynajem sali',amount:200},{id:uid(),title:'Materiały dla uczestników',amount:250}],participants:[{id:uid(),name:'Uczestnik 1 (demo)',fee:150,paidAmount:150},{id:uid(),name:'Uczestnik 2 (demo)',fee:150,paidAmount:50},{id:uid(),name:'Uczestnik 3 (demo)',fee:150,paidAmount:0}],createdAt:new Date(base-10000).toISOString()});state.tasks.push({id:uid(),title:'Przygotować materiały na zajęcia (demo)',due:future(20),done:false,projectId:state.projects[state.projects.length-1].id,createdAt:now()});isDemo=true;save();render();toast('Dodano przykładowe projekty i zadanie');}
function validateBackup(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('To nie jest kopia danych MANU');
 if(!Array.isArray(raw.projects)||!Array.isArray(raw.tasks))throw Error('Brakuje listy projektów lub zadań');
 if(raw.reminders!=null&&(!Array.isArray(raw.reminders)||raw.reminders.length>3000||raw.reminders.some(r=>!r||typeof r!=='object'||typeof r.title!=='string'||!validDate(r.date))))throw Error('Nieprawidłowa lista przypomnień');
 if(raw.version!=null&&(!Number.isInteger(raw.version)||raw.version<1||raw.version>12))throw Error('Nieobsługiwana wersja pliku. Nie nadpisano danych.');
 if(raw.quotes!=null&&(!Array.isArray(raw.quotes)||raw.quotes.length>3000||raw.quotes.some(q=>!q||typeof q!=='object'||typeof q.title!=='string'||(q.items!=null&&(!Array.isArray(q.items)||q.items.length>80||q.items.some(i=>!i||typeof i!=='object'||typeof i.description!=='string'))))))throw Error('Nieprawidłowa lista wycen');
 if(raw.projects.length>10000||raw.tasks.length>25000)throw Error('Plik zawiera zbyt wiele rekordów');
 for(const p of raw.projects){
  if(!p||typeof p!=='object'||Array.isArray(p)||typeof p.title!=='string')throw Error('Nieprawidłowy rekord projektu');
  if(p.expenses!=null&&(!Array.isArray(p.expenses)||p.expenses.some(e=>!e||typeof e!=='object'||Array.isArray(e))))throw Error('Nieprawidłowa lista kosztów');
  if(p.participants!=null&&(!Array.isArray(p.participants)||p.participants.some(a=>!a||typeof a!=='object'||Array.isArray(a))))throw Error('Nieprawidłowa lista uczestników');
 }
 for(const t of raw.tasks)if(!t||typeof t!=='object'||Array.isArray(t)||typeof t.title!=='string')throw Error('Nieprawidłowy rekord zadania');
 return normalize(raw);
}
function backupSummary(data){
 const workshops=data.projects.filter(p=>p.type==='Warsztat').length;
 return {projects:data.projects.length,workshops,tasks:data.tasks.length,participants:data.projects.reduce((n,p)=>n+(p.participants?.length||0),0)};
}
function backupDownload(){
 const exportedAt=now(),data={...state,exportedAt,app:'MANU',appVersion:APP_VERSION};
 const json=JSON.stringify(data,null,2),url=URL.createObjectURL(new Blob([json],{type:'application/json'}));
 const el=document.createElement('a'),stamp=exportedAt.replace(/:/g,'-').slice(0,19);
 el.href=url;el.download='manu-kopia-'+stamp+'.json';document.body.appendChild(el);
 try{el.click();toast('Przygotowano kopię. Sprawdź folder Pobrane i zachowaj plik w bezpiecznym miejscu.')}
 finally{el.remove();setTimeout(()=>URL.revokeObjectURL(url),3000)}
}
function exportData(){try{backupDownload()}catch(e){alert('Nie udało się pobrać kopii: '+String(e.message||e))}}
function showBackupPreview(){
 if(!pendingBackup)return;
 const item=pendingBackup,current=backupSummary(state),next=backupSummary(item.snapshot);
 const title=item.mode==='check'?'Sprawdzenie kopii MANU':item.mode==='recovery'?'Poprzedni zapis MANU':'Przywracanie kopii MANU';
 const action=item.mode==='check'?'':'<button class="btn" type="button" data-action="backup-apply">'+icon('upload')+' Zastąp obecne dane</button>';
 const summary='<p class="muted small">'+htmlEscape(item.filename)+'</p><div class="backup-preview-info"><strong>'+(item.mode==='check'?'Plik został odczytany poprawnie.':'Sprawdzono strukturę danych. Przed przywróceniem porównaj zawartość.')+'</strong>'
 +'<p>Obecnie w MANU: <b>'+current.projects+' projektów</b>, '+current.tasks+' zadań, '+current.participants+' uczestników.</p>'
 +'<p>W wybranej kopii: <b>'+next.projects+' projektów</b>, w tym '+next.workshops+' warsztatów, '+next.tasks+' zadań, '+next.participants+' uczestników.</p>'
 +'<p class="muted small">Zapis kopii: '+htmlEscape(item.snapshot.lastSaved||'Brak daty')+'. Sprawdź liczbę zapisanych rekordów.</p></div>';
 const warning=item.mode==='check'?'<p class="form-note">To była tylko kontrola pliku. Nic nie zostało przywrócone ani zmienione.</p>':
 '<p class="form-note backup-warning">Uwaga: przywrócenie ZASTĄPI obecne dane. Najpierw pobierz kopię obecnego stanu. Lokalny punkt przywracania nie zastępuje kopii poza telefonem.</p>';
 modal(title,'<form id="backup-preview-form">'+summary+warning+'<div class="modal-actions"><button type="button" class="btn ghost" data-action="close">Anuluj</button>'+action+'</div></form>');
}
function importData(mode='restore'){
 const input=document.createElement('input');input.type='file';input.accept='.json,application/json';
 input.onchange=async()=>{
  const file=input.files?.[0];if(!file)return;
  try{
   if(file.size>10*1024*1024)throw Error('Plik przekracza 10 MB');
   const raw=JSON.parse(await file.text()),next=validateBackup(raw);
   pendingBackup={snapshot:next,filename:file.name,mode};showBackupPreview();
  }catch(e){pendingBackup=null;alert('Plik nie przeszedł kontroli: '+String(e?.message||e))}
 };
 input.click();
}
async function recoverPrevious(){
 try{
  const raw=await readRecovery();
  if(!raw){toast('Nie ma jeszcze lokalnego punktu przywracania.');return}
  const data=validateBackup(raw);
  pendingBackup={snapshot:data,filename:'Poprzedni zapis z tego urządzenia',mode:'recovery'};
  showBackupPreview();
 }catch(e){alert('Nie można odczytać poprzedniego zapisu: '+String(e.message||e))}
}
let backupApplying=false;
async function applyBackup(){
 if(backupApplying)return;
 const data=pendingBackup;if(!data||data.mode==='check')return;
 const counts=backupSummary(data.snapshot);
 const message='Zastąpić wszystkie obecne projekty i zadania danymi z kopii ('+counts.projects+' projektów, '+counts.tasks+' zadań)?\nZalecane: najpierw pobierz kopię obecnych danych.';
 if(!confirm(message))return;
 backupApplying=true;
 try{
  const restored=structuredClone(data.snapshot),ok=await save(restored,true);
  if(!ok){alert('Nie udało się zapisać przywracanych danych. Obecny stan pozostawiono bez zmian.');return}
  state=restored;state.lastSaved=now();
  closeModal();render();toast('Przywrócono dane i zapisano je na urządzeniu.');
 }finally{backupApplying=false}
}
function afterDataChange(msg,detailId){
 // Aktualizuj kalendarz w miejscu: bez animacji kartki i bez przewijania na górę.
 if(view==='calendar'&&!detailId){save();refreshCalendarPanel();if(msg)toast(msg);return}
 // Aktualizacja etapów odświeża całą kartę projektu. Nie może jednak
 // przenosić czytelnika na początek strony ani restartować animacji kartki.
 const before=$('.modal');
 const preserve=!!(detailId&&before?.classList?.contains('notebook-detail-page'));
 const oldScroll=preserve?before.scrollTop:0;
 const oldPageX=window.scrollX,oldPageY=window.scrollY;
 const active=preserve?document.activeElement:null;
 const control=active?.dataset?.action?{...active.dataset}:null;
 save();
 render();
 if(detailId){
  projectDetail(detailId);
  if(preserve){
   const modalAfter=$('.modal');
   if(modalAfter){
    modalAfter.classList.add('notebook-refresh');
    modalAfter.scrollTop=oldScroll;
    // Zachowaj fokus na tym samym etapie (ważne też przy klawiaturze).
    if(control){
     const same=[...modalAfter.querySelectorAll('[data-action]')].find(el=>
      Object.entries(control).every(([key,value])=>el.dataset[key]===value)
     );
     if(same?.focus){try{same.focus({preventScroll:true})}catch(e){}}
    }
    modalAfter.scrollTop=oldScroll;
   }
  }
 }
 // Dotyczy także odhaczania zadań na liście, nie tylko etapów w modalnym notesie.
 if(window.scrollY!==oldPageY||window.scrollX!==oldPageX){
  window.scrollTo(oldPageX,oldPageY);
 }
 if(msg)toast(msg);
}
function handleAction(b){let action=b.dataset.action,id=b.dataset.id;switch(action){case 'nav':{
 if(b.dataset.view==='add'){projectForm();return;}
 const previous=view,next=b.dataset.view;
 const notebookOrder={home:0,projects:1,finance:2,tasks:3,calendar:4};
 notebookTurn=Object.hasOwn(notebookOrder,previous)&&Object.hasOwn(notebookOrder,next)&&previous!==next
   ?notebookOrder[next]>notebookOrder[previous]?'next':'prev':'';
 view=next;
 window.scrollTo(0,0);
 render();
 break;
}case 'new-project':projectForm();break;case 'timer-start':startTimer(id);break;case 'timer-pause':pauseTimer(id);break;case 'timer-stop':finishTimer(id);break;case 'stage-toggle':toggleStage(id,b.dataset.stage);break;case 'stage-add':stageForm(id);break;case 'stage-remove':removeStage(id,b.dataset.stage);break;case 'work-add':workEntryForm(id);break;case 'work-remove':removeWork(id,b.dataset.entry);break;case 'work-note':workNoteForm(id,b.dataset.entry);break;case 'open-project':projectDetail(id);break;case 'edit-project':projectForm(state.projects.find(p=>p.id===id));break;case 'close':closeModal();break;case 'close-overlay':closeModal();break;case 'new-task':taskForm();break;case 'edit-task':taskForm(state.tasks.find(x=>x.id===id));break;case 'calendar-prev':calendarShift(-1);break;case 'calendar-next':calendarShift(1);break;case 'calendar-today':calendarSelected=localDay();calendarMonth=calendarSelected.slice(0,7);refreshCalendarPanel();break;case 'calendar-day':{const date=validDate(b.dataset.date);if(date){calendarSelected=date;calendarMonth=date.slice(0,7);refreshCalendarPanel()}break;}case 'calendar-jump':{const date=validDate(b.dataset.date);if(!date)return;calendarSelected=date;calendarMonth=date.slice(0,7);view='calendar';render();break;}case 'reminder-add':reminderForm('',b.dataset.date||'');break;case 'reminder-edit':reminderForm(id);break;case 'reminder-delete':{const r=(state.reminders||[]).find(x=>x.id===id);if(r&&confirm('Usunąć przypomnienie „'+r.title+'”?')){state.reminders=state.reminders.filter(x=>x.id!==id);afterDataChange('Usunięto przypomnienie')}break;}case 'calendar-reminder':{const r=(state.reminders||[]).find(x=>x.id===id);if(r){r.done=!r.done;afterDataChange(r.done?'Przypomnienie zrealizowane':'Przypomnienie ponownie aktywne')}break;}case 'calendar-task':{const t=state.tasks.find(x=>x.id===id);if(t){t.done=!t.done;afterDataChange('Zapisano zadanie')}break;}case 'toggle-task':{let t=state.tasks.find(x=>x.id===id);if(t){t.done=!t.done;afterDataChange()};break;}case 'delete-task':if(confirm('Usunąć zadanie?')){state.tasks=state.tasks.filter(x=>x.id!==id);afterDataChange('Zadanie usunięte')}break;case 'task-filter':taskFilter=b.dataset.filter;render();break;case 'payment-add':paymentForm(id,b.dataset.participant||'');break;case 'payment-delete':{const p=state.projects.find(x=>x.id===id),pid=b.dataset.participant;const owner=pid?p?.participants?.find(x=>x.id===pid):p;const item=owner?.payments?.find(x=>x.id===b.dataset.payment);if(item&&confirm('Usunąć wpłatę '+fMoney(item.amount)+'? Kwota zostanie odjęta z rozliczenia.')){owner.payments=owner.payments.filter(x=>x.id!==item.id);recordActivity(p,'Usunięto wpis wpłaty '+fMoney(item.amount));afterDataChange('Usunięto wpłatę',id)}break;}case 'add-expense':expenseForm(id);break;case 'delete-expense':{let p=state.projects.find(p=>p.id===id);if(p&&confirm('Usunąć ten koszt?')){p.expenses=p.expenses.filter(x=>x.id!==b.dataset.expense);afterDataChange('Koszt usunięty',id)}break;}case 'workshop-attendance':setWorkshopAttendance(id,b.dataset.participant,b.dataset.attendance);break;case 'workshop-promote':promoteWorkshopParticipant(id,b.dataset.participant);break;case 'workshop-waitlist':moveWorkshopToWaitlist(id,b.dataset.participant);break;case 'workshop-material-add':workshopMaterialForm(id);break;case 'workshop-material-toggle':toggleWorkshopMaterial(id,b.dataset.material);break;case 'workshop-material-remove':removeWorkshopMaterial(id,b.dataset.material);break;case 'workshop-finish':finishWorkshop(id);break;case 'add-participant':participantForm(id);break;case 'edit-participant':participantForm(id,b.dataset.participant);break;case 'finance-mode':{let p=state.projects.find(p=>p.id===id);if(!p||p.type!=='Warsztat')break;const enable=p.financeMode!=='participants';if(confirm(enable?'Liczyć wartość i wpłaty warsztatu na podstawie uczestników? Dotychczasowe ręczne kwoty zostaną zachowane, ale nie będą dodawane do tych sum.':'Wrócić do ręcznie wpisanych kwot warsztatu? Dane uczestników zostaną zachowane.')){p.financeMode=enable?'participants':'manual';afterDataChange('Zmieniono sposób rozliczania warsztatu',id)}break;}case 'delete-participant':{const p=state.projects.find(x=>x.id===id),person=p?.participants.find(x=>x.id===b.dataset.participant);if(!person)break;const received=participantPaid(person);const warning='Usunąć '+person.name+'? '+(received>0?'Uwaga: zapisane wpłaty '+fMoney(received)+' oraz ich historia zostaną usunięte z rozliczenia. W razie zwrotu pieniędzy najpierw zadbaj o własną dokumentację. ':'')+(person.bookingStatus!=='waitlist'&&waitlistedParticipants(p).length?'Zwolni się miejsce do potwierdzenia dla osoby z kolejki.':'');if(confirm(warning)){p.participants=p.participants.filter(x=>x.id!==person.id);recordActivity(p,'Usunięto zapis uczestnika: '+person.name);afterDataChange('Usunięto uczestnika',id)}break;}case 'duplicate-project':{let p=state.projects.find(p=>p.id===id);if(!p)return;let clone=structuredClone(p);clone.id=uid();clone.title=p.title+' (kopia)';clone.date='';clone.paymentDue='';clone.status='Planowane';clone.paid=0;clone.payments=[];clone.hours=0;clone.stages=(clone.stages||defaultStages(clone.type)).map(st=>({...st,done:false}));clone.workLog=[];clone.activityLog=[];clone.timer={startedAt:'',seconds:0};clone.expenses=clone.expenses.map(x=>({...x,id:uid(),date:''}));clone.participants=[];clone.workshopMaterials=(clone.workshopMaterials||[]).map(x=>({...x,id:uid(),done:false}));clone.createdAt=now();state.projects.push(clone);closeModal();afterDataChange('Utworzono kopię projektu');projectDetail(clone.id);break;}case 'delete-project':if(confirm('Usunąć projekt? Tego nie można cofnąć bez kopii zapasowej.')){state.projects=state.projects.filter(x=>x.id!==id);state.tasks=state.tasks.map(t=>t.projectId===id?{...t,projectId:''}:t);closeModal();afterDataChange('Projekt usunięty')}break;case 'demo':if(confirm('Dodać przykładowe dane do obecnych?'))demo();break;case 'export':exportData();break;case 'import':importData();break;case 'backup-check':importData('check');break;case 'backup-recovery':recoverPrevious();break;case 'backup-apply':applyBackup();break;case 'storage-persist':(async()=>{try{if(!navigator.storage?.persist){toast('Ta przeglądarka nie udostępnia tej funkcji.');return}const granted=await navigator.storage.persist();toast(granted?'Przeglądarka zaakceptowała trwalsze przechowywanie danych.':'Przeglądarka nie przyznała trwalszej pamięci. Pamiętaj o kopiach JSON.')}catch(e){toast('Nie udało się sprawdzić ochrony danych.')}})();break;case 'clear':if(confirm('Usunąć WSZYSTKIE dane z tego urządzenia? Najpierw pobierz kopię!')&&confirm('Ostatnie potwierdzenie: na pewno usunąć wszystkie projekty, koszty, uczestników i zadania?')){state=blank();afterDataChange('Dane usunięte')}break;case 'install':if(installEvent){installEvent.prompt();installEvent.userChoice.finally(()=>{installEvent=null;render()})}break;}}
async function handleSubmit(form){let data=new FormData(form),id=form.dataset.id;switch(form.id){case 'project-form':{const title=String(data.get('title')||'').trim();if(!title){alert('Podaj nazwę projektu');return;}const existing=state.projects.find(p=>p.id===id);const previousStatus=existing?.status;const fieldsType=data.get('type')==='Warsztat'?'Warsztat':'Zlecenie';const fields={title,type:data.get('type')==='Warsztat'?'Warsztat':'Zlecenie',client:String(data.get('client')||'').trim(),date:validDate(data.get('date')),paymentDue:validDate(data.get('paymentDue')),status:validStatus.includes(data.get('status'))?data.get('status'):'Planowane',price:fieldsType==='Warsztat'&&existing?.type==='Warsztat'&&existing.financeMode==='participants'?existing.price:money(data.get('price')??existing?.price),paid:fieldsType==='Warsztat'&&existing?.type==='Warsztat'&&existing.financeMode==='participants'?existing.paid:money(data.get('paid')??existing?.paid),participantFee:money(data.get('participantFee')??existing?.participantFee),hours:val(fieldsType==='Warsztat'?data.get('workshopHours'):data.get('hours')),capacity:Math.floor(val(data.get('capacity')??existing?.capacity)),quantity:Math.max(1,Math.floor(val(data.get('quantity')??existing?.quantity??1))),estimatedHours:val((fieldsType==='Warsztat'?data.get('workshopEstimatedHours'):data.get('estimatedHours'))??existing?.estimatedHours),estimatedMaterials:money(data.get('estimatedMaterials')??existing?.estimatedMaterials),workLocation:String(data.get('workLocation')??existing?.workLocation??'').trim().slice(0,220),transportType:['none','car','paid'].includes(data.get('transportType'))?data.get('transportType'):(existing?transportType(existing):'none'),paidTransportCost:money(data.get('paidTransportCost')??existing?.paidTransportCost),paidTransportLabel:String(data.get('paidTransportLabel')??existing?.paidTransportLabel??'').trim().slice(0,100),travelKm:val(data.get('travelKm')??existing?.travelKm),travelMode:data.get('travelMode')==='rate'?'rate':'fuel',fuelConsumption:val(data.get('fuelConsumption')??existing?.fuelConsumption),fuelPrice:money(data.get('fuelPrice')??existing?.fuelPrice),travelRate:money(data.get('travelRate')??existing?.travelRate),travelExtra:money(data.get('travelExtra')??existing?.travelExtra),location:String(data.get('location')??existing?.location??'').trim(),startTime:String(data.get('startTime')??existing?.startTime??''),durationHours:val(data.get('durationHours')??existing?.durationHours),notes:String(data.get('notes')||'').trim()};if(existing&&fields.type==='Warsztat'&&fields.capacity>0&&confirmedParticipants(existing).length>fields.capacity){alert('Limit miejsc nie może być mniejszy niż liczba potwierdzonych uczestników ('+confirmedParticipants(existing).length+').');return}if(existing){const wasWorkshop=existing.type==='Warsztat';Object.assign(existing,fields);if(fields.type!=='Warsztat')existing.financeMode='manual';else if(!wasWorkshop)existing.financeMode='participants'}else state.projects.push({...fields,id:uid(),financeMode:fields.type==='Warsztat'?'participants':'manual',expenses:[],participants:[],workshopMaterials:[],createdAt:now(),stages:defaultStages(fields.type,fields.status),workLog:[],activityLog:[],timer:{startedAt:'',seconds:0}});if(existing&&fields.status!==previousStatus)recordActivity(existing,'Zmiana statusu: '+fields.status);closeModal();afterDataChange(existing?'Zapisano zmiany':'Dodano nowy projekt');break;}case 'work-note-form':{const p=state.projects.find(x=>x.id===id),entry=p?.workLog?.find(e=>e.id===form.dataset.entry);if(!entry)return;entry.note=String(data.get('note')||'').trim().slice(0,350);recordActivity(p,'Uzupełniono opis sesji');afterDataChange('Opis sesji zapisany',id);break;}case 'stage-form':{
 const p=state.projects.find(p=>p.id===id),title=String(data.get('title')||'').trim().slice(0,120);
 if(!p||!title)return;p.stages=p.stages||defaultStages(p.type,p.status);
 if(p.stages.length>=40){alert('Maksymalnie 40 etapów na projekt.');return}
 p.stages.push({id:uid(),title,done:false});recordActivity(p,'Dodano etap: '+title);
 afterDataChange('Dodano etap',id);break;
}case 'work-entry-form':{
 const p=state.projects.find(p=>p.id===id),minutes=Number(data.get('minutes')),date=String(data.get('date')||''),note=String(data.get('note')||'').trim().slice(0,350);
 if(!p||!Number.isInteger(minutes)||minutes<1||minutes>1440){alert('Podaj od 1 do 1440 minut.');return}
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date+'T12:00:00'))){alert('Podaj poprawną datę.');return}
 registerWork(p,minutes*60,note||'Praca wpisana ręcznie','manual',new Date(date+'T12:00:00').toISOString());
 afterDataChange('Zapisano czas: '+durationSecs(minutes*60),id);break;
}case 'payment-form':{
 const p=state.projects.find(x=>x.id===id),participantId=String(form.dataset.participant||''),person=participantId?p?.participants?.find(x=>x.id===participantId):null;
 const date=validDate(data.get('date')),amount=money(data.get('amount')),kind=data.get('kind')==='zaliczka'?'zaliczka':'wplata',note=String(data.get('note')||'').trim().slice(0,220);
 if(!p||(participantId&&!person)||!date||amount<=0){alert('Podaj poprawną datę i dodatnią kwotę wpłaty.');return}
 if(person?.bookingStatus==='waitlist'){alert('Najpierw potwierdź miejsce na warsztacie.');return}
 if(!person&&p.type==='Warsztat'&&p.financeMode==='participants'){alert('Wybierz uczestnika warsztatu.');return}
 const remaining=person?money(person.fee-participantPaid(person)):money(projectIncome(p)-projectPaid(p));
 if(amount>remaining+0.001){alert('Wpłata przekracza pozostałą należność: '+fMoney(Math.max(0,remaining)));return}
 const owner=person||p;owner.payments=owner.payments||[];
 owner.payments.push({id:uid(),date,amount,kind,note});
 recordActivity(p,(kind==='zaliczka'?'Otrzymano zaliczkę: ':'Otrzymano wpłatę: ')+fMoney(amount)+(person?' · '+person.name:''));
 afterDataChange('Zapisano wpłatę '+fMoney(amount),id);break;
}case 'expense-form':{const p=state.projects.find(p=>p.id===id);const title=String(data.get('title')||'').trim(),amount=money(data.get('amount')),date=validDate(data.get('date')),category=validExpenseCategory(data.get('category'));if(!p||!title||!amount||!date){alert('Podaj prawidłową kwotę, nazwę i datę kosztu.');return}p.expenses.push({id:uid(),title,amount,date,category});recordActivity(p,'Dodano wydatek: '+title+' '+fMoney(amount));afterDataChange('Koszt zapisany',id);break;}case 'workshop-material-form':{
 const p=state.projects.find(x=>x.id===id),title=String(data.get('title')||'').trim().slice(0,130),q=Number(data.get('quantity')||1);
 if(!p||p.type!=='Warsztat'||!title||!Number.isInteger(q)||q<1||q>9999){alert('Podaj nazwę i liczbę przygotowywanych materiałów.');return}
 p.workshopMaterials=p.workshopMaterials||[];
 if(p.workshopMaterials.length>=150){alert('Limit listy przygotowań to 150 pozycji.');return}
 p.workshopMaterials.push({id:uid(),title,quantity:q,done:false});
 recordActivity(p,'Dodano do przygotowań: '+title);
 afterDataChange('Dodano materiał do listy',id);break;
}case 'participant-form':{
 const p=state.projects.find(x=>x.id===id),name=String(data.get('name')||'').trim().slice(0,100);
 if(!p||p.type!=='Warsztat'||!name)return;
 const fee=money(data.get('fee')),paidAmount=money(data.get('paidAmount'));
 const existing=p.participants.find(x=>x.id===form.dataset.participant);
 const waitlisted=existing?.bookingStatus==='waitlist'||(!existing&&freePlaces(p)===0);
 if(waitlisted&&paidAmount>0){alert('Nie można pobrać wpłaty od osoby z listy rezerwowej.');return}
 if(paidAmount+paymentListTotal(existing?.payments)>fee){alert('Wpłaty łącznie nie mogą przekroczyć ceny udziału.');return}
 if(existing){
  Object.assign(existing,{name,fee,paidAmount,legacyPaid:false});
  recordActivity(p,'Zmieniono zapis: '+name);
 }else{
  p.participants.push({id:uid(),name,fee,paidAmount:waitlisted?0:paidAmount,payments:[],legacyPaid:false,bookingStatus:waitlisted?'waitlist':'confirmed',attendance:'unknown',joinedAt:now()});
  recordActivity(p,(waitlisted?'Dodano na listę rezerwową: ':'Potwierdzono zapis: ')+name);
 }
 afterDataChange(existing?'Zaktualizowano uczestnika':waitlisted?'Dodano do listy rezerwowej':'Dodano uczestnika',id);break;
}case 'task-form':{
 const title=String(data.get('title')||'').trim().slice(0,180);
 if(!title)return;
 const original=state.tasks.find(x=>x.id===id);
 const rawDue=String(data.get('due')||''),due=validDate(rawDue);
 if(rawDue&&!due){alert('Podaj prawidłową datę zadania');return}
 const projectId=String(data.get('projectId')||'');
 if(original)Object.assign(original,{title,due,projectId});else state.tasks.push({id:uid(),title,due,done:false,projectId,createdAt:now()});
 if(view==='calendar'&&due){calendarSelected=due;calendarMonth=due.slice(0,7)}
 closeModal();afterDataChange(original?'Zapisano zadanie':'Zadanie dodane');break;
}case 'reminder-form':{
 const title=String(data.get('title')||'').trim().slice(0,180),date=validDate(data.get('date')),rawTime=String(data.get('time')||''),time=/^([01]\d|2[0-3]):[0-5]\d$/.test(rawTime)?rawTime:'';
 if(!title||!date||(rawTime&&!time)){alert('Podaj tytuł, prawidłową datę i godzinę');return}
 const original=(state.reminders||[]).find(x=>x.id===id);
 const projectId=String(data.get('projectId')||'');
 if(original)Object.assign(original,{title,date,time,projectId});
 else{
  if(state.reminders.length>=3000){alert('Limit przypomnień został osiągnięty');return}
  state.reminders.push({id:uid(),title,date,time,projectId,done:false,createdAt:now()});
 }
 if(view==='calendar'){calendarSelected=date;calendarMonth=date.slice(0,7)}
 closeModal();afterDataChange(original?'Przypomnienie zapisane':'Dodano przypomnienie');break;
}}}
function events(){document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;if(b.dataset.action==='close-overlay'&&e.target!==b)return;handleAction(b)});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();if((e.key==='Enter'||e.key===' ')&&e.target.matches('[role="button"][data-action]')){e.preventDefault();handleAction(e.target)}});document.addEventListener('submit',e=>{if(!['project-form','expense-form','participant-form','task-form','stage-form','work-entry-form','work-note-form','payment-form','workshop-material-form','reminder-form'].includes(e.target.id))return;e.preventDefault();handleSubmit(e.target)});document.addEventListener('input',e=>{if(e.target.id==='search-projects'){search=e.target.value;let list=$('#project-list');if(list)list.innerHTML=renderProjectGrid()}if(e.target.closest?.('#project-form .travel-fields'))syncTravelFields()});document.addEventListener('change',e=>{if(e.target.id==='project-filter'){filter=e.target.value;render();}if(e.target.id==='finance-month-picker'){const month=String(e.target.value||'');if(/^\d{4}-(0[1-9]|1[0-2])$/.test(month)){financeMonth=month;const results=$('#finance-month-results');if(results)results.innerHTML=monthlyReportMarkup(month)}}if(e.target.matches('#project-form select[name="type"]'))syncProjectFields();if(e.target.matches('#project-form select[name="travelMode"]')||e.target.matches('#project-form input[name="transportType"]'))syncTravelFields();if(e.target.id==='manu-intro-preference'){try{localStorage.setItem('manu_intro_enabled',e.target.checked?'1':'0');toast(e.target.checked?'Animacja MANU włączona':'Animacja MANU wyłączona')}catch(err){toast('Nie udało się zapisać preferencji animacji')}}});window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e;if(view==='settings')render()});window.addEventListener('appinstalled',()=>{installEvent=null;toast('MANU zostało zainstalowane!')});window.addEventListener('online',()=>{if(view==='settings')render()});window.addEventListener('offline',()=>{if(view==='settings')render()});}
function introEnabled(){try{return localStorage.getItem('manu_intro_enabled')!=='0'}catch(e){return true}}
function dismissIntro(){
 const intro=document.getElementById('manu-intro');
 if(!intro)return;
 intro.classList.add('is-finished');
 intro.setAttribute('aria-hidden','true');
 window.setTimeout(()=>intro.remove(),450);
}
function startIntro(){
 const intro=document.getElementById('manu-intro');
 if(!intro)return;
 const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
 if(reduced||!introEnabled()){intro.remove();return;}
 const skip=document.getElementById('skip-intro');
 skip?.addEventListener('click',dismissIntro,{once:true});
 window.setTimeout(()=>{if(intro.isConnected)intro.classList.add('is-opening')},280);
 window.setTimeout(dismissIntro,1760);
}
async function init(){
 events();
 await load();
 calendarSelected=localDay();calendarMonth=calendarSelected.slice(0,7);
 render();
 window.setInterval?.(liveTimerRefresh,1000);
 if(storageBlocked)alert('MANU nie mogło bezpiecznie odczytać danych. Zapis został wstrzymany, aby nie nadpisać istniejącej bazy. Nie czyść pamięci telefonu. W Ustawieniach sprawdź poprzedni zapis albo przywróć sprawdzoną kopię JSON.');
 startIntro();
 if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./service-worker.js').catch(e=>console.warn('Service worker:',e));
}
init();
})();