(()=>{
'use strict';
const APP_VERSION='3.28.2';

/* MANU 14.1 · personalizacja prostych ustawień interfejsu (tylko na urządzeniu) */
const UI_PREFS_KEY='manu-ui-preferences-v1';
const UI_QUICK_ACTIONS=Object.freeze([
 ['new-task','Nowe zadanie','checks'],
 ['quote-new','Nowa wycena','brief'],
 ['reminder-add','Przypomnienie','calendar'],
 ['client-new','Nowy klient','users'],
 ['new-project','Nowy projekt','plus']
]);
const UI_QUICK_ACTION_IDS=UI_QUICK_ACTIONS.map(action=>action[0]);
const DEFAULT_UI_PREFS=Object.freeze({
 startView:'home',showCommand:true,showRecent:true,
 accent:'copper',textSize:'standard',quickActions:['new-task','quote-new']
});
const UI_START_VIEWS=['home','projects','tasks','finance','calendar'];
const UI_ACCENTS=['copper','gold','steel'];
const UI_TEXT_SIZES=['standard','large'];
function normalizeUiPreferences(raw){
 const value=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 return {
  startView:UI_START_VIEWS.includes(value.startView)?value.startView:'home',
  showCommand:value.showCommand!==false,
  showRecent:value.showRecent!==false,
  accent:UI_ACCENTS.includes(value.accent)?value.accent:'copper',
  textSize:UI_TEXT_SIZES.includes(value.textSize)?value.textSize:'standard',
  quickActions:(Array.isArray(value.quickActions)?value.quickActions:DEFAULT_UI_PREFS.quickActions)
   .filter((id,i,items)=>typeof id==='string'&&UI_QUICK_ACTION_IDS.includes(id)&&items.indexOf(id)===i)
   .slice(0,3)
 };
}
function loadUiPreferences(){
 try{return normalizeUiPreferences(JSON.parse(localStorage.getItem(UI_PREFS_KEY)||'null'))}
 catch(e){return {...DEFAULT_UI_PREFS}}
}
let uiPreferences=loadUiPreferences();
let personalizationExpanded=false;
function applyUiAppearance(){
 const root=document.documentElement;
 if(!root)return;
 root.dataset.manuAccent=uiPreferences.accent;
 root.dataset.manuText=uiPreferences.textSize;
}
function updateUiPreferences(change){
 const next=normalizeUiPreferences({...uiPreferences,...change});
 try{
  localStorage.setItem(UI_PREFS_KEY,JSON.stringify(next));
  uiPreferences=next;
  applyUiAppearance();
  return true;
 }catch(e){console.warn('MANU: nie udało się zapisać preferencji',e);return false}
}
function quickAccessMarkup(){
 const selected=uiPreferences.quickActions;
 if(!selected.length)return '';
 const actions=selected.map(id=>UI_QUICK_ACTIONS.find(item=>item[0]===id)).filter(Boolean);
 if(!actions.length)return '';
 return `<section class="manu-quick-access" aria-label="Szybkie działania">
  <span class="manu-quick-label">SZYBKIE DZIAŁANIA</span>
  <div class="manu-quick-buttons">${actions.map(([id,label,ic])=>`<button type="button" class="manu-quick-button" data-action="${id}">${icon(ic)}<span>${label}</span></button>`).join('')}</div>
 </section>`;
}
function quickActionOrderMarkup(){
 const selected=uiPreferences.quickActions;
 if(!selected.length)return '<p class="muted tiny">Zaznacz przynajmniej jeden skrót, aby ustawić kolejność.</p>';
 return '<div class="manu-quick-order-list" role="list" aria-label="Kolejność szybkich działań">'+selected.map((id,index)=>{
  const entry=UI_QUICK_ACTIONS.find(item=>item[0]===id);
  if(!entry)return '';
  const label=entry[1];
  return '<div class="manu-quick-order-row" role="listitem">'+
   '<span class="manu-quick-order-title">'+(index+1)+'. '+label+'</span>'+
   '<span class="manu-quick-order-controls">'+
    '<button type="button" data-action="ui-quick-move" data-id="'+id+'" data-direction="up" aria-label="Przesuń '+label+' wyżej" '+(index===0?'disabled':'')+'>↑</button>'+
    '<button type="button" data-action="ui-quick-move" data-id="'+id+'" data-direction="down" aria-label="Przesuń '+label+' niżej" '+(index===selected.length-1?'disabled':'')+'>↓</button>'+
   '</span></div>';
 }).join('')+'</div>';
}
function personalizationMarkup(){
 const p=uiPreferences;
 const screens=[
  ['home','Start'],['projects','Projekty i warsztaty'],
  ['tasks','Zadania'],['finance','Finanse'],['calendar','Terminy']
 ];
 return `<details class="smart-settings manu-personalization" ${personalizationExpanded?'open':''}>
 <summary>${icon('settings')} Personalizacja MANU</summary>
 <div class="smart-settings-content">
  <p>Wybierz, co widzisz po otwarciu MANU. Nie zmienia to układu innych kartek ani zapisanych danych.</p>
  <label class="smart-settings-lead" for="manu-start-view">Ekran po uruchomieniu
  <select id="manu-start-view">${screens.map(([id,name])=>`<option value="${id}" ${p.startView===id?'selected':''}>${name}</option>`).join('')}</select></label>
  <div class="manu-personalization-subtitle">Wygląd notesu</div>
  <label class="smart-settings-lead" for="manu-accent">Kolor akcentów
   <select id="manu-accent">
    <option value="copper" ${p.accent==='copper'?'selected':''}>Klasyczna miedź</option>
    <option value="gold" ${p.accent==='gold'?'selected':''}>Stare złoto</option>
    <option value="steel" ${p.accent==='steel'?'selected':''}>Stal szlachetna</option>
   </select>
  </label>
  <label class="smart-settings-lead" for="manu-text-size">Wielkość tekstu
   <select id="manu-text-size">
    <option value="standard" ${p.textSize==='standard'?'selected':''}>Standardowa</option>
    <option value="large" ${p.textSize==='large'?'selected':''}>Większa — wygodniejsze czytanie</option>
   </select>
  </label>
  <div class="manu-personalization-subtitle">Szybkie działania na Start</div>
  <p class="muted tiny">Wybierz do 3 skrótów. Odznaczenie wszystkich usuwa pasek z pulpitu.</p>
  <div class="manu-quick-preferences">
   ${UI_QUICK_ACTIONS.map(([id,label])=>`<label class="smart-settings-check"><input type="checkbox" data-manu-quick="${id}" ${p.quickActions.includes(id)?'checked':''}><span>${label}</span></label>`).join('')}
  </div>
  <div class="manu-quick-order" aria-live="polite">${quickActionOrderMarkup()}</div>
  <div class="manu-personalization-subtitle">Widoczność sekcji na ekranie Start</div>
  <label class="smart-settings-check"><input type="checkbox" id="manu-show-command" ${p.showCommand?'checked':''}><span>Centrum dowodzenia</span></label>
  <label class="smart-settings-check"><input type="checkbox" id="manu-show-recent" ${p.showRecent?'checked':''}><span>Ostatnie projekty</span></label>
  <div class="manu-personalization-footer">
   <p class="muted tiny">Kolory i tekst zmieniają się od razu. Zmiany skrótów i widoczności sekcji zobaczysz przy następnym wejściu na Start. Ustawienia są zapisane tylko na tym urządzeniu.</p>
   <button class="btn ghost sm" type="button" data-action="ui-prefs-reset">Przywróć domyślne</button>
  </div>
 </div>
 </details>`;
}

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
const blank=()=>({version:18,projects:[],clients:[],tasks:[],reminders:[],smartAlerts:{enabled:true,leadDays:3,snoozed:{}},quotes:[],templates:[],quoteCounters:{},lastSaved:now()});
let state=blank(),view='home',filter='all',search='',clientSearch='',taskFilter='open',installEvent=null,isDemo=false;
let demoSession=null;
let pwaRegistration=null,pwaUpdateReady=false,pwaHadController=false;
let pwaActivationRequested=false,pwaObservedRegistration=null;
let offlineAuditMessage='Gotowość offline nie została jeszcze sprawdzona na tym urządzeniu.';
// Listy pokazują po 40 rekordów; wyszukiwanie działa na pełnej bazie.
const LIST_BATCH_SIZE=40;
const listVisible={projects:LIST_BATCH_SIZE,clients:LIST_BATCH_SIZE,tasks:LIST_BATCH_SIZE};
function nextListButton(kind,shown,total){
 const remaining=Math.max(0,total-shown);
 return remaining?'<div class="manu-list-more"><button type="button" class="btn secondary" data-action="list-more" data-list="'+kind+'">Pokaż kolejne '+Math.min(LIST_BATCH_SIZE,remaining)+' <span class="muted">('+remaining+' pozostało)</span></button></div>':'';
}
let notebookTurn='';
// Etap 12.1: jeden kontekst powrotu dla skrótów na stronie Start.
let homeReturnContext=null;
let projectReturnContext=null;
// Stan rozwinięcia menu Więcej narzędzi w Projektach — także po powrocie z podstrony.
let projectToolsExpanded=false;
let calendarMonth='',calendarSelected='';
let lastVisibleDay='';
let detailReturnScroll=null;
// MANU 3.27.1: zachowaj poprzednie okno w RAM razem z jego przewinięciem.
const modalReturnStack=[];
const MODAL_RETURN_LIMIT=6;
let smartAlertsExpanded=false;
let smartSettingsExpanded=false;
let profitabilityExpanded=false,profitabilityScope='all',compareExpanded=false,compareLeftId='',compareRightId='',costBreakdownExpanded=false;
let paymentControlExpanded=false,paymentControlFilter='all',paymentControlVisible=12;
// Rozwinięte sekcje pamiętamy w UI, bez zmian zapisanych danych.
const detailSectionStates=new Map();
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
let writeQueue=Promise.resolve(),pendingWrites=0,storageBlocked=false,saveStatus='ready',lastSaveError='',pendingBackup=null,hasStoredSnapshot=false;
function saveMessage(){
 if(storageBlocked)return 'Wstrzymany zapis — sprawdź odzyskiwanie danych';
 if(saveStatus==='error')return 'BŁĄD zapisu — wyeksportuj kopię i sprawdź pamięć telefonu';
 if(pendingWrites||saveStatus==='saving')return 'Zapisywanie na urządzeniu…';
 if(!hasStoredSnapshot)return 'Pierwszy zapis nastąpi po dodaniu danych';
 return state.lastSaved&&Number.isFinite(Date.parse(state.lastSaved))?'Zapis lokalny · '+new Intl.DateTimeFormat('pl-PL',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(state.lastSaved)):'Dane tylko na tym urządzeniu';
}
function updateSaveIndicator(){const el=$('#manu-save-status');if(el){el.textContent=saveMessage();el.classList?.toggle('is-error',storageBlocked||saveStatus==='error')}}
async function load(){
 try{db=await openDb()}catch(e){dbAvailable=false;console.warn('IndexedDB niedostępna — localStorage',e)}
 try{
  let raw=dbAvailable?await idbGet():null;
  if(raw==null){const legacy=localStorage.getItem(DATA_KEY);if(legacy)raw=JSON.parse(legacy)}
  if(raw!=null){state=normalize(raw);hasStoredSnapshot=true;}
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
 // Tryb demonstracyjny pracuje tylko w RAM: żadnych zapisów ani synchronizacji.
 if(demoSession)return Promise.resolve(true);
 // Podczas przywracania wolno wykonać tylko kontrolowany zapis odzyskiwanej kopii.
 if(backupApplying&&!force)return Promise.resolve(false);
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
  // Potwierdzamy zapis dopiero po zakończeniu transakcji bazy.
  hasStoredSnapshot=true;
  // Czas zapisu w obiekcie i na dysku musi być identyczny także po przywróceniu.
  candidate.lastSaved=snapshot.lastSaved;
  if(candidate===state){
   try{window.MANUCloud?.localSaved?.(snapshot);}
   catch(e){console.warn('MANU: lokalny zapis poprawny, ale nie udało się powiadomić chmury',e);}
  }
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
 const labels=type==='Warsztat'?['Plan i program','Zapisy uczestników','Przygotowanie materiałów','Prowadzenie warsztatu','Rozliczenie']:['Ustalenia i plan','Przygotowanie','Realizacja','Kontrola i poprawki','Przekazanie i rozliczenie'];
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
 // Nie obciążaj telefonu, gdy MANU działa w tle albo stoper nie jest widoczny.
 if(document.visibilityState==='hidden')return;
 const timers=document.querySelectorAll('[data-timer-value]');
 if(!timers.length)return;
 for(const el of timers){
  const p=state.projects.find(project=>project.id===el.dataset.timerValue);
  if(p?.timer?.startedAt)el.textContent=durationSecs(activeTimerSeconds(p));
 }
}

function normalizeSmartAlerts(raw){
 const source=raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
 const snoozed=Object.create(null);
 const previous=source.snoozed&&typeof source.snoozed==='object'&&!Array.isArray(source.snoozed)?source.snoozed:{};
 for(const [key,date] of Object.entries(previous).slice(-400)){
  if(key.length<=240&&validDate(date))snoozed[key]=date;
 }
 return {enabled:source.enabled!==false,leadDays:[1,3,7].includes(source.leadDays)?source.leadDays:3,snoozed};
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
 clientContact:String(q.clientContact||'').slice(0,350),clientAddress:String(q.clientAddress||'').slice(0,280),
 documentType:q.documentType==='offer'?'offer':'quote',
 documentStyle:q.documentStyle==='minimal'?'minimal':'classic',
 introduction:String(q.introduction||'').slice(0,1000),
 deliveryTerms:String(q.deliveryTerms||'').slice(0,360),
 paymentTerms:String(q.paymentTerms||'').slice(0,360),
 issued:validDate(q.issued)||localDay(),validUntil:validDate(q.validUntil),notes:String(q.notes||'').slice(0,900),
 discount:money(q.discount),createdAt:validTime(q.createdAt)||now(),
 items:(Array.isArray(q.items)?q.items:[]).slice(0,80).filter(i=>i&&typeof i==='object'&&!Array.isArray(i)).map(i=>({
 id:String(i.id||uid()),description:String(i.description||'').slice(0,180),quantity:Math.min(100000,Math.max(0,Number(i.quantity)||0)),unit:String(i.unit||'szt.').slice(0,24),unitPrice:money(i.unitPrice)
 }))
 }));
}
function quoteTitleForDocumentType(current,type){
 const title=String(current||'');
 if(type==='offer'){
  if(title==='Nowa wycena')return 'Oferta cenowa';
  if(title.startsWith('Wycena — '))return 'Oferta — '+title.slice('Wycena — '.length);
 }else{
  if(title==='Oferta cenowa')return 'Nowa wycena';
  if(title.startsWith('Oferta — '))return 'Wycena — '+title.slice('Oferta — '.length);
 }
 return title;
}
function quoteDocumentLabel(q){return q?.documentType==='offer'?'OFERTA CENOWA':'WYCENA'}
function quoteDocumentStyle(q){return q?.documentStyle==='minimal'?'minimal':'classic'}
function quoteDocumentTerms(q){
 const rows=[
  ['Termin realizacji',String(q.deliveryTerms||'')],
  ['Warunki płatności',String(q.paymentTerms||'')]
 ].filter(([,value])=>value.trim());
 if(!rows.length)return '';
 return '<section class="quote-doc-terms" aria-label="Ustalenia realizacji">'+rows.map(([label,value])=>
  '<div class="quote-doc-term"><h3>'+htmlEscape(label)+'</h3><p>'+htmlEscape(value)+'</p></div>'
 ).join('')+'</section>';
}
function quoteSubtotal(q){return Math.round((q.items||[]).reduce((sum,i)=>sum+(Number(i.quantity)||0)*money(i.unitPrice),0)*100)/100}
function quoteTotal(q){return Math.max(0,Math.round((quoteSubtotal(q)-money(q.discount))*100)/100)}
function normalizeQuoteCounters(value){
 const out={};
 if(!value||typeof value!=='object'||Array.isArray(value))return out;
 for(const [year,counter] of Object.entries(value)){
  if(/^20\d{2}$/.test(year)&&Number.isSafeInteger(counter)&&counter>=0&&counter<=999999)out[year]=counter;
 }
 return out;
}
function quoteNewNumber(){
 const year=new Date().getFullYear();
 const nums=(state.quotes||[]).map(q=>String(q.number).split('MANU-'+year+'-')[1]).map(Number).filter(n=>Number.isInteger(n)&&n>0);
 return 'MANU-'+year+'-'+String(Math.max(0,...nums,Number(state.quoteCounters?.[year]||0))+1).padStart(3,'0');
}
function normalizeClients(records){
 return (Array.isArray(records)?records:[]).slice(0,5000)
  .filter(c=>c&&typeof c==='object'&&!Array.isArray(c)&&String(c.name||'').trim())
  .map(c=>({
   id:String(c.id||uid()).slice(0,100),
   name:String(c.name||'').trim().slice(0,120),
   company:String(c.company||'').trim().slice(0,120),
   email:String(c.email||'').trim().slice(0,180),
   phone:String(c.phone||'').trim().slice(0,50),
   address:String(c.address||'').trim().slice(0,280),
   notes:String(c.notes||'').slice(0,2500),
   createdAt:String(c.createdAt||now())
  }));
}
function normalizePhotos(records){
 return (Array.isArray(records)?records:[]).slice(0,50).filter(x=>
  x&&typeof x==='object'&&!Array.isArray(x)&&
  /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\.jpg$/.test(String(x.path||'')))
  .map(x=>({
   id:String(x.id||uid()).slice(0,100),
   path:String(x.path||'').slice(0,400),
   kind:['before','after','final'].includes(x.kind)?x.kind:'final',
   caption:String(x.caption||'').slice(0,200),
   createdAt:String(x.createdAt||now()),
   size:val(x.size)
  }));
}
function normalize(obj){if(!obj || !Array.isArray(obj.projects)||!Array.isArray(obj.tasks))throw Error('Nieprawidłowy plik danych');return {version:18,lastSaved:obj.lastSaved||now(),templates:window.MANUTemplates?.normalizeTemplates?.(obj.templates)||(Array.isArray(obj.templates)?obj.templates:[]),clients:normalizeClients(obj.clients),projects:obj.projects.map(p=>({id:String(p.id||uid()),title:String(p.title||''),type:p.type==='Warsztat'?'Warsztat':'Zlecenie',client:String(p.type==='Warsztat'&&p.organizer==null&&!p.clientId?'':p.client||''),clientId:String(p.clientId||''),
organizer:String(p.organizer!=null?p.organizer:(p.type==='Warsztat'&&!p.clientId?p.client||'':'')).trim().slice(0,120),
photos:normalizePhotos(p.photos),date:validDate(p.date),paymentDue:validDate(p.paymentDue),status:validStatus.includes(p.status)?p.status:'Planowane',price:money(p.price),paid:money(p.paid),financeMode:p.financeMode==='participants'?'participants':'manual',participantFee:money(p.participantFee),hours:val(p.hours),capacity:val(p.capacity),quantity:Math.max(1,Math.floor(val(p.quantity)||1)),estimatedHours:val(p.estimatedHours),estimatedMaterials:money(p.estimatedMaterials),workLocation:String(p.workLocation||''),transportType:p.transportType==='paid'?'paid':p.transportType==='none'?'none':p.transportType==='car'?'car':(val(p.travelKm)>0||val(p.fuelConsumption)>0||val(p.fuelPrice)>0||val(p.travelRate)>0||val(p.travelExtra)>0?'car':'none'),paidTransportCost:money(p.paidTransportCost),paidTransportLabel:String(p.paidTransportLabel||''),travelKm:val(p.travelKm),travelMode:p.travelMode==='fuel'?'fuel':p.travelMode==='rate'?'rate':money(p.travelRate)>0?'rate':'fuel',fuelConsumption:val(p.fuelConsumption),fuelPrice:money(p.fuelPrice),travelRate:money(p.travelRate),travelExtra:money(p.travelExtra),location:String(p.location||''),startTime:/^([01]\d|2[0-3]):[0-5]\d$/.test(String(p.startTime||''))?String(p.startTime):'',durationHours:val(p.durationHours),notes:String(p.notes||''),expenses:Array.isArray(p.expenses)?p.expenses.map(x=>({id:String(x.id||uid()),title:String(x.title||''),amount:money(x.amount),date:validDate(x.date),category:validExpenseCategory(x.category)})):[],payments:normalizePayments(p.payments),workshopMaterials:normalizeWorkshopMaterials(p.workshopMaterials),participants:Array.isArray(p.participants)?p.participants.map(x=>({id:String(x.id||uid()),name:String(x.name||''),fee:money(x.fee),paidAmount:money(x.paidAmount),payments:normalizePayments(x.payments),legacyPaid:!!x.legacyPaid||(x.paidAmount==null&&x.paid===true),bookingStatus:x.bookingStatus==='waitlist'?'waitlist':'confirmed',attendance:['present','absent'].includes(x.attendance)?x.attendance:'unknown',joinedAt:validTime(x.joinedAt)||String(x.createdAt||p.createdAt||now())})):[],createdAt:p.createdAt||now(),stages:normalizeStages(p),workLog:normalizeWorkLog(p.workLog),activityLog:normalizeActivityLog(p.activityLog),timer:normalizeTimer(p.timer)})),tasks:obj.tasks.map(t=>({id:String(t.id||uid()),title:String(t.title||''),due:validDate(t.due),done:!!t.done,projectId:String(t.projectId||''),createdAt:t.createdAt||now()})),reminders:normalizeReminders(obj.reminders),smartAlerts:normalizeSmartAlerts(obj.smartAlerts),quotes:normalizeQuotes(obj.quotes),quoteCounters:normalizeQuoteCounters(obj.quoteCounters)};}
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
function mobileBtn(tab,ic,label){return `<button type="button" class="mobile-tab ${tab===view||tab==='projects'&&(view==='quotes'||view==='clients'||view==='gallery'||view==='templates')?'active':''}" data-action="nav" data-view="${tab}" aria-label="${tab==='add'?'Dodaj projekt':label}" ${tab==='add'?'title="Dodaj projekt"':''}>${icon(ic)}<span>${label}</span></button>`;}
function openNotebook(content,page,turn=''){
 const pageLabels={projects:'REJESTR PROJEKTÓW',clients:'KSIĘGA KLIENTÓW',gallery:'GALERIA REALIZACJI',templates:'KSIĘGA SZABLONÓW',quotes:'REJESTR WYCEN',finance:'KSIĘGA FINANSÓW',tasks:'LISTA ZADAŃ',calendar:'KALENDARZ I TERMINY'};
 const edge=['finance','calendar','quotes','clients','gallery','templates'].includes(page)?'right':'left';
 const animation=turn==='next'||turn==='prev'?' page-turn-'+turn:turn==='open'?' page-open':'';
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
function render(){if(homeReturnContext&&homeReturnContext.page!==view&&!(homeReturnContext.page==='projects'&&projectReturnContext?.page===view))homeReturnContext=null;const m=(view==='home'||view==='finance')?metrics():null;const turn=notebookTurn;notebookTurn='';const inside=['projects','clients','quotes','gallery','templates','finance','tasks','calendar'].includes(view);const pageContent=view==='home'?homePage(m):view==='projects'?projectsPage():view==='clients'?clientsPage():view==='gallery'?galleryPage():view==='templates'?templatesPage():view==='quotes'?quotesPage():view==='finance'?financePage(m):view==='tasks'?tasksPage():view==='calendar'?calendarPage():demoSession?demoSettingsPage():settingsPage();$('#app').innerHTML=`<div class="app-shell"><aside class="sidebar"><div class="brand"><div class="brandmark"><img class="brand-symbol" src="manu48-mark.svg" alt="" width="40" height="40"></div><div><h2>MANU</h2><p>Organizer twórcy</p></div></div><nav class="nav-list" aria-label="Nawigacja">${navBtn('home','home','Pulpit')}${navBtn('projects','folder','Projekty i warsztaty')}${navBtn('clients','users','Klienci')}${navBtn('gallery','folder','Galeria')}${navBtn('templates','copy','Szablony')}${navBtn('quotes','brief','Wyceny')}${navBtn('finance','wallet','Finanse')}${navBtn('tasks','checks','Zadania')}${navBtn('calendar','calendar','Kalendarz')}${navBtn('settings','settings','Ustawienia')}</nav><div class="sidebar-end">${icon('shield')}<strong>Twoja przestrzeń</strong><p>Wersja testowa · Dane przechowywane na tym urządzeniu. Regularnie eksportuj kopię.</p></div></aside><main class="main-area ${view==='home'?'manu-cover-home':inside?'manu-open-workspace':''}">${view==='home'?'<div class="cover-stitch" aria-hidden="true"></div><button type="button" class="cover-strap" data-action="new-project" aria-label="Otwórz notes i dodaj nowe zlecenie" title="Otwórz notes"><span class="cover-strap-button">M</span></button>':''}<header class="topbar"><div class="eyebrow">MANU · ORGANIZER TWÓRCY</div><div class="mobile-brand"><img src="manu48-mark.svg" alt="" width="34" height="34"><div><strong>MANU</strong><small>ORGANIZER TWÓRCY</small></div></div><div class="topbar-right"><span id="manu-offline-indicator" class="manu-offline-indicator" ${navigator.onLine===false?'':'hidden'}>Offline</span><div class="date-chip">${new Intl.DateTimeFormat('pl-PL',{day:'numeric',month:'short'}).format(new Date())}</div><button class="avatar" data-action="nav" data-view="settings" aria-label="Ustawienia" title="Ustawienia">${icon('settings')}</button></div></header>${demoBanner()}${inside?openNotebook(pageContent,view,turn):pageContent}</main><nav class="mobile-nav" aria-label="Nawigacja mobilna">${mobileBtn('home','home','Start')}${mobileBtn('projects','folder','Projekty')}${mobileBtn('add','plus','Dodaj')}${mobileBtn('finance','wallet','Finanse')}${mobileBtn('tasks','checks','Zadania')}${mobileBtn('calendar','calendar','Terminy')}</nav></div>`;void window.MANUGallery?.hydrate?.($('#app'));}
function pageHeading(title,desc,btn=''){return `<div class="page-heading"><div><h1 class="page-title">${title}</h1><p class="page-lede">${desc}</p></div>${btn}</div>`}
function returnToHomeButton(page){return homeReturnContext?.page===page?'<div class="calendar-return-toolbar"><button type="button" class="calendar-return-button" data-action="return-home" aria-label="Wróć do poprzedniego miejsca na ekranie Start" title="Wróć do Startu"><span aria-hidden="true">×</span> Wróć</button></div>':'';}
function returnToProjectsButton(){return '<div class="calendar-return-toolbar"><button type="button" class="calendar-return-button" data-action="return-projects" aria-label="Wróć do projektów" title="Wróć do projektów"><span aria-hidden="true">×</span> Wróć</button></div>';}
function statsCard(label,number,note,ic,cls=''){return `<div class="stat"><div class="stat-top"><span>${label}</span><div class="stat-icon">${icon(ic)}</div></div><strong class="${cls}">${number}</strong><small>${note}</small></div>`}
/* Etap 9.1 — Centrum dowodzenia: wyłącznie odczyt istniejących zadań, terminów i wpłat. */
function commandCenterData(today=localDay()){
 const end=plusDaysDate(today,7);
 const projectSoon=plusDaysDate(today,3);
 const entries=calendarEvents().filter(e=>!e.done);
 const actions=entries.filter(e=>(e.kind==='task'||e.kind==='reminder')&&e.date<=today);
 const upcoming=entries.filter(e=>e.date>today&&e.date<=end);
 const projects=entries.filter(e=>(e.kind==='project'||e.kind==='workshop')&&e.date<=projectSoon);
 const payments=entries.filter(e=>e.kind==='payment'&&e.date<=today);
 const late=entries.filter(e=>e.date<today);
 const todayCount=entries.filter(e=>e.date===today).length;
 const undated=state.tasks.filter(t=>!t.done&&!validDate(t.due)).length;
 const unpaidLate=money(payments.filter(e=>e.date<today).reduce((sum,e)=>{
  const p=state.projects.find(p=>p.id===e.projectId);
  return sum+(p?Math.max(0,projectIncome(p)-projectPaid(p)):0);
 },0));
 return {today,end,actions,upcoming,projects,payments,late,todayCount,undated,unpaidLate};
}
function commandAction(ev){
 if(ev.kind==='task')return {action:'edit-task',id:ev.taskId};
 if(ev.kind==='reminder')return {action:'reminder-edit',id:ev.reminderId};
 return {action:'open-project',id:ev.projectId};
}
function commandDateLabel(date,today){
 return date<today?'Po terminie':date===today?'Dzisiaj':fDate(date);
}
function commandItem(ev,today,showComplete=false){
 const target=commandAction(ev);
 const tag=commandDateLabel(ev.date,today);
 const overdue=ev.date<today;
 const type=calendarEventType(ev.kind);
 const project=ev.projectId?state.projects.find(p=>p.id===ev.projectId):null;
 const context=ev.kind==='payment'?ev.info:
  (ev.kind==='task'||ev.kind==='reminder')?(project?.title||''):ev.info;
 const details=[type,ev.time||'',context].filter(Boolean).join(' · ');
 const doneAction=ev.kind==='task'?'toggle-task':ev.kind==='reminder'?'calendar-reminder':'';
 const check=showComplete&&doneAction?
  '<button type="button" class="command-mark" data-action="'+doneAction+'" data-id="'+htmlEscape(target.id)+'" aria-label="Oznacz jako wykonane" title="Oznacz jako wykonane">'+icon('check')+'</button>':'';
 return '<div class="command-item'+(overdue?' is-late':'')+'">'+
  '<button type="button" class="command-item-main" data-action="'+target.action+'" data-id="'+htmlEscape(target.id||'')+'">'+
  '<span class="command-item-line"><strong>'+htmlEscape(ev.title)+'</strong>'+
  '<span class="command-date'+(overdue?' is-late':'')+'">'+htmlEscape(tag)+'</span></span>'+
  '<small>'+htmlEscape(details)+'</small></button>'+check+'</div>';
}
function commandMiniStat(value,label,navName,urgent=false){
 return '<button type="button" class="command-pulse-item'+(urgent?' is-urgent':'')+
  '" data-action="nav" data-view="'+navName+'"><strong>'+value+'</strong><span>'+label+'</span></button>';
}

/* Etap 9.3 — inteligentne przypomnienia: wyliczane, bez powielania rekordów. */
function smartAlertsData(today=localDay()){
 const cfg=state.smartAlerts||normalizeSmartAlerts(null);
 if(!cfg.enabled)return [];
 const ahead={workshop:7,project:cfg.leadDays||3,payment:cfg.leadDays||3,task:1,reminder:0};
 const snoozed=cfg.snoozed||{};
 return calendarEvents().filter(e=>{
  if(e.done||e.date>plusDaysDate(today,ahead[e.kind]??0))return false;
  const muted=snoozed[e.key+'|'+e.date];
  return !muted||muted<=today;
 }).sort((a,b)=>{
  const level=e=>e.date<today?0:e.date===today?1:2;
  const rank={payment:0,workshop:1,project:2,task:3,reminder:4};
  return level(a)-level(b)||a.date.localeCompare(b.date)||(rank[a.kind]??9)-(rank[b.kind]??9)||(a.time||'').localeCompare(b.time||'');
 });
}
function smartAlertsSummary(today=localDay()){
 const items=smartAlertsData(today);
 return {items,late:items.filter(e=>e.date<today).length,today:items.filter(e=>e.date===today).length};
}
function smartAlertRow(ev,today){
 const dest=commandAction(ev);
 const when=ev.date<today?'Po terminie':ev.date===today?'Dzisiaj':'Termin: '+fDate(ev.date);
 const meta=[calendarEventType(ev.kind),when,ev.kind==='payment'?ev.info:''].filter(Boolean).join(' · ');
 return '<div class="smart-alert-row'+(ev.date<today?' is-late':'')+'">'+
 '<button type="button" class="smart-alert-open" data-action="'+dest.action+'" data-id="'+htmlEscape(dest.id||'')+'">'+
 '<strong>'+htmlEscape(ev.title)+'</strong><small>'+htmlEscape(meta)+'</small></button>'+
 '<button type="button" class="smart-alert-snooze" data-action="smart-snooze" data-event="'+htmlEscape(ev.key)+'" data-date="'+htmlEscape(ev.date)+'" aria-label="Przypomnij jutro: '+htmlEscape(ev.title)+'">Jutro</button>'+
 '</div>';
}
function smartAlertsPanel(today=localDay()){
 const cfg=state.smartAlerts||normalizeSmartAlerts(null);
 if(!cfg.enabled)return '';
 const summary=smartAlertsSummary(today),items=summary.items,count=items.length;
 return '<details class="smart-alerts-panel" '+(smartAlertsExpanded?'open':'')+'>'+
 '<summary class="smart-alerts-summary"><span class="smart-alerts-symbol" aria-hidden="true">'+icon('calendar')+'</span>'+
 '<span class="smart-alerts-copy"><strong>Przypomnienia MANU</strong><small>'+
 (count?count+' spraw do dopilnowania'+(summary.late?' · '+summary.late+' po terminie':'')+(summary.today?' · '+summary.today+' dzisiaj':''):'Brak spraw wymagających uwagi')+
 '</small></span><span class="smart-alerts-count">'+count+'</span><span class="smart-alerts-chevron" aria-hidden="true">⌄</span></summary>'+
 '<div class="smart-alerts-body">'+
 (count?items.slice(0,6).map(e=>smartAlertRow(e,today)).join('')+
   (count>6?'<p class="smart-alerts-more">Jeszcze '+(count-6)+' spraw w kalendarzu.</p>':''):
  '<p class="smart-alerts-empty">Wszystko pod kontrolą. MANU sprawdzi terminy przy następnym otwarciu.</p>')+
 '<div class="smart-alerts-footer"><span>„Jutro” odkłada wskazówkę, nie zmienia terminu projektu.</span>'+
 '<button type="button" data-action="nav" data-view="calendar">Kalendarz '+icon('arrow')+'</button></div>'+
 '</div></details>';
}
function commandCenter(){
 const d=commandCenterData();
 const taskRows=d.actions.slice(0,5).map(e=>commandItem(e,d.today,true)).join('');
 const weekRows=d.upcoming.slice(0,5).map(e=>commandItem(e,d.today)).join('');
 const projectRows=d.projects.slice(0,4).map(e=>commandItem(e,d.today)).join('');
 const payRows=d.payments.slice(0,3).map(e=>commandItem(e,d.today)).join('');
 return '<section class="command-center" aria-label="Centrum dowodzenia MANU">'+
  '<div class="command-head"><div><span class="command-kicker">TWÓJ DZIEŃ · MANU</span>'+
  '<h2>Centrum dowodzenia</h2><p>Najważniejsze sprawy wynikające z zapisanych danych. Bez automatycznych powiadomień w tle.</p></div>'+
  '<button type="button" class="btn secondary sm" data-action="nav" data-view="calendar">'+icon('calendar')+' Kalendarz</button></div>'+
  smartAlertsPanel(d.today)+
  '<div class="command-pulse">'+
  commandMiniStat(d.late.length,'Spraw po terminie','calendar',d.late.length>0)+
  commandMiniStat(d.todayCount,'Terminów dzisiaj','calendar')+
  commandMiniStat(d.upcoming.length,'W kolejnych 7 dniach','calendar')+
  commandMiniStat(d.payments.filter(e=>e.date<d.today).length,'Zaległych płatności','finance',d.unpaidLate>0)+
  '</div>'+
  '<div class="command-grid">'+
   '<section class="command-panel"><div class="command-panel-heading"><h3>'+icon('checks')+' Na dziś i zaległe</h3>'+
   '<button class="command-small-link" type="button" data-action="nav" data-view="tasks">Lista zadań '+icon('arrow')+'</button></div>'+
   (taskRows||'<p class="command-empty">Nie ma zadań ani przypomnień z terminem na dziś lub wcześniejszym.</p>')+
   (d.actions.length>5?'<p class="command-more">Jeszcze '+(d.actions.length-5)+' spraw do sprawdzenia w kalendarzu.</p>':'')+
   (d.undated?'<p class="command-note">Otwarte zadania bez terminu: <strong>'+d.undated+'</strong>. Możesz nadać im daty w zakładce Zadania.</p>':'')+
   '</section>'+
   '<section class="command-panel"><div class="command-panel-heading"><h3>'+icon('calendar')+' Najbliższe 7 dni</h3>'+
   '<button class="command-small-link" type="button" data-action="nav" data-view="calendar">Wszystkie '+icon('arrow')+'</button></div>'+
   (weekRows||'<p class="command-empty">Brak terminów na kolejne 7 dni.</p>')+
   (d.upcoming.length>5?'<p class="command-more">Jeszcze '+(d.upcoming.length-5)+' terminów w kalendarzu.</p>':'')+
   '</section>'+
  '</div>'+
  '<div class="command-grid command-grid-bottom">'+
   '<section class="command-panel"><div class="command-panel-heading"><h3>'+icon('folder')+' Realizacje do dopilnowania</h3>'+
   '<button class="command-small-link" type="button" data-action="nav" data-view="projects">Projekty '+icon('arrow')+'</button></div>'+
   '<p class="command-section-note">Niezakończone projekty po terminie lub z terminem w ciągu 3 dni.</p>'+
   (projectRows||'<p class="command-empty">Nie ma obecnie realizacji z bliskim lub przekroczonym terminem.</p>')+
   (d.projects.length>4?'<p class="command-more">Pozostałe: '+(d.projects.length-4)+' w zakładce Projekty.</p>':'')+
   '</section>'+
   '<section class="command-panel"><div class="command-panel-heading"><h3>'+icon('wallet')+' Płatności do dopilnowania</h3>'+
   '<button class="command-small-link" type="button" data-action="nav" data-view="finance">Finanse '+icon('arrow')+'</button></div>'+
   '<p class="command-section-note">Tylko należności z wpisanym terminem płatności. Zaległe: <strong>'+fMoney(d.unpaidLate)+'</strong>.</p>'+
   (payRows||'<p class="command-empty">Brak zaległych płatności i płatności przypadających dziś.</p>')+
   (d.payments.length>3?'<p class="command-more">Pozostałe: '+(d.payments.length-3)+' w kalendarzu.</p>':'')+
   '</section>'+
  '</div>'+
  '<div class="command-shortcuts"><button type="button" class="btn sm" data-action="new-task">'+icon('plus')+' Nowe zadanie</button>'+
   '<button type="button" class="btn secondary sm" data-action="reminder-add">'+icon('calendar')+' Przypomnienie</button>'+
   '<button type="button" class="btn secondary sm" data-action="new-project">'+icon('plus')+' Projekt</button></div>'+
  '</section>';
}
function homePage(m){const profileName=demoSession?'':window.MANUCloud?.displayName?.()||'';const greeting=profileName?'Dzień dobry, '+htmlEscape(profileName)+' 👋':'Dzień dobry, twórco 👋';const recent=[...state.projects].sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||'')).slice(0,4);return `<div class="cover-signature" aria-label="MANU — Organizer twórcy"><img src="manu48-mark.svg" alt="" width="58" height="58"><strong>MANU</strong><span>ORGANIZER TWÓRCY</span><small>TWÓJ OSOBISTY NOTES</small></div>${pageHeading(greeting,'Twoje dzieła, projekty i plany w jednym eleganckim miejscu.',`<button class="btn" data-action="new-project">${icon('plus')}<span class="hide-small">Nowy projekt</span><span class="hide-small"> / warsztat</span></button>`)}<section class="hero"><div><div class="label">TWÓJ WYNIK · WSZYSTKIE AKTYWNE PROJEKTY</div><h1>${fMoney(m.profit)}</h1><p>Szacunkowo zostaje po wpisanych kosztach, w tym planowanym dojeździe.<br>Bez podatków, składek i nieujętych kosztów działalności.</p></div><div class="hero-stats"><strong>${m.count}</strong><span>otwartych projektów</span></div></section>${quickAccessMarkup()}${uiPreferences.showCommand?commandCenter():''}<section class="stat-grid">${statsCard('Wartość zleceń',fMoney(m.income),'Wpisany przychód','trend')}${statsCard('Koszty',fMoney(m.cost),'Wydatki projektowe','wallet')}${statsCard('Do zapłaty',fMoney(m.unpaid),'Pozostałe wpłaty','money')}${statsCard('Otwarte zadania',m.todo,'Do wykonania','checks')}</section>${uiPreferences.showRecent?`<section class="home-recent"><div class="surface"><div class="section-head"><h2>Ostatnie projekty</h2><button class="link" data-action="nav" data-view="projects">Wszystkie ${icon('arrow')}</button></div>${recent.length?recent.map(projectRow).join(''):empty('Tu zacznie się Twoja historia','Dodaj pierwsze zlecenie albo warsztat. Możesz też wgrać dane demonstracyjne.',`<button class="btn sm" data-action="new-project">${icon('plus')} Dodaj projekt</button><button class="btn secondary sm" data-action="demo">Wstaw demo</button>`)}</div></section>`:''}`}
function projectRow(p){return `<div class="project-row" role="button" tabindex="0" data-action="open-project" data-id="${htmlEscape(p.id)}">${projectTypeIcon(p)}<div class="project-row-info"><b>${htmlEscape(p.title)}</b><span>${htmlEscape(p.type)} · ${htmlEscape(p.client||'Bez klienta')} · ${fDate(p.date)}</span></div><div class="right-stats"><b class="${profit(p)>=0?'money-positive':'money-negative'}">${fMoney(profit(p))}</b><small>po kosztach</small></div></div>`;}
function quoteItemRow(item={}){
 return `<div class="quote-line" data-quote-row>
  <div class="field quote-line-description"><label>Pozycja</label><input name="description" maxlength="180" value="${htmlEscape(item.description||'')}" required placeholder="Np. Wykonanie zamówienia lub usługi"></div>
  <div class="field"><label>Ilość</label><input name="quantity" type="number" min="0.01" max="100000" step="any" value="${item.quantity||1}" required></div>
  <div class="field"><label>Jednostka</label><input name="unit" maxlength="24" value="${htmlEscape(item.unit||'szt.')}" required></div>
  <div class="field"><label>Cena jedn. (zł)</label><input name="unitPrice" type="number" min="0" max="100000000" step="0.01" value="${money(item.unitPrice)}" required></div>
  <button type="button" class="btn ghost sm quote-remove-line" data-action="quote-remove-line" aria-label="Usuń pozycję">${icon('trash')}</button>
 </div>`;
}

/* Etap 15.1 — opcjonalne podpowiedzi w wycenach. Koszty nie są cenami sprzedaży. */
function quoteProjectItem(p){
 const qty=Math.max(1,Math.floor(Number(p?.quantity)||1));
 return {description:String(p?.title||'').slice(0,180),quantity:qty,
  unit:p?.type==='Warsztat'?'usł.':'szt.',unitPrice:money(projectIncome(p)/qty)};
}
function quoteClientFields(c){
 return {client:String((c.company?c.company+' — ':'')+c.name).slice(0,180),
  clientContact:[c.email,c.phone].filter(Boolean).join(' · ').slice(0,350),
  clientAddress:String(c.address||'').slice(0,280)};
}
function quoteCostHints(p){
 if(!p)return [];
 const hints=[];
 for(const m of (p.workshopMaterials||[])){
  if(!String(m.title||'').trim())continue;
  hints.push({description:String(m.title).trim().slice(0,180),
   quantity:Math.max(1,Math.min(100000,Math.floor(Number(m.quantity)||1))),
   kind:'Materiał',cost:null});
 }
 for(const e of (p.expenses||[])){
  if(!String(e.title||'').trim())continue;
  hints.push({description:String(e.title).trim().slice(0,180),
   quantity:1,kind:expenseCategoryName(e.category),cost:money(e.amount)});
 }
 return hints.slice(0,24);
}
function quoteProjectHintsMarkup(p){
 if(!p)return '<p class="muted small">Wybierz projekt wyżej, aby zobaczyć podpowiedzi materiałów i kosztów.</p>';
 const hints=quoteCostHints(p);
 return '<p class="quote-helper-value">Wartość projektu: <strong>'+fMoney(projectIncome(p))+'</strong> · '
  +'Plan materiałów: '+fMoney(p.estimatedMaterials||0)+' · Wpisane wydatki: '+fMoney(enteredExpenses(p))+'</p>'
  +'<p class="muted tiny">Koszt nie jest ceną dla klienta. Wstawiamy tylko opis i ilość; cenę sprzedaży ustawiasz samodzielnie.</p>'
  +(hints.length?'<div class="quote-helper-hints">'+hints.map((h,i)=>
   '<div class="quote-helper-hint"><span><b>'+htmlEscape(h.description)+'</b><small>'
   +htmlEscape(h.kind)+(h.cost!=null?' · koszt: '+fMoney(h.cost):' · '+h.quantity+' szt.')
   +'</small></span><button type="button" class="btn secondary sm" data-action="quote-add-hint" data-index="'+i+'">Wstaw opis</button></div>'
  ).join('')+'</div>'
  :'<p class="muted small">Brak zapisanych pozycji kosztów lub listy materiałów w tym projekcie.</p>');
}
function quoteAssistantMarkup(q,p){
 const matched=state.clients.find(c=>c.id===p?.clientId)||state.clients.find(c=>c.name===q.client);
 const options=state.clients.slice().sort((a,b)=>a.name.localeCompare(b.name,'pl')).map(c=>
  '<option value="'+htmlEscape(c.id)+'" '+(c.id===matched?.id?'selected':'')+'>'
  +htmlEscape(c.company?c.company+' — '+c.name:c.name)+'</option>').join('');
 return '<details class="quote-assistant"><summary>'+icon('spark')+' Asystent wyceny <span>opcjonalnie</span></summary>'
  +'<div class="quote-assistant-body"><p>Przenieś dane świadomie jednym dotknięciem. Rozliczenia projektu pozostaną bez zmian.</p>'
  +'<button type="button" class="btn secondary sm" id="quote-fill-project" data-action="quote-fill-project" '+(!p?'disabled':'')+'>'
  +icon('copy')+' Wstaw dane wybranego projektu</button>'
  +'<div class="field"><label for="quote-client-source">Klient z bazy</label><select id="quote-client-source">'
  +'<option value="">Wybierz zapisany kontakt</option>'+options+'</select></div>'
  +'<button type="button" class="btn secondary sm" data-action="quote-fill-client" '+(!state.clients.length?'disabled':'')+'>'
  +icon('users')+' Uzupełnij dane klienta</button>'
  +'<button type="button" class="btn secondary sm" data-action="quote-fill-issuer" '+(!quoteLastIssuer()?'disabled':'')+'>'
  +icon('copy')+' Wstaw dane wystawiającego z ostatniego dokumentu</button>'
  +'<details class="quote-cost-helper"><summary>Materiały i koszty — podpowiedzi pozycji</summary>'
  +'<div id="quote-project-hints">'+quoteProjectHintsMarkup(p)+'</div></details></div></details>';
}


/* MANU 15.4 — bezpieczne powielanie dokumentów i ponowne wykorzystanie danych pracowni. */
function quoteCloneDraft(source){
 const projectId=state.projects.some(p=>p.id===source.projectId)?source.projectId:'';
 return {
  number:quoteNewNumber(),projectId,title:String(source.title||'Nowa wycena'),
  issuer:String(source.issuer||''),issuerContact:String(source.issuerContact||''),
  client:String(source.client||''),clientContact:String(source.clientContact||''),
  clientAddress:String(source.clientAddress||''),
  documentType:source.documentType==='offer'?'offer':'quote',
  documentStyle:source.documentStyle==='minimal'?'minimal':'classic',
  introduction:String(source.introduction||''),deliveryTerms:String(source.deliveryTerms||''),
  paymentTerms:String(source.paymentTerms||''),
  issued:localDay(),validUntil:'',notes:String(source.notes||''),
  discount:money(source.discount),
  items:(source.items||[]).map(item=>({
   id:uid(),description:String(item.description||''),quantity:Number(item.quantity)||1,
   unit:String(item.unit||'szt.'),unitPrice:money(item.unitPrice)
  }))
 };
}
function quoteLastIssuer(){
 return (state.quotes||[]).filter(q=>String(q.issuer||'').trim()||String(q.issuerContact||'').trim())
  .slice().sort((a,b)=>(b.createdAt||b.issued||'').localeCompare(a.createdAt||a.issued||''))[0]||null;
}


/* MANU 3.23.2 — krok wstecz: podgląd → edycja/kopia → ten sam podgląd.
   Dotyczy tylko dokumentów; historia kart i rozliczenia pozostają nienaruszone. */
let quoteModalReturn=null;
let quoteSubmissionPending=false;
function rememberQuotePreview(id){
 const actions=$('.quote-preview-actions'),current=$('.modal');
 quoteModalReturn=actions?.dataset?.quotePreview===id&&current
  ?{id,scrollTop:current.scrollTop||0,pageX:window.scrollX,pageY:window.scrollY}
  :null;
}
function returnToQuotePreview(){
 if(!$('#quote-form')||!quoteModalReturn)return false;
 if(manuQuoteFormHistoryActive&&!manuHandlingPopState&&window.history?.state?.manuNestedModal===1){window.history.back();return true}

 const previous=quoteModalReturn;
 quoteModalReturn=null;
 // Powrót z formularza wyceny nie powinien przywracać przewinięcia formularza
 // do podglądu ani naruszać zapamiętanej pozycji karty projektu.
 detailReturnScroll=null;
 if(!(state.quotes||[]).some(q=>q.id===previous.id)){
  closeModal();
  return true;
 }
 quotePreview(previous.id);
 const current=$('.modal');
 current?.classList?.add('quote-back-motion');
 if(current)current.scrollTop=previous.scrollTop;
 if(window.scrollX!==previous.pageX||window.scrollY!==previous.pageY)
  window.scrollTo(previous.pageX,previous.pageY);
 return true;
}

function quoteForm(projectId='',quoteId='',sourceId=''){
 const existing=(state.quotes||[]).find(q=>q.id===quoteId);
 const source=!existing&&sourceId?(state.quotes||[]).find(q=>q.id===sourceId):null;
 const p=state.projects.find(p=>p.id===(existing?.projectId||source?.projectId||projectId));
 const itemDefault=p?quoteProjectItem(p):{description:'',quantity:1,unit:'szt.',unitPrice:0};
 const q=existing||(source?quoteCloneDraft(source):{number:quoteNewNumber(),projectId:p?.id||'',title:p?.title?'Wycena — '+p.title:'Nowa wycena',client:p?.client||'',clientContact:'',clientAddress:'',documentType:'quote',documentStyle:'classic',introduction:'',deliveryTerms:'',paymentTerms:'',issued:localDay(),validUntil:'',issuer:'',issuerContact:'',notes:'',discount:0,items:[itemDefault]});
 modal(existing?'Edytuj wycenę':source?'Nowy dokument na podstawie wyceny':'Nowa wycena',`<form id="quote-form" data-id="${htmlEscape(q.projectId)}" data-quote="${htmlEscape(existing?.id||'')}">
 <p class="form-note">Wycena nie zmienia ceny projektu, kosztów ani historii wpłat. To dokument ofertowy, nie faktura.</p>
 ${source?'<p class="quote-clone-note"><strong>Nowa kopia dokumentu '+htmlEscape(source.number)+'</strong><span>Numer będzie nowy, data wystawienia jest dzisiejsza, a pole „Ważna do” wyczyszczone. Sprawdź klienta, pozycje, ceny i warunki przed zapisaniem. Oryginał nie zostanie zmieniony.</span></p>':''}
 <div class="form-cols"><div class="field"><label>Numer</label><input value="${htmlEscape(q.number)}" disabled></div><div class="field"><label>Data wystawienia *</label><input name="issued" type="date" required value="${htmlEscape(q.issued)}"></div><div class="field"><label>Ważna do</label><input name="validUntil" type="date" value="${htmlEscape(q.validUntil)}"></div><div class="field"><label>Projekt (opcjonalnie)</label><select id="quote-form-project" name="projectId"><option value="">Bez projektu</option>${state.projects.map(project=>`<option value="${htmlEscape(project.id)}" ${project.id===q.projectId?'selected':''}>${htmlEscape(project.title)}</option>`).join('')}</select></div></div>
 ${quoteAssistantMarkup(q,p)}
 <details class="quote-document-options" ${q.introduction||q.deliveryTerms||q.paymentTerms?'open':''}>
  <summary>${icon('brief')} Wygląd i treść dokumentu <span>opcjonalnie</span></summary>
  <div class="quote-document-options-body">
   <div class="form-cols"><div class="field"><label>Rodzaj dokumentu</label><select id="quote-document-type" name="documentType">
    <option value="quote" ${q.documentType!=='offer'?'selected':''}>Wycena</option>
    <option value="offer" ${q.documentType==='offer'?'selected':''}>Oferta cenowa</option>
   </select></div><div class="field"><label>Styl PDF</label><select name="documentStyle">
    <option value="classic" ${q.documentStyle!=='minimal'?'selected':''}>Klasyczny MANU — miedziane akcenty</option>
    <option value="minimal" ${q.documentStyle==='minimal'?'selected':''}>Minimalistyczny — prosty i jasny</option>
   </select></div></div>
   <div class="field"><label>Wprowadzenie / opis propozycji</label><textarea name="introduction" rows="3" maxlength="1000" placeholder="Kilka zdań o realizacji i proponowanym rozwiązaniu">${htmlEscape(q.introduction||'')}</textarea></div>
   <div class="form-cols"><div class="field"><label>Termin realizacji</label><textarea name="deliveryTerms" rows="2" maxlength="360" placeholder="Np. do 14 dni od akceptacji">${htmlEscape(q.deliveryTerms||'')}</textarea></div>
   <div class="field"><label>Warunki płatności</label><textarea name="paymentTerms" rows="2" maxlength="360" placeholder="Np. przelew po odbiorze">${htmlEscape(q.paymentTerms||'')}</textarea></div></div>
   <p class="muted tiny">Pola są opcjonalne. MANU nie wystawia faktur i nie wysyła dokumentów automatycznie.</p>
  </div>
 </details>
 <div class="field"><label>Tytuł dokumentu *</label><input name="title" required maxlength="140" value="${htmlEscape(q.title)}" placeholder="Np. Wycena indywidualnego projektu"></div>
 <div class="form-cols"><div class="field"><label>Wystawiający / pracownia</label><input name="issuer" maxlength="180" value="${htmlEscape(q.issuer)}" placeholder="Nazwa pracowni"></div><div class="field"><label>Klient</label><input name="client" maxlength="180" value="${htmlEscape(q.client)}" placeholder="Odbiorca wyceny"></div></div>
 <div class="field"><label>Kontakt wystawiającego</label><textarea name="issuerContact" rows="2" maxlength="350" placeholder="E-mail lub telefon">${htmlEscape(q.issuerContact)}</textarea></div>
 <div class="form-cols"><div class="field"><label>Kontakt klienta</label><textarea name="clientContact" rows="2" maxlength="350" placeholder="E-mail lub telefon klienta">${htmlEscape(q.clientContact||'')}</textarea></div><div class="field"><label>Adres klienta</label><textarea name="clientAddress" rows="2" maxlength="280" placeholder="Opcjonalnie">${htmlEscape(q.clientAddress||'')}</textarea></div></div>
 <div class="quote-form-head"><h3>Pozycje wyceny</h3><button type="button" class="btn secondary sm" data-action="quote-add-line">${icon('plus')} Dodaj pozycję</button></div>
 <div id="quote-lines">${(q.items.length?q.items:[itemDefault]).map(quoteItemRow).join('')}</div>
 <div class="field quote-discount-field"><label>Rabat kwotowy (zł)</label><input name="discount" type="number" min="0" step="0.01" max="100000000" value="${money(q.discount)}"></div>
 <div class="quote-form-summary"><span>Suma po rabacie</span><strong id="quote-live-total">${fMoney(quoteTotal(q))}</strong></div>
 <div class="field"><label>Warunki / uwagi</label><textarea name="notes" maxlength="900" rows="3" placeholder="Np. Termin realizacji ustalany indywidualnie">${htmlEscape(q.notes)}</textarea></div>
 <div class="modal-actions"><button type="button" class="btn ghost" data-action="quote-cancel" data-project="${htmlEscape(q.projectId)}">${quoteModalReturn?'Wróć do podglądu':'Anuluj'}</button><button class="btn" type="submit">${icon('check')} Zapisz wycenę</button></div>
 </form>`);
 if(quoteModalReturn)$('.modal')?.classList?.add('quote-back-motion');
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
  return `<article class="surface quote-list-card"><div><small>${htmlEscape(quoteDocumentLabel(q))} · ${htmlEscape(q.number)} · ${htmlEscape(q.issued)}</small><h3>${htmlEscape(q.title)}</h3><p>${htmlEscape(q.client||'Klient niepodany')}${p?' · '+htmlEscape(p.title):''}</p></div><div class="quote-list-aside"><strong>${fMoney(quoteTotal(q))}</strong><div><button type="button" class="btn secondary sm" data-action="quote-preview" data-id="${htmlEscape(q.id)}">Podgląd / PDF</button><button type="button" class="btn ghost sm" data-action="quote-edit" data-id="${htmlEscape(q.id)}">${icon('pencil')} Edytuj</button><button type="button" class="btn ghost sm" data-action="quote-delete" data-id="${htmlEscape(q.id)}" aria-label="Usuń wycenę">${icon('trash')}</button></div></div></article>`;
 }).join('');
 return `${returnToProjectsButton()}${pageHeading('Wyceny dla klientów','Przygotuj wycenę i zapisz ją jako PDF.',`<button class="btn" data-action="quote-new">${icon('plus')} Nowa wycena</button>`)}
 <div class="quote-list">${rows||'<div class="surface quote-empty"><h3>Nie masz jeszcze wycen</h3><p>Dodaj pierwszą wycenę albo rozpocznij ją ze zlecenia.</p><button class="btn" data-action="quote-new">Przygotuj wycenę</button></div>'}</div><p class="muted tiny">Wyceny są przechowywane lokalnie. Zapisuj kopie JSON w Ustawieniach. Wycena nie jest fakturą.</p>`;
}
function quoteDocument(q){
 const sub=quoteSubtotal(q),total=quoteTotal(q),discount=Math.min(sub,money(q.discount));
 const docLabel=quoteDocumentLabel(q),style=quoteDocumentStyle(q);
 const rows=q.items.map((item,i)=>`<tr><td>${i+1}</td><td class="quote-doc-description">${htmlEscape(item.description)}</td><td>${new Intl.NumberFormat('pl-PL',{maximumFractionDigits:3}).format(item.quantity)}</td><td>${htmlEscape(item.unit)}</td><td>${fMoney(item.unitPrice)}</td><td>${fMoney(item.quantity*item.unitPrice)}</td></tr>`).join('');
 return `<article class="quote-document quote-document--${style}" aria-label="${docLabel} ${htmlEscape(q.number)}">
 <header class="quote-doc-header"><div class="quote-doc-brand"><img src="manu48-mark.svg" alt="" width="45" height="45"><div><strong>MANU</strong><span>ORGANIZER TWÓRCY</span></div></div><div class="quote-doc-identity"><span>${docLabel}</span><strong>${htmlEscape(q.number)}</strong></div></header>
 <div class="quote-doc-meta"><div><small>Data wystawienia</small><b>${htmlEscape(q.issued)}</b></div><div><small>Ważna do</small><b>${htmlEscape(q.validUntil||'Do uzgodnienia')}</b></div></div>
 <div class="quote-doc-parties"><div><small>PRZYGOTOWAŁ</small><b>${htmlEscape(q.issuer||'Twórca / pracownia')}</b><p>${htmlEscape(q.issuerContact||'')}</p></div><div><small>DLA KLIENTA</small><b>${htmlEscape(q.client||'Klient')}</b><p>${htmlEscape(q.clientContact||'')}</p><p>${htmlEscape(q.clientAddress||'')}</p></div></div>
 <h2>${htmlEscape(q.title)}</h2>
 ${q.introduction?'<section class="quote-doc-intro"><h3>Opis propozycji</h3><p>'+htmlEscape(q.introduction)+'</p></section>':''}
 <table class="quote-doc-table"><thead><tr><th>Lp.</th><th>Opis pozycji</th><th>Ilość</th><th>Jedn.</th><th>Cena jedn.</th><th>Wartość</th></tr></thead><tbody>${rows}</tbody></table>
 <div class="quote-doc-totals"><div><span>Suma pozycji</span><strong>${fMoney(sub)}</strong></div>${discount>0?`<div><span>Rabat</span><strong>− ${fMoney(discount)}</strong></div>`:''}<div class="quote-doc-grand"><span>${q.documentType==='offer'?'WARTOŚĆ OFERTY':'WARTOŚĆ WYCENY'}</span><strong>${fMoney(total)}</strong></div></div>
 ${quoteDocumentTerms(q)}
 ${q.notes?`<section class="quote-doc-notes"><h3>Warunki i uwagi</h3><p>${htmlEscape(q.notes)}</p></section>`:''}
 <footer class="quote-doc-footer"><span>${q.documentType==='offer'?'Oferta cenowa':'Wycena'} nie jest fakturą ani potwierdzeniem płatności.</span><span>MANU · Organizer twórcy</span><small>Kwoty w PLN. Aplikacja nie oblicza podatku VAT — sprawdź właściwe zasady rozliczeń.</small></footer></article>`;
}
function quotePreview(id){
 quoteModalReturn=null;
 const q=(state.quotes||[]).find(q=>q.id===id);if(!q)return;
 modal((q.documentType==='offer'?'Oferta cenowa ':'Wycena ')+q.number,`<div class="quote-preview-actions" data-quote-preview="${htmlEscape(q.id)}"><button type="button" class="btn" data-action="quote-print" data-id="${htmlEscape(q.id)}">${icon('download')} Drukuj / zapisz PDF</button><button type="button" class="btn secondary" data-action="quote-edit" data-id="${htmlEscape(q.id)}">${icon('pencil')} Edytuj</button><button type="button" class="btn secondary" data-action="quote-clone" data-id="${htmlEscape(q.id)}">${icon('copy')} Powiel dokument</button><button type="button" class="btn ghost" data-action="close">Zamknij</button></div><p class="muted small">Na telefonie w systemowym oknie drukowania wybierz „Zapisz jako PDF”.</p><div class="quote-preview-paper">${quoteDocument(q)}</div>`,{detail:true,projectId:q.projectId});
}
function projectsPage(){return `${returnToHomeButton('projects')}${pageHeading('Projekty i warsztaty','Wszystkie realizacje, klienci, koszty i terminy.',`<div class="quote-project-actions project-primary-actions"><button type="button" class="btn" data-action="new-project">${icon('plus')} Dodaj projekt</button><button type="button" class="btn secondary" data-action="nav" data-view="clients">${icon('users')} Klienci</button><details class="project-tools-more"${projectToolsExpanded?' open':''}><summary class="btn secondary" aria-label="Pokaż dodatkowe narzędzia">${icon('copy')} Więcej narzędzi <span class="project-tools-chevron" aria-hidden="true">⌄</span></summary><div class="project-tools-panel"><button type="button" class="btn secondary" data-action="nav" data-view="gallery">${icon('folder')} Galeria realizacji</button><button type="button" class="btn secondary" data-action="nav" data-view="templates">${icon('copy')} Szablony projektów</button><button type="button" class="btn secondary" data-action="nav" data-view="quotes">${icon('brief')} Wyceny</button></div></details></div>`)}<div class="toolbar"><input class="search" id="search-projects" placeholder="Szukaj nazwy lub klienta…" value="${htmlEscape(search)}" aria-label="Wyszukaj projekt"><select id="project-filter" class="select"><option value="all" ${filter==='all'?'selected':''}>Wszystkie typy</option><option value="Zlecenie" ${filter==='Zlecenie'?'selected':''}>Zlecenia</option><option value="Warsztat" ${filter==='Warsztat'?'selected':''}>Warsztaty</option></select></div><div id="project-list" class="projects-grid">${renderProjectGrid()}</div>`;}

/* MANU 3.4.0 — lokalna księga klientów, zapisywana razem z projektami i wycenami. */
function linkedProjects(clientId){
 return state.projects.filter(p=>p.clientId===clientId)
  .sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||''));
}
function clientNumbers(clientId){
 const projects=linkedProjects(clientId),billable=projects.filter(p=>p.status!=='Anulowane');
 return {
  projects,
  value:money(billable.reduce((n,p)=>n+projectIncome(p),0)),
  paid:money(billable.reduce((n,p)=>n+projectPaid(p),0))
 };
}
function clientsPage(){
 const count=state.clients.length;
 const linkedClientIds=new Set(state.clients.map(c=>c.id));
 const legacy=state.projects.filter(p=>!p.clientId&&String(p.client||'').trim()).length;
 return returnToProjectsButton()+pageHeading('Baza klientów','Kontakty, historia współpracy oraz rozliczenia w jednym miejscu.',
   '<div class="crm-page-actions">'+
   '<button type="button" class="btn" data-action="client-new">'+icon('plus')+' Nowy klient</button></div>')+
   '<div class="crm-summary">'+
    '<div><small>Karty klientów</small><strong>'+count+'</strong></div>'+
    '<div><small>Przypisane realizacje</small><strong>'+state.projects.filter(p=>p.clientId&&linkedClientIds.has(p.clientId)).length+'</strong></div>'+
   '</div>'+
   '<div class="crm-toolbar"><input class="search" id="client-search" aria-label="Szukaj klienta" placeholder="Szukaj klienta, firmy, e-maila…" value="'+htmlEscape(clientSearch)+'"></div>'+
   (legacy?'<div class="crm-import-hint"><p>Masz '+legacy+' projektów z wpisaną nazwą klienta, ale bez powiązanej karty.</p>'+
    '<button type="button" class="btn secondary sm" data-action="client-import">Utwórz i powiąż karty z istniejących projektów</button>'+
    '<small>Zostaną pobrane tylko nazwy klientów z projektów, bez zmiany kwot i terminów. Przed wykonaniem potwierdzisz operację.</small></div>':'')+
   '<div class="crm-list" id="client-list">'+renderClientList()+'</div>'+
   '<p class="muted tiny">Dane klientów są zapisywane w kopii MANU i na Twoim koncie w chmurze, jeśli synchronizacja jest aktywna. Wpisuj tylko niezbędne dane osobowe.</p>';
}
function filteredClients(){
 const query=clientSearch.trim().toLocaleLowerCase('pl');
 return state.clients.filter(c=>!query||[c.name,c.company,c.email,c.phone].some(x=>String(x||'').toLocaleLowerCase('pl').includes(query)))
  .sort((a,b)=>a.name.localeCompare(b.name,'pl'));
}
function renderClientList(offset=0){
 const records=filteredClients();
 if(!records.length){
  const searched=clientSearch.trim();
  return '<div class="crm-empty"><h3>'+(searched?'Nie znaleziono klienta':'Twoja baza klientów jest pusta')+'</h3>'+
   '<p>'+(searched?'Spróbuj innego wyszukiwania.':'Dodaj pierwszą kartę klienta lub powiąż istniejące projekty.')+'</p>'+
   (!searched?'<button type="button" class="btn" data-action="client-new">'+icon('plus')+' Dodaj klienta</button>':'')+'</div>';
 }
 // Jedno przejście przez projekty zamiast oddzielnego skanowania ich dla każdej karty klienta.
 const summaries=new Map();
 for(const p of state.projects){
  if(!p.clientId)continue;
  let row=summaries.get(p.clientId);
  if(!row){row={count:0,value:0};summaries.set(p.clientId,row);}
  row.count++;
  if(p.status!=='Anulowane')row.value+=projectIncome(p);
 }
 const cards=records.slice(offset,listVisible.clients).map(c=>{
  const stats=summaries.get(c.id)||{count:0,value:0};
  return '<article class="crm-client-card">'+
   '<div class="crm-card-main"><span class="crm-avatar" aria-hidden="true">'+htmlEscape(c.name.slice(0,1).toUpperCase())+'</span>'+
   '<div><h3>'+htmlEscape(c.name)+'</h3>'+(c.company?'<p>'+htmlEscape(c.company)+'</p>':'')+
   (c.phone?'<small>'+htmlEscape(c.phone)+'</small>':'')+'</div></div>'+
   '<div class="crm-card-bottom"><span>'+stats.count+' projektów · '+fMoney(stats.value)+' wartości</span>'+
   '<button type="button" class="btn secondary sm" data-action="open-client" data-id="'+htmlEscape(c.id)+'">Otwórz kartę '+icon('arrow')+'</button></div>'+
   '</article>';
 }).join('');
 return cards+nextListButton('clients',Math.min(listVisible.clients,records.length),records.length);
}

function clientForm(c){
 const item=c||{id:'',name:'',company:'',email:'',phone:'',address:'',notes:''};
 const fields=[
  ['name','Nazwa klienta / imię i nazwisko *','text',120],
  ['company','Firma / marka','text',120],
  ['email','E-mail','email',180],
  ['phone','Telefon','tel',50],
  ['address','Adres / miejsce kontaktu','text',280]
 ];
 let html='<form id="client-form" data-id="'+htmlEscape(item.id)+'">'+
  '<p class="muted small">Podaj tylko informacje potrzebne do realizacji zleceń.</p>';
 for(const [field,label,type,length] of fields){
  html+='<div class="field"><label>'+label+'</label><input name="'+field+'" type="'+type+'" maxlength="'+length+'" '+
   (field==='name'?'required ':'')+'value="'+htmlEscape(item[field]||'')+'"></div>';
 }
 html+='<div class="field"><label>Notatki o współpracy</label><textarea name="notes" maxlength="2500" rows="4">'+htmlEscape(item.notes||'')+'</textarea></div>'+
  '<div class="modal-actions"><button type="button" class="btn ghost" data-action="close">Anuluj</button>'+
  '<button type="submit" class="btn">'+icon('check')+' Zapisz klienta</button></div></form>';
 modal(c?'Edytuj klienta':'Nowa karta klienta',html);
}
function clientDetail(id){
 const c=state.clients.find(x=>x.id===id);
 if(!c)return;
 const stats=clientNumbers(id);
 const contact=[
  c.company?'<div><small>Firma / marka</small><strong>'+htmlEscape(c.company)+'</strong></div>':'',
  c.email?'<div><small>E-mail</small><strong>'+htmlEscape(c.email)+'</strong></div>':'',
  c.phone?'<div><small>Telefon</small><strong>'+htmlEscape(c.phone)+'</strong></div>':'',
  c.address?'<div><small>Adres</small><strong>'+htmlEscape(c.address)+'</strong></div>':''
 ].join('');
 const history=stats.projects.length?stats.projects.map(p=>
   '<div class="crm-history-row"><div><strong>'+htmlEscape(p.title)+'</strong><small>'+htmlEscape(p.type)+' · '+htmlEscape(p.status)+' · '+fDate(p.date)+'</small></div>'+
   '<div class="crm-history-right"><b>'+fMoney(projectIncome(p))+'</b><button type="button" class="btn secondary sm" data-action="open-project" data-id="'+htmlEscape(p.id)+'">Szczegóły</button></div></div>'
 ).join(''):'<p class="muted small">Brak przypisanych projektów. Dodaj realizację z tej karty lub połącz istniejące zlecenie w jego edycji.</p>';
 modal(c.name,
  '<div class="crm-detail"><div class="crm-detail-actions">'+
  '<button type="button" class="btn secondary sm" data-action="client-edit" data-id="'+htmlEscape(c.id)+'">'+icon('pencil')+' Edytuj</button>'+
  '<button type="button" class="btn ghost sm" data-action="client-delete" data-id="'+htmlEscape(c.id)+'">'+icon('trash')+' Usuń kartę</button></div>'+
  '<div class="crm-contact">'+(contact||'<p class="muted small">Brak dodatkowych danych kontaktowych.</p>')+'</div>'+
  (c.notes?'<div class="crm-notes"><h3>Notatki</h3><p>'+htmlEscape(c.notes)+'</p></div>':'')+
  '<div class="crm-totals"><div><small>Realizacje</small><strong>'+stats.projects.length+'</strong></div>'+
  '<div><small>Wartość zleceń</small><strong>'+fMoney(stats.value)+'</strong></div>'+
  '<div><small>Otrzymane wpłaty</small><strong>'+fMoney(stats.paid)+'</strong></div>'+
  '<div><small>Pozostało do zapłaty</small><strong>'+fMoney(Math.max(0,stats.value-stats.paid))+'</strong></div></div>'+
  '<div class="crm-detail-history"><div class="section-head"><h3>Historia współpracy</h3>'+
  '<button type="button" class="btn sm" data-action="client-new-project" data-id="'+htmlEscape(c.id)+'">'+icon('plus')+' Nowy projekt</button></div>'+
  history+'</div></div>',
 {detail:true});
}
function deleteClient(id){
 const c=state.clients.find(x=>x.id===id);
 if(!c)return;
 const linked=linkedProjects(id);
 if(!confirm('Usunąć kartę „'+c.name+'”? '+(linked.length?'Powiązania z '+linked.length+' projektami zostaną usunięte, ale same projekty i wpłaty pozostaną.':'Projekty nie zostaną usunięte.')))return;
 state.clients=state.clients.filter(x=>x.id!==id);
 for(const p of state.projects)if(p.clientId===id)p.clientId='';
 closeModal();afterDataChange('Usunięto kartę klienta; historia projektów została zachowana.');
}
function importLegacyClients(){
 const list=state.projects.filter(p=>!p.clientId&&String(p.client||'').trim());
 if(!list.length){toast('Nie ma projektów do powiązania.');return;}
 if(!confirm('Utworzyć karty klientów na podstawie '+list.length+' istniejących projektów i przypisać do nich realizacje? Nazwy takie same zostaną połączone. Projekty, finanse i uczestnicy pozostaną bez zmian.'))return;
 const byName=new Map(state.clients.map(c=>[c.name.toLocaleLowerCase('pl'),c]));
 let made=0,linked=0;
 for(const p of list){
  const name=String(p.client||'').trim().slice(0,120);
  if(!name)continue;
  const key=name.toLocaleLowerCase('pl');
  let c=byName.get(key);
  if(!c){
   if(state.clients.length>=5000){toast('Osiągnięto limit klientów.');break;}
   c={id:uid(),name,company:'',email:'',phone:'',address:'',notes:'',createdAt:now()};
   state.clients.push(c);byName.set(key,c);made++;
  }
  p.clientId=c.id;p.client=c.name;linked++;
 }
 afterDataChange('Dodano '+made+' kart klientów i powiązano '+linked+' projektów.');
}
function templatesPage(){
 return returnToProjectsButton()+(window.MANUTemplates?.page?.()||'<p>Moduł szablonów nie jest dostępny. Odśwież aplikację.</p>');
}
function galleryPage(){
 return returnToProjectsButton()+pageHeading('Galeria realizacji','Fotografie Twoich projektów: przed, po i gotowe prace.')+
  (window.MANUGallery?.overview?.(state.projects)||'');
}
function filteredProjects(){
 const query=search.toLocaleLowerCase('pl').trim();
 return state.projects.filter(p=>(filter==='all'||p.type===filter)&&
  (!query||[p.title,p.client,p.organizer,p.notes].some(x=>String(x||'').toLocaleLowerCase('pl').includes(query))))
  .sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||''));
}
function renderProjectGrid(offset=0){
 const list=filteredProjects();
 if(!list.length)return `<div style="grid-column:1/-1">${empty('Brak projektów','Dodaj pierwszą realizację albo zmień filtr.',`<button class="btn sm" data-action="new-project">Dodaj projekt</button>`)}</div>`;
 return list.slice(offset,listVisible.projects).map(projectCard).join('')+nextListButton('projects',Math.min(listVisible.projects,list.length),list.length);
}

function projectCard(p){let expense=expenses(p);return `<article class="project-card" data-action="open-project" data-id="${htmlEscape(p.id)}" role="button" tabindex="0"><div class="pcard-head">${projectTypeIcon(p)}${pillStatus(p)}</div><h3>${htmlEscape(p.title)}</h3><div class="project-progress"><span>Postęp</span><strong>${progressPercent(p)}%</strong><div class="workflow-bar"><span style="width:${progressPercent(p)}%"></span></div></div><p>${htmlEscape(p.type==='Warsztat'?[p.client?'Klient: '+p.client:'',p.organizer?'Organizator: '+p.organizer:''].filter(Boolean).join(' · ')||'Bez klienta / organizatora':p.client||'Bez klienta')} · ${fDate(p.date)}</p><div class="pcard-metrics"><div><small>Wartość</small><b>${fMoney(projectIncome(p))}</b></div><div><small>Koszty</small><b>${fMoney(expense)}</b></div><div><small>Po kosztach</small><b class="${profit(p)>=0?'money-positive':'money-negative'}">${fMoney(profit(p))}</b></div></div><div class="pcard-footer"><span>${icon('clock')} ${fNum(p.hours)} godz. pracy</span><span>${p.type==='Warsztat'?`${confirmedParticipants(p).length}/${p.capacity||'∞'} miejsc${waitlistedParticipants(p).length?' · '+waitlistedParticipants(p).length+' rezerwowych':''}`:`Wpłacono ${fMoney(projectPaid(p))}`}</span></div></article>`;}
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

/* Etap 10.1 — odczytowe porównanie rentowności pracy, bez zmian projektów. */
function profitabilityData(scope='all'){
 const list=active().filter(p=>scope==='Zlecenie'||scope==='Warsztat'?p.type===scope:true);
 const timed=list.filter(p=>val(p.hours)>0);
 const totalHours=timed.reduce((sum,p)=>sum+val(p.hours),0);
 const timedProfit=timed.reduce((sum,p)=>sum+profit(p),0);
 const result=timed.map(p=>({
  project:p,hours:val(p.hours),income:projectIncome(p),
  costs:expenses(p),net:profit(p),rate:profit(p)/val(p.hours),
  margin:projectIncome(p)>0?profit(p)/projectIncome(p)*100:null
 })).sort((a,b)=>b.rate-a.rate||b.net-a.net||a.project.title.localeCompare(b.project.title,'pl'));
 return {list,timed,totalHours,timedProfit,rate:totalHours>0?timedProfit/totalHours:null,result};
}
function profitabilityTypeCard(type){
 const d=profitabilityData(type);
 return '<div class="profitability-type-card"><span>'+htmlEscape(type==='Warsztat'?'Warsztaty':'Zlecenia')+'</span>'+
 '<strong>'+d.list.length+' <small>realizacji</small></strong>'+
 '<div class="profitability-type-rate">'+(d.rate==null?'—':fMoney(d.rate))+' <small>/ godz.</small></div>'+
 '<small>Uzupełniony czas: '+d.timed.length+' z '+d.list.length+'</small></div>';
}
function profitabilityResults(scope=profitabilityScope){
 const d=profitabilityData(scope);
 const missing=d.list.length-d.timed.length;
 const typeCards=scope==='all'?'<div class="profitability-types">'+profitabilityTypeCard('Zlecenie')+profitabilityTypeCard('Warsztat')+'</div>':'';
 const rows=d.result.slice(0,10).map((r,i)=>
  '<button type="button" class="profitability-rank-item" data-action="open-project" data-id="'+htmlEscape(r.project.id)+'">'+
   '<span class="profitability-rank-number">'+(i+1)+'</span>'+
   '<span class="profitability-rank-copy"><strong>'+htmlEscape(r.project.title)+'</strong>'+
   '<small>'+htmlEscape(r.project.type)+' · '+htmlEscape(r.project.status)+' · '+fHours(r.hours)+' godz. pracy</small>'+
   '<small>Wartość '+fMoney(r.income)+' · koszty '+fMoney(r.costs)+' · po kosztach '+fMoney(r.net)+'</small></span>'+
   '<span class="profitability-rank-rate'+(r.rate<0?' is-negative':'')+'"><b>'+fMoney(r.rate)+'</b><small>/ godz.</small></span>'+
  '</button>'
 ).join('');
 return '<div class="profitability-stats">'+
  '<div><small>Realizacje</small><strong>'+d.list.length+'</strong></div>'+
  '<div><small>Z zapisanym czasem</small><strong>'+d.timed.length+'</strong></div>'+
  '<div><small>Wynik / godz. pracy</small><strong class="'+(d.rate!=null&&d.rate<0?'money-negative':'')+'">'+(d.rate==null?'—':fMoney(d.rate))+'</strong></div>'+
 '</div>'+typeCards+
 '<h3>Porównanie według wyniku na godzinę</h3>'+
 (rows?'<div class="profitability-rank">'+rows+'</div>'+
   (d.result.length>10?'<p class="muted tiny">Pokazano 10 pierwszych z '+d.result.length+' realizacji z wpisanym czasem.</p>':''):
  '<p class="profitability-empty">'+(d.list.length?'Brak porównywalnych projektów. Uzupełnij przepracowane godziny w kartach realizacji.':'Nie masz jeszcze realizacji w wybranej kategorii.')+'</p>')+
 (missing?'<p class="profitability-hint"><strong>'+missing+' realizacji bez zapisanego czasu pracy.</strong> Nie uwzględniamy ich w rankingu ani w średniej za godzinę. <button type="button" data-action="nav" data-view="projects">Przejdź do projektów</button></p>':'')+
 comparisonMarkup(scope)+costCategoryPanel(scope)+
 '<p class="muted tiny profitability-disclaimer">Wynik na godzinę = (wartość realizacji − ujęte koszty) ÷ zapisane godziny. Średnia jest ważona czasem pracy i obejmuje wyłącznie realizacje z wpisanymi godzinami. Nie jest to stawka brutto/netto z umowy ani wynik księgowy. Wartość nie oznacza, że klient już zapłacił. Pominięto anulowane projekty; nie ujęto podatków, kosztów stałych ani brakujących wydatków.</p>';
}

/* Etap 10.2: porównanie realizacji na żywo, bez zapisywania dodatkowych danych. */
function comparisonProjects(scope=profitabilityScope){
 return active().filter(p=>scope==='Zlecenie'||scope==='Warsztat'?p.type===scope:true)
  .sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||'')||a.title.localeCompare(b.title,'pl'));
}
function comparisonSelection(scope=profitabilityScope){
 const choices=comparisonProjects(scope);
 if(!choices.length)return {choices,left:null,right:null};
 const left=choices.find(p=>p.id===compareLeftId)||choices[0];
 const right=choices.find(p=>p.id===compareRightId&&(p.id!==left.id))||choices.find(p=>p.id!==left.id)||null;
 return {choices,left,right};
}
function comparisonMetrics(p){
 const recordedCosts=projectActualCost(p),plannedTravel=estimatedTravelApplied(p);
 const plannedHours=val(p.estimatedHours),realHours=val(p.hours);
 const costs=expenses(p),value=projectIncome(p);
 const plannedMaterial=money(p.estimatedMaterials),declaredTravel=travelCost(p);
 const planPresent=plannedMaterial>0||declaredTravel>0;
 return {
  value,paid:projectPaid(p),recordedCosts,plannedTravel,costs,result:profit(p),
  plan:planPresent?projectPlannedCost(p):null,
  plannedHours:plannedHours>0?plannedHours:null,
  hours:realHours>0?realHours:null,
  hourDelta:plannedHours>0&&realHours>0?realHours-plannedHours:null,
  hourly:realHours>0?profit(p)/realHours:null,
  costsPerHour:realHours>0?costs/realHours:null
 };
}
function comparisonFormat(value,kind,delta=false){
 if(value==null)return '—';
 if(kind==='hours')return (delta&&value>0?'+':'')+fHours(value)+' godz.';
 return fMoney(value);
}
function comparisonRow(label,a,b,kind='money',delta=false){
 const valueA=comparisonFormat(a,kind,delta),valueB=comparisonFormat(b,kind,delta);
 const isBad=v=>delta&&v!=null&&v>0||(label==='Wynik po kosztach'||label==='Wynik na godzinę')&&v!=null&&v<0;
 return '<div class="comparison-metric-row">'+
  '<span class="comparison-metric-label">'+htmlEscape(label)+'</span>'+
  '<span class="comparison-metric-value'+(isBad(a)?' comparison-is-negative':'')+'">'+htmlEscape(valueA)+'</span>'+
  '<span class="comparison-metric-value'+(isBad(b)?' comparison-is-negative':'')+'">'+htmlEscape(valueB)+'</span></div>';
}
function comparisonResults(scope=profitabilityScope){
 const {left,right}=comparisonSelection(scope);
 if(!left||!right)return '<p class="comparison-empty">Dodaj co najmniej dwie nieanulowane realizacje w tej kategorii, aby je porównać.</p>';
 if(left.id===right.id)return '<p class="comparison-empty">Wybierz dwa różne projekty.</p>';
 const a=comparisonMetrics(left),b=comparisonMetrics(right);
 return '<div class="comparison-project-links">'+
  '<button type="button" data-action="open-project" data-id="'+htmlEscape(left.id)+'">'+htmlEscape(left.title)+' '+icon('arrow')+'</button>'+
  '<button type="button" data-action="open-project" data-id="'+htmlEscape(right.id)+'">'+htmlEscape(right.title)+' '+icon('arrow')+'</button></div>'+
 '<div class="comparison-table" aria-label="Porównanie dwóch realizacji">'+
  comparisonRow('Wartość projektu',a.value,b.value)+
  comparisonRow('Otrzymane wpłaty',a.paid,b.paid)+
  comparisonRow('Planowane koszty*',a.plan,b.plan)+
  comparisonRow('Wpisane wydatki',a.recordedCosts,b.recordedCosts)+
  comparisonRow('Szacowany dojazd w kosztach',a.plannedTravel,b.plannedTravel)+
  comparisonRow('Koszty ujęte w wyniku',a.costs,b.costs)+
  comparisonRow('Wynik po kosztach',a.result,b.result)+
  comparisonRow('Planowany czas',a.plannedHours,b.plannedHours,'hours')+
  comparisonRow('Zapisany czas',a.hours,b.hours,'hours')+
  comparisonRow('Różnica czasu względem planu',a.hourDelta,b.hourDelta,'hours',true)+
  comparisonRow('Wynik na godzinę',a.hourly,b.hourly)+
 '</div>'+
 '<p class="muted tiny comparison-disclaimer">* Plan kosztów obejmuje szacowane materiały i dojazd, jeżeli je wpisano. Jest pokazywany osobno, nie dolicza się go ponownie do kosztów ujętych w wyniku. Wpisane wydatki zawierają faktyczny dojazd. Szacowany dojazd jest doliczany tylko wtedy, gdy nie ma wpisanego wydatku na dojazd. „—” oznacza brak danych do porównania. Kwoty przed podatkami i kosztami stałymi.</p>';
}
function comparisonCriticalStyle(){
 // Zabezpieczenie wyglądu przy przejściowo nieodświeżonym CSS aplikacji PWA.
 return '<style id="manu-comparison-critical-css">'+
 '.open-notebook details.profitability-compare{display:block;border:1px solid #cda989;border-radius:12px;background:#f7eddf;margin:17px 0;overflow:hidden;color:#4e3a2d}'+
 '.open-notebook .profitability-compare>summary.profitability-compare-summary{display:grid!important;grid-template-columns:minmax(0,1fr) 18px;align-items:center;gap:9px;list-style:none!important;padding:14px 11px;cursor:pointer}'+
 '.open-notebook .profitability-compare>summary::-webkit-details-marker{display:none!important}'+
 '.open-notebook .profitability-compare>summary::marker{content:""!important;font-size:0}'+
 '.open-notebook .comparison-summary-copy{display:flex!important;flex-direction:column;gap:4px;min-width:0}'+
 '.open-notebook .comparison-summary-copy strong{display:flex;align-items:center;gap:7px;font:600 18px/1.3 Georgia,serif;color:#65442f}'+
 '.open-notebook .comparison-summary-copy small{font:400 11px/1.4 Arial,sans-serif;color:#816b59}'+
 '.open-notebook .profitability-compare-body{padding:12px 10px;border-top:1px solid #d9bda2}'+
 '.open-notebook .comparison-selectors{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:0 0 14px}'+
 '.open-notebook .comparison-selectors label{min-width:0;display:flex;flex-direction:column;gap:5px;color:#604631;font-size:11px}'+
 '.open-notebook .comparison-selectors select{width:100%;min-width:0;padding:10px 7px;border:1px solid #c7a485;border-radius:8px;background:#fbf4e8;color:#4a3229}'+
 '.open-notebook .comparison-project-links{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:9px}'+
 '.open-notebook .comparison-project-links button{min-width:0;border:1px solid #d2b293;border-radius:8px;background:#efdfca;color:#69462f;padding:9px;text-align:left;overflow-wrap:anywhere}'+
 '.open-notebook .comparison-table{overflow:hidden;border:1px solid #d1b092;border-radius:9px;background:#f9efe3}'+
 '.open-notebook .comparison-metric-row{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr) minmax(0,1fr);gap:7px;align-items:center;padding:10px 8px;border-bottom:1px solid #e0cbb4}'+
 '.open-notebook .comparison-metric-row:nth-child(even){background:#f0e1cf}'+
 '.open-notebook .comparison-metric-label{color:#725640;font-size:11px;overflow-wrap:anywhere}'+
 '.open-notebook .comparison-metric-value{text-align:right;color:#573d2d;font-size:12px;font-weight:650;overflow-wrap:anywhere}'+
 '.open-notebook .comparison-is-negative{color:#b45549!important}'+
 '.open-notebook .comparison-empty{padding:12px;background:#f0e1d0;border:1px dashed #c6a48b;color:#70533d}'+
 '@media(max-width:520px){.open-notebook .comparison-metric-row{gap:5px;padding:9px 6px}.open-notebook .comparison-metric-label{font-size:10px}.open-notebook .comparison-metric-value{font-size:11px}.open-notebook .comparison-selectors{gap:7px}}'+
 '@media(max-width:380px){.open-notebook .comparison-selectors{grid-template-columns:1fr}}'+
 '</style>';
}
function comparisonMarkup(scope=profitabilityScope){
 const selection=comparisonSelection(scope),{choices,left,right}=selection;
 const optionRows=selected=>choices.map(p=>'<option value="'+htmlEscape(p.id)+'"'+(selected?.id===p.id?' selected':'')+'>'+htmlEscape(p.title)+' · '+htmlEscape(p.type)+'</option>').join('');
 return comparisonCriticalStyle()+'<details class="profitability-compare" '+(compareExpanded?'open':'')+'>'+
 '<summary class="profitability-compare-summary"><span class="comparison-summary-copy"><strong>'+icon('scale')+' Porównaj dwie realizacje</strong>'+
 '<small>Wartość, koszty, plan i przepracowane godziny</small></span>'+
 '<span class="profitability-panel-chevron" aria-hidden="true">⌄</span></summary>'+
 '<div class="profitability-compare-body">'+
 '<div class="comparison-selectors"><label>Pierwsza realizacja<select id="compare-project-left" '+(!left?'disabled':'')+'>'+optionRows(left)+'</select></label>'+
 '<label>Druga realizacja<select id="compare-project-right" '+(!right?'disabled':'')+'>'+optionRows(right)+'</select></label></div>'+
 '<div id="comparison-results">'+comparisonResults(scope)+'</div></div></details>';
}
function costCategoryData(scope=profitabilityScope){
 const projects=active().filter(p=>(scope==='Warsztat'||scope==='Zlecenie')?p.type===scope:true);
 const ids=['materialy','uslugi','dojazd','inne'];
 const amounts=Object.fromEntries(ids.map(id=>[id,0]));
 let estimatedTravel=0;
 const totals=projects.map(p=>{
  for(const e of p.expenses||[])amounts[validExpenseCategory(e.category)]+=money(e.amount);
  const travel=estimatedTravelApplied(p);
  amounts.dojazd+=travel;estimatedTravel+=travel;
  return {p,total:expenses(p)};
 });
 const total=money(totals.reduce((n,x)=>n+x.total,0));
 const labels={materialy:'Materiały',uslugi:'Usługi i podwykonawcy',dojazd:'Dojazd',inne:'Pozostałe'};
 const categories=ids.map(id=>({id,label:labels[id],amount:money(amounts[id]),percent:total>0?Math.max(0,Math.min(100,100*amounts[id]/total)):0})).sort((a,b)=>b.amount-a.amount);
 return {total,categories,projects,estimatedTravel:money(estimatedTravel),totals:totals.sort((a,b)=>b.total-a.total)};
}
function costCategoryPanel(scope=profitabilityScope){
 const d=costCategoryData(scope);
 const bars=d.categories.map(x=>'<div class="cost-category-item"><div class="cost-category-caption"><strong>'+htmlEscape(x.label)+'</strong><span>'+fMoney(x.amount)+' <small>('+Math.round(x.percent)+'%)</small></span></div><div class="cost-category-track"><i style="width:'+x.percent.toFixed(2)+'%"></i></div></div>').join('');
 const top=d.totals.filter(x=>x.total>0).slice(0,5).map(x=>'<button class="cost-category-project" type="button" data-action="open-project" data-id="'+htmlEscape(x.p.id)+'"><span>'+htmlEscape(x.p.title)+'</span><b>'+fMoney(x.total)+'</b></button>').join('');
 return '<details class="cost-category-panel" '+(costBreakdownExpanded?'open':'')+'>'+
 '<summary class="cost-category-summary"><span><strong>'+icon('wallet')+' Struktura kosztów</strong><small>Materiały, usługi, dojazd i pozostałe wydatki</small></span><em>'+fMoney(d.total)+'</em><span class="cost-category-chevron" aria-hidden="true">⌄</span></summary>'+
 '<div class="cost-category-body">'+(d.total>0?bars:'<p class="muted small">Brak wpisanych kosztów w wybranych realizacjach.</p>')+
 (d.estimatedTravel>0?'<p class="cost-category-estimate">W tym szacowany dojazd: <strong>'+fMoney(d.estimatedTravel)+'</strong>.</p>':'')+
 (top?'<h4>Realizacje z największymi kosztami</h4><div class="cost-category-projects">'+top+'</div>':'')+
 '<p class="muted tiny">Łączne koszty '+d.projects.length+' nieanulowanych realizacji. Szacowany dojazd jest zastępowany wydatkiem faktycznym, jeśli go wpisano. Szacunkowe materiały nie są dodawane do poniesionych wydatków. To kwoty orientacyjne, bez podatków i kosztów stałych.</p></div></details>';
}
function profitabilityPanel(){
 const d=profitabilityData();
 return '<details class="profitability-panel" '+(profitabilityExpanded?'open':'')+'>'+
 '<summary class="profitability-panel-summary"><span class="profitability-panel-icon">'+icon('trend')+'</span>'+
 '<span class="profitability-panel-name"><strong>Analiza opłacalności</strong>'+
 '<small>'+d.timed.length+' realizacji z zapisanym czasem pracy · porównanie zleceń i warsztatów</small></span>'+
 '<span class="profitability-panel-chevron" aria-hidden="true">⌄</span></summary>'+
 '<div class="profitability-panel-body"><p class="profitability-intro">Sprawdź, które prace najbardziej opłacają się w przeliczeniu na godzinę, a nie tylko na cenę zlecenia.</p>'+
 '<label class="profitability-filter" for="profitability-type">Pokaż realizacje'+
 '<select id="profitability-type" aria-label="Filtr typu realizacji">'+
 '<option value="all" '+(profitabilityScope==='all'?'selected':'')+'>Wszystkie</option>'+
 '<option value="Zlecenie" '+(profitabilityScope==='Zlecenie'?'selected':'')+'>Zlecenia</option>'+
 '<option value="Warsztat" '+(profitabilityScope==='Warsztat'?'selected':'')+'>Warsztaty</option></select></label>'+
 '<div id="profitability-results">'+profitabilityResults()+'</div></div></details>';
}

/* Etap 15.3 — odczytowe zestawienie należności bez nowej bazy ani zmian wpłat. */
function paymentControlData(today=localDay()){
 const sevenDays=plusDaysDate(today,7);
 const rows=[];
 let received=0,advance=0,remaining=0,overdue=0;
 for(const p of active()){
  const participantsMode=p.type==='Warsztat'&&p.financeMode==='participants';
  const history=participantsMode
   ?confirmedParticipants(p).flatMap(person=>person.payments||[])
   :(p.payments||[]);
  const projectAdvance=money(history.reduce((n,item)=>n+(item.kind==='zaliczka'?money(item.amount):0),0));
  const income=projectIncome(p),paid=projectPaid(p),unpaid=money(Math.max(0,income-paid));
  const due=validDate(p.paymentDue);
  const status=!due?'none':due<today?'late':due===today?'today':due<=sevenDays?'soon':'later';
  received+=paid;advance+=projectAdvance;remaining+=unpaid;
  if(unpaid<=0)continue;
  if(status==='late')overdue+=unpaid;
  rows.push({id:p.id,title:p.title,client:p.client||'',type:p.type,
   paid,advance:projectAdvance,unpaid,due,status,participantsMode});
 }
 const rank={late:0,today:1,soon:2,later:3,none:4};
 rows.sort((a,b)=>rank[a.status]-rank[b.status]
  ||(a.due||'9999-12-31').localeCompare(b.due||'9999-12-31')
  ||a.title.localeCompare(b.title,'pl'));
 return {rows,received:money(received),advance:money(advance),
  remaining:money(remaining),overdue:money(overdue)};
}
function paymentControlRows(filter=paymentControlFilter,visible=paymentControlVisible){
 const data=paymentControlData();
 const options=['all','late','soon','none'];
 const kind=options.includes(filter)?filter:'all';
 const filtered=data.rows.filter(row=>kind==='all'
  ||(kind==='late'&&row.status==='late')
  ||(kind==='soon'&&['today','soon'].includes(row.status))
  ||(kind==='none'&&row.status==='none'));
 const statusNames={late:'Po terminie',today:'Termin dzisiaj',
  soon:'W ciągu 7 dni',later:'Późniejszy termin',none:'Bez terminu'};
 const list=filtered.slice(0,visible).map(row=>{
  const rowId=htmlEscape(row.id);
  return '<article class="payment-control-item'+(row.status==='late'?' payment-control-item--late':'')+'">'
   +'<div class="payment-control-info"><strong>'+htmlEscape(row.title)+'</strong>'
   +'<small>'+htmlEscape(row.type)+(row.client?' · '+htmlEscape(row.client):'')+'</small>'
   +'<span class="payment-control-date">'+htmlEscape(statusNames[row.status])
   +(row.due?' · '+htmlEscape(fDate(row.due)):'')+'</span></div>'
   +'<div class="payment-control-money"><div><small>Wpłacono</small><b>'+fMoney(row.paid)+'</b></div>'
   +'<div><small>Do otrzymania</small><strong>'+fMoney(row.unpaid)+'</strong></div>'
   +(row.advance>0?'<small>Zaliczki w historii: '+fMoney(row.advance)+'</small>':'')+'</div>'
   +'<div class="payment-control-actions">'
   +'<button type="button" class="btn secondary sm" data-action="payment-control-open" data-id="'+rowId+'">'
   +(row.participantsMode?'Uczestnicy i wpłaty':'Otwórz rozliczenie')+'</button>'
   +(row.participantsMode?'':'<button type="button" class="btn sm" data-action="payment-add" data-id="'+rowId+'">Dodaj wpłatę</button>')
   +'</div></article>';
 }).join('');
 const button=filtered.length>visible
  ?'<button type="button" class="btn secondary sm payment-control-more" data-action="payment-control-more">'
   +'Pokaż kolejne '+Math.min(12,filtered.length-visible)+' ('+(filtered.length-visible)+' pozostało)</button>':'';
 return (list||'<div class="payment-control-empty">Nie ma należności spełniających ten filtr.</div>')
  +button+'<p class="muted tiny payment-control-explain">Terminy pochodzą z projektów, także przy warsztatach rozliczanych przez uczestników. '
  +'Zaliczki obejmują tylko wpłaty oznaczone jako „Zaliczka” w historii; starsze kwoty bez oznaczenia rodzaju nie są tu nazywane zaliczkami. '
  +'Anulowane projekty i opłacone w całości nie występują na liście należności.</p>';
}
function paymentControlPanel(){
 const data=paymentControlData();
 return '<details class="payment-control-panel" '+(paymentControlExpanded?'open':'')+'>'
  +'<summary class="payment-control-summary"><span class="payment-control-symbol">'+icon('wallet')+'</span>'
  +'<span class="payment-control-heading"><strong>Należności i zaliczki</strong>'
  +'<small>'+data.rows.length+' realizacji z kwotą do otrzymania · kontrola terminów i wpłat</small></span>'
  +'<b>'+fMoney(data.remaining)+'</b><span class="payment-control-chevron" aria-hidden="true">⌄</span></summary>'
  +'<div class="payment-control-body"><div class="payment-control-totals">'
  +'<div><small>Otrzymano łącznie</small><strong>'+fMoney(data.received)+'</strong></div>'
  +'<div><small>Zaliczki w historii</small><strong>'+fMoney(data.advance)+'</strong></div>'
  +'<div><small>Do otrzymania</small><strong>'+fMoney(data.remaining)+'</strong></div>'
  +'<div><small>Po terminie</small><strong>'+fMoney(data.overdue)+'</strong></div>'
  +'</div><label class="payment-control-filter">Pokaż należności'
  +'<select id="payment-control-filter" aria-label="Filtr należności">'
  +[['all','Wszystkie'],['late','Po terminie'],['soon','Dzisiaj i najbliższe 7 dni'],['none','Bez terminu']]
   .map(([id,label])=>'<option value="'+id+'" '+(paymentControlFilter===id?'selected':'')+'>'+label+'</option>').join('')
  +'</select></label><div id="payment-control-results">'+paymentControlRows()+'</div></div></details>';
}

function financePage(m){
 const perHour=profitabilityData().rate,margin=m.income?Math.round(m.profit/m.income*100):0,pct=m.income?Math.min(100,Math.max(0,Math.round(m.cost/m.income*100))):0;
 const metricsBlock=(!m.income&&!m.cost)?empty('Finanse czekają na pierwszy projekt','Dodaj zlecenie lub warsztat z ceną i kosztami, aby zobaczyć podsumowanie.',`<button class="btn" data-action="new-project">Dodaj projekt</button>`):`<div class="stat-grid">${statsCard('Wartość realizacji',fMoney(m.income),'Wpisane ceny wszystkich nieanulowanych projektów','wallet')}${statsCard('Koszty do wyniku',fMoney(m.cost),'Wydatki + szacowany dojazd, gdy brak kosztu faktycznego','folder')}${statsCard('Po kosztach',fMoney(m.profit),'Przed podatkami i kosztami stałymi','trend',m.profit>=0?'accent':'warning')}${statsCard('Za godzinę',perHour==null?'—':fMoney(perHour),'Wyłącznie projekty z wpisanym czasem pracy','clock')}</div><div class="finance-grid finance-overview-grid"><section class="surface"><div class="section-head"><h2>Rentowność wszystkich realizacji</h2><span class="muted small">Bez anulowanych</span></div><div class="donut" style="--pct:${pct}%"><div class="donut-inner"><b>${fNum(margin)}%</b><small>marży*</small></div></div><div class="summary-line"><span>Wartość projektów</span><b>${fMoney(m.income)}</b></div><div class="summary-line"><span>Koszty</span><b>${fMoney(m.cost)}</b></div><div class="summary-line"><span>Otrzymano łącznie</span><b>${fMoney(m.paid)}</b></div><div class="summary-line"><span>Pozostało do zapłaty</span><b>${fMoney(m.unpaid)}</b></div></section></div><div class="form-note finance-detail">* Marża = (wpisana wartość projektów − ujęte koszty) / wartość. To wynik orientacyjny, nie księgowy zysk netto. Koszt faktycznego dojazdu zastępuje szacunek, jeśli został wpisany.</div>`;
 return `${returnToHomeButton('finance')}${pageHeading('Finanse','Rentowność realizacji i rzeczywisty przepływ wpłat.')}${metricsBlock}${paymentControlPanel()}${profitabilityPanel()}<section class="surface finance-month-section"><div class="section-head"><div><h2>Raport miesięczny</h2><p class="muted small">Wpłaty i wydatki z datą transakcji</p></div><label class="finance-month-select">Wybierz miesiąc<input id="finance-month-picker" type="month" value="${htmlEscape(financeMonth)}" min="2020-01" max="2100-12"></label></div><div id="finance-month-results">${monthlyReportMarkup(financeMonth)}</div></section>`;
}
function taskRow(t,projectById=null){let p=projectById?projectById.get(t.projectId):state.projects.find(p=>p.id===t.projectId);return `<div class="task-row"><button class="check-btn ${t.done?'checked':''}" data-action="toggle-task" data-id="${htmlEscape(t.id)}" aria-label="${t.done?'Cofnij wykonanie':'Oznacz jako wykonane'}">${t.done?icon('check'):''}</button><div class="task-text"><b class="${t.done?'done':''}">${htmlEscape(t.title)}</b><small>${p?htmlEscape(p.title)+' · ':''}${t.due?'Termin: '+fDate(t.due):'Bez terminu'}</small></div><button class="btn ghost sm" data-action="edit-task" data-id="${htmlEscape(t.id)}" aria-label="Edytuj zadanie">${icon('pencil')}</button><button class="btn ghost sm" data-action="delete-task" data-id="${htmlEscape(t.id)}" aria-label="Usuń zadanie">${icon('trash')}</button></div>`;}
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
 return `${returnToHomeButton('calendar')}${pageHeading('Kalendarz i przypomnienia','Terminy realizacji, warsztatów, zadań i płatności w jednym miejscu.',`<button class="btn" data-action="reminder-add">${icon('plus')} Przypomnienie</button>`)}<section class="surface calendar-alert-surface"><div class="section-head"><h2>Najbliższe terminy</h2><span class="muted small">Zaległe, dziś i następne 7 dni</span></div><div id="calendar-alert-results">${calendarAlertMarkup()}</div></section><section class="surface manu-calendar-surface" id="calendar-panel">${calendarMonthMarkup()}</section><p class="muted tiny calendar-privacy">Przypomnienia są lokalne. MANU pokazuje je po otwarciu aplikacji — ta wersja nie wysyła automatycznych powiadomień, gdy jest całkowicie zamknięta.</p>`;
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
 modal(r?'Edytuj przypomnienie':'Nowe przypomnienie',`<form id="reminder-form" data-id="${htmlEscape(id)}"><div class="field"><label>Co chcesz zapamiętać? *</label><input name="title" required maxlength="180" placeholder="Np. Potwierdzić termin spotkania" value="${htmlEscape(r?.title||'')}"></div><div class="form-cols"><div class="field"><label>Data *</label><input name="date" type="date" required value="${htmlEscape(due)}"></div><div class="field"><label>Godzina (opcjonalnie)</label><input name="time" type="time" value="${htmlEscape(r?.time||'')}"></div></div><div class="field"><label>Powiązany projekt (opcjonalnie)</label><select name="projectId"><option value="">Bez projektu</option>${state.projects.filter(p=>p.status!=='Anulowane').map(p=>`<option value="${htmlEscape(p.id)}" ${p.id===r?.projectId?'selected':''}>${htmlEscape(p.title)}</option>`).join('')}</select></div><div class="modal-actions"><button type="button" class="btn ghost" data-action="close">Anuluj</button><button type="submit" class="btn">${r?'Zapisz zmiany':'Dodaj przypomnienie'}</button></div></form>`);
}
function filteredTasks(){
 return state.tasks.filter(t=>taskFilter==='all'||(taskFilter==='done'?t.done:!t.done))
  .sort((a,b)=>Number(a.done)-Number(b.done)||(a.due||'9999').localeCompare(b.due||'9999'));
}
function renderTaskList(offset=0){
 const list=filteredTasks();
 if(!list.length)return empty('Lista jest pusta','Dodaj zadanie albo wybierz inny filtr.',`<button class="btn sm" data-action="new-task">Nowe zadanie</button>`);
 const names=new Map(state.projects.map(p=>[p.id,p]));
 return list.slice(offset,listVisible.tasks).map(t=>taskRow(t,names)).join('')+
  nextListButton('tasks',Math.min(listVisible.tasks,list.length),list.length);
}
function tasksPage(){
 return `${returnToHomeButton('tasks')}${pageHeading('Zadania','Nie zapomnij o tym, co trzeba zrobić.',`<button class="btn" data-action="new-task">${icon('plus')}<span>Nowe zadanie</span></button>`)}<div class="surface"><div class="section-head"><h2>Lista zadań</h2><div class="filters"><button class="filter ${taskFilter==='open'?'active':''}" data-action="task-filter" data-filter="open">Do zrobienia</button><button class="filter ${taskFilter==='done'?'active':''}" data-action="task-filter" data-filter="done">Gotowe</button><button class="filter ${taskFilter==='all'?'active':''}" data-action="task-filter" data-filter="all">Wszystkie</button></div></div><div id="task-list">${renderTaskList()}</div></div>`;
}

function pwaIsStandalone(){
 return !!(window.matchMedia?.('(display-mode: standalone)')?.matches||navigator.standalone===true);
}
function pwaSettingsMarkup(){
 const standalone=pwaIsStandalone();
 const installStatus=standalone
  ?'MANU działa już jako aplikacja uruchomiona z ekranu głównego.'
  :installEvent
   ?'MANU jest otwarte w przeglądarce. Możesz teraz zainstalować je na ekranie głównym.'
   :'MANU jest teraz otwarte w przeglądarce. W Chrome na Androidzie wybierz menu ⋮, a następnie „Zainstaluj aplikację” lub „Dodaj do ekranu głównego”.';
 return `<p class="small manu-pwa-status" role="status" aria-live="polite">${htmlEscape(installStatus)}</p>
 <p class="muted small">Uruchomiona wersja: <strong>${APP_VERSION}</strong></p>
 <p class="muted small">Po instalacji otwieraj MANU z jego ikony. Nie odinstalowuj aplikacji ani nie czyść jej danych bez sprawdzonej kopii JSON.</p>
 ${pwaUpdateReady?'<p class="manu-pwa-update" role="status">Nowa wersja MANU jest gotowa. Zakończ edycję, a następnie odśwież aplikację przyciskiem poniżej.</p>':'<p class="muted small">Aktualizacje sprawdzisz ręcznie. MANU nie przeładuje samodzielnie otwartego formularza.</p>'}
 <div class="settings-actions manu-pwa-actions">
 ${!standalone&&installEvent?`<button type="button" class="btn" data-action="install">${icon('plus')} Zainstaluj MANU</button>`:''}
 <button type="button" class="btn secondary" data-action="pwa-check-update">${icon('info')} Sprawdź aktualizacje</button>
 <button type="button" class="btn" data-action="pwa-reload" ${navigator.onLine===false&&!pwaUpdateReady?'disabled':''}>${icon('check')} Wczytaj aktualną wersję</button>
 </div>`;
}
function refreshPwaPanel(){
 const panel=$('#manu-pwa-panel');
 if(panel)panel.innerHTML=pwaSettingsMarkup();
}
function refreshNetworkStatus(){
 const indicator=$('#manu-offline-indicator');
 if(indicator)indicator.hidden=navigator.onLine!==false;
 const el=$('#manu-network-status');
 if(el)el.textContent=navigator.onLine===false
  ?'Brak internetu — wpisy pozostają na tym urządzeniu. Synchronizacja z chmurą wymaga połączenia.'
  :'Połączenie internetowe jest dostępne. Dane zapisują się lokalnie, a po aktywacji konta mogą także synchronizować się z chmurą.';
}
async function checkOfflineReadiness(){
 const status=$('#manu-offline-check-status');
 const report=message=>{
  offlineAuditMessage=message;
  if(status)status.textContent=message;
 };
 if(!('caches' in window)||!('serviceWorker' in navigator)){
  report('Nie można sprawdzić plików offline w tej przeglądarce.');
  return;
 }
 const essential=[
  './','./index.html','./styles.css?v='+APP_VERSION,'./app.js?v='+APP_VERSION,
  './cloud-config.js?v=3.13.0','./cloud.js?v=3.28.2',
  './gallery.js?v=3.28.2','./templates.js?v=3.28.2'
 ];
 try{
  const registration=pwaRegistration||await navigator.serviceWorker.getRegistration();
  if(!registration?.active){
   report('MANU nie ma jeszcze aktywnej obsługi offline. Uruchom aplikację przy połączeniu z internetem i spróbuj ponownie.');
   return;
  }
  if(registration.waiting&&navigator.serviceWorker.controller){
   report('Pobrano nową wersję MANU, ale czeka na zatwierdzenie. Wybierz „Wczytaj aktualną wersję”, a następnie powtórz kontrolę offline.');
   return;
  }
  const key='manu-app-v'+APP_VERSION,keys=await caches.keys();
  if(!keys.includes(key)){
   report('Ta wersja MANU nie ma jeszcze kompletnej pamięci offline. Uruchom ją online, a następnie sprawdź ponownie.');
   return;
  }
  const cache=await caches.open(key);
  const results=await Promise.all(essential.map(path=>cache.match(new URL(path,location.href))));
  const present=results.filter(Boolean).length;
  report(present===essential.length
   ?'Gotowe: '+present+'/'+essential.length+' niezbędnych plików jest zapisanych na tym urządzeniu. Możesz sprawdzić uruchamianie MANU w trybie samolotowym. Dane pozostają w lokalnej pamięci, a chmura wymaga internetu.'
   :'Pamięć offline jest niekompletna ('+present+'/'+essential.length+' plików). Włącz internet, uruchom ponownie MANU i sprawdź jeszcze raz. Nie usuwaj danych aplikacji.');
 }catch(e){
  console.warn('Kontrola plików offline MANU:',e);
  report('Nie udało się sprawdzić pamięci offline. Nie czyść danych aplikacji; spróbuj ponownie po odświeżeniu.');
 }
}
async function checkPwaUpdate(){
 if(!('serviceWorker' in navigator)){toast('Ta przeglądarka nie obsługuje aktualizacji aplikacji offline.');return;}
 if(navigator.onLine===false){toast('Do sprawdzenia aktualizacji potrzebujesz internetu.');return;}
 try{
  const registration=pwaRegistration||await navigator.serviceWorker.getRegistration();
  if(!registration){toast('Aplikacja offline nie została jeszcze zarejestrowana. Odśwież MANU i spróbuj ponownie.');return;}
  watchPwaRegistration(registration);
  await registration.update();
  if(registration.waiting&&navigator.serviceWorker.controller)pwaUpdateReady=true;
  toast(pwaUpdateReady?'Nowa wersja MANU została pobrana. Zakończ pracę i wybierz „Wczytaj aktualną wersję”.':'Sprawdzono aktualizacje. Jeśli nowa wersja zostanie przygotowana, MANU wyświetli komunikat.');
  refreshPwaPanel();
 }catch(e){console.warn('Sprawdzanie aktualizacji MANU:',e);toast('Nie udało się sprawdzić aktualizacji. Spróbuj ponownie przy połączeniu z internetem.');}
}

// Etap 17.3 — użytkownik świadomie aktywuje pobraną aktualizację.
function watchPwaRegistration(registration){
 if(!registration)return;
 pwaRegistration=registration;
 const announceWaiting=()=>{
  if(!registration.waiting||!navigator.serviceWorker.controller)return;
  if(!pwaUpdateReady){
   pwaUpdateReady=true;
   toast('Pobrano aktualizację MANU. Zapisz pracę i aktywuj ją w Ustawieniach.');
  }
  refreshPwaPanel();
 };
 if(pwaObservedRegistration!==registration){
  pwaObservedRegistration=registration;
  registration.addEventListener('updatefound',()=>{
   const installing=registration.installing;
   if(installing)installing.addEventListener('statechange',()=>{
    if(installing.state==='installed')announceWaiting();
   });
  });
 }
 announceWaiting();
}
async function reloadPwaSafely(){
 if($('.modal')||document.querySelector('.cloud-password-details[open], #cloud-reset-password-form')){
  alert('Zamknij aktywny formularz, aby nie stracić niezapisanych zmian.');
  return;
 }
 if(storageBlocked||pendingWrites>0||backupApplying||quoteSubmissionPending||window.MANUCloud?.isBusy?.()){
  alert('Zakończ zapisywanie danych, odtwarzanie kopii i synchronizację przed aktualizacją MANU.');
  return;
 }
 try{
  const registration='serviceWorker' in navigator
   ?(pwaRegistration||await navigator.serviceWorker.getRegistration()):null;
  const waiting=!!(registration?.waiting&&navigator.serviceWorker.controller);
  if(!waiting&&navigator.onLine===false){
   toast('Brak gotowej aktualizacji offline. Włącz internet, aby odświeżyć MANU.');
   return;
  }
  if(!confirm(waiting
   ?'Aktywować pobraną wersję MANU i uruchomić ją ponownie? Zapisz wszystkie zmiany przed aktualizacją.'
   :'Odświeżyć MANU i sprawdzić aktualną wersję? Upewnij się, że formularze są zapisane.'))return;
  if(waiting){
   pwaActivationRequested=true;
   registration.waiting.postMessage({type:'MANU_ACTIVATE_UPDATE'});
   setTimeout(()=>{
    if(pwaActivationRequested){
     pwaActivationRequested=false;
     toast('Aktualizacja nie została jeszcze aktywowana. Zamknij MANU, uruchom ponownie i sprawdź wersję.');
    }
   },12000);
  }else window.location.reload();
 }catch(e){
  pwaActivationRequested=false;
  console.warn('MANU: przełączanie wersji PWA',e);
  toast('Nie udało się aktywować aktualizacji. Spróbuj ponownie po uruchomieniu MANU.');
 }
}

/* Etap 16.1: wyłącznie odczytowa kontrola zapisów; bez tworzenia ani nadpisywania danych. */
let securityAuditReport=null,securityAuditBusy=false;
function securityAuditSnapshot(raw){
 if(raw==null)return {status:'missing',lastSaved:'',summary:null};
 try{
  const parsed=typeof raw==='string'?JSON.parse(raw):raw;
  const safe=validateBackup(parsed);
  return {status:'ok',lastSaved:String(safe.lastSaved||''),summary:backupSummary(safe)};
 }catch(e){return {status:'invalid',lastSaved:'',summary:null};}
}
function securityAuditMarkup(){
 const report=securityAuditReport;
 if(!report)return '<p class="muted small">Jeszcze nie sprawdzano pamięci na tym urządzeniu. Kontrola niczego nie zmienia i nie wysyła danych do internetu.</p>';
 return '<div class="manu-security-summary"><strong>'+htmlEscape(report.title)+'</strong>'
 +'<small>'+htmlEscape(report.checkedAt)+'</small></div>'
 +'<div class="manu-security-results">'+report.rows.map(row=>
  '<div class="manu-security-row manu-security-row--'+htmlEscape(row.status)+'">'
  +'<span><b>'+htmlEscape(row.title)+'</b><small>'+htmlEscape(row.info)+'</small></span>'
  +'<strong>'+htmlEscape(row.label)+'</strong></div>').join('')+'</div>'
 +'<p class="muted tiny">Kontrola dotyczy tylko zapisów na tym urządzeniu. Nie potwierdza posiadania pobranego pliku JSON ani synchronizacji z chmurą. Kopię JSON przechowuj poza telefonem; osobno sprawdź Konto i synchronizacja.</p>';
}
async function runSecurityAudit(){
 if(securityAuditBusy)return;
 securityAuditBusy=true;
 const panel=$('#manu-security-audit'),button=$('#manu-security-check');
 if(button)button.disabled=true;
 if(panel)panel.innerHTML='<p class="muted small" role="status">Sprawdzam lokalne dane bez ich zmieniania…</p>';
 const rows=[];
 try{
  // Czekamy na już rozpoczęte operacje zapisu, niczego nowego nie zapisujemy.
  await writeQueue;
  let current=null,previous=null,currentError=false,previousError=false;
  try{
   current=dbAvailable?await idbGet(DATA_KEY):null;
   if(current==null)current=localStorage.getItem(DATA_KEY);
  }catch(e){currentError=true;console.warn('MANU: odczyt bieżącej kopii',e);}
  try{
   previous=dbAvailable?await idbGet(RECOVERY_KEY):localStorage.getItem(RECOVERY_KEY);
  }catch(e){previousError=true;console.warn('MANU: odczyt poprzedniej kopii',e);}
  const currentCheck=currentError?{status:'invalid'}:securityAuditSnapshot(current);
  const previousCheck=previousError?{status:'invalid'}:securityAuditSnapshot(previous);
  const expected=backupSummary(state);
  const matching=currentCheck.status==='ok'
   &&JSON.stringify(currentCheck.summary)===JSON.stringify(expected)
   &&currentCheck.lastSaved===state.lastSaved;
  const currentFailed=storageBlocked||saveStatus==='error'||currentCheck.status==='invalid';
  rows.push({
   title:'Bieżący zapis',status:currentFailed?'error':matching?'ok':'warn',
   label:currentFailed?'Błąd':matching?'Zgodny':'Do sprawdzenia',
   info:currentFailed?'Wystąpił problem z pamięcią lub odczytem. Nie usuwaj danych aplikacji.'
    :currentCheck.status==='missing'?'Nie znaleziono zapisu na urządzeniu. Jeśli masz dane, pobierz kopię JSON.'
    :matching?'Zapis jest czytelny i liczba rekordów oraz data zgadzają się z otwartym MANU.'
    :'Zapis i aktualnie widoczny stan różnią się. Sprawdź status zapisu i pobierz kopię.'
  });
  rows.push({
   title:'Poprzedni zapis',status:previousCheck.status==='ok'?'ok':previousCheck.status==='invalid'?'error':'warn',
   label:previousCheck.status==='ok'?'Czytelny':previousCheck.status==='invalid'?'Błąd':'Brak',
   info:previousCheck.status==='ok'
    ?'Lokalny punkt odzyskiwania: '+previousCheck.summary.projects+' projektów, '+previousCheck.summary.quotes+' wycen, '+previousCheck.summary.clients+' klientów.'
    :previousCheck.status==='invalid'?'Lokalna kopia awaryjna jest nieczytelna. Sprawdź zewnętrzny plik JSON.'
    :'Nie ma jeszcze poprzedniego zapisu. Powstaje po kolejnym poprawnym zapisie.'
  });
  let persistent=null;
  try{if(typeof navigator.storage?.persisted==='function')persistent=!!(await navigator.storage.persisted());}
  catch(e){console.warn('MANU: trwałość pamięci',e);}
  rows.push({
   title:'Ochrona pamięci',status:persistent===true?'ok':'warn',
   label:persistent===true?'Przyznana':persistent===false?'Nieprzyznana':'Nieznana',
   info:persistent===true?'Przeglądarka potwierdziła trwałą pamięć. Nadal rób kopie poza telefonem.'
    :persistent===false?'Przeglądarka nie przyznała ochrony. Możesz użyć przycisku „Zwiększ trwałość lokalnej pamięci” poniżej.'
    :'Przeglądarka nie udostępnia wiarygodnego odczytu tego uprawnienia. Kopia JSON pozostaje konieczna.'
  });
  const errors=rows.some(row=>row.status==='error');
  securityAuditReport={
   title:errors?'Wykryto problem wymagający uwagi':rows.every(row=>row.status==='ok')
    ?'Kontrola lokalna bez problemów':'Kontrola zakończona — sprawdź uwagi',
   checkedAt:new Intl.DateTimeFormat('pl-PL',{dateStyle:'short',timeStyle:'short'}).format(new Date()),
   rows
  };
 }catch(e){
  console.error('MANU: kontrola bezpieczeństwa',e);
  securityAuditReport={title:'Kontrola nie powiodła się',
   checkedAt:new Intl.DateTimeFormat('pl-PL',{dateStyle:'short',timeStyle:'short'}).format(new Date()),
   rows:[{title:'Odczyt danych',status:'error',label:'Błąd',info:'Nie udało się ukończyć kontroli. Nie usuwaj danych; pobierz kopię JSON.'}]};
 }finally{
  securityAuditBusy=false;
  if(panel)panel.innerHTML=securityAuditMarkup();
  if(button)button.disabled=false;
 }
}

function settingsPage(){return `${pageHeading('Ustawienia i dane','To tutaj dbamy o bezpieczeństwo Twoich informacji.')}<div class="stack">${window.MANUCloud?.markup?.()||''}${personalizationMarkup()}<details class="smart-settings" ${smartSettingsExpanded?'open':''}><summary>${icon('calendar')} Inteligentne przypomnienia</summary><div class="smart-settings-content"><p>MANU wykrywa ważne terminy i pokazuje je na ekranie Start. Nie tworzy nowych, zduplikowanych wpisów.</p><label class="smart-settings-check"><input id="smart-alert-enabled" type="checkbox" ${state.smartAlerts?.enabled!==false?'checked':''}><span>Włącz inteligentne przypomnienia</span></label><label class="smart-settings-lead">Przypominaj o zleceniach i płatnościach<select id="smart-alert-lead" ${state.smartAlerts?.enabled===false?'disabled':''}><option value="1" ${state.smartAlerts?.leadDays===1?'selected':''}>1 dzień wcześniej</option><option value="3" ${state.smartAlerts?.leadDays!==1&&state.smartAlerts?.leadDays!==7?'selected':''}>3 dni wcześniej</option><option value="7" ${state.smartAlerts?.leadDays===7?'selected':''}>7 dni wcześniej</option></select></label><p class="muted tiny">Warsztaty: 7 dni wcześniej. Zadania: dzień wcześniej. Własne przypomnienia: w dniu terminu. „Jutro” odkłada pojedynczą wskazówkę. To funkcja wewnątrz MANU — aplikacja nie wysyła powiadomień, gdy jest całkowicie zamknięta.</p></div></details><div class="surface settings-group"><h3>${icon('shield')} Zabezpieczenia i kopie danych</h3>
 <p id="manu-save-status" class="save-state-line ${storageBlocked?'is-error':''}" role="status" aria-live="polite">${htmlEscape(saveMessage())}</p>
 <p class="small">MANU zapisuje dane na tym urządzeniu po każdej zmianie. Zostawia też jeden poprzedni lokalny stan, który możesz przywrócić. Nie chroni to przed utratą telefonu ani usunięciem danych przeglądarki.</p>
 <div class="manu-security-audit"><div class="manu-security-heading"><strong>Kontrola bezpieczeństwa danych</strong><button type="button" id="manu-security-check" class="btn secondary sm" data-action="security-audit">${icon('shield')} Sprawdź</button></div><div id="manu-security-audit" role="status" aria-live="polite">${securityAuditMarkup()}</div></div>
 <div class="settings-actions"><button class="btn" data-action="export">${icon('download')} Pobierz kopię JSON</button>
 <button class="btn secondary" data-action="backup-check">${icon('shield')} Sprawdź plik kopii</button>
 <button class="btn secondary" data-action="import">${icon('upload')} Przywróć z pliku</button>
 <button class="btn secondary" data-action="backup-recovery">${icon('archive')} Przywróć poprzedni zapis</button></div>
 <p class="muted tiny">Kopia JSON jest przenośna: zachowaj ją również poza telefonem, np. na własnym dysku. Import pokazuje zawartość przed zastąpieniem obecnych danych.</p>
 </div><div class="surface settings-group"><h3>${icon('info')} Dostępność i praca offline</h3>
 <p id="manu-network-status" class="small">${navigator.onLine===false?'Brak internetu — wpisy pozostają na tym urządzeniu.':'Połączenie internetowe jest dostępne. Dane zapisują się lokalnie, a po aktywacji konta mogą także synchronizować się z chmurą.'}</p>
 <p class="muted small">Aplikacja może działać bez sieci po wcześniejszym wczytaniu zasobów. Offline nie oznacza synchronizacji ani tworzenia kopii w chmurze.</p>
 <p id="manu-offline-check-status" class="manu-offline-check-status" role="status" aria-live="polite">${htmlEscape(offlineAuditMessage)}</p>
 <div class="settings-actions"><button type="button" class="btn secondary" data-action="offline-check">${icon('check')} Sprawdź gotowość offline</button><button class="btn secondary" data-action="storage-persist">${icon('shield')} Zwiększ trwałość lokalnej pamięci</button></div>
 <p class="muted tiny">Jeśli przeglądarka pozwala, poprosimy o ochronę pamięci przed automatycznym czyszczeniem. Nie zastępuje to pobierania kopii JSON.</p></div><div class="surface settings-group"><h3>${icon('plus')} Instalacja i aktualizacje MANU</h3><div id="manu-pwa-panel">${pwaSettingsMarkup()}</div></div><div class="surface settings-group"><h3>${icon('info')} Testowanie aplikacji</h3><p>Chcesz poznać funkcje bez wpisywania własnych danych? Uruchom oddzielny tryb demonstracyjny na fikcyjnych realizacjach. Nic z tej sesji nie trafi do Twojej bazy ani do chmury.</p><div class="settings-actions"><button class="btn secondary" data-action="demo-start">${icon('spark')} Uruchom bezpieczny tryb demo</button><button class="btn danger" data-action="clear">${icon('trash')} Usuń wszystkie dane</button></div>${testerGuideMarkup()}</div><div class="surface settings-group"><h3>${icon('spark')} Animacja otwierania MANU</h3><p>Krótka animacja skórzanego notesu przy uruchomieniu aplikacji. Możesz ją wyłączyć, jeśli wolisz natychmiastowy dostęp do pulpitu.</p><label class="manu-motion-control"><input id="manu-intro-preference" type="checkbox" ${introEnabled()?'checked':''}><span>Pokazuj animację otwarcia</span></label><p class="muted tiny">Ustawienie dotyczy tej przeglądarki. Systemowe ograniczenie animacji zawsze ma pierwszeństwo.</p></div><div class="form-note">MANU v${APP_VERSION} · Wersja testowa. Konta i chmura wymagają konfiguracji Supabase. Bez fakturowania i obsługi prawdziwych płatności. Nie wpisuj w testach danych osobowych uczestników bez odpowiedniego zabezpieczenia i podstawy prawnej.</div></div>`;}
function modal(title,body,options={}){
 const detail=options.detail===true;
 const paper=detail||body.trimStart().startsWith('<form');
 const right=detail||options.rightPage===true;
 // Zachowaj pozycję otwartej kartki przed otwarciem formularza projektu.
 const previous=$('.modal');
 const previousOverlay=$('#modal-root')?.firstElementChild;
 const previousIsDetail=!!previous?.classList?.contains('notebook-detail-page');
 const previousProjectId=previousIsDetail
   ?previous?.querySelector?.('details.manu-detail-fold[data-project]')?.dataset.project||''
   :'';
 // Nie dopisuj starego formularza do stosu, gdy wracasz do bieżącego projektu
 // przez Wróć lub gdy po zapisaniu aktualizujemy jego kartę.
 if(detail&&previous&&!previousIsDetail&&modalReturnStack.length&&!manuHandlingPopState){
  const parentIndex=modalReturnStack.findLastIndex(item=>item.projectId===options.projectId);
  if(parentIndex>=0)modalReturnStack.splice(parentIndex);
  else modalReturnStack.length=0;
 }
 // Podgląd i edycja wyceny mają osobny mechanizm powrotu.
 const quoteOwnReturn=!!quoteModalReturn&&(
  !!previous?.querySelector?.('[data-quote-preview]')||!!previous?.querySelector?.('#quote-form'));
 // Przechodząc między kartami szczegółów (projekt → klient, klient → projekt,
 // projekt → podgląd wyceny) zachowaj również poprzednią kartę.
 // Odświeżenie TEJ SAMEJ karty projektu po zmianie danych nie jest nową stroną.
 const refreshSameProjectCard=detail&&previousIsDetail&&previousProjectId&&
  options.projectId===previousProjectId&&body.includes('class="manu-detail-fold"');
 if(previous&&previousOverlay&&(previousIsDetail||paper)&&!quoteOwnReturn&&
    (!detail||(previousIsDetail&&!refreshSameProjectCard))){
  if(modalReturnStack.length>=MODAL_RETURN_LIMIT)modalReturnStack.shift();
  modalReturnStack.push({
   overlay:previousOverlay,scrollTop:previous.scrollTop,
   pageX:window.scrollX,pageY:window.scrollY,projectId:previousProjectId
  });
  armManuNestedModalHistory();
 }
 if(quoteOwnReturn&&previous?.querySelector?.('[data-quote-preview]')&&!manuQuoteFormHistoryActive)
  manuQuoteFormHistoryActive=armManuNestedModalHistory();
 // Wszystkie samodzielne okna dostają własny wpis historii Androida.
 // Dotyczy też Nowy klient, Nowa wycena, nowe zadanie i przypomnienie.
 // Dzięki temu Wstecz z formularza nie zużywa historii strony pod spodem.
 if(!previous)armManuProjectModalHistory();
 if(!detail&&previousIsDetail&&previousProjectId){
  detailReturnScroll={
   projectId:previousProjectId,top:previous.scrollTop,pageX:window.scrollX,pageY:window.scrollY
  };
 }
 const paperBinding=paper?'<div class="paper-binding" aria-hidden="true"><span class="paper-binding-edge"></span><span class="paper-binding-stitches"></span><span class="paper-binding-pages"></span></div>':'';
 const pageLabel=detail?'MANU · KARTA REALIZACJI':'MANU · KARTA PRACY';
 $('#modal-root').innerHTML=`<div class="modal-overlay ${paper?'paper-overlay':''}" data-action="close-overlay"><div class="modal ${paper?'notebook-page':''} ${detail?'notebook-detail-page':''} ${right?'notebook-page--right':''}" role="dialog" aria-modal="true" aria-label="${htmlEscape(title)}">${paper&&!right?paperBinding:''}<div class="${paper?'paper-sheet':'modal-sheet'}"><div class="modal-header"><div class="modal-page-title">${paper?'<small class="paper-kicker">'+pageLabel+'</small>':''}<h2>${htmlEscape(title)}</h2></div><button type="button" class="close" data-action="close" aria-label="Zamknij okno">×</button></div><div class="modal-body">${body}</div></div>${paper&&right?paperBinding:''}</div></div>`;
 const next=$('.modal');
 // Szczegóły klienta i wyceny nie muszą mieć projectId: nie porównuj
 // undefined z undefined, bo oznaczałoby fałszywe przywrócenie scrolla.
 if(detail&&detailReturnScroll&&options.projectId&&
    detailReturnScroll.projectId===options.projectId&&next){
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
function restorePreviousModal(){
 const parent=modalReturnStack.pop();
 if(!parent)return false;
 if($('#project-form')?.dataset?.draftEligible==='yes')clearProjectDraft();
 const root=$('#modal-root');
 root.replaceChildren(parent.overlay);
 const restored=$('.modal');
 if(restored)restored.scrollTop=parent.scrollTop;
 if(window.scrollX!==parent.pageX||window.scrollY!==parent.pageY)
  window.scrollTo(parent.pageX,parent.pageY);
 detailReturnScroll=null;
 pendingBackup=null;
 void window.MANUGallery?.hydrate?.(root);
 return true;
}
function dismissCurrentModal(){
 const current=$('.modal');if(!current)return;
 if(manuBackGuardReady&&window.history?.back){
  if(manuQuoteFormHistoryActive&&$('#quote-form')&&window.history.state?.manuNestedModal===1){window.history.back();return}
  if(modalReturnStack.length&&manuNestedModalHistoryDepth>0&&window.history.state?.manuNestedModal===1){window.history.back();return}
  // X używa tej samej historii co fizyczny Wstecz także z formularzy.
  if(manuProjectModalHistoryActive&&!modalReturnStack.length){
   window.history.go(manuProjectSectionHistoryActive?-2:-1);return;
  }
 }
 if(returnToQuotePreview())return;
 if(restorePreviousModal())return;
 closeModal();
}
function closeModal(){
 const levels=manuHandlingPopState?0:manuNestedModalHistoryDepth+
  (manuGalleryPreviewHistoryActive?1:0)+
  (manuProjectSectionHistoryActive?1:0)+(manuProjectModalHistoryActive?1:0);
 const trimmed=levels>0&&trimManuHistory(levels);
 manuNestedModalHistoryDepth=0;manuProjectSectionHistoryActive=false;
 manuQuoteFormHistoryActive=false;manuGalleryPreviewHistoryActive=false;
 if(window.MANUGallery?.isPreviewOpen?.())window.MANUGallery.closePreview();
 manuPendingProjectRefreshId='';
 modalReturnStack.length=0;
 if(trimmed)manuProjectModalHistoryActive=false;else releaseManuProjectModalHistory();
 quoteModalReturn=null;
 if($('#project-form')?.dataset?.draftEligible==='yes')clearProjectDraft();
 detailReturnScroll=null;pendingBackup=null;$('#modal-root').innerHTML='';
 const printed=$('#quote-print-root');if(printed)printed.innerHTML='';
}

// MANU 13.5 — jeden szkic nowego projektu, wyłącznie na tym urządzeniu.
// Nie zapisujemy go jako projektu i nie wysyłamy do chmury.
const PROJECT_DRAFT_KEY='manu-new-project-draft-v1';
const PROJECT_DRAFT_MAX_AGE=14*24*60*60*1000;
let projectDraftTimer=null;
function readProjectDraft(){
 if(demoSession)return null;
 try{
  const raw=localStorage.getItem(PROJECT_DRAFT_KEY);
  if(!raw)return null;
  const item=JSON.parse(raw);
  if(item?.version!==1||!Array.isArray(item.fields)||item.fields.length>120||
   !Number.isFinite(item.savedAt)||item.savedAt>Date.now()+60000||
   Date.now()-item.savedAt>PROJECT_DRAFT_MAX_AGE)return null;
  return item;
 }catch(e){return null}
}
function clearProjectDraft(){
 if(demoSession)return;
 if(projectDraftTimer!==null){clearTimeout(projectDraftTimer);projectDraftTimer=null}
 try{localStorage.removeItem(PROJECT_DRAFT_KEY)}catch(e){console.warn('MANU: nie udało się usunąć szkicu',e)}
}
function writeProjectDraft(){
 if(demoSession)return;
 if(projectDraftTimer!==null){clearTimeout(projectDraftTimer);projectDraftTimer=null}
 const form=$('#project-form');
 if(!form||form.dataset.draftEligible!=='yes')return;
 const fields=[...form.querySelectorAll('input[name],select[name],textarea[name]')].slice(0,120).map(input=>({
  name:input.name,
  type:input.type||input.tagName.toLowerCase(),
  value:String(input.value||'').slice(0,6000),
  checked:!!input.checked
 }));
 const opened=[...form.querySelectorAll('details')].map(item=>!!item.open);
 try{localStorage.setItem(PROJECT_DRAFT_KEY,JSON.stringify({version:1,savedAt:Date.now(),fields,opened}))}
 catch(e){console.warn('MANU: brak miejsca na szkic formularza',e)}
}
function scheduleProjectDraft(){
 if(demoSession)return;
 if(!$('#project-form[data-draft-eligible="yes"]'))return;
 if(projectDraftTimer!==null)clearTimeout(projectDraftTimer);
 projectDraftTimer=setTimeout(writeProjectDraft,500);
}
function restoreProjectDraft(form,draft){
 if(!form||!draft)return;
 const controls=[...form.querySelectorAll('input[name],select[name],textarea[name]')];
 for(let i=0;i<Math.min(controls.length,draft.fields.length);i++){
  const el=controls[i],field=draft.fields[i];
  if(!field||field.name!==el.name||field.type!==(el.type||el.tagName.toLowerCase()))continue;
  if(el.type==='radio'||el.type==='checkbox')el.checked=!!field.checked;
  else if(typeof field.value==='string')el.value=field.value;
 }
 const details=[...form.querySelectorAll('details')];
 for(let i=0;i<Math.min(details.length,draft.opened?.length||0);i++)
  details[i].open=draft.opened[i]===true;
}

function optionsStatus(selected){return validStatus.map(x=>`<option value="${x}" ${x===selected?'selected':''}>${x}</option>`).join('');}
function projectForm(p,prefillClientId='',templateId=''){
  const edit=!!p;
  const draftEligible=!edit&&!prefillClientId&&!templateId;
  const draft=draftEligible?readProjectDraft():null;
  const template=!edit&&templateId?window.MANUTemplates?.findTemplate?.(templateId):null;
  const linkedClientId=String(p?.clientId||prefillClientId);
  const linkedClient=state.clients.find(c=>c.id===linkedClientId);
  const x=p||(template&&window.MANUTemplates.newProjectDraft(template))||{title:'',type:'Zlecenie',client:'',date:'',status:'Planowane',price:0,paid:0,hours:0,quantity:1,estimatedHours:0,estimatedMaterials:0,workLocation:'',transportType:'none',paidTransportCost:0,paidTransportLabel:'',travelKm:0,travelMode:'fuel',fuelConsumption:0,fuelPrice:0,travelRate:0,travelExtra:0,capacity:0,participantFee:0,location:'',startTime:'',durationHours:0,financeMode:'manual',notes:''};
  const oldManualWorkshop=edit&&x.type==='Warsztat'&&x.financeMode!=='participants';
  const autoWorkshop=edit&&x.type==='Warsztat'&&x.financeMode==='participants';
  const moneyFieldValue=autoWorkshop?projectIncome(x):x.price||0;
  const paidFieldValue=autoWorkshop?projectPaid(x):x.paid||0;
  const advancedFilled=!!(x.paymentDue||x.notes||x.workLocation||x.location||x.startTime||val(x.durationHours)||val(x.hours)||val(x.estimatedHours)||val(x.estimatedMaterials)||val(x.travelKm)||val(x.paidTransportCost)||val(x.travelExtra)||val(x.paid)||val(x.quantity)>1);
  modal(edit?'Edytuj projekt lub warsztat':'Nowy projekt lub warsztat',`<form id="project-form" data-draft-eligible="${draftEligible?'yes':'no'}" data-id="${htmlEscape(x.id||'')}" data-old-manual="${oldManualWorkshop?'yes':'no'}" data-is-edit="${edit?'yes':'no'}" data-original-type="${htmlEscape(x.type)}" data-original-auto="${autoWorkshop?'yes':'no'}" data-template="${htmlEscape(template?.id||'')}">
  ${draft?`<div class="manu-draft-note" role="status"><span>Przywrócono niezapisany formularz z poprzedniego uruchomienia MANU. To tylko szkic na tym urządzeniu.</span><button class="btn ghost sm" type="button" data-action="project-draft-clear">Zacznij od nowa</button></div>`:''}
  ${template?`<p class="form-note">Używasz szablonu: <b>${htmlEscape(template.name)}</b>. Sprawdź ceny, koszty i terminy przed zapisaniem. ${template.expenses.length?`Powtarzalne koszty: ${template.expenses.length} pozycji; zostaną wpisane przy utworzeniu projektu.`:''}</p>`:''}
  <p class="project-form-step-label">Podstawowe informacje</p>
  <div class="form-cols type-select-row">
    <div class="field"><label>Rodzaj działalności</label><select name="type"><option value="Zlecenie" ${x.type==='Zlecenie'?'selected':''}>Zlecenie / realizacja</option><option value="Warsztat" ${x.type==='Warsztat'?'selected':''}>Warsztat</option></select></div>
    <div class="field"><label>Status</label><select name="status">${optionsStatus(x.status)}</select></div>
  </div>
  <div class="field"><label>Nazwa *</label><input name="title" required maxlength="120" placeholder="Np. Projekt na zamówienie" value="${htmlEscape(x.title)}"></div>
  <div class="form-cols">
    <div class="field field-full"><label>Powiąż z kartą klienta</label><select name="clientId" aria-label="Klient z bazy MANU"><option value="">Bez powiązania z bazą</option>${state.clients.slice().sort((a,b)=>a.name.localeCompare(b.name,'pl')).map(c=>'<option value="'+htmlEscape(c.id)+'" '+(c.id===linkedClientId?'selected':'')+'>'+htmlEscape(c.name)+'</option>').join('')}</select><p class="muted tiny">Wybierz kartę z bazy klientów lub wpisz nazwę poniżej. Uczestników warsztatów dodajesz osobno.</p></div>
    <div class="field"><label data-label="client">Klient / zamawiający</label><input name="client" maxlength="100" placeholder="Opcjonalnie" value="${htmlEscape(linkedClient?.name||(x.type==='Warsztat'&&!linkedClientId?'':x.client))}" ${linkedClient?'readonly':''}></div>
    <div class="field"><label data-label="date">Termin wykonania</label><input name="date" type="date" value="${htmlEscape(x.date)}"></div>
  </div>


  <section class="project-kind-section project-form-primary-workshop" data-kind="Warsztat" hidden>
    <div class="field"><label>Organizator / prowadzący</label><input name="organizer" maxlength="120" placeholder="Np. Imię i nazwisko lub nazwa organizatora" value="${htmlEscape(x.organizer??(x.type==='Warsztat'&&!linkedClientId?x.client:''))}"><p class="muted tiny">To pole jest niezależne od klienta powiązanego z bazą MANU.</p></div>
    <div class="form-cols">
    <div class="field"><label>Liczba dostępnych miejsc</label><input name="capacity" type="number" min="0" step="1" value="${Math.floor(val(x.capacity))}"></div>
    <div class="field"><label>Cena za uczestnika (zł)</label><input name="participantFee" type="number" min="0" step="0.01" value="${money(x.participantFee)}"></div>
    </div>
    <p class="workshop-potential" data-workshop-potential hidden aria-live="polite"></p>
  </section>
  <section class="project-kind-section project-form-primary-price" data-field="money">
    <div class="field"><label data-label="price">Cena realizacji (zł)</label><input name="price" type="number" min="0" step="0.01" value="${money(moneyFieldValue)}"></div>
  </section>
  <details class="project-form-advanced" ${advancedFilled?'open':''}>
    <summary class="project-form-advanced-trigger">
      <span class="project-form-advanced-icon">${icon('settings')}</span>
      <span class="project-form-advanced-copy"><strong>Więcej ustawień</strong><small>Rozliczenia, miejsce, dojazd, czas pracy i notatki</small></span>
      <span class="project-form-advanced-chevron" aria-hidden="true">⌄</span>
    </summary>
    <div class="project-form-advanced-content">
      <div class="field"><label>Termin płatności / rozliczenia (opcjonalnie)</label><input name="paymentDue" type="date" value="${htmlEscape(x.paymentDue||'')}"></div>
  <section class="project-kind-section" data-kind="Zlecenie">
    <div class="kind-heading"><span class="kind-symbol">${icon('brief')}</span><div><h3>Szczegóły realizacji</h3><p>Zaplanuj wykonanie i przewidywany koszt.</p></div></div>
    <details class="location-accordion" ${x.workLocation||travelCost(x)>0||val(x.travelKm)>0||val(x.paidTransportCost)>0?'open':''}>
      <summary class="location-accordion-trigger">
        <span class="location-icon">${icon('map')}</span>
        <span class="location-summary-copy"><strong>Miejsce realizacji i dojazd</strong><small>Adres, sposób transportu i jego koszty · opcjonalnie</small></span>
        <span class="location-chevron" aria-hidden="true">⌄</span>
      </summary>
      <div class="location-accordion-content">
        <div class="field"><label>Miejsce wykonania zlecenia</label><input name="workLocation" maxlength="220" placeholder="Np. Online, pracownia lub adres klienta" value="${htmlEscape(x.workLocation||'')}"></div>
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
          <div class="field field-full"><label>Szacowany czas przygotowania i prowadzenia (godz.)</label><input name="workshopEstimatedHours" type="number" min="0" step="0.25" value="${val(x.estimatedHours)}"></div><div class="field field-full"><label>Przepracowano łącznie przy warsztacie (godz.)</label><input name="workshopHours" type="number" min="0" step="any" value="${val(x.hours)}"></div>
    </div>
    <div class="form-note">Po zapisaniu warsztatu dodasz uczestników i ich wpłaty. Cena za osobę będzie automatycznie proponowana w formularzu uczestnika.</div>
  </section>


      <section class="project-kind-section project-form-manual-paid" data-field="manualPayment">
        <div class="kind-heading"><span class="kind-symbol">${icon('wallet')}</span><div><h3>Wpłaty ręczne</h3>
        <p data-money-description>Cena dla klienta i otrzymane wpłaty.</p></div></div>
        <div class="field"><label data-label="paid">Wpłaty wcześniejsze, bez daty (zł)</label><input name="paid" type="number" min="0" step="0.01" value="${money(paidFieldValue)}"></div>
      </section>
  <div class="field"><label>Notatki i ustalenia</label><textarea name="notes" maxlength="5000" placeholder="Materiały, ustalenia, pomysły, informacje…">${htmlEscape(x.notes)}</textarea></div>
    </div>
  </details>
  <div class="modal-actions"><button type="button" class="btn ghost" data-action="close">Anuluj</button><button type="submit" class="btn">${icon('check')} <span data-project-submit-label>${edit?'Zapisz zmiany':'Utwórz projekt'}</span></button></div>
  </form>`,{rightPage:view==='projects'});
  if(draft)restoreProjectDraft($('#project-form'),draft);
  syncProjectFields();
  syncProjectClientField();
}
function syncProjectClientField(){
 const form=document.getElementById('project-form');
 if(!form)return;
 const selector=form.querySelector('select[name="clientId"]');
 const input=form.querySelector('input[name="client"]');
 if(!selector||!input)return;
 const c=state.clients.find(item=>item.id===selector.value);
 if(c){
  if(!input.readOnly)input.dataset.manualClient=input.value;
  input.value=c.name;
  input.readOnly=true;
 }else{
  if(input.readOnly)input.value=input.dataset.manualClient||'';
  input.readOnly=false;
 }
}
function syncWorkshopPotential(){
 const form=document.getElementById('project-form'),hint=form?.querySelector('[data-workshop-potential]');
 if(!form||!hint)return;
 const count=Number(form.elements.namedItem('capacity')?.value);
 const fee=Number(form.elements.namedItem('participantFee')?.value);
 const show=form.elements.namedItem('type')?.value==='Warsztat'&&Number.isFinite(count)&&Number.isFinite(fee)&&count>0&&fee>0;
 hint.hidden=!show;
 if(show)hint.textContent='Przychód przy komplecie miejsc: '+Math.floor(count)+' × '+fMoney(fee)+' = '+fMoney(money(Math.floor(count)*fee))+'. To szacunek, nie otrzymana wpłata.';
 else hint.textContent='';
}
function syncTravelFields(){
  const form=document.getElementById('project-form');
  if(!form)return;
  const transport=form.querySelector('input[name="transportType"]:checked')?.value||'none';
  const mode=form.elements.namedItem('travelMode')?.value==='rate'?'rate':'fuel';
  const workshop=form.elements.namedItem('type')?.value==='Warsztat';
  form.querySelectorAll('[data-transport-type]').forEach(el=>{
   el.hidden=el.dataset.transportType!==transport;
   el.querySelectorAll('input,select,textarea').forEach(input=>input.disabled=workshop||el.hidden);
  });
  form.querySelectorAll('[data-travel-mode]').forEach(el=>{
   el.hidden=transport!=='car'||el.dataset.travelMode!==mode;
   el.querySelectorAll('input,select,textarea').forEach(input=>input.disabled=workshop||el.hidden);
  });
  const extra=form.querySelector('[data-transport-extra]');
  if(extra){
   extra.hidden=transport==='none';
   extra.querySelectorAll('input,select,textarea').forEach(input=>input.disabled=workshop||extra.hidden);
  }
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
  form.querySelectorAll('[data-kind]').forEach(el=>{
   el.hidden=el.dataset.kind!==(workshop?'Warsztat':'Zlecenie');
   // Pola ukryte przy zmianie rodzaju nie blokują zapisu, lecz zachowują wpisane wartości.
   el.querySelectorAll('input,select,textarea').forEach(input=>input.disabled=el.hidden);
  });
  const isOldManualWorkshop=workshop&&form.dataset.oldManual==='yes';
  const moneySection=form.querySelector('[data-field="money"]');
  moneySection.hidden=workshop&&!isOldManualWorkshop;
  const manualPayment=form.querySelector('[data-field="manualPayment"]');
  if(manualPayment)manualPayment.hidden=workshop&&!isOldManualWorkshop;
  const autoWorkshop=workshop&&form.dataset.originalAuto==='yes';
  form.elements.namedItem('price').disabled=autoWorkshop||moneySection.hidden;
  form.elements.namedItem('paid').disabled=autoWorkshop||!!manualPayment?.hidden;
  form.querySelector('[data-label="client"]').textContent='Klient / zamawiający';
  form.querySelector('[data-label="date"]').textContent=workshop?'Data warsztatu':'Termin wykonania';
  const submitLabel=form.querySelector('[data-project-submit-label]');
  if(submitLabel)submitLabel.textContent=form.dataset.isEdit==='yes'?'Zapisz zmiany':workshop?'Utwórz warsztat':'Utwórz projekt';
  form.elements.namedItem('title').placeholder=workshop?'Np. Warsztaty tematyczne':'Np. Projekt na zamówienie, realizacja';
  form.querySelector('[data-label="price"]').textContent=workshop?'Wartość warsztatu (zł)':'Cena realizacji (zł)';
  form.querySelector('[data-label="paid"]').textContent='Wcześniejsze wpłaty (bez historii) (zł)';
  form.querySelector('[data-money-description]').textContent=workshop?'Zachowane ręczne rozliczenie starszego warsztatu. Nowe wpłaty zapisuj w historii na karcie realizacji.':'Tutaj zachowujesz tylko kwoty bez daty. Nowe zaliczki i dopłaty dopisuj w historii wpłat na karcie realizacji, aby nie liczyć ich drugi raz.';
  syncTravelFields();
  syncWorkshopPotential();
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
 if(!p||!item)return;
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
 const p=state.projects.find(x=>x.id===id);if(!p)return;
 modal('Lista materiałów i przygotowań',`<form id="workshop-material-form" data-id="${htmlEscape(id)}"><p class="muted small">${htmlEscape(p.title)}</p><div class="field"><label>Co trzeba przygotować? *</label><input required maxlength="130" name="title" placeholder="Np. Materiały dla grupy, sprzęt, link do zajęć"></div><div class="field"><label>Ile sztuk / kompletów?</label><input name="quantity" type="number" min="1" max="9999" step="1" value="1"></div><p class="form-note">To lista przygotowań, a nie wydatek. Koszt zakupów wpisuj osobno w finansach, aby nie policzyć ich podwójnie.</p><div class="modal-actions"><button type="button" class="btn ghost" data-action="open-project" data-id="${htmlEscape(id)}">Wróć</button><button class="btn" type="submit">Dodaj do listy</button></div></form>`);
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
      p.organizer?['Organizator / prowadzący',htmlEscape(p.organizer)]:null,
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
 modal('Dodaj etap projektu',`<form id="stage-form" data-id="${htmlEscape(id)}"><p class="muted small">${htmlEscape(p.title)}</p><div class="field"><label>Nazwa etapu *</label><input required name="title" maxlength="120" placeholder="Np. Uzgodnienie szczegółów" autofocus></div><div class="modal-actions"><button class="btn ghost" type="button" data-action="open-project" data-id="${htmlEscape(id)}">Wróć</button><button class="btn" type="submit">Dodaj etap</button></div></form>`);
}
function workEntryForm(id){
 const p=state.projects.find(x=>x.id===id);if(!p)return;
 const day=new Date();const date=[day.getFullYear(),String(day.getMonth()+1).padStart(2,'0'),String(day.getDate()).padStart(2,'0')].join('-');
 modal('Dopisz czas pracy',`<form id="work-entry-form" data-id="${htmlEscape(id)}"><p class="muted small">${htmlEscape(p.title)}</p><div class="form-cols"><div class="field"><label>Data pracy</label><input name="date" type="date" required value="${date}"></div><div class="field"><label>Przepracowane minuty *</label><input name="minutes" type="number" min="1" max="1440" step="1" required placeholder="Np. 90"></div></div><div class="field"><label>Co zostało zrobione?</label><textarea name="note" maxlength="350" rows="3" placeholder="Np. Przygotowanie projektu i materiałów"></textarea></div><p class="form-note">Wpis zostanie doliczony do łącznego czasu pracy i pojawi się w historii. Nie dodawaj ponownie godzin już ujętych w projekcie.</p><div class="modal-actions"><button type="button" class="btn ghost" data-action="open-project" data-id="${htmlEscape(id)}">Wróć</button><button class="btn" type="submit">Zapisz czas</button></div></form>`);
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
 modal('Opis sesji pracy',`<form id="work-note-form" data-id="${htmlEscape(id)}" data-entry="${htmlEscape(entryId)}"><p class="muted small">${htmlEscape(p.title)} · ${durationSecs(e.seconds)}</p><div class="field"><label>Co zostało zrobione?</label><textarea name="note" rows="4" maxlength="350" placeholder="Np. Realizacja zadania i wprowadzone poprawki">${htmlEscape(e.note)}</textarea></div><div class="modal-actions"><button type="button" class="btn ghost" data-action="open-project" data-id="${htmlEscape(id)}">Wróć</button><button type="submit" class="btn">Zapisz opis</button></div></form>`);
}
function projectTaskChecklist(p){
 const list=state.tasks.filter(t=>t.projectId===p.id);
 const complete=list.filter(t=>t.done).length;
 const rows=list.length?list.map(t=>`<div class="workshop-material-row project-checklist-row"><button type="button" class="workflow-check ${t.done?'is-done':''}" data-action="project-task-toggle" data-id="${htmlEscape(p.id)}" data-task="${htmlEscape(t.id)}" aria-label="${t.done?'Cofnij wykonanie':'Oznacz zadanie jako wykonane'}: ${htmlEscape(t.title)}" aria-pressed="${t.done}">${t.done?icon('check'):'○'}</button><span class="${t.done?'stage-completed':''}">${htmlEscape(t.title)}${t.due?` <small>· ${fDate(t.due)}</small>`:''}</span><button type="button" class="btn ghost sm" data-action="edit-task" data-id="${htmlEscape(t.id)}" data-project="${htmlEscape(p.id)}" aria-label="Edytuj zadanie">${icon('pencil')}</button></div>`).join(''):'<p class="muted small">Brak zadań przypisanych do projektu. Dodaj zadanie lub utwórz projekt z szablonu.</p>';
 return `<section class="detail-section project-checklist"><div class="section-head"><h3>Zadania projektu</h3><button class="btn secondary sm" data-action="project-task-add" data-id="${htmlEscape(p.id)}">${icon('plus')} Dodaj zadanie</button></div><p class="muted small">Wykonano ${complete} z ${list.length} zadań. Zadania pojawiają się także na ogólnej liście.</p><div class="workshop-material-list">${rows}</div></section>`;
}
function projectMaterialChecklist(p){
 const list=p.workshopMaterials||[],prepared=list.filter(m=>m.done).length;
 const rows=list.length?list.map(m=>`<div class="workshop-material-row"><button type="button" class="workflow-check ${m.done?'is-done':''}" data-action="workshop-material-toggle" data-id="${htmlEscape(p.id)}" data-material="${htmlEscape(m.id)}" aria-label="${m.done?'Cofnij przygotowanie':'Oznacz jako przygotowane'}: ${htmlEscape(m.title)}" aria-pressed="${m.done}">${m.done?icon('check'):'○'}</button><span class="${m.done?'stage-completed':''}">${htmlEscape(m.title)} <small>× ${m.quantity}</small></span><button type="button" class="btn ghost sm" data-action="workshop-material-remove" data-id="${htmlEscape(p.id)}" data-material="${htmlEscape(m.id)}" aria-label="Usuń materiał">${icon('trash')}</button></div>`).join(''):'<p class="muted small">Dodaj materiały i narzędzia potrzebne do realizacji.</p>';
 return `<section class="detail-section workshop-preparation project-checklist"><div class="section-head"><h3>Materiały i przygotowania</h3><button class="btn secondary sm" data-action="workshop-material-add" data-id="${htmlEscape(p.id)}">${icon('plus')} Dodaj pozycję</button></div><p class="muted small">Przygotowano ${prepared} z ${list.length} pozycji.</p><div class="workshop-material-list">${rows}</div><p class="muted tiny">To lista kontrolna, nie kosztorys — nie zwiększa kwot projektu.</p></section>`;
}
function detailFoldCriticalStyle(){
 // Krytyczne style dołączone do karty. Działają nawet przy starym arkuszu CSS w PWA.
 return '<style id="manu-detail-fold-critical-css">'+
 '.notebook-detail-page .manu-detail-guide{display:block;margin:16px 0 13px;color:#806a5c;font-size:11px;line-height:1.55}'+
 '.notebook-detail-page details.manu-detail-fold{display:block;margin:10px 0;border:1px solid #d0b295;border-radius:12px;background:#f6ebdb;overflow:hidden;color:#47352b;box-shadow:0 2px 5px #6a493016}'+
 '.notebook-detail-page details.manu-detail-fold[open]{border-color:#b98665;background:#f7eddf}'+
 '.notebook-detail-page details.manu-detail-fold>summary.manu-detail-summary{display:grid!important;grid-template-columns:36px minmax(0,1fr) 18px;align-items:center;gap:10px;list-style:none!important;list-style-type:none!important;cursor:pointer;padding:14px 12px;margin:0;min-height:66px;user-select:none}'+
 '.notebook-detail-page details.manu-detail-fold>summary.manu-detail-summary::-webkit-details-marker{display:none!important}'+
 '.notebook-detail-page details.manu-detail-fold>summary.manu-detail-summary::marker{content:""!important;font-size:0}'+
 '.notebook-detail-page .manu-detail-summary:focus-visible{outline:2px solid #ac7451;outline-offset:-3px}'+
 '.notebook-detail-page .manu-detail-icon{width:36px;height:36px;display:grid!important;place-items:center;min-width:0;background:#e9d3ba;border:1px solid #d5b393;border-radius:9px;color:#935a3a}'+
 '.notebook-detail-page .manu-detail-icon .ico{width:18px;height:18px}'+
 '.notebook-detail-page .manu-detail-label{display:flex!important;flex-direction:column!important;gap:4px;align-items:flex-start;min-width:0;overflow-wrap:anywhere}'+
 '.notebook-detail-page .manu-detail-label strong{display:block;font:600 16px/1.26 Georgia,serif;color:#4b342a;overflow-wrap:anywhere}'+
 '.notebook-detail-page .manu-detail-label small{display:block;color:#78685a;font:400 11px/1.4 Inter,Arial,sans-serif;overflow-wrap:anywhere}'+
 '.notebook-detail-page .manu-detail-arrow{display:block;justify-self:center;color:#995f3d;font:400 23px/1 Arial,sans-serif;transition:transform .15s}'+
 '.notebook-detail-page details.manu-detail-fold[open] .manu-detail-arrow{transform:rotate(180deg)}'+
 '.notebook-detail-page .manu-detail-content{display:block;min-width:0;border-top:1px solid #ddc0a6;padding:9px 13px 16px;overflow-wrap:anywhere}'+
 '.notebook-detail-page .manu-detail-content>.detail-section{margin:12px 0}'+
 '.notebook-detail-page .manu-detail-content .section-head{flex-wrap:wrap;gap:8px}'+
 '.notebook-detail-page .manu-detail-content .btn{white-space:normal;max-width:100%}'+
 '@media(max-width:520px){'+
 '.notebook-detail-page details.manu-detail-fold>summary.manu-detail-summary{grid-template-columns:32px minmax(0,1fr) 16px;padding:12px 9px;gap:8px;min-height:61px}'+
 '.notebook-detail-page .manu-detail-icon{width:32px;height:32px}'+
 '.notebook-detail-page .manu-detail-label strong{font-size:15px}'+
 '.notebook-detail-page .manu-detail-label small{font-size:10px}'+
 '.notebook-detail-page .manu-detail-content{padding:7px 9px 13px}'+
 '}'+
 '</style>';
}
function detailFold(p,key,title,desc,content,iconName){
 const opened=detailSectionStates.get(p.id)?.has(key);
 return '<details class="manu-detail-fold" data-project="'+htmlEscape(p.id)+
 '" data-section="'+htmlEscape(key)+'" '+(opened?'open':'')+'>'+
 '<summary class="manu-detail-summary"><span class="manu-detail-icon">'+icon(iconName)+'</span>'+
 '<span class="manu-detail-label"><strong>'+htmlEscape(title)+'</strong><small>'+htmlEscape(desc)+'</small></span>'+
 '<span class="manu-detail-arrow" aria-hidden="true">⌄</span></summary>'+
 '<div class="manu-detail-content">'+content+'</div></details>';
}
function projectCostDetails(p){return `<div class="detail-section"><div class="section-head"><h3>Koszty projektu</h3><button class="btn sm secondary" data-action="add-expense" data-id="${htmlEscape(p.id)}">${icon('plus')} Dodaj koszt</button></div>${p.expenses.length?p.expenses.map(e=>`<div class="detail-entry"><span>${htmlEscape(e.title)} <small>· ${expenseCategoryName(e.category)} ${e.date?'· '+htmlEscape(e.date):'· bez daty'}</small></span><div><b>${fMoney(e.amount)}</b> <button class="btn ghost sm" data-action="delete-expense" data-id="${htmlEscape(p.id)}" data-expense="${htmlEscape(e.id)}" aria-label="Usuń koszt">${icon('trash')}</button></div></div>`).join(''):travelCost(p)>0?'':'<p class="muted small">Brak dodanych kosztów.</p>'}${estimatedTravelApplied(p)>0?`<div class="detail-entry travel-cost-entry"><span>Planowany dojazd <small>(wyliczony automatycznie)</small></span><b>${fMoney(travelCost(p))}</b></div><p class="muted tiny">Szacowany koszt dojazdu jest już uwzględniony w wyniku projektu. Nie dodawaj tej samej kwoty ponownie jako wydatek ręczny.</p>`:''}</div>`;}
function projectToolsMarkup(p){return `<div class="detail-section"><button class="btn secondary" data-action="quote-new" data-project="${htmlEscape(p.id)}">${icon('brief')} Przygotuj wycenę</button> <button class="btn secondary" data-action="template-save-from-project" data-id="${htmlEscape(p.id)}">${icon('copy')} Zapisz jako szablon</button> <button class="btn secondary" data-action="duplicate-project" data-id="${htmlEscape(p.id)}">${icon('copy')} Powiel projekt / warsztat</button></div><div class="danger-zone"><button class="btn danger sm" data-action="delete-project" data-id="${htmlEscape(p.id)}">${icon('trash')} Usuń projekt</button></div>`;}
function projectDetail(id){
 if(!manuHandlingPopState&&manuBackGuardReady&&manuNestedModalHistoryDepth>0&&
    modalReturnStack.at(-1)?.projectId===id&&window.history?.state?.manuNestedModal===1){
  manuPendingProjectRefreshId=id;window.history.back();return;
 }
 const p=state.projects.find(p=>p.id===id);if(!p)return;let cost=expenses(p),perHour=p.hours?profit(p)/p.hours:0;const projectTasks=state.tasks.filter(t=>t.projectId===p.id);const materialTotal=(p.workshopMaterials||[]).length;const prepared=(p.workshopMaterials||[]).filter(m=>m.done).length;modal(p.title,`${detailFoldCriticalStyle()}<div class="detail-top"><div class="detail-badges"><span class="pill">${htmlEscape(p.type)}</span>${pillStatus(p)}</div>${p.clientId&&state.clients.some(c=>c.id===p.clientId)?`<button class="btn ghost sm" data-action="open-client" data-id="${htmlEscape(p.clientId)}">${icon('users')} Karta klienta</button>`:''}<button class="btn secondary sm" data-action="edit-project" data-id="${htmlEscape(p.id)}">${icon('pencil')} Edytuj</button></div><p class="muted small">${p.type==='Warsztat'?`Klient: ${htmlEscape(p.client||'Nie podano')} · Organizator: ${htmlEscape(p.organizer||'Nie podano')}`:`${htmlEscape(p.client||'Bez wskazanego klienta')}`} · ${fDate(p.date)}</p><div class="detail-metrics"><div><small>Wartość</small><b>${fMoney(projectIncome(p))}</b></div><div><small>Koszty</small><b>${fMoney(cost)}</b></div><div><small>Po kosztach</small><b class="${profit(p)>=0?'money-positive':'money-negative'}">${fMoney(profit(p))}</b></div></div><div class="detail-metrics"><div><small>Wpłacono</small><b>${fMoney(projectPaid(p))}</b></div><div><small>Czas pracy</small><b>${fHours(p.hours)} h</b></div><div><small>Za godzinę</small><b>${p.hours?fMoney(perHour):'—'}</b></div></div>${projectSpecificDetail(p)}<p class="muted small manu-detail-guide">Wybierz sekcję, aby zobaczyć szczegóły. Możesz otworzyć kilka jednocześnie.</p>
${detailFold(p,'progress','Etapy i czas pracy',progressPercent(p)+'% etapów · '+fHours(p.hours)+' godz. pracy',workSection(p),'clock')}
${detailFold(p,'tasks','Zadania projektu',projectTasks.filter(t=>t.done).length+' z '+projectTasks.length+' wykonanych',projectTaskChecklist(p),'checks')}
${p.type==='Warsztat'?detailFold(p,'participants','Uczestnicy i wpłaty',confirmedParticipants(p).length+' zapisanych · '+waitlistedParticipants(p).length+' rezerwowych',showParticipants(p),'users'):''}
${detailFold(p,'materials',p.type==='Warsztat'?'Przygotowanie warsztatu':'Materiały i przygotowania',prepared+' z '+materialTotal+' przygotowanych'+(p.type==='Warsztat'?' · podsumowanie':''),p.type==='Warsztat'?workshopOperations(p):projectMaterialChecklist(p),'folder')}
${detailFold(p,'finance','Finanse i koszty','Koszty '+fMoney(cost)+' · do otrzymania '+fMoney(Math.max(0,projectIncome(p)-projectPaid(p))),financeDetail(p)+projectCostDetails(p),'wallet')}
${detailFold(p,'gallery','Galeria i notatki',String((p.photos||[]).length)+' zdjęć'+(p.notes?' · notatki':''),(window.MANUGallery?.album?.(p)||'')+'<section class="detail-section"><h3>Notatki</h3><p class="muted small">'+(p.notes?htmlEscape(p.notes):'Brak notatek.')+'</p></section>','folder')}
${detailFold(p,'tools','Dodatkowe działania','Wycena, szablony, powielanie i usuwanie',projectToolsMarkup(p),'settings')}`,{detail:true,projectId:p.id});
 if(!manuProjectSectionHistoryActive&&manuProjectModalHistoryActive&&
    $('.modal')?.querySelector('details.manu-detail-fold[open]'))armManuProjectSectionHistory();
 void window.MANUGallery?.hydrate?.($('#modal-root'));}
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
 modal('Nowy wydatek',`<form id="expense-form" data-id="${htmlEscape(id)}"><p class="muted small">${htmlEscape(p.title)}</p><div class="field"><label>Nazwa wydatku *</label><input name="title" maxlength="100" required placeholder="Np. Zakup materiałów, wynajem, dojazd"></div><div class="form-cols"><div class="field"><label>Kwota (zł) *</label><input name="amount" required type="number" step="0.01" min="0.01"></div><div class="field"><label>Data poniesienia kosztu *</label><input name="date" type="date" required value="${localDay()}"></div></div><div class="field"><label>Kategoria</label><select name="category"><option value="materialy">Materiały</option><option value="uslugi">Usługi / podwykonawcy</option><option value="dojazd">Dojazd faktyczny</option><option value="inne">Inne</option></select></div><p class="form-note">Dojazd faktyczny zastępuje wyliczony koszt szacunkowy. Nie doliczaj tego samego transportu drugi raz.</p><div class="modal-actions"><button type="button" class="btn ghost" data-action="open-project" data-id="${htmlEscape(id)}">Wróć</button><button class="btn" type="submit">Zapisz wydatek</button></div></form>`);
}
function participantForm(id,pid=''){
 const project=state.projects.find(p=>p.id===id);if(!project||project.type!=='Warsztat')return;
 const person=project.participants.find(x=>x.id===pid),fee=person?person.fee:money(project.participantFee);
 const newWaitlist=!person&&freePlaces(project)===0,waitlisted=person?.bookingStatus==='waitlist'||newWaitlist;
 modal(person?'Edytuj zapis uczestnika':'Nowy zapis na warsztat',`<form id="participant-form" data-id="${htmlEscape(id)}" data-participant="${htmlEscape(pid)}"><p class="muted small">${htmlEscape(project.title)}</p>${newWaitlist?'<div class="form-note workshop-queue-notice">Limit miejsc został osiągnięty. Nowy uczestnik zostanie dopisany do listy rezerwowej bez wpłaty.</div>':''}${person?`<p class="muted small">Status: ${waitlisted?'Lista rezerwowa':'Potwierdzony uczestnik'}</p>`:''}<div class="field"><label>Imię lub pseudonim *</label><input name="name" required maxlength="100" value="${person?htmlEscape(person.name):''}" placeholder="Np. Uczestnik 1"></div><div class="form-cols"><div class="field"><label>Cena udziału (zł)</label><input name="fee" type="number" required min="0" step="0.01" value="${fee}"></div><div class="field"><label>Wpłacono wcześniej, bez historii (zł)</label><input name="paidAmount" type="number" required min="0" step="0.01" value="${person?money(person.paidAmount):0}" ${waitlisted?'readonly':''}></div></div><div class="form-note">${waitlisted?'Lista rezerwowa nie przyjmuje wpłat. Potwierdź miejsce, gdy się zwolni.':'Starsze wpłaty wpisuj w polu wyżej. Nowe zaliczki i dopłaty dodawaj przyciskiem „Wpłata” przy uczestniku, aby ich nie liczyć dwukrotnie.'}${person?.legacyPaid?' W starej wersji wysokość wpłaty nie była znana — zweryfikuj kwotę.':''}</div><div class="modal-actions"><button type="button" class="btn ghost" data-action="open-project" data-id="${htmlEscape(id)}">Wróć</button><button class="btn" type="submit">${person?'Zapisz zmiany':'Zapisz osobę'}</button></div></form>`);
}
function taskForm(t,fromProjectId=''){
 const edit=!!t,selected=t||{title:'',due:view==='calendar'?calendarSelected:'',projectId:fromProjectId};
 modal(edit?'Edytuj zadanie':'Nowe zadanie',`<form id="task-form" data-id="${htmlEscape(t?.id||'')}" data-return-project="${htmlEscape(fromProjectId)}"><div class="field"><label>Co trzeba zrobić? *</label><input name="title" required maxlength="180" value="${htmlEscape(selected.title)}" placeholder="Np. Przygotować ofertę lub materiały"></div><div class="field"><label>Termin</label><input name="due" type="date" value="${htmlEscape(selected.due||'')}"></div><div class="field"><label>Powiązany projekt</label><select name="projectId"><option value="">Bez projektu</option>${state.projects.map(p=>`<option value="${htmlEscape(p.id)}" ${selected.projectId===p.id?'selected':''}>${htmlEscape(p.title)}</option>`).join('')}</select></div><div class="modal-actions"><button type="button" class="btn ghost" data-action="close">Anuluj</button><button class="btn" type="submit">${edit?'Zapisz zmiany':'Dodaj zadanie'}</button></div></form>`);
}
function toast(message){const root=$('#toast-root');root.innerHTML=`<div class="toast">${htmlEscape(message)}</div>`;clearTimeout(toast.timer);toast.timer=setTimeout(()=>root.innerHTML='',2900);}

/* MANU 16.3 — odizolowana sesja demo w pamięci RAM. Po zamknięciu aplikacji
   lub wyjściu z trybu demo pozostaje wyłącznie prawdziwy zapis użytkownika. */
function demoSnapshot(){
 const day=localDay(),future=days=>plusDaysDate(day,days);
 const draft=blank();
 draft.clients=[
  {id:'demo-klient-1',name:'Pracownia Przykład',company:'Studio Demo',email:'demo@example.test',phone:'',address:'',notes:'Fikcyjny klient',createdAt:now()},
  {id:'demo-klient-2',name:'Uczestnik przykładowy',company:'',email:'',phone:'',address:'',notes:'Dane demonstracyjne',createdAt:now()}
 ];
 draft.projects=[
  {id:'demo-zlecenie',title:'Projekt dla klienta (demo)',type:'Zlecenie',
   client:'Pracownia Przykład',clientId:'demo-klient-1',date:future(14),paymentDue:future(9),
   status:'W trakcie',price:550,paid:100,quantity:1,estimatedMaterials:105,
   payments:[{id:'demo-zaliczka',date:day,amount:150,kind:'zaliczka',note:'Przykładowa wpłata'}],
   expenses:[{id:'demo-koszt',title:'Materiały do realizacji',amount:95,date:day,category:'materialy'}],
   notes:'Wszystkie dane tej sesji są fikcyjne i znikają po wyjściu.',createdAt:now()},
  {id:'demo-warsztat',title:'Warsztaty tematyczne (demo)',type:'Warsztat',status:'Planowane',
   date:future(21),paymentDue:future(15),price:500,capacity:5,participantFee:150,
   financeMode:'participants',participants:[
    {id:'demo-osoba-a',name:'Osoba A (demo)',fee:150,bookingStatus:'confirmed',paidAmount:0,
     payments:[{id:'demo-plat-a',amount:50,kind:'zaliczka',date:day}]},
    {id:'demo-osoba-b',name:'Osoba B (demo)',fee:150,bookingStatus:'confirmed',paidAmount:0,payments:[]}
   ],expenses:[{id:'demo-koszt-w',title:'Materiały na zajęcia',amount:65,date:day,category:'materialy'}],
   notes:'Przykład bez danych osobowych.',createdAt:now()}
 ];
 draft.tasks=[{id:'demo-zadanie',title:'Przygotować materiały do realizacji (demo)',due:future(3),done:false,projectId:'demo-zlecenie',createdAt:now()}];
 draft.quotes=[{id:'demo-wycena',number:'MANU-'+day.slice(0,4)+'-001',title:'Wycena projektu (demo)',
  client:'Pracownia Przykład',projectId:'demo-zlecenie',issued:day,documentType:'quote',
  items:[{id:'demo-pozycja',description:'Wykonanie projektu na zamówienie',quantity:1,unit:'szt.',unitPrice:550}],
  discount:0,createdAt:now()}];
 return normalize(draft);
}
async function beginDemo(){
 if(demoSession)return;
 if(storageBlocked){alert('Zapis lokalny jest wstrzymany. Najpierw zabezpiecz swoje dane w Ustawieniach.');return;}
 if($('.modal')||quoteSubmissionPending){toast('Zamknij bieżący formularz przed rozpoczęciem demo.');return;}
 await writeQueue;
 if(storageBlocked||$('.modal')||window.MANUCloud?.isBusy?.()){toast('Zakończ zapisy lub kontrolę chmury przed uruchomieniem demo.');return;}
 window.MANUCloud?.pauseForDemo?.();
 demoSession={realState:state,realView:view,realScrollX:window.scrollX,realScrollY:window.scrollY,
  homeReturnContext,projectReturnContext,projectToolsExpanded,history:[...manuPageHistory]};
 isDemo=true;
 state=demoSnapshot();
 view='home';homeReturnContext=null;projectReturnContext=null;projectToolsExpanded=false;
 manuPageHistory.length=0;
 render();window.scrollTo(0,0);
 toast('Tryb DEMO: pracujesz wyłącznie na fikcyjnych danych.');
}
function endDemo(){
 if(!demoSession)return;
 const before=demoSession;
 closeModal();
 state=before.realState;view=before.realView;
 homeReturnContext=before.homeReturnContext;projectReturnContext=before.projectReturnContext;
 projectToolsExpanded=before.projectToolsExpanded;
 manuPageHistory.length=0;manuPageHistory.push(...before.history);
 demoSession=null;isDemo=false;
 render();window.scrollTo(before.realScrollX,before.realScrollY);
 window.MANUCloud?.resumeAfterDemo?.();
 toast('Zamknięto demo. Przywrócono Twój prawdziwy notes.');
}
function demoSettingsPage(){
 return pageHeading('Tryb demonstracyjny','To tylko przykładowe dane w pamięci telefonu.')
  +'<div class="surface settings-group"><h3>Bezpieczne testowanie MANU</h3>'
  +'<p>Możesz tworzyć projekty, zadania, warsztaty i oferty na fikcyjnych danych. Żadne zmiany nie są zapisywane do prawdziwej bazy ani wysyłane do chmury.</p>'
  +'<p class="form-note">Wyjście lub ponowne uruchomienie MANU usuwa zmiany demonstracyjne. Konta, synchronizacja, galeria chmurowa i kopie JSON są w tym trybie niedostępne.</p>'
  +'<button type="button" class="btn" data-action="demo-exit">Zakończ demo i wróć do swoich danych</button>'+testerGuideMarkup()+'</div>';
}
function demoBanner(){
 return demoSession?'<div class="manu-demo-banner" role="status"><span><strong>TRYB DEMO</strong><small>Dane fikcyjne · bez zapisu i chmury</small></span>'
  +'<button type="button" data-action="demo-exit" class="btn sm">Zakończ demo</button></div>':'';
}


/* MANU 16.4 — instrukcja testów zewnętrznych, bez odczytu danych użytkownika. */
function testerGuideMarkup(){
 return `<details class="smart-settings manu-tester-guide">
  <summary>${icon('checks')} Plan pierwszego testu · 10 minut</summary>
  <div class="smart-settings-content">
   <p class="small">Przetestuj MANU na <strong>własnym telefonie</strong>. Nie używaj konta ani telefonu osoby zapraszającej.</p>
   <ol class="manu-tester-steps">
    <li>Otwórz link do MANU na swoim telefonie. Opcjonalnie zainstaluj aplikację na ekranie głównym.</li>
    <li>Wejdź w <strong>Ustawienia → Testowanie aplikacji</strong> i uruchom <strong>bezpieczny tryb demo</strong>.</li>
    <li>Otwórz przykładowe zlecenie i dodaj fikcyjny koszt lub zmień status.</li>
    <li>Otwórz przykładowy warsztat, sprawdź uczestników i rozliczenia.</li>
    <li>Otwórz wycenę, sprawdź podgląd, przycisk zamknięcia oraz systemowy Wstecz.</li>
    <li>Zakończ demo i sprawdź, czy próbne zmiany zniknęły.</li>
   </ol>
   <p class="muted tiny">Wpisuj tylko fikcyjne dane. W demo nie testujemy kont, chmury ani prawdziwych płatności. Opinia nie jest wysyłana automatycznie.</p>
   <div class="settings-actions manu-tester-actions">
    <button type="button" class="btn secondary" data-action="tester-invite">${icon('copy')} Udostępnij zaproszenie</button>
    <button type="button" class="btn secondary" data-action="tester-report">${icon('checks')} Przygotuj opinię</button>
   </div>
  </div>
 </details>`;
}
function manuTesterInvite(){
 return [
  'Zapraszam do przetestowania MANU — Organizera twórcy.',
  'Link: https://artystaakrobata.github.io/Pracownia-app/',
  'Na własnym telefonie otwórz Ustawienia → Testowanie aplikacji, uruchom bezpieczny tryb demo i rozwiń „Plan pierwszego testu”.',
  'Sprawdź fikcyjne zlecenie, warsztat, wycenę i nawigację. Nie wpisuj prawdziwych danych klientów.',
  'Na koniec wybierz „Przygotuj opinię” i odeślij wynik osobie, która Cię zaprosiła.'
 ].join(String.fromCharCode(10));
}
function manuTesterReport(){
 return [
  'OPINIA Z TESTU MANU v'+APP_VERSION,
  'Telefon / system: [wpisz]',
  'Przeglądarka lub PWA: [wpisz]',
  'Start i uruchomienie demo: [OK / PROBLEM]',
  'Edycja fikcyjnego zlecenia: [OK / PROBLEM]',
  'Warsztat i rozliczenia: [OK / PROBLEM]',
  'Wycena i podgląd: [OK / PROBLEM]',
  'Przycisk X i systemowy Wstecz: [OK / PROBLEM]',
  'Zakończenie demo: [OK / PROBLEM]',
  'Co było niejasne: [wpisz]',
  'Jak odtworzyć problem: [kroki]',
  'Propozycja usprawnienia: [wpisz]',
  'Nie dołączaj prywatnych danych ani niezredagowanych zrzutów ekranu.'
 ].join(String.fromCharCode(10));
}
async function shareManuTesterText(kind){
 const invite=kind==='invite',message=invite?manuTesterInvite():manuTesterReport();
 const title=invite?'MANU — zaproszenie do testów':'MANU — opinia po teście';
 if(typeof navigator.share==='function'){
  try{
   await navigator.share({title,text:message});
   return;
  }catch(e){if(e?.name==='AbortError')return;}
 }
 try{
  if(!navigator.clipboard?.writeText)throw Error('Schowek niedostępny');
  await navigator.clipboard.writeText(message);
  toast(invite?'Skopiowano zaproszenie. Wyślij je testerowi.':'Skopiowano wzór opinii. Uzupełnij go i wyślij osobie prowadzącej test.');
 }catch(e){
  if(typeof window.prompt==='function')window.prompt('Skopiuj poniższy tekst:',message);
  else toast('Nie udało się udostępnić tekstu na tym urządzeniu.');
 }
}

function validateBackup(raw){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('To nie jest kopia danych MANU');
 // Nie obcinamy po cichu nieograniczonych list w przywracanym pliku.
 const checkList=(list,max,label)=>{
  if(list==null)return [];
  if(!Array.isArray(list)||list.length>max)
   throw Error('Nieprawidłowa lub zbyt długa lista: '+label+' (maks. '+max+').');
  return list;
 };
 if(raw.lastSaved!=null&&!validTime(raw.lastSaved))
  throw Error('Nieprawidłowa data ostatniego zapisu w kopii.');
 if(!Array.isArray(raw.projects)||!Array.isArray(raw.tasks))throw Error('Brakuje listy projektów lub zadań');
 if(raw.reminders!=null&&(!Array.isArray(raw.reminders)||raw.reminders.length>3000||raw.reminders.some(r=>!r||typeof r!=='object'||typeof r.title!=='string'||!validDate(r.date))))throw Error('Nieprawidłowa lista przypomnień');
 if(raw.smartAlerts!=null&&(!raw.smartAlerts||typeof raw.smartAlerts!=='object'||Array.isArray(raw.smartAlerts)||(raw.smartAlerts.snoozed!=null&&(!raw.smartAlerts.snoozed||typeof raw.smartAlerts.snoozed!=='object'||Array.isArray(raw.smartAlerts.snoozed)||Object.keys(raw.smartAlerts.snoozed).length>400))))throw Error('Nieprawidłowe ustawienia inteligentnych przypomnień');
 if(raw.version!=null&&(!Number.isInteger(raw.version)||raw.version<1||raw.version>18))throw Error('Nieobsługiwana wersja pliku. Nie nadpisano danych.');
 if(raw.quotes!=null&&(!Array.isArray(raw.quotes)||raw.quotes.length>3000||raw.quotes.some(q=>!q||typeof q!=='object'||typeof q.title!=='string'||(q.items!=null&&(!Array.isArray(q.items)||q.items.length>80||q.items.some(i=>!i||typeof i!=='object'||typeof i.description!=='string'))))))throw Error('Nieprawidłowa lista wycen');
 if(raw.templates!=null&&(!Array.isArray(raw.templates)||raw.templates.length>300||raw.templates.some(x=>!x||typeof x!=='object'||Array.isArray(x)||typeof x.name!=='string'||!Array.isArray(x.stages)||!Array.isArray(x.expenses)||x.stages.length>40||x.expenses.length>40||(x.tasks!=null&&(!Array.isArray(x.tasks)||x.tasks.length>50))||(x.materials!=null&&(!Array.isArray(x.materials)||x.materials.length>100)))))throw Error('Nieprawidłowa lista szablonów');
 if(raw.clients!=null&&(!Array.isArray(raw.clients)||raw.clients.length>5000||raw.clients.some(c=>!c||typeof c!=='object'||Array.isArray(c)||typeof c.name!=='string')))throw Error('Nieprawidłowa lista klientów');
 if(raw.projects.length>10000||raw.tasks.length>25000)throw Error('Plik zawiera zbyt wiele rekordów');
 for(const p of raw.projects){
  if(!p||typeof p!=='object'||Array.isArray(p)||typeof p.title!=='string')throw Error('Nieprawidłowy rekord projektu');
  if(p.expenses!=null&&(!Array.isArray(p.expenses)||p.expenses.some(e=>!e||typeof e!=='object'||Array.isArray(e))))throw Error('Nieprawidłowa lista kosztów');
  if(p.photos!=null&&(!Array.isArray(p.photos)||p.photos.length>50||p.photos.some(photo=>!photo||typeof photo!=='object'||Array.isArray(photo)||typeof photo.path!=='string'||! /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\.jpg$/.test(photo.path))))throw Error('Nieprawidłowa galeria projektu');
  checkList(p.expenses,5000,'koszty projektu');
  checkList(p.stages,40,'etapy projektu');
  checkList(p.workLog,2500,'sesje pracy projektu');
  checkList(p.activityLog,200,'historia projektu');
  checkList(p.workshopMaterials,150,'materiały przygotowań');
  const payments=checkList(p.payments,3000,'wpłaty projektu');
  if(payments.some(x=>!x||typeof x!=='object'||Array.isArray(x)))throw Error('Nieprawidłowe wpłaty projektu');
  const people=checkList(p.participants,5000,'uczestnicy projektu');
  if(people.some(a=>!a||typeof a!=='object'||Array.isArray(a)))throw Error('Nieprawidłowa lista uczestników');
  for(const person of people){
   const records=checkList(person.payments,3000,'wpłaty uczestnika');
   if(records.some(x=>!x||typeof x!=='object'||Array.isArray(x)))
    throw Error('Nieprawidłowa lista wpłat uczestnika');
  }
 }
 for(const t of raw.tasks)if(!t||typeof t!=='object'||Array.isArray(t)||typeof t.title!=='string')throw Error('Nieprawidłowy rekord zadania');
 return normalize(raw);
}
function backupSummary(data){
 const workshops=data.projects.filter(p=>p.type==='Warsztat').length;
 return {projects:data.projects.length,templates:(data.templates||[]).length,photos:data.projects.reduce((n,p)=>n+(p.photos?.length||0),0),clients:(data.clients||[]).length,workshops,tasks:data.tasks.length,participants:data.projects.reduce((n,p)=>n+(p.participants?.length||0),0),quotes:(data.quotes||[]).length};
}
function backupDownload(){
 const exportedAt=now(),data={...state,exportedAt,app:'MANU',appVersion:APP_VERSION};
 const json=JSON.stringify(data,null,2),url=URL.createObjectURL(new Blob([json],{type:'application/json'}));
 const el=document.createElement('a'),stamp=exportedAt.replace(/:/g,'-').slice(0,19);
 el.href=url;el.download='manu-kopia-'+stamp+'.json';document.body.appendChild(el);
 try{el.click();toast('Przygotowano kopię JSON (bez plików zdjęć). Zachowaj ją poza telefonem.')}
 finally{el.remove();setTimeout(()=>URL.revokeObjectURL(url),3000)}
}
function exportData(){try{backupDownload()}catch(e){alert('Nie udało się pobrać kopii: '+String(e.message||e))}}
function showBackupPreview(){
 if(!pendingBackup)return;
 const item=pendingBackup,current=backupSummary(state),next=backupSummary(item.snapshot);
 const title=item.mode==='check'?'Sprawdzenie kopii MANU':item.mode==='recovery'?'Poprzedni zapis MANU':'Przywracanie kopii MANU';
 const action=item.mode==='check'?'':'<button class="btn" type="button" data-action="backup-apply">'+icon('upload')+' Zastąp obecne dane</button>';
 const summary='<p class="muted small">'+htmlEscape(item.filename)+'</p><div class="backup-preview-info"><strong>'+(item.mode==='check'?'Plik został odczytany poprawnie.':'Sprawdzono strukturę danych. Przed przywróceniem porównaj zawartość.')+'</strong>'
 +'<p>Obecnie w MANU: <b>'+current.projects+' projektów</b>, '+current.clients+' klientów, '+current.tasks+' zadań, '+current.participants+' uczestników, '+current.quotes+' wycen, '+current.templates+' szablonów, '+current.photos+' opisów zdjęć.</p>'
 +'<p>W wybranej kopii: <b>'+next.projects+' projektów</b>, '+next.clients+' klientów, w tym '+next.workshops+' warsztatów, '+next.tasks+' zadań, '+next.participants+' uczestników, '+next.quotes+' wycen, '+next.templates+' szablonów, '+next.photos+' opisów zdjęć.</p>'
 +'<p class="muted small">Zapis kopii: '+htmlEscape(item.snapshot.lastSaved||'Brak daty')+'. Sprawdź liczbę zapisanych rekordów. Plik JSON przechowuje opisy i ścieżki zdjęć, ale nie kopiuje fotografii z Supabase Storage.</p></div>';
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
 if(window.MANUCloud?.isBusy?.()){
  alert('Trwa operacja chmury. Zakończ synchronizację przed przywróceniem kopii.');
  return;
 }
 backupApplying=true;
 try{
  const restored=structuredClone(data.snapshot),ok=await save(restored,true);
  if(!ok){alert('Nie udało się zapisać przywracanych danych. Obecny stan pozostawiono bez zmian.');return}
  state=restored;
  pendingBackup=null;
  // Przywrócenie kopii lokalnej nie zezwala automatycznie na nadpisanie chmury.
  window.MANUCloud?.localRestored?.();
  closeModal();render();
  toast('Przywrócono dane na urządzeniu. Przed synchronizacją wybierz, którą kopię zachować.');
 }finally{backupApplying=false}
}
function afterDataChange(msg,detailId){
 // Aktualizuj kalendarz w miejscu: bez animacji kartki i bez przewijania na górę.
 if(view==='calendar'&&!detailId){
  const persisted=save();
  refreshCalendarPanel();
  if(msg)void persisted.then(ok=>{if(ok)toast(msg)});
  return;
 }
 // Aktualizacja etapów odświeża całą kartę projektu. Nie może jednak
 // przenosić czytelnika na początek strony ani restartować animacji kartki.
 const before=$('.modal');
 const preserve=!!(detailId&&before?.classList?.contains('notebook-detail-page'));
 const oldScroll=preserve?before.scrollTop:0;
 const oldPageX=window.scrollX,oldPageY=window.scrollY;
 const active=preserve?document.activeElement:null;
 const control=active?.dataset?.action?{...active.dataset}:null;
 const persisted=save();
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
 // Potwierdzamy udany zapis dopiero po zatwierdzeniu go przez pamięć.
 if(msg)void persisted.then(ok=>{if(ok)toast(msg)});
}

/* MANU 13.6 — gest Wstecz na Androidzie, bez przeładowania SPA i bez zmian bazy. */
const manuPageHistory=[];
let manuBackGuardReady=false;
let manuProjectModalHistoryActive=false;
let manuProjectSectionHistoryActive=false,manuNestedModalHistoryDepth=0,manuQuoteFormHistoryActive=false;
let manuGalleryPreviewHistoryActive=false;
function armManuGalleryPreviewHistory(){
 if(!manuBackGuardReady||manuGalleryPreviewHistoryActive)return false;
 try{window.history.pushState({manuGalleryPreview:1},'');manuGalleryPreviewHistoryActive=true;return true}
 catch(e){console.warn('MANU: historia podglądu zdjęcia',e);return false}
}
function requestManuGalleryPreviewClose(){
 if(manuGalleryPreviewHistoryActive&&window.history?.state?.manuGalleryPreview===1){
  window.history.back();return true;
 }
 manuGalleryPreviewHistoryActive=false;return false;
}
let manuHandlingPopState=false,manuPendingHistoryTrim=null,manuPendingProjectRefreshId='';
function armManuProjectSectionHistory(){
 if(!manuBackGuardReady||!manuProjectModalHistoryActive||manuProjectSectionHistoryActive)return false;
 try{window.history.pushState({manuProjectSection:1},'');manuProjectSectionHistoryActive=true;return true}
 catch(e){console.warn('MANU: brak wpisu sekcji',e);return false}
}
function armManuNestedModalHistory(){
 if(!manuBackGuardReady)return false;
 try{window.history.pushState({manuNestedModal:1},'');manuNestedModalHistoryDepth++;return true}
 catch(e){console.warn('MANU: brak wpisu formularza',e);return false}
}
function trimManuHistory(steps){
 if(!manuBackGuardReady||steps<1||!window.history?.go)return false;
 try{manuPendingHistoryTrim={after:null};window.history.go(-steps);return true}
 catch(e){manuPendingHistoryTrim=null;console.warn('MANU: nie można skrócić historii',e);return false}
}
function armManuProjectModalHistory(){
 if(!manuBackGuardReady||manuProjectModalHistoryActive)return false;
 try{
  window.history.pushState({manuProjectModal:1},'');
  manuProjectModalHistoryActive=true;
  return true;
 }catch(e){
  console.warn('MANU: brak wpisu historii karty projektu',e);
  return false;
 }
}
function releaseManuProjectModalHistory(){
 // Nazwa historyczna: wpis obecnie dotyczy każdego samodzielnego okna.
 if(!manuProjectModalHistoryActive)return;
 manuProjectModalHistoryActive=false;
 // Zamknięcie przez X nie wykonuje wstecz. Zamieniamy zajmowany wpis
 // karty na zwykły wpis MANU: kolejne Wstecz przejdzie Projekty → Start.
 // Gdy zamknięcie nastąpiło przez systemowy Wstecz, przeglądarka już
 // przeszła do poprzedniego wpisu i niczego nie dodajemy ani nie zamieniamy.
 if(window.history?.state?.manuProjectModal===1){
  try{
   window.history.replaceState({manuBackGuard:1},'');
  }catch(e){console.warn('MANU: nie udało się oznaczyć zamkniętej karty',e)}
 }
}
function rememberManuPage(){
 if(!manuBackGuardReady)return;
 manuPageHistory.push({
  view,top:window.scrollY,
  home:homeReturnContext?{...homeReturnContext}:null,
  project:projectReturnContext?{...projectReturnContext}:null,
  tools:projectToolsExpanded
 });
 if(manuPageHistory.length>30)manuPageHistory.shift();
 // Android wymaga prawdziwego wpisu historii dla KAŻDEJ kartki.
 // Ponowne dodawanie jednego strażnika wewnątrz popstate działało niestabilnie.
 if(!armManuBackGuard())manuBackGuardReady=false;
}
function consumeManuReturn(page){
 if(manuBackGuardReady&&manuPageHistory.at(-1)?.view===page)manuPageHistory.pop();
}
function armManuBackGuard(){
 try{
  window.history.pushState({manuBackGuard:1},'');
  return true;
 }catch(e){
  console.warn('MANU: historia wstecz niedostępna',e);
  return false;
 }
}
function onManuBack(event){
 if(!manuBackGuardReady)return;
 if(manuPendingHistoryTrim){
  const after=manuPendingHistoryTrim.after;manuPendingHistoryTrim=null;
  if(typeof after==='function')window.setTimeout?.(after,0);return;
 }
 manuHandlingPopState=true;
 try{
  const inManuHistory=event.state?.manuBackGuard===1||event.state?.manuBackRoot===1;
  if(!inManuHistory&&!$('.modal')&&!manuPageHistory.length&&view==='home'&&
     !manuGalleryPreviewHistoryActive)return;
  // Zdjęcie jest najwyższą warstwą: Wstecz zamyka tylko podgląd, nie kartę.
  if(manuGalleryPreviewHistoryActive){
   manuGalleryPreviewHistoryActive=false;
   // Nawet gdy zdjęcie zamknięto wcześniej, zużyj tylko wpis podglądu.
   if(window.MANUGallery?.isPreviewOpen?.())window.MANUGallery.closePreview();
   return;
  }
  if(manuQuoteFormHistoryActive&&$('#quote-form')){
   manuQuoteFormHistoryActive=false;
   manuNestedModalHistoryDepth=Math.max(0,manuNestedModalHistoryDepth-1);
   returnToQuotePreview();return;
  }
  if(modalReturnStack.length&&manuNestedModalHistoryDepth>0){
   manuNestedModalHistoryDepth--;
   restorePreviousModal();
   if(manuPendingProjectRefreshId){
    const id=manuPendingProjectRefreshId;manuPendingProjectRefreshId='';
    const parent=$('.modal');
    detailReturnScroll={projectId:id,top:parent?.scrollTop||0,pageX:window.scrollX,pageY:window.scrollY};
    projectDetail(id);
   }
   return;
  }
  // Pierwszy Android Wstecz z rozwiniętej sekcji pozostawia kartę projektu.
  if(manuProjectSectionHistoryActive&&event.state?.manuProjectModal===1&&
     $('.modal')?.classList.contains('notebook-detail-page')){
   manuProjectSectionHistoryActive=false;
   const m=$('.modal'),top=m.scrollTop;
   m.querySelectorAll('details.manu-detail-fold[open]').forEach(el=>{el.open=false});
   m.scrollTop=top;return;
  }
  let keepCurrentPage=false;
  if(window.MANUGallery?.isPreviewOpen?.()){window.MANUGallery.closePreview();keepCurrentPage=true}
  else if($('.modal')){
   const consumedProjectModalEntry=manuProjectModalHistoryActive;
   const returnedToPreview=returnToQuotePreview();
   if(!returnedToPreview)closeModal();
   else if(consumedProjectModalEntry)manuProjectModalHistoryActive=false;
   keepCurrentPage=!consumedProjectModalEntry||returnedToPreview;
  }else if(manuPageHistory.length){
   const previous=manuPageHistory.pop();view=previous.view;
   homeReturnContext=previous.home;projectReturnContext=previous.project;
   projectToolsExpanded=previous.tools;notebookTurn='';
   render();window.scrollTo({left:0,top:previous.top,behavior:'instant'});
  }else if(view!=='home'){
   view='home';homeReturnContext=null;projectReturnContext=null;notebookTurn='';
   render();window.scrollTo({left:0,top:0,behavior:'instant'});
  }else return;
  if((keepCurrentPage||!inManuHistory)&&!armManuBackGuard())manuBackGuardReady=false;
 }finally{manuHandlingPopState=false}
}
function initManuBackGuard(){
 if(!window.history?.pushState||!window.history?.replaceState)return;
 try{
  // Przy każdym uruchomieniu PWA tworzymy świeżą parę root + guard.
  // Przestarzały manuBackGuard w odtworzonej sesji nie dowodzi istnienia
  // rzeczywistego poprzedniego wpisu w historii przeglądarki.
  const existing=window.history.state&&typeof window.history.state==='object'?window.history.state:{};
  const {manuBackGuard:oldGuard,manuBackRoot:oldRoot,manuProjectModal:oldModal,manuProjectSection:oldSection,manuNestedModal:oldNested,manuGalleryPreview:oldGallery,...other}=existing;
  window.history.replaceState({...other,manuBackRoot:1},'');
  if(!armManuBackGuard())return;
  manuBackGuardReady=true;
  window.addEventListener('popstate',onManuBack);
 }catch(e){
  console.warn('MANU: nie można obsłużyć systemowego Wstecz',e);
 }
}

function handleAction(b){let action=b.dataset.action,id=b.dataset.id;
 if(demoSession && (String(action).startsWith('cloud-')||String(action).startsWith('gallery-')
   ||['export','import','backup-check','backup-recovery','backup-apply','clear',
       'storage-persist','pwa-reload','install','pwa-check-update','offline-check','security-audit'].includes(action))){
  toast('Ta funkcja jest niedostępna w DEMO. Wybierz „Zakończ demo”, aby wrócić do swoich danych.');
  return;
 }
 switch(action){case 'tester-invite':void shareManuTesterText('invite');break;case 'tester-report':void shareManuTesterText('report');break;case 'template-back':case 'template-new':case 'template-edit':case 'template-save-from-project':case 'template-cancel':case 'template-add-cost':case 'template-remove-cost':case 'template-use':case 'template-delete':{window.MANUTemplates?.handleAction?.(b);break;}case 'gallery-add':case 'gallery-edit':case 'gallery-preview':case 'gallery-delete':case 'gallery-return':case 'gallery-open-project':case 'gallery-close':{window.MANUGallery?.handleAction?.(b);break;}case 'cloud-upload':case 'cloud-download':case 'cloud-check':case 'cloud-backup':case 'cloud-signout':case 'cloud-forgot':case 'cloud-send-reset':{void window.MANUCloud?.action?.(action);break;}case 'nav':{
 if(b.dataset.view==='add'){projectForm();return;}
 const previous=view,next=b.dataset.view;
 // Powrót tylko po użyciu skrótu na Start; zwykłe zakładki nie pokazują dodatkowego przycisku.
 const fromHomeShortcut=previous==='home'&&['projects','tasks','finance','calendar'].includes(next)&&!!b.closest('.command-center, .home-recent');
 const fromProject=previous==='projects'&&['clients','quotes','gallery','templates'].includes(next);
 if(fromProject)projectToolsExpanded=!!document.querySelector('details.project-tools-more')?.open;
 if(previous!==next)rememberManuPage();
 projectReturnContext=fromProject?{page:next,top:window.scrollY}:null;
 // Zachowaj ścieżkę Start → Projekty → podstrona, aby działały oba powroty.
 if(!(fromProject&&homeReturnContext?.page==='projects'))homeReturnContext=fromHomeShortcut?{page:next,top:window.scrollY}:null;
 const notebookOrder={home:0,projects:1,clients:2,gallery:3,templates:4,quotes:5,finance:6,tasks:7,calendar:8};
 notebookTurn=previous!==next&&['home','settings'].includes(previous)&&Object.hasOwn(notebookOrder,next)?'open':
   Object.hasOwn(notebookOrder,previous)&&Object.hasOwn(notebookOrder,next)&&previous!==next
    ?notebookOrder[next]>notebookOrder[previous]?'next':'prev':'';
 view=next;
 window.scrollTo(0,0);
 render();
 break;
}case 'return-projects':{
 if(!['clients','quotes','gallery','templates'].includes(view))break;
 const top=projectReturnContext?.page===view?projectReturnContext.top:0;
 // Użyj tego samego mechanizmu co gest Androida: cofa UI oraz wpis historii.
 if(manuBackGuardReady&&manuPageHistory.at(-1)?.view==='projects'){
  window.history.back();
  break;
 }
 consumeManuReturn('projects');
 projectReturnContext=null;
 notebookTurn='';view='projects';
 render();
 window.scrollTo({left:0,top,behavior:'instant'});
 break;
}case 'return-home':{
  if(!homeReturnContext||view!==homeReturnContext.page)break;
  const top=homeReturnContext.top;
  if(manuBackGuardReady&&manuPageHistory.at(-1)?.view==='home'){
   window.history.back();
   break;
  }
  consumeManuReturn('home');
  homeReturnContext=null;
  notebookTurn='';view='home';
  render();
  window.scrollTo({left:0,top,behavior:'instant'});
  break;
}case 'quote-fill-project':{
 const form=$('#quote-form'),pid=form?.querySelector('[name="projectId"]')?.value;
 const p=state.projects.find(x=>x.id===pid);
 if(!form||!p)return;
 if(!confirm('Wstawić tytuł, klienta i cenę z projektu? Obecne pozycje wyceny oraz rabat zostaną zastąpione. Rozliczenia projektu pozostaną bez zmian.'))break;
 const c=state.clients.find(x=>x.id===p.clientId);
 const fields=c?quoteClientFields(c):{client:p.client||'',clientContact:'',clientAddress:''};
 form.querySelector('[name="title"]').value=('Wycena — '+p.title).slice(0,140);
 for(const [name,value] of Object.entries(fields))form.querySelector('[name="'+name+'"]').value=value;
 form.querySelector('[name="discount"]').value='0';
 const lines=$('#quote-lines');if(lines)lines.innerHTML=quoteItemRow(quoteProjectItem(p));
 const clientSelect=$('#quote-client-source');if(clientSelect)clientSelect.value=c?.id||'';
 refreshQuoteTotal();toast('Wstawiono dane projektu. Sprawdź cenę oferty.');
 break;
}
case 'quote-fill-client':{
 const form=$('#quote-form'),cid=$('#quote-client-source')?.value;
 const c=state.clients.find(x=>x.id===cid);
 if(!form||!c){toast('Najpierw wybierz klienta z bazy.');break;}
 const fields=quoteClientFields(c),current=form.querySelector('[name="client"]')?.value||'';
 if(current.trim()&&current.trim()!==fields.client&&!confirm('Zastąpić obecne dane odbiorcy wyceny danymi wybranego klienta?'))break;
 for(const [name,value] of Object.entries(fields))form.querySelector('[name="'+name+'"]').value=value;
 toast('Wstawiono dane klienta do formularza.');
 break;
}
case 'quote-add-hint':{
 const form=$('#quote-form'),pid=form?.querySelector('[name="projectId"]')?.value;
 const p=state.projects.find(x=>x.id===pid),hint=quoteCostHints(p)[Number(b.dataset.index)];
 const lines=$('#quote-lines');if(!form||!lines||!hint)return;
 if(lines.querySelectorAll('[data-quote-row]').length>=80){toast('Maksymalnie 80 pozycji wyceny.');break;}
 lines.insertAdjacentHTML('beforeend',quoteItemRow({description:hint.description,quantity:hint.quantity,unit:'szt.',unitPrice:0}));
 refreshQuoteTotal();toast('Dodano opis z ceną 0 zł. Sprawdź ją: koszt projektu to nie cena sprzedaży.');
 break;
}
case 'quote-new':quoteModalReturn=null;quoteForm(b.dataset.project||'');break;case 'quote-cancel':{if(returnToQuotePreview())break;const projectId=b.dataset.project||'';if(projectId&&detailReturnScroll?.projectId===projectId)projectDetail(projectId);else closeModal();break;}
case 'quote-preview':quotePreview(id);break;
case 'quote-edit':{const q=(state.quotes||[]).find(x=>x.id===id);if(q){rememberQuotePreview(q.id);quoteForm(q.projectId,q.id)}break;}
case 'quote-clone':{
 const q=(state.quotes||[]).find(x=>x.id===id);
 if(!q)return;
 if(state.quotes.length>=3000){alert('Osiągnięto limit 3000 wycen.');break;}
 rememberQuotePreview(q.id);
 quoteForm('', '', q.id);
 break;
}
case 'quote-fill-issuer':{
 const form=$('#quote-form'),last=quoteLastIssuer();
 if(!form||!last){toast('Brak wcześniej zapisanych danych wystawiającego.');break;}
 const issuer=form.querySelector('[name="issuer"]'),contact=form.querySelector('[name="issuerContact"]');
 if(!issuer||!contact)break;
 const different=(issuer.value.trim()&&issuer.value.trim()!==(last.issuer||''))
  ||(contact.value.trim()&&contact.value.trim()!==(last.issuerContact||''));
 if(different&&!confirm('Zastąpić obecne dane wystawiającego informacjami z ostatniej zapisanej wyceny?'))break;
 issuer.value=last.issuer||'';
 contact.value=last.issuerContact||'';
 toast('Wstawiono dane pracowni. Sprawdź je przed wysłaniem dokumentu.');
 break;
}
case 'quote-add-line':{
 const form=$('#quote-form'),box=$('#quote-lines');
 if(box&&form){
  if(box.querySelectorAll('[data-quote-row]').length>=80){alert('Maksymalnie 80 pozycji.');return}
  box.insertAdjacentHTML('beforeend',quoteItemRow());
  const newRow=box.lastElementChild;
  // Pokazuj tylko nowy wiersz, nie przewijaj całego formularza do początku.
  newRow?.scrollIntoView?.({block:'nearest',behavior:'instant'});
  newRow?.querySelector('input[name="description"]')?.focus({preventScroll:true});
  refreshQuoteTotal();
 }
 break;
}
case 'quote-remove-line':{
 const row=b.closest('.quote-line'),box=$('#quote-lines');
 if(row&&box){
  if(box.querySelectorAll('[data-quote-row]').length>1){
   const scroller=row.closest('.modal'),previousScroll=scroller?.scrollTop??0;
   row.remove();refreshQuoteTotal();
   if(scroller)scroller.scrollTop=Math.min(previousScroll,Math.max(0,scroller.scrollHeight-scroller.clientHeight));
  }else toast('Wycena musi mieć co najmniej jedną pozycję.');
 }
 break;
}
case 'quote-delete':{const q=(state.quotes||[]).find(x=>x.id===id);if(q&&confirm('Usunąć wycenę '+q.number+'? Jej kopię można odzyskać tylko z backupu.')){const top=window.scrollY;state.quotes=state.quotes.filter(x=>x.id!==id);save();render();window.scrollTo(0,top);toast('Usunięto wycenę')}break;}
case 'quote-print':{const q=(state.quotes||[]).find(x=>x.id===id);if(!q)return;const dest=$('#quote-print-root');if(!dest){alert('Nie można przygotować wydruku. Odśwież MANU.');return}dest.innerHTML=quoteDocument(q);try{window.print()}catch(e){alert('Urządzenie nie otworzyło drukowania: '+String(e.message||e))}break;}
case 'project-draft-clear':clearProjectDraft();projectForm();break;case 'new-project':projectForm();break;case 'client-new-project':projectForm(null,id);break;case 'client-new':clientForm();break;case 'client-edit':clientForm(state.clients.find(c=>c.id===id));break;case 'open-client':clientDetail(id);break;case 'client-delete':deleteClient(id);break;case 'client-import':importLegacyClients();break;case 'timer-start':startTimer(id);break;case 'timer-pause':pauseTimer(id);break;case 'timer-stop':finishTimer(id);break;case 'stage-toggle':toggleStage(id,b.dataset.stage);break;case 'stage-add':stageForm(id);break;case 'stage-remove':removeStage(id,b.dataset.stage);break;case 'work-add':workEntryForm(id);break;case 'work-remove':removeWork(id,b.dataset.entry);break;case 'work-note':workNoteForm(id,b.dataset.entry);break;case 'open-project':projectDetail(id);break;case 'edit-project':projectForm(state.projects.find(p=>p.id===id));break;case 'close':dismissCurrentModal();break;case 'close-overlay':dismissCurrentModal();break;case 'new-task':taskForm();break;case 'project-task-add':taskForm(null,id);break;case 'project-task-toggle':{const t=state.tasks.find(x=>x.id===b.dataset.task&&x.projectId===id);if(t){t.done=!t.done;afterDataChange(t.done?'Zadanie wykonane':'Przywrócono zadanie',id)}break;}case 'edit-task':taskForm(state.tasks.find(x=>x.id===id),b.dataset.project||'');break;case 'calendar-prev':calendarShift(-1);break;case 'calendar-next':calendarShift(1);break;case 'calendar-today':calendarSelected=localDay();calendarMonth=calendarSelected.slice(0,7);refreshCalendarPanel();break;case 'calendar-day':{const date=validDate(b.dataset.date);if(date){calendarSelected=date;calendarMonth=date.slice(0,7);refreshCalendarPanel()}break;}case 'calendar-jump':{const date=validDate(b.dataset.date);if(!date)return;calendarSelected=date;calendarMonth=date.slice(0,7);if(view!=='calendar')rememberManuPage();view='calendar';render();break;}case 'smart-snooze':{
 const ev=calendarEvents().find(x=>x.key===b.dataset.event&&x.date===b.dataset.date&&!x.done);
 if(!ev||!state.smartAlerts?.enabled)break;
 const until=plusDaysDate(localDay(),1),snoozed=state.smartAlerts.snoozed||{};
 snoozed[ev.key+'|'+ev.date]=until;
 state.smartAlerts.snoozed=Object.fromEntries(Object.entries(snoozed).slice(-400));
 afterDataChange('Przypomnienie odłożone do jutra');
 break;
}
case 'reminder-add':reminderForm('',b.dataset.date||'');break;case 'reminder-edit':reminderForm(id);break;case 'reminder-delete':{const r=(state.reminders||[]).find(x=>x.id===id);if(r&&confirm('Usunąć przypomnienie „'+r.title+'”?')){state.reminders=state.reminders.filter(x=>x.id!==id);afterDataChange('Usunięto przypomnienie')}break;}case 'calendar-reminder':{const r=(state.reminders||[]).find(x=>x.id===id);if(r){r.done=!r.done;afterDataChange(r.done?'Przypomnienie zrealizowane':'Przypomnienie ponownie aktywne')}break;}case 'calendar-task':{const t=state.tasks.find(x=>x.id===id);if(t){t.done=!t.done;afterDataChange('Zapisano zadanie')}break;}case 'toggle-task':{let t=state.tasks.find(x=>x.id===id);if(t){t.done=!t.done;afterDataChange()};break;}case 'delete-task':if(confirm('Usunąć zadanie?')){state.tasks=state.tasks.filter(x=>x.id!==id);afterDataChange('Zadanie usunięte')}break;case 'task-filter':{
 const selected=b.dataset.filter;
 if(!['open','done','all'].includes(selected))break;
 taskFilter=selected;listVisible.tasks=LIST_BATCH_SIZE;
 const list=$('#task-list');
 if(list)list.innerHTML=renderTaskList();
 document.querySelectorAll('[data-action="task-filter"]').forEach(button=>
  button.classList.toggle('active',button.dataset.filter===taskFilter));
 break;
}
case 'list-more':{
 const which=b.dataset.list;
 if(!Object.hasOwn(listVisible,which))break;
 const target=$(which==='projects'?'#project-list':which==='clients'?'#client-list':'#task-list');
 const footer=target?.querySelector('.manu-list-more');
 if(!footer)break;
 const previous=listVisible[which];
 listVisible[which]+=LIST_BATCH_SIZE;
 // Doklej tylko następną partię. Istniejące kafelki, fokus i pozycja strony pozostają.
 const extra=which==='projects'?renderProjectGrid(previous):which==='clients'?renderClientList(previous):renderTaskList(previous);
 footer.insertAdjacentHTML('afterend',extra);
 footer.remove();
 break;
}case 'payment-control-open':{
 const p=state.projects.find(x=>x.id===id);
 if(!p)return;
 const target=p.type==='Warsztat'&&p.financeMode==='participants'?'participants':'finance';
 let sections=detailSectionStates.get(id);
 if(!sections){sections=new Set();detailSectionStates.set(id,sections);}
 sections.add(target);projectDetail(id);break;
}
case 'payment-control-more':{
 paymentControlVisible=Math.min(10000,paymentControlVisible+12);
 const results=$('#payment-control-results');if(results)results.innerHTML=paymentControlRows();
 break;
}
case 'payment-add':paymentForm(id,b.dataset.participant||'');break;case 'payment-delete':{const p=state.projects.find(x=>x.id===id),pid=b.dataset.participant;const owner=pid?p?.participants?.find(x=>x.id===pid):p;const item=owner?.payments?.find(x=>x.id===b.dataset.payment);if(item&&confirm('Usunąć wpłatę '+fMoney(item.amount)+'? Kwota zostanie odjęta z rozliczenia.')){owner.payments=owner.payments.filter(x=>x.id!==item.id);recordActivity(p,'Usunięto wpis wpłaty '+fMoney(item.amount));afterDataChange('Usunięto wpłatę',id)}break;}case 'add-expense':expenseForm(id);break;case 'delete-expense':{let p=state.projects.find(p=>p.id===id);if(p&&confirm('Usunąć ten koszt?')){p.expenses=p.expenses.filter(x=>x.id!==b.dataset.expense);afterDataChange('Koszt usunięty',id)}break;}case 'workshop-attendance':setWorkshopAttendance(id,b.dataset.participant,b.dataset.attendance);break;case 'workshop-promote':promoteWorkshopParticipant(id,b.dataset.participant);break;case 'workshop-waitlist':moveWorkshopToWaitlist(id,b.dataset.participant);break;case 'workshop-material-add':workshopMaterialForm(id);break;case 'workshop-material-toggle':toggleWorkshopMaterial(id,b.dataset.material);break;case 'workshop-material-remove':removeWorkshopMaterial(id,b.dataset.material);break;case 'workshop-finish':finishWorkshop(id);break;case 'add-participant':participantForm(id);break;case 'edit-participant':participantForm(id,b.dataset.participant);break;case 'finance-mode':{let p=state.projects.find(p=>p.id===id);if(!p||p.type!=='Warsztat')break;const enable=p.financeMode!=='participants';if(confirm(enable?'Liczyć wartość i wpłaty warsztatu na podstawie uczestników? Dotychczasowe ręczne kwoty zostaną zachowane, ale nie będą dodawane do tych sum.':'Wrócić do ręcznie wpisanych kwot warsztatu? Dane uczestników zostaną zachowane.')){p.financeMode=enable?'participants':'manual';afterDataChange('Zmieniono sposób rozliczania warsztatu',id)}break;}case 'delete-participant':{const p=state.projects.find(x=>x.id===id),person=p?.participants.find(x=>x.id===b.dataset.participant);if(!person)break;const received=participantPaid(person);const warning='Usunąć '+person.name+'? '+(received>0?'Uwaga: zapisane wpłaty '+fMoney(received)+' oraz ich historia zostaną usunięte z rozliczenia. W razie zwrotu pieniędzy najpierw zadbaj o własną dokumentację. ':'')+(person.bookingStatus!=='waitlist'&&waitlistedParticipants(p).length?'Zwolni się miejsce do potwierdzenia dla osoby z kolejki.':'');if(confirm(warning)){p.participants=p.participants.filter(x=>x.id!==person.id);recordActivity(p,'Usunięto zapis uczestnika: '+person.name);afterDataChange('Usunięto uczestnika',id)}break;}case 'duplicate-project':{let p=state.projects.find(p=>p.id===id);if(!p)return;let clone=structuredClone(p);clone.id=uid();clone.title=p.title+' (kopia)';clone.date='';clone.paymentDue='';clone.status='Planowane';clone.paid=0;clone.payments=[];clone.hours=0;clone.stages=(clone.stages||defaultStages(clone.type)).map(st=>({...st,done:false}));clone.workLog=[];clone.activityLog=[];clone.photos=[];clone.timer={startedAt:'',seconds:0};clone.expenses=clone.expenses.map(x=>({...x,id:uid(),date:''}));clone.participants=[];clone.workshopMaterials=(clone.workshopMaterials||[]).map(x=>({...x,id:uid(),done:false}));clone.createdAt=now();state.projects.push(clone);closeModal();afterDataChange('Utworzono kopię projektu');
 if(manuPendingHistoryTrim)manuPendingHistoryTrim.after=()=>projectDetail(clone.id);
 else projectDetail(clone.id);
 break;}case 'delete-project':if((state.projects.find(p=>p.id===id)?.photos||[]).length){alert('Najpierw usuń zdjęcia z galerii projektu, aby nie pozostawić osieroconych plików w chmurze.');break;}if(confirm('Usunąć projekt? Tego nie można cofnąć bez kopii zapasowej.')){state.projects=state.projects.filter(x=>x.id!==id);state.tasks=state.tasks.map(t=>t.projectId===id?{...t,projectId:''}:t);state.reminders=state.reminders.map(r=>r.projectId===id?{...r,projectId:''}:r);closeModal();afterDataChange('Projekt usunięty')}break;case 'demo':case 'demo-start':void beginDemo();break;case 'demo-exit':endDemo();break;case 'export':exportData();break;case 'import':importData();break;case 'backup-check':importData('check');break;case 'backup-recovery':recoverPrevious();break;case 'backup-apply':applyBackup();break;case 'storage-persist':(async()=>{try{if(!navigator.storage?.persist){toast('Ta przeglądarka nie udostępnia tej funkcji.');return}const granted=await navigator.storage.persist();toast(granted?'Przeglądarka zaakceptowała trwalsze przechowywanie danych.':'Przeglądarka nie przyznała trwalszej pamięci. Pamiętaj o kopiach JSON.')}catch(e){toast('Nie udało się sprawdzić ochrony danych.')}})();break;case 'clear':if(state.projects.some(p=>(p.photos||[]).length)){alert('Masz zdjęcia w chmurze. Usuń je najpierw z poszczególnych projektów. Nie wymazano danych.');break;}if(confirm('Usunąć WSZYSTKIE dane? Jeśli synchronizacja jest aktywna, zmiana może trafić również do chmury. Najpierw pobierz kopię JSON!')&&confirm('Ostatnie potwierdzenie: na pewno usunąć wszystkie projekty, szablony, klientów, koszty, uczestników i zadania?')){state=blank();afterDataChange('Dane usunięte')}break;case 'install':if(installEvent){
 const event=installEvent;installEvent=null;
 event.prompt();
 event.userChoice.finally(()=>refreshPwaPanel());
}break;
case 'ui-quick-move':{
  const current=uiPreferences.quickActions;
  const from=current.indexOf(id);
  const to=b.dataset.direction==='up'?from-1:b.dataset.direction==='down'?from+1:-1;
  if(from<0||to<0||to>=current.length)break;
  const next=[...current];
  [next[from],next[to]]=[next[to],next[from]];
  if(updateUiPreferences({quickActions:next})){
   const order=$('.manu-quick-order');
   if(order)order.innerHTML=quickActionOrderMarkup();
   toast('Zmieniono kolejność szybkich działań');
  }else toast('Nie udało się zapisać kolejności skrótów');
  break;
 }
 case 'ui-prefs-reset':{
  if(updateUiPreferences(DEFAULT_UI_PREFS)){
   const panel=$('.manu-personalization');
   if(panel)panel.outerHTML=personalizationMarkup();
   toast('Przywrócono ustawienia domyślne MANU');
  }else toast('Nie udało się przywrócić ustawień personalizacji');
  break;
 }
 case 'pwa-check-update':void checkPwaUpdate();break;
case 'offline-check':void checkOfflineReadiness();break;case 'security-audit':void runSecurityAudit();break;
case 'pwa-reload':void reloadPwaSafely();break;
}}
async function handleSubmit(form){let data=new FormData(form),id=form.dataset.id;switch(form.id){case 'client-form':{const existing=state.clients.find(c=>c.id===id);const name=String(data.get('name')||'').trim().slice(0,120);const email=String(data.get('email')||'').trim().slice(0,180);if(!name){alert('Podaj nazwę klienta.');return;}if(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){alert('Sprawdź adres e-mail.');return;}if(!existing&&state.clients.length>=5000){alert('Osiągnięto limit kart klientów.');return;}const fields={name,company:String(data.get('company')||'').trim().slice(0,120),email,phone:String(data.get('phone')||'').trim().slice(0,50),address:String(data.get('address')||'').trim().slice(0,280),notes:String(data.get('notes')||'').trim().slice(0,2500)};let client;if(existing){Object.assign(existing,fields);client=existing;}else{client={...fields,id:uid(),createdAt:now()};state.clients.push(client);}for(const p of state.projects)if(p.clientId===client.id)p.client=client.name;closeModal();afterDataChange(existing?'Zaktualizowano kartę klienta':'Dodano klienta');
 if(manuPendingHistoryTrim)manuPendingHistoryTrim.after=()=>clientDetail(client.id);
 else clientDetail(client.id);
 break;}case 'quote-form':{
 if(quoteSubmissionPending)return;
 const quoteId=String(form.dataset.quote||''),existing=(state.quotes||[]).find(q=>q.id===quoteId);
 if(quoteId&&!existing){alert('Ta wycena nie istnieje już w pamięci MANU. Skopiuj treść formularza przed zamknięciem.');return;}
 const title=String(data.get('title')||'').trim().slice(0,140),issued=validDate(data.get('issued')),rawValidity=String(data.get('validUntil')||''),validUntil=validDate(rawValidity);
 const projectId=String(data.get('projectId')||''),items=quoteFormItems(form);
 const discountRaw=Number(data.get('discount')||0);
 if(!title||!issued||(rawValidity&&!validUntil)||(!Number.isFinite(discountRaw))||discountRaw<0){alert('Podaj prawidłowy tytuł, daty i rabat.');return}
 if(validUntil&&validUntil<issued){alert('Data ważności nie może być wcześniejsza niż data wystawienia.');return}
 if(projectId&&!state.projects.some(p=>p.id===projectId)){alert('Wybrany projekt nie istnieje.');return}
 if(!items.length||items.length>80||items.some(i=>!i.description||!i.unit||!Number.isFinite(i.quantity)||i.quantity<=0||i.quantity>100000||!Number.isFinite(i.unitPrice)||i.unitPrice<0||i.unitPrice>100000000)){alert('Sprawdź ilości, ceny i nazwy pozycji wyceny.');return}
 const sub=quoteSubtotal({items}),discount=money(discountRaw);
 if(!Number.isFinite(sub)||sub>1e10||discount>sub){alert('Rabat nie może przekraczać sumy pozycji.');return}
 const update={title,issued,validUntil,projectId,discount,items,issuer:String(data.get('issuer')||'').trim().slice(0,180),issuerContact:String(data.get('issuerContact')||'').trim().slice(0,350),client:String(data.get('client')||'').trim().slice(0,180),clientContact:String(data.get('clientContact')||'').trim().slice(0,350),clientAddress:String(data.get('clientAddress')||'').trim().slice(0,280),
 documentType:data.get('documentType')==='offer'?'offer':'quote',
 documentStyle:data.get('documentStyle')==='minimal'?'minimal':'classic',
 introduction:String(data.get('introduction')||'').trim().slice(0,1000),
 deliveryTerms:String(data.get('deliveryTerms')||'').trim().slice(0,360),
 paymentTerms:String(data.get('paymentTerms')||'').trim().slice(0,360),
 notes:String(data.get('notes')||'').trim().slice(0,900)};
 const previousQuotes=structuredClone(state.quotes);
 const previousCounters={...state.quoteCounters};
 let quote;
 if(existing){Object.assign(existing,update);quote=existing}
 else{if(state.quotes.length>=3000){alert('Osiągnięto limit 3000 wycen.');return}quote={...update,id:uid(),number:quoteNewNumber(),createdAt:now()};state.quotes.push(quote);const quoteYear=quote.number.slice(5,9);state.quoteCounters=state.quoteCounters||{};state.quoteCounters[quoteYear]=Number(quote.number.slice(10))}
 // Nie potwierdzaj zapisu i nie zamykaj formularza, zanim baza go zatwierdzi.
 // Jeśli zapis się nie uda, przywróć poprzedni rejestr i zachowaj otwarty formularz.
 const submitButton=form.querySelector('button[type="submit"]');
 quoteSubmissionPending=true;
 if(submitButton)submitButton.disabled=true;
 let saved=false;
 try{saved=await save();}
 catch(e){console.error('MANU: wyjątek podczas zapisu wyceny',e);saved=false;}
 finally{
  quoteSubmissionPending=false;
  if(submitButton)submitButton.disabled=false;
 }
 if(!saved){
  state.quotes=previousQuotes;
  state.quoteCounters=previousCounters;
  alert('Nie zapisano wyceny. Formularz pozostał otwarty — sprawdź pamięć w Ustawieniach i zrób kopię danych przed zamknięciem MANU.');
  return;
 }
 const scrollY=window.scrollY;
 closeModal();view='quotes';render();window.scrollTo(0,scrollY);
 // Tworzenie podglądu dopiero po cofnięciu wpisu formularza.
 const openSavedQuote=()=>{quotePreview(quote.id);toast(existing?'Zapisano zmiany wyceny':'Zapisano nową wycenę')};
 if(manuPendingHistoryTrim)manuPendingHistoryTrim.after=openSavedQuote;
 else openSavedQuote();
 break;
}case 'project-form':{const templateId=String(form.dataset.template||'');const selectedTemplate=templateId?window.MANUTemplates?.findTemplate?.(templateId):null;const title=String(data.get('title')||'').trim();if(!title){alert('Podaj nazwę projektu');return;}const existing=state.projects.find(p=>p.id===id);const previousStatus=existing?.status;
 if(!existing&&state.projects.length>=10000){alert('Osiągnięto limit 10 000 projektów MANU. Zrób kopię danych i uporządkuj archiwum.');return;}
 const fieldsType=data.get('type')==='Warsztat'?'Warsztat':'Zlecenie';const clientId=String(data.get('clientId')||'');const selectedClient=state.clients.find(c=>c.id===clientId);if(clientId&&!selectedClient){alert('Wybrana karta klienta nie istnieje.');return;}const fields={title,type:data.get('type')==='Warsztat'?'Warsztat':'Zlecenie',client:(selectedClient?.name||String(data.get('client')||'').trim()).slice(0,120),clientId:selectedClient?.id||'',organizer:(fieldsType==='Warsztat'?String(data.get('organizer')??existing?.organizer??'').trim().slice(0,120):String(existing?.organizer||'')),date:validDate(data.get('date')),paymentDue:validDate(data.get('paymentDue')),status:validStatus.includes(data.get('status'))?data.get('status'):'Planowane',price:fieldsType==='Warsztat'&&existing?.type==='Warsztat'&&existing.financeMode==='participants'?existing.price:money(data.get('price')??existing?.price),paid:fieldsType==='Warsztat'&&existing?.type==='Warsztat'&&existing.financeMode==='participants'?existing.paid:money(data.get('paid')??existing?.paid),participantFee:money(data.get('participantFee')??existing?.participantFee),hours:val(fieldsType==='Warsztat'?data.get('workshopHours'):data.get('hours')),capacity:Math.floor(val(data.get('capacity')??existing?.capacity)),quantity:Math.max(1,Math.floor(val(data.get('quantity')??existing?.quantity??1))),estimatedHours:val((fieldsType==='Warsztat'?data.get('workshopEstimatedHours'):data.get('estimatedHours'))??existing?.estimatedHours),estimatedMaterials:money(data.get('estimatedMaterials')??existing?.estimatedMaterials),workLocation:String(data.get('workLocation')??existing?.workLocation??'').trim().slice(0,220),transportType:['none','car','paid'].includes(data.get('transportType'))?data.get('transportType'):(existing?transportType(existing):'none'),paidTransportCost:money(data.get('paidTransportCost')??existing?.paidTransportCost),paidTransportLabel:String(data.get('paidTransportLabel')??existing?.paidTransportLabel??'').trim().slice(0,100),travelKm:val(data.get('travelKm')??existing?.travelKm),travelMode:data.get('travelMode')==='rate'?'rate':'fuel',fuelConsumption:val(data.get('fuelConsumption')??existing?.fuelConsumption),fuelPrice:money(data.get('fuelPrice')??existing?.fuelPrice),travelRate:money(data.get('travelRate')??existing?.travelRate),travelExtra:money(data.get('travelExtra')??existing?.travelExtra),location:String(data.get('location')??existing?.location??'').trim(),startTime:String(data.get('startTime')??existing?.startTime??''),durationHours:val(data.get('durationHours')??existing?.durationHours),notes:String(data.get('notes')||'').trim()};if(existing&&fields.type==='Warsztat'&&fields.capacity>0&&confirmedParticipants(existing).length>fields.capacity){alert('Limit miejsc nie może być mniejszy niż liczba potwierdzonych uczestników ('+confirmedParticipants(existing).length+').');return}if(existing){const wasWorkshop=existing.type==='Warsztat';Object.assign(existing,fields);if(fields.type!=='Warsztat')existing.financeMode='manual';else if(!wasWorkshop)existing.financeMode='participants'}else{
 const matches=selectedTemplate&&selectedTemplate.type===fields.type;
 const addTasks=matches?window.MANUTemplates.seededTasks(selectedTemplate,''):[]; 
 if(state.tasks.length+addTasks.length>25000){alert('Zbyt wiele zadań w MANU. Nie utworzono projektu.');return;}
 const newId=uid();
 for(const t of addTasks)t.projectId=newId;
 state.projects.push({...fields,id:newId,financeMode:fields.type==='Warsztat'?'participants':'manual',
 expenses:matches?window.MANUTemplates.seededCosts(selectedTemplate):[],
 participants:[],workshopMaterials:matches?window.MANUTemplates.seededMaterials(selectedTemplate):[],
 photos:[],createdAt:now(),
 stages:matches&&selectedTemplate.stages.length?
  window.MANUTemplates.seededStages(selectedTemplate):defaultStages(fields.type,fields.status),
 workLog:[],activityLog:[],timer:{startedAt:'',seconds:0}});
 if(addTasks.length)state.tasks.push(...addTasks);
}if(existing&&fields.status!==previousStatus)recordActivity(existing,'Zmiana statusu: '+fields.status);closeModal();afterDataChange(existing?'Zapisano zmiany':'Dodano nowy projekt');break;}case 'work-note-form':{const p=state.projects.find(x=>x.id===id),entry=p?.workLog?.find(e=>e.id===form.dataset.entry);if(!entry)return;entry.note=String(data.get('note')||'').trim().slice(0,350);recordActivity(p,'Uzupełniono opis sesji');afterDataChange('Opis sesji zapisany',id);break;}case 'stage-form':{
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
 if(!p||!title||!Number.isInteger(q)||q<1||q>9999){alert('Podaj nazwę i liczbę przygotowywanych materiałów.');return}
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
 if(projectId&&!state.projects.some(p=>p.id===projectId)){alert('Wybrany projekt już nie istnieje. Odśwież formularz zadania.');return;}
 if(!original&&state.tasks.length>=25000){alert('Osiągnięto limit 25 000 zadań MANU.');return;}
 if(original)Object.assign(original,{title,due,projectId});else state.tasks.push({id:uid(),title,due,done:false,projectId,createdAt:now()});
 if(view==='calendar'&&due){calendarSelected=due;calendarMonth=due.slice(0,7)}
 const returnProject=String(form.dataset.returnProject||'');
 // Formularz otwarty z projektu wraca do tej karty bez zamykania projektu.
 if(returnProject&&modalReturnStack.at(-1)?.projectId===returnProject&&manuNestedModalHistoryDepth>0)
  afterDataChange(original?'Zapisano zadanie':'Zadanie dodane',returnProject);
 else{closeModal();afterDataChange(original?'Zapisano zadanie':'Zadanie dodane',returnProject||undefined)}
 break;
}case 'reminder-form':{
 const title=String(data.get('title')||'').trim().slice(0,180),date=validDate(data.get('date')),rawTime=String(data.get('time')||''),time=/^([01]\d|2[0-3]):[0-5]\d$/.test(rawTime)?rawTime:'';
 if(!title||!date||(rawTime&&!time)){alert('Podaj tytuł, prawidłową datę i godzinę');return}
 const original=(state.reminders||[]).find(x=>x.id===id);
 const projectId=String(data.get('projectId')||'');
 if(projectId&&!state.projects.some(p=>p.id===projectId)){alert('Wybrany projekt już nie istnieje. Odśwież formularz przypomnienia.');return;}
 if(original)Object.assign(original,{title,date,time,projectId});
 else{
  if(state.reminders.length>=3000){alert('Limit przypomnień został osiągnięty');return}
  state.reminders.push({id:uid(),title,date,time,projectId,done:false,createdAt:now()});
 }
 if(view==='calendar'){calendarSelected=date;calendarMonth=date.slice(0,7)}
 closeModal();afterDataChange(original?'Przypomnienie zapisane':'Dodano przypomnienie');break;
}}}
// Powrót z tła bez niszczenia otwartego formularza lub pozycji scrolla.
function refreshAfterResume(){
 if(document.visibilityState==='hidden')return;
 const chip=$('.date-chip');
 if(chip)chip.textContent=new Intl.DateTimeFormat('pl-PL',{day:'numeric',month:'short'}).format(new Date());
 refreshNetworkStatus();
 liveTimerRefresh();
 const today=localDay();
 if(today===lastVisibleDay)return;
 // Nie przebudowuj listy, jeśli edytowany jest formularz lub otwarte są szczegóły.
 if($('.modal'))return;
 const scrollX=window.scrollX,scrollY=window.scrollY;
 if(view==='home'){
  const center=$('.command-center');
  if(center)center.outerHTML=commandCenter();
 }else if(view==='calendar'){
  refreshCalendarPanel();
 }
 lastVisibleDay=today;
 if(window.scrollX!==scrollX||window.scrollY!==scrollY)
  window.scrollTo({left:scrollX,top:scrollY,behavior:'instant'});
}
function events(){
 window.addEventListener('beforeunload',e=>{if(pendingWrites>0||storageBlocked){e.preventDefault();e.returnValue='';}});
 // Po powrocie z innej aplikacji nie wykonujemy render() ani nie zamykamy formularzy.
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')writeProjectDraft();else refreshAfterResume()});
 window.addEventListener('pagehide',writeProjectDraft);
 window.addEventListener('pageshow',()=>refreshAfterResume());
 // Przy niepoprawnym polu wewnątrz zwiniętej sekcji rozwiń ją przed komunikatem przeglądarki.
 document.addEventListener('invalid',e=>{
  const field=e.target,modal=field?.closest?.('.modal');
  if(!modal||!field.closest('form'))return;
  let parent=field.parentElement;
  while(parent&&parent!==modal){
   if(parent.tagName==='DETAILS'&&!parent.open)parent.open=true;
   parent=parent.parentElement;
  }
  field.classList?.add('manu-form-invalid');
 },true);
 document.addEventListener('toggle',e=>{const el=e.target;if(el?.matches?.('details.smart-alerts-panel')&&el.isConnected){smartAlertsExpanded=!!el.open;return;}
 if(el?.matches?.('details.project-tools-more')&&el.isConnected){projectToolsExpanded=!!el.open;return;}
 if(el?.matches?.('details.manu-personalization')&&el.isConnected){personalizationExpanded=!!el.open;return;}
 if(el?.matches?.('details.smart-settings')&&el.isConnected){smartSettingsExpanded=!!el.open;return;}
 if(el?.matches?.('details.payment-control-panel')&&el.isConnected){paymentControlExpanded=!!el.open;return;}
 if(el?.matches?.('details.profitability-panel')&&el.isConnected){profitabilityExpanded=!!el.open;return;}
 if(el?.matches?.('details.profitability-compare')&&el.isConnected){compareExpanded=!!el.open;return;}
 if(el?.matches?.('details.cost-category-panel')&&el.isConnected){costBreakdownExpanded=!!el.open;return;}
 if(!el?.matches?.('details.manu-detail-fold')||!el.isConnected)return;const id=el.dataset.project,key=el.dataset.section;if(!id||!key)return;let opened=detailSectionStates.get(id);if(!opened){opened=new Set();detailSectionStates.set(id,opened)}if(el.open)opened.add(key);else opened.delete(key);
 // Ręczne zwinięcie ostatniej sekcji usuwa poziom historii.
 if(!el.open&&manuProjectSectionHistoryActive&&!manuHandlingPopState&&
    !modalReturnStack.length&&window.history?.state?.manuProjectSection===1&&
    !document.querySelector('.notebook-detail-page details.manu-detail-fold[open]'))
  window.history.back();
},true);document.addEventListener('click',e=>{
 const fold=e.target.closest?.('details.manu-detail-fold');
 if(fold&&e.target.closest('summary')===fold.querySelector('summary')&&!fold.open&&
    $('.modal')?.classList.contains('notebook-detail-page'))armManuProjectSectionHistory();
 const b=e.target.closest('[data-action]');if(!b)return;if(b.dataset.action==='close-overlay'&&e.target!==b)return;if(b.classList?.contains('manu-lightbox-backdrop')&&e.target!==b)return;handleAction(b)});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&window.MANUGallery?.isPreviewOpen?.()){
   e.preventDefault();
   if(!requestManuGalleryPreviewClose())window.MANUGallery.closePreview();
   return;
  }if(e.key==='Escape'&&$('.modal'))dismissCurrentModal();if((e.key==='Enter'||e.key===' ')&&e.target.matches('[role="button"][data-action]')){e.preventDefault();handleAction(e.target)}});document.addEventListener('submit',e=>{if(e.target.id==='template-form'){e.preventDefault();window.MANUTemplates?.submit?.(e.target);return;}if(e.target.id==='gallery-photo-form'||e.target.id==='gallery-edit-form'){e.preventDefault();void window.MANUGallery?.submit?.(e.target);return;}if(!['project-form','expense-form','participant-form','task-form','stage-form','work-entry-form','work-note-form','payment-form','workshop-material-form','reminder-form','quote-form','client-form'].includes(e.target.id))return;e.preventDefault();handleSubmit(e.target)});document.addEventListener('input',e=>{if(e.target.closest?.('#project-form'))scheduleProjectDraft();if(e.target.classList?.contains('manu-form-invalid')&&e.target.validity?.valid)e.target.classList.remove('manu-form-invalid');if(e.target.id==='template-search'){window.MANUTemplates?.searchChanged?.(e.target.value);return;}if(e.target.closest?.('#quote-form')&&(e.target.matches('input')||e.target.matches('textarea')))refreshQuoteTotal();if(e.target.id==='client-search'){clientSearch=e.target.value;listVisible.clients=LIST_BATCH_SIZE;const list=$('#client-list');if(list)list.innerHTML=renderClientList();}if(e.target.id==='search-projects'){search=e.target.value;listVisible.projects=LIST_BATCH_SIZE;let list=$('#project-list');if(list)list.innerHTML=renderProjectGrid()}if(e.target.closest?.('#project-form .travel-fields'))syncTravelFields();if(e.target.closest?.('#project-form')&&e.target.matches?.('input[name="capacity"],input[name="participantFee"]'))syncWorkshopPotential()});document.addEventListener('change',e=>{
 if(e.target.id==='payment-control-filter'){
  paymentControlFilter=['all','late','soon','none'].includes(e.target.value)?e.target.value:'all';
  paymentControlVisible=12;
  const results=$('#payment-control-results');if(results)results.innerHTML=paymentControlRows();
  return;
 }
 if(e.target.id==='quote-document-type'){
  const title=$('#quote-form input[name="title"]');
  if(title)title.value=quoteTitleForDocumentType(title.value,e.target.value);
  return;
 }
 if(e.target.id==='quote-form-project'){
  const p=state.projects.find(x=>x.id===e.target.value);
  const hints=$('#quote-project-hints');if(hints)hints.innerHTML=quoteProjectHintsMarkup(p);
  const fill=$('#quote-fill-project');if(fill)fill.disabled=!p;
  return;
 }
 if(e.target.matches?.('input[data-manu-quick]')){
  const id=e.target.dataset.manuQuick;
  if(!UI_QUICK_ACTION_IDS.includes(id))return;
  const current=uiPreferences.quickActions;
  const requested=e.target.checked?[...current,id]:current.filter(item=>item!==id);
  if(requested.length>3){
   e.target.checked=false;
   toast('Możesz wybrać maksymalnie trzy szybkie działania.');
   return;
  }
  if(updateUiPreferences({quickActions:requested})){
   const order=$('.manu-quick-order');
   if(order)order.innerHTML=quickActionOrderMarkup();
   toast('Zapisano szybkie działania MANU');
  }
  else{
   e.target.checked=current.includes(id);
   toast('Nie udało się zapisać szybkich działań.');
  }
  return;
 }
  if(e.target.closest?.('#project-form'))scheduleProjectDraft();
 if(e.target.classList?.contains('manu-form-invalid')&&e.target.validity?.valid)e.target.classList.remove('manu-form-invalid');
 if(['manu-start-view','manu-show-command','manu-show-recent','manu-accent','manu-text-size'].includes(e.target.id)){
  const id=e.target.id;
  const change=id==='manu-start-view'?{startView:e.target.value}:
   id==='manu-show-command'?{showCommand:e.target.checked}:
   id==='manu-show-recent'?{showRecent:e.target.checked}:
   id==='manu-accent'?{accent:e.target.value}:{textSize:e.target.value};
  if(updateUiPreferences(change))toast('Zapisano personalizację MANU');
  else{
   if(id==='manu-start-view')e.target.value=uiPreferences.startView;
   else if(id==='manu-accent')e.target.value=uiPreferences.accent;
   else if(id==='manu-text-size')e.target.value=uiPreferences.textSize;
   else e.target.checked=id==='manu-show-command'?uiPreferences.showCommand:uiPreferences.showRecent;
   toast('Nie udało się zapisać personalizacji na tym urządzeniu');
  }
  return;
 }
 if(e.target.id==='smart-alert-enabled'){
  state.smartAlerts=normalizeSmartAlerts({...state.smartAlerts,enabled:e.target.checked});
  afterDataChange(e.target.checked?'Przypomnienia włączone':'Przypomnienia wyłączone');
  return;
 }
 if(e.target.id==='smart-alert-lead'){
  const days=Number(e.target.value);
  if([1,3,7].includes(days)){state.smartAlerts=normalizeSmartAlerts({...state.smartAlerts,leadDays:days});afterDataChange('Zapisano wyprzedzenie przypomnień')}
  return;
 }
 if(e.target.id==='compare-project-left'||e.target.id==='compare-project-right'){
  const selected=String(e.target.value||''),valid=comparisonProjects();
  if(valid.some(p=>p.id===selected)){
   if(e.target.id==='compare-project-left')compareLeftId=selected;
   else compareRightId=selected;
   // Aktualizujemy wyłącznie porównanie; nie przewijamy strony ani nie zamykamy sekcji.
   const current=comparisonSelection();
   const leftSelect=$('#compare-project-left'),rightSelect=$('#compare-project-right');
   if(leftSelect&&current.left)leftSelect.value=current.left.id;
   if(rightSelect&&current.right)rightSelect.value=current.right.id;
   const area=$('#comparison-results');
   if(area)area.innerHTML=comparisonResults();
  }
  return;
 }
 if(e.target.id==='profitability-type'){
  const scope=e.target.value;
  if(['all','Zlecenie','Warsztat'].includes(scope)){
   profitabilityScope=scope;
   const results=$('#profitability-results');
   if(results)results.innerHTML=profitabilityResults(scope);
  }
  return;
 }
 if(e.target.id==='project-filter'){filter=e.target.value;listVisible.projects=LIST_BATCH_SIZE;const grid=$('#project-list');if(grid)grid.innerHTML=renderProjectGrid();}if(e.target.id==='finance-month-picker'){const month=String(e.target.value||'');if(/^\d{4}-(0[1-9]|1[0-2])$/.test(month)){financeMonth=month;const results=$('#finance-month-results');if(results)results.innerHTML=monthlyReportMarkup(month)}}if(e.target.matches('#project-form select[name="type"]'))syncProjectFields();if(e.target.matches('#project-form select[name="clientId"]'))syncProjectClientField();if(e.target.matches('#project-form select[name="travelMode"]')||e.target.matches('#project-form input[name="transportType"]'))syncTravelFields();if(e.target.id==='manu-intro-preference'){try{localStorage.setItem('manu_intro_enabled',e.target.checked?'1':'0');toast(e.target.checked?'Animacja MANU włączona':'Animacja MANU wyłączona')}catch(err){toast('Nie udało się zapisać preferencji animacji')}}});window.addEventListener('afterprint',()=>{const printed=$('#quote-print-root');if(printed)printed.innerHTML=''});window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvent=e;refreshPwaPanel()});window.addEventListener('appinstalled',()=>{installEvent=null;refreshPwaPanel();toast('MANU zostało zainstalowane!')});window.addEventListener('online',()=>{refreshNetworkStatus()});window.addEventListener('offline',()=>{refreshNetworkStatus()});}
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
async function applyCloudSnapshot(data,expectedLastSaved=null){
 if(demoSession)return false;
 const incoming=validateBackup(data);
 await writeQueue;
 if(demoSession)return false;
 // Nie wolno zastąpić danych, gdy lokalny zapis wciąż trwa lub zmienił się podczas pobierania.
 if(storageBlocked||pendingWrites>0||document.querySelector('.modal'))return false;
 if(expectedLastSaved!==null&&state.lastSaved!==expectedLastSaved)return false;
 const previous=state;
 state=incoming;
 let saved;
 try{saved=await save();}
 catch(e){state=previous;render();throw e;}
 if(!saved){state=previous;render();return false;}
 // Po skutecznym zapisie nie cofamy danych, nawet gdy ekran wymaga ponownego załadowania.
 try{render();}
 catch(e){console.error('MANU: dane chmurowe zapisane, ale odświeżenie ekranu nie powiodło się',e);}
 return true;
}
async function init(){
 window.MANUTemplates?.init?.({
  getState:()=>state,
  modal:(title,body)=>modal(title,body),
  closeModal:()=>dismissCurrentModal(),
  goProjects:()=>{view='projects';window.scrollTo(0,0);render();},
  openProjectFromTemplate:id=>projectForm(null,'',id),
  afterChange:message=>afterDataChange(message),
  save:()=>save(),
  afterSaved:message=>{render();if(message)toast(message)}
 });
 window.MANUGallery?.init?.({
  getState:()=>state,
  modal:(title,body)=>modal(title,body),
  render:()=>render(),
  projectDetail:id=>projectDetail(id),
  save:()=>save(),
  toast:message=>toast(message),
  onPreviewOpen:()=>armManuGalleryPreviewHistory(),
  onPreviewClose:()=>requestManuGalleryPreviewClose()
 });
 events();
 await load();
 // Preferencje interfejsu nie modyfikują bazy, lecz wybierają pierwszą kartkę po uruchomieniu.
 view=uiPreferences.startView;
 applyUiAppearance();
 calendarSelected=localDay();calendarMonth=calendarSelected.slice(0,7);lastVisibleDay=calendarSelected;
 render();
 initManuBackGuard();
 void window.MANUCloud?.init?.({
  getState:()=>state,
  isDemo:()=>!!demoSession,
  waitForWrites:()=>writeQueue,
  isStorageBlocked:()=>storageBlocked,
  isBackupApplying:()=>backupApplying,
  canReplace:()=>!demoSession&&!storageBlocked&&!backupApplying&&!document.querySelector('.modal, .cloud-password-details[open], #cloud-reset-password-form'),
  refresh:()=>{if(view==='settings')render();},
  refreshHome:()=>{if(view==='home')render();},
  openSettings:()=>{view='settings';render();window.scrollTo(0,0);},
  notify:message=>toast(message),
  applyCloud:applyCloudSnapshot
 });
 window.setInterval?.(liveTimerRefresh,1000);
 if(storageBlocked)alert('MANU nie mogło bezpiecznie odczytać danych. Zapis został wstrzymany, aby nie nadpisać istniejącej bazy. Nie czyść pamięci telefonu. W Ustawieniach sprawdź poprzedni zapis albo przywróć sprawdzoną kopię JSON.');
 startIntro();
 if('serviceWorker' in navigator && location.protocol.startsWith('http')){
  pwaHadController=!!navigator.serviceWorker.controller;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{
   const hasController=!!navigator.serviceWorker.controller;
   if(pwaActivationRequested&&hasController){
    pwaActivationRequested=false;
    if(!storageBlocked&&!pendingWrites&&!backupApplying&&!quoteSubmissionPending&&!$('.modal')){
     window.location.reload();
     return;
    }
    pwaUpdateReady=true;
    toast('Nowa wersja MANU jest aktywna. Zapisz pracę i odśwież ją z Ustawień.');
   }else if(pwaHadController&&hasController){
    pwaUpdateReady=true;
    toast('Nowa wersja MANU jest aktywna. Wczytaj ją po zapisaniu pracy.');
   }
   pwaHadController=hasController;
   refreshPwaPanel();
  });
  navigator.serviceWorker.register('./service-worker.js')
   .then(registration=>watchPwaRegistration(registration))
   .catch(e=>console.warn('Service worker:',e));
 }
}
init();
})();