/* 🥉 BRONCE · datos crudos tal como se capturan (localStorage). Nada se transforma aquí. */
let S=JSON.parse(localStorage.getItem(KEY)||'null')||{tx:[],fixed:[],budget:3000000,cur:'COP'};
S.cb=S.cb||{};S.goals=S.goals||[];
const save=()=>localStorage.setItem(KEY,JSON.stringify(S));
