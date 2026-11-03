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
    ' normalize, validateBackup, metrics, expenses, projectIncome, projectPaid,',
    ' calendarEvents, smartAlertsData, plusDaysDate, localDay,',
    ' costCategoryData, profitabilityData, comparisonSelection, comparisonMetrics,',
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
  const footer={insertAdjacentHTML:(position,html)=>{assert.equal(position,'beforebegin');inserted=html;},remove:()=>{removed=true}};
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
