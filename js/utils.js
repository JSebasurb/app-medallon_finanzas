/* Utilidades: fechas, formato de moneda, ids */
const $=s=>document.querySelector(s);
function ym(d){return d.slice(0,7)}
function addM(m,n){let[y,mo]=m.split('-').map(Number);const d=new Date(y,mo-1+n,1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')}
const MN=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
const mname=m=>{const[y,mo]=m.split('-');return MN[mo-1][0].toUpperCase()+MN[mo-1].slice(1)+' '+y};
const money=n=>new Intl.NumberFormat('es-CO',{style:'currency',currency:S.cur,maximumFractionDigits:0}).format(n);
const short=n=>new Intl.NumberFormat('es-CO',{notation:'compact',maximumFractionDigits:1}).format(n);
const esc=s=>String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const today=new Date().toISOString().slice(0,10);
const uid=()=>Math.random().toString(36).slice(2,9);
