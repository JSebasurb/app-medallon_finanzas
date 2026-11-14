/* Análisis con ML en el navegador (regresión lineal, proyección, anomalías). Consume ORO/PLATA. */
// ---------- ML (en el navegador) ----------
function linreg(y){const n=y.length,x=y.map((_,i)=>i),mx=(n-1)/2,my=y.reduce((a,b)=>a+b)/n;
  let nu=0,de=0;x.forEach((xi,i)=>{nu+=(xi-mx)*(y[i]-my);de+=(xi-mx)**2});
  const b=de?nu/de:0,a=my-b*mx,res=y.map((v,i)=>v-(a+b*i)),sd=Math.sqrt(res.reduce((s,r)=>s+r*r,0)/Math.max(n-2,1));
  return{b,a,sd,pred:a+b*n}}
function vAI(){
  const all=allTx(),now=ym(today),ins=[];
  const past=[-6,-5,-4,-3,-2,-1].map(n=>addM(now,n)).map(m=>mstats(m,all)).filter(s=>s.g>0);
  const s=mstats(now,all),dim=new Date(+now.slice(0,4),+now.slice(5),0).getDate(),d=new Date().getDate();
  if(past.length>=3){
    const r=linreg(past.map(p=>p.g));
    const lo=Math.max(r.pred-r.sd,0),hi=r.pred+r.sd,tr=r.b/(past.at(-1).g||1)*100;
    ins.push(['🔮','Pronóstico del próximo mes',`Regresión lineal sobre ${past.length} meses: gastarás ≈ <b>${money(Math.max(r.pred,0))}</b> (rango ${money(lo)} – ${money(hi)}). Tendencia: ${r.b>=0?'sube':'baja'} ${money(Math.abs(r.b))} por mes (${Math.abs(tr).toFixed(1)}%).`]);
  }else ins.push(['🔮','Pronóstico del próximo mes','Necesitas al menos 3 meses con gastos para entrenar el modelo. Carga datos de ejemplo en la pestaña Datos para probar.']);
  const fxTot=S.fixed.filter(f=>f.t!=='i').reduce((a,f)=>a+f.a,0),varSoFar=s.g-s.fx,proj=varSoFar/d*dim+fxTot;
  if(s.g>0)ins.push(['📈','Proyección de este mes',`Al ritmo actual cerrarás en ≈ <b>${money(proj)}</b> (${Math.round(proj/S.budget*100)}% del presupuesto). ${proj>S.budget?`Te pasarías por ${money(proj-S.budget)}; reduce ${money((proj-S.budget)/Math.max(dim-d,1))} al día.`:'Vas dentro del presupuesto.'}`]);
  const rate=s.i?(s.i-s.g)/s.i:null;
  if(rate!==null)ins.push(['🏦','Tasa de ahorro',`Este mes ahorras <b>${Math.round(rate*100)}%</b> de tus ingresos. ${rate>=.2?'Excelente, superas la regla del 20%.':rate>=0?'La meta sugerida es 20%.':'Gastas más de lo que ingresas.'}`]);
  // tendencia por categoría
  const ms=[-3,-2,-1,0].map(n=>addM(now,n)),cs=ms.map(m=>mstats(m,all)),tr=[];
  Object.keys(CATS).forEach(c=>{const y=cs.map(x=>(x.cat.find(k=>k[0]===c)||[0,0])[1]);const avg=y.reduce((a,b)=>a+b)/4;if(avg>0)tr.push([c,linreg(y).b/avg*100]);});
  tr.sort((a,b)=>b[1]-a[1]);
  if(tr.length&&tr[0][1]>5)ins.push([CATS[tr[0][0]][0],`${tr[0][0]} va en aumento`,`Su gasto crece ≈ ${tr[0][1].toFixed(0)}% por mes en los últimos 4 meses. Es la categoría que más conviene vigilar.`]);
  // anomalías z-score
  const an=[];
  Object.keys(CATS).forEach(c=>{const l=all.filter(x=>x.t==='g'&&!x.fixed&&x.c===c);if(l.length<5)return;
    const m=l.reduce((a,x)=>a+x.a,0)/l.length,sd=Math.sqrt(l.reduce((a,x)=>a+(x.a-m)**2,0)/l.length);
    l.forEach(x=>{const z=sd?(x.a-m)/sd:0;if(z>2)an.push([x,z,m])})});
  an.sort((a,b)=>b[0].d.localeCompare(a[0].d));
  if(an.length)ins.push(['⚠️','Gastos inusuales',an.slice(0,3).map(([x,z,m])=>`${esc(x.n)||x.c} (${x.d}): ${money(x.a)}, ${(x.a/m).toFixed(1)}× tu promedio en ${x.c}`).join('<br>')]);
  else if(all.length>15)ins.push(['✅','Sin gastos inusuales','Ningún movimiento se sale de tu patrón habitual (z-score &gt; 2).']);
  return head('Análisis','Modelos corriendo en tu navegador')+`<div class="card" style="padding:6px 18px">${ins.map(i=>`<div class="ai"><div class="dot">${i[0]}</div><div><b>${i[1]}</b><p>${i[2]}</p></div></div>`).join('')}</div>
  ${mlCard()}<p class="note" style="padding:0 6px">Regresión lineal, proyección por ritmo diario y detección de anomalías. Exporta tus datos en CSV para entrenar modelos propios en Python.</p>`;
}

