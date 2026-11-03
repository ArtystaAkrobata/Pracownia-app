(function(){
'use strict';
const TYPES=['Zlecenie','Warsztat'];
const MAX_TEMPLATES=300,MAX_COSTS=40,MAX_STAGES=40;
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const numeric=x=>Math.max(0,Number(x)||0);
const money=x=>Math.round((numeric(x)+Number.EPSILON)*100)/100;
const choices=['materialy','dojazd','uslugi','inne'];
const category=x=>choices.includes(x)?x:'inne';
const cash=x=>new Intl.NumberFormat('pl-PL',{style:'currency',currency:'PLN',maximumFractionDigits:2}).format(money(x));
const MAX_ID=120;
const label=c=>({materialy:'Materiały',dojazd:'Dojazd',uslugi:'Usługi',inne:'Inne'})[c]||'Inne';
const builtins=[
 {id:'starter-zlecenie',name:'Nowe zlecenie',title:'Nowa realizacja',type:'Zlecenie',quantity:1,
  stages:['Ustalenie szczegółów','Przygotowanie materiałów','Realizacja','Odbiór i rozliczenie']},
 {id:'starter-warsztat',name:'Warsztaty kreatywne',title:'Nowe warsztaty',type:'Warsztat',quantity:1,
  stages:['Przygotowanie programu','Lista uczestników','Materiały i miejsce','Przeprowadzenie zajęć','Rozliczenie']},
 {id:'starter-mobilny',name:'Realizacja z dojazdem',title:'Realizacja u klienta',type:'Zlecenie',
  quantity:1,transportType:'car',travelMode:'fuel',
  stages:['Ustalenie zakresu','Materiały i transport','Prace na miejscu','Odbiór i rozliczenie']}
];
let api=null,busy=false,search='';
const createId=()=>crypto.randomUUID?.()||'id_'+Date.now()+'_'+Math.random().toString(36).slice(2);
const fresh=()=>new Date().toISOString();
function sanitize(data){
 if(!data||typeof data!=='object'||Array.isArray(data))return null;
 const name=String(data.name||'').trim().slice(0,90);
 if(!name)return null;
 const type=TYPES.includes(data.type)?data.type:'Zlecenie';
 const expenses=(Array.isArray(data.expenses)?data.expenses:[]).slice(0,MAX_COSTS)
  .filter(x=>x&&typeof x==='object'&&!Array.isArray(x)&&String(x.title||'').trim())
  .map(x=>({title:String(x.title||'').trim().slice(0,110),amount:money(x.amount),category:category(x.category)}));
 const stages=(Array.isArray(data.stages)?data.stages:[]).slice(0,MAX_STAGES)
  .map(x=>String(typeof x==='string'?x:x?.title||'').trim().slice(0,120)).filter(Boolean);
 const transport=['none','car','paid'].includes(data.transportType)?data.transportType:'none';
 return {
  id:String(data.id||createId()).slice(0,MAX_ID),name,title:String(data.title||name).trim().slice(0,120),
  type,price:money(data.price),quantity:Math.max(1,Math.floor(numeric(data.quantity)||1)),
  capacity:Math.floor(numeric(data.capacity)),participantFee:money(data.participantFee),
  estimatedHours:numeric(data.estimatedHours),estimatedMaterials:money(data.estimatedMaterials),
  location:String(data.location||'').trim().slice(0,180),
  workLocation:String(data.workLocation||'').trim().slice(0,220),
  startTime:/^([01]\d|2[0-3]):[0-5]\d$/.test(String(data.startTime||''))?String(data.startTime):'',
  durationHours:numeric(data.durationHours),
  transportType:transport,travelMode:data.travelMode==='rate'?'rate':'fuel',
  travelKm:numeric(data.travelKm),fuelConsumption:numeric(data.fuelConsumption),
  fuelPrice:money(data.fuelPrice),travelRate:money(data.travelRate),
  travelExtra:money(data.travelExtra),paidTransportCost:money(data.paidTransportCost),
  paidTransportLabel:String(data.paidTransportLabel||'').trim().slice(0,100),
  notes:String(data.notes||'').trim().slice(0,1200),
  expenses,stages,
  createdAt:String(data.createdAt||fresh())
 };
}
function normalizeTemplates(records){
 if(!Array.isArray(records))return [];
 return records.slice(0,MAX_TEMPLATES).map(sanitize).filter(Boolean);
}
function fromProject(p){
 const data={
  id:createId(),name:'Szablon: '+String(p.title||'').slice(0,80),title:String(p.title||'').slice(0,120),
  type:p.type,price:p.type==='Warsztat'?0:p.price,
  quantity:p.quantity,capacity:p.capacity,participantFee:p.participantFee,
  estimatedHours:p.estimatedHours,estimatedMaterials:p.estimatedMaterials,
  location:p.location,workLocation:p.workLocation,startTime:p.startTime,
  durationHours:p.durationHours,transportType:p.transportType,travelMode:p.travelMode,
  travelKm:p.travelKm,fuelConsumption:p.fuelConsumption,fuelPrice:p.fuelPrice,
  travelRate:p.travelRate,travelExtra:p.travelExtra,paidTransportCost:p.paidTransportCost,
  paidTransportLabel:p.paidTransportLabel,
  stages:(p.stages||[]).map(x=>x.title),
  expenses:(p.expenses||[]).map(x=>({title:x.title,amount:x.amount,category:x.category})),
  notes:'',createdAt:fresh()
 };
 return sanitize(data);
}
function allTemplates(){
 const own=api?.getState()?.templates||[];
 return [...own,...builtins.map(x=>sanitize(x))];
}
function findTemplate(id){return allTemplates().find(x=>x.id===id)||null;}
function newProjectDraft(t){
 if(!t)return null;
 return {
  title:t.title,type:t.type,client:'',clientId:'',date:'',paymentDue:'',status:'Planowane',
  price:t.type==='Warsztat'?0:t.price,paid:0,financeMode:t.type==='Warsztat'?'participants':'manual',
  quantity:t.quantity,capacity:t.capacity,participantFee:t.participantFee,
  estimatedHours:t.estimatedHours,estimatedMaterials:t.estimatedMaterials,workLocation:t.workLocation,
  transportType:t.transportType,travelMode:t.travelMode,travelKm:t.travelKm,
  fuelConsumption:t.fuelConsumption,fuelPrice:t.fuelPrice,travelRate:t.travelRate,
  travelExtra:t.travelExtra,paidTransportCost:t.paidTransportCost,
  paidTransportLabel:t.paidTransportLabel,location:t.location,startTime:t.startTime,
  durationHours:t.durationHours,hours:0,notes:t.notes
 };
}
function seededCosts(t){
 return (t?.expenses||[]).map(x=>({id:createId(),title:x.title,amount:money(x.amount),category:category(x.category),date:''}));
}
function seededStages(t){
 return (t?.stages||[]).map(x=>({id:createId(),title:String(x).slice(0,120),done:false}));
}
function page(){
 const custom=api?.getState()?.templates||[],filtered=custom
  .filter(t=>[t.name,t.title,t.type].some(v=>String(v||'').toLocaleLowerCase('pl').includes(search.toLocaleLowerCase('pl'))));
 const opening='<div class="template-heading"><h1>Szablony projektów</h1><p>Powtarzalne realizacje, warsztaty i kosztorysy. Wybierz wzór, dostosuj pola i dopiero potem zapisz projekt.</p>'+
  '<div class="template-toolbar"><button class="btn secondary" data-action="template-back" type="button">Wróć do projektów</button>'+
  '<button class="btn" data-action="template-new" type="button">+ Nowy szablon</button></div></div>';
 const presets='<section class="template-section"><div class="section-head"><h2>Gotowe wzory</h2></div><div class="template-grid">'+
 builtins.map(x=>card(sanitize(x),true)).join('')+'</div></section>';
 const own='<section class="template-section"><div class="section-head"><h2>Moje szablony <span>('+custom.length+')</span></h2></div>'+
  '<input id="template-search" class="search" type="search" aria-label="Szukaj szablonu" placeholder="Szukaj własnych szablonów…" value="'+escape(search)+'">'+
  '<div class="template-grid" id="template-custom-grid">'+renderCustomList(filtered)+'</div></section>';
 return opening+presets+own+
 '<p class="muted tiny">Szablony zapisują się w kopii JSON i synchronizują z chmurą jak pozostałe dane MANU. Nie przechowują wpłat, klientów, uczestników ani fotografii.</p>';
}
function renderCustomList(filtered){
 if(!filtered.length)return '<div class="template-empty">'+(search?'Brak szablonów o tej nazwie.':
  'Nie masz jeszcze własnych szablonów. Zapisz nowy lub utwórz go z istniejącego projektu.')+'</div>';
 return filtered.slice().sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||'')).map(x=>card(x,false)).join('');
}
function card(t,preset){
 return '<article class="template-card"><div class="template-card-kind">'+escape(t.type==='Warsztat'?'WARSZTAT':'ZLECENIE')+
 (preset?' · GOTOWY WZÓR':' · WŁASNY SZABLON')+'</div>'+
  '<h3>'+escape(t.name)+'</h3><p>'+escape(t.title)+'</p>'+
  '<div class="template-card-meta"><span>'+t.stages.length+' etapów</span><span>'+
   t.expenses.length+' pozycji kosztowych</span></div>'+
  '<div class="template-card-actions"><button class="btn" type="button" data-action="template-use" data-id="'+escape(t.id)+'">Utwórz projekt</button>'+
  (preset?'':'<button type="button" class="btn secondary sm" data-action="template-edit" data-id="'+escape(t.id)+'">Edytuj</button>'+
    '<button type="button" class="btn ghost sm" data-action="template-delete" data-id="'+escape(t.id)+'">Usuń</button>')+
  '</div></article>';
}
function expenseRow(e={}){
 return '<div class="template-cost-row" data-template-cost>'+
  '<div class="field"><label>Pozycja</label><input name="cost_title" maxlength="110" value="'+escape(e.title||'')+'" placeholder="Np. Materiały"></div>'+
  '<div class="field"><label>Kwota (zł)</label><input name="cost_amount" type="number" min="0" step="0.01" max="100000000" value="'+money(e.amount||0)+'"></div>'+
  '<div class="field"><label>Kategoria</label><select name="cost_category">'+choices.map(x=>
  '<option value="'+x+'" '+(category(e.category)===x?'selected':'')+'>'+label(x)+'</option>').join('')+'</select></div>'+
  '<button type="button" class="btn ghost sm" data-action="template-remove-cost" aria-label="Usuń pozycję kosztową">×</button></div>';
}
function editor(t=null,sourceProject=''){
 const model=t||sanitize({name:'',title:'',type:'Zlecenie'}); // null handled below
 const item=model||{name:'',title:'',type:'Zlecenie',quantity:1,price:0,expenses:[],stages:[]};
 const field=(key,label,kind='text',step='',max='')=>
  '<div class="field"><label>'+label+'</label><input name="'+key+'" type="'+kind+'" '+(step?'step="'+step+'" min="0" ':'')+
  (max?'maxlength="'+max+'" ':'')+'value="'+escape(item[key]??'')+'"></div>';
 const html='<form id="template-form" data-id="'+escape(t?.id||'')+'" class="template-form">'+
 '<p class="muted small">W szablonie przechowuj tylko powtarzalne ustawienia. Dane klienta, wpłaty i zdjęcia nie zostaną przeniesione.</p>'+
 field('name','Nazwa szablonu *','text','','90')+
 field('title','Proponowana nazwa nowego projektu *','text','','120')+
 '<div class="field"><label>Rodzaj projektu</label><select name="type">'+TYPES.map(x=>'<option value="'+x+'" '+(item.type===x?'selected':'')+'>'+x+'</option>').join('')+'</select></div>'+
 '<div class="template-form-columns">'+
 field('price','Cena realizacji — zlecenie (zł)','number','0.01')+
 field('quantity','Liczba sztuk','number','1')+
 field('estimatedHours','Planowany czas pracy (godz.)','number','0.25')+
 field('estimatedMaterials','Szacunkowy koszt materiałów (zł)','number','0.01')+
 field('capacity','Liczba miejsc na warsztacie','number','1')+
 field('participantFee','Cena za uczestnika (zł)','number','0.01')+
 field('durationHours','Czas trwania warsztatu (godz.)','number','0.25')+
 field('startTime','Godzina rozpoczęcia warsztatu','time')+
 '</div>'+
 field('location','Miejsce warsztatu','text','','180')+
 field('workLocation','Miejsce realizacji — tylko stały opis','text','','220')+
 '<details class="template-transport"><summary>Stałe ustawienia dojazdu</summary>'+
 '<div class="field"><label>Transport</label><select name="transportType">'+
 [['none','Bez dojazdu'],['car','Samochód'],['paid','Transport płatny']].map(([x,l])=>
 '<option value="'+x+'" '+(item.transportType===x?'selected':'')+'>'+l+'</option>').join('')+'</select></div>'+
 '<div class="field"><label>Metoda obliczania dojazdu</label><select name="travelMode">'+
 [['fuel','Spalanie i paliwo'],['rate','Stawka za kilometr']].map(([x,l])=>
 '<option value="'+x+'" '+(item.travelMode===x?'selected':'')+'>'+l+'</option>').join('')+'</select></div>'+
 '<div class="template-form-columns">'+
 field('travelKm','Długość trasy (km)','number','0.1')+
 field('fuelConsumption','Spalanie (l/100 km)','number','0.1')+
 field('fuelPrice','Cena paliwa (zł/l)','number','0.01')+
 field('travelRate','Stawka (zł/km)','number','0.01')+
 field('travelExtra','Dodatkowe opłaty (zł)','number','0.01')+
 field('paidTransportCost','Cena transportu płatnego (zł)','number','0.01')+
 '</div>'+field('paidTransportLabel','Opis transportu','text','','100')+'</details>'+
 '<div class="field"><label>Etapy realizacji (po jednym w wierszu)</label>'+
 '<textarea name="stages" rows="5" maxlength="5000" placeholder="Przygotowanie&#10;Realizacja&#10;Odbiór">'+escape((item.stages||[]).join('\n'))+'</textarea></div>'+
 '<div class="template-costs-head"><h3>Powtarzalne pozycje kosztów</h3><button type="button" class="btn secondary sm" data-action="template-add-cost">+ Dodaj koszt</button></div>'+
 '<p class="muted tiny">Kwoty zostaną skopiowane do kosztów nowego projektu, ale bez daty. Przed zapisaniem sprawdź je i dostosuj do konkretnej realizacji.</p>'+
 '<div class="template-costs" id="template-cost-list">'+(item.expenses||[]).map(x=>expenseRow(x)).join('')+'</div>'+
 '<div class="field"><label>Ogólne notatki szablonu</label><textarea name="notes" rows="4" maxlength="1200" placeholder="Tylko uniwersalne instrukcje, bez danych klientów">'+escape(item.notes||'')+'</textarea></div>'+
 '<div class="modal-actions"><button type="button" class="btn ghost" data-action="template-cancel">Anuluj</button>'+
 '<button type="submit" class="btn">Zapisz szablon</button></div></form>';
 api.modal(t?'Edytuj szablon':'Nowy szablon',html);
}
function handleAction(b){
 const action=b.dataset.action,id=b.dataset.id;
 if(action==='template-new'){editor();return}
 if(action==='template-back'){api.goProjects();return}
 if(action==='template-edit'){const t=api.getState().templates.find(x=>x.id===id);if(t)editor(t);return}
 if(action==='template-save-from-project'){
  const p=api.getState().projects.find(x=>x.id===id);if(!p)return;
  const t=fromProject(p);
  editor(t);
  return;
 }
 if(action==='template-cancel'){api.closeModal();return}
 if(action==='template-add-cost'){
  const box=document.getElementById('template-cost-list');
  if(!box)return;
  if(box.querySelectorAll('[data-template-cost]').length>=MAX_COSTS){alert('Maksymalnie 40 pozycji kosztów.');return}
  box.insertAdjacentHTML('beforeend',expenseRow());
  box.querySelector('[data-template-cost]:last-child input')?.focus({preventScroll:true});
  return;
 }
 if(action==='template-remove-cost'){
  b.closest('[data-template-cost]')?.remove();
  return;
 }
 if(action==='template-use'){
  const t=findTemplate(id);if(t)api.openProjectFromTemplate(t.id);
  return;
 }
 if(action==='template-delete'){
  const t=api.getState().templates.find(x=>x.id===id);if(!t)return;
  if(!confirm('Usunąć własny szablon „'+t.name+'”? Gotowe projekty pozostaną bez zmian.'))return;
  api.getState().templates=api.getState().templates.filter(x=>x.id!==id);
  api.afterChange('Usunięto szablon. Projekty bez zmian.');
 }
}
function submit(form){
 if(busy)return;
 const data=new FormData(form);
 const name=String(data.get('name')||'').trim().slice(0,90);
 const title=String(data.get('title')||'').trim().slice(0,120);
 if(!name||!title){alert('Podaj nazwę szablonu i proponowaną nazwę projektu.');return}
 const id=form.dataset.id,exists=api.getState().templates.find(x=>x.id===id);
 if(!exists&&api.getState().templates.length>=MAX_TEMPLATES){alert('Maksymalnie 300 szablonów.');return}
 const costRows=[...form.querySelectorAll('[data-template-cost]')];
 const expenses=[];
 for(const row of costRows){
  const name=String(row.querySelector('[name="cost_title"]')?.value||'').trim().slice(0,110);
  const amount=Number(row.querySelector('[name="cost_amount"]')?.value||0);
  if(!name)continue;
  if(!Number.isFinite(amount)||amount<0||amount>100000000){alert('Sprawdź kwoty kosztów.');return}
  expenses.push({title:name,amount:money(amount),category:category(row.querySelector('[name="cost_category"]')?.value)});
 }
 const stages=String(data.get('stages')||'').split(/\r?\n/).map(x=>x.trim().slice(0,120)).filter(Boolean).slice(0,MAX_STAGES);
 const obj={id:exists?.id||id||createId(),createdAt:exists?.createdAt||fresh(),
  name,title,type:data.get('type'),stages,expenses};
 for(const field of ['price','quantity','capacity','participantFee','estimatedHours','estimatedMaterials',
  'durationHours','travelKm','fuelConsumption','fuelPrice','travelRate','travelExtra','paidTransportCost']){
  const value=Number(data.get(field)||0);
  if(!Number.isFinite(value)||value<0||value>100000000){alert('Sprawdź pole: '+field);return}
  obj[field]=value;
 }
 for(const field of ['location','workLocation','startTime','transportType','travelMode','paidTransportLabel','notes']){
  obj[field]=String(data.get(field)||'');
 }
 const normalized=sanitize(obj);
 if(!normalized){alert('Nieprawidłowy szablon.');return}
 const records=api.getState().templates;
 if(exists)Object.assign(exists,normalized);
 else records.push(normalized);
 api.closeModal();
 api.afterChange(exists?'Zapisano zmiany szablonu.':'Dodano nowy szablon.');
}
function searchChanged(value){
 search=String(value||'');
 const list=document.getElementById('template-custom-grid');
 if(list){
  const found=(api?.getState()?.templates||[]).filter(t=>
   [t.name,t.title,t.type].some(v=>String(v||'').toLocaleLowerCase('pl').includes(search.toLocaleLowerCase('pl'))));
  list.innerHTML=renderCustomList(found);
 }
}
window.MANUTemplates={init:bridge=>{api=bridge},searchChanged,normalizeTemplates,
 page,renderCustomList,allTemplates,findTemplate,newProjectDraft,seededCosts,seededStages,fromProject,handleAction,submit};
})();