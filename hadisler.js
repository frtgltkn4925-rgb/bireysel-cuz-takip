"use strict";
/* ===== Hadis Ansiklopedisi (HadeethEnc.com, Türkçe) =====
   Kullanım şartı: metinler değiştirilmeden gösterilir, kaynak açıkça belirtilir. */
const HE_API="https://hadeethenc.com/api/v1/";
const HE_KAYNAK=`<p class="muted small he-kaynak">Kaynak: <a href="https://hadeethenc.com/tr" target="_blank" rel="noopener">HadeethEnc.com</a> · Tercüme Edilmiş Nebevî Hadisler Ansiklopedisi (Türkçe). Metinler değiştirilmeden aktarılmıştır.</p>`;
const heBellek={};
async function heAl(yol,q){
  const qs=new URLSearchParams(q).toString(),key=yol+"?"+qs;
  if(heBellek[key])return heBellek[key];
  let d=null;
  try{const c=new AbortController(),t=setTimeout(()=>c.abort(),15000);
    const r=await fetch(HE_API+yol+"/?"+qs,{signal:c.signal});clearTimeout(t);if(r.ok)d=await r.json()}catch(e){}
  if(d===null){try{d=await grupIstek("hadis",{yol,q})}catch(e){}}
  if(d===null)throw new Error("yok");
  heBellek[key]=d;return d}
const heHata=el=>{el.innerHTML=`<div class="empty">Hadisler yüklenemedi. İnternet bağlantınızı kontrol edip tekrar deneyin.</div><button class="btn full" id="heTekrar">Tekrar dene</button>`;el.querySelector("#heTekrar").onclick=()=>render()};
const heMetin=t=>esc(String(t||"").trim()).replace(/\n+/g,"<br>");
let heSayfa={};

function vHadisler(el){
  const p=cur.p||"";
  if(p.startsWith("h"))return heDetay(el,p.slice(1));
  if(p.startsWith("k"))return heKategori(el,p.slice(1));
  heAna(el)}

async function heAna(el){
  el.innerHTML=`<div class="donen"></div>`;
  try{const kok=await heAl("categories/roots",{language:"tr"});if(cur.v!=="hadisler"||cur.p)return;
    el.innerHTML=`<p class="muted" style="margin:0 2px 12px">Sahih hadisler, Türkçe anlamı ve kısa açıklamasıyla. Bir konu seçin.</p>
     <div class="rows">${kok.map(k=>`<div class="rw" data-go="hadisler-k${esc(k.id)}"><div class="ico">${ic("hadis")}</div><div class="tx"><b>${esc(k.title)}</b><span>${esc(k.hadeeths_count)} hadis</span></div><span class="chev">${ic("chev",18)}</span></div>`).join("")}</div>${HE_KAYNAK}`}
  catch(e){heHata(el)}}

async function heKategori(el,id){
  el.innerHTML=`<div class="donen"></div>`;
  try{const [hepsi,liste]=await Promise.all([heAl("categories/list",{language:"tr"}),heAl("hadeeths/list",{language:"tr",category_id:id,page:1,per_page:30})]);
    if(cur.v!=="hadisler"||cur.p!=="k"+id)return;
    const kat=hepsi.find(k=>String(k.id)===String(id)),alt=hepsi.filter(k=>String(k.parent_id)===String(id));
    if(kat)setTitle(kat.title,kat.hadeeths_count+" hadis");
    const ust=kat&&kat.parent_id?`<button class="btn ghost" data-go="hadisler-k${esc(kat.parent_id)}" style="margin-bottom:10px">‹ Üst konu</button>`:"";
    el.innerHTML=`${ust}${alt.length?`<h2 class="sec" style="margin-top:0">Alt konular</h2><div class="rows">${alt.map(k=>`<div class="rw" data-go="hadisler-k${esc(k.id)}"><div class="tx"><b>${esc(k.title)}</b><span>${esc(k.hadeeths_count)} hadis</span></div><span class="chev">${ic("chev",18)}</span></div>`).join("")}</div><h2 class="sec">Bu konudaki hadisler</h2>`:""}
     <div class="rows" id="heL"></div><button class="btn full line hide" id="heDaha" style="margin-top:10px">Daha fazla göster</button>${HE_KAYNAK}`;
    const L=el.querySelector("#heL"),D=el.querySelector("#heDaha");
    const ekle=d=>{L.insertAdjacentHTML("beforeend",(d.data||[]).map(h=>`<div class="rw" data-go="hadisler-h${esc(h.id)}"><div class="tx"><b class="he-bas">${esc(h.title)}</b></div><span class="chev">${ic("chev",18)}</span></div>`).join(""));
      const m=d.meta||{};heSayfa[id]=+m.current_page||1;D.classList.toggle("hide",!(+m.last_page>heSayfa[id]))};
    ekle(liste);if(!L.children.length)L.outerHTML=`<div class="empty">Bu başlıkta doğrudan hadis yok; alt konulardan birini seçin.</div>`;
    D.onclick=async()=>{D.disabled=true;D.textContent="Yükleniyor…";try{ekle(await heAl("hadeeths/list",{language:"tr",category_id:id,page:(heSayfa[id]||1)+1,per_page:30}))}catch(e){toast("Yüklenemedi, tekrar deneyin")}D.disabled=false;D.textContent="Daha fazla göster"}}
  catch(e){heHata(el)}}

async function heDetay(el,id){
  el.innerHTML=`<div class="donen"></div>`;
  try{const [tr,ar]=await Promise.all([heAl("hadeeths/one",{language:"tr",id}),heAl("hadeeths/one",{language:"ar",id}).catch(()=>null)]);
    if(cur.v!=="hadisler"||cur.p!=="h"+id)return;
    setTitle("Hadis",tr.grade||"");
    const ipucu=Array.isArray(tr.hints)?tr.hints.filter(Boolean):[];
    const kaynakAr=ar&&ar.attribution?ar.attribution:"";
    const fav={kaynak:"HadeethEnc · "+(tr.attribution||kaynakAr||"Hadis"),metin:String(tr.hadeeth||"").trim(),ar:ar?String(ar.hadeeth||"").trim():""};
    el.innerHTML=`<article class="card he-kart">
      ${ar&&ar.hadeeth?`<div class="arx he-ar">${heMetin(ar.hadeeth)}</div>`:""}
      ${kaynakAr?`<div class="he-ref" dir="rtl">${heMetin(kaynakAr)}</div>`:""}
      <div class="he-tr">${heMetin(tr.hadeeth)}</div>
      <div class="he-etiket">${tr.grade?`<span class="pill">${esc(tr.grade)}</span>`:""}${tr.attribution?`<span class="pill">${esc(tr.attribution)}</span>`:""}</div>
      <div class="acts"><button id="heKay">${isFav(fav)?"Kaydedildi":"Kaydet"}</button><button id="heDuv">Ekran resmi yap</button><button id="hePay">Paylaş</button></div></article>
     ${tr.explanation?`<h2 class="sec">Açıklama</h2><div class="card he-aciklama">${heMetin(tr.explanation)}</div>`:""}
     ${ipucu.length?`<h2 class="sec">Hadisten çıkan dersler</h2><div class="card"><ul class="he-ders">${ipucu.map(h=>`<li>${heMetin(h)}</li>`).join("")}</ul></div>`:""}
     <a class="btn full line" style="margin-top:12px" href="https://hadeethenc.com/tr/browse/hadith/${encodeURIComponent(id)}" target="_blank" rel="noopener">HadeethEnc.com'da aç</a>${HE_KAYNAK}`;
    el.querySelector("#heKay").onclick=e=>{toggleFav(fav);e.target.textContent=isFav(fav)?"Kaydedildi":"Kaydet"};
    el.querySelector("#heDuv").onclick=()=>{wp.kaynak="fav";wp.src={a:fav.ar.length<220?fav.ar:"",m:fav.metin.length<300?fav.metin:fav.metin.slice(0,297)+"…",k:tr.attribution||"HadeethEnc.com"};go("duvar")};
    el.querySelector("#hePay").onclick=async()=>{const t=`${fav.metin}\n\n${tr.attribution||""}${tr.grade?" · "+tr.grade:""}\nKaynak: HadeethEnc.com`;
      try{if(navigator.share){await navigator.share({text:t});return}}catch(e){if(e&&e.name==="AbortError")return}
      try{await navigator.clipboard.writeText(t);toast("Hadis kopyalandı")}catch(e){toast("Paylaşılamadı")}}}
  catch(e){heHata(el)}}
