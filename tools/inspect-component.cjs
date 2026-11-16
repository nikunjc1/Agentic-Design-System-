// Capture an actual running implementation for contract comparison.
// Usage: ADS_PLAYWRIGHT_PACKAGE=/path/to/playwright-core node tools/inspect-component.cjs URL SELECTOR OUTPUT.html
const fs=require('node:fs'),assert=require('node:assert/strict');
const {chromium}=require(process.env.ADS_PLAYWRIGHT_PACKAGE||'playwright-core');
(async()=>{const [url,selector,output]=process.argv.slice(2);assert.ok(url&&selector&&output,'Provide URL, component root selector and output HTML path.');const browser=await chromium.launch({headless:true,executablePath:process.env.ADS_CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});try{const page=await browser.newPage();await page.goto(url);const html=await page.locator(selector).evaluate(root=>{
 if(!root.dataset.adsComponent)throw new Error('Instrument the root with data-ads-component, data-ads-values and stable data-ads-part attributes on anatomy parts.');
 const copy=root.cloneNode(true),originals=[root,...root.querySelectorAll('*')],copies=[copy,...copy.querySelectorAll('*')];
 originals.forEach((node,index)=>{const style=getComputedStyle(node);for(const property of style)copies[index].style.setProperty(property,style.getPropertyValue(property));if(node instanceof HTMLInputElement){copies[index].setAttribute('value',node.value);if(node.checked)copies[index].setAttribute('checked','');}});
 return '<!doctype html><html lang="en"><head><meta charset="utf-8"></head><body>'+copy.outerHTML+'</body></html>';
 });fs.writeFileSync(output,html);console.log('Captured rendered component in '+output);}finally{await browser.close();}})().catch(error=>{console.error(error.message);process.exitCode=1;});
