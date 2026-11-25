"use strict";
/* ===== Kur'an'da konu arama =====
   Elmalılı Hamdi Yazır mealinin tamamı bir kez indirilir (yaklaşık 1,5 MB), sonra arama telefonda, internetsiz yapılır.
   Türkçe ekler ve Elmalılı'nın eski kelimeleri için her konunun eş anlamlıları da aranır. */
const KONU_ESA={
  "sabır":["sabr","sabır","sabred","sabret","sabırl","sabırs","sebat"],
  "namaz":["namaz","salât"],
  "anne baba":["ana baba","ana-baba","anne","anasına","babasına","ebeveyn"],
  "dua":["dua","yalvar","niyaz"],
  "tevbe":["tevbe","tövbe","istiğfar","mağfiret dile","bağışlanma dile"],
  "rızık":["rızk","rızık","rızıklan"],
  "şükür":["şükr","şükür","şükred","şükret","nankör"],
  "ahiret":["ahiret","kıyamet","hesap günü","din günü"],
  "cennet":["cennet","firdevs","adn bahçe"],
  "cehennem":["cehennem","ateşe","ateşin","sakar","hutame"],
  "yetim":["yetim"],
  "adalet":["adalet","adl","adil","insaf","hakkaniyet"],
  "merhamet":["merhamet","rahmet","esirge","şefkat"],
  "ilim":["ilim","ilm","bilgi","âlim","alim","hikmet"],
  "oruç":["oruç","oruc","ramazan"],
  "zekât":["zekât","zekat"],
  "hac":["hac","hacc","haccı","haccın","hacca","umre","kâbe","beytullah"],
  "kardeşlik":["kardeş"],
  "ölüm":["ölüm","ölü","öldü","ölecek","öldür","vefat"],
  "tevekkül":["tevekkül","dayan","güven"],
  "sadaka":["sadaka","infak","harcay"],
  "hayvanlar":["hayvan","deve","sığır","koyun","karınca","arı","kuş"],
  "yalan":["yalan"],
  "faiz":["riba","faiz"],
  "içki":["şarap","hamr","içki","sarhoş"],
  "takva":["takva","muttaki","sakın","korunan"],
  "şeytan":["şeytan","iblis"],
  "melekler":["melek"],
  "peygamberler":["peygamber","resul","nebi"],
  "kuran":["kur'an","kuran","kitab","kitap"],
  "evlilik":["nikâh","nikah","evlen","eşler","zevce"],
  "miras":["miras","vasiyet"],
  "yemin":["yemin","ahd"],
  "hayâ":["haya","iffet","namus"],
  "tövbe":["tevbe","tövbe","istiğfar"]
};
const KONU_ONERI=["Sabır","Namaz","Anne baba","Dua","Tevbe","Rızık","Şükür","Merhamet","Adalet","Yetim","İlim","Ahiret","Cennet","Oruç","Zekât","Sadaka","Tevekkül","Ölüm","Hac","Faiz"];
const knNorm=t=>String(t||"").toLocaleLowerCase("tr").replace(/[âáà]/g,"a").replace(/[îí]/g,"i").replace(/[ûú]/g,"u").replace(/[’‘`´]/g,"'").replace(/[^a-zçğıöşü0-9' -]/g," ").replace(/\s+/g," ").trim();
let KN_MEAL=null,KN_YUKLE=null;
async function knMeal(ilerle){
  if(KN_MEAL)return KN_MEAL;if(KN_YUKLE)return KN_YUKLE;
  KN_YUKLE=(async()=>{try{const c=await IDB.get("meal-tr-yazir");if(c&&c.length>6000){KN_MEAL=c;return c}}catch(e){}
    ilerle&&ilerle("Meal indiriliyor… (bir kerelik, yaklaşık 1,5 MB)");
    const r=await fetch("https://api.alquran.cloud/v1/quran/tr.yazir");if(!r.ok)throw new Error("indirilemedi");const j=await r.json();
    const out=[];j.data.surahs.forEach(s=>s.ayahs.forEach(a=>out.push([s.number,a.numberInSurah,String(a.text).replace(/<[^>]+>/g,"")])));
    if(out.length<6000)throw new Error("eksik");out.forEach(x=>x.push(" "+knNorm(x[2])+" "));
    try{await IDB.put("meal-tr-yazir",out)}catch(e){}KN_MEAL=out;return out})();
  try{return await KN_YUKLE}finally{KN_YUKLE=null}}
// bir kelimenin aranacak biçimleri: ünlü düşmesi (sabır→sabr), ünsüz yumuşaması (kitap→kitab)
function knBicim(w){const out=new Set([w]);
  const m=w.match(/^(.*[^aeıioöuü])([ıiuü])([^aeıioöuü])$/);if(m&&w.length>=4)out.add(m[1]+m[3]);
  const yum={p:"b",ç:"c",t:"d",k:"ğ"},son=w.slice(-1);if(yum[son]&&w.length>=4)out.add(w.slice(0,-1)+yum[son]);
  if(w.length>=6)out.add(w.slice(0,w.length-2));return[...out]}
function knGruplar(q){const n=knNorm(q).replace(/\b(ile|ilgili|hakkında|hakkinda|ayetler|ayetleri|ayet|kuranda|kur'anda|nedir|ne|der|diyor)\b/g," ").replace(/\s+/g," ").trim();
  if(!n)return[];
  const anahtar=Object.keys(KONU_ESA).find(k=>knNorm(k)===n);if(anahtar)return[KONU_ESA[anahtar].map(knNorm)];
  return n.split(" ").filter(w=>w.length>=2).map(w=>{const es=Object.keys(KONU_ESA).find(k=>knNorm(k)===w);return es?KONU_ESA[es].map(knNorm):knBicim(w)})}
function knEslesir(metin,kelimeler,v){if(v.includes(" "))return metin.includes(" "+v);if(v.length<=3)return kelimeler.has(v);for(const k of kelimeler)if(k.startsWith(v))return true;return false}
function knAra(meal,q){const G=knGruplar(q);if(!G.length)return{G,l:[],tam:true};
  const sonuc=[];for(const a of meal){const metin=a[3],kel=new Set(metin.trim().split(" ").map(k=>k.replace(/'.*$/,"")));let skor=0;
    G.forEach(g=>{if(g.some(v=>knEslesir(metin,kel,v)))skor++});if(skor)sonuc.push([skor,a])}
  const tamlar=sonuc.filter(x=>x[0]===G.length);const l=(tamlar.length?tamlar:sonuc).sort((a,b)=>b[0]-a[0]||a[1][0]-b[1][0]||a[1][1]-b[1][1]).map(x=>x[1]);
  return{G,l,tam:!!tamlar.length||G.length===1}}
function knVurgula(t,G){let h=esc(t);const vs=G.flat().filter(v=>v.length>=3).sort((a,b)=>b.length-a.length);
  return h.replace(/[A-Za-zÇĞİÖŞÜçğıöşüÂÎÛâîû'’]+/g,w=>{const n=knNorm(w).replace(/'.*$/,"");return vs.some(v=>v.includes(" ")?false:(v.length<=3?n===v:n.startsWith(v)))?`<mark>${w}</mark>`:w})}
let knSira="ilgili";
function vKonu(el){
  const q=cur.p?decodeURIComponent(cur.p):"";
  el.innerHTML=`<div class="seg"><button data-go="kuran">Sureler</button><button data-go="cuz">Cüzler</button><button class="on">Konu ara</button></div>
   <form class="kn-ara" id="knF"><input class="in" id="knQ" value="${esc(q)}" placeholder="Bir konu yazın: sabır, anne baba, rızık…" aria-label="Kur'an'da konu ara" enterkeyhint="search"><button class="btn acc" aria-label="Ara">Ara</button></form>
   <div class="chips" id="knO">${KONU_ONERI.map(k=>`<button class="chip ${knNorm(k)===knNorm(q)?"on":""}" data-k="${esc(k)}">${esc(k)}</button>`).join("")}</div>
   <div id="knS"></div>`;
  el.querySelector("#knF").onsubmit=e=>{e.preventDefault();const v=el.querySelector("#knQ").value.trim();if(v)go("konu-"+encodeURIComponent(v))};
  el.querySelector("#knO").onclick=e=>{const b=e.target.closest("[data-k]");if(b)go("konu-"+encodeURIComponent(b.dataset.k))};
  if(q)knGoster(el.querySelector("#knS"),q);
  else el.querySelector("#knS").innerHTML=`<p class="muted small" style="margin-top:12px">Aradığınız kelime Elmalılı Hamdi Yazır mealinin tamamında taranır; geçtiği ayetler alt alta sıralanır. İlk aramada meal bir kez indirilir, sonra internetsiz çalışır.</p>`}
async function knGoster(kutu,q){
  kutu.innerHTML=`<div class="card empty"><div class="spin"></div><div id="knD" class="small">Hazırlanıyor…</div></div>`;
  let meal;try{meal=await knMeal(t=>{const d=document.getElementById("knD");if(d)d.textContent=t})}catch(e){kutu.innerHTML=`<div class="card empty">Meal indirilemedi. İnternet bağlantınızı kontrol edip tekrar deneyin.</div>`;return}
  if(cur.v!=="konu"||decodeURIComponent(cur.p||"")!==q)return;
  const {G,l,tam}=knAra(meal,q);
  if(!l.length){kutu.innerHTML=`<div class="card empty">“${esc(q)}” mealde geçmiyor. Farklı bir kelime deneyin; örneğin “sabır” yerine “sabret”.</div>`;return}
  const sureSay=new Set(l.map(a=>a[0])).size;let goster=40;
  const sirala=()=>knSira==="mushaf"?[...l].sort((a,b)=>a[0]-b[0]||a[1]-b[1]):l;
  const ciz=()=>{const L=sirala();kutu.innerHTML=`<div class="kn-ozet"><div><b>${l.length} ayet</b><span>${sureSay} surede${tam?"":" · kelimelerin hepsi bir arada geçmediği için en yakın sonuçlar"}</span></div>
     <div class="seg kn-sira"><button data-s="ilgili" class="${knSira==="ilgili"?"on":""}">İlgili</button><button data-s="mushaf" class="${knSira==="mushaf"?"on":""}">Mushaf sırası</button></div></div>
    ${L.slice(0,goster).map(a=>`<article class="card kn-ayet"><div class="kn-ust"><b>${esc(SURELER[a[0]-1][0])} ${a[1]}</b><span>${a[0]}. sure</span></div>
      <p>${knVurgula(a[2],G)}</p>
      <div class="kn-acts"><button data-ac="${a[0]}-a${a[1]}">Surede oku</button><button data-kay="${a[0]}:${a[1]}">${isFav({kaynak:SURELER[a[0]-1][0]+" "+a[1],metin:a[2]})?"Kaydedildi":"Kaydet"}</button><button data-pay="${a[0]}:${a[1]}">Paylaş</button></div></article>`).join("")}
    ${L.length>goster?`<button class="btn full line" id="knDaha">Daha fazla göster (${L.length-goster} ayet daha)</button>`:""}
    <p class="muted small">Meal: Elmalılı Hamdi Yazır. Sonuçlar kelime taramasıdır; bir ayetin konuyla ilgisini değerlendirmek için ayeti suresi içinde, öncesi ve sonrasıyla okuyun.</p>`};
  ciz();
  kutu.onclick=async e=>{const b=e.target.closest("button");if(!b)return;
    if(b.dataset.s){knSira=b.dataset.s;ciz();return}
    if(b.id==="knDaha"){goster+=40;ciz();return}
    if(b.dataset.ac){go("sure-"+b.dataset.ac);return}
    const [s,n]=(b.dataset.kay||b.dataset.pay||"").split(":").map(Number);if(!s)return;const a=meal.find(x=>x[0]===s&&x[1]===n),kay=SURELER[s-1][0]+" "+n;
    if(b.dataset.kay){toggleFav({kaynak:kay,metin:a[2]});b.textContent=isFav({kaynak:kay,metin:a[2]})?"Kaydedildi":"Kaydet";return}
    const t=`${a[2]}\n— ${kay} (Elmalılı Hamdi Yazır meali)`;try{if(navigator.share){await navigator.share({text:t});return}}catch(er){if(er&&er.name==="AbortError")return}
    try{await navigator.clipboard.writeText(t);toast("Ayet kopyalandı")}catch(er){toast("Paylaşılamadı")}}}
