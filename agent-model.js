(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.ADSAgentModel=api;})(typeof globalThis==='undefined'?this:globalThis,function(){
  'use strict';
  const transitions={draft:['validating','cancelled'],validating:['awaiting-approval','failed','cancelled'], 'awaiting-approval':['queued','cancelled','expired'],queued:['running','failed','cancelled','expired'],running:['partial','succeeded','failed','cancelled'],partial:['running','succeeded','failed','cancelled'],failed:['queued','validating','cancelled'],cancelled:['queued','validating'],expired:['validating'],succeeded:['draft','undo-failed'],'undo-failed':['draft']};
  function create(requestId,scope){if(typeof requestId!=='string'||!requestId||typeof scope!=='string'||!scope)throw new TypeError('A request ID and exact scope are required');return {schemaVersion:1,requestId,scope,idempotencyKey:requestId,state:'draft',output:'',decision:null};}
  function transition(current,next,options={}){
    if(current.schemaVersion!==1||!transitions[current.state]?.includes(next))throw new RangeError('Unsupported agent transition');
    if(options.scope!=null&&options.scope!==current.scope)throw new RangeError('Changed scope requires a new request and approval');
    if(next==='queued'&&current.state==='awaiting-approval'&&options.decision!=='approved')throw new RangeError('An explicit approval decision is required');
    if(next==='queued'&&['failed','cancelled'].includes(current.state)&&current.decision!=='approved')throw new RangeError('Retry requires an approved scope');
    return {...current,state:next,decision:next==='validating'?null:options.decision??current.decision};
  }
  function append(current,text){if(!['running','partial'].includes(current.state)||typeof text!=='string')throw new RangeError('Output is accepted only while running');return {...current,state:'partial',output:current.output+text};}
  return {transitions,create,transition,append};
});
