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
const skAn=t=>skNorm(t).replace(/ç/g,"c").replace(/ğ/g,"g").replace(/ı/g,"i").replace(/ö/g,"o").replace(/ş/g,"s").replace(/ü/g,"u");
function skMesafe(a,b){if(Math.abs(a.length-b.length)>2)return 9;const d=Array.from({length:a.length+1},(_,i)=>[i]);for(let j=1;j<=b.length;j++)d[0][j]=j;
  for(let i=1;i<=a.length;i++)for(let j=1;j<=b.length;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[a.length][b.length]}
const SK_EK={yasin:36,yasinsuresi:36,mulk:67,tebareke:67,rahman:55,vakia:56,vakaa:56,kehf:18,kehif:18,fetih:48,nebe:78,amme:78,ihlas:112,felak:113,nas:114,fatiha:1,elham:1,bakara:2,ayetelkursi:2,cuma:62,hucurat:49,kadir:97,duha:93,insirah:94,tin:95,alak:96,asr:103,kevser:108,kafirun:109,nasr:110,tebbet:111,mesed:111,yusuf:12,meryem:19,taha:20,lokman:31,secde:32,sad:38,muhammed:47,kaf:50,hadid:57,muzzemmil:73,muddessir:74,insan:76,mearic:70,nuh:71,cin:72,naziat:79,abese:80,tekvir:81,infitar:82,mutaffifin:83,insikak:84,buruc:85,tarik:86,ala:87,gasiye:88,fecr:89,beled:90,sems:91,leyl:92,beyyine:98,zilzal:99,adiyat:100,karia:101,tekasur:102,humeze:104,fil:105,kureys:106,maun:107,hasr:59,saf:61,talak:65,tahrim:66,kalem:68,hakka:69,kiyame:75,murselat:77,necm:53,kamer:54,tur:52,zariyat:51,ahkaf:46,casiye:45,duhan:44,zuhruf:43,sura:42,fussilet:41,mumin:40,gafir:40,zumer:39,saffat:37,fatir:35,sebe:34,ahzab:33,rum:30,ankebut:29,kasas:28,neml:27,suara:26,furkan:25,nur:24,muminun:23,hac:22,enbiya:21,isra:17,nahl:16,hicr:15,ibrahim:14,rad:13,hud:11,yunus:10,tevbe:9,enfal:8,araf:7,enam:6,maide:5,nisa:4,aliimran:3,imran:3};
let SK_SURE=null;
function skSureBul(t){if(!SK_SURE){SK_SURE=SURELER.map(([ad],i)=>({n:i+1,k:skAn(ad).replace(/[^a-z]/g,"")}));for(const [k,n] of Object.entries(SK_EK))SK_SURE.push({n,k});SK_SURE.sort((a,b)=>b.k.length-a.k.length)}
  const a=skAn(t),duz=a.replace(/[^a-z]/g,""),kel=a.split(" ").map(w=>w.replace(/[^a-z]/g,"")).filter(w=>w.length>=3&&!/^(sure|suresi|suresini|sureyi|oku|okut|dinle|dinlet|ac|acar|misin|lutfen|bana|simdi|baslat|cuz|cuzu)/.test(w));
  for(const s of SK_SURE)if(s.k.length>=4&&duz.includes(s.k))return s.n;
  for(const w of kel)for(const s of SK_SURE)if(s.k.length>=3&&(w===s.k||(w.startsWith(s.k)&&w.length-s.k.length<=4)))return s.n;
  let en=null,ed=9;for(const w of kel)for(const s of SK_SURE){if(s.k.length<4)continue;const d=skMesafe(w.slice(0,s.k.length+1),s.k);const lim=s.k.length>=6?2:1;if(d<=lim&&d<ed){ed=d;en=s.n}}
  if(en)return en;
  if(/sure/.test(a)){const n=skSayi(skNorm(t));if(n>=1&&n<=114)return n}return null}
const SK_SAYFA=[[/(ana sayfa|anasayfa|bugün|başa dön|giriş)/,"home","Ana sayfa"],[/(namaz vakit|vakitler|ezan|imsakiye|vakitleri)/,"vakit","Namaz vakitleri"],[/kıble|kible|pusula/,"kible","Kıble pusulası"],
  [/zikir|tesbih|zikirmatik/,"zikir","Zikir"],[/hadis/,"hadisler","Hadis ansiklopedisi"],[/grup/,"grup","Grup okuma"],[/kitaplık|kitaplik|kitaplar/,"kitaplik","Kitaplık"],[/siyer/,"siyer","Siyer-i Nebî"],
  [/peygamber/,"peygamber","Peygamberler"],[/sahabe/,"sahabe","Sahabeler"],[/hava/,"hava","Hava durumu"],[/dini gün|kandil/,"gunler","Dini günler"],[/cevşen/,"cevsen","Cevşen"],
  [/ekran resmi|duvar kağıdı|duvar kâğıdı/,"duvar","Telefon ekranı"],[/ayarlar/,"ayarlar","Ayarlar"],[/hatim|plan/,"cuz","Hatim ve plan"],[/kuran|kur an|mushaf/,"kuran","Kur'an-ı Kerîm sure listesi"]];
const SK_YARDIM="Şunları söyleyebilirsiniz: Yasin suresini oku. Beşinci cüzü dinle. Namaz vakitleri. Sıradaki vakit. Kıble. Zikir. Hadisler. Ana sayfa. Geri. Dur.";
async function skKomut(ham){const t=skNorm(ham);if(!t)return;const a=skAn(ham);
  const oku=document.querySelector(".oku");
  if(/^(dur|durdur|sus|bekle|kapat ses)/.test(a)){const b=oku&&oku.querySelector("#dinle");if(b&&b.textContent.includes("⏸"))b.click();try{speechSynthesis.cancel()}catch(e){}return}
  if(/^(devam|devam et|oynat|baslat)$/.test(a)){const b=oku&&oku.querySelector("#dinle");if(b){b.click();return}}
  if(/yardim|komutlar|ne diyebilirim|ne soyleyebilirim/.test(a))return skSoyle(SK_YARDIM);
  if(/^(geri|geri don|kapat|cik|cikis)$/.test(a)){if(oku){oku.querySelector("#kapat").click();return skSoyle("Okuma kapatıldı")}history.back();return skSoyle("Geri dönüldü")}
  if(/(siradaki|sonraki|kacta|ne zaman).*(vakit|ezan|namaz)|(vakit|ezan|namaz).*(kacta|kaldi|ne zaman)/.test(a)){
    if(!S.il)return skSoyle("Önce şehrinizi seçmeniz gerekiyor. Ayarlardan şehir seçebilirsiniz.");
    try{const v=await sonrakiVakit();if(!v)return skSoyle("Vakit bilgisi alınamadı");const dk=Math.round((v.t-new Date())/60000),sa=Math.floor(dk/60);
      return skSoyle(`${VAKIT_AD[v.i][1]} vakti saat ${v.t.getHours()} ${String(v.t.getMinutes()).padStart(2,"0")}. ${sa?sa+" saat ":""}${dk%60} dakika kaldı.`)}catch(e){return skSoyle("Vakit bilgisi alınamadı")}}
  const sesli=/(dinle|oku|okut|baslat|cal)/.test(a),ac=/(^| )(ac|acar|goster|getir)/.test(a);
  if(/c[uü][zs]|(^| )guz/.test(a)){const n=/amme/.test(a)?30:skSayi(t);if(n>=1&&n<=30){if(oku)oku.querySelector("#kapat").click();const cal_=sesli||!ac;skSoyle(`${n}. cüz ${cal_?"okunuyor":"açıldı"}`);okuyucu(n,{dinle:cal_});return}}
  const s=skSureBul(ham);
  if(s){const ad=SURELER[s-1][0];if(oku)oku.querySelector("#kapat").click();
    if(sesli||!ac){skSoyle(`${ad} suresi okunuyor`);okuyucu(sureCuzu(s),{sure:s,dinle:true})}
    else{go("sure-"+s);skSoyle(`${ad} suresi açıldı`)}return}
  for(const [re,v,ad] of SK_SAYFA)if(re.test(t)||re.test(a)){if(oku)oku.querySelector("#kapat").click();go(v);return skSoyle(ad+" açıldı")}
  skSoyle(`Anlayamadım: ${ham}. Komutları duymak için yardım deyin.`)}
let skDinliyor=false,skTanima=null;
function skBasla(){const b=document.getElementById("skMik");
  if(!SK_SR){skSoyle("Bu telefonda sesli komut desteklenmiyor. Google uygulamasının güncel olduğundan emin olun.");toast("Sesli komut bu telefonda desteklenmiyor");return}
  if(skDinliyor){try{skTanima.stop()}catch(e){}return}
  try{speechSynthesis.cancel()}catch(e){}
  try{const au=window.OKU_AU||(window.OKU_AU=new Audio());if(!au.src||au.paused){au.src="data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=";au.play().then(()=>au.pause(),()=>{})}}catch(e){}
  skTanima=new SK_SR();skTanima.lang="tr-TR";skTanima.interimResults=false;skTanima.maxAlternatives=5;
  skTanima.onstart=()=>{skDinliyor=true;b&&b.classList.add("on");b&&b.setAttribute("aria-label","Dinliyorum. Durdurmak için dokunun")};
  skTanima.onend=()=>{skDinliyor=false;b&&b.classList.remove("on");b&&b.setAttribute("aria-label","Sesli komut. Dokunup konuşun")};
  skTanima.onerror=e=>{if(e.error==="not-allowed"||e.error==="service-not-allowed")skSoyle("Mikrofon izni verilmedi. Telefon ayarlarından izin verin.");else if(e.error==="no-speech")skSoyle("Ses duyamadım, tekrar deneyin.")};
  skTanima.onresult=e=>{const r=e.results[0];let en=r[0].transcript;for(let i=0;i<r.length;i++){const x=r[i].transcript,ax=skAn(x);if(/c[uü][zs]|vakit|kible|zikir|hadis|ana sayfa|geri|dur|devam|yardim/.test(ax)||skSureBul(x)){en=x;break}}skKomut(en)};
  try{skTanima.start()}catch(e){}}
function skDugme(){if(document.getElementById("skMik"))return;
  document.body.insertAdjacentHTML("beforeend",`<button id="skMik" class="sk-mik" aria-label="Sesli komut. Dokunup konuşun"><svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z"/></svg></button><div id="skCanli" class="gizli-okunur" aria-live="polite"></div>`);
  document.getElementById("skMik").onclick=skBasla;skGoster()}
function skGoster(){const b=document.getElementById("skMik");if(b)b.classList.toggle("hide",S.sesliKomut===false)}
skDugme();
