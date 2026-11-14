/* Vistas: Resumen, Historial, Plan (fijos, presupuestos, metas), Datos. */
// ---------- Vistas ----------
function head(title,sub,nav){return`<div class="top"><div><h1>${title}</h1><div class="sub">${sub||''}</div></div>${nav?`<div class="nav"><button class="ib" data-m="-1" aria-label="Mes anterior">‹</button><button class="ib" data-m="1" aria-label="Mes siguiente">›</button></div>`:''}</div>`}

const catRow=(c,v,tot)=>{const b=S.cb[c],p=b?v/b:v/tot,col=b&&v>b?'var(--red)':b&&p>.85?'var(--orange)':CATS[c][1];
  return`<div class="row"><div class="dot" style="background:${CATS[c][1]}22">${CATS[c][0]}</div><div class="grow"><b>${c}</b>${b?`<span>${money(v)} de ${money(b)}</span>`:''}<div class="bar"><i style="width:${Math.min(p,1)*100}%;background:${col}"></i></div></div><div class="amt" ${b&&v>b?'style="color:var(--red)"':''}>${b?Math.round(p*100)+'%':money(v)}</div></div>`};
function vHome(){
  const all=allTx(),s=mstats(cur,all),bud=S.budget||1;
  const pct=s.g/bud,isNow=cur===ym(today);
  const dim=new Date(+cur.slice(0,4),+cur.slice(5),0).getDate();
  const el=isNow?new Date().getDate()/dim:(cur<ym(today)?1:0);
  const C1=2*Math.PI*100,C2=2*Math.PI*78;
  const col=pct>1?'var(--red)':pct>.85?'var(--orange)':'var(--green)';
  const months=[-5,-4,-3,-2,-1,0].map(n=>addM(cur,n)),vals=months.map(m=>mstats(m,all));
  const mx=Math.max(...vals.map(v=>Math.max(v.g,v.i)),1);
  const bars=vals.map((v,i)=>{const h=v.g/mx*110,h2=v.i/mx*110,x=12+i*54;
    return`<rect x="${x}" y="${130-h2}" width="16" height="${h2}" rx="5" fill="var(--green)" opacity=".55"/><rect x="${x+19}" y="${130-h}" width="16" height="${h}" rx="5" fill="var(--blue)"/><text x="${x+18}" y="148" text-anchor="middle" font-size="11" fill="var(--tx2)">${MN[+months[i].slice(5)-1].slice(0,3)}</text>`}).join('');
  return head(mname(cur),'Tu medallón del mes',1)+`
  <div class="card"><div class="ring">
   <svg width="236" height="236" viewBox="0 0 236 236">
    <circle cx="118" cy="118" r="100" stroke="var(--fill)" stroke-width="22"/>
    <circle cx="118" cy="118" r="100" stroke="${col}" stroke-width="22" stroke-dasharray="${Math.min(pct,1)*C1} ${C1}"/>
    <circle cx="118" cy="118" r="78" stroke="var(--fill)" stroke-width="10"/>
    <circle cx="118" cy="118" r="78" stroke="var(--tx2)" stroke-width="10" stroke-dasharray="${el*C2} ${C2}" opacity=".6"/>
   </svg>
   <div class="mid"><span>${s.g>S.budget?'Excedido':'Disponible'}</span><b>${money(Math.abs(S.budget-s.g))}</b><span>${Math.round(pct*100)}% del presupuesto</span></div></div>
   <div class="stats"><div><b class="pos">${money(s.i)}</b><span>Ingresos</span></div><div><b>${money(s.g)}</b><span>Gastos</span></div><div><b>${money(s.fx)}</b><span>Fijos</span></div></div>
   <p class="note" style="text-align:center;margin:12px 0 0">Anillo exterior: gasto vs. presupuesto · interior: avance del mes</p></div>
  <div style="display:flex;gap:10px;margin-bottom:14px"><button class="btn" style="margin:0" data-k="g">− Gasto</button><button class="btn" style="margin:0;background:var(--green)" data-k="i">+ Ingreso</button></div>
  <div class="card"><h2>Últimos 6 meses</h2><svg viewBox="0 0 330 156" width="100%">${bars}</svg>
   <div class="note"><span style="color:var(--green)">●</span> Ingresos &nbsp; <span style="color:var(--blue)">●</span> Gastos</div></div>
  <div class="card"><h2>Por categoría</h2>${s.cat.length?s.cat.map(([c,v])=>catRow(c,v,s.g)).join(''):'<div class="empty">Aún no hay gastos este mes.<br>Toca + para registrar el primero.</div>'}</div>`;
}

function txRow(x){const c=CATS[x.c]||['💰','#30d158'];
  return`<div class="row"><div class="dot" style="background:${c[1]}22">${c[0]}</div><div class="grow"><b>${esc(x.n)||x.c}${x.fixed?'<span class="chip">fijo</span>':''}</b><span>${x.c}</span></div><div class="amt ${x.t==='i'?'pos':''}">${x.t==='i'?'+':'−'}${money(x.a)}</div>${x.fixed?'':`<button class="del" data-del="${x.id}" aria-label="Eliminar">✕</button>`}</div>`}

let hv={u:'w',t:'g'};
const sg=(a,o,c)=>`<div class="seg">${o.map(([v,l])=>`<button data-${a}="${v}" class="${v===c?'on':''}">${l}</button>`).join('')}</div>`;
const plabel=(p,u)=>{if(u==='m')return mname(p);const f=o=>new Date(o+'T12:00').toLocaleDateString('es-CO',{day:'numeric',month:'short'});
  const e=new Date(p+'T12:00');e.setDate(e.getDate()+6);return f(p)+' – '+f(e.toISOString().slice(0,10))};
function vHist(){
  const{u,t}=hv,G=gold(u).filter(o=>o[t]>0),col=t==='g'?'var(--blue)':'var(--green)';
  const B=G.slice(0,12).reverse(),mx=Math.max(...B.map(o=>o[t]),1),w=330/Math.max(B.length,1);
  const bars=B.map((o,i)=>{const h=o[t]/mx*90,x=i*w+w*.15,bw=w*.7,lb=u==='m'?MN[+o.p.slice(5,7)-1].slice(0,3):o.p.slice(8)+'/'+o.p.slice(5,7);
    return`<rect x="${x}" y="${112-h}" width="${bw}" height="${h}" rx="5" fill="${col}"/><text x="${x+bw/2}" y="${106-h}" text-anchor="middle" font-size="9" fill="var(--tx2)">${short(o[t])}</text><text x="${x+bw/2}" y="130" text-anchor="middle" font-size="9" fill="var(--tx2)">${lb}</text>`}).join('');
  const avg=G.length?G.reduce((a,o)=>a+o[t],0)/G.length:0;
  return head('Historial','Gastos e ingresos por periodo')+sg('ty',[['g','Gastos'],['i','Ingresos']],t)+sg('u',[['w','Semanal'],['m','Mensual']],u)+
  `<div class="card"><h2>${t==='g'?'Gastos':'Ingresos'} ${u==='w'?'por semana':'por mes'}</h2>${B.length?`<svg viewBox="0 0 330 138" width="100%">${bars}</svg><div class="note">Promedio ${u==='w'?'semanal':'mensual'}: <b>${money(avg)}</b></div>`:'<div class="empty">Aún no hay registros.<br>Toca + para agregar.</div>'}</div>`+
  G.slice(0,26).map(o=>`<details class="card hd"><summary><div class="grow"><b>${plabel(o.p,u)}</b><span>${o.n} movimientos · neto ${money(o.net)}</span></div><div class="amt ${t==='i'?'pos':''}">${money(o[t])}</div></summary>${o.l.filter(x=>x.t===t).map(txRow).join('')}</details>`).join('');
}

function vFix(){
  const tot=S.fixed.filter(f=>f.t!=='i').reduce((s,f)=>s+f.a,0);
  return `<div class="card"><div class="stats" style="grid-template-columns:1fr 1fr"><div><b>${money(tot)}</b><span>Gastos fijos al mes</span></div><div><b>${S.budget?Math.round(tot/S.budget*100):0}%</b><span>Del presupuesto</span></div></div></div>
  <div class="card" style="padding:4px 18px">${S.fixed.length?S.fixed.sort((a,b)=>a.day-b.day).map(f=>{const c=ci(f.c);return`<div class="row"><div class="dot" style="background:${c[1]}22">${c[0]}</div><div class="grow"><b>${esc(f.n)}</b><span>Día ${f.day} · ${f.c}</span></div><div class="amt ${f.t==='i'?'pos':''}">${f.t==='i'?'+':''}${money(f.a)}</div><button class="del" data-delf="${f.id}" aria-label="Eliminar">✕</button></div>`}).join(''):'<div class="empty">Agrega arriendo, suscripciones o tu salario…<br>Toca + y elige “Fijo”.</div>'}</div>`;
}

function vData(){
  return head('Datos','Todo se guarda en este dispositivo')+`<div class="card"><label style="margin-top:0">Presupuesto mensual</label><input id="bud" type="number" inputmode="numeric" value="${S.budget}">
  <label>Moneda</label><select id="cur">${['COP','USD','EUR','MXN','ARS','PEN','CLP'].map(c=>`<option ${c===S.cur?'selected':''}>${c}</option>`).join('')}</select>
  <button class="btn" id="savecfg">Guardar ajustes</button></div>
  <div class="card"><h2>Arquitectura Medallón</h2>
  <div class="ai"><div class="dot">🥉</div><div><b>Bronce · ${S.tx.length+S.fixed.length} registros</b><p>Datos crudos tal como los capturaste, sin transformar.</p></div></div>
  <div class="ai"><div class="dot">🥈</div><div><b>Plata · ${allTx().length} filas</b><p>Validadas, sin duplicados, con fijos expandidos y columnas de semana, mes y día.</p></div></div>
  <div class="ai"><div class="dot">🥇</div><div><b>Oro · ${gold('m').length} meses, ${gold('w').length} semanas</b><p>Ingresos, gastos, neto y ahorro por periodo, listos para ML.</p></div></div>
  <button class="btn g" id="json">Bronce · respaldo JSON</button><button class="btn g" id="silver">Plata · CSV</button><button class="btn g" id="gm">Oro mensual · CSV</button><button class="btn g" id="gw">Oro semanal · CSV</button><button class="btn g" id="imp">Importar respaldo</button></div>
  <div class="card"><button class="btn g" id="demo">Cargar datos de ejemplo</button><button class="btn g r" id="reset">Borrar todo</button></div><p class="note" style="text-align:center">Medallón v1.0 · tus datos viven solo en este dispositivo</p>`;
}

function vBud(){const now=ym(today),cs=[-3,-2,-1].map(n=>mstats(addM(now,n)));
  return`<div class="card"><p class="note" style="margin:0">Pon un límite mensual a cada categoría. El Resumen te avisa cuando te acercas.</p><button class="btn g" id="sugb">Sugerir según mis últimos 3 meses</button></div><div class="card" style="padding:4px 18px">${Object.keys(CATS).map(c=>{const a=cs.reduce((t,x)=>t+((x.cat.find(k=>k[0]===c)||[0,0])[1]),0)/3;
  return`<div class="row"><div class="dot" style="background:${CATS[c][1]}22">${CATS[c][0]}</div><div class="grow"><b>${c}</b>${a?`<span>Promedio: ${money(a)}</span>`:''}</div><input style="width:130px;text-align:right;font-size:16px;padding:9px 12px;background:var(--fill)" type="number" inputmode="numeric" placeholder="Sin límite" data-cb="${c}" value="${S.cb[c]||''}"></div>`}).join('')}</div>`}
function vGoals(){
  const ms=gold('m').filter(o=>o.p<ym(today)).slice(0,3),avg=ms.length?ms.reduce((t,o)=>t+o.net,0)/ms.length:0,tot=S.goals.reduce((t,g)=>t+g.saved,0);
  return`<div class="card"><div class="stats" style="grid-template-columns:1fr 1fr"><div><b class="${avg>0?'pos':''}">${money(avg)}</b><span>Ahorro mensual promedio</span></div><div><b>${money(tot)}</b><span>Ahorrado en metas</span></div></div></div>`+
  (S.goals.length?S.goals.map(g=>{const p=Math.min(g.saved/g.target,1),rest=g.target-g.saved;let eta='¡Meta lograda!';
    if(rest>0){if(avg>0){const n=Math.ceil(rest/avg),[y,m]=addM(ym(today),n).split('-');eta=`A ${money(avg)} al mes la alcanzas en ${n} ${n===1?'mes':'meses'} (${MN[m-1]} ${y}).`}else eta='Tu ahorro mensual actual no alcanza para proyectar una fecha.'}
    return`<div class="card"><div class="row"><div class="grow"><b>${esc(g.n)}</b><span>${money(g.saved)} de ${money(g.target)} · ${Math.round(p*100)}%</span></div><button class="del" data-delg="${g.id}" aria-label="Eliminar">✕</button></div><div class="bar" style="height:10px;margin:2px 0 10px"><i style="width:${p*100}%;background:var(--green)"></i></div><p class="note" style="margin:0 0 8px">${eta}</p><button class="btn g" style="margin:0" data-aport="${g.id}">Aportar</button></div>`}).join(''):'<div class="card empty">Crea tu primera meta: un viaje, un fondo de emergencia…</div>')+'<button class="btn" id="newgoal">Nueva meta</button>'}
let pl='f';
function vFixed(){return head('Plan','Fijos, presupuestos y metas')+sg('pl',[['f','Fijos'],['b','Presupuestos'],['m','Metas']],pl)+(pl==='f'?vFix():pl==='b'?vBud():vGoals())}
function mlCard(){const m=S.ml;return`<div class="card"><h2>Pronóstico del notebook</h2>${m?m.rows.map(r=>`<div class="ai"><div class="dot">🤖</div><div><b>${esc(r.serie)}: ${money(r.pronostico)}</b><p>Error medio ${money(r.mae)} · línea base ${money(r.mae_base)} · ${r.mae<r.mae_base?'supera la línea base':'no supera la línea base, confía poco'}</p></div></div>`).join('')+`<p class="note">Importado el ${new Date(m.ts).toLocaleDateString('es-CO')}</p>`:'<p class="note">Ejecuta analisis_medallon.ipynb e importa aquí data/oro/pronostico.csv.</p>'}<button class="btn g" id="impml">Importar pronostico.csv</button></div>`}
const TABS=[['home','◔','Resumen',vHome],['hist','◷','Historial',vHist],['fixed','◎','Plan',vFixed],['ai','✦','Análisis',vAI],['data','⚙︎','Datos',vData]];
function render(){
  $('#app').innerHTML=TABS.find(t=>t[0]===tab)[3]();
  $('#tabs').innerHTML=TABS.map(t=>`<button class="${t[0]===tab?'on':''}" data-tab="${t[0]}"><span>${t[1]}</span>${t[2]}</button>`).join('');
  $('#fab').style.display=tab==='data'||tab==='ai'||(tab==='fixed'&&pl!=='f')?'none':'block';
}

