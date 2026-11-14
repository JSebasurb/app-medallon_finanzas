/* Hoja para agregar gastos, ingresos y fijos. */
// ---------- Hoja para agregar ----------
let kind='g';
function openSheet(k){
  kind=k||(tab==='fixed'?'f':tab==='hist'&&hv.t==='i'?'i':'g');
  const d=$('#dlg');
  d.innerHTML=`<div class="seg">${[['g','Gasto'],['i','Ingreso'],['f','Fijo']].map(([v,l])=>`<button data-k="${v}" class="${v===kind?'on':''}">${l}</button>`).join('')}</div>
  <input class="big" id="fa" type="number" inputmode="decimal" placeholder="0" autofocus>
  <label>Categoría</label><select id="fc">${(kind==='i'?INC:kind==='f'?[...Object.keys(CATS),...INC]:Object.keys(CATS)).map(c=>`<option>${c}</option>`).join('')}</select>
  <label>${kind==='f'?'Día del mes':'Fecha'}</label>${kind==='f'?'<input id="fd" type="number" min="1" max="28" value="1">':`<input id="fd" type="date" value="${cur===ym(today)?today:cur+'-01'}">`}
  <label>Nota</label><input id="fn" placeholder="${kind==='f'?'Ej. Arriendo':'Ej. Mercado'}">
  <button class="btn" id="ok">Guardar</button><button class="btn g" id="no">Cancelar</button>`;
  d.showModal();
}
function commit(){
  const a=parseFloat($('#fa').value);if(!(a>0)){$('#fa').focus();return}
  const c=$('#fc').value,n=$('#fn').value.trim(),v=$('#fd').value;
  if(kind==='f')S.fixed.push({id:uid(),n:n||c,a,c,day:Math.min(Math.max(+v||1,1),28),from:ym(today),t:INC.includes(c)?'i':'g',ts:Date.now()});
  else{S.tx.push({id:uid(),t:kind,a,c,d:v||today,n,ts:Date.now()});cur=ym(v||today)}
  save();$('#dlg').close();render();
}

