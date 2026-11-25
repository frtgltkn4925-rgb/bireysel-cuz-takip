"use strict";
/* ===== Sesli komut (görme engelliler ve eller meşgulken) =====
   Ekrandaki büyük mikrofon düğmesine dokunup konuşulur. Uygulama sayfayı açar ve ne yaptığını sesli söyler. */
const SK_SR=window.SpeechRecognition||window.webkitSpeechRecognition;
const skNorm=t=>String(t||"").toLocaleLowerCase("tr").replace(/[âáà]/g,"a").replace(/[îí]/g,"i").replace(/[ûú]/g,"u").replace(/['’`\-.,!?]/g," ").replace(/\s+/g," ").trim();
const skDuz=t=>skNorm(t).replace(/\s/g,"");
function skBalon(duyulan,cevap){let b=document.getElementById("skBalon");if(!b){b=document.createElement("div");b.id="skBalon";b.className="sk-balon";b.onclick=()=>b.classList.remove("on");document.body.appendChild(b)}
  if(duyulan!=null)b.dataset.d=duyulan;b.innerHTML=`${b.dataset.d?`<small>“${esc(b.dataset.d)}”</small>`:""}${cevap?`<p>${esc(cevap)}</p>`:`<p class="sk-dinle">Anlamaya çalışıyorum…</p>`}`;b.classList.add("on");clearTimeout(skBalon.t);skBalon.t=setTimeout(()=>{b.classList.remove("on");b.dataset.d=""},Math.max(6000,(cevap||"").length*75))}
function skSoyle(metin){const c=document.getElementById("skCanli");if(c)c.textContent=metin;skBalon(null,metin);if(S.sesliCevap===false)return;const ss=window.speechSynthesis;if(!ss)return;try{ss.cancel();const u=new SpeechSynthesisUtterance(metin);u.lang="tr-TR";u.rate=.95;const v=ss.getVoices().find(x=>/^tr/i.test(x.lang));if(v)u.voice=v;ss.speak(u)}catch(e){}}
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
const SK_YARDIM="Şunları sorabilirsiniz. Okuma için: Hangi cüzdeyim. Kaldığım yer. Yasin suresini oku. Beşinci cüzü dinle. Sabır ile ilgili ayetler. Ders programı için: Bugün derslerim ne. Bugün hangi sınıflara giriyorum. Sıradaki dersim ne. Yarın derslerim. Altı F ile ne zaman dersim var. Vakitler için: Namaza kaç dakika var. Akşam ezanı kaçta. Bugünkü vakitler. Hava nasıl. Yarın yağmur var mı. Saat kaç. Bugün ne günü. Sıradaki kandil ne zaman. Günün ayeti. Günün hadisi. Gezinmek için: Bu sayfada ne var. Ana sayfa. Kıble. Geri. Dur.";
const skSaat=hhmm=>{const [h,m]=String(hhmm).split(":").map(Number);return m?`${h} ${String(m).padStart(2,"0")}`:`${h}`};
const skSure_=dk=>{const sa=Math.floor(dk/60),d=dk%60;return (sa?sa+" saat ":"")+(d||!sa?d+" dakika":"")};
const SK_VAKIT=[[/imsak|sabah|sahur/,0],[/gunes|guneş|dogus/,1],[/ogle|cuma namaz/,2],[/ikindi/,3],[/aksam|iftar/,4],[/yatsi/,5]];


/* ----- Hatim / cüz durumu ----- */
function skCuzDurum(a){
  if(!/(hangi cuz|cuzde(yim|yiz)|cuz deyim|cuz de yim|kacinci cuz|kaldigim yer|nerede kaldim|grup cuz|cuzum|benim cuz|hatim|okumam gereken|bugun ne okuyacagim|ne okuyacagim|plan(im|imda|ima))/.test(a))return false;
  const p=[],g=typeof aktifGrup==="function"?aktifGrup():null,d=typeof planDurum==="function"?planDurum():null;let ac=null;
  if(g&&g.ben){p.push(`Grup okumada${g.ad?" "+g.ad+" grubunda":""} bu hafta ${g.ben}. cüz sizde${(S.cuz[g.ben]||{}).d?", okundu olarak işaretli":""}.`);ac=ac||g.ben}
  if(d&&!d.bitti){const k=sayfaCuzu(d.bas);p.push(`Okuma planınıza göre ${k}. cüzdesiniz. Bugün ${d.bas}. sayfadan ${d.son}. sayfaya kadar okumanız gerekiyor.`);ac=ac||k}
  else if(d&&d.bitti)p.push("Okuma planınızdaki hatmi tamamladınız. Allah kabul etsin.");
  if(S.son)p.push(`Kaldığınız yer olarak ${SURELER[S.son.s-1][0]} suresi ${S.son.a}. ayet işaretli.`);
  const okunan=Object.keys(S.cuz||{}).filter(k=>S.cuz[k]&&S.cuz[k].d).length;
  if(okunan){let sir=1;while(sir<=30&&(S.cuz[sir]||{}).d)sir++;p.push(`Hatimde 30 cüzden ${okunan} tanesi okundu.${sir<=30?` Sıradaki okunmamış cüz ${sir}. cüz.`:" Hatim tamamlandı."}`);ac=ac||(sir<=30?sir:null)}
  if(!p.length){skSoyle("Henüz bir okuma planınız, grubunuz ya da işaretli bir yeriniz yok. Bir cüz okumak için, örneğin, beşinci cüzü oku diyebilirsiniz.");return true}
  if(/(oku|dinle|ac|baslat)/.test(a)&&ac){p.push(`${ac}. cüz okunuyor.`);skSoyle(p.join(" "));okuyucu(ac,{dinle:true});return true}
  if(ac)p.push(`Okumak için ${ac}. cüzü oku diyebilirsiniz.`);
  skSoyle(p.join(" "));return true}
/* ----- Sayfayı anlatma ----- */
const SK_ALT="Ekranın en altında altı sekme var, soldan sağa: Bugün, Kur'an, Grup, Vakitler, Zikir ve Kitaplık. Mikrofon düğmesi sağ alt köşede, sekmelerin hemen üstünde.";
const SK_SAYFA_ANLAT={
  home:"Ana sayfadasınız. En üstte selamlama, tarih ve sıradaki namaz vaktine kalan süre, altında günün altı vakti var. Sonra sekiz kısayol geliyor: Kur'an, Kıble, Grup, Zikirmatik, Hatim planı, İmsakiye, Kitaplık ve Ekran resmi. Aşağıda öğretmen ders programı, grup okuma, okuma planı, günün ayeti, yaklaşan dini gün ve günün hadisi var.",
  kuran:"Kur'an sayfasındasınız. Üstte üç düğme var: Sureler, Cüzler ve Konu ara. Altında sure arama kutusu ve 114 surenin listesi var. Sesli olarak, örneğin, Yasin suresini oku diyebilirsiniz.",
  cuz:"Hatim ve plan sayfasındasınız. Otuz cüzün listesi, hatim durumu ve okuma planı burada. Bir cüz okumak için, örneğin, on beşinci cüzü oku deyin.",
  konu:"Kur'an'da konu arama sayfasındasınız. Bir konu söylediğinizde ilgili ayetler alt alta sıralanır. Örneğin, sabır ile ilgili ayetler deyin.",
  vakit:"Namaz vakitleri sayfasındasınız. En üstte sıradaki vakte kalan süre ve günün vakitleri, altında ezan aboneliği ve aylık imsakiye tablosu var. Namaza kaç dakika var diye sorabilirsiniz.",
  zikir:"Zikir sayfasındasınız. Zikirmatik, namaz tesbihatı ve Cevşen burada.",
  kitaplik:"Kitaplık sayfasındasınız. Siyer, peygamberler, sahabeler, hadis ansiklopedisi ve sahih hadisler var. Altında telefonunuza eklediğiniz PDF kitaplar listelenir.",
  grup:"Grup okuma sayfasındasınız. Grubunuzun otuz cüzü, bu haftaki cüzünüz ve okudum düğmesi burada. Hangi cüzdeyim diye sorabilirsiniz.",
  ogretmen:"Öğretmen ders programı sayfasındasınız. Üstte bugünün özeti, altında fotoğraf çek ve galeriden seç düğmeleri, gün seçimi ve sekiz ders saatlik tablo var. Bugün derslerim ne diye sorabilirsiniz.",
  hadisler:"Hadis ansiklopedisi sayfasındasınız. Hadisler konulara göre ayrılmış; bir konu seçince o konudaki hadisler listelenir.",
  kible:"Kıble pusulası sayfasındasınız. Ortada büyük bir pusula ve altında başlat düğmesi var. Telefonu yere paralel tutup yavaşça dönün; kıbleye döndüğünüzde telefon titrer.",
  duvar:"Telefon ekranı sayfasındasınız. Üstte duvar kâğıdı önizlemesi, altında namaz vakitlerini ekle kutusu, duvar kâğıdı yap ve galeriye kaydet düğmeleri, stil ve tema seçimleri var.",
  ayarlar:"Ayarlar sayfasındasınız. Şehir, okuma planı, tema, yazı boyutu, internetsiz kullanım, açılış ve sesli komut ayarları burada.",
  hava:"Hava durumu sayfasındasınız. Hava nasıl diye sorarsanız sesli olarak söylerim.",
  gunler:"Dini günler sayfasındasınız. Yaklaşan kandiller ve bayramlar tarihleriyle listeleniyor.",
  siyer:"Siyer sayfasındasınız. Peygamber Efendimizin hayatı bölüm bölüm anlatılıyor.",
  kayit:"Kaydettikleriniz sayfasındasınız. Kaydettiğiniz ayet ve hadisler burada."};
function skSayfaAnlat(){const v=document.querySelector(".oku")?"oku":cur.v;
  if(v==="oku")return "Okuma ekranındasınız. Üstte geri düğmesi, sure adı ve sayfa bilgisi var. Altta oynat düğmesi, hafız seçimi, otomatik kaydırma ve cüzü okudum düğmesi bulunuyor. Dur, devam ya da geri diyebilirsiniz.";
  if(v==="sure")return `${(document.querySelector("#ttl")||{}).textContent||"Sure"} sayfasındasınız. Ayetler Arapça ve mealiyle alt alta sıralanmış. Dinlemek için bu sureyi oku deyin. ${SK_ALT}`;
  return `${SK_SAYFA_ANLAT[v]||((document.querySelector("#ttl")||{}).textContent||"Bu")+" sayfasındasınız."} ${SK_ALT}`}
/* ----- Ders programı soruları ----- */
const SK_GUNLER=[["pazartesi",0],["sali",1],["carsamba",2],["persembe",3],["cuma",4]];
function skDersGun(a){if(/yarin/.test(a)){const g=new Date();g.setDate(g.getDate()+1);const d=g.getDay();return{gi:d>=1&&d<=5?d-1:-1,ad:"Yarın",hs:d===0||d===6}}
  if(/cumartesi|pazar(?!tesi)/.test(a))return{gi:-1,ad:/cumartesi/.test(a)?"Cumartesi":"Pazar",hs:true};
  const g=SK_GUNLER.find(([k])=>new RegExp("(^| )"+k).test(a));if(g)return{gi:g[1],ad:DP_GUN[g[1]],hs:false};
  const b=dpBugun();return{gi:b,ad:"Bugün",hs:b<0,bugun:true}}
function skSinifAra(a){const m=a.match(/(^| )(\d{1,2}|bes|alti|yedi|sekiz)\s*\/?\s*-?\s*([a-h])(?= |$)/);if(!m)return null;const n={bes:5,alti:6,yedi:7,sekiz:8}[m[2]]||+m[2];return (n+"/"+m[3]).toLocaleUpperCase("tr")}
const skDersAd=c=>`${c.s?c.s+" ":""}${(c.d||"ders").toLocaleLowerCase("tr")}`;
function skDersListe(gi){const D=dpVeri(),out=[];let son=null;
  D.gun[gi].forEach((c,i)=>{if(!dpDolu(c))return;const anahtar=(c.s||"")+"|"+(c.d||"");if(son&&son.anahtar===anahtar&&son.bit===i-1){son.bit=i;return}son={anahtar,bas:i,bit:i,c};out.push(son)});
  return out.map(g=>`${g.bas===g.bit?g.bas+1+". ders":g.bas+1+". ve "+(g.bit+1)+". dersler"}, saat ${skSaat(D.saat[g.bas][0])}: ${skDersAd(g.c)}`)}
function skDers(a){
  if(!/(ders|sinif|sinifa|sinifim|bos saat|bos dersim|teneffus|okula|okul kacta)/.test(a)&&!(/(kacta bit|ne zaman bit|kacta basl|ne zaman basl|okul)/.test(a)))return false;
  if(/program\w* (ac|goster)|ders programi$/.test(a)&&!/(ne|hangi|kac|neler)/.test(a)){go("ogretmen");skSoyle("Ders programınız açıldı.");return true}
  if(!S.ders||!S.ders.gun||!S.ders.gun.some(g=>g.some(dpDolu))){go("ogretmen");skSoyle("Henüz ders programı girmediniz. Ders programı sayfası açıldı; programınızın fotoğrafını çekerek ekleyebilirsiniz.");return true}
  const D=dpVeri(),sinif=skSinifAra(a);
  if(sinif){const l=[];D.gun.forEach((g,gi)=>g.forEach((c,i)=>{if((c.s||"").toLocaleUpperCase("tr")===sinif)l.push(`${DP_GUN[gi]} ${i+1}. ders, saat ${skSaat(D.saat[i][0])}`)}));go("ogretmen");
    skSoyle(l.length?`${sinif} sınıfıyla haftada ${l.length} dersiniz var: ${l.join("; ")}.`:`Programınızda ${sinif} sınıfı bulunamadı.`);return true}
  const {gi,ad,hs,bugun}=skDersGun(a);
  if(hs||gi<0){skSoyle(`${ad} hafta sonu, dersiniz yok.`);return true}
  go("ogretmen-"+gi);const l=dpGunDersleri(gi),gunAd=bugun?`Bugün ${DP_GUN[gi].toLocaleLowerCase("tr")}`:ad;
  if(!l.length){skSoyle(`${gunAd} dersiniz yok.`);return true}
  if(bugun&&/(simdi|su an|su anda|hangi dersteyim|neredeyim)/.test(a)){const sl=dpSlotAkt();
    if(!sl){skSoyle("Bugünkü dersleriniz bitti.");return true}
    const c=D.gun[gi][sl.i];
    if(sl.tur==="simdi"&&dpDolu(c)){skSoyle(`Şu an ${sl.i+1}. ders: ${skDersAd(c)}. Bitiş saati ${skSaat(D.saat[sl.i][1])}.`);return true}
    const sm=dpSimdi();skSoyle(`${sl.tur==="simdi"?"Şu an boş saatiniz.":"Şu an ders saati değil."}${sm&&sm.c?` Sıradaki dersiniz ${skDersAd(sm.c)}, saat ${skSaat(sm.c.bas)}.`:" Bugün başka dersiniz yok."}`);return true}
  if(bugun&&/(siradaki|sonraki|bir sonraki|gelecek ders)/.test(a)){const sm=dpSimdi();
    if(!sm||!sm.c){skSoyle("Bugün başka dersiniz kalmadı.");return true}
    const dk=(()=>{const [h,m]=sm.c.bas.split(":").map(Number),n=new Date();return h*60+m-(n.getHours()*60+n.getMinutes())})();
    skSoyle(`${sm.tur==="simdi"?"Şu anki dersiniz":"Sıradaki dersiniz"} ${sm.c.i+1}. ders: ${skDersAd(sm.c)}, saat ${skSaat(sm.c.bas)}${sm.tur==="sonraki"&&dk>0?`. ${skSure_(dk)} sonra başlıyor`:""}.`);return true}
  if(/bos/.test(a)){const b=[];D.saat.forEach((z,i)=>{if(i<=l[l.length-1].i&&i>=l[0].i&&!dpDolu(D.gun[gi][i]))b.push(`${i+1}. ders, saat ${skSaat(z[0])}`)});
    skSoyle(b.length?`${gunAd} boş saatleriniz: ${b.join("; ")}.`:`${gunAd} derslerinizin arasında boş saatiniz yok.`);return true}
  if(/(kacta bit|ne zaman bit|son ders|kacta cik)/.test(a)){const s=l[l.length-1];skSoyle(`${gunAd} son dersiniz ${s.i+1}. ders, ${skDersAd(s)}. Bitiş saati ${skSaat(s.bit)}.`);return true}
  if(/(kacta basl|ilk ders|ne zaman basl|okula kacta)/.test(a)){const s=l[0];skSoyle(`${gunAd} ilk dersiniz ${s.i+1}. ders, ${skDersAd(s)}. Başlangıç saati ${skSaat(s.bas)}.`);return true}
  const siniflar=[...new Set(l.map(c=>c.s).filter(Boolean))];
  if(/(hangi sinif|sinif)/.test(a)&&siniflar.length){skSoyle(`${gunAd} ${siniflar.join(", ")} sınıflarına giriyorsunuz. Toplam ${l.length} ders. ${skDersListe(gi).join(". ")}.`);return true}
  skSoyle(`${gunAd} ${l.length} dersiniz var, saat ${skSaat(l[0].bas)} ile ${skSaat(l[l.length-1].bit)} arası. ${skDersListe(gi).join(". ")}.`);return true}
async function skBilgi(a){
  if(/(bu sayfa|neredeyim|hangi sayfa|ekrani anlat|ekranda ne|sayfayi anlat|sayfada ne|burada ne|neler var|ne yapabilirim)/.test(a)){skSoyle(skSayfaAnlat());return true}
  if(/(mikrofon nerede|dugme nerede|nasil kullan)/.test(a)){skSoyle(SK_REHBER.replace("Bireysel Cüz Takip açıldı. ",""));return true}
  if(skCuzDurum(a))return true;
  if(skDers(a))return true;
  const vakitSoru=/(namaz|vakit|ezan|imsak|sabah|ogle|ikindi|aksam|yatsi|iftar|sahur)/.test(a),zamanSoru=/(kac|ne zaman|kaldi|saat|var mi|ne kadar|siradaki|sonraki|bugunku|bugun)/.test(a);
  if(vakitSoru&&(zamanSoru||/vakitler/.test(a))){
    if(!S.il){skSoyle("Önce şehrinizi seçmeniz gerekiyor.");ilSec();return true}
    try{const now=new Date(),bug=await vakitGun(now);if(!bug){skSoyle("Vakit bilgisi alınamadı.");return true}go("vakit");
      if(/bugunku|hepsi|tum|butun|vakitler/.test(a)&&!/siradaki|sonraki|kac/.test(a)){skSoyle(`${S.il.ad} için bugünkü vakitler: `+VAKIT_AD.map(([,n],i)=>`${n} ${skSaat(bug[i+1])}`).join(", ")+".");return true}
      const ozel=SK_VAKIT.find(([re])=>re.test(a));
      if(ozel&&!/^(namaz|vakit)/.test(a.replace(/[^a-z ]/g,""))){const i=ozel[1];let t=saatDate(now,bug[i+1]),gun="Bugün";
        if(t<now){const y=new Date(now);y.setDate(y.getDate()+1);const yb=await vakitGun(y).catch(()=>null);if(yb){t=saatDate(y,yb[i+1]);gun="Yarın"}}
        const dk=Math.round((t-now)/60000);skSoyle(`${gun} ${VAKIT_AD[i][1].toLocaleLowerCase("tr")} vakti saat ${skSaat(`${t.getHours()}:${t.getMinutes()}`)}. ${skSure_(dk)} kaldı.`);return true}
      const v=await sonrakiVakit();if(!v){skSoyle("Vakit bilgisi alınamadı.");return true}
      const dk=Math.round((v.t-now)/60000);skSoyle(`${VAKIT_AD[v.i][1]} vaktine ${skSure_(dk)} var. Vakit saat ${skSaat(`${v.t.getHours()}:${v.t.getMinutes()}`)}.`);return true}
    catch(e){skSoyle("Vakit bilgisi alınamadı. İnternet bağlantınızı kontrol edin.");return true}}
  if(/(hava|yagmur|kar |kar$|sicaklik|derece|soguk|sicak|semsiye|ruzgar)/.test(a)){
    if(!S.il){skSoyle("Hava durumu için önce şehrinizi seçmeniz gerekiyor.");ilSec();return true}
    try{const d=await havaAl(),c=d.current,dl=d.daily;go("hava");const yarin=/yarin/.test(a),i=yarin?1:0;
      const yag=dl.precipitation_probability_max[i],mx=Math.round(dl.temperature_2m_max[i]),mn=Math.round(dl.temperature_2m_min[i]);
      let m=yarin?`Yarın ${S.il.ad} için hava ${havaAd(dl.weather_code[1])[0].toLocaleLowerCase("tr")}. En yüksek ${mx}, en düşük ${mn} derece.`
        :`${S.il.ad} için şu an ${Math.round(c.temperature_2m)} derece, hava ${havaAd(c.weather_code)[0].toLocaleLowerCase("tr")}. Hissedilen ${Math.round(c.apparent_temperature)} derece. Bugün en yüksek ${mx}, en düşük ${mn} derece.`;
      m+=yag!=null?` Yağış ihtimali yüzde ${yag}.`:"";if(yag>=50)m+=" Dışarı çıkarken şemsiye almayı unutmayın.";if((yarin?mn:c.apparent_temperature)<=0)m+=" Hava çok soğuk, sıkı giyinin.";
      if(!yarin&&c.wind_speed_10m>=30)m+=` Rüzgâr kuvvetli, saatte ${Math.round(c.wind_speed_10m)} kilometre.`;skSoyle(m);return true}
    catch(e){skSoyle("Hava durumu alınamadı. İnternet bağlantınızı kontrol edin.");return true}}
  if(/saat kac|saat ne/.test(a)){const n=new Date();skSoyle(`Saat ${n.getHours()} ${String(n.getMinutes()).padStart(2,"0")}.`);return true}
  if(/(bugun ne gun|bugun gunlerden|tarih|hicri|ayin kaci|bugun hangi gun)/.test(a)){const n=new Date();skSoyle(`Bugün ${n.toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric",weekday:"long"})}. Hicri takvime göre ${hicriYaz(n)}.`);return true}
  if(/(kandil|bayram|dini gun|ramazan|arefe|asure|mevlid|regaib|mirac|berat|kadir gece)/.test(a)){
    const l=diniGunler(),bug=new Date();bug.setHours(0,0,0,0);
    const tr=a.match(/regaib|mirac|berat|kadir|ramazan bayram|kurban bayram|ramazan|arefe|asure|mevlid/),ara=tr?l.find(x=>skAn(x.ad).includes(tr[0])):l.find(x=>/kandil/.test(a)?x.kandil:true);
    go("gunler");if(!ara){skSoyle("Yaklaşan dini gün bulunamadı.");return true}
    const g=Math.round((ara.d-bug)/864e5);skSoyle(`${ara.ad}: ${ara.d.toLocaleDateString("tr-TR",{day:"numeric",month:"long",weekday:"long"})}. ${g===0?"Bugün.":g===1?"Yarın.":g+" gün kaldı."}`);return true}
  if(/gunun ayet|bugunun ayet/.test(a)){const d=GUNLUK[dayIdx()%GUNLUK.length];skSoyle(`Günün ayeti, ${d.k}: ${d.m}`);return true}
  if(/gunun hadis|bugunun hadis/.test(a)){const h=HADISLER[dayIdx()%HADISLER.length];skSoyle(`Günün hadisi: ${h.m} ${String(h.s||"").split(";")[0]}.`);return true}
  if(/kible|pusula/.test(a)){go("kible");skSoyle("Kıble pusulası açıldı. Ekrandaki başlat düğmesine dokunun, telefonu yere paralel tutun ve yavaşça dönün. Kıbleye döndüğünüzde telefon titrer.");return true}
  if(/(hatim|plan|bugun ne kadar|kac sayfa)/.test(a)&&typeof planDurum==="function"){const d=planDurum();go("cuz");
    skSoyle(d?`Okuma planınıza göre bugün günde ${d.gunluk} sayfa okumanız gerekiyor.`:"Henüz bir okuma planı kurmadınız. Hatim ve plan sayfası açıldı.");return true}
  return false}
async function skKomut(ham){const t=skNorm(ham);if(!t)return;const a=skAn(ham);
  const oku=document.querySelector(".oku");
  if(/^(dur|durdur|sus|bekle|kapat ses)/.test(a)){const b=oku&&oku.querySelector("#dinle");if(b&&b.textContent.includes("⏸"))b.click();try{speechSynthesis.cancel()}catch(e){}return}
  if(/^(devam|devam et|oynat|baslat)$/.test(a)){const b=oku&&oku.querySelector("#dinle");if(b){b.click();return}}
  if(/yardim|komutlar|ne diyebilirim|ne soyleyebilirim/.test(a))return skSoyle(SK_YARDIM);
  if(/^(geri|geri don|kapat|cik|cikis)$/.test(a)){if(oku){oku.querySelector("#kapat").click();return skSoyle("Okuma kapatıldı")}history.back();return skSoyle("Geri dönüldü")}
  {const m=t.match(/^(.+?)\s+(ile ilgili|hakkında|hakkindaki|hakkındaki|konulu|geçen|gecen)\s+(ayetler|ayetleri|ayet)/)||t.match(/^(?:kuranda|kur an da|kur anda)\s+(.+?)(?:\s+(?:ara|konusu|ayetleri))?$/);
    if(m){const k=m[1].trim();if(oku)oku.querySelector("#kapat").click();go("konu-"+encodeURIComponent(k));skSoyle(`Kur'an'da ${k} konusu aranıyor.`);return}}
  const cevap=await skBilgi(a);if(cevap)return;
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
  skTanima.onstart=()=>{skDinliyor=true;try{navigator.vibrate&&navigator.vibrate(40)}catch(e){}skBalon("","Dinliyorum…");b&&b.classList.add("on");b&&b.setAttribute("aria-label","Dinliyorum. Durdurmak için dokunun")};
  skTanima.onend=()=>{skDinliyor=false;b&&b.classList.remove("on");b&&b.setAttribute("aria-label","Sesli komut. Dokunup konuşun")};
  skTanima.onerror=e=>{if(e.error==="not-allowed"||e.error==="service-not-allowed")skSoyle("Mikrofon izni verilmedi. Telefon ayarlarından izin verin.");else if(e.error==="no-speech")skSoyle("Ses duyamadım, tekrar deneyin.")};
  skTanima.onresult=e=>{const r=e.results[0];let en=r[0].transcript;for(let i=0;i<r.length;i++){const x=r[i].transcript,ax=skAn(x);if(/c[uü][zs]|vakit|kible|zikir|hadis|ana sayfa|geri|dur|devam|yardim/.test(ax)||skSureBul(x)){en=x;break}}try{navigator.vibrate&&navigator.vibrate([20,40,20])}catch(e){}skBalon(en,"");skKomut(en)};
  try{skTanima.start()}catch(e){}}
function skDugme(){if(document.getElementById("skMik"))return;
  document.body.insertAdjacentHTML("beforeend",`<button id="skMik" class="sk-mik" aria-label="Sesli komut. Dokunup konuşun"><svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.92V21h2v-3.08A7 7 0 0 0 19 11h-2z"/></svg></button><div id="skCanli" class="gizli-okunur" aria-live="polite"></div>`);
  document.getElementById("skMik").onclick=skBasla;skGoster()}
function skGoster(){const b=document.getElementById("skMik");if(b)b.classList.toggle("hide",S.sesliKomut===false)}
skDugme();

/* ----- Görme engelliler için açılış rehberi ----- */
const SK_REHBER="Bireysel Cüz Takip açıldı. Sesli komut için mikrofon düğmesi ekranın sağ alt köşesinde, alt menünün hemen üstünde. Ona bir kez dokunun, titreşimi hissedince konuşun. Neler söyleyebileceğinizi öğrenmek için yardım, bulunduğunuz sayfayı dinlemek için bu sayfada ne var deyin.";
function skRehber(){if(S.sesliRehber===false||S.sesliKomut===false)return;
  const c=document.getElementById("skCanli");
  const soyle=()=>{if(document.querySelector(".acilis"))return false;if(c)c.textContent=SK_REHBER;try{const ss=window.speechSynthesis;if(!ss)return true;ss.cancel();const u=new SpeechSynthesisUtterance(SK_REHBER);u.lang="tr-TR";u.rate=.95;const v=ss.getVoices().find(x=>/^tr/i.test(x.lang));if(v)u.voice=v;let bas=false;u.onstart=()=>{bas=true};ss.speak(u);setTimeout(()=>{if(!bas)ilkDokunus()},1200)}catch(e){}return true};
  const ilkDokunus=()=>{const f=()=>{document.removeEventListener("pointerdown",f,true);setTimeout(()=>{if(!skDinliyor)soyle()},400)};document.addEventListener("pointerdown",f,true)};
  let n=0;const bekle=setInterval(()=>{if(soyle()||++n>40)clearInterval(bekle)},500)}
setTimeout(skRehber,1200);
// TalkBack kullananlar için sayfa değişince sayfa adını bildir
window.addEventListener("hashchange",()=>{const c=document.getElementById("skCanli");if(c&&S.sesliRehber!==false)setTimeout(()=>{c.textContent=((document.querySelector("#ttl")||{}).textContent||"")+" sayfası"},300)});
