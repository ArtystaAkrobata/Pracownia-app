'use strict';

/**
 * Etap 11 MANU — testy regresyjne. Uruchom:
 *   node --test tests/regression.test.cjs
 * Bez bibliotek zewnętrznych i bez dostępu do prawdziwych danych.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');
const appSource = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
const injectPoint = /init\(\);\s*\}\)\(\);\s*$/;
assert.match(appSource, injectPoint, 'Nie udało się znaleźć końca aplikacji MANU');

function boot(snapshot = {version: 18, projects: [], tasks: []}) {
  const alerts = [];
  const callbacks = {};
  const nodes = {};
  const persisted = new Map();
  let rejectWrites = false;
  let seq = 0;
  const document = {
    querySelector: selector => nodes[selector] || null,
    querySelectorAll: () => [],
    visibilityState: 'visible',
    getElementById: () => null,
    addEventListener: (name, fn, capture) => {
      (callbacks[name] ||= []).push({fn, capture});
    }
  };
  const window = {
    MANUCloud: {},
    MANUGallery: {},
    addEventListener: () => {},
    scrollTo: () => {}
  };
  const context = {
    window, document,
    crypto: {randomUUID: () => 'test-' + (++seq)},
    navigator: {onLine: true},
    location: {search: '', protocol: 'https:'},
    localStorage: {
      getItem: key => persisted.has(key) ? persisted.get(key) : null,
      setItem: (key,value) => {
        if (rejectWrites) throw Error('Testowy błąd pamięci lokalnej');
        persisted.set(key, String(value));
      }
    },
    structuredClone,
    console,
    alert: message => alerts.push(String(message)),
    confirm: () => true,
    FormData: class {
      constructor(form) { this.fields = form.values || {}; }
      get(name) {
        return Object.hasOwn(this.fields, name) ? this.fields[name] : null;
      }
    }
  };
  const expose = [
    'globalThis.__MANU_TEST = {',
    ' normalize, normalizeQuotes, quoteForm, quotePreview, rememberQuotePreview, returnToQuotePreview, quoteCloneDraft, quoteLastIssuer, quoteDocument, quoteDocumentLabel, quoteDocumentStyle, quoteDocumentTerms, quoteTitleForDocumentType, quoteProjectItem, quoteClientFields, quoteCostHints, quoteProjectHintsMarkup, validateBackup, metrics, expenses, projectIncome, projectPaid, normalizeUiPreferences, updateUiPreferences, quickActionOrderMarkup, quickAccessMarkup, getUiPreferences: () => ({...uiPreferences,quickActions:[...uiPreferences.quickActions]}),',
    ' calendarEvents, smartAlertsData, plusDaysDate, localDay,',
    ' costCategoryData, profitabilityData, comparisonSelection, comparisonMetrics, paymentControlData, paymentControlRows, paymentControlPanel,',
    ' profitabilityResults, profitabilityPanel, projectDetail, events,',
    ' handleAction, handleSubmit, save, applyBackup, applyCloudSnapshot,',
    ' renderProjectGrid, renderClientList, renderTaskList, filteredProjects, filteredClients, filteredTasks, liveTimerRefresh,',
    ' getListVisible: () => ({...listVisible}),',
    ' setListSearch: (kind,query) => {if(kind==="projects")search=query;else if(kind==="clients")clientSearch=query;},',
    ' setListType: type => {filter=type;},',
    ' setTaskFilter: type => {taskFilter=type;},',
    ' waitForWrites: () => writeQueue,',
    ' storageState: () => ({storageBlocked, pendingWrites, saveStatus}),',
    ' useLocalStorage: () => {dbAvailable=false;},',
    ' failRender: () => {render=()=>{throw Error("Testowy błąd interfejsu")};},',
    ' setPendingBackup: raw => {pendingBackup={snapshot:normalize(raw),mode:"restore",filename:"test.json"};},',
    ' setState: raw => { state = normalize(raw); },',
    ' getState: () => state,',
    ' opened: (id,key) => detailSectionStates.get(id)?.has(key),',
    ' stubEffects: () => {',
    '  afterDataChange = (message,detailId) => { globalThis.__lastChange = {message,detailId}; };',
    '  closeModal = () => {};',
    '  toast = () => {};',
    '  render = () => {};',
    '  modal = (title,body,opts) => { globalThis.__lastModal={title,body,opts}; };',
    ' }',
    '};',
    '})();'
  ].join('\n');
  const modified = appSource.replace(injectPoint, expose);
  vm.runInNewContext(modified, context, {filename: 'app.js', timeout: 3000});
  const api = context.__MANU_TEST;
  api.setState(snapshot);
  api.stubEffects();
  return {api, alerts, callbacks, context, nodes, document, persisted,
    rejectWrites: value => {rejectWrites=!!value;} };
}

const job = (id, extra = {}) => ({
  id, title: 'Lustro ' + id, type: 'Zlecenie', status: 'Planowane',
  price: 500, paid: 0, hours: 5, expenses: [], ...extra
});

test('Migracja danych: klient warsztatu pozostaje oddzielony od organizatora', () => {
  const {api} = boot({
    version: 17, tasks: [], projects: [
      {id: 'w1', title: 'Hobbit', type: 'Warsztat',
       client: 'Kali', organizer: 'Adam', participantFee: 200, participants: []}
    ]
  });
  const p = api.getState().projects[0];
  assert.equal(api.getState().version, 18);
  assert.equal(p.client, 'Kali');
  assert.equal(p.organizer, 'Adam');
  assert.equal(p.type, 'Warsztat');
});

test('Kopie JSON: kompatybilność starszej wersji i odrzucanie niewłaściwej', () => {
  const {api} = boot();
  assert.equal(api.validateBackup({version: 17, projects: [], tasks: []}).version, 18);
  assert.throws(() => api.validateBackup({version: 999, projects: [], tasks: []}));
  assert.throws(() => api.validateBackup({version: 18, projects: [null], tasks: []}));
  assert.throws(() => api.validateBackup({version: 18, projects: [], tasks: [], reminders: 'błąd'}));
});

test('Finanse: rzeczywisty koszt dojazdu zastępuje oszacowanie', () => {
  const {api} = boot({version: 18, tasks: [], projects: [
    job('a', {
      transportType: 'car', travelMode: 'fuel',
      travelKm: 100, fuelConsumption: 6, fuelPrice: 5,
      expenses: [{id:'e1', title:'Folia', amount: 50, category:'materialy'}]
    }),
    job('b', {
      transportType: 'car', travelMode: 'fuel',
      travelKm: 100, fuelConsumption: 6, fuelPrice: 5,
      expenses: [{id:'e2', title:'Transport', amount: 45, category:'dojazd'}]
    })
  ]});
  const [a,b] = api.getState().projects;
  assert.equal(api.expenses(a), 80);
  assert.equal(api.expenses(b), 45);
  assert.equal(api.metrics().cost, 125);
});

test('Warsztaty: suma z potwierdzonych miejsc, bez listy rezerwowej', () => {
  const {api} = boot({version: 18, tasks: [], projects: [
    {id:'w1', title:'Gotyk', type:'Warsztat', status:'W trakcie',
     financeMode:'participants', participantFee: 200, participants: [
       {id:'p1', name:'Pierwszy', fee:200, paidAmount:50, bookingStatus:'confirmed'},
       {id:'p2', name:'Rezerwowy', fee:300, bookingStatus:'waitlist'}
     ], expenses:[]}
  ]});
  const p = api.getState().projects[0];
  assert.equal(api.projectIncome(p), 200);
  assert.equal(api.projectPaid(p), 50);
});

test('Struktura kosztów: suma kategorii = koszty w Finansach', () => {
  const {api} = boot({version: 18, tasks: [], projects: [
    job('a', {expenses:[{id:'m', title:'Farba', amount:80, category:'materialy'}]}),
    job('b', {expenses:[{id:'s', title:'Zlecenie podwykonawcy', amount:40, category:'uslugi'}]}),
    job('c', {status:'Anulowane', expenses:[{id:'x', title:'Nie liczyć', amount:500, category:'materialy'}]})
  ]});
  const data = api.costCategoryData();
  const totalCategories = data.categories.reduce((n,row) => n+row.amount, 0);
  assert.equal(data.projects.length, 2);
  assert.equal(data.total, 120);
  assert.equal(totalCategories, api.metrics().cost);
});

test('Porównywarka: godziny nieznane nie są liczone jako zero', () => {
  const {api} = boot({version:18, tasks:[], projects: [
    job('a', {hours:0}),
    job('b', {hours:10,price:400,
      expenses:[{id:'e',title:'Koszt',amount:100,category:'inne'}]})
  ]});
  const [a,b] = api.getState().projects;
  assert.equal(api.comparisonMetrics(a).hourly, null);
  assert.equal(api.comparisonMetrics(b).hourly, 30);
  assert.notEqual(api.comparisonSelection().left.id, api.comparisonSelection().right.id);
});

test('Terminy: wykonane zadania nie generują inteligentnych alertów', () => {
  const {api} = boot();
  const today = api.localDay();
  const tomorrow = api.plusDaysDate(today,1);
  api.setState({version: 18, projects: [], tasks: [
    {id:'pending',title:'Przygotuj materiały',due:tomorrow,done:false},
    {id:'done',title:'Gotowe',due:today,done:true}
  ]});
  const list = api.smartAlertsData(today);
  assert.equal(list.filter(x=>x.taskId==='pending').length, 1);
  assert.equal(list.filter(x=>x.taskId==='done').length, 0);
});

test('Zadania: limit rekordów i błędne powiązanie projektu nie psują danych', () => {
  const {api,alerts} = boot();
  api.getState().tasks = Array.from({length:25000},(_,i)=>({
    id:'t'+i,title:'Pozycja '+i,projectId:'',done:false,due:''
  }));
  api.handleSubmit({id:'task-form',dataset:{id:'',returnProject:''},
    values:{title:'Nowe',due:'',projectId:''}});
  assert.equal(api.getState().tasks.length, 25000);
  assert.match(alerts.at(-1), /limit 25 000/i);
  api.getState().tasks = [];
  api.handleSubmit({id:'task-form',dataset:{id:'',returnProject:''},
    values:{title:'Nowe',due:'',projectId:'projekt-nieistniejący'}});
  assert.equal(api.getState().tasks.length, 0);
  assert.match(alerts.at(-1), /już nie istnieje/);
});

test('Usunięcie projektu: zadania i przypomnienia zachowują treść, ale tracą powiązanie', () => {
  const {api} = boot({version:18,
    projects:[job('a'),job('b')],
    tasks:[{id:'t',title:'Materiały',projectId:'a',done:false}],
    reminders:[{id:'r',title:'Oddaj',date:'2026-12-01',projectId:'a'}]
  });
  api.handleAction({dataset:{action:'delete-project',id:'a'}});
  assert.equal(api.getState().projects.length, 1);
  assert.equal(api.getState().tasks[0].title, 'Materiały');
  assert.equal(api.getState().tasks[0].projectId, '');
  assert.equal(api.getState().reminders[0].title, 'Oddaj');
  assert.equal(api.getState().reminders[0].projectId, '');
});

test('Zwinięte sekcje: stan otwarcia projektu jest zachowywany', () => {
  const {api, callbacks} = boot({version:18,projects:[job('a')],tasks:[]});
  api.events();
  const toggle = callbacks.toggle[0];
  assert.equal(toggle.capture, true);
  toggle.fn({target:{isConnected:true,
    matches:selector=>selector==='details.manu-detail-fold',
    dataset:{project:'a',section:'finance'},open:true}});
  assert.equal(api.opened('a','finance'), true);
  api.projectDetail('a');
  assert.match(api.profitabilityPanel(), /profitability-panel/);
  assert.match(api.getState().projects[0].title, /Lustro/);
});

test('PWA: wersje plików i cache są spójne', () => {
  const index = fs.readFileSync(path.join(ROOT, 'index.html'),'utf8');
  const sw = fs.readFileSync(path.join(ROOT, 'service-worker.js'),'utf8');
  const version = appSource.match(/const APP_VERSION='([^']+)'/)[1];
  assert.ok(index.includes('app.js?v='+version));
  assert.ok(index.includes('styles.css?v='+version));
  assert.ok(sw.includes('manu-app-v'+version));
  assert.ok(sw.includes('app.js?v='+version));
});


test('Zapis lokalny: kolejka zapisów i punkt przywracania mają poprawną treść', async () => {
  const {api, persisted} = boot({version:18, projects:[job('pierwsza')], tasks:[]});
  api.useLocalStorage();
  assert.equal(await api.save(), true);
  const one = JSON.parse(persisted.get('snapshot'));
  assert.equal(one.projects[0].id, 'pierwsza');
  api.getState().projects.push(job('druga'));
  assert.equal(await api.save(), true);
  const second = JSON.parse(persisted.get('snapshot'));
  const previous = JSON.parse(persisted.get('safety-previous-v1'));
  assert.equal(second.projects.length, 2);
  assert.equal(previous.projects.length, 1);
  assert.equal(api.getState().lastSaved, second.lastSaved);
});

test('Błąd zapisu: MANU nie nadpisuje poprzedniej kopii i blokuje kolejne zapisy', async () => {
  const {api, persisted, rejectWrites} = boot({version:18, projects:[job('a')], tasks:[]});
  api.useLocalStorage();
  assert.equal(await api.save(), true);
  const original = persisted.get('snapshot');
  api.getState().projects.push(job('b'));
  rejectWrites(true);
  assert.equal(await api.save(), false);
  assert.equal(api.storageState().storageBlocked, true);
  assert.equal(persisted.get('snapshot'), original);
  assert.equal(await api.save(), false);
  assert.equal(persisted.get('snapshot'), original);
  rejectWrites(false);
});

test('Chmura: niepoprawna kopia jest odrzucana bez zmiany lokalnych danych', async () => {
  const {api, persisted} = boot({version:18, projects:[job('lokalna')], tasks:[]});
  api.useLocalStorage();
  await api.save();
  const before = persisted.get('snapshot');
  await assert.rejects(api.applyCloudSnapshot({version:18,projects:'błąd',tasks:[]}));
  assert.equal(api.getState().projects[0].id, 'lokalna');
  assert.equal(persisted.get('snapshot'), before);
});

test('Chmura: poprawny import zapisuje dane, poprzednią wersję i ten sam znacznik czasu', async () => {
  const {api, persisted} = boot({version:18, projects:[job('lokalna')], tasks:[]});
  api.useLocalStorage();
  await api.save();
  const imported={version:18,projects:[job('chmurowa')],tasks:[]};
  assert.equal(await api.applyCloudSnapshot(imported), true);
  const persistedMain=JSON.parse(persisted.get('snapshot'));
  const persistedOld=JSON.parse(persisted.get('safety-previous-v1'));
  assert.equal(api.getState().projects[0].id, 'chmurowa');
  assert.equal(persistedMain.projects[0].id, 'chmurowa');
  assert.equal(persistedOld.projects[0].id, 'lokalna');
  assert.equal(api.getState().lastSaved, persistedMain.lastSaved);
});

test('Chmura: błąd zapisu nie może zastąpić danych widocznych w aplikacji', async () => {
  const {api, persisted, rejectWrites} = boot({version:18, projects:[job('bezpieczna')], tasks:[]});
  api.useLocalStorage();
  await api.save();
  const before = persisted.get('snapshot');
  rejectWrites(true);
  assert.equal(await api.applyCloudSnapshot({version:18,projects:[job('zdalna')],tasks:[]}), false);
  assert.equal(api.getState().projects[0].id, 'bezpieczna');
  assert.equal(persisted.get('snapshot'), before);
  assert.equal(api.storageState().storageBlocked, true);
});

test('Przywrócenie JSON: ostatni zapis w stanie zgadza się z danymi na urządzeniu', async () => {
  const {api, persisted} = boot({version:18, projects:[job('przed')], tasks:[]});
  api.useLocalStorage();
  await api.save();
  api.setPendingBackup({version:18, projects:[job('przywrocona')], tasks:[]});
  await api.applyBackup();
  const saved=JSON.parse(persisted.get('snapshot'));
  assert.equal(api.getState().projects[0].id, 'przywrocona');
  assert.equal(saved.projects[0].id, 'przywrocona');
  assert.equal(api.getState().lastSaved, saved.lastSaved);
});


test('Zapis: błąd powiadomienia chmury nie unieważnia poprawnego zapisu lokalnego', async () => {
  const {api,context,persisted} = boot({version:18,projects:[job('lokalna')],tasks:[]});
  api.useLocalStorage();
  context.window.MANUCloud.localSaved = () => {throw Error('Chmura tymczasowo niedostępna');};
  assert.equal(await api.save(), true);
  assert.equal(api.storageState().storageBlocked, false);
  assert.equal(JSON.parse(persisted.get('snapshot')).projects[0].id, 'lokalna');
});

test('Chmura: błąd odświeżenia ekranu nie cofa poprawnie zapisanych danych', async () => {
  const {api,persisted} = boot({version:18,projects:[job('przed')],tasks:[]});
  api.useLocalStorage();
  await api.save();
  api.failRender();
  assert.equal(await api.applyCloudSnapshot({version:18,projects:[job('po')],tasks:[]}), true);
  assert.equal(api.getState().projects[0].id, 'po');
  assert.equal(JSON.parse(persisted.get('snapshot')).projects[0].id, 'po');
  assert.equal(api.storageState().storageBlocked, false);
});


test('Mobile: duża lista projektów ładuje pierwszych 40, ale przeszukuje całą bazę', () => {
  const projects = Array.from({length:150},(_,i)=>job('p'+String(i).padStart(3,'0'),{
    title:i===149?'Projekt unikalny':'Zlecenie '+i,
    createdAt:'2026-11-03T10:00:00Z'
  }));
  const {api} = boot({version:18,projects,tasks:[]});
  let first=api.renderProjectGrid();
  assert.equal((first.match(/class="project-card"/g)||[]).length, 40);
  assert.match(first, /Pokaż kolejne 40/);
  assert.doesNotMatch(first, /Projekt unikalny/);
  api.setListSearch('projects','Projekt unikalny');
  const found=api.renderProjectGrid();
  assert.match(found,/Projekt unikalny/);
  assert.equal((found.match(/class="project-card"/g)||[]).length,1);
});

test('Mobile: doładowanie projektów dokleja elementy bez nadpisywania poprzednich', () => {
  const projects=Array.from({length:92},(_,i)=>job('p'+String(i).padStart(3,'0')));
  const {api,nodes} = boot({version:18,projects,tasks:[]});
  const initial=api.renderProjectGrid();
  let inserted='',removed=false;
  const footer={insertAdjacentHTML:(position,html)=>{assert.equal(position,'afterend');inserted=html;},remove:()=>{removed=true}};
  const container={querySelector:selector=>selector==='.manu-list-more'?footer:null};
  nodes['#project-list']=container;
  api.handleAction({dataset:{action:'list-more',list:'projects'}});
  assert.equal(api.getListVisible().projects,80);
  assert.equal((inserted.match(/class="project-card"/g)||[]).length,40);
  assert.ok(removed);
  assert.match(inserted,/Pokaż kolejne 12/);
  assert.equal((initial.match(/class="project-card"/g)||[]).length,40);
  const ids=html=>[...html.matchAll(/<article class="project-card" data-action="open-project" data-id="([^"]+)"/g)].map(match=>match[1]);
  const firstIds=new Set(ids(initial));
  assert.equal(ids(inserted).filter(id=>firstIds.has(id)).length,0);
});

test('Mobile: lista klientów pokazuje 40 kart, liczy wartości bez podwójnych przebiegów', () => {
  const clients=Array.from({length:120},(_,i)=>({
    id:'client'+i,name:'Klient '+String(i).padStart(3,'0')
  }));
  const projects=[
    job('a',{clientId:'client0',price:300}),
    job('b',{clientId:'client0',price:400}),
    job('c',{clientId:'client0',price:999,status:'Anulowane'})
  ];
  const {api}=boot({version:18,projects,tasks:[],clients});
  const markup=api.renderClientList();
  assert.equal((markup.match(/class="crm-client-card"/g)||[]).length,40);
  assert.match(markup,/Pokaż kolejne 40/);
  assert.match(markup,/3 projektów/);
  assert.match(markup,/700/);
  api.setListSearch('clients','Klient 119');
  const last=api.renderClientList();
  assert.match(last,/Klient 119/);
  assert.equal((last.match(/class="crm-client-card"/g)||[]).length,1);
});

test('Mobile: filtrowanie dużej listy zadań zachowuje kolejne strony', () => {
  const tasks=Array.from({length:130},(_,i)=>({
    id:'t'+i,title:'Zadanie '+i,done:i===0,projectId:'',due:''
  }));
  const {api}=boot({version:18,projects:[],tasks});
  let markup=api.renderTaskList();
  assert.equal((markup.match(/class="task-row"/g)||[]).length,40);
  assert.match(markup,/Pokaż kolejne 40/);
  assert.doesNotMatch(markup,/Zadanie 0</);
  api.setTaskFilter('done');
  markup=api.renderTaskList();
  assert.equal((markup.match(/class="task-row"/g)||[]).length,1);
  api.setTaskFilter('all');
  markup=api.renderTaskList();
  assert.equal((markup.match(/class="task-row"/g)||[]).length,40);
});

test('Mobile: stoper nie odświeża DOM w tle i aktualizuje tylko widoczne elementy', () => {
  const startedAt=new Date(Date.now()-11000).toISOString();
  const {api,document}=boot({version:18,projects:[
    job('a',{timer:{startedAt,seconds:0}}),
    job('b',{timer:{startedAt:'',seconds:0}})
  ],tasks:[]});
  let scans=0,updated='';
  document.querySelectorAll=()=>{
    scans++;
    return [{dataset:{timerValue:'a'},set textContent(value){updated=value;}}];
  };
  document.visibilityState='hidden';
  api.liveTimerRefresh();
  assert.equal(scans,0);
  document.visibilityState='visible';
  api.liveTimerRefresh();
  assert.equal(scans,1);
  assert.ok(updated.length>0);
});


test('Mobile: filtr zadań aktualizuje tylko listę bez przewijania i zmiany karty', () => {
  const {api,nodes,context} = boot({version:18,projects:[],tasks:[
    {id:'a',title:'Zadanie otwarte',done:false},
    {id:'b',title:'Zadanie zakończone',done:true}
  ]});
  let html='';
  nodes['#task-list']={set innerHTML(value){html=value;}};
  context.window.scrollTo=()=>{throw Error('Nie wolno przewijać strony');};
  api.handleAction({dataset:{action:'task-filter',filter:'done'}});
  assert.match(html,/Zadanie zakończone/);
  assert.doesNotMatch(html,/Zadanie otwarte/);
  assert.equal(api.getListVisible().tasks,40);
});

test('Mobile: zmiana filtra typu projektów nie przebudowuje całego notesu', () => {
  const {api,nodes,callbacks,context} = boot({version:18,projects:[
    job('z',{title:'Lustro tylko zlecenie'}),
    {id:'w',title:'Hobbit tylko warsztat',type:'Warsztat',status:'Planowane',expenses:[]}
  ],tasks:[]});
  let html='';
  nodes['#project-list']={set innerHTML(value){html=value;}};
  context.window.scrollTo=()=>{throw Error('Nie wolno przewijać strony');};
  api.events();
  callbacks.change[0].fn({target:{id:'project-filter',value:'Warsztat',matches:()=>false}});
  assert.match(html,/Hobbit tylko warsztat/);
  assert.doesNotMatch(html,/Lustro tylko zlecenie/);
  assert.equal(api.getListVisible().projects,40);
});


test('Personalizacja: skróty są filtrowane, unikalne i ograniczone do trzech', () => {
  const {api}=boot();
  const prefs=api.normalizeUiPreferences({
    quickActions:['new-project','new-project','invalid','new-task','quote-new','client-new']
  });
  assert.equal(JSON.stringify(prefs.quickActions),JSON.stringify(['new-project','new-task','quote-new']));
  assert.match(api.quickActionOrderMarkup(),/Nowe zadanie/);
});

test('Personalizacja: przesuwanie skrótu zmienia kolejność bez przewijania strony', () => {
  const {api,context,nodes,persisted}=boot();
  let markup='';
  nodes['.manu-quick-order']={set innerHTML(value){markup=value;}};
  context.window.scrollTo=()=>{throw Error('Nie wolno przewijać strony');};
  api.handleAction({dataset:{action:'ui-quick-move',id:'quote-new',direction:'up'}});
  assert.equal(JSON.stringify(api.getUiPreferences().quickActions),JSON.stringify(['quote-new','new-task']));
  assert.match(markup,/Nowa wycena/);
  const first=api.quickAccessMarkup();
  assert.ok(first.indexOf('Nowa wycena')<first.indexOf('Nowe zadanie'));
  assert.equal(JSON.parse(persisted.get('manu-ui-preferences-v1')).quickActions[0],'quote-new');
  api.handleAction({dataset:{action:'ui-quick-move',id:'quote-new',direction:'up'}});
  assert.equal(JSON.stringify(api.getUiPreferences().quickActions),JSON.stringify(['quote-new','new-task']));
});

test('Personalizacja: ukrycie wszystkich skrótów ukrywa pasek Start', () => {
  const {api}=boot();
  assert.equal(api.updateUiPreferences({quickActions:[]}),true);
  assert.equal(api.quickAccessMarkup(),'');
  assert.match(api.quickActionOrderMarkup(),/Zaznacz przynajmniej jeden skrót/);
});


test('Etap 15.1: oferta z projektu zachowuje wartość, kosztów nie dodaje do ceny', () => {
  const {api,context}=boot({version:18, projects:[
    job('p1',{title:'Lustro GKS 50 cm',price:600,quantity:2,estimatedMaterials:90,
      expenses:[{id:'e1',title:'Taśma i folia',amount:30,category:'materialy'}]})
  ],tasks:[]});
  const p=api.getState().projects[0];
  const item=api.quoteProjectItem(p);
  assert.equal(item.quantity,2);
  assert.equal(item.unitPrice,300);
  const hints=api.quoteCostHints(p);
  assert.equal(hints.length,1);
  assert.equal(hints[0].cost,30);
  assert.equal(hints[0].unitPrice,undefined,'Koszt nie może być ceną sprzedaży');
  api.quoteForm('p1');
  const markup=context.__lastModal.body;
  assert.match(markup,/Asystent wyceny/);
  assert.match(markup,/quote-fill-project/);
  assert.match(markup,/Taśma i folia/);
  assert.match(markup,/name="clientAddress"/);
  assert.match(markup,/name="clientContact"/);
  assert.equal(p.price,600);
  assert.equal(p.expenses[0].amount,30);
});

test('Etap 15.1: kontakt klienta można skopiować, a dawną wycenę nadal odczytać', () => {
  const {api}=boot({version:18,projects:[],tasks:[]});
  const contact=api.quoteClientFields({name:'Kowalski',company:'Studio Art',email:'a@example.test',phone:'500 200 300',address:'Łęczna'});
  assert.equal(contact.client,'Studio Art — Kowalski');
  assert.match(contact.clientContact,/a@example.test/);
  assert.equal(contact.clientAddress,'Łęczna');
  const legacy=api.normalizeQuotes([{
    id:'old',number:'MANU-2026-001',title:'Oferta',issued:'2026-11-01',
    client:'Odbiorca',items:[{description:'Praca',quantity:1,unit:'szt.',unitPrice:100}]
  }])[0];
  assert.equal(legacy.clientContact,'');
  assert.equal(legacy.clientAddress,'');
  assert.match(api.quoteDocument(legacy),/WARTOŚĆ WYCENY/);
});

test('Etap 15.1: podpowiedź kosztu jest bezpiecznie kodowana i nie zmienia wyceny', () => {
  const {api}=boot({version:18,projects:[],tasks:[]});
  const project=job('safe',{expenses:[{title:'<img src=x onerror=alert(1)>',amount:55,category:'materialy'}]});
  const source=api.quoteProjectHintsMarkup(project);
  assert.doesNotMatch(source,/<img src=x/);
  assert.match(source,/&lt;img/);
  assert.match(source,/koszt: 55/);
  const quote={number:'MANU-2026-007',title:'Wycena',issued:'2026-11-04',client:'Klient',
    clientContact:'a@example.test',clientAddress:'Adres 5',items:[{description:'Grawer',quantity:1,unit:'szt.',unitPrice:200}],discount:0};
  const doc=api.quoteDocument(quote);
  assert.match(doc,/a@example.test/);
  assert.match(doc,/Adres 5/);
  assert.match(doc,/200/);
});


test('Etap 15.2: wcześniejsza wycena zachowuje format i dotychczasowe pola', () => {
 const {api}=boot({version:18,projects:[],tasks:[]});
 const old=api.normalizeQuotes([{
  id:'legacy',number:'MANU-2026-002',issued:'2026-10-20',title:'Lustro',
  items:[{description:'Matowienie',quantity:1,unit:'szt.',unitPrice:450}]
 }])[0];
 assert.equal(old.documentType,'quote');
 assert.equal(old.documentStyle,'classic');
 assert.equal(old.introduction,'');
 assert.equal(old.deliveryTerms,'');
 assert.equal(old.paymentTerms,'');
 const html=api.quoteDocument(old);
 assert.match(html,/WARTOŚĆ WYCENY/);
 assert.match(html,/class="quote-document quote-document--classic"/);
 assert.doesNotMatch(html,/quote-doc-terms/);
 assert.doesNotMatch(html,/quote-doc-intro/);
});

test('Etap 15.2: oferta cenowa ma sekcje warunków i wariant minimalistyczny', () => {
 const {api}=boot({version:18,projects:[],tasks:[]});
 const raw={
  id:'offer',number:'MANU-2026-003',issued:'2026-11-04',title:'Oferta dla studia',
  documentType:'offer',documentStyle:'minimal',
  introduction:'Projekt i przygotowanie lustra.',
  deliveryTerms:'Do 14 dni po akceptacji',paymentTerms:'Przelew po odbiorze',
  items:[{description:'Lustro Ø50',quantity:2,unit:'szt.',unitPrice:250}]
 };
 const q=api.normalizeQuotes([raw])[0];
 assert.equal(api.quoteDocumentLabel(q),'OFERTA CENOWA');
 assert.equal(api.quoteDocumentStyle(q),'minimal');
 const html=api.quoteDocument(q);
 assert.match(html,/quote-document--minimal/);
 assert.match(html,/OFERTA CENOWA/);
 assert.match(html,/WARTOŚĆ OFERTY/);
 assert.match(html,/Opis propozycji/);
 assert.match(html,/Termin realizacji/);
 assert.match(html,/Warunki płatności/);
 assert.match(html,/Do 14 dni po akceptacji/);
 assert.match(html,/Przelew po odbiorze/);
 assert.match(html,/500/);
 assert.doesNotMatch(html,/WARTOŚĆ WYCENY/);
});

test('Etap 15.2: treść dokumentu nie pozwala wstrzyknąć HTML', () => {
 const {api,context}=boot({version:18,projects:[],tasks:[]});
 const q=api.normalizeQuotes([{
  id:'x',number:'MANU-2026-004',issued:'2026-11-04',title:'Test',
  documentType:'offer',documentStyle:'minimal',
  introduction:'<img src=x onerror=alert(1)>',
  paymentTerms:'<script>bad()</script>',
  items:[{description:'Usługa',quantity:1,unit:'szt.',unitPrice:100}]
 }])[0];
 const html=api.quoteDocument(q);
 assert.doesNotMatch(html,/<img src=x/);
 assert.doesNotMatch(html,/<script>/);
 assert.match(html,/&lt;img/);
 assert.match(html,/&lt;script&gt;/);
 api.getState().quotes=[q];
 api.quoteForm('',q.id);
 assert.match(context.__lastModal.body,/name="documentType"/);
 assert.match(context.__lastModal.body,/name="documentStyle"/);
 assert.match(context.__lastModal.body,/name="introduction"/);
 assert.match(context.__lastModal.body,/name="deliveryTerms"/);
 assert.match(context.__lastModal.body,/name="paymentTerms"/);
});

test('Etap 15.2: błędne typy i style dokumentów przywracają wartości bezpieczne', () => {
 const {api}=boot({version:18,projects:[],tasks:[]});
 const q=api.normalizeQuotes([{documentType:'other',documentStyle:'other',
  introduction:'A'.repeat(1200),deliveryTerms:'B'.repeat(400),paymentTerms:'C'.repeat(500)}])[0];
 assert.equal(q.documentType,'quote');
 assert.equal(q.documentStyle,'classic');
 assert.equal(q.introduction.length,1000);
 assert.equal(q.deliveryTerms.length,360);
 assert.equal(q.paymentTerms.length,360);
});

test('Etap 15.2: zmiana rodzaju dokumentu dostosowuje tylko domyślne tytuły', () => {
 const {api}=boot({version:18,projects:[],tasks:[]});
 assert.equal(api.quoteTitleForDocumentType('Nowa wycena','offer'),'Oferta cenowa');
 assert.equal(api.quoteTitleForDocumentType('Wycena — Lustro','offer'),'Oferta — Lustro');
 assert.equal(api.quoteTitleForDocumentType('Oferta cenowa','quote'),'Nowa wycena');
 assert.equal(api.quoteTitleForDocumentType('Oferta — Lustro','quote'),'Wycena — Lustro');
 assert.equal(api.quoteTitleForDocumentType('Mój indywidualny tytuł','offer'),'Mój indywidualny tytuł');
});


test('Etap 15.3: termin i status zaległości uwzględniają daty oraz nie obejmują anulowanych', () => {
 const {api}=boot({version:18,tasks:[],projects:[
  job('late',{price:400,paid:100,paymentDue:'2026-11-03',payments:[{date:'2026-11-01',kind:'zaliczka',amount:50}]}),
  job('today',{price:200,paid:0,paymentDue:'2026-11-04'}),
  job('soon',{price:120,paid:0,paymentDue:'2026-11-10'}),
  job('later',{price:150,paid:0,paymentDue:'2026-11-17'}),
  job('undated',{price:80,paid:0}),
  job('paid',{price:100,paid:100,paymentDue:'2026-11-01'}),
  job('cancelled',{price:999,paid:0,status:'Anulowane',paymentDue:'2026-11-01'})
 ]});
 const d=api.paymentControlData('2026-11-04');
 assert.equal(d.rows.length,5);
 assert.equal(d.rows.map(x=>x.status).join(','),'late,today,soon,later,none');
 assert.equal(d.rows[0].unpaid,250);
 assert.equal(d.overdue,250);
 assert.equal(d.advance,50);
 assert.equal(d.remaining,800);
 assert.equal(d.received,250);
 assert.doesNotMatch(api.paymentControlRows('late'),/Lustro cancelled/);
});

test('Etap 15.3: zaliczki warsztatu pochodzą tylko od potwierdzonych uczestników', () => {
 const {api}=boot({version:18,tasks:[],projects:[{
  id:'w',title:'Warsztaty gotyku',type:'Warsztat',financeMode:'participants',
  paymentDue:'2026-11-06',status:'Planowane',price:1000,paid:900,
  payments:[{amount:700,kind:'zaliczka',date:'2026-11-01'}],
  participants:[
   {id:'a',name:'Anna',fee:300,paidAmount:50,bookingStatus:'confirmed',
    payments:[{amount:100,kind:'zaliczka',date:'2026-11-02'}]},
   {id:'b',name:'Bartek',fee:200,paidAmount:0,bookingStatus:'confirmed',
    payments:[{amount:60,kind:'wplata',date:'2026-11-02'}]},
   {id:'c',name:'Rezerwa',fee:999,paidAmount:0,bookingStatus:'waitlist',
    payments:[{amount:900,kind:'zaliczka',date:'2026-11-02'}]}
  ]}]});
 const d=api.paymentControlData('2026-11-04');
 assert.equal(d.rows.length,1);
 assert.equal(d.rows[0].participantsMode,true);
 assert.equal(d.rows[0].paid,210);
 assert.equal(d.rows[0].unpaid,290);
 assert.equal(d.advance,100);
 assert.equal(d.rows[0].status,'soon');
 const markup=api.paymentControlRows();
 assert.match(markup,/Uczestnicy i wpłaty/);
 assert.doesNotMatch(markup,/Dodaj wpłatę/);
});

test('Etap 15.3: filtrowanie listy nie przewija strony ani nie zmienia danych', () => {
 const {api,callbacks,nodes,context}=boot({version:18,tasks:[],projects:[
  job('late',{paymentDue:'2026-11-03'}),
  job('nodat',{price:240})
 ]});
 let html='';
 nodes['#payment-control-results']={set innerHTML(next){html=next;}};
 context.window.scrollTo=()=>{throw Error('Lista nie może przewijać ekranu na górę')};
 api.events();
 const before=JSON.stringify(api.getState());
 callbacks.change[0].fn({target:{id:'payment-control-filter',value:'late'}});
 assert.match(html,/Pokaż kolejne|Nie ma należności|Po terminie/);
 assert.equal(JSON.stringify(api.getState()),before);
 assert.match(api.paymentControlPanel(),/Należności i zaliczki/);
});

test('Etap 15.3: panel koduje niebezpieczne nazwy i otwiera rozliczenie projektu', () => {
 const {api,context}=boot({version:18,tasks:[],projects:[
  job('x',{title:'<img src=x onerror=alert(1)>',paymentDue:'2026-11-01',price:50})
 ]});
 const markup=api.paymentControlRows('all');
 assert.match(markup,/&lt;img/);
 assert.doesNotMatch(markup,/<img src=x/);
 api.handleAction({dataset:{action:'payment-control-open',id:'x'}});
 assert.equal(api.opened('x','finance'),true);
 assert.match(context.__lastModal.body,/Finanse i koszty/);
});


test('Etap 15.4: kopia oferty dostaje nowy numer, dzisiejszą datę i czysty termin ważności', () => {
 const {api}=boot({version:18,tasks:[],projects:[job('project', {title:'Lustro'})],quotes:[{
  id:'original',number:'MANU-2026-001',projectId:'project',
  title:'Oferta — Lustro',issued:'2026-10-31',validUntil:'2026-11-01',
  client:'Klient A',clientContact:'a@example.test',issuer:'Pracownia',
  issuerContact:'kontakt',documentType:'offer',documentStyle:'minimal',
  introduction:'Propozycja',deliveryTerms:'14 dni',paymentTerms:'Przelew',
  notes:'Dodatkowe informacje',discount:25,
  items:[{id:'line-old',description:'Grawer',quantity:2,unit:'szt.',unitPrice:200}],
  createdAt:'2026-10-31T12:00:00.000Z'
 }]});
 const source=api.getState().quotes[0],before=JSON.stringify(api.getState());
 const clone=api.quoteCloneDraft(source);
 assert.equal(clone.title,source.title);
 assert.equal(clone.issued,api.localDay());
 assert.equal(clone.validUntil,'');
 assert.equal(clone.number,'MANU-2026-002');
 assert.equal(clone.projectId,'project');
 assert.equal(clone.clientContact,'a@example.test');
 assert.equal(clone.documentType,'offer');
 assert.equal(clone.documentStyle,'minimal');
 assert.equal(clone.discount,25);
 assert.equal(clone.items.length,1);
 assert.equal(clone.items[0].description,'Grawer');
 assert.notEqual(clone.items[0].id,source.items[0].id);
 assert.equal(clone.id,undefined);
 assert.equal(JSON.stringify(api.getState()),before);
});

test('Etap 15.4: powielenie otwiera niezapisaną kopię, nie edycję oryginału', () => {
 const {api,context}=boot({version:18,tasks:[],projects:[],quotes:[{
  id:'q1',number:'MANU-2026-001',title:'Oferta cenowa',issued:'2026-11-01',
  client:'Klient',issuer:'Artysta Akrobata',documentType:'offer',
  items:[{id:'i1',description:'Matowienie',quantity:1,unit:'szt.',unitPrice:450}]
 }]});
 const before=JSON.stringify(api.getState());
 api.handleAction({dataset:{action:'quote-clone',id:'q1'}});
 const body=context.__lastModal.body;
 assert.match(context.__lastModal.title,/Nowy dokument na podstawie/);
 assert.match(body,/data-quote=""/);
 assert.match(body,/Nowa kopia dokumentu/);
 assert.match(body,/MANU-2026-002/);
 assert.match(body,/Matowienie/);
 assert.match(body,/value="450"/);
 assert.match(body,/name="validUntil" type="date" value=""/);
 assert.equal(JSON.stringify(api.getState()),before);
 api.quotePreview('q1');
 assert.match(context.__lastModal.body,/Powiel dokument/);
 assert.match(context.__lastModal.body,/data-action="quote-clone"/);
});

test('Etap 15.4: osierocony projekt nie jest kopiowany jako błędne powiązanie', () => {
 const {api}=boot({version:18,tasks:[],projects:[],quotes:[{
  id:'q1',number:'MANU-2026-001',projectId:'removed',
  title:'Stara oferta',issued:'2026-11-01',
  items:[{id:'i1',description:'Grawer',quantity:1,unit:'szt.',unitPrice:100}]
 }]});
 const draft=api.quoteCloneDraft(api.getState().quotes[0]);
 assert.equal(draft.projectId,'');
});

test('Etap 15.4: ostatnie dane pracowni nie nadpisują klienta ani cen', () => {
 const {api,nodes,context}=boot({version:18,tasks:[],projects:[],quotes:[
  {id:'old',number:'MANU-2026-001',title:'Stare',
   issued:'2026-11-01',createdAt:'2026-11-01T12:00:00.000Z',
   issuer:'Stara pracownia',issuerContact:'stary kontakt',
   items:[{description:'Praca',quantity:1,unit:'szt.',unitPrice:250}]},
  {id:'new',number:'MANU-2026-002',title:'Nowe',
   issued:'2026-11-02',createdAt:'2026-11-02T12:00:00.000Z',
   issuer:'Nowa pracownia',issuerContact:'nowszy kontakt',
   items:[{description:'Praca',quantity:1,unit:'szt.',unitPrice:600}]}
 ]});
 const issuer={value:''},contact={value:''},client={value:'Klient testowy'};
 nodes['#quote-form']={querySelector:selector=>({
  '[name="issuer"]':issuer,'[name="issuerContact"]':contact,'[name="client"]':client
 })[selector]};
 context.window.scrollTo=()=>{throw Error('Nie przewijaj formularza do góry');};
 const before=JSON.stringify(api.getState());
 assert.equal(api.quoteLastIssuer().issuer,'Nowa pracownia');
 api.handleAction({dataset:{action:'quote-fill-issuer'}});
 assert.equal(issuer.value,'Nowa pracownia');
 assert.equal(contact.value,'nowszy kontakt');
 assert.equal(client.value,'Klient testowy');
 assert.equal(JSON.stringify(api.getState()),before);
});

test('MANU 3.23.1: przy czterech przyciskach podglądu Zamknij jest wyśrodkowany na telefonie', () => {
 const css=fs.readFileSync(path.join(ROOT,'styles.css'),'utf8');
 assert.ok(css.includes('.quote-preview-actions .btn:nth-child(4):last-child{'));
 assert.match(css,/\.quote-preview-actions \.btn:nth-child\(4\):last-child\{[\s\S]*?grid-column:1\/-1;[\s\S]*?justify-self:center;[\s\S]*?width:calc\(\(100% - 8px\)\/2\)/);
 const {api,context}=boot({version:18,projects:[],tasks:[],quotes:[{
  id:'q1',number:'MANU-2026-001',title:'Oferta',issued:'2026-11-04',
  items:[{description:'Projekt',quantity:1,unit:'szt.',unitPrice:200}]
 }]});
 api.quotePreview('q1');
 const body=context.__lastModal.body;
 assert.equal((body.match(/class="btn(?: secondary| ghost)?"/g)||[]).length,4);
 assert.ok(body.indexOf('Powiel dokument')<body.indexOf('Zamknij'));
});


test('MANU 3.23.2: z podglądu w Edytuj i Anuluj wracamy do tego samego podglądu bez utraty danych', () => {
 const {api,context,nodes}=boot({version:18,projects:[],tasks:[],quotes:[{
  id:'q1',number:'MANU-2026-001',title:'Oferta — lustro',client:'Klient',
  issued:'2026-11-04',items:[{description:'Lustro',quantity:1,unit:'szt.',unitPrice:450}]
 }]});
 const original=JSON.stringify(api.getState());
 const previousModal={scrollTop:160};
 nodes['.modal']=previousModal;
 nodes['.quote-preview-actions']={dataset:{quotePreview:'q1'}};
 api.quotePreview('q1');
 api.handleAction({dataset:{action:'quote-edit',id:'q1'}});
 assert.match(context.__lastModal.title,/Edytuj wycenę/);
 assert.match(context.__lastModal.body,/Wróć do podglądu/);
 nodes['#quote-form']={};
 nodes['.modal']={scrollTop:0};
 delete nodes['.quote-preview-actions'];
 api.handleAction({dataset:{action:'quote-cancel',project:''}});
 assert.match(context.__lastModal.title,/Wycena MANU-2026-001/);
 assert.match(context.__lastModal.body,/Podgląd|Drukuj \/ zapisz PDF/);
 assert.equal(nodes['.modal'].scrollTop,160);
 assert.equal(JSON.stringify(api.getState()),original);
});

test('MANU 3.23.2: Powiel otwiera szkic, a X wraca do oryginału zamiast zapisać kopię', () => {
 const {api,context,nodes}=boot({version:18,projects:[],tasks:[],quotes:[{
  id:'q1',number:'MANU-2026-001',title:'Oferta cenowa',documentType:'offer',
  issued:'2026-11-04',items:[{description:'Grawer',quantity:2,unit:'szt.',unitPrice:220}]
 }]});
 const original=JSON.stringify(api.getState());
 nodes['.modal']={scrollTop:74};
 nodes['.quote-preview-actions']={dataset:{quotePreview:'q1'}};
 api.handleAction({dataset:{action:'quote-clone',id:'q1'}});
 assert.match(context.__lastModal.body,/Wróć do podglądu/);
 assert.match(context.__lastModal.body,/data-quote=""/);
 nodes['#quote-form']={};
 nodes['.modal']={scrollTop:0};
 delete nodes['.quote-preview-actions'];
 api.handleAction({dataset:{action:'close'}});
 assert.match(context.__lastModal.title,/Oferta cenowa MANU-2026-001/);
 assert.equal(nodes['.modal'].scrollTop,74);
 assert.equal(JSON.stringify(api.getState()),original);
});

test('MANU 3.23.2: zamykanie podglądu bez formularza nie powoduje ponownego otwarcia oferty', () => {
 const {api,context,nodes}=boot({version:18,projects:[],tasks:[],quotes:[{
  id:'q1',number:'MANU-2026-001',title:'Wycena',issued:'2026-11-04',
  items:[{description:'Usługa',quantity:1,unit:'szt.',unitPrice:200}]
 }]});
 api.quotePreview('q1');
 assert.match(context.__lastModal.body,/data-quote-preview="q1"/);
 assert.equal(api.returnToQuotePreview(),false);
 assert.equal(api.getState().quotes.length,1);
});
