const test=require('node:test'),assert=require('node:assert/strict'),B=require('../foundation-css-bindings.js');
test('selector lists and specificity handle the library functional selectors',()=>{
 assert.deepEqual(B.split('.a:is(.x,.y), [data-value="a,b"], .b'),['.a:is(.x,.y)','[data-value="a,b"]','.b']);
 for(const [selector,expected]of [['.app-main :is(.a,.b)',[0,2,0]],[':where(#id) .x',[0,1,0]],['div:not(.a,#id)',[1,0,1]],['.a:has(> button:hover)',[0,2,1]],['svg[stroke="currentColor"]',[0,1,1]],['#a .b::before',[1,1,1]]])assert.deepEqual(B.specificity(selector),expected,selector);
});
const style=values=>({getPropertyValue:key=>values[key]?.replace(/\s*!important$/,'')||'',getPropertyPriority:key=>values[key]?.endsWith('!important')?'important':''});
function fixture(rules,inline={},parent=null){const node={style:style(inline),parentElement:parent,matches:s=>s==='*'||s==='.target'||s==='div.target'||s===':root'&&!parent};const document={styleSheets:[{cssRules:rules.map(([selectorText,values])=>({selectorText,style:style(values)}))}],defaultView:{matchMedia:()=>({matches:true}),CSS:{supports:()=>true}}};return {node,reader:B.create(document,{'--space-6':'8px','--space-8':'8px','--radius-sm':'4px','--shadow-sm':'none','--brand':'red','--danger':'red'})};}
test('authored roles win even when token values collide; local aliases resolve',()=>{
 const {node,reader}=fixture([['.target',{gap:'var(--space-6)',color:'var(--danger)',boxShadow:'none','--local-shadow':'var(--shadow-sm)','box-shadow':'var(--local-shadow)'}]]);
 assert.equal(reader.read(node,'gap'),'var(--space-6)');assert.equal(reader.read(node,'color'),'var(--danger)');assert.equal(reader.read(node,'box-shadow'),'var(--shadow-sm)');
});
test('specificity, source order, inline styles and important declarations are respected',()=>{
 const {node,reader}=fixture([['div.target',{color:'var(--danger)'}],['.target',{color:'var(--brand)',gap:'var(--space-8) !important'}]],{color:'var(--brand)',gap:'var(--space-6)'});
 assert.equal(reader.read(node,'color'),'var(--brand)');assert.equal(reader.read(node,'gap'),'var(--space-8)');
 const second=fixture([['div.target',{color:'var(--danger)'}],['.target',{color:'var(--brand)'}]]);assert.equal(second.reader.read(second.node,'color'),'var(--danger)');
});
test('unknown references use fallbacks and cycles never produce invented links',()=>{
 const {node,reader}=fixture([['.target',{gap:'var(--unknown,var(--space-6))',color:'var(--loop)','--loop':'var(--loop)'}]]);
 assert.equal(reader.read(node,'gap'),'var(--space-6)');assert.equal(reader.read(node,'color'),null);
});
test('variable shorthands preserve the authored side and corner tokens',()=>{
 const s=style({padding:'var(--space-6) var(--space-12)',gap:'var(--space-6) var(--space-8)','border-radius':'var(--radius-sm) var(--radius-md)',border:'var(--border-width-1) var(--border-style) var(--control-border)'});
 assert.equal(B.declaration(s,'padding-top'),'var(--space-6)');assert.equal(B.declaration(s,'padding-left'),'var(--space-12)');assert.equal(B.declaration(s,'column-gap'),'var(--space-8)');assert.equal(B.declaration(s,'border-top-right-radius'),'var(--radius-md)');assert.equal(B.declaration(s,'border-top-width'),'var(--border-width-1)');assert.equal(B.declaration(s,'border-top-style'),'var(--border-style)');assert.equal(B.declaration(s,'border-top-color'),'var(--control-border)');
});
test('single-color background shorthands retain their surface role',()=>{
 assert.equal(B.declaration(style({background:'var(--color-surface-panel)'}),'background-color'),'var(--color-surface-panel)');
 assert.equal(B.declaration(style({background:'linear-gradient(red, blue)'}),'background-color'),null);
});
test('selector prefilter respects functional selectors and attribute contents',()=>{
 assert.deepEqual(B.target('.app-main .field:hover'),{kind:'.',name:'field'});
 assert.deepEqual(B.target('.button svg[stroke="currentColor"]'),{kind:'',name:'svg'});
 assert.equal(B.target('.app-main :is(.field,.control)'),null);
 assert.deepEqual(B.target('[data-name="a > b"] .item'),{kind:'.',name:'item'});
});
test('reset rereads changed inline bindings between variant captures',()=>{
 const values={color:'var(--danger)'};const f=fixture([],values);
 assert.equal(f.reader.read(f.node,'color'),'var(--danger)');values.color='var(--brand)';f.reader.reset();assert.equal(f.reader.read(f.node,'color'),'var(--brand)');
});
