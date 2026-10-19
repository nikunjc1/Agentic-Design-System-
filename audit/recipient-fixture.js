(()=>{'use strict';const $=id=>document.getElementById('fixture-'+id),M=window.ADSFoundationModel,I=window.ADSFoundationImport;let payload={schemaVersion:1,settings:{}},generation=0,faces=[];
function apply(){
 const theme=$('theme').value,settings={...payload.settings,units:{unit:$('unit').value,schemaVersion:1}},resolved=I.resolve({...payload,settings},theme);
 document.documentElement.dataset.theme=theme;document.documentElement.dir=$('direction').value;
 for(const [key,value]of Object.entries(resolved.tokens))document.documentElement.style.setProperty(key,value);
 for(const node of document.querySelectorAll('h1,h2,h3,h4,h5,h6,p')){const role=node.dataset.typeRole||(/^H/.test(node.tagName)?node.tagName.toLowerCase():'body');for(const [prop,suffix]of Object.entries({fontFamily:'family',fontSize:'size',fontWeight:'weight',fontStyle:'style',lineHeight:'line-height',letterSpacing:'tracking',color:'color'}))node.style[prop]='var(--type-'+role+'-'+suffix+')';}
 $('values').textContent=JSON.stringify(resolved,null,2);$('icon').innerHTML=M.iconMarkup('edit');
}
async function importJSON(text){const request=++generation;
 try{
  const next=I.validate(JSON.parse(text));payload=next;$('unit').value=next.settings.units?.unit||'px';
  for(const face of faces)document.fonts?.delete(face);faces=[];
  document.querySelectorAll('link[data-fixture-font]').forEach(link=>link.remove());$('assets').replaceChildren();
  for(const asset of payload.settings.icons?.uploads||[]){const img=document.createElement('img');img.alt=asset.name;img.src=asset.dataUrl;img.onerror=()=>{$('status').textContent='Image decode failed: '+asset.name;};$('assets').append(img);}
  apply();$('status').textContent='Imported valid settings. Loading declared font dependencies…';
  for(const field of ['primaryFont','secondaryFont']){
   const font=payload.settings.typography?.[field];if(!font?.family)continue;
   if(font.dataUrl){const face=new FontFace(font.family,'url("'+font.dataUrl+'")');const loaded=await face.load();if(request!==generation)return;document.fonts.add(loaded);faces.push(loaded);}
   else if(font.linkHref){const link=document.createElement('link');link.rel='stylesheet';link.href=font.linkHref;link.dataset.fixtureFont='';await new Promise((resolve,reject)=>{link.onload=resolve;link.onerror=()=>reject(Error('Font stylesheet failed: '+font.family));document.head.append(link);});if(request!==generation){link.remove();return;}const decoded=await document.fonts.load('400 16px '+JSON.stringify(font.family));if(!decoded.length)throw Error('Font unavailable: '+font.family);}
  }
  if(request===generation)$('status').textContent='Imported valid settings and loaded declared dependencies. Complete rendered comparison separately.';
 }catch(error){if(request===generation)$('status').textContent='Import / dependency error: '+error.message;}
}
$('apply').addEventListener('click',()=>importJSON($('json').value));$('file').addEventListener('change',async()=>{const file=$('file').files[0];if(!file)return;if(file.size>10000000){$('status').textContent='Choose a JSON export up to 10MB.';return;}try{$('json').value=await file.text();await importJSON($('json').value);}catch{$('status').textContent='Could not read the export. Try again.';}});
for(const id of ['theme','unit','direction'])$(id).addEventListener('change',apply);apply();})();
