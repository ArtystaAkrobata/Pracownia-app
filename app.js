(()=>{
'use strict';
const APP_VERSION='2.7.0';
const DB_NAME='pracownia_db_v1';
const DATA_KEY='snapshot';
const RECOVERY_KEY='safety-previous-v1';
const $=s=>document.querySelector(s);
const htmlEscape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const now=()=>new Date().toISOString();
const uid=()=> (crypto?.randomUUID?.() || 'id_'+Date.now()+'_'+Math.random().toString(16).slice(2));
const fMoney=n=>new Intl.NumberFormat('pl-PL',{style:'currency',currency:'PLN',minimumFractionDigits:0,maximumFractionDigits:2}).format(Number(n)||0);
const fNum=n=>new Intl.NumberFormat('pl-PL',{maximumFractionDigits:1}).format(Number(n)||0);
const fDate=s=>s?new Intl.DateTimeFormat('pl-PL',{day:'numeric',month:'short',year:'numeric'}).format(new Date(s+'T12:00:00')):'Bez terminu';
const val=v=>Math.max(0,Number(v)||0);
const money=v=>Math.round((val(v)+Number.EPSILON)*100)/100;
const $ico={home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-7h6v7"/>',folder:'<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v11H3z"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',wallet:'<rect x="3" y="6" width="18" height="15" rx="2"/><path d="M3 9V5a2 2 0 0 1 2-2h13M16 14h5"/>',check:'<path d="m5 12 4 4L19 6"/>',checks:'<path d="m3 8 2 2 4-4M13 8h8M3 17l2 2 4-4M13 17h8"/>',plus:'<path d="M12 5v14M5 12h14"/>',settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l-1.1 1.1a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.06 1.57V21h-3.4v-1.79A1.7 1.7 0 0 0 11.24 17.6a1.7 1.7 0 0 0-1.88.34l-1.1-1.1A1.7 1.7 0 0 0 8.6 15 1.7 1.7 0 0 0 7 13.95H5v-3.4h2A1.7 1.7 0 0 0 8.6 9a1.7 1.7 0 0 0-.34-1.88l1.1-1.1a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.06-1.57V3h3.4v1.79A1.7 1.7 0 0 0 16.76 6.4a1.7 1.7 0 0 0 1.88-.34l1.1 1.1A1.7 1.7 0 0 0 19.4 9 1.7 1.7 0 0 0 21 10.55h1v3.4h-1A1.7 1.7 0 0 0 19.4 15z"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M5 18v3h14v-3"/>',upload:'<path d="M12 21V9m-5 5 5-5 5 5M5 6V3h14v3"/>',brief:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>',users:'<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6m2 4a6 6 0 0 1 3 5"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',trend:'<path d="M3 17 9 11l4 4 8-8M15 7h6v6"/>',pencil:'<path d="m4 20 4-.8L20 7a2 2 0 0 0-3-3L5 16z"/>',trash:'<path d="M4 7h16M10 4h4M6 7l1 14h10l1-14M10 11v6M14 11v6"/>',archive:'<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v12h14V9m-9 5h4"/>',spark:'<path d="m12 3 2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z"/>',arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',filter:'<path d="M4 7h16M7 12h10M10 17h4"/>',copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',shield:'<path d="m12 2 9 4v6c0 6-4 9-9 10-5-1-9-4-9-10V6z"/><path d="m9 12 2 2 4-4"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.5"/>',map:'<path d="M3 6 9 3l6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',money:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5c-1.5-1.5-6-1.5-6 1s6 2 6 4.5-4 2.5-7 1M12 5v14"/>'};
function icon(n){return `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${$ico[n]||$ico.folder}</svg>`;}
const validStatus=['Planowane','W trakcie','Zakończone','Anulowane'];
const blank=()=>({version:8,projects:[],tasks:[],lastSaved:now()});
let state=blank(),view='home',filter='all',search='',taskFilter='open',installEvent=null,isDemo=false;
let notebookTurn='';
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
function normalize(obj){if(!obj || !Array.isArray(obj.projects)||!Array.isArray(obj.tasks))throw Error('Nieprawidłowy plik danych');return {version:8,lastSaved:obj.lastSaved||now(),projects:obj.projects.map(p=>({id:String(p.id||uid()),title:String(p.title||''),type:p.type==='Warsztat'?'Warsztat':'Zlecenie',client:String(p.client||''),date:String(p.date||''),status:validStatus.includes(p.status)?p.status:'Planowane',price:money(p.price),paid:money(p.paid),financeMode:p.financeMode==='participants'?'participants':'manual',participantFee:money(p.participantFee),hours:val(p.hours),capacity:val(p.capacity),quantity:Math.max(1,Math.floor(val(p.quantity)||1)),estimatedHours:val(p.estimatedHours),estimatedMaterials:money(p.estimatedMaterials),workLocation:String(p.workLocation||''),transportType:p.transportType==='paid'?'paid':p.transportType==='none'?'none':p.transportType==='car'?'car':(val(p.travelKm)>0||val(p.fuelConsumption)>0||val(p.fuelPrice)>0||val(p.travelRate)>0||val(p.travelExtra)>0?'car':'none'),paidTransportCost:money(p.paidTransportCost),paidTransportLabel:String(p.paidTransportLabel||''),travelKm:val(p.travelKm),travelMode:p.travelMode==='fuel'?'fuel':p.travelMode==='rate'?'rate':money(p.travelRate)>0?'rate':'fuel',fuelConsumption:val(p.fuelConsumption),fuelPrice:money(p.fuelPrice),travelRate:money(p.travelRate),travelExtra:money(p.travelExtra),location:String(p.location||''),startTime:/^([01]\d|2[0-3]):[0-5]\d$/.test(String(p.startTime||''))?String(p.startTime):'',durationHours:val(p.durationHours),notes:String(p.notes||''),expenses:Array.isArray(p.expenses)?p.expenses.map(x=>({id:String(x.id||uid()),title:String(x.title||''),amount:val(x.amount)})):[],participants:Array.isArray(p.participants)?p.participants.map(x=>({id:String(x.id||uid()),name:String(x.name||''),fee:money(x.fee),paidAmount:money(x.paidAmount),legacyPaid:!!x.legacyPaid||(x.paidAmount==null&&x.paid===true)})):[],createdAt:p.createdAt||now(),stages:normalizeStages(p),workLog:normalizeWorkLog(p.workLog),activityLog:normalizeActivityLog(p.activityLog),timer:normalizeTimer(p.timer)})),tasks:obj.tasks.map(t=>({id:String(t.id||uid()),title:String(t.title||''),due:String(t.due||''),done:!!t.done,projectId:String(t.projectId||''),createdAt:t.createdAt||now()}))};}
const enteredExpenses=p=>money((p.expenses||[]).reduce((n,x)=>n+val(x.amount),0));
const transportType=p=>p.transportType==='paid'?'paid':p.transportType==='none'?'none':p.transportType==='car'?'car':(val(p.travelKm)>0||val(p.fuelConsumption)>0||val(p.fuelPrice)>0||val(p.travelRate)>0||val(p.travelExtra)>0?'car':'none');
const travelMode=p=>p.travelMode==='rate'?'rate':p.travelMode==='fuel'?'fuel':money(p.travelRate)>0?'rate':'fuel';
const travelFuelLitres=p=>val(p.travelKm)*val(p.fuelConsumption)/100;
const travelCost=p=>p.type!=='Zlecenie'||transportType(p)==='none'?0:money((transportType(p)==='paid'?money(p.paidTransportCost):(travelMode(p)==='rate'?val(p.travelKm)*val(p.travelRate):travelFuelLitres(p)*val(p.fuelPrice)))+val(p.travelExtra));
const expenses=p=>money(enteredExpenses(p)+travelCost(p));
function paymentSummary(p){
 const list=p.participants||[];
 const fee=money(list.reduce((s,x)=>s+money(x.fee),0));
 const received=money(list.reduce((s,x)=>s+money(x.paidAmount),0));
 const outstanding=money(list.reduce((s,x)=>s+Math.max(0,money(x.fee)-money(x.paidAmount)),0));
 return {fee,received,outstanding};
}
const projectIncome=p=>p.type==='Warsztat'&&p.financeMode==='participants'?paymentSummary(p).fee:money(p.price);
const projectPaid=p=>p.type==='Warsztat'&&p.financeMode==='participants'?paymentSummary(p).received:money(p.paid);
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
 const pageLabels={projects:'REJESTR PROJEKTÓW',finance:'KSIĘGA FINANSÓW',tasks:'LISTA ZADAŃ'};
 const edge=page==='finance'?'right':'left';
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
function render(){let m=metrics();const turn=notebookTurn;notebookTurn='';const inside=['projects','finance','tasks'].includes(view);const pageContent=view==='home'?homePage(m):view==='projects'?projectsPage():view==='finance'?financePage(m):view==='tasks'?tasksPage():settingsPage();$('#app').innerHTML=`<div class="app-shell"><aside class="sidebar"><div class="brand"><div class="brandmark"><img class="brand-symbol" src="manu48-mark.svg" alt="" width="40" height="40"></div><div><h2>MANU</h2><p>Organizer twórcy</p></div></div><nav class="nav-list" aria-label="Nawigacja">${navBtn('home','home','Pulpit')}${navBtn('projects','folder','Projekty i warsztaty')}${navBtn('finance','wallet','Finanse')}${navBtn('tasks','checks','Zadania')}${navBtn('settings','settings','Ustawienia')}</nav><div class="sidebar-end">${icon('shield')}<strong>Twoja przestrzeń</strong><p>Wersja testowa · Dane przechowywane na tym urządzeniu. Regularnie eksportuj kopię.</p></div></aside><main class="main-area ${view==='home'?'manu-cover-home':inside?'manu-open-workspace':''}">${view==='home'?'<div class="cover-stitch" aria-hidden="true"></div><button type="button" class="cover-strap" data-action="new-project" aria-label="Otwórz notes i dodaj nowe zlecenie" title="Otwórz notes"><span class="cover-strap-button">M</span></button>':''}<header class="topbar"><div class="eyebrow">MANU · ORGANIZER TWÓRCY</div><div class="mobile-brand"><img src="manu48-mark.svg" alt="" width="34" height="34"><div><strong>MANU</strong><small>ORGANIZER TWÓRCY</small></div></div><div class="topbar-right"><div class="date-chip">${new Intl.DateTimeFormat('pl-PL',{day:'numeric',month:'short'}).format(new Date())}</div><button class="avatar" data-action="nav" data-view="settings" aria-label="Ustawienia" title="Ustawienia">${icon('settings')}</button></div></header>${inside?openNotebook(pageContent,view,turn):pageContent}</main><nav class="mobile-nav" aria-label="Nawigacja mobilna">${mobileBtn('home','home','Start')}${mobileBtn('projects','folder','Projekty')}${mobileBtn('add','plus','Dodaj')}${mobileBtn('finance','wallet','Finanse')}${mobileBtn('tasks','checks','Zadania')}</nav></div>`;}
function pageHeading(title,desc,btn=''){return `<div class="page-heading"><div><h1 class="page-title">${title}</h1><p class="page-lede">${desc}</p></div>${btn}</div>`}
function statsCard(label,number,note,ic,cls=''){return `<div class="stat"><div class="stat-top"><span>${label}</span><div class="stat-icon">${icon(ic)}</div></div><strong class="${cls}">${number}</strong><small>${note}</small></div>`}
function homePage(m){const recent=[...state.projects].sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||'')).slice(0,4);let next=[...state.tasks].filter(t=>!t.done).sort((a,b)=>(a.due||'9999').localeCompare(b.due||'9999')).slice(0,5);return `<div class="cover-signature" aria-label="MANU — Organizer twórcy"><img src="manu48-mark.svg" alt="" width="58" height="58"><strong>MANU</strong><span>ORGANIZER TWÓRCY</span><small>TWÓJ OSOBISTY NOTES</small></div>${pageHeading('Dzień dobry, twórco 👋','Twoje dzieła, projekty i plany w jednym eleganckim miejscu.',`<button class="btn" data-action="new-project">${icon('plus')}<span class="hide-small">Nowy projekt</span><span class="hide-small"> / warsztat</span></button>`)}<section class="hero"><div><div class="label">TWÓJ WYNIK · WSZYSTKIE AKTYWNE PROJEKTY</div><h1>${fMoney(m.profit)}</h1><p>Szacunkowo zostaje po wpisanych kosztach, w tym planowanym dojeździe.<br>Bez podatków, składek i nieujętych kosztów działalności.</p></div><div class="hero-stats"><strong>${m.count}</strong><span>otwartych projektów</span></div></section><section class="stat-grid">${statsCard('Wartość zleceń',fMoney(m.income),'Wpisany przychód','trend')}${statsCard('Koszty',fMoney(m.cost),'Wydatki projektowe','wallet')}${statsCard('Do zapłaty',fMoney(m.unpaid),'Pozostałe wpłaty','money')}${statsCard('Otwarte zadania',m.todo,'Do wykonania','checks')}</section><section class="content-grid"><div class="surface"><div class="section-head"><h2>Ostatnie projekty</h2><button class="link" data-action="nav" data-view="projects">Wszystkie ${icon('arrow')}</button></div>${recent.length?recent.map(projectRow).join(''):empty('Tu zacznie się Twoja historia','Dodaj pierwsze zlecenie albo warsztat. Możesz też wgrać dane demonstracyjne.',`<button class="btn sm" data-action="new-project">${icon('plus')} Dodaj projekt</button><button class="btn secondary sm" data-action="demo">Wstaw demo</button>`)}</div><div class="surface"><div class="section-head"><h2>Najbliższe zadania</h2><button class="link" data-action="new-task">${icon('plus')} Dodaj</button></div>${next.length?next.map(taskRow).join(''):empty('Wszystko pod kontrolą','Nie masz aktualnie otwartych zadań.',`<button class="btn secondary sm" data-action="new-task">Utwórz zadanie</button>`)}</div></section>`}
function projectRow(p){return `<div class="project-row" role="button" tabindex="0" data-action="open-project" data-id="${htmlEscape(p.id)}">${projectTypeIcon(p)}<div class="project-row-info"><b>${htmlEscape(p.title)}</b><span>${htmlEscape(p.type)} · ${htmlEscape(p.client||'Bez klienta')} · ${fDate(p.date)}</span></div><div class="right-stats"><b class="${profit(p)>=0?'money-positive':'money-negative'}">${fMoney(profit(p))}</b><small>po kosztach</small></div></div>`;}
function projectsPage(){return `${pageHeading('Projekty i warsztaty','Wszystkie realizacje, klienci, koszty i terminy.',`<button class="btn" data-action="new-project">${icon('plus')}<span>Dodaj nowy</span></button>`)}<div class="toolbar"><input class="search" id="search-projects" placeholder="Szukaj nazwy lub klienta…" value="${htmlEscape(search)}" aria-label="Wyszukaj projekt"><select id="project-filter" class="select"><option value="all" ${filter==='all'?'selected':''}>Wszystkie typy</option><option value="Zlecenie" ${filter==='Zlecenie'?'selected':''}>Zlecenia</option><option value="Warsztat" ${filter==='Warsztat'?'selected':''}>Warsztaty</option></select></div><div id="project-list" class="projects-grid">${renderProjectGrid()}</div>`;}
function renderProjectGrid(){let list=[...state.projects].filter(p=>(filter==='all'||p.type===filter)&&[p.title,p.client,p.notes].some(x=>String(x||'').toLowerCase().includes(search.toLowerCase()))).sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||''));return list.length?list.map(projectCard).join(''):`<div style="grid-column:1/-1">${empty('Brak projektów','Dodaj pierwszą realizację albo zmień filtr.',`<button class="btn sm" data-action="new-project">Dodaj projekt</button>`)}</div>`;}
function projectCard(p){let expense=expenses(p);return `<article class="project-card" data-action="open-project" data-id="${htmlEscape(p.id)}" role="button" tabindex="0"><div class="pcard-head">${projectTypeIcon(p)}${pillStatus(p)}</div><h3>${htmlEscape(p.title)}</h3><p>${htmlEscape(p.client||'Bez klienta')} · ${fDate(p.date)}</p><div class="pcard-metrics"><div><small>Wartość</small><b>${fMoney(projectIncome(p))}</b></div><div><small>Koszty</small><b>${fMoney(expense)}</b></div><div><small>Po kosztach</small><b class="${profit(p)>=0?'money-positive':'money-negative'}">${fMoney(profit(p))}</b></div></div><div class="pcard-footer"><span>${icon('clock')} ${fNum(p.hours)} godz. pracy</span><span>${p.type==='Warsztat'?`${p.participants.length}/${p.capacity||'∞'} uczestników`:`Wpłacono ${fMoney(projectPaid(p))}`}</span></div></article>`;}
function financePage(m){let perHour=m.hours?m.profit/m.hours:0;let margin=m.income?Math.round(m.profit/m.income*100):0;let projects=active().sort((a,b)=>profit(b)-profit(a));let pct=m.income?Math.min(100,Math.max(0,Math.round(m.cost/m.income*100))):0;return `${pageHeading('Finanse','Zobacz, co naprawdę zarabia Twoja pracownia.')}${!m.income&&!m.cost?empty('Finanse czekają na pierwszy projekt','Wprowadź przychód i koszty zlecenia albo warsztatu. Zestawienie policzy się samo.',`<button class="btn" data-action="new-project">Dodaj projekt</button>`):`<div class="stat-grid">${statsCard('Przychód wpisany',fMoney(m.income),'Wartość projektów','wallet')}${statsCard('Koszty razem',fMoney(m.cost),'Wydatki + szacowany dojazd','folder')}${statsCard('Po kosztach',fMoney(m.profit),'Przed podatkami i kosztami stałymi','trend',m.profit>=0?'accent':'warning')}${statsCard('Za godzinę',m.hours?fMoney(perHour):'—','Na podstawie zapisanych godzin','clock')}</div><div class="finance-grid"><section class="surface"><div class="section-head"><h2>Struktura kosztów</h2><span class="muted small">Wszystkie aktywne projekty</span></div><div class="donut" style="--pct:${pct}%"><div class="donut-inner"><b>${fNum(margin)}%</b><small>marży*</small></div></div><div class="summary-line"><span>Przychód</span><b>${fMoney(m.income)}</b></div><div class="summary-line"><span>Wydatki</span><b>${fMoney(m.cost)}</b></div><div class="summary-line"><span>Wpłaty od klientów</span><b>${fMoney(m.paid)}</b></div></section><section class="surface"><div class="section-head"><h2>Opłacalność realizacji</h2></div>${projects.slice(0,7).map(p=>`<div class="detail-entry" role="button" tabindex="0" data-action="open-project" data-id="${htmlEscape(p.id)}"><span>${htmlEscape(p.title)} <small>· ${fNum(p.hours)} h</small></span><b class="${profit(p)>=0?'money-positive':'money-negative'}">${fMoney(profit(p))}</b></div>`).join('')}</section></div><div class="form-note finance-detail">* Marża = (wpisany przychód − koszty bezpośrednie) / przychód. Zawiera szacowany dojazd do zleceń, jeśli został wpisany. To uproszczony wynik, a nie księgowy zysk netto. W pierwszej wersji zestawienie obejmuje wszystkie projekty poza anulowanymi, bez filtrowania według miesiąca.</div>`}`;}
function taskRow(t){let p=state.projects.find(p=>p.id===t.projectId);return `<div class="task-row"><button class="check-btn ${t.done?'checked':''}" data-action="toggle-task" data-id="${htmlEscape(t.id)}" aria-label="${t.done?'Cofnij wykonanie':'Oznacz jako wykonane'}">${t.done?icon('check'):''}</button><div class="task-text"><b class="${t.done?'done':''}">${htmlEscape(t.title)}</b><small>${p?htmlEscape(p.title)+' · ':''}${t.due?'Termin: '+fDate(t.due):'Bez terminu'}</small></div><button class="btn ghost sm" data-action="delete-task" data-id="${htmlEscape(t.id)}" aria-label="Usuń zadanie">${icon('trash')}</button></div>`;}
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
 const paperBinding=paper?'<div class="paper-binding" aria-hidden="true"><span class="paper-binding-edge"></span><span class="paper-binding-stitches"></span><span class="paper-binding-pages"></span></div>':'';
 const pageLabel=detail?'MANU · KARTA REALIZACJI':'MANU · KARTA PRACY';
 $('#modal-root').innerHTML=`<div class="modal-overlay ${paper?'paper-overlay':''}" data-action="close-overlay"><div class="modal ${paper?'notebook-page':''} ${detail?'notebook-detail-page':''} ${right?'notebook-page--right':''}" role="dialog" aria-modal="true" aria-label="${htmlEscape(title)}">${paper&&!right?paperBinding:''}<div class="${paper?'paper-sheet':'modal-sheet'}"><div class="modal-header"><div class="modal-page-title">${paper?'<small class="paper-kicker">'+pageLabel+'</small>':''}<h2>${htmlEscape(title)}</h2></div><button class="close" data-action="close" aria-label="Zamknij">×</button></div><div class="modal-body">${body}</div></div>${paper&&right?paperBinding:''}</div></div>`;
 $('.modal')?.scrollTo(0,0);
}
function closeModal(){pendingBackup=null;$('#modal-root').innerHTML='';}
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
      <div class="field"><label>Przepracowano (godz.)</label><input name="hours" type="number" min="0" step="0.25" value="${val(x.hours)}"></div>
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
      <div class="field field-full"><label>Przepracowano łącznie przy warsztacie (godz.)</label><input name="workshopHours" type="number" min="0" step="0.25" value="${val(x.hours)}"></div>
    </div>
    <div class="form-note">Po zapisaniu warsztatu dodasz uczestników i ich wpłaty. Cena za osobę będzie automatycznie proponowana w formularzu uczestnika.</div>
  </section>

  <section class="project-kind-section" data-field="money">
    <div class="kind-heading"><span class="kind-symbol">${icon('wallet')}</span><div><h3>Rozliczenie ${oldManualWorkshop?'warsztatu':'realizacji'}</h3><p data-money-description>Cena dla klienta i otrzymane wpłaty.</p></div></div>
    <div class="form-cols">
      <div class="field"><label data-label="price">Cena realizacji (zł)</label><input name="price" type="number" min="0" step="0.01" value="${money(moneyFieldValue)}"></div>
      <div class="field"><label data-label="paid">Wpłacono od klienta (zł)</label><input name="paid" type="number" min="0" step="0.01" value="${money(paidFieldValue)}"></div>
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
  form.querySelector('[data-label="paid"]').textContent=workshop?'Wpłacono za warsztat (zł)':'Wpłacono od klienta (zł)';
  form.querySelector('[data-money-description]').textContent=workshop?'Zachowane ręczne rozliczenie istniejącego warsztatu. Możesz przełączyć je na sumy uczestników w szczegółach.':'Cena dla klienta i otrzymane wpłaty.';
  syncTravelFields();
}
function showParticipants(p){
 const total=paymentSummary(p),automatic=p.financeMode==='participants';
 return `<div class="detail-section">
 <div class="section-head"><h3>Uczestnicy (${p.participants.length}${p.capacity?'/'+p.capacity:''})</h3><button class="btn sm secondary" data-action="add-participant" data-id="${htmlEscape(p.id)}">${icon('plus')} Dodaj osobę</button></div>
 <div class="participant-summary"><div><small>Do zapłaty łącznie</small><strong>${fMoney(total.fee)}</strong></div><div><small>Wpłaty otrzymane</small><strong class="money-positive">${fMoney(total.received)}</strong></div><div><small>Pozostało</small><strong class="${total.outstanding>0?'money-negative':'money-positive'}">${fMoney(total.outstanding)}</strong></div></div>
 ${p.participants.length?p.participants.map(person=>{
 const remaining=money(Math.max(0,money(person.fee)-money(person.paidAmount)));
 return `<div class="detail-entry participant-entry"><div class="participant-info"><b>${htmlEscape(person.name)}</b><small>Cena: ${fMoney(person.fee)} · Wpłacono: ${fMoney(person.paidAmount)}</small><small class="${remaining>0?'money-negative':'money-positive'}">${remaining>0?'Do dopłaty: '+fMoney(remaining):person.fee>0?'Opłacone w całości':'Cena do ustalenia'}</small>${person.legacyPaid?'<small class="money-negative">W poprzedniej wersji wpłata była tylko oznaczona, bez kwoty — uzupełnij dane.</small>':''}</div><div class="participant-actions"><button class="btn secondary sm" data-action="edit-participant" data-id="${htmlEscape(p.id)}" data-participant="${htmlEscape(person.id)}">${icon('pencil')} Edytuj</button><button class="btn ghost sm" data-action="delete-participant" data-id="${htmlEscape(p.id)}" data-participant="${htmlEscape(person.id)}" aria-label="Usuń uczestnika">${icon('trash')}</button></div></div>`;
 }).join(''):'<p class="muted small">Brak uczestników.</p>'}
 <div class="form-note">${automatic?'Wartość warsztatu i łączne wpłaty są liczone z uczestników. Dawnych kwot ręcznych nie doliczamy ponownie.':'Rozliczenie uczestników jest na razie osobne od ręcznie wpisanych finansów warsztatu. Możesz przełączyć sposób liczenia.'}</div>
 <button class="btn secondary sm" data-action="finance-mode" data-id="${htmlEscape(p.id)}">${automatic?'Wróć do ręcznie wpisanych kwot':'Licz finanse warsztatu z uczestników'}</button>
 </div>`;
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
 const history=entries.length?entries.map(x=>`<div class="work-history-row"><div><small>${htmlEscape(new Date(x.date).toLocaleString('pl-PL',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}))}</small><b>${htmlEscape(x.label)}</b><small>${htmlEscape(x.sub)}</small></div>${x.kind==='time'?`<button class="btn ghost sm" type="button" data-action="work-remove" data-id="${htmlEscape(p.id)}" data-entry="${htmlEscape(x.id)}" aria-label="Usuń wpis czasu">${icon('trash')}</button>`:''}</div>`).join(''):'<p class="muted small">Historia wypełni się przy wykonywaniu etapów i zapisywaniu sesji.</p>';
 const plan=planned>0?`<div class="workflow-plan"><div><small>Planowany czas</small><strong>${fNum(planned)} godz.</strong></div><div><small>Przepracowano łącznie</small><strong>${fNum(actual)} godz.</strong></div><div><small>${over?'Przekroczono plan o':'Do planu pozostało'}</small><strong class="${over?'money-negative':''}">${fNum(Math.abs(planned-actual))} godz.</strong></div></div><div class="workflow-bar" role="progressbar" aria-label="Czas względem planu" aria-valuenow="${Math.min(100,Math.round(actual/planned*100))}" aria-valuemin="0" aria-valuemax="100"><span style="width:${Math.min(100,Math.round(actual/planned*100))}%"></span></div>`:`<p class="muted small">Możesz określić planowany czas w edycji projektu. Aktualnie zapisano ${fNum(actual)} godz. pracy.</p>`;
 return `<section class="detail-section workflow-section"><div class="section-head"><h3>Przebieg realizacji</h3><span class="workflow-percent">${pr}% etapów</span></div><div class="workflow-bar" role="progressbar" aria-label="Ukończenie etapów projektu" aria-valuenow="${pr}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pr}%"></span></div><div class="workflow-stages">${steps}</div><button type="button" class="btn secondary sm" data-action="stage-add" data-id="${htmlEscape(p.id)}">${icon('plus')} Dodaj etap</button><div class="workflow-plan-area"><h3>Plan i rzeczywisty czas</h3>${plan}<p class="muted tiny">Zapisany czas obejmuje ręcznie wpisane godziny oraz zakończone sesje. W nowej historii zarejestrowano ${durationSecs(logged)}.</p></div><div class="workflow-time-area"><h3>Stoper pracy</h3>${timerButtons(p)}<div class="workflow-time-actions"><button type="button" class="btn secondary sm" data-action="work-add" data-id="${htmlEscape(p.id)}">${icon('plus')} Dopisz czas ręcznie</button></div><p class="muted tiny">Stoper liczy również po wygaszeniu ekranu, o ile zegar telefonu jest poprawny. Jedna sesja może mieć maksymalnie 24 godziny. Zatrzymanie zapisuje czas do projektu.</p></div><div class="workflow-log"><div class="section-head"><h3>Historia wykonanych prac</h3></div>${history}</div></section>`;
}
function stageForm(id){
 const p=state.projects.find(x=>x.id===id);if(!p)return;
 modal('Dodaj etap projektu',`<form id="stage-form" data-id="${htmlEscape(id)}"><p class="muted small">${htmlEscape(p.title)}</p><div class="field"><label>Nazwa etapu *</label><input required name="title" maxlength="120" placeholder="Np. Przygotowanie szablonu" autofocus></div><div class="modal-actions"><button class="btn ghost" type="button" data-action="open-project" data-id="${htmlEscape(id)}">Wróć</button><button class="btn" type="submit">Dodaj etap</button></div></form>`);
}
function workEntryForm(id){
 const p=state.projects.find(x=>x.id===id);if(!p)return;
 const date=new Date().toLocaleDateString('en-CA');
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
function projectDetail(id){const p=state.projects.find(p=>p.id===id);if(!p)return;let cost=expenses(p),perHour=p.hours?profit(p)/p.hours:0;modal(p.title,`<div class="detail-top"><div class="detail-badges"><span class="pill">${htmlEscape(p.type)}</span>${pillStatus(p)}</div><button class="btn secondary sm" data-action="edit-project" data-id="${htmlEscape(p.id)}">${icon('pencil')} Edytuj</button></div><p class="muted small">${htmlEscape(p.client||'Bez wskazanego klienta')} · ${fDate(p.date)}</p><div class="detail-metrics"><div><small>Wartość</small><b>${fMoney(projectIncome(p))}</b></div><div><small>Koszty</small><b>${fMoney(cost)}</b></div><div><small>Po kosztach</small><b class="${profit(p)>=0?'money-positive':'money-negative'}">${fMoney(profit(p))}</b></div></div><div class="detail-metrics"><div><small>Wpłacono</small><b>${fMoney(projectPaid(p))}</b></div><div><small>Czas pracy</small><b>${fNum(p.hours)} h</b></div><div><small>Za godzinę</small><b>${p.hours?fMoney(perHour):'—'}</b></div></div>${projectSpecificDetail(p)}<div class="detail-section"><div class="section-head"><h3>Koszty projektu</h3><button class="btn sm secondary" data-action="add-expense" data-id="${htmlEscape(p.id)}">${icon('plus')} Dodaj koszt</button></div>${p.expenses.length?p.expenses.map(e=>`<div class="detail-entry"><span>${htmlEscape(e.title)}</span><div><b>${fMoney(e.amount)}</b> <button class="btn ghost sm" data-action="delete-expense" data-id="${htmlEscape(p.id)}" data-expense="${htmlEscape(e.id)}" aria-label="Usuń koszt">${icon('trash')}</button></div></div>`).join(''):travelCost(p)>0?'':'<p class="muted small">Brak dodanych kosztów.</p>'}${travelCost(p)>0?`<div class="detail-entry travel-cost-entry"><span>Planowany dojazd <small>(wyliczony automatycznie)</small></span><b>${fMoney(travelCost(p))}</b></div><p class="muted tiny">Szacowany koszt dojazdu jest już uwzględniony w wyniku projektu. Nie dodawaj tej samej kwoty ponownie jako wydatek ręczny.</p>`:''}</div>${p.type==='Warsztat'?showParticipants(p):''}<div class="detail-section"><h3>Notatki</h3><p class="muted small">${p.notes?htmlEscape(p.notes):'Brak notatek.'}</p></div>${workSection(p)}<div class="detail-section"><button class="btn secondary" data-action="duplicate-project" data-id="${htmlEscape(p.id)}">${icon('copy')} Powiel projekt / warsztat</button></div><div class="danger-zone"><button class="btn danger sm" data-action="delete-project" data-id="${htmlEscape(p.id)}">${icon('trash')} Usuń projekt</button></div>`,{detail:true});}
function expenseForm(id){let p=state.projects.find(p=>p.id===id);if(!p)return;modal('Dodaj koszt',`<form id="expense-form" data-id="${htmlEscape(id)}"><p class="muted small">${htmlEscape(p.title)}</p><div class="field"><label>Nazwa wydatku *</label><input name="title" maxlength="100" required placeholder="Np. drewno, wynajem sali, tusz"></div><div class="field"><label>Kwota (zł) *</label><input name="amount" required type="number" step="0.01" min="0.01" placeholder="0,00"></div><div class="modal-actions"><button type="button" class="btn ghost" data-action="open-project" data-id="${htmlEscape(id)}">Wróć</button><button class="btn" type="submit">Zapisz koszt</button></div></form>`);}
function participantForm(id,pid=''){
 const project=state.projects.find(p=>p.id===id);if(!project||project.type!=='Warsztat')return;
 const person=project.participants.find(x=>x.id===pid);
 const fee=person?person.fee:money(project.participantFee);
 modal(person?'Edytuj wpłatę uczestnika':'Dodaj uczestnika',`<form id="participant-form" data-id="${htmlEscape(id)}" data-participant="${htmlEscape(pid)}"><p class="muted small">${htmlEscape(project.title)}</p>
 <div class="field"><label>Imię lub pseudonim *</label><input name="name" required maxlength="100" value="${person?htmlEscape(person.name):''}" placeholder="Np. Uczestnik 1"></div>
 <div class="form-cols"><div class="field"><label>Cena udziału (zł)</label><input name="fee" type="number" required min="0" step="0.01" value="${fee}"></div><div class="field"><label>Łącznie wpłacono (zł)</label><input name="paidAmount" type="number" required min="0" step="0.01" value="${person?money(person.paidAmount):0}"></div></div>
 <div class="form-note">Wpisz łączną otrzymaną kwotę, np. 50 zł zaliczki. Gdy osoba dopłaci 100 zł, zmień tę kwotę na 150 zł. Kwota pozostała do zapłaty wyliczy się automatycznie.${person?.legacyPaid?' W starej wersji nie zapisano wysokości oznaczonej wpłaty — wpisz ją na podstawie własnych danych.':''}</div>
 <div class="modal-actions"><button type="button" class="btn ghost" data-action="open-project" data-id="${htmlEscape(id)}">Wróć</button><button class="btn" type="submit">${person?'Zapisz zmiany':'Dodaj uczestnika'}</button></div></form>`);
}
function taskForm(){modal('Nowe zadanie',`<form id="task-form"><div class="field"><label>Co trzeba zrobić? *</label><input name="title" required maxlength="180" placeholder="Np. Kupić materiały na warsztaty"></div><div class="field"><label>Termin</label><input name="due" type="date"></div><div class="field"><label>Powiązany projekt</label><select name="projectId"><option value="">Bez projektu</option>${state.projects.map(p=>`<option value="${htmlEscape(p.id)}">${htmlEscape(p.title)}</option>`).join('')}</select></div><div class="modal-actions"><button type="button" class="btn ghost" data-action="close">Anuluj</button><button class="btn" type="submit">Dodaj zadanie</button></div></form>`);}
function toast(message){const root=$('#toast-root');root.innerHTML=`<div class="toast">${htmlEscape(message)}</div>`;clearTimeout(toast.timer);toast.timer=setTimeout(()=>root.innerHTML='',2900);}
function demo(){let base=Date.now();const future=days=>new Date(base+days*86400000).toISOString().slice(0,10);state.projects.push({id:uid(),title:'Lustro z grawerem 50 cm',type:'Zlecenie',client:'Klient demonstracyjny',date:future(15),status:'W trakcie',price:550,paid:200,hours:4,capacity:0,notes:'Dane demonstracyjne. Po testach usuń projekt.',expenses:[{id:uid(),title:'Lustro i rama',amount:95},{id:uid(),title:'Materiały do matowienia',amount:30}],participants:[],createdAt:new Date(base).toISOString()},{id:uid(),title:'Warsztaty kaligrafii – Gotyk',type:'Warsztat',client:'Pracownia demonstracyjna',date:future(22),status:'Planowane',price:1200,paid:600,hours:8,capacity:10,notes:'Przykład, nie rzeczywiste warsztaty Adama.',expenses:[{id:uid(),title:'Wynajem sali',amount:200},{id:uid(),title:'Materiały dla uczestników',amount:250}],participants:[{id:uid(),name:'Uczestnik 1 (demo)',fee:150,paidAmount:150},{id:uid(),name:'Uczestnik 2 (demo)',fee:150,paidAmount:50},{id:uid(),name:'Uczestnik 3 (demo)',fee:150,paidAmount:0}],createdAt:new Date(base-10000).toISOString()});state.tasks.push({id:uid(),title:'Przygotować materiały na zajęcia (demo)',due:future(20),done:false,projectId:state.projects[state.projects.length-1].id,createdAt:now()});isDemo=true;save();render();toast('Dodano przykładowe projekty i zadanie');}
function validateBackup(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('To nie jest kopia danych MANU');
 if(!Array.isArray(raw.projects)||!Array.isArray(raw.tasks))throw Error('Brakuje listy projektów lub zadań');
 if(raw.version!=null&&(!Number.isInteger(raw.version)||raw.version<1||raw.version>8))throw Error('Nieobsługiwana wersja pliku. Nie nadpisano danych.');
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
function afterDataChange(msg,detailId){save();render();if(detailId)projectDetail(detailId);if(msg)toast(msg)}
function handleAction(b){let action=b.dataset.action,id=b.dataset.id;switch(action){case 'nav':{
 if(b.dataset.view==='add'){projectForm();return;}
 const previous=view,next=b.dataset.view;
 const notebookOrder={home:0,projects:1,finance:2,tasks:3};
 notebookTurn=Object.hasOwn(notebookOrder,previous)&&Object.hasOwn(notebookOrder,next)&&previous!==next
   ?notebookOrder[next]>notebookOrder[previous]?'next':'prev':'';
 view=next;
 window.scrollTo(0,0);
 render();
 break;
}case 'new-project':projectForm();break;case 'timer-start':startTimer(id);break;case 'timer-pause':pauseTimer(id);break;case 'timer-stop':finishTimer(id);break;case 'stage-toggle':toggleStage(id,b.dataset.stage);break;case 'stage-add':stageForm(id);break;case 'stage-remove':removeStage(id,b.dataset.stage);break;case 'work-add':workEntryForm(id);break;case 'work-remove':removeWork(id,b.dataset.entry);break;case 'open-project':projectDetail(id);break;case 'edit-project':projectForm(state.projects.find(p=>p.id===id));break;case 'close':closeModal();break;case 'close-overlay':closeModal();break;case 'new-task':taskForm();break;case 'toggle-task':{let t=state.tasks.find(x=>x.id===id);if(t){t.done=!t.done;afterDataChange()};break;}case 'delete-task':if(confirm('Usunąć zadanie?')){state.tasks=state.tasks.filter(x=>x.id!==id);afterDataChange('Zadanie usunięte')}break;case 'task-filter':taskFilter=b.dataset.filter;render();break;case 'add-expense':expenseForm(id);break;case 'delete-expense':{let p=state.projects.find(p=>p.id===id);if(p&&confirm('Usunąć ten koszt?')){p.expenses=p.expenses.filter(x=>x.id!==b.dataset.expense);afterDataChange('Koszt usunięty',id)}break;}case 'add-participant':participantForm(id);break;case 'edit-participant':participantForm(id,b.dataset.participant);break;case 'finance-mode':{let p=state.projects.find(p=>p.id===id);if(!p||p.type!=='Warsztat')break;const enable=p.financeMode!=='participants';if(confirm(enable?'Liczyć wartość i wpłaty warsztatu na podstawie uczestników? Dotychczasowe ręczne kwoty zostaną zachowane, ale nie będą dodawane do tych sum.':'Wrócić do ręcznie wpisanych kwot warsztatu? Dane uczestników zostaną zachowane.')){p.financeMode=enable?'participants':'manual';afterDataChange('Zmieniono sposób rozliczania warsztatu',id)}break;}case 'delete-participant':{let p=state.projects.find(p=>p.id===id);if(p&&confirm('Usunąć uczestnika wraz z wpisaną dla niego kwotą?')){p.participants=p.participants.filter(x=>x.id!==b.dataset.participant);afterDataChange('Usunięto uczestnika',id)}break;}case 'duplicate-project':{let p=state.projects.find(p=>p.id===id);if(!p)return;let clone=structuredClone(p);clone.id=uid();clone.title=p.title+' (kopia)';clone.date='';clone.status='Planowane';clone.paid=0;clone.hours=0;clone.stages=(clone.stages||defaultStages(clone.type)).map(st=>({...st,done:false}));clone.workLog=[];clone.activityLog=[];clone.timer={startedAt:'',seconds:0};clone.expenses=clone.expenses.map(x=>({...x,id:uid()}));clone.participants=[];clone.createdAt=now();state.projects.push(clone);closeModal();afterDataChange('Utworzono kopię projektu');projectDetail(clone.id);break;}case 'delete-project':if(confirm('Usunąć projekt? Tego nie można cofnąć bez kopii zapasowej.')){state.projects=state.projects.filter(x=>x.id!==id);state.tasks=state.tasks.map(t=>t.projectId===id?{...t,projectId:''}:t);closeModal();afterDataChange('Projekt usunięty')}break;case 'demo':if(confirm('Dodać przykładowe dane do obecnych?'))demo();break;case 'export':exportData();break;case 'import':importData();break;case 'backup-check':importData('check');break;case 'backup-recovery':recoverPrevious();break;case 'backup-apply':applyBackup();break;case 'storage-persist':(async()=>{try{if(!navigator.storage?.persist){toast('Ta przeglądarka nie udostępnia tej funkcji.');return}const granted=await navigator.storage.persist();toast(granted?'Przeglądarka zaakceptowała trwalsze przechowywanie danych.':'Przeglądarka nie przyznała trwalszej pamięci. Pamiętaj o kopiach JSON.')}catch(e){toast('Nie udało się sprawdzić ochrony danych.')}})();break;case 'clear':if(confirm('Usunąć WSZYSTKIE dane z tego urządzenia? Najpierw pobierz kopię!')&&confirm('Ostatnie potwierdzenie: na pewno usunąć wszystkie projekty, koszty, uczestników i zadania?')){state=blank();afterDataChange('Dane usunięte')}break;case 'install':if(installEvent){installEvent.prompt();installEvent.userChoice.finally(()=>{installEvent=null;render()})}break;}}
async function handleSubmit(form){let data=new FormData(form),id=form.dataset.id;switch(form.id){case 'project-form':{const title=String(data.get('title')||'').trim();if(!title){alert('Podaj nazwę projektu');return;}const existing=state.projects.find(p=>p.id===id);const fieldsType=data.get('type')==='Warsztat'?'Warsztat':'Zlecenie';const fields={title,type:data.get('type')==='Warsztat'?'Warsztat':'Zlecenie',client:String(data.get('client')||'').trim(),date:String(data.get('date')||''),status:validStatus.includes(data.get('status'))?data.get('status'):'Planowane',price:fieldsType==='Warsztat'&&existing?.type==='Warsztat'&&existing.financeMode==='participants'?existing.price:money(data.get('price')??existing?.price),paid:fieldsType==='Warsztat'&&existing?.type==='Warsztat'&&existing.financeMode==='participants'?existing.paid:money(data.get('paid')??existing?.paid),participantFee:money(data.get('participantFee')??existing?.participantFee),hours:val(fieldsType==='Warsztat'?data.get('workshopHours'):data.get('hours')),capacity:Math.floor(val(data.get('capacity')??existing?.capacity)),quantity:Math.max(1,Math.floor(val(data.get('quantity')??existing?.quantity??1))),estimatedHours:val(data.get('estimatedHours')??existing?.estimatedHours),estimatedMaterials:money(data.get('estimatedMaterials')??existing?.estimatedMaterials),workLocation:String(data.get('workLocation')??existing?.workLocation??'').trim().slice(0,220),transportType:['none','car','paid'].includes(data.get('transportType'))?data.get('transportType'):(existing?transportType(existing):'none'),paidTransportCost:money(data.get('paidTransportCost')??existing?.paidTransportCost),paidTransportLabel:String(data.get('paidTransportLabel')??existing?.paidTransportLabel??'').trim().slice(0,100),travelKm:val(data.get('travelKm')??existing?.travelKm),travelMode:data.get('travelMode')==='rate'?'rate':'fuel',fuelConsumption:val(data.get('fuelConsumption')??existing?.fuelConsumption),fuelPrice:money(data.get('fuelPrice')??existing?.fuelPrice),travelRate:money(data.get('travelRate')??existing?.travelRate),travelExtra:money(data.get('travelExtra')??existing?.travelExtra),location:String(data.get('location')??existing?.location??'').trim(),startTime:String(data.get('startTime')??existing?.startTime??''),durationHours:val(data.get('durationHours')??existing?.durationHours),notes:String(data.get('notes')||'').trim()};if(existing){const wasWorkshop=existing.type==='Warsztat';Object.assign(existing,fields);if(fields.type!=='Warsztat')existing.financeMode='manual';else if(!wasWorkshop)existing.financeMode='participants'}else state.projects.push({...fields,id:uid(),financeMode:fields.type==='Warsztat'?'participants':'manual',expenses:[],participants:[],createdAt:now(),stages:defaultStages(fields.type,fields.status),workLog:[],activityLog:[],timer:{startedAt:'',seconds:0}});if(existing){if(fields.status!==existing.status)recordActivity(existing,'Zmiana statusu: '+fields.status)}closeModal();afterDataChange(existing?'Zapisano zmiany':'Dodano nowy projekt');break;}case 'expense-form':{const p=state.projects.find(p=>p.id===id);const title=String(data.get('title')||'').trim(),amount=val(data.get('amount'));if(!p||!title||!amount)return;p.expenses.push({id:uid(),title,amount});afterDataChange('Koszt zapisany',id);break;}case 'participant-form':{const p=state.projects.find(p=>p.id===id),name=String(data.get('name')||'').trim();if(!p||p.type!=='Warsztat'||!name)return;const fee=money(data.get('fee')),paidAmount=money(data.get('paidAmount'));if(paidAmount>fee){alert('Wpłata nie może przekraczać ceny udziału.');return;}const existing=p.participants.find(x=>x.id===form.dataset.participant);if(!existing&&p.capacity>0&&p.participants.length>=p.capacity){alert('Brak wolnych miejsc. Zwiększ limit warsztatu.');return;}if(existing)Object.assign(existing,{name,fee,paidAmount,legacyPaid:false});else p.participants.push({id:uid(),name,fee,paidAmount,legacyPaid:false});afterDataChange(existing?'Zaktualizowano wpłatę uczestnika':'Uczestnik dodany',id);break;}case 'task-form':{let title=String(data.get('title')||'').trim();if(!title)return;state.tasks.push({id:uid(),title,due:String(data.get('due')||''),done:false,projectId:String(data.get('projectId')||''),createdAt:now()});closeModal();afterDataChange('Zadanie dodane');break;}}}
function events(){document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;if(b.dataset.action==='close-overlay'&&e.target!==b)return;handleAction(b)});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();if((e.key==='Enter'||e.key===' ')&&e.target.matches('[role="button"][data-action]')){e.preventDefault();handleAction(e.target)}});document.addEventListener('submit',e=>{if(!['project-form','expense-form','participant-form','task-form'].includes(e.target.id))return;e.preventDefault();handleSubmit(e.target)});document.addEventListener('input',e=>{if(e.target.id==='search-projects'){search=e.target.value;let list=$('#project-list');if(list)list.innerHTML=renderProjectGrid()}if(e.target.closest?.('#project-form .travel-fields'))syncTravelFields()});document.addEventListener('change',e=>{if(e.target.id==='project-filter'){filter=e.target.value;render();}if(e.target.matches('#project-form select[name="type"]'))syncProjectFields();if(e.target.matches('#project-form select[name="travelMode"]')||e.target.matches('#project-form input[name="transportType"]'))syncTravelFields();if(e.target.id==='manu-intro-preference'){try{localStorage.setItem('manu_intro_enabled',e.target.checked?'1':'0');toast(e.target.checked?'Animacja MANU włączona':'Animacja MANU wyłączona')}catch(err){toast('Nie udało się zapisać preferencji animacji')}}});window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e;if(view==='settings')render()});window.addEventListener('appinstalled',()=>{installEvent=null;toast('MANU zostało zainstalowane!')});window.addEventListener('online',()=>{if(view==='settings')render()});window.addEventListener('offline',()=>{if(view==='settings')render()});}
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
 render();
 window.setInterval?.(liveTimerRefresh,1000);
 if(storageBlocked)alert('MANU nie mogło bezpiecznie odczytać danych. Zapis został wstrzymany, aby nie nadpisać istniejącej bazy. Nie czyść pamięci telefonu. W Ustawieniach sprawdź poprzedni zapis albo przywróć sprawdzoną kopię JSON.');
 startIntro();
 if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./service-worker.js').catch(e=>console.warn('Service worker:',e));
}
init();
})();