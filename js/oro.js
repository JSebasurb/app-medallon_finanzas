/* 🥇 ORO · agregados por mes o semana (ingresos, gastos, neto) listos para analítica y ML. */
// GOLD: agregados por mes (m) o semana (w)
function gold(u,list=allTx()){const mp={};
  list.forEach(x=>{const o=mp[x[u]]||(mp[x[u]]={p:x[u],g:0,i:0,n:0,l:[]});o[x.t]+=x.a;o.n++;o.l.push(x)});
  return Object.values(mp).sort((a,b)=>b.p.localeCompare(a.p)).map(o=>({...o,net:o.i-o.g}))}
