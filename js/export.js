/* Exportación de capas (JSON/CSV) y datos de ejemplo. */
// ---------- Datos ----------
const csv=(rows,h)=>h+'\n'+rows.map(r=>r.map(v=>/[",\n]/.test(v)?'"'+String(v).replace(/"/g,'""')+'"':(v??'')).join(',')).join('\n');
function dl(name,txt,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type}));a.download=name;a.click()}
function demo(){
  let s=7;const r=()=>(s=s*16807%2147483647)/2147483647,now=ym(today);
  S.tx=[];S.fixed=[['Arriendo',1200000,'Vivienda',5],['Internet',90000,'Servicios',10],['Gimnasio',120000,'Salud',3],['Streaming',40000,'Ocio',15]].map(([n,a,c,day])=>({id:uid(),n,a,c,day,from:addM(now,-6)}));
  const vars=[['Mercado','Comida',90000],['Taxi','Transporte',25000],['Cine','Ocio',45000],['Ropa','Compras',140000],['Farmacia','Salud',50000],['Restaurante','Comida',70000]];
  for(let m=-6;m<=0;m++){const mm=addM(now,m);
    S.tx.push({id:uid(),t:'i',a:4200000,c:'Salario',d:mm+'-01',n:'Nómina'});
    for(let k=0;k<16;k++){const v=vars[Math.floor(r()*vars.length)],dd=1+Math.floor(r()*27),date=mm+'-'+String(dd).padStart(2,'0');
      if(date>today)continue;
      let a=Math.round(v[2]*(.6+r()*.9)*(1+(m+6)*.03)/1000)*1000;if(r()>.96)a*=4;
      S.tx.push({id:uid(),t:'g',a,c:v[1],d:date,n:v[0]});}}
  save();tab='home';render();
}

