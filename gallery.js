(function(){
'use strict';
const MAX_PHOTOS=50;
const MAX_SOURCE_BYTES=25*1024*1024;
let bridge=null,working=false,focusReturn=null;
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const kinds={before:'Przed',after:'Po',final:'Gotowa praca'};
const bucketReady=()=>!!window.MANUCloud?.galleryConnected?.();
const getProject=id=>bridge?.getState()?.projects.find(p=>p.id===id);
const photoById=(p,id)=>(p?.photos||[]).find(photo=>photo.id===id);
function tile(photo,p,small=false){
 const id=escape(photo.id),pid=escape(p.id);
 const kind=kinds[photo.kind]||kinds.final;
 return '<article class="manu-photo-tile '+(small?'manu-photo-tile-small':'')+'">'+
 '<button type="button" class="manu-photo-open" data-action="gallery-preview" data-id="'+pid+'" data-photo="'+id+'" aria-label="Powiększ zdjęcie">'+
 '<span class="manu-photo-image"><img loading="lazy" alt="'+escape(photo.caption||kind)+'" data-gallery-path="'+escape(photo.path)+'"></span>'+
 '<span class="manu-photo-kind">'+escape(kind)+'</span></button>'+
 (!small?'<div class="manu-photo-details"><p>'+escape(photo.caption||kind)+'</p>'+
 '<div class="manu-photo-tools"><button type="button" class="btn ghost sm" data-action="gallery-edit" data-id="'+pid+'" data-photo="'+id+'">Opis</button>'+
 '<button type="button" class="btn ghost sm" data-action="gallery-delete" data-id="'+pid+'" data-photo="'+id+'" aria-label="Usuń zdjęcie">Usuń</button></div></div>':'')+
 '</article>';
}
function album(p){
 const photos=(p.photos||[]);
 const status=bucketReady()?'':'<p class="muted tiny">Aby dodawać fotografie, zaloguj się i aktywuj synchronizację. Magazyn zdjęć musi być skonfigurowany w Supabase.</p>';
 return '<section class="detail-section manu-gallery-section" id="manu-project-gallery">'+
 '<div class="section-head"><h3>Galeria realizacji <small>('+photos.length+')</small></h3>'+
 '<button type="button" class="btn secondary sm" data-action="gallery-add" data-id="'+escape(p.id)+'" '+(!bucketReady()?'disabled title="Wymaga zalogowania i synchronizacji"':'')+'>Dodaj zdjęcie</button></div>'+
 (photos.length?'<div class="manu-photo-grid">'+photos.map(photo=>tile(photo,p)).join('')+'</div>':
 '<div class="manu-gallery-empty"><p>Nie ma jeszcze zdjęć tej realizacji.</p><small>Dodaj zdjęcia przed, po lub gotowe dzieło.</small></div>')+
 status+'<p class="muted tiny">Zdjęcia są prywatne i przechowywane osobno w Supabase Storage. Kopia JSON zachowuje tylko opisy i powiązania — nie zawiera plików zdjęć.</p></section>';
}
function overview(projects){
 const items=(projects||[]).filter(p=>(p.photos||[]).length)
  .sort((a,b)=>(b.createdAt||'').localeCompare(a.createdAt||''));
 if(!items.length)return '<div class="manu-gallery-empty manu-gallery-empty-large"><h3>Twoja galeria czeka na pierwsze zdjęcia</h3>'+
 '<p>Otwórz projekt i dodaj fotografie z realizacji.</p>'+
 '<button type="button" class="btn secondary" data-action="nav" data-view="projects">Przejdź do projektów</button></div>';
 return '<div class="manu-gallery-albums">'+items.map(p=>{
  const photos=p.photos||[];
  return '<article class="manu-gallery-album"><div class="manu-album-heading"><div><h3>'+escape(p.title)+'</h3>'+
   '<p>'+photos.length+' zdjęć · '+escape(p.type)+'</p></div>'+
   '<button type="button" class="btn secondary sm" data-action="gallery-open-project" data-id="'+escape(p.id)+'">Otwórz projekt</button></div>'+
   '<div class="manu-photo-grid manu-photo-grid-overview">'+photos.slice(0,4).map(photo=>tile(photo,p,true)).join('')+'</div></article>';
 }).join('')+'</div>';
}
async function hydrate(root){
 if(!root||!window.MANUCloud?.galleryUrls)return;
 const imgs=[...root.querySelectorAll('img[data-gallery-path]:not([data-gallery-ready])')];
 if(!imgs.length)return;
 const paths=[...new Set(imgs.map(i=>i.dataset.galleryPath))];
 let urls={};
 try{urls=await window.MANUCloud.galleryUrls(paths)}
 catch(e){root.querySelectorAll('.manu-gallery-error').forEach(x=>x.remove());
  const msg=document.createElement('p');msg.className='manu-gallery-error';
  msg.textContent='Nie udało się wczytać fotografii. Zaloguj się lub sprawdź konfigurację magazynu Supabase.';
  const holder=root.querySelector('.manu-photo-grid');
  if(holder)holder.before(msg);return;
 }
 for(const img of imgs){
  if(!img.isConnected||img.dataset.galleryReady)continue;
  const url=urls[img.dataset.galleryPath];
  if(!url)continue;
  img.addEventListener('load',()=>img.classList.add('is-loaded'),{once:true});
  img.addEventListener('error',()=>img.classList.add('load-error'),{once:true});
  img.dataset.galleryReady='1';
  img.src=url;
 }
}
async function compressedImage(file){
 if(!file||!file.size||file.size>MAX_SOURCE_BYTES)throw Error('Wybierz zdjęcie o rozmiarze do 25 MB.');
 if(file.type&&!file.type.startsWith('image/'))throw Error('Wybierz plik graficzny.');
 let sourceUrl=URL.createObjectURL(file);
 try{
  const photo=await new Promise((resolve,reject)=>{
   const img=new Image();
   img.onload=()=>resolve(img);
   img.onerror=()=>reject(Error('Telefon nie potrafi odczytać tego zdjęcia. Spróbuj JPEG lub PNG.'));
   img.src=sourceUrl;
  });
  const w=photo.naturalWidth,h=photo.naturalHeight;
  if(!w||!h)throw Error('Nieprawidłowe wymiary zdjęcia.');
  const factor=Math.min(1,1600/w,1600/h);
  const canvas=document.createElement('canvas');
  canvas.width=Math.max(1,Math.round(w*factor));canvas.height=Math.max(1,Math.round(h*factor));
  const ctx=canvas.getContext('2d');
  if(!ctx)throw Error('Brak obsługi zmniejszania zdjęć w przeglądarce.');
  ctx.fillStyle='#ffffff';ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(photo,0,0,canvas.width,canvas.height);
  const convert=quality=>new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('Nie udało się przygotować JPEG.')),'image/jpeg',quality));
  let blob=await convert(0.82);
  if(blob.size>5242880)blob=await convert(0.64);
  if(blob.size>5242880)throw Error('Plik po zmniejszeniu jest nadal za duży.');
  return blob;
 }finally{URL.revokeObjectURL(sourceUrl);}
}
function showAdd(projectId){
 const p=getProject(projectId);if(!p)return;
 if(!bucketReady()){alert('Zaloguj się i włącz synchronizację MANU. Następnie uruchom magazyn zdjęć w Supabase.');return}
 if((p.photos||[]).length>=MAX_PHOTOS){alert('Limit 50 zdjęć na projekt.');return}
 bridge.modal('Dodaj zdjęcie do: '+p.title,
 '<form id="gallery-photo-form" data-id="'+escape(projectId)+'" class="manu-gallery-form">'+
 '<div class="field"><label>Zdjęcie z telefonu *</label><input type="file" name="photo" accept="image/*" required></div>'+
 '<div class="field"><label>Rodzaj fotografii</label><select name="kind">'+
 '<option value="final">Gotowa praca</option><option value="before">Przed</option><option value="after">Po</option></select></div>'+
 '<div class="field"><label>Krótki opis</label><textarea name="caption" maxlength="200" rows="3" placeholder="Np. Przygotowania lub gotowa realizacja"></textarea></div>'+
 '<p class="muted small">MANU zmniejszy zdjęcie do maks. 1600 px i wyśle prywatnie do Supabase. Oryginalny plik pozostanie w telefonie. Potrzebujesz internetu.</p>'+
 '<div class="modal-actions"><button type="button" class="btn ghost" data-action="gallery-return" data-id="'+escape(projectId)+'">Anuluj</button>'+
 '<button type="submit" class="btn">Zapisz zdjęcie</button></div></form>');
}
function showEdit(projectId,photoId){
 const p=getProject(projectId),photo=photoById(p,photoId);if(!photo)return;
 bridge.modal('Opis fotografii',
 '<form id="gallery-edit-form" data-id="'+escape(projectId)+'" data-photo="'+escape(photoId)+'" class="manu-gallery-form">'+
 '<div class="field"><label>Rodzaj</label><select name="kind">'+
 Object.entries(kinds).map(([key,label])=>'<option value="'+key+'" '+(photo.kind===key?'selected':'')+'>'+escape(label)+'</option>').join('')+
 '</select></div><div class="field"><label>Opis zdjęcia</label>'+
 '<textarea name="caption" maxlength="200" rows="3">'+escape(photo.caption||'')+'</textarea></div>'+
 '<div class="modal-actions"><button type="button" class="btn ghost" data-action="gallery-return" data-id="'+escape(projectId)+'">Anuluj</button>'+
 '<button type="submit" class="btn">Zapisz opis</button></div></form>');
}
async function showPreview(projectId,photoId){
 const p=getProject(projectId),photo=photoById(p,photoId);if(!photo)return;
 const host=document.getElementById('gallery-lightbox');
 if(!host)return;
 focusReturn=document.activeElement;
 host.innerHTML='<div class="manu-lightbox-backdrop" data-action="gallery-close">'+
 '<div class="manu-lightbox-panel" role="dialog" aria-modal="true" aria-label="Podgląd fotografii">'+
 '<button type="button" class="manu-lightbox-close" data-action="gallery-close" aria-label="Zamknij podgląd">×</button>'+
 '<div class="manu-lightbox-photo"><img alt="'+escape(photo.caption||kinds[photo.kind]||'Zdjęcie')+'" data-gallery-path="'+escape(photo.path)+'"></div>'+
 '<div class="manu-lightbox-caption">'+escape(photo.caption||kinds[photo.kind]||'Zdjęcie')+'</div></div></div>';
 document.body.classList.add('gallery-lightbox-open');
 // Zarejestruj podgląd jako osobny poziom Android Wstecz.
 bridge?.onPreviewOpen?.();
 host.querySelector('.manu-lightbox-close')?.focus();
 await hydrate(host);
}
function closePreview(){
 const host=document.getElementById('gallery-lightbox');if(host)host.innerHTML='';
 document.body.classList.remove('gallery-lightbox-open');
 if(focusReturn?.isConnected)focusReturn.focus();
 focusReturn=null;
}
function handleAction(b){
 const action=b.dataset.action,projectId=b.dataset.id,photoId=b.dataset.photo;
 if(action==='gallery-add')showAdd(projectId);
 else if(action==='gallery-edit')showEdit(projectId,photoId);
 else if(action==='gallery-preview')void showPreview(projectId,photoId);
 else if(action==='gallery-close'){
  if(!bridge?.onPreviewClose?.())closePreview();
 }
 else if(action==='gallery-return')bridge.projectDetail(projectId);
 else if(action==='gallery-open-project')bridge.projectDetail(projectId);
 else if(action==='gallery-delete')void removePhoto(projectId,photoId);
}
async function removePhoto(projectId,photoId){
 if(working)return;
 const p=getProject(projectId),photo=photoById(p,photoId);if(!photo)return;
 if(!bucketReady()){alert('Usuwanie zdjęć wymaga zalogowania i aktywnej synchronizacji.');return;}
 if(!confirm('Usunąć to zdjęcie z galerii i z chmury? Tej operacji nie można cofnąć przez kopię JSON.'))return;
 working=true;
 const original=p.photos;
 try{
  p.photos=original.filter(item=>item.id!==photoId);
  const saved=await bridge.save();
  if(!saved){p.photos=original;throw Error('Nie udało się zapisać galerii. Zdjęcia nie usunięto z chmury.');}
  try{await window.MANUCloud.galleryRemove(photo.path);}
  catch(e){bridge.toast('Opis zdjęcia usunięty, ale plik pozostał w Storage. Sprawdź miejsce w Supabase.');}
  bridge.render();
  bridge.projectDetail(projectId);
  bridge.toast('Usunięto zdjęcie z galerii.');
 }catch(e){alert(String(e.message||e));}
 finally{working=false;}
}
async function submit(form){
 if(working)return;
 const id=form.dataset.id,p=getProject(id);if(!p)return;
 working=true;
 const button=form.querySelector('[type="submit"]');
 if(button){button.disabled=true;button.textContent='Zapisywanie zdjęcia…';}
 try{
  if(form.id==='gallery-edit-form'){
   const photo=photoById(p,form.dataset.photo);if(!photo)throw Error('Nie znaleziono fotografii.');
   const before={kind:photo.kind,caption:photo.caption};
   photo.kind=kinds[form.elements.kind.value]?form.elements.kind.value:'final';
   photo.caption=String(form.elements.caption.value||'').trim().slice(0,200);
   const saved=await bridge.save();
   if(!saved){Object.assign(photo,before);throw Error('Nie można zapisać opisu zdjęcia.');}
   bridge.render();bridge.projectDetail(id);bridge.toast('Zapisano opis fotografii.');
  }else{
   if(!bucketReady())throw Error('Synchronizacja z chmurą jest nieaktywna.');
   if((p.photos||[]).length>=MAX_PHOTOS)throw Error('Limit 50 zdjęć na projekt.');
   const file=form.elements.photo.files?.[0];
   if(!file)throw Error('Wybierz zdjęcie.');
   const blob=await compressedImage(file);
   const uploaded=await window.MANUCloud.galleryUpload(id,blob);
   const photo={
    id:uploaded.id,path:uploaded.path,
    kind:kinds[form.elements.kind.value]?form.elements.kind.value:'final',
    caption:String(form.elements.caption.value||'').trim().slice(0,200),
    size:uploaded.size,createdAt:new Date().toISOString()
   };
   p.photos=p.photos||[];
   p.photos.push(photo);
   const saved=await bridge.save();
   if(!saved){
    p.photos=p.photos.filter(x=>x.id!==photo.id);
    try{await window.MANUCloud.galleryRemove(uploaded.path);}catch(e){}
    throw Error('Zapis metadanych się nie udał. Nie dodano zdjęcia.');
   }
   bridge.render();bridge.projectDetail(id);bridge.toast('Zdjęcie zapisane w prywatnej galerii.');
  }
 }catch(e){
  alert('Nie udało się zapisać zdjęcia: '+String(e?.message||e));
 }finally{
  working=false;
  if(button?.isConnected){button.disabled=false;button.textContent='Zapisz zdjęcie';}
 }
}
window.MANUGallery={init:api=>{bridge=api},album,overview,hydrate,handleAction,submit,closePreview,isPreviewOpen:()=>!!document.querySelector('#gallery-lightbox .manu-lightbox-backdrop')};
})();
