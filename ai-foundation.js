(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", function(){
    var demo = document.querySelector('[data-role="agent-demo"]');
    if (!demo) return;

    var actions = demo.querySelector('[data-role="agent-actions"]');
    var result = demo.querySelector('[data-role="agent-result"]');
    var resultText = demo.querySelector('[data-role="agent-result-text"]');
    var undoLink = demo.querySelector('[data-role="agent-undo"]');
    var approveBtn = demo.querySelector('[data-role="agent-approve"]');
    var rejectBtn = demo.querySelector('[data-role="agent-reject"]');
    var lastAction = approveBtn;

    function showResult(kind, text){
      actions.hidden = true;
      result.hidden = false;
      result.classList.remove("ai-agent-status--success", "ai-agent-status--failure");
      if(kind === "approved") result.classList.add("ai-agent-status--success");
      resultText.textContent = text;
      undoLink.focus();
    }

    approveBtn.addEventListener("click", function(){
      lastAction = approveBtn;
      showResult("approved", "Example approved. No library changes were saved.");
    });
    rejectBtn.addEventListener("click", function(){
      lastAction = rejectBtn;
      showResult("rejected", "Example rejected. No library changes were saved.");
    });
    undoLink.addEventListener("click", function(e){
      e.preventDefault();
      result.hidden = true;
      actions.hidden = false;
      lastAction.focus();
    });

    const model=window.ADSAgentModel;
    const panel=document.createElement('section');panel.className='panel';
    panel.innerHTML='<h2 class="panel-title">Controlled streaming example</h2><p>This simulated response makes no network requests or library changes. Stop preserves partial output. Retry continues with the same request and approval scope. Start begins a new local example. Confidence: unknown.</p><div class="panel-footer-row"><button type="button" class="btn btn-primary" data-stream="start">Start example</button><button type="button" class="btn btn-ghost" data-stream="stop" disabled>Stop</button><button type="button" class="btn btn-ghost" data-stream="retry" disabled>Continue / Retry</button><button type="button" class="btn btn-ghost" data-stream="fail" disabled>Simulate interruption</button></div><p data-stream="status" role="status" aria-live="polite">Ready — no execution.</p><div class="ads-stream-output" tabindex="0" aria-label="Simulated response" data-stream="output"></div><button type="button" class="btn btn-ghost" data-stream="latest" hidden>Jump to latest</button><pre class="guide-machine-json"><code data-stream="record"></code></pre>';
    document.querySelector('#implementation-contract').before(panel);
    const get=name=>panel.querySelector('[data-stream="'+name+'"]');
    const chunks=['This is a simulated response.\n\n','The shared Foundation resolver applies valid saved choices.\n\n','Review the configured values and both themes before release.\n\n','The example preserves partial output during cancellation or interruption.\n\n','A real agent must declare its effects, approval scope, evidence, and recovery.\n\n','Rendered browser and assistive-technology acceptance require separate evidence.'];
    let current=null,index=0,timer=null,request=0,following=true;
    const active=()=>current&&['queued','running','partial'].includes(current.state);
    function render(message){
      get('record').textContent=JSON.stringify(current,null,2);
      get('stop').disabled=!active();get('fail').disabled=!active();get('start').disabled=!!active();get('retry').disabled=!current||!['failed','cancelled'].includes(current.state);
      if(message){get('status').setAttribute('role',current?.state==='failed'?'alert':'status');get('status').setAttribute('aria-live',current?.state==='failed'?'assertive':'polite');get('status').textContent=message;}
      get('output').textContent=current?.output||'';
      if(following)get('output').scrollTop=get('output').scrollHeight;
      get('latest').hidden=following;
    }
    function tick(){
      timer=setTimeout(function(){
        if(!active())return;
        if(current.state==='queued'){current=model.transition(current,'running');render('Generating simulated response.');}
        if(index<chunks.length){current=model.append(current,chunks[index++]);render();tick();}
        else{current=model.transition(current,'succeeded');render('Example finished. Output remains available.');}
      },180);
    }
    get('start').addEventListener('click',function(){
      clearTimeout(timer);index=0;following=true;
      current=model.create('local-example-'+(++request),'Generate this local sample only');
      current=model.transition(current,'validating');current=model.transition(current,'awaiting-approval');current=model.transition(current,'queued',{decision:'approved'});
      render('Queued — local example authorized by Start.');tick();
    });
    get('stop').addEventListener('click',function(){clearTimeout(timer);current=model.transition(current,'cancelled');render('Stopped. Partial output retained; Continue resumes this example.');get('retry').focus();});
    get('fail').addEventListener('click',function(){clearTimeout(timer);current=model.transition(current,'failed');render('Simulated interruption. Partial output retained; Retry continues with the same request.');get('retry').focus();});
    get('retry').addEventListener('click',function(){current=model.transition(current,'queued');render('Queued continuation — same request and scope.');get('stop').focus();tick();});
    get('output').addEventListener('scroll',function(){const el=get('output');following=el.scrollHeight-el.clientHeight-el.scrollTop<=8;get('latest').hidden=following;});
    get('latest').addEventListener('click',function(){following=true;get('output').scrollTop=get('output').scrollHeight;get('latest').hidden=true;get('output').focus();});
    window.addEventListener('pagehide',function(){clearTimeout(timer);});
  });
})();
