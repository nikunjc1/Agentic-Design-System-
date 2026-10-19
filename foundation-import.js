(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./foundation-model.js'):root.ADSFoundationModel);if(typeof module==='object'&&module.exports)module.exports=api;else root.ADSFoundationImport=api;})(typeof globalThis==='undefined'?this:globalThis,function(M){
  'use strict';
  function validate(value){
    if(!value||value.schemaVersion!==1||!value.settings||typeof value.settings!=='object'||Array.isArray(value.settings))throw new TypeError('Choose a Foundation JSON export with schemaVersion 1 and settings.');
    const settings={};for(const [key,record]of Object.entries(value.settings)){
      if(!M.recordKeys.includes(key))throw new TypeError('Unsupported settings key: '+key);
      settings[key]=record==null?null:M.migrateRecord(key,record);
    }
    const context=value.context;
    if(context!=null&&(!context||typeof context!=='object'||!['SaaS','Enterprise SaaS','Web Application','Dashboard','Data-Heavy Application','Marketing Website','Consumer App','AI Product','Cross-Platform','Other'].includes(context.productType)||!Array.isArray(context.platforms)||context.platforms.some(v=>!['desktop-web','mobile-web','mobile-app','tablet','desktop-app'].includes(v))))throw new TypeError('Unsupported project context.');
    return {schemaVersion:1,settings,context:context?{productType:context.productType,platforms:[...context.platforms]}:null};
  }
  function resolve(value,theme='light'){if(!['light','dark'].includes(theme))throw new RangeError('Unsupported theme');const payload=validate(value);return M.resolve(payload.settings,theme,payload.context);}
  return {validate,resolve};
});
