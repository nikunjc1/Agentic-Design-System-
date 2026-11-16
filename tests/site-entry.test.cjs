const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const source=fs.readFileSync(require.resolve('../site-entry.js'),'utf8'),ENTRY='http://localhost/new-project.html';
function boot({href=ENTRY,type='navigate',values=new Map(),name='',blocked=false,frame=false}={}){
 const url=new URL(href),redirects=[],events={},documentEvents={},window={name,addEventListener:(key,fn)=>events[key]=fn};window.top=frame?{}:window;window.self=window;
 const location={href,protocol:url.protocol,host:url.host,pathname:url.pathname,search:url.search,replace:target=>redirects.push(target),reload:()=>redirects.push('reload')};
 const storage={getItem:key=>{if(blocked)throw Error('blocked');return values.get(key)??null;},setItem:(key,value)=>{if(blocked)throw Error('blocked');values.set(key,value);},removeItem:key=>values.delete(key)};
 vm.runInNewContext(source,{window,document:{currentScript:{src:new URL('site-entry.js',href).href},addEventListener:(key,fn)=>documentEvents[key]=fn},location,sessionStorage:storage,performance:{getEntriesByType:()=>[{type}]},URL,Date});return {window,location,redirects,events,documentEvents,values};
}
test('fresh and returning deep links, including saved conversation URLs, always start at project choices',()=>{
 const values=new Map([['ads:project-profile:v1','saved profile'],['ads:project-draft:v1','unfinished draft']]);
 for(const href of ['http://localhost/overview.html','http://localhost/button-primary.html','http://localhost/new-project.html?new=1'])assert.deepEqual(boot({href,values}).redirects,[ENTRY]);
 assert.equal(values.get('ads:project-profile:v1'),'saved profile');assert.equal(values.get('ads:project-draft:v1'),'unfinished draft');assert.deepEqual(boot({values}).redirects,[]);
});
test('a single-use navigation handoff allows browsing, then is consumed',()=>{
 const first=boot();first.window.ADSNavigation.go('history.html');const second=boot({href:'http://localhost/history.html',values:first.values,name:first.window.name});assert.deepEqual(second.redirects,[]);assert.equal(second.window.name,'');
 assert.deepEqual(boot({href:'http://localhost/history.html',values:first.values}).redirects,[ENTRY]);
});
test('file links still work when browser session storage is unavailable',()=>{
 const first=boot({href:'file:///Users/user/Documents/Damco%20Agentic%20Design%20System%202/new-project.html',blocked:true,name:'original'});first.window.ADSNavigation.go('history.html');
 const second=boot({href:'file:///Users/user/Documents/Damco%20Agentic%20Design%20System%202/history.html',blocked:true,name:first.window.name});assert.deepEqual(second.redirects,[]);assert.equal(second.window.name,'original');
});
test('manual reload returns to entry; explicit in-app reload preserves an editor',()=>{
 assert.deepEqual(boot({href:'http://localhost/spacing.html',type:'reload'}).redirects,[ENTRY]);const first=boot();first.window.ADSNavigation.go('spacing.html');const editor=boot({href:'http://localhost/spacing.html',values:first.values,name:first.window.name});editor.window.ADSNavigation.reload();assert.deepEqual(boot({href:editor.location.href,type:'reload',values:editor.values,name:editor.window.name}).redirects,[]);
});
test('internal history navigation remains available and preview frames are never redirected',()=>{
 const values=new Map([['ads:entry-last-page:v1','http://localhost/history.html']]);assert.deepEqual(boot({href:'http://localhost/overview.html',type:'back_forward',values}).redirects,[]);assert.deepEqual(boot({href:'http://localhost/input-text-field.html',frame:true}).redirects,[]);
});
