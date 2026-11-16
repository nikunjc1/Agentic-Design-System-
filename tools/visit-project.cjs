// Exercise normal app navigation when a check needs an interior page.
// Direct page.goto represents a fresh visit and shows project choices.
async function visit(page,destination){
 const target=new URL(destination),entry=new URL('new-project.html',target);
 if(!await page.evaluate(()=>Boolean(window.ADSNavigation&&!window.ADSNavigation.redirecting)).catch(()=>false))await page.goto(entry.href);
 await page.waitForFunction(()=>Boolean(window.ADSNavigation&&!window.ADSNavigation.redirecting));
 if(target.href===page.url()){
  await Promise.all([page.waitForEvent('load'),page.evaluate(()=>window.ADSNavigation.reload())]);return;
 }
 const expected=await page.evaluate(href=>{const url=new URL(href),file=url.pathname.split('/').pop(),alias=window.ADSWorkbenchCatalog?.routes[file],merged={'patterns.html':'overview.html','templates.html':'overview.html','figma-export.html':'md-export.html?format=figma','history.html':'overview.html#projects','values.html':'principles.html#design-values','ai-generator.html':'md-export.html#ai-handoff','settings.html':'overview.html#preferences'};return merged[file]?new URL(merged[file],url).href:!file||file==='index.html'?window.ADSNavigation.entry:alias?new URL(alias+url.search,url).href:url.href;},target.href);
 const current=new URL(page.url());
 if(current.pathname===target.pathname&&current.search===target.search){await page.evaluate(href=>window.ADSNavigation.go(href),target.href);await page.waitForURL(expected);return;}
 await Promise.all([page.waitForEvent('load'),page.evaluate(href=>window.ADSNavigation.go(href),target.href)]);
 await page.waitForURL(expected,{waitUntil:'load'});
}
module.exports={visit};
