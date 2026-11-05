/* EcoPulse — vanilla JavaScript, no frameworks or accounts required. */
"use strict";
const KEY="ecopulse-techfest-v1";
const resources={energy:{name:"Electricity",unit:"kWh",icon:"⚡"},water:{name:"Water",unit:"L",icon:"💧"},food:{name:"Food waste",unit:"kg",icon:"🥗"}};
const quests=[
{title:"Switch-off champion",description:"Switch off unused lights and devices for one day.",points:20,icon:"💡"},
{title:"Water-wise day",description:"Take a shorter shower or turn off the tap while brushing.",points:20,icon:"💧"},
{title:"Leftover legend",description:"Safely use edible leftovers instead of discarding them.",points:25,icon:"🥗"},
{title:"Reusable hero",description:"Carry a reusable bottle or lunch container.",points:15,icon:"♻️"},
{title:"Measure your impact",description:"Record at least one actual or estimated resource usage entry.",points:15,icon:"📊"},
{title:"Share the idea",description:"Teach a friend or family member one waste-reduction tip.",points:15,icon:"🌱"}
];
const scenarios=[
{title:"A thirsty neighborhood",description:"Water demand is rising. The city council must choose how to respond.",choices:[{label:"Fix leaking pipes and add efficient fixtures",delta:[18,0,7,-12],why:"Repairs cost money now but improve water efficiency."},{label:"Ignore leaks to protect the budget",delta:[-20,0,-10,8],why:"Avoiding maintenance saves cash short term but wastes water."},{label:"Restrict water without repairing infrastructure",delta:[7,0,-16,2],why:"Restrictions can reduce use, but may harm wellbeing if poorly designed."}]},
{title:"Powering the school",description:"Your city needs reliable electricity for a growing school.",choices:[{label:"Install rooftop solar and improve insulation",delta:[0,19,7,-15],why:"Efficiency and clean generation help, with an upfront cost."},{label:"Keep inefficient equipment",delta:[0,-17,-5,9],why:"Lower initial spending can lead to avoidable energy demand."},{label:"Turn off all classroom ventilation",delta:[0,8,-23,3],why:"Saving power should not come at the expense of healthy classrooms."}]},
{title:"The cafeteria challenge",description:"The school cafeteria is throwing away food each afternoon.",choices:[{label:"Offer flexible portions and monitor leftovers",delta:[6,5,15,-6],why:"Portion choice can reduce food waste while respecting appetite."},{label:"Buy more food than needed",delta:[-5,-5,-12,-11],why:"Overbuying increases waste and costs."},{label:"Remove lunch options completely",delta:[0,3,-24,6],why:"Reducing waste must not compromise access to meals."}]},
{title:"How should people travel?",description:"Traffic is increasing near the city center.",choices:[{label:"Improve safe walking routes and public transport",delta:[0,16,15,-14],why:"Better transport options can cut energy demand and improve access."},{label:"Build only more parking",delta:[0,-12,-4,-10],why:"Parking alone does little to encourage efficient transport."},{label:"Ban travel to the city center",delta:[0,6,-22,3],why:"Abrupt restrictions can harm access and wellbeing."}]},
{title:"A greener tomorrow",description:"The city has funds left for one final sustainability project.",choices:[{label:"Launch a repair, reuse and education hub",delta:[7,8,13,-10],why:"Repair and reuse support a circular economy."},{label:"Spend it all on decorative advertising",delta:[0,0,2,-20],why:"Awareness helps most when paired with real action."},{label:"Do nothing and save the funds",delta:[-5,-5,-5,12],why:"Saving funds may be useful, but problems remain unaddressed."}]}
];
const $=s=>document.querySelector(s);
const $$=s=>Array.from(document.querySelectorAll(s));
const defaultState=()=>({logs:[],targets:{energy:50,water:1000,food:2},done:[]});
function load(){try{const s=JSON.parse(localStorage.getItem(KEY));if(!s||!Array.isArray(s.logs)||!Array.isArray(s.done))return defaultState();return {...defaultState(),...s,targets:{...defaultState().targets,...s.targets}}}catch{return defaultState()}}
let state=load(),round=0,city={water:60,energy:60,wellbeing:60,budget:60},waiting=false;
function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{alert("Storage unavailable. Entries may not persist in this browser.")}}
const fmt=n=>Number(n.toFixed(2)).toLocaleString(undefined,{maximumFractionDigits:2});
function esc(t){return String(t).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function dateLabel(iso){return new Date(iso).toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"})}
function navigate(id){$$(".view").forEach(e=>e.classList.toggle("active",e.id===id));$$(".nav").forEach(e=>e.classList.toggle("active",e.dataset.view===id));$("#page-title").textContent=({dashboard:"Your impact, visualized.",tracker:"Know your numbers.",city:"Build a better city.",quests:"Good habits, great impact.",rewards:"Earn green rewards.",about:"The mission behind EcoPulse."})[id];window.scrollTo({top:0,behavior:"smooth"})}
$$(".nav").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.view)));
$$("[data-go]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.go)));
function totals(){return Object.fromEntries(Object.keys(resources).map(k=>[k,state.logs.filter(l=>l.resource===k).reduce((s,l)=>s+l.amount,0)]))}
function renderDashboard(){const t=totals();for(const k of Object.keys(resources))$("#"+k+"-total").innerHTML=fmt(t[k])+" <small>"+resources[k].unit+"</small>";const pts=state.done.reduce((s,i)=>s+(quests[i]?.points||0),0);$("#points-total").textContent=pts;
$("#bar-chart").innerHTML=Object.keys(resources).map(k=>{const arr=state.logs.filter(l=>l.resource===k).slice(-7);const max=Math.max(1,...arr.map(l=>l.amount));return `<div><div class="bar-label"><span>${resources[k].icon} ${resources[k].name} · last ${arr.length} entries</span><span>${fmt(arr.reduce((s,l)=>s+l.amount,0))} ${resources[k].unit}</span></div><div class="bar-track"><div class="bar-fill" style="width:${arr.length?Math.max(3,100*arr.reduce((s,l)=>s+l.amount,0)/(max*7)):0}%"></div></div></div>`}).join("");
$("#recent-list").innerHTML=state.logs.length?state.logs.slice(-5).reverse().map(l=>`<div class="activity-item"><div>${resources[l.resource].icon} ${resources[l.resource].name}<small>${dateLabel(l.date)} · ${esc(l.note||"No note")}</small></div><b>${fmt(l.amount)} ${resources[l.resource].unit}</b></div>`).join(""):'<p class="muted">No entries yet. Add your first resource log!</p>'}
function renderHistory(){$("#history").innerHTML=state.logs.length?state.logs.slice().reverse().map(l=>`<tr><td>${dateLabel(l.date)}</td><td>${resources[l.resource].icon} ${resources[l.resource].name}</td><td>${fmt(l.amount)} ${resources[l.resource].unit}</td><td>${esc(l.note||"—")}</td><td><button aria-label="Delete entry" data-delete="${l.id}">✕</button></td></tr>`).join(""):'<tr><td colspan="5">No entries yet.</td></tr>';
$$("[data-delete]").forEach(b=>b.addEventListener("click",()=>{state.logs=state.logs.filter(l=>String(l.id)!==b.dataset.delete);save();renderAll()}))}
function renderTargets(){const now=Date.now(),week=7*24*60*60*1000;$("#target-progress").innerHTML=Object.keys(resources).map(k=>{const used=state.logs.filter(l=>l.resource===k&&now-new Date(l.date).getTime()<week).reduce((s,l)=>s+l.amount,0),target=state.targets[k],pct=Math.min(100,100*used/target);return `<div class="target-row"><div class="bar-label"><span>${resources[k].icon} ${resources[k].name}</span><span>${fmt(used)} / ${fmt(target)} ${resources[k].unit}</span></div><div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div></div>`}).join("")}
function renderQuests(){const pts=state.done.reduce((s,i)=>s+(quests[i]?.points||0),0);$("#quest-points").textContent=pts;$("#quest-count").textContent=`${state.done.length} of ${quests.length} challenges completed`;$("#quest-list").innerHTML=quests.map((q,i)=>`<article class="quest-card ${state.done.includes(i)?"done":""}"><div style="font-size:30px">${q.icon}</div><h3>${esc(q.title)}</h3><p>${esc(q.description)}</p><p class="reward">+${q.points} ECOPOINTS</p><button data-quest="${i}" aria-pressed="${state.done.includes(i)}">${state.done.includes(i)?"✓ Completed · undo":"Mark as completed"}</button></article>`).join("");$$("[data-quest]").forEach(b=>b.addEventListener("click",()=>{const i=Number(b.dataset.quest);state.done=state.done.includes(i)?state.done.filter(x=>x!==i):[...state.done,i];save();renderAll()}))}
function renderAll(){renderDashboard();renderHistory();renderTargets();renderQuests();renderChart();renderComparison()}
$("#log-form").addEventListener("submit",e=>{e.preventDefault();const resource=$("#resource").value,amount=Number($("#amount").value),note=$("#note").value.trim();if(!resources[resource]||!Number.isFinite(amount)||amount<=0||amount>100000)return;state.logs.push({id:Date.now()+"-"+Math.random().toString(36).slice(2,7),date:new Date().toISOString(),resource,amount,note});save();e.target.reset();$("#log-message").textContent="✓ Entry saved locally.";renderAll()});
$("#target-form").addEventListener("submit",e=>{e.preventDefault();const k=$("#target-resource").value,n=Number($("#target-amount").value);if(!resources[k]||!Number.isFinite(n)||n<=0||n>100000)return;state.targets[k]=n;save();$("#target-message").textContent="✓ Weekly target updated.";renderTargets()});
$("#export").addEventListener("click",()=>{const rows=[["date","resource","amount","unit","note"],...state.logs.map(l=>[l.date,l.resource,l.amount,resources[l.resource].unit,l.note])];const csv=rows.map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(",")).join("\r\n");const url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="ecopulse-usage.csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
$("#reset-data").addEventListener("click",()=>{if(!confirm("Delete all saved resource entries, targets, and completed quests?"))return;state=defaultState();save();renderAll();$("#reset-message").textContent="Your saved data has been cleared."});
const clamp=n=>Math.max(0,Math.min(100,n));
function renderCity(){for(const k of Object.keys(city))$("#city-"+k).textContent=city[k];$("#city-health").textContent=Math.round((city.water+city.energy+city.wellbeing+city.budget)/4);
if(round>=scenarios.length){$("#round-label").textContent="SIMULATION COMPLETE";$("#scenario-title").textContent="Your city, your choices.";$("#scenario-description").textContent="Final city health: "+$("#city-health").textContent+"/100. Try again to explore different trade-offs.";$("#choices").innerHTML="";$("#restart-city").hidden=false;return}
const s=scenarios[round];$("#round-label").textContent=`DECISION ${round+1} OF ${scenarios.length}`;$("#scenario-title").textContent=s.title;$("#scenario-description").textContent=s.description;$("#choices").innerHTML=s.choices.map((c,i)=>`<button class="choice" data-choice="${i}">${esc(c.label)} →</button>`).join("");$("#restart-city").hidden=true;$$("[data-choice]").forEach(b=>b.addEventListener("click",()=>choose(Number(b.dataset.choice))))}
function choose(i){if(waiting)return;const c=scenarios[round]?.choices[i];if(!c)return;["water","energy","wellbeing","budget"].forEach((k,j)=>city[k]=clamp(city[k]+c.delta[j]));round++;waiting=true;$("#decision-feedback").textContent=c.why;renderCity();$$("[data-choice]").forEach(b=>b.disabled=true);if(round<scenarios.length){$("#choices").innerHTML='<button class="primary full" id="next-decision">Next decision →</button>';$("#next-decision").addEventListener("click",()=>{waiting=false;$("#decision-feedback").textContent="";renderCity()})}else{waiting=false;$("#decision-feedback").textContent=c.why}}
$("#restart-city").addEventListener("click",()=>{round=0;city={water:60,energy:60,wellbeing:60,budget:60};waiting=false;$("#decision-feedback").textContent="";renderCity()});
renderAll();renderCity();

// Seven-day SVG chart. All data comes from the resource entries above.
function dailyTotals(resource, daysBack, count) {
  const days = [];
  for (let i = daysBack + count - 1; i >= daysBack; i--) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    const total = state.logs.filter(log =>
      log.resource === resource && new Date(log.date).toDateString() === date.toDateString()
    ).reduce((sum, log) => sum + log.amount, 0);
    days.push({ label: date.toLocaleDateString(undefined, {weekday:'short'}), total });
  }
  return days;
}
function renderChart() {
  const resource = document.querySelector('#chart-resource').value;
  const data = dailyTotals(resource, 0, 7);
  const max = Math.max(1, ...data.map(day => day.total));
  const width = 600, height = 225, left = 48, right = 15, top = 18, bottom = 37;
  const plotWidth = width - left - right, plotHeight = height - top - bottom;
  const x = i => left + (i * plotWidth / 6);
  const y = n => top + plotHeight * (1 - n / max);
  const points = data.map((d, i) => `${x(i)},${y(d.total)}`).join(' ');
  let svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`;
  for (let i = 0; i <= 4; i++) {
    const yy = top + plotHeight * i / 4;
    svg += `<line class="gridline" x1="${left}" y1="${yy}" x2="${width-right}" y2="${yy}"/>`;
    svg += `<text x="${left-9}" y="${yy+4}" text-anchor="end">${fmt(max * (4-i)/4)}</text>`;
  }
  svg += `<polyline class="trend" points="${points}"/>`;
  data.forEach((d,i) => {
    svg += `<circle class="dot" cx="${x(i)}" cy="${y(d.total)}" r="5"><title>${d.label}: ${fmt(d.total)} ${resources[resource].unit}</title></circle>`;
    svg += `<text x="${x(i)}" y="${height-12}" text-anchor="middle">${d.label}</text>`;
  });
  svg += '</svg>';
  document.querySelector('#line-chart').innerHTML = svg;
  document.querySelector('#line-chart').setAttribute('aria-label', `Last seven days of ${resources[resource].name}: ${data.map(d=>d.label+' '+fmt(d.total)).join(', ')}`);
}
function renderComparison() {
  document.querySelector('#comparison-list').innerHTML = '<div class="compare-grid">' +
    Object.keys(resources).map(resource => {
      const current = dailyTotals(resource, 0, 7).reduce((sum,d)=>sum+d.total,0);
      const previous = dailyTotals(resource, 7, 7).reduce((sum,d)=>sum+d.total,0);
      const difference = previous ? ((current - previous) / previous) * 100 : null;
      const change = difference === null ? 'Add previous-week data' : `${difference > 0 ? '+' : ''}${fmt(difference)}% vs last week`;
      return `<div class="compare-item"><small>${resources[resource].icon} ${resources[resource].name}</small><strong>${fmt(current)} ${resources[resource].unit}</strong><small class="${difference===null?'':difference<=0?'down':'up'}">${change}</small></div>`;
    }).join('') + '</div>';
}
// Sample readings are marked as demo entries, so they can be removed separately.
document.querySelector('#demo-load').addEventListener('click', () => {
  state.logs = state.logs.filter(log => !log.demo);
  const samples = {energy:[9,8,7,6,7,5,4],water:[130,120,115,100,105,95,90],food:[0.5,0.3,0.4,0.2,0.25,0.15,0.1]};
  Object.keys(samples).forEach(resource => samples[resource].forEach((amount, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6-index));
    date.setHours(12,0,0,0);
    state.logs.push({id:'demo-'+resource+'-'+index, date:date.toISOString(), resource, amount, note:'Sample data — demo only', demo:true});
  }));
  save();renderAll();navigate('dashboard');
});
document.querySelector('#demo-clear').addEventListener('click', () => {
  state.logs = state.logs.filter(log => !log.demo);
  save();renderAll();
});
document.querySelector('#chart-resource').addEventListener('change', renderChart);
renderChart();renderComparison();
