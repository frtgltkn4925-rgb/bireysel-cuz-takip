"use strict";
/* ===== İnternetsiz kullanım =====
   Kur'an'ın tamamı (Arapça, Elmalılı meali, okunuş, Celâleyn), 30 cüz, konu araması için meal ve
   seçili şehrin 12 aylık namaz vakitleri bir kez indirilir. İndirilenleri sw.js saklar, uygulama internetsiz açılır. */
const CD_URL=()=>{const u=[];for(let n=1;n<=114;n++){u.push(API+"surah/"+n+"/editions/"+KURAN_YAZIM+",tr.yazir,tr.transliteration");u.push(API+"surah/"+n+"/ar.jalalayn")}
  for(let k=1;k<=30;k++){u.push(API+"juz/"+k+"/"+KURAN_YAZIM);u.push(API+"juz/"+k+"/tr.transliteration")}return u};
let cdCalisiyor=false;
async function cdIndir(ilerle){
  if(cdCalisiyor)return;cdCalisiyor=true;
  try{try{await navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
    const isler=CD_URL().map(u=>async()=>{for(let d=0;d<3;d++){try{const r=await fetch(u);if(r.ok){await r.arrayBuffer();return true}}catch(e){}await new Promise(z=>setTimeout(z,800))}return false});
    isler.push(async()=>{try{await knMeal();return true}catch(e){return false}});
    if(S.il){const g=new Date();for(let i=0;i<12;i++){const d=new Date(g.getFullYear(),g.getMonth()+i,1);isler.push(async()=>{try{await vakitAyi(d.getFullYear(),d.getMonth()+1);return true}catch(e){return false}})}}
    let bitti=0,hata=0,sira=0;const top=isler.length;
    const isci=async()=>{while(sira<top){const f=isler[sira++];if(!(await f()))hata++;bitti++;ilerle(bitti/top)}};
    await Promise.all([isci(),isci(),isci(),isci()]);
    S.cevrimdisi={t:Date.now(),il:S.il?S.il.ad:"",hata};save();return{top,hata}}
  finally{cdCalisiyor=false}}
async function cdBoyut(){try{const e=await navigator.storage.estimate();return e.usage?Math.round(e.usage/1048576):0}catch(e){return 0}}
function cdKart(){const c=S.cevrimdisi;
  return `<div class="card cd-kart"><div class="row between" style="gap:10px;align-items:flex-start"><div><b>${ic("dl",16)} Kur'an ve vakitler telefonda</b>
    <div class="muted small" style="margin-top:4px">${c?`İndirildi: ${new Date(c.t).toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"})}${c.il?` · Vakitler: ${esc(c.il)}`:""}${c.hata?` · ${c.hata} parça eksik, tekrar indirin`:""}`:"Kur'an'ın tamamı, meal, okunuş, tefsir ve 12 aylık namaz vakitleri telefona indirilsin; internet olmadan da çalışsın."}</div>
    <div class="muted small" id="cdBoy"></div></div>
    <button class="btn sm ${c&&!c.hata?"ghost":"acc"}" id="cdBtn" style="white-space:nowrap;flex:none">${c?"Güncelle":"İndir"}</button></div>
    <div class="dp-bar hide" id="cdBar" style="margin-top:10px"><i></i></div></div>`}
function cdBagla(el){const b=el.querySelector("#cdBtn");if(!b)return;
  cdBoyut().then(m=>{const x=el.querySelector("#cdBoy");if(x&&m)x.textContent=`Telefonda kullanılan alan: yaklaşık ${m} MB`});
  b.onclick=async()=>{if(!navigator.onLine){toast("İndirmek için internet gerekiyor");return}
    if(!S.il)toast("Şehir seçilmediği için namaz vakitleri indirilmeyecek");
    const bar=el.querySelector("#cdBar"),i=bar.querySelector("i");bar.classList.remove("hide");b.disabled=true;
    toast("İndirme başladı; yaklaşık 15 MB. Wi-Fi önerilir.");
    const s=await cdIndir(p=>{i.style.width=Math.round(p*100)+"%";b.textContent=`%${Math.round(p*100)}`});
    b.disabled=false;toast(s&&s.hata?`İndirme bitti, ${s.hata} parça alınamadı. Tekrar deneyin.`:"İndirme tamamlandı. Uygulama artık internetsiz de çalışır.");if(cur.v==="ayarlar")render()}}
/* İnternet durumu şeridi */
function cdSerit(){let s=document.getElementById("cdSerit");if(!s){s=document.createElement("div");s.id="cdSerit";s.className="cd-serit";s.setAttribute("role","status");document.body.appendChild(s)}
  const yok=!navigator.onLine;s.textContent=yok?(S.cevrimdisi?"İnternet yok · indirilen içerikler kullanılıyor":"İnternet yok · yalnızca daha önce açılan sayfalar görünür"):"";s.classList.toggle("on",yok);document.body.classList.toggle("cevrimdisi",yok)}
window.addEventListener("online",()=>{cdSerit();toast("İnternet bağlantısı geldi")});window.addEventListener("offline",cdSerit);setTimeout(cdSerit,500);
/* İnternet varken bu ayın ve gelecek ayın vakitlerini sessizce hazırla (ay başında internet yoksa vakitler kaybolmasın) */
setTimeout(async()=>{if(!navigator.onLine||!S.il)return;const g=new Date();for(let i=0;i<2;i++){const d=new Date(g.getFullYear(),g.getMonth()+i,1);try{await vakitAyi(d.getFullYear(),d.getMonth()+1)}catch(e){}}},6000);
/* Uygulama doğrudan Ayarlar sayfasında açıldıysa ilk çizim bu dosya yüklenmeden yapılmıştır; bölümü şimdi tamamla */
if(typeof cur!=="undefined"&&cur.v==="ayarlar")render();
