const M=require('../onboarding-model.js');
const defaultAnswers={project:'Claims portal',productType:'Enterprise SaaS',platforms:['desktop-web','mobile-web'],name:'Alex Morgan',email:'alex@example.com',designation:'Product designer',role:'Designer',brandColor:'#1357AB',spacingSystem:'8px',cornerStyle:'soft',iconStyle:'duotone'};
async function answer(page,key,value,answers={}){
 const q=M.questions.find(q=>q.key===key);
 if(q.type==='multiple'){for(const option of q.options)await page.locator(`[name="${key}"][value="${option.value}"]`).setChecked(value.includes(option.value));}
 else if(q.type==='choice'){await page.locator(`[name="${key}"][value="${value}"]`).check();if(value==='Other')await page.locator('#'+(key==='role'?'roleOther':'productOther')).fill(answers[key==='role'?'roleOther':'productOther']||'Custom product');}
 else await page.locator('#'+key).fill(value);
 if(q.type==='multiple')await page.locator('#continueSelection').click();
 else if(q.type!=='choice'||value==='Other')await page.locator('#sendAnswer').click();
 await page.waitForFunction(key=>!!document.getElementById('conversationError').textContent||(!document.getElementById('conversationReview').hidden||document.getElementById('chatAnswerForm').dataset.question!==key)&&document.getElementById('assistantTyping').hidden,key);
}
async function complete(page,answers=defaultAnswers){for(const q of M.questions){if(await page.locator('#conversationReview').isVisible())break;await answer(page,q.key,answers[q.key],answers);}await page.locator('#conversationReview:visible').waitFor();}
module.exports={defaultAnswers,answer,complete};
