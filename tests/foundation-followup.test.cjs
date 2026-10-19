const test=require('node:test'),assert=require('node:assert/strict');
const M=require('../foundation-model.js');
test('data formatting preserves Unicode redaction, invalid values, date-only identity and ordered ranges',()=>{
  assert.equal(M.format('🔒😀','partial',{reveal:8}),'****😀');
  assert.equal(M.format('🔒','partial',{reveal:8}),'****');
  for(const value of [true,false,{},'   '])assert.equal(M.format(value,'number',{}),'–');
  assert.equal(M.format(0,'number',{}),'0');
  for(const value of ['2026-01-01',{start:'2026-01-01'},['2026-01-01'],['2026-01-02','2026-01-01'],['invalid','2026-01-01']])assert.equal(M.format(value,'range',{}),'–');
  assert.equal(M.format(['2026-01-01','2026-01-02'],'range',{}),'2026-01-01 – 2026-01-02');
  assert.equal(M.format('2026-03-14','date',{zone:'America/Los_Angeles'}),'2026-03-14');
});
test('12px contrast pills keep readable foregrounds on their own status tint in both themes',()=>{
  for(const theme of ['light','dark'])for(const surface of ['#FFFFFF','#15171A','#0805D9']) {
    const t=M.resolve({'bg-colors':{[theme]:{secondary:surface}}},theme).tokens;
    for(const state of ['pass','fail'])assert.ok(M.contrast(t['--contrast-'+state+'-text'],t['--contrast-'+state+'-bg'])>=4.5);
  }
});
