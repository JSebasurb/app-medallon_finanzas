/* 🥈 PLATA · datos limpios: valida, deduplica, expande fijos y deriva mes/semana/día. */
// Movimientos + fijos expandidos (dataset listo para ML)
function allTx(){
  // SILVER: valida, deduplica, expande fijos y deriva mes/semana/día
  const out=[],seen=new Set();
  const push=x=>{if(!(x.a>0)||!/^\d{4}-\d\d-\d\d$/.test(x.d)||seen.has(x.id))return;seen.add(x.id);
    const dt=new Date(x.d+'T12:00'),wd=(dt.getDay()+6)%7,mon=new Date(dt);mon.setDate(dt.getDate()-wd);
    out.push({...x,a:+x.a,m:x.d.slice(0,7),w:mon.toISOString().slice(0,10),dow:wd,src:x.fixed?'fijo':'manual'})};
  S.tx.forEach(push);
  S.fixed.forEach(f=>{
    for(let m=f.from;m<=ym(today);m=addM(m,1)){
      const d=m+'-'+String(Math.min(f.day,28)).padStart(2,'0');
      if(d<=today)push({id:f.id+m,t:f.t||'g',a:f.a,c:f.c,d,n:f.n,fixed:1});
    }
  });
  return out.sort((a,b)=>b.d.localeCompare(a.d));
}
function mstats(m,list=allTx()){
  const l=list.filter(x=>x.d.startsWith(m));
  const g=l.filter(x=>x.t==='g'),sum=a=>a.reduce((s,x)=>s+x.a,0);
  return{g:sum(g),i:sum(l.filter(x=>x.t==='i')),fx:sum(g.filter(x=>x.fixed)),l,
    cat:Object.keys(CATS).map(c=>[c,sum(g.filter(x=>x.c===c))]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1])};
}

