"use strict";
/* ===== Sesli komut (görme engelliler ve eller meşgulken) =====
   Ekrandaki büyük mikrofon düğmesine dokunup konuşulur. Uygulama sayfayı açar ve ne yaptığını sesli söyler. */
const SK_SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const skNorm=t=>String(t||"").toLocaleLowerCase("tr").replace(/[âáà]/g,"a").replace(/[îí]/g,"i").replace(/[ûú]/g,"u").replace(/['’`\-.,!?]/g," ").replace(/\s+/g," ").trim();
const skDuz=t=>skNorm(t).replace(/\s/g,"");
function skSoyle(metin){const c=document.getElementById("skCanli");if(c)c.textContent=metin;if(S.sesliCevap===false)return;const ss=window.speechSynthesis;if(!ss)return;try{ss.cancel();const u=new SpeechSynthesisUtterance(metin);u.lang="tr-TR";u.rate=.95;const v=ss.getVoices().find(x=>/^tr/i.test(x.lang));if(v)u.voice=v;ss.speak(u)}catch(e){}}
const SK_BIR={bir:1,iki:2,uc:3,"üç":3,dort:4,"dört":4,bes:5,"beş":5,alti:6,"altı":6,yedi:7,sekiz:8,dokuz:9},SK_ON={on:10,yirmi:20,otuz:30,kirk:40,"kırk":40,elli:50,altmis:60,"altmış":60,yetmis:70,"yetmiş":70,seksen:80,doksan:90,yuz:100,"yüz":100};
function skSayi(t){const d=t.match(/\d+/);if(d)return +d[0];let top=0,var_=false;
  for(let w of t.split(" ")){w=w.replace(/(ıncı|inci|uncu|üncü|ncı|nci|ncu|ncü)$/,"").replace(/^dörd$/,"dört");
    if(SK_ON[w]!==undefined){top+=SK_ON[w];var_=true}else if(SK_BIR[w]!==undefined){top+=SK_BIR[w];var_=true}else if(var_)break}
  return var_?top:null}
let SK_SURE=null;
function skSureBul(t){if(!SK_SURE)SK_SURE=SURELER.map(([ad],i)=>({n:i+1,b:skNorm(ad),d:skDuz(ad)})).sort((a,b)=>b.d.length-a.d.length);
  const bos=" "+t+" ",duz=t.replace(/\s/g,"");
  for(const s of SK_SURE){if(bos.includes(" "+s.b+" ")||bos.includes(" "+s.b+"s")||bos.includes(" "+s.d+" ")||bos.includes(" "+s.d+"s")||(s.d.length>=5&&duz.includes(s.d)))return s.n}
  const m=t.match(/(\d+|\S+)\s*(?:inci|ıncı|uncu|üncü|nci|ncı)?\s*sure/);if(m){const n=skSayi(t);if(n>=1&&n<=114)return n}return null}
const SK_SAYFA=[[/(ana sayfa|anasayfa|bugün|başa dön|giriş)/,"home","Ana sayfa"],[/(namaz vakit|vakitler|ezan|imsakiye)/,"vakit","Namaz vakitleri"],[/kıble|pusula/,"kible","Kıble pusulası"],
  [/zikir|tesbih|zikirmatik/,"zikir","Zikir"],[/hadis/,"hadisler","Hadis ansiklopedisi"],[/grup/,"grup","Grup okuma"],[/kitaplık|kitaplar/,"kitaplik","Kitaplık"],[/siyer/,"siyer","Siyer-i Nebî"],
  [/peygamber/,"peygamber","Peygamberler"],[/sahabe/,"sahabe","Sahabeler"],[/hava/,"hava","Hava durumu"],[/dini gün|kandil/,"gunler","Dini günler"],[/cevşen/,"cevsen","Cevşen"],
  [/ekran resmi|duvar kağıdı|duvar kâğıdı/,"duvar","Telefon ekranı"],[/ayarlar/,"ayarlar","Ayarlar"],[/hatim|plan/,"cuz","Hatim ve plan"],[/kuran|kur an|mushaf/,"kuran","Kur'an-ı Kerîm sure listesi"]];
const SK_YARDIM="Şunları söyleyebilirsiniz: Yasin suresini oku. Beşinci cüzü dinle. Namaz vakitleri. Sıradaki vakit. Kıble. Zikir. Hadisler. Ana sayfa. Geri. Dur.";
async function skKomut(ham){const t=skNorm(ham);if(!t)return;
  const oku=document.querySelector(".oku");
  if(/^(dur|durdur|sus|kapat ses)/.test(t)){const b=oku&&oku.querySelector("#dinle");if(b&&b.textContent.includes("⏸"))b.click();try{speechSynthesis.cancel()}catch(e){}return}
  if(/^(devam|devam et|oynat)$/.test(t)){const b=oku&&oku.querySelector("#dinle");if(b){b.click();return}}
  if(/yardım|komutlar|ne diyebilirim/.test(t))return skSoyle(SK_YARDIM);
  if(/^(geri|geri dön|kapat|çık)$/.test(t)){if(oku){oku.querySelector("#kapat").click();return skSoyle("Okuma kapatıldı")}history.back();return skSoyle("Geri dönüldü")}
  if(/(sıradaki|sonraki|kaçta|ne zaman).*(vakit|ezan|namaz)|(vakit|ezan|namaz).*(kaçta|kaldı|ne zaman)/.test(t)){
    if(!S.il)return skSoyle("Önce şehrinizi seçmeniz gerekiyor. Ayarlardan şehir seçebilirsiniz.");
    try{const v=await sonrakiVakit();if(!v)return skSoyle("Vakit bilgisi alınamadı");const dk=Math.round((v.t-new Date())/60000),sa=Math.floor(dk/60);
      return skSoyle(`${VAKIT_AD[v.i][1]} vakti saat ${v.t.getHours()} ${String(v.t.getMinutes()).padStart(2,"0")}. ${sa?sa+" saat ":""}${dk%60} dakika kaldı.`)}catch(e){return skSoyle("Vakit bilgisi alınamadı")}}
  const dinle=/(dinle|oku|aç|başlat)/.test(t);
  if(/cüz/.test(t)){const n=skSayi(t);if(n>=1&&n<=30){if(oku)oku.querySelector("#kapat").click();skSoyle(`${n}. cüz açılıyor`);okuyucu(n,{dinle:/dinle/.test(t)});return}}
  const s=skSureBul(t);
  if(s&&(/sure|dinle|oku/.test(t)||t.split(" ").length<=2)){const ad=SURELER[s-1][0];
    if(dinle){if(oku)oku.querySelector("#kapat").click();skSoyle(`${ad} suresi açılıyor`);okuyucu(sureCuzu(s),{sure:s,dinle:/dinle/.test(t)})}
    else{go("sure-"+s);skSoyle(`${ad} suresi`)}return}
  for(const [re,v,ad] of SK_SAYFA)if(re.test(t)){if(oku)oku.querySelector("#kapat").click();go(v);return skSoyle(ad+" açıldı")}
  skSoyle(`Anlayamadım: ${ham}. Komutları duymak için yardım deyin.`)}
let skDinliyor=false,skTanima=null;
function skBasla(){const b=document.getElementById("skMik");
  if(!SK_SR){skSoyle("Bu telefonda sesli komut desteklenmiyor. Google uygulamasının güncel olduğundan emin olun.");toast("Sesli komut bu telefonda desteklenmiyor");return}
  if(skDinliyor){try{skTanima.stop()}catch(e){}return}
  try{speechSynthesis.cancel()}catch(e){}
  skTanima=new SK_SR();skTanima.lang="tr-TR";skTanima.interimResults=false;skTanima.maxAlternatives=3;
  skTanima.onstart=()=>{skDinliyor=true;b&&b.classList.add("on");b&&b.setAttribute("aria-label","Dinliyorum. Durdurmak için dokunun")};
  skTanima.onend=()=>{skDinliyor=false;b&&b.classList.remove("on");b&&b.setAttribute("aria-label","Sesli komut. Dokunup konuşun")};
  skTanima.onerror=e=>{if(e.error==="not-allowed"||e.error==="service-not-allowed")skSoyle("Mikrofon izni verilmedi. Telefon ayarlarından izin verin.");else if(e.error==="no-speech")skSoyle("Ses duyamadım, tekrar deneyin.")};
  skTanima.onresult=e=>{const r=e.results[0];let en=r[0].transcript;for(let i=0;i<r.length;i++){if(skSureBul(skNorm(r[i].transcript))||/cüz|vakit|kıble|zikir|hadis/.test(skNorm(r[i].transcript))){en=r[i].transcript;break}}skKomut(en)};
  try{skTanima.start()}catch(e){}}
function skDugme(){if(document.getElementById("skMik"))return;
  document.body.insertAdjacentHTML("beforeend",`<button id="skMik" class="sk-mik" aria-label="Sesli komut. Dokunup konuşun"><svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z"/></svg></button><div id="skCanli" class="gizli-okunur" aria-live="polite"></div>`);
  document.getElementById("skMik").onclick=skBasla;skGoster()}
function skGoster(){const b=document.getElementById("skMik");if(b)b.classList.toggle("hide",S.sesliKomut===false)}
skDugme();
