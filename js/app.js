/* Arranque: estado de UI, eventos y service worker. */
let tab='home',cur=ym(new Date().toISOString());
// ---------- Eventos ----------
document.addEventListener('click',e=>{
  const t=e.target.closest('button,#fab');if(!t)return;
  if(t.dataset.tab){tab=t.dataset.tab;render();scrollTo(0,0)}
  else if(t.dataset.pl){pl=t.dataset.pl;render()}
  else if(t.id==='newgoal'){const n=prompt('¿Para qué estás ahorrando?'),a=n&&parseFloat(prompt('Monto objetivo'));if(a>0){S.goals.push({id:uid(),n:n.trim(),target:a,saved:0});save();render()}}
  else if(t.dataset.aport){const g=S.goals.find(x=>x.id===t.dataset.aport),a=parseFloat(prompt('¿Cuánto aportas a "'+g.n+'"?'));if(a>0){g.saved+=a;save();render()}}
  else if(t.dataset.delg){if(confirm('¿Eliminar esta meta?')){S.goals=S.goals.filter(x=>x.id!==t.dataset.delg);save();render()}}
  else if(t.id==='sugb'){const cs=[-3,-2,-1].map(n=>mstats(addM(ym(today),n)));Object.keys(CATS).forEach(c=>{const a=cs.reduce((u,x)=>u+((x.cat.find(k=>k[0]===c)||[0,0])[1]),0)/3;if(a>0)S.cb[c]=Math.round(a*1.05/10000)*10000});save();render()}
  else if(t.id==='impml')$('#mlfile').click();
  else if(t.dataset.u){hv.u=t.dataset.u;render()}
  else if(t.dataset.ty){hv.t=t.dataset.ty;render()}
  else if(t.dataset.m){cur=addM(cur,+t.dataset.m);render()}
  else if(t.id==='fab')openSheet();
  else if(t.dataset.k)openSheet(t.dataset.k);
  else if(t.id==='ok')commit();
  else if(t.id==='no')$('#dlg').close();
  else if(t.dataset.del){S.tx=S.tx.filter(x=>x.id!==t.dataset.del);save();render()}
  else if(t.dataset.delf){S.fixed=S.fixed.filter(x=>x.id!==t.dataset.delf);save();render()}
  else if(t.id==='savecfg'){S.budget=+$('#bud').value||S.budget;S.cur=$('#cur').value;save();tab='home';render()}
  else if(t.id==='silver')dl('plata_movimientos.csv',csv(allTx().map(x=>[x.id,x.d,x.m,x.w,x.dow,x.t==='g'?'gasto':'ingreso',x.c,x.a,x.n,x.src]),'id,fecha,mes,semana,dia_semana,tipo,categoria,monto,nota,origen'),'text/csv');
  else if(t.id==='gm'||t.id==='gw'){const u=t.id==='gm'?'m':'w';dl('oro_'+(u==='m'?'mensual':'semanal')+'.csv',csv(gold(u).reverse().map(o=>[o.p,o.i,o.g,o.net,o.n,o.i?(o.net/o.i).toFixed(3):'']),'periodo,ingresos,gastos,neto,movimientos,tasa_ahorro'),'text/csv')}
  else if(t.id==='json')dl('medallon-respaldo.json',JSON.stringify(S),'application/json');
  else if(t.id==='imp')$('#file').click();
  else if(t.id==='demo'){if(!S.tx.length||confirm('Esto reemplaza tus datos actuales. ¿Continuar?'))demo()}
  else if(t.id==='reset'){if(confirm('¿Borrar todos tus datos? No se puede deshacer.')){S={tx:[],fixed:[],budget:3000000,cur:'COP',cb:{},goals:[]};save();tab='home';render()}}
});
$('#file').onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(t=>{try{const o=JSON.parse(t);if(!o.tx||!o.fixed)throw 0;S=o;S.cb=S.cb||{};S.goals=S.goals||[];save();tab='home';render()}catch{alert('El archivo no es un respaldo válido de Medallón.')}})};
document.addEventListener('change',e=>{const i=e.target;if(i.dataset.cb){const v=parseFloat(i.value);if(v>0)S.cb[i.dataset.cb]=v;else delete S.cb[i.dataset.cb];save()}});
$('#mlfile').onchange=e=>{const f=e.target.files[0];e.target.value='';if(!f)return;f.text().then(t=>{const L=t.trim().split(/\r?\n/),H=L.shift().split(',').map(h=>h.trim());
  const rows=L.map(l=>{const c=l.split(',');return Object.fromEntries(H.map((h,i)=>[h,c[i]]))}).filter(r=>r.serie&&+r.pronostico>=0);
  if(!rows.length){alert('El archivo no parece un pronostico.csv de Medallón.');return}
  S.ml={ts:Date.now(),rows:rows.map(r=>({serie:r.serie,pronostico:+r.pronostico,mae:+r.mae,mae_base:+r.mae_base}))};save();render()})};
render();
if(typeof navigator!=='undefined'&&'serviceWorker' in navigator&&/^https?:$/.test(location.protocol))navigator.serviceWorker.register('sw.js').catch(()=>{});
