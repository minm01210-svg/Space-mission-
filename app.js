const G0 = 9.80665;
const presets = {
  marsScout: {dry:420, prop:1260, isp:330, thrust:5200, area:4, cd:1.2, name:'Mars Scout'},
  next: {dry:650, prop:950, isp:4190, thrust:.236, area:3.2, cd:1.4, name:'NEXT'},
  nstar: {dry:520, prop:500, isp:3300, thrust:.092, area:2.8, cd:1.4, name:'NSTAR'},
  bpt: {dry:580, prop:700, isp:2150, thrust:.254, area:3, cd:1.3, name:'BPT-4000'}
};
const destinations = {
  leo: {name:'Earth orbit', label:'Earth orbit · 400 km', required:0, time:0, unit:'minutes', color:'#83c9ff', note:'Earth orbit · 400 km circular reference', kind:'leo'},
  moon: {name:'Moon', label:'Moon orbit · 100 km', required:3905, time:4.5, unit:'days', color:'#d6deeb', note:'Moon transfer · 4.5 day nominal case', kind:'moon'},
  mars: {name:'Mars', label:'Mars orbit · 400 km × 1 sol', required:5651, time:259, unit:'days', color:'#ffb86b', note:'Mars transfer · 259 day nominal Hohmann case', kind:'mars'},
  marsLanding: {name:'Mars surface', label:'Mars surface · entry estimate', required:6100, time:259, unit:'days', color:'#ff8d76', note:'Mars transfer + entry margin · landing model not included', kind:'marsLanding'}
};
const $ = id => document.getElementById(id);
let paused = false, progress = 0, last = performance.now();
function num(id){return Number($(id).value)||0}
function fmt(n){return Math.round(n).toLocaleString('en-US')}
function getCraft(){return {dry:num('dryMass'),prop:num('propMass'),isp:num('isp'),thrust:num('thrust'),area:num('area'),cd:num('cd'),name:presets[$('craftPreset').value]?.name||'Custom spacecraft'}}
function getDest(){return destinations[$('destination').value]}
function compute(){
  const c=getCraft(), d=getDest(), initial=c.dry+c.prop;
  const dv=initial>c.dry&&c.isp>0 ? G0*c.isp*Math.log(initial/c.dry):0;
  const reserve=dv-d.required, accel=initial>0?c.thrust/initial:0, twr=accel/G0;
  const checks=[
    {label:'Ideal Δv budget', value:`${reserve>=0?'+':''}${fmt(reserve)} m/s`, pass:reserve>=0},
    {label:'Propellant is available', value:`${fmt(c.prop)} kg loaded`, pass:c.prop>0&&c.dry>0},
    {label:'Initial thrust check', value:`${twr.toFixed(3)} g`, pass:d.kind==='leo'?twr>=0.12:(twr>=0.00001||c.thrust===0)}
  ];
  return {c,d,dv,reserve,accel,twr,checks,initial};
}
function updateText(){
  const r=compute(); const pass=r.reserve>=0 && r.checks.filter(x=>x.pass).length>=2;
  $('availableDv').textContent=fmt(r.dv); $('requiredDv').textContent=fmt(r.d.required); $('reserveDv').textContent=`${r.reserve>=0?'+':''}${fmt(r.reserve)}`; $('reserveLabel').textContent=`m/s · ${r.reserve>=0?'reserve':'shortfall'}`;
  $('transferTime').textContent=r.d.time===0?'—':r.d.time; $('transferUnit').textContent=r.d.time===0?'LEO reference':`${r.d.unit} · nominal`; $('destinationNote').textContent=r.d.note; $('legendDestination').textContent=r.d.name; $('pathCaption').textContent=`Earth departure → ${r.d.name} capture`;
  $('resultTitle').textContent=pass?`${r.c.name} meets the ideal goal`:`${r.c.name} misses the ideal goal`; $('resultSubtitle').textContent=pass?'The current specification clears the reference transfer budget. Review the checks below before trusting the result.':'Add performance margin or reduce mission demand, then run the check again.';
  const pill=$('statusPill'); pill.className=`status-pill ${pass?'':'fail'}`; pill.querySelector('b').textContent=pass?'GO':'NO-GO'; $('checkCount').textContent=`${r.checks.filter(x=>x.pass).length} / ${r.checks.length}`;
  $('checkList').innerHTML=r.checks.map(x=>`<div class="check-row"><span class="check-icon ${x.pass?'':'fail'}">${x.pass?'✓':'×'}</span><span>${x.label}</span><span class="check-value">${x.value}</span></div>`).join('');
  $('modelSummary').textContent=`${r.c.name} starts at ${fmt(r.initial)} kg and produces ${fmt(r.dv)} m/s of ideal Δv. The ${r.d.name.toLowerCase()} reference requires ${fmt(r.d.required)} m/s. This is a sizing result, not a full atmospheric or landing certification.`;
  drawScene(r);
}
function drawScene(r){
  const g=$('orbitRings'), b=$('bodies'); const targetX=r.d.kind==='leo'?590:r.d.kind==='moon'?690:754; const targetY=r.d.kind==='leo'?200:r.d.kind==='moon'?128:200; const originX=146, originY=200;
  g.innerHTML=`<ellipse class="orbit-ring origin-ring" cx="450" cy="200" rx="180" ry="76"/><ellipse class="orbit-ring destination-ring" cx="450" cy="200" rx="${targetX===590?235:targetX===690?280:330}" ry="${targetX===590?100:targetX===690?120:138}"/>`;
  b.innerHTML=`<circle cx="${originX}" cy="${originY}" r="10" fill="#83c9ff"/><text x="${originX-28}" y="${originY+31}" class="body-label">Earth</text><text x="${originX-28}" y="${originY+46}" class="body-sub">departure</text><circle cx="${targetX}" cy="${targetY}" r="${r.d.kind==='marsLanding'?13:10}" fill="${r.d.color}"/><text x="${targetX-25}" y="${targetY-21}" class="body-label">${r.d.name}</text><text x="${targetX-25}" y="${targetY-6}" class="body-sub">target</text>`;
  const arcY=r.d.kind==='leo'?80:r.d.kind==='moon'?28:38; $('transferArc').setAttribute('d',`M ${originX} ${originY} Q 450 ${arcY} ${targetX} ${targetY}`); $('craftMarker').setAttribute('transform',`translate(${originX} ${originY})`);
}
function animate(now){const dt=Math.min(50,now-last);last=now;if(!paused){progress=(progress+dt/7000)%1;const r=compute();const targetX=r.d.kind==='leo'?590:r.d.kind==='moon'?690:754;const targetY=r.d.kind==='leo'?200:r.d.kind==='moon'?128:200;const x=146+(targetX-146)*progress;const y=200+(targetY-200)*progress-145*Math.sin(Math.PI*progress);$('craftMarker').setAttribute('transform',`translate(${x} ${y})`)}requestAnimationFrame(animate)}
function setPreset(){const p=presets[$('craftPreset').value];if(!p)return;[['dryMass','dry'],['propMass','prop'],['isp','isp'],['thrust','thrust'],['area','area'],['cd','cd']].forEach(([id,k])=>$(id).value=p[k]);updateText()}
['dryMass','propMass','isp','thrust','area','cd','destination'].forEach(id=>$(id).addEventListener('input',updateText)); $('craftPreset').addEventListener('change',setPreset); $('runBtn').addEventListener('click',()=>{progress=0;updateText()}); $('pauseBtn').addEventListener('click',()=>{paused=!paused;$('pauseBtn').textContent=paused?'▶':'Ⅱ'}); $('resetBtn').addEventListener('click',()=>{progress=0;paused=false;$('pauseBtn').textContent='Ⅱ'}); updateText(); requestAnimationFrame(animate);
