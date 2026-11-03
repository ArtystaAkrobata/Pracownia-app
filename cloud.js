(function(){
'use strict';
const KEY='manu_cloud_binding_v1';
const config=window.MANU_CLOUD_CONFIG||{};
const URL_PATTERN=/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i;
const validConfig=URL_PATTERN.test(String(config.url||'')) &&
  /^(sb_publishable_|eyJ)/.test(String(config.publishableKey||''));
let bridge=null,client=null,user=null,binding=null,remote=null;
let busy=false,ready=false,conflict=false,applying=false,errorText='',notice='';
let recoveryMode=false;
const recoveryFromUrl=(()=>{
 try{
  const hash=new URLSearchParams(location.hash.slice(1));
  const query=new URLSearchParams(location.search);
  return hash.get('type')==='recovery'||query.get('type')==='recovery';
 }catch(e){return false;}
})();
let timer=null,activeUserId=null;

const escape=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[ch]));
function readBinding(){
 try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}
}
function storeBinding(revision,lastSaved){
 binding={userId:user.id,revision,lastSaved};
 try{localStorage.setItem(KEY,JSON.stringify(binding))}catch(e){
  notice='Nie można zapisać informacji o synchronizacji na telefonie.';
 }
}
function renderIfSettings(){if(bridge)bridge.refresh()}
function emit(message){notice=message;if(bridge)bridge.notify(message);renderIfSettings()}
function textError(err){
 const text=String(err?.message||err||'Nieznany błąd');
 if(/Failed to fetch|NetworkError|fetch failed/i.test(text))return 'Brak połączenia z chmurą. Dane nadal są lokalne.';
 if(/Invalid login credentials/i.test(text))return 'Nieprawidłowy e-mail lub hasło (albo konto nie zostało potwierdzone).';
 return text.length>180?text.slice(0,180)+'…':text;
}
function statusMarkup(){
 if(!validConfig)return '<div class="surface settings-group cloud-section"><h3>☁ Konto i chmura — etap 7</h3>'+
 '<p>Moduł jest przygotowany, ale <b>chmura nie została jeszcze połączona</b>. Wszystkie projekty, wyceny i terminy nadal zapisują się tylko na tym urządzeniu.</p>'+
 '<p class="muted small">Do uruchomienia logowania potrzebny jest projekt Supabase i publiczna konfiguracja. Najpierw pobierz kopię JSON w sekcji poniżej.</p></div>';
 let body='';
 if(!client){
  body='<p>'+escape(errorText||'Inicjowanie bezpiecznego połączenia…')+'</p>';
 }else if(!user){
  body='<p>Zaloguj się lub utwórz konto. Przed pierwszą synchronizacją zdecydujesz, którą kopię danych zachować.</p>'+
  '<form id="cloud-auth-form" class="cloud-auth-form">'+
  '<label>E-mail<input name="email" type="email" autocomplete="email" required maxlength="254"></label>'+
  '<label>Hasło<input name="password" type="password" autocomplete="current-password" required minlength="8"></label>'+
  '<div class="settings-actions"><button type="submit" class="btn" name="mode" value="login">Zaloguj się</button>'+
  '<button type="submit" class="btn secondary" name="mode" value="register">Utwórz konto</button></div></form>'+
  '<div class="cloud-auth-help"><button type="button" class="btn ghost" data-action="cloud-forgot">Nie pamiętasz hasła?</button></div>'+
  '<p class="muted tiny">Po rejestracji może być wymagane kliknięcie linku w e-mailu. Reset hasła jest wysyłany wyłącznie na podany adres.</p>';
 }else if(recoveryMode){
  body='<p>Otrzymaliśmy potwierdzenie linku do odzyskiwania konta. Ustaw nowe hasło dla <b>'+escape(user.email||'Twojego konta')+'</b>.</p>'+
  '<form id="cloud-reset-password-form" class="cloud-auth-form">'+
  '<label>Nowe hasło (minimum 12 znaków)<input name="password" type="password" autocomplete="new-password" minlength="12" required></label>'+
  '<label>Powtórz nowe hasło<input name="confirm" type="password" autocomplete="new-password" minlength="12" required></label>'+
  '<button type="submit" class="btn">Zapisz nowe hasło</button></form>'+
  '<p class="muted tiny">Po zapisaniu hasła wrócisz do profilu. Nie wysyłaj swojego hasła ani linku resetującego nikomu.</p>';
 }else{
  const connected=ready && !conflict && binding?.userId===user.id;
  const current=remote?('W chmurze: wersja '+remote.revision):'Brak zapisanej kopii w chmurze';
  body='<p><b>Konto:</b> '+escape(user.email||'Zalogowano')+'</p>'+
  '<p class="cloud-status '+(conflict?'cloud-status-warning':'')+'">'+
  (conflict?'⚠ Wersje danych różnią się. Synchronizacja zatrzymana.':
   connected?'✓ Automatyczna synchronizacja włączona.':
   'Synchronizacja nieaktywna. Najpierw wybierz, którą kopię zachować.')+'</p>'+
  '<p class="muted small">'+escape(current)+'</p>'+
  '<div class="settings-actions">'+
  '<button type="button" class="btn" data-action="cloud-upload">Wyślij dane lokalne do chmury</button>'+
  '<button type="button" class="btn secondary" data-action="cloud-download">Pobierz dane z chmury</button>'+
  '<button type="button" class="btn secondary" data-action="cloud-check">Sprawdź synchronizację</button>'+
  '<button type="button" class="btn ghost" data-action="cloud-backup">Pobierz kopię chmury</button>'+
  '<button type="button" class="btn ghost" data-action="cloud-signout">Wyloguj się</button></div>'+
  '<p class="muted tiny">Operacje „Wyślij” i „Pobierz” mogą zastąpić istniejące dane. Zapisz kopie JSON przed potwierdzeniem. Wylogowanie nie usuwa lokalnych projektów.</p>'+
  '<section class="cloud-profile" aria-label="Profil i zabezpieczenia konta">'+
  '<h4>Profil użytkownika</h4>'+
  '<p class="muted small">E-mail: <b>'+escape(user.email||'')+'</b></p>'+
  '<form id="cloud-profile-form" class="cloud-auth-form">'+
  '<label>Nazwa wyświetlana<input name="displayName" type="text" autocomplete="nickname" maxlength="48" value="'+escape(user.user_metadata?.display_name||'')+'" placeholder="Jak mamy Cię nazywać?"></label>'+
  '<button type="submit" class="btn secondary">Zapisz nazwę profilu</button></form>'+
  '<details class="cloud-password-details"><summary>Zmień hasło</summary>'+
  '<form id="cloud-change-password-form" class="cloud-auth-form">'+
  '<label>Obecne hasło<input name="current" type="password" autocomplete="current-password" required></label>'+
  '<label>Nowe hasło (minimum 12 znaków)<input name="password" type="password" minlength="12" autocomplete="new-password" required></label>'+
  '<label>Powtórz nowe hasło<input name="confirm" type="password" minlength="12" autocomplete="new-password" required></label>'+
  '<button type="submit" class="btn">Zapisz nowe hasło</button></form>'+
  '<p class="muted tiny">Jeśli nie pamiętasz obecnego hasła, zamiast tego użyj linku e-mail poniżej.</p></details>'+
  '<button type="button" class="btn ghost cloud-reset-link" data-action="cloud-send-reset">Wyślij link do odzyskania hasła</button>'+
  '</section>';
 }
 return '<div class="surface settings-group cloud-section"><h3>☁ Konto i synchronizacja</h3>'+
  body+(notice?'<p class="muted small" role="status">'+escape(notice)+'</p>':'')+
  (errorText&&client?'<p class="cloud-status cloud-status-warning">'+escape(errorText)+'</p>':'')+'</div>';
}
async function fetchRemote(){
 if(!client||!user)throw Error('Zaloguj się ponownie.');
 const {data,error}=await client.from('manu_snapshots').select('payload,revision,updated_at').eq('user_id',user.id).maybeSingle();
 if(error)throw error;
 remote=data;
 return data;
}
async function applyRecord(row){
 if(!row||!bridge)throw Error('Brak kopii danych w chmurze.');
 if(!bridge.canReplace())throw Error('Najpierw zamknij otwarty formularz, aby nie stracić niezapisanych zmian.');
 applying=true;
 try{
  const saved=await bridge.applyCloud(row.payload);
  if(!saved)throw Error('Lokalny zapis nie powiódł się. Nie zastąpiono danych.');
  storeBinding(row.revision,bridge.getState().lastSaved);
  ready=true;conflict=false;errorText='';
 }finally{applying=false;}
}
async function inspect(){
 if(!client||!user||busy)return;
 busy=true;
 try{
  binding=readBinding();
  const row=await fetchRemote();
  ready=false;conflict=false;
  if(binding?.userId===user.id){
   if(row&&row.revision===binding.revision){
    ready=true;
    if(bridge.getState().lastSaved!==binding.lastSaved)schedulePush();
   }else if(row && bridge.getState().lastSaved===binding.lastSaved && bridge.canReplace()){
    await applyRecord(row);
    emit('Pobrano nowsze dane z chmury.');
   }else{
    conflict=true;
    notice='Dane lokalne i w chmurze wymagają decyzji. Pobierz kopie JSON przed zmianą.';
   }
  }else{
   notice=row?'Na tym urządzeniu są lokalne dane. Wybierz ręcznie wersję do zachowania.':'Chmura jest pusta. Możesz przesłać dane z tego urządzenia.';
  }
  errorText='';
 }catch(e){errorText=textError(e);ready=false;}
 finally{busy=false;renderIfSettings();}
}
function schedulePush(){
 if(!ready||conflict||!user||applying)return;
 clearTimeout(timer);
 timer=setTimeout(()=>{timer=null;void push(false)},1800);
}
async function push(manual){
 if(!client||!user||busy)return;
 if(!manual && (!ready||conflict||binding?.userId!==user.id))return;
 if(navigator.onLine===false){notice='Brak sieci. Dane pozostają lokalnie do ponowienia synchronizacji.';renderIfSettings();return;}
 busy=true;
 try{
  await bridge.waitForWrites();
  if(bridge.isStorageBlocked())throw Error('Lokalny zapis jest wstrzymany. Nie wysłano danych do chmury.');
  const row=await fetchRemote();
  binding=readBinding();
  if(!manual && ((row?.revision||0)!==(binding?.revision||0)||binding?.userId!==user.id)){
   conflict=true;ready=false;
   throw Error('Chmura została zmieniona na innym urządzeniu. Najpierw wybierz, którą wersję zachować.');
  }
  if(manual){
   const msg=row?
     'UWAGA: wysłanie danych z telefonu ZASTĄPI istniejące dane w chmurze. Najpierw pobierz kopię chmurową i lokalną. Kontynuować?':
     'Przesłać projekty, wyceny i inne dane z tego urządzenia na Twoje konto w chmurze?';
   if(!window.confirm(msg))return;
  }
  const snapshot=structuredClone(bridge.getState()),stamp=snapshot.lastSaved;
  let response;
  if(row){
   response=await client.from('manu_snapshots')
    .update({payload:snapshot,revision:row.revision+1,updated_at:new Date().toISOString()})
    .eq('user_id',user.id).eq('revision',row.revision).select('revision').maybeSingle();
  }else{
   response=await client.from('manu_snapshots')
    .insert({user_id:user.id,payload:snapshot,revision:1}).select('revision').maybeSingle();
  }
  if(response.error)throw response.error;
  if(!response.data)throw Error('Wykryto równoczesną zmianę. Nie nadpisano drugiej wersji danych.');
  remote={revision:response.data.revision};
  storeBinding(response.data.revision,stamp);
  ready=true;conflict=false;errorText='';
  if(manual)emit('Dane zapisano w chmurze. Włączono automatyczną synchronizację.');
  if(bridge.getState().lastSaved!==stamp)schedulePush();
 }catch(e){
  ready=false;conflict=true;errorText=textError(e);
  if(manual)window.alert('Nie udało się zapisać w chmurze: '+errorText);
 }finally{busy=false;renderIfSettings();}
}
async function download(){
 if(!client||!user||busy)return;
 busy=true;
 try{
  const row=await fetchRemote();
  if(!row){emit('Na koncie nie ma jeszcze danych do pobrania.');return;}
  const local=bridge.getState();
  const counts='Lokalnie: '+local.projects.length+' projektów, '+(local.quotes||[]).length+' wycen. W chmurze: '+
    (row.payload?.projects?.length||0)+' projektów, '+(row.payload?.quotes?.length||0)+' wycen.';
  if(!window.confirm(counts+'\n\nPobranie ZASTĄPI wszystkie lokalne dane. Czy wcześniej pobrano i sprawdzono kopię JSON?'))return;
  await applyRecord(row);
  emit('Pobrano dane z chmury. Automatyczna synchronizacja włączona.');
 }catch(e){errorText=textError(e);window.alert('Nie udało się pobrać: '+errorText)}
 finally{busy=false;renderIfSettings();}
}
async function cloudBackup(){
 if(!client||!user||busy)return;
 busy=true;
 try{
  const row=await fetchRemote();
  if(!row){emit('Nie ma jeszcze kopii w chmurze.');return;}
  const json=JSON.stringify(row.payload,null,2);
  const url=URL.createObjectURL(new Blob([json],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download='manu-chmura-wersja-'+row.revision+'.json';
  document.body.appendChild(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),4000);
  emit('Przygotowano kopię z chmury. Sprawdź folder Pobrane.');
 }catch(e){errorText=textError(e);window.alert(errorText)}
 finally{busy=false;renderIfSettings();}
}
async function signOut(){
 if(!client||busy)return;
 if(!window.confirm('Wylogować? Dane zapisane lokalnie nadal pozostaną na tym urządzeniu.'))return;
 clearTimeout(timer);ready=false;busy=true;
 try{
  const {error}=await client.auth.signOut();if(error)throw error;
  user=null;remote=null;conflict=false;notice='Wylogowano. Lokalna baza nie została usunięta.';
 }catch(e){errorText=textError(e);window.alert(errorText)}
 finally{busy=false;renderIfSettings();}
}
async function authSubmit(event){
 event.preventDefault();
 if(!client||busy)return;
 const form=event.target;
 const email=String(form.elements.email.value||'').trim(),password=String(form.elements.password.value||'');
 const mode=event.submitter?.value||'login';
 if(!email||password.length<8){window.alert('Podaj e-mail i hasło mające co najmniej 8 znaków.');return;}
 let shouldInspect=false;
 busy=true;
 try{
  const result=mode==='register'?
   await client.auth.signUp({email,password,options:{emailRedirectTo:location.origin+location.pathname}}):
   await client.auth.signInWithPassword({email,password});
  if(result.error)throw result.error;
  form.elements.password.value='';
  if(mode==='register'&&!result.data?.session)emit('Sprawdź pocztę i potwierdź adres e-mail. Następnie zaloguj się.');
  else{user=result.data?.user||result.data?.session?.user||user;emit('Zalogowano. Sprawdź wersje danych przed synchronizacją.');shouldInspect=true;}
  errorText='';
 }catch(e){errorText=textError(e);window.alert(errorText)}
 finally{busy=false;renderIfSettings();if(shouldInspect)void inspect();}
}

function checkNewPassword(form){
 const password=String(form.elements.password.value||'');
 const confirmPassword=String(form.elements.confirm.value||'');
 if(password.length<12){window.alert('Nowe hasło musi mieć co najmniej 12 znaków.');return null;}
 if(password!==confirmPassword){window.alert('Hasła się różnią.');return null;}
 return password;
}
async function requestPasswordReset(email){
 if(!client||busy)return;
 const normalized=String(email||'').trim();
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)){
  window.alert('Wpisz poprawny adres e-mail w formularzu logowania.');return;
 }
 busy=true;
 try{
  const redirectTo=location.origin+location.pathname;
  const {error}=await client.auth.resetPasswordForEmail(normalized,{redirectTo});
  if(error)throw error;
  errorText='';
  emit('Jeśli konto istnieje, wyślemy na podany e-mail link do zmiany hasła. Sprawdź również spam.');
 }catch(e){errorText=textError(e);window.alert('Nie udało się wysłać wiadomości: '+errorText);}
 finally{busy=false;renderIfSettings();}
}
async function saveProfile(event){
 event.preventDefault();
 if(!client||!user||busy)return;
 const form=event.target;
 const name=String(form.elements.displayName.value||'').trim().replace(/\s+/g,' ').slice(0,48);
 if(!name){window.alert('Podaj nazwę profilu.');return;}
 busy=true;
 try{
  const {data,error}=await client.auth.updateUser({data:{display_name:name}});
  if(error)throw error;
  user=data.user||user;errorText='';
  emit('Zapisano nazwę profilu.');
 }catch(e){errorText=textError(e);window.alert('Nie udało się zapisać profilu: '+errorText);}
 finally{busy=false;renderIfSettings();}
}
async function changePassword(event){
 event.preventDefault();
 if(!client||!user||busy)return;
 const form=event.target;
 const newPassword=checkNewPassword(form);
 if(!newPassword)return;
 const currentPassword=String(form.elements.current.value||'');
 if(!currentPassword){window.alert('Podaj obecne hasło.');return;}
 if(currentPassword===newPassword){window.alert('Nowe hasło musi różnić się od dotychczasowego.');return;}
 busy=true;
 try{
  const {error}=await client.auth.updateUser({password:newPassword,current_password:currentPassword});
  if(error)throw error;
  form.reset();errorText='';
  emit('Hasło zostało zmienione. Używaj nowego hasła przy kolejnym logowaniu.');
 }catch(e){errorText=textError(e);window.alert('Nie udało się zmienić hasła: '+errorText);}
 finally{busy=false;renderIfSettings();}
}
async function finishRecovery(event){
 event.preventDefault();
 if(!client||!user||!recoveryMode||busy)return;
 const form=event.target;
 const newPassword=checkNewPassword(form);
 if(!newPassword)return;
 busy=true;
 try{
  const {error}=await client.auth.updateUser({password:newPassword});
  if(error)throw error;
  form.reset();recoveryMode=false;errorText='';
  emit('Nowe hasło zapisano. Konto jest ponownie dostępne.');
  void inspect();
 }catch(e){errorText=textError(e);window.alert('Nie udało się zapisać hasła: '+errorText);}
 finally{busy=false;renderIfSettings();}
}
function loadLibrary(){
 return new Promise((resolve,reject)=>{
  if(window.supabase?.createClient){resolve();return;}
  const script=document.createElement('script');
  script.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  script.onload=()=>window.supabase?.createClient?resolve():reject(Error('Nie załadowano biblioteki chmury.'));
  script.onerror=()=>reject(Error('Nie można pobrać biblioteki chmury. Sprawdź internet.'));
  document.head.appendChild(script);
 });
}
async function init(callbacks){
 bridge=callbacks;
 if(!validConfig)return;
 try{
  await loadLibrary();
  client=window.supabase.createClient(config.url.replace(/\/$/,''),config.publishableKey,{
   auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,storageKey:'manu-supabase-auth-v1'}
  });
  client.auth.onAuthStateChange((event,session)=>{
   const next=session?.user||null;
   if(event==='SIGNED_OUT'){
    user=null;activeUserId=null;ready=false;conflict=false;remote=null;recoveryMode=false;
   }else if(next){
    user=next;
    if(event==='PASSWORD_RECOVERY'){
     recoveryMode=true;
     notice='Ustaw nowe hasło do konta MANU.';
     bridge?.openSettings?.();
    }
    if(activeUserId!==next.id){
     activeUserId=next.id;ready=false;conflict=false;
     if(!recoveryMode)void inspect();
    }
   }
   if(['SIGNED_IN','SIGNED_OUT','PASSWORD_RECOVERY','USER_UPDATED','INITIAL_SESSION'].includes(event))renderIfSettings();
  });
  const result=await client.auth.getUser();
  if(result.error)throw result.error;
  user=result.data?.user||null;activeUserId=user?.id||null;
  if(recoveryFromUrl && user){
   recoveryMode=true;
   bridge?.openSettings?.();
  }
  if(user&&!recoveryMode)void inspect();
  window.addEventListener('online',()=>{if(user)void inspect()});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&user)void inspect()});
  setInterval(()=>{if(user&&document.visibilityState==='visible')void inspect()},90000);
 }catch(e){errorText=textError(e);renderIfSettings();}
}
document.addEventListener('submit',event=>{
 const id=event.target?.id;
 if(id==='cloud-auth-form')void authSubmit(event);
 else if(id==='cloud-profile-form')void saveProfile(event);
 else if(id==='cloud-change-password-form')void changePassword(event);
 else if(id==='cloud-reset-password-form')void finishRecovery(event);
});
window.MANUCloud={
 init,markup:statusMarkup,
 localSaved:()=>{if(!applying)schedulePush()},
 async action(name){
  if(name==='cloud-upload')await push(true);
  else if(name==='cloud-download')await download();
  else if(name==='cloud-check')await inspect();
  else if(name==='cloud-backup')await cloudBackup();
  else if(name==='cloud-signout')await signOut();
  else if(name==='cloud-forgot'){
   const email=document.querySelector('#cloud-auth-form input[name="email"]')?.value||'';
   await requestPasswordReset(email);
  }else if(name==='cloud-send-reset')await requestPasswordReset(user?.email||'');
 }
};
})();
