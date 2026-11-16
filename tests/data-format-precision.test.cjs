const test=require('node:test'),assert=require('node:assert/strict'),M=require('../foundation-model.js');
test('relative seconds are localized, directional and respect the disabled setting',()=>{
 const now='2026-03-14T14:08:00Z';
 for(const locale of ['en-GB','fr-FR','ja-JP','ar-EG'])for(const seconds of [-30,0,30]){
  const date=new Date(new Date(now).getTime()+seconds*1000).toISOString();
  assert.equal(M.format(date,'relative',{locale},{now}),new Intl.RelativeTimeFormat(locale,{numeric:'auto'}).format(seconds,'second'));
 }
 assert.equal(M.format(now,'relative',{relative:false},{now}),'03/14/2026');
});
test('all supported decimal-comma locales reject ambiguous comma grouping',()=>{
 for(const locale of ['de-DE','fr-FR','es-ES','it-IT','pt-BR']){
  assert.equal(M.normalizeData({locale,separator:'comma'}).separator,'locale');
  assert.equal(M.validRecord('data-format',{locale,separator:'comma'}),false);
 }
 assert.equal(M.format(1234567.5,'number',{locale:'en-IN'}),'12,34,567.5');
});
test('date-only ranges retain endpoints across zones; quantities and masks retain value identity',()=>{
 for(const zone of ['UTC','America/Los_Angeles','Asia/Kolkata','Pacific/Kiritimati'])assert.equal(M.format(['2026-01-01','2026-03-31'],'range',{zone}),'01/01/2026 to 03/31/2026');
 assert.equal(M.format(.125,'percent',{}),'12.5%');
 assert.equal(M.format(220,'unit',{unit:'kW',unitSpace:'nbsp'}),'220\u00a0kW');
 assert.equal(M.format(0,'number',{}),'0');
 assert.equal(M.format('123456781402','redaction',{redaction:'full'}),'************');
});
