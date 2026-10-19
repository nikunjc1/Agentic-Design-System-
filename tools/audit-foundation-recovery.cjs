const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {boot}=require('./foundation-dom-harness.cjs');
let checks=0;
const ok=fn=>{fn();checks++;};
(async()=>{
  let f=await boot('typography.html');
  try{
    const canonical=f.d.querySelector('[data-role="letter-spacing"]'),display=canonical.previousElementSibling.querySelector('[data-unit-display]');
    await f.change(display,2,'input');const saved=f.w.localStorage.getItem('ads:typography');await f.change(display,'','input');
    ok(()=>assert.equal(f.w.localStorage.getItem('ads:typography'),saved));ok(()=>assert.equal(canonical.getAttribute('aria-invalid'),'true'));ok(()=>assert.equal(f.w.ADSFoundation.get().tokens['--type-h1-tracking'],'2px'));
    await f.change(display,3,'input');ok(()=>assert.equal(JSON.parse(f.w.localStorage.getItem('ads:typography')).levels.h1.letterSpacing,3));
    let reader;f.w.FileReader=class{readAsDataURL(){reader=this;}};
    const input=f.d.querySelector('[data-role="upload-input"]');Object.defineProperty(input,'files',{configurable:true,value:[new f.w.File(['a'],'read-error.woff2',{type:'font/woff2'})]});input.dispatchEvent(new f.w.Event('change',{bubbles:true}));reader.error={name:'NotReadableError'};reader.onerror();await f.flush();
    ok(()=>assert.match(f.d.querySelector('[data-role="upload-label"]').textContent,/Couldn't read/));ok(()=>assert.equal(f.w.ADSFoundation.read('typography').primaryFont.family,'Inter'));
    const before=f.w.localStorage.getItem('ads:typography');f.w.FontFace=class{load(){return Promise.reject(new Error('Invalid font'));}};
    input.dispatchEvent(new f.w.Event('change',{bubbles:true}));reader.result='data:font/woff2;base64,YQ==';reader.onload();await f.flush();
    ok(()=>assert.match(f.d.querySelector('[data-role="upload-label"]').textContent,/Couldn't read/));ok(()=>assert.equal(f.w.localStorage.getItem('ads:typography'),before));ok(()=>assert.equal(f.errors.length,0));
  }finally{f.close();}
  for(const page of ['spacing.html','grid-layout.html','icons.html']){
    f=await boot(page);try{
      const n=f.d.querySelector('.ads-sizing [data-unit-display]');await f.change(n,64,'input');ok(()=>assert.equal(f.w.ADSFoundation.read('sizing').control,64));
      f.failRemove(true);f.d.getElementById('resetSharedSizingBtn').click();await f.flush();ok(()=>assert.equal(f.w.ADSFoundation.read('sizing').control,64));
      f.failRemove(false);f.d.getElementById('resetSharedSizingBtn').click();await f.flush();ok(()=>assert.equal(f.w.ADSFoundation.read('sizing'),null));ok(()=>assert.equal(f.w.ADSFoundation.get().tokens['--size-control'],'40px'));
    }finally{f.close();}
  }
  f=await boot('data-format.html');try{
    const zone=f.d.getElementById('format-zone'),mask=f.d.getElementById('format-mask');await f.change(zone,'UTC','input');const saved=f.w.localStorage.getItem('ads:data-format');
    await f.change(zone,'bad/zone','input');await f.change(mask,'ab','input');
    ok(()=>assert.equal(zone.getAttribute('aria-invalid'),'true'));ok(()=>assert.equal(mask.getAttribute('aria-invalid'),'true'));ok(()=>assert.equal(f.w.localStorage.getItem('ads:data-format'),saved));
    await f.change(zone,'Asia/Kolkata','input');ok(()=>assert.equal(mask.getAttribute('aria-invalid'),'true'));await f.change(mask,'•','input');ok(()=>assert.equal(f.w.ADSFoundation.get().dataFormat.zone,'Asia/Kolkata'));ok(()=>assert.equal(f.w.ADSFoundation.get().dataFormat.mask,'•'));
  }finally{f.close();}
  f=await boot('icons.html');try{
    let reader;f.w.FileReader=class{readAsDataURL(){reader=this;}};const input=f.d.querySelector('[data-role="icon-upload-input"]');Object.defineProperty(input,'files',{configurable:true,value:[new f.w.File(['a'],'unreadable.png',{type:'image/png'})]});input.dispatchEvent(new f.w.Event('change',{bubbles:true}));reader.onerror();
    ok(()=>assert.match(f.d.querySelector('[data-role="icon-upload-label"]').textContent,/Could not read/));ok(()=>assert.equal(f.d.querySelectorAll('.icon-upload-thumb').length,0));ok(()=>assert.equal(f.w.localStorage.getItem('ads:icons'),null));
  }finally{f.close();}
  f=await boot('typography.html',{saved:{'ads:typography':{primaryFont:{family:'<invalid>'}}}});try{ok(()=>assert.equal(f.w.ADSFoundation.read('typography'),null));ok(()=>assert.match(f.w.ADSFoundation.get().tokens['--font-display'],/Inter/));}finally{f.close();}
  const report={checks,failures:0,scope:'Typography tracking, font read/load errors, shared sizing reset failures, simultaneous Data Format errors, icon read failures and invalid saved typography'};
  fs.writeFileSync(path.resolve(__dirname,'../audit/foundation-controls-supplement-2026-10-08.json'),JSON.stringify(report,null,2)+'\n');console.log(checks+' supplementary checks passed');
})().catch(e=>{console.error(e);process.exitCode=1;});
