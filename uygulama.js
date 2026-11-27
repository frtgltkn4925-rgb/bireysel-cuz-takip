"use strict";
/* ============ EK VERİ ============ */
const GUNLUK=[
 {a:"اَلَا بِذِكْرِ اللّٰهِ تَطْمَئِنُّ الْقُلُوبُ",m:"Bilesiniz ki kalpler ancak Allah'ı anmakla huzur bulur.",k:"Ra'd 13:28",s:13,n:28},
 {a:"فَاِنَّ مَعَ الْعُسْرِ يُسْرًاۙ اِنَّ مَعَ الْعُسْرِ يُسْرًا",m:"Şüphesiz zorlukla beraber bir kolaylık vardır. Evet, zorlukla beraber bir kolaylık vardır.",k:"İnşirâh 94:5-6",s:94,n:5},
 {a:"فَاذْكُرُون۪ٓي اَذْكُرْكُمْ وَاشْكُرُوا ل۪ي وَلَا تَكْفُرُونِ",m:"Siz beni anın ki ben de sizi anayım. Bana şükredin, nankörlük etmeyin.",k:"Bakara 2:152",s:2,n:152},
 {a:"لَا يُكَلِّفُ اللّٰهُ نَفْسًا اِلَّا وُسْعَهَا",m:"Allah hiç kimseye gücünün yeteceğinden fazlasını yüklemez.",k:"Bakara 2:286",s:2,n:286},
 {a:"رَبِّ زِدْن۪ي عِلْمًا",m:"Rabbim! İlmimi artır.",k:"Tâhâ 20:114",s:20,n:114},
 {a:"لَا تَقْنَطُوا مِنْ رَحْمَةِ اللّٰهِ",m:"Allah'ın rahmetinden ümidinizi kesmeyin.",k:"Zümer 39:53",s:39,n:53},
 {a:"رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَان۪ي صَغ۪يرًا",m:"Rabbim! Onlar beni küçükken nasıl yetiştirdilerse sen de onlara öyle merhamet et.",k:"İsrâ 17:24",s:17,n:24},
 {a:"اِنَّ اللّٰهَ مَعَ الصَّابِر۪ينَ",m:"Şüphesiz Allah sabredenlerle beraberdir.",k:"Bakara 2:153",s:2,n:153},
 {a:"اِنَّ الصَّلٰوةَ تَنْهٰى عَنِ الْفَحْشَٓاءِ وَالْمُنْكَرِ",m:"Şüphesiz namaz hayâsızlıktan ve kötülükten alıkoyar.",k:"Ankebût 29:45",s:29,n:45},
 {a:"اِنَّمَا الْمُؤْمِنُونَ اِخْوَةٌ",m:"Müminler ancak kardeştirler.",k:"Hucurât 49:10",s:49,n:10},
 {a:"وَمَنْ يَتَوَكَّلْ عَلَى اللّٰهِ فَهُوَ حَسْبُهُ",m:"Kim Allah'a tevekkül ederse O, ona yeter.",k:"Talâk 65:3",s:65,n:3},
 {a:"اُدْعُون۪ٓي اَسْتَجِبْ لَكُمْ",m:"Bana dua edin, size karşılık vereyim.",k:"Mü'min 40:60",s:40,n:60},
 {a:"وَاِذَا سَاَلَكَ عِبَاد۪ي عَنّ۪ي فَاِنّ۪ي قَر۪يبٌ",m:"Kullarım sana beni sorduklarında, bilsinler ki ben çok yakınım.",k:"Bakara 2:186",s:2,n:186},
 {a:"قُلْ هُوَ اللّٰهُ اَحَدٌۚ اَللّٰهُ الصَّمَدُۚ لَمْ يَلِدْ وَلَمْ يُولَدْۙ وَلَمْ يَكُنْ لَهُ كُفُوًا اَحَدٌ",m:"De ki: O, Allah'tır, birdir. Allah Samed'dir. Doğurmamış ve doğurulmamıştır. Hiçbir şey O'na denk değildir.",k:"İhlâs 112:1-4",s:112,n:1}
];
const TEMALAR=[["cini","Çini","#173a6b","#1f6f8b"],["tezhip","Tezhip","#5e1520","#8a2a35"],["zumrut","Zümrüt","#0b3d31","#17765c"],["gece","Gece","#0b1424","#1d3557"],["sepya","Sepya","#4a3622","#7a5a36"],["sade","Sade","#2e3a46","#4a5a68"]];

/* ============ YARDIMCILAR ============ */
const $=s=>document.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const uid36=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const trDate=t=>new Date(t).toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"});
const trTime=t=>new Date(t).toLocaleString("tr-TR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});
const dayIdx=()=>Math.floor((Date.now()+3*3600e3)/864e5);
const slug=s=>String(s).toLocaleLowerCase("tr").normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/ı/g,"i").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
function toast(m,ms=2600){document.querySelectorAll(".toast").forEach(x=>x.remove());const d=document.createElement("div");d.className="toast";d.setAttribute("role","status");d.textContent=m;document.body.appendChild(d);setTimeout(()=>d.remove(),ms)}
const IC={
 bell:'<path d="M6 16V11a6 6 0 0112 0v5l2 2H4z"/><path d="M10 20a2 2 0 004 0"/>',
 home:'<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>',
 quran:'<path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v14c-3-1-6-1-8 1-2-2-5-2-8-1z"/><path d="M12 6v14"/>',
 hadis:'<path d="M4 4h12a4 4 0 014 4v12H8a4 4 0 01-4-4z"/><path d="M8 9h8M8 13h6"/>',
 books:'<path d="M4 4h4v16H4zM10 4h4v16h-4z"/><path d="M16 5l4 1-3 14-4-1z"/>',
 ai:'<path d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 16l-1.8-4.8L6 9.4l4.2-1.8z"/><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
 risale:'<path d="M6 3h11v18H6a2 2 0 01-2-2V5a2 2 0 012-2z"/><path d="M8 7h6M8 11h6"/>',
 cevsen:'<rect x="6" y="6" width="12" height="12"/><rect x="6" y="6" width="12" height="12" transform="rotate(45 12 12)"/>',
 tesbih:'<circle cx="12" cy="5" r="2"/><circle cx="17" cy="8" r="2"/><circle cx="18" cy="14" r="2"/><circle cx="14" cy="19" r="2"/><circle cx="7" cy="8" r="2"/><circle cx="6" cy="14" r="2"/>',
 cuz:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M10 4v16"/>',
 group:'<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M16 15c3 0 5 2 5 4"/>',
 pdf:'<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6"/>',
 slides:'<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
 link:'<path d="M10 14a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1"/><path d="M14 10a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1"/>',
 send:'<path d="M4 12l16-8-6 16-2-6z"/>',
 dl:'<path d="M12 4v12M7 11l5 5 5-5M5 20h14"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-2.7 1.1V21a2 2 0 01-4 0v-.1A1.6 1.6 0 007.4 19.4l-.1.1a2 2 0 11-2.8-2.8l.1-.1A1.6 1.6 0 003.5 14H3a2 2 0 010-4h.1A1.6 1.6 0 004.6 7.4l-.1-.1a2 2 0 112.8-2.8l.1.1A1.6 1.6 0 0010 3.5V3a2 2 0 014 0v.1a1.6 1.6 0 002.6 1.4l.1-.1a2 2 0 112.8 2.8l-.1.1A1.6 1.6 0 0020.5 10H21a2 2 0 010 4h-.1a1.6 1.6 0 00-1.5 1z"/>',
 bm:'<path d="M6 3h12v18l-6-4-6 4z"/>',
 pin:'<path d="M12 21s-7-6-7-11a7 7 0 0114 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
 phone:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
 copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 012-2h8"/>',
 chev:'<path d="M9 6l6 6-6 6"/>',
 moon:'<path d="M20 14A8 8 0 1110 4a6 6 0 0010 10z"/>',
 kible:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
 qibla:'<path d="M5 9l7-4 7 4v9H5z"/><path d="M5 12h14"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>'
};
const ic=(n,s=20)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||""}</svg>`;
function loadScript(src){return new Promise((res,rej)=>{if(document.querySelector(`script[src="${src}"]`))return res();const s=document.createElement("script");s.src=src;s.onload=res;s.onerror=()=>rej(new Error("Yüklenemedi"));document.head.appendChild(s)})}
/* Telefonun geri tuşu: açık pencereyi ya da okuma ekranını kapatsın, sayfadan çıkmasın */
const KATMAN=[];let katmanNo=0;
function katmanAc(el,kapat){const id=++katmanNo,k={id,el,kapat};KATMAN.push(k);
  try{const st=history.state;if(st&&st.gec)history.replaceState({katman:id},"",location.href);else history.pushState({katman:id},"",location.href)}catch(e){}
  return ()=>{const i=KATMAN.indexOf(k);if(i<0)return;KATMAN.splice(i,1);try{if(history.state&&history.state.katman===id)history.replaceState({gec:1},"",location.href)}catch(e){}}}
window.addEventListener("popstate",()=>{
  while(KATMAN.length&&!KATMAN[KATMAN.length-1].el.isConnected)KATMAN.pop();
  const st=history.state||{},ust=KATMAN.pop();
  if(ust){try{ust.kapat(true)}catch(e){}}
  const acik=st.katman&&KATMAN.some(k=>k.id===st.katman);
  if(st.katman&&!acik){try{history.replaceState({gec:1},"",location.href)}catch(e){}}
  else if(!ust&&st.gec)history.back()});
function sheet(html,onMount){const bg=document.createElement("div");bg.className="sheet-bg";bg.innerHTML=`<div class="sheet" role="dialog">${html}</div>`;
  let birak=null;const close=()=>{bg.remove();birak&&birak()};
  bg.addEventListener("click",e=>{if(e.target===bg)close()});document.body.appendChild(bg);birak=katmanAc(bg,()=>bg.remove());onMount&&onMount(bg.firstChild,close);return close}
function confirmSheet(title,body,okText,fn){sheet(`<h3>${esc(title)}</h3><p class="muted">${esc(body)}</p><div class="row" style="gap:8px"><button class="btn red" id="y">${esc(okText)}</button><button class="btn ghost" id="n">Vazgeç</button></div>`,(sh,close)=>{sh.querySelector("#n").onclick=close;sh.querySelector("#y").onclick=()=>{close();fn()}})}

/* ============ KAYIT ============ */
const LK="nurokuma.v1";
const DEF={sesliRehber:true,wpVakit:true,acilis:true,sesliKomut:true,sesliCevap:true,gruplar:[],aktifGrup:null,adim:"",t:0,cuz:{},hatim:0,hatimLog:[],lib:[],cevsen:{},son:null,afs:30,tesbih:{},tema:"zumrut",meal:true,okunus:false,fav:[],plan:null,tesbihToplam:{},il:null,okuSaat:"21:00",okunanSayfa:0,zikir:{},cevsenB:{}};
let S=structuredClone(DEF);
try{const l=JSON.parse(localStorage.getItem(LK)||"null");if(l)S=Object.assign(structuredClone(DEF),l)}catch(e){}
const IDB={db:null,open(){return this.db?Promise.resolve(this.db):new Promise((res,rej)=>{const r=indexedDB.open("nurpdf",1);r.onupgradeneeded=()=>r.result.createObjectStore("f");r.onsuccess=()=>{this.db=r.result;res(r.result)};r.onerror=()=>rej(r.error)})},
 async put(k,v){const d=await this.open();return new Promise((res,rej)=>{const t=d.transaction("f","readwrite");t.objectStore("f").put(v,k);t.oncomplete=res;t.onerror=()=>rej(t.error)})},
 async get(k){const d=await this.open();return new Promise((res,rej)=>{const r=d.transaction("f").objectStore("f").get(k);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})},
 async del(k){const d=await this.open();return new Promise(res=>{const t=d.transaction("f","readwrite");t.objectStore("f").delete(k);t.oncomplete=res;t.onerror=res})}};
function indir(blob,name){const u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),60000);return true}
function applyTheme(){document.documentElement.dataset.theme=S.tema||"cini";const t=TEMALAR.find(x=>x[0]===S.tema)||TEMALAR[0];document.querySelector('meta[name="theme-color"]').content=t[2]}
applyTheme();
function save(){S.t=Date.now();try{localStorage.setItem(LK,JSON.stringify(S))}catch(e){}}
/* ============ YÖNLENDİRME ============ */
let cur={v:"home",p:null};
const TABS=[["home","Bugün","home"],["kuran","Kur'an","quran"],["grup","Grup","group"],["vakit","Vakitler","clock"],["zikir","Zikir","tesbih"],["kitaplik","Kitaplık","books"]];
const TITLES={home:"Bireysel Cüz Takip",hatim:"Hatim Grubu",kuran:"Kur'an-ı Kerîm",sure:"",cuz:"Hatim ve Plan",hadis:"Sahih Hadisler",cevsen:"Cevşen-ül Kebîr",tesbihat:"Namaz Tesbihatı",kitaplik:"Kitaplık",pdf:"",ayarlar:"Ayarlar",kayit:"Kaydettiklerim",duvar:"Telefon Ekranı",vakit:"Namaz Vakitleri",zikir:"Zikir",gunler:"Dini Günler",siyer:"Siyer-i Nebî",peygamber:"Peygamberler",sahabe:"Sahabeler",hava:"Hava Durumu",grup:"Grup okuma",kible:"Kıble Pusulası",hadisler:"Hadis Ansiklopedisi",ogretmen:"Öğretmen Ders Programı",konu:"Kur'an'da Konu Ara",oku:""};
const TABOF={hatim:"home",sure:"kuran",cuz:"kuran",pdf:"kitaplik",hadis:"kitaplik",siyer:"kitaplik",peygamber:"kitaplik",sahabe:"kitaplik",cevsen:"zikir",tesbihat:"zikir",kayit:"home",duvar:"home",gunler:"home",hava:"vakit",kible:"vakit",hadisler:"kitaplik",ogretmen:"home",konu:"kuran",ayarlar:"home"};
function go(h){location.hash=h}
function parse(){const h=(location.hash||"#home").slice(1);const m=h.match(/^([a-z]+)(?:-(.+))?$/);return m&&TITLES[m[1]]!==undefined?{v:m[1],p:m[2]||null}:{v:"home",p:null}}
window.addEventListener("hashchange",()=>{cur=parse();render();window.scrollTo(0,0)});
$("#back").onclick=()=>history.length>1?history.back():go("home");
function setTitle(a,b){$("#ttl").innerHTML=esc(a)+(b?`<span class="sub">${esc(b)}</span>`:"")}
document.addEventListener("click",e=>{const g=e.target.closest("[data-go]");if(g){e.preventDefault();go(g.dataset.go)}});
function render(){
  setTitle(TITLES[cur.v]||"Bireysel Cüz Takip");
  $("#back").classList.toggle("hide",!!TABS.find(t=>t[0]===cur.v));
  const on=TABOF[cur.v]||cur.v;
  $("#tabs").innerHTML=TABS.map(([v,l,i])=>`<button class="${on===v?"on":""}" data-go="${v}" ${on===v?'aria-current="page"':""}>${ic(i,23)}<span>${l}</span></button>`).join("");
  const el=$("#view");el.onclick=null;
  ({home:vHome,kuran:vKuran,sure:vSure,cuz:vCuz,hadis:vHadis,cevsen:vCevsen,tesbihat:vTesbihat,kitaplik:vKitaplik,pdf:vPdf,ayarlar:vAyarlar,kayit:vKayit,duvar:vDuvar,vakit:vVakit,zikir:vZikir,gunler:vGunler,siyer:vSiyer,peygamber:vPeygamber,sahabe:vSahabe,hava:vHava,grup:vGrup,kible:vKible,hadisler:vHadisler,ogretmen:vOgretmen,konu:vKonu,hatim:vHatim}[cur.v]||vHome)(el);
}

/* ============ FAVORİ / SEPET ============ */
const favKey=it=>it.kaynak+"|"+(it.metin||"").slice(0,40);
function isFav(it){return S.fav.some(f=>favKey(f)===favKey(it))}
function toggleFav(it){if(isFav(it)){S.fav=S.fav.filter(f=>favKey(f)!==favKey(it));toast("Kaydedilenlerden çıkarıldı")}else{S.fav.unshift({id:uid36(),...it});toast("Kaydettiklerime eklendi")}save()}
/* ============ BUGÜN ============ */
function selam(){const h=new Date().getHours();return h<5?"Hayırlı geceler":h<11?"Hayırlı sabahlar":h<17?"Hayırlı günler":h<21?"Hayırlı akşamlar":"Hayırlı geceler"}
function vHome(el){vBugun(el)}
/* ============ KUR'AN ============ */
function vKuran(el){
  el.innerHTML=`<div class="seg"><button class="on">Sureler</button><button data-go="cuz">Cüzler</button><button data-go="konu">Konu ara</button></div>
  <input class="in" id="q" placeholder="Sure ara: Yasin, Mülk, 36…" style="margin-bottom:10px" aria-label="Sure ara">
  <div class="rows" id="sl"></div>
  <p class="muted small">Arapça metin ve Elmalılı Hamdi Yazır meali internetten bir kez yüklenir, sonra internetsiz de açılır.</p>`;
  const norm=s=>s.toLocaleLowerCase("tr").normalize("NFD").replace(/[\u0300-\u036f']/g,"");
  const draw=q=>{el.querySelector("#sl").innerHTML=SURELER.map((s,i)=>[s,i+1]).filter(([s,n])=>!q||norm(s[0]).includes(norm(q))||String(n)===q.trim()).map(([s,n])=>`<div class="rw" data-go="sure-${n}"><div class="num">${n}</div><div class="tx"><b style="font-family:var(--serif)">${esc(s[0])}</b><span>${s[1]} ayet${S.son&&S.son.s===n?" · kaldığın yer":""}</span></div></div>`).join("")||`<div class="empty">Bu adla sure yok</div>`};
  draw();el.querySelector("#q").oninput=e=>draw(e.target.value);
}
async function vSure(el){
  const n=Math.min(114,Math.max(1,parseInt(cur.p)||1)),[ad,adet]=SURELER[n-1];
  const sa=+((String(cur.p||"").split("-a")[1])||0);
  setTitle(ad+" Suresi",`${n}. sure · ${adet} ayet`);
  el.style.setProperty("--afs",S.afs+"px");
  el.innerHTML=`<div class="surehead"><b>${esc(ad)}</b><div class="muted">${n}. sure · ${adet} ayet</div>
   <div class="row" style="gap:6px;justify-content:center;margin-top:8px"><button class="btn sm ghost" id="fm" aria-label="Yazıyı küçült">A−</button><button class="btn sm ghost" id="fp" aria-label="Yazıyı büyüt">A+</button><button class="btn sm ${S.meal?"":"ghost"}" id="ml">Meal</button><button class="btn sm ${S.okunus?"":"ghost"}" id="tl">Okunuş</button><button class="btn sm acc" id="dn">▶ Dinle</button></div></div>
   <div id="body"><div class="spin"></div></div>`;
  const setF=()=>{el.style.setProperty("--afs",S.afs+"px");save()};
  el.querySelector("#fm").onclick=()=>{S.afs=Math.max(20,S.afs-2);setF()};
  el.querySelector("#fp").onclick=()=>{S.afs=Math.min(50,S.afs+2);setF()};
  let d;try{d=await loadSure(n)}catch(e){el.querySelector("#body").innerHTML=`<div class="card empty">Sure yüklenemedi; internet bağlantısını kontrol edin.<br><br><a href="https://kuran.diyanet.gov.tr/mushaf" target="_blank" rel="noopener">Diyanet Kur'an Portalı'nda aç</a></div>`;return}
  if(cur.v!=="sure"||parseInt(cur.p)!==n)return;
  const body=el.querySelector("#body"),v=d.v;
  const drawBody=()=>{body.innerHTML=(n!==1&&n!==9?`<div class="besmele">${BESMELE}</div>`:"")+(d.src==="yerel"?`<p class="muted small">İnternetsiz metin gösteriliyor (sade meal).</p>`:"")+
   v.map(x=>{const it={tip:"Ayet",kaynak:`${ad} ${n}:${x.n}`,metin:x.t,ar:x.a};return `<div class="ayah" id="a${x.n}" data-n="${x.n}"><div class="a">${esc(x.a)} <span class="mk">${x.n}</span></div>${x.o&&S.okunus?`<div class="tr">${esc(x.o)}</div>`:""}${S.meal&&x.t?`<div class="t">${esc(x.t)}</div>`:""}
    <div class="aacts"><button data-act="mark" class="${S.son&&S.son.s===n&&S.son.a===x.n?"on":""}" aria-label="Burada kaldım">${ic("pin")}</button><button data-act="fav" class="${isFav(it)?"on":""}" aria-label="Kaydet">${ic("bm")}</button>${S.tefsir&&x.c?"":""}</div></div>`}).join("")+
   `<div class="row between" style="margin-top:16px">${n>1?`<button class="btn line sm" data-go="sure-${n-1}">‹ ${esc(SURELER[n-2][0])}</button>`:"<span></span>"}${n<114?`<button class="btn sm" data-go="sure-${n+1}">${esc(SURELER[n][0])} ›</button>`:""}</div>
   <p class="muted small" style="margin-top:14px">Meal: Elmalılı Hamdi Yazır. Kaynak: tanzil.net / alquran.cloud.</p>`};
  drawBody();
  // görünüm değişince ekrandaki ayette kal; okunan yeri sure başına kaydet
  const ustAyah=()=>{for(const a of body.querySelectorAll(".ayah")){const r=a.getBoundingClientRect();if(r.bottom>80)return{n:a.dataset.n,top:r.top}}return null};
  const ciz=()=>{const u=ustAyah();drawBody();if(u){const a=body.querySelector("#a"+u.n);if(a)window.scrollBy(0,a.getBoundingClientRect().top-u.top)}};
  const syerKey="no.syer."+n;let syerT=0;
  const syerKaydet=()=>{clearTimeout(syerT);syerT=setTimeout(()=>{if(cur.v!=="sure"||parseInt(cur.p)!==n||!body.isConnected){window.removeEventListener("scroll",syerKaydet);return}const u=ustAyah();if(u)ls.set(syerKey,u.n)},600)};
  window.addEventListener("scroll",syerKaydet,{passive:true});
  el.querySelector("#ml").onclick=e=>{S.meal=!S.meal;save();e.target.classList.toggle("ghost",!S.meal);ciz()};
  
  el.querySelector("#dn").onclick=()=>{ // ekranda okunan ayetten aç
    let an=1;for(const a of body.querySelectorAll(".ayah")){if(a.getBoundingClientRect().bottom>80){an=+a.dataset.n;break}}
    const x=v.find(z=>z.n===an);let k=1;CUZ.forEach(([cs,ca],i)=>{if(cs<n||(cs===n&&ca<=an))k=i+1});
    if(an>1&&x&&x.g)okuyucu(k,{g:x.g});else okuyucu(sureCuzu(n),{sure:n})};
  el.querySelector("#tl").onclick=e=>{if(!v.some(x=>x.o))return toast("Bu kaynakta okunuş yok");S.okunus=!S.okunus;save();e.target.classList.toggle("ghost",!S.okunus);ciz()};
  body.onclick=e=>{const b=e.target.closest("[data-act]");if(!b){const ay=e.target.closest(".ayah .a");if(ay){const an=+ay.closest(".ayah").dataset.n,x=v.find(z=>z.n===an);if(x)mealGoster({s:n,n:an,g:x.g,kelime:kelimeBul(ay,e)})}return}const an=+b.closest(".ayah").dataset.n,x=v.find(z=>z.n===an),it={tip:"Ayet",kaynak:`${ad} ${n}:${an}`,metin:x.t,ar:x.a};
    if(b.dataset.act==="mark"){S.son={s:n,a:an};save();body.querySelectorAll('[data-act="mark"]').forEach(q=>q.classList.remove("on"));b.classList.add("on");toast("Kaldığın yer kaydedildi")}
    if(b.dataset.act==="fav"){toggleFav(it);b.classList.toggle("on",isFav(it))}
};
  const target=sa||+(ls.get(syerKey)||0)||(S.son&&S.son.s===n?S.son.a:0);
  if(target>1){const t=body.querySelector("#a"+target);if(t){const git=()=>t.scrollIntoView({block:"start"});setTimeout(git,60);try{document.fonts&&document.fonts.ready.then(()=>setTimeout(git,50))}catch(e){}}}
}

/* ============ CÜZ TAKİBİ ============ */
function planText(){if(!S.plan||!S.plan.bitis)return "";const kalan=30-Object.values(S.cuz).filter(c=>c.d).length;const gun=Math.ceil((new Date(S.plan.bitis+"T23:59")-Date.now())/864e5);
  if(kalan<=0)return "hatim tamam";if(gun<=0)return "hedef tarih geçti";const g=kalan/gun;return g>=1?`günde ${(Math.round(g*10)/10).toLocaleString("tr-TR")} cüz`:`günde ~${Math.ceil(g*20)} sayfa`}
function cuzSheet(k,st,onSave,showName){const [s,a]=CUZ[k-1];
  sheet(`<h3>${k}. Cüz</h3><p class="muted">${esc(SURELER[s-1][0])} ${s}:${a} ile başlar.</p>
   ${showName?`<label class="lb">Okuyan kişi</label><input class="in" id="kim" value="${esc(st.k||"")}" placeholder="ör. Ahmet">`:""}
   <div class="row wrap" style="gap:8px;margin-top:12px">${showName?`<button class="btn ghost" id="al">${st.k?"Adı kaydet":"Bu cüzü ben alıyorum"}</button>`:""}<button class="btn" id="ok">${st.d?"Okunmadı yap":"Okundu olarak işaretle"}</button><button class="btn line" id="op">Mushafta aç ve dinle</button></div>
   ${st.t&&st.d?`<p class="muted small">Okunma: ${trDate(st.t)}</p>`:""}`,(sh,close)=>{
    const kim=()=>sh.querySelector("#kim")?sh.querySelector("#kim").value.trim():st.k||"";
    sh.querySelector("#ok").onclick=()=>{close();onSave({k:kim(),d:!st.d,t:!st.d?Date.now():0},st.d?"unmark":"done")};
    const al=sh.querySelector("#al");al&&(al.onclick=async()=>{const nm=sh.querySelector("#kim").value.trim();close();onSave({k:nm||await askName(),d:!!st.d,t:st.t||0},"take")});
    sh.querySelector("#op").onclick=()=>{close();okuyucu(k)};
  })}
function cuzGrid(cuz){return `<div class="cuzgrid">${CUZ.map((c,i)=>{const k=i+1,st=(cuz||{})[k]||{};return `<button class="cz ${st.d?"done":st.k?"read":""}" data-c="${k}" aria-label="${k}. cüz">${k}<small>${esc(st.k||SURELER[c[0]-1][0])}</small></button>`}).join("")}</div>
  <div class="row small muted" style="gap:14px;margin-top:10px"><span><b style="color:var(--pri)">■</b> Okundu</span></div>`}
function vCuz(el){
  const done=Object.values(S.cuz).filter(c=>c.d).length;
  el.innerHTML=`<div class="seg"><button data-go="kuran">Sureler</button><button class="on">Cüzler ve hatim</button></div>
  <div class="card"><div class="row between"><b>Kişisel hatmim</b><span class="muted">${done}/30</span></div><div class="bar" style="margin:10px 0"><i style="width:${done/30*100}%"></i></div>
   <div class="row between wrap" style="gap:8px"><span class="muted small">Tamamlanan: <b>${S.hatim}</b>${S.plan?" · Plan: "+esc(planText()):""}</span>
   <div class="row" style="gap:6px"><button class="btn sm ghost" id="pl">Hedef tarih</button><button class="btn sm acc" id="fin" ${done<30?"disabled":""}>Hatmi tamamla</button></div></div></div>
  ${cuzGrid(S.cuz)}
  ${planKart()}
  <p class="muted small">Bir cüze dokun: mushaf düzeninde aç, dinle ya da okundu olarak işaretle.</p>`;
  el.querySelector(".cuzgrid").onclick=e=>{const c=e.target.closest("[data-c]");if(!c)return;const k=+c.dataset.c;cuzSheet(k,S.cuz[k]||{},(st)=>{S.cuz[k]=st;save();render()},false)};
  el.querySelector("#fin").onclick=()=>{S.hatim++;S.hatimLog.push(Date.now());S.cuz={};save();toast("Hatim tamamlandı. Allah kabul etsin.");render()};
  el.querySelector("#pl").onclick=()=>sheet(`<h3>Hatim hedefi</h3><p class="muted">Bitirmek istediğin tarihi seç; günlük okuma miktarı hesaplanır. Ayrıca aşağıdaki “Okuma planı” bölümünden sayfa sayfa plan kurabilirsin.</p><input type="date" class="in" id="dt" value="${S.plan?S.plan.bitis:""}"><div class="row" style="gap:8px;margin-top:12px"><button class="btn" id="ok">Kaydet</button>${S.plan?'<button class="btn ghost" id="rm">Hedefi kaldır</button>':""}</div>`,(sh,close)=>{
    sh.querySelector("#ok").onclick=()=>{const v=sh.querySelector("#dt").value;if(!v)return;S.plan={bitis:v};save();close();render()};const rm=sh.querySelector("#rm");rm&&(rm.onclick=()=>{S.plan=null;save();close();render()})});
  planBagla(el);
}
/* ============ HADİS ============ */
let hadisK="Tümü";
function vHadis(el){
  const kats=["Tümü",...new Set(HADISLER.map(h=>h.k))];
  el.innerHTML=`<div class="chips" id="hk">${kats.map(k=>`<button class="chip ${k===hadisK?"on":""}" data-k="${esc(k)}">${esc(k)}</button>`).join("")}</div>
  <input class="in" id="hq" placeholder="Hadislerde ara…" style="margin:10px 0" aria-label="Hadislerde ara"><div id="hl"></div>
  <h2 class="sec">Sahih hadis kitapları</h2><div id="hb"></div>
  <p class="muted small">Seçme hadisler Buhârî ve Müslim'dendir; anlamlar sade Türkçedir. Tam metin için kitabın PDF'ini ekleyin veya <a href="https://hadislerleislam.gov.tr" target="_blank" rel="noopener">Diyanet – Hadislerle İslam</a> sitesini açın.</p>`;
  const draw=()=>{const q=(el.querySelector("#hq").value||"").toLocaleLowerCase("tr");
    el.querySelector("#hl").innerHTML=HADISLER.map((h,i)=>[h,i]).filter(([h])=>(hadisK==="Tümü"||h.k===hadisK)&&(!q||(h.m+h.s+h.k).toLocaleLowerCase("tr").includes(q))).map(([h,i])=>{const it={tip:"Hadis",kaynak:h.s,metin:h.m,ar:h.a};return `<div class="card hadis"><div class="arx">${esc(h.a)}</div><p style="margin:8px 0;font-family:var(--serif)">${esc(h.m)}</p><div class="row between"><span class="src">${esc(h.s)}</span><div class="aacts" style="margin:0"><button data-h="${i}" data-act="fav" class="${isFav(it)?"on":""}" aria-label="Kaydet">${ic("bm")}</button></div></div></div>`}).join("")||`<div class="empty">Sonuç yok</div>`};
  draw();
  el.querySelector("#hk").onclick=e=>{const c=e.target.closest("[data-k]");if(c){hadisK=c.dataset.k;vHadis(el)}};
  el.querySelector("#hq").oninput=draw;
  el.querySelector("#hl").onclick=e=>{const b=e.target.closest("[data-act]");if(!b)return;const h=HADISLER[+b.dataset.h],it={tip:"Hadis",kaynak:h.s,metin:h.m,ar:h.a};
    if(b.dataset.act==="fav"){toggleFav(it);b.classList.toggle("on",isFav(it))}};
  bookCards(el.querySelector("#hb"),HADIS_KITAPLARI.map(([t,y,d])=>({key:"hadis-"+slug(t),title:t,sub:y+". "+d,cat:"hadis"})));
}
function bookCards(box,books,extra){
  box.innerHTML=books.map(b=>{const has=S.lib.find(l=>l.key===b.key);return `<div class="card book"><div class="spine">${esc(b.title.split(" ")[0])}</div><div class="grow"><b style="font-family:var(--serif)">${esc(b.title)}</b><div class="muted small">${esc(b.sub)}</div>
   <div class="row wrap" style="gap:6px;margin-top:8px">${has?`<button class="btn sm" data-go="pdf-${has.id}">Oku${has.page>1?" · s. "+has.page:""}</button>`:`<button class="btn sm acc" data-add="${esc(b.key)}">${ic("plus",14)} PDF ekle</button>`}${extra?extra(b):""}</div></div></div>`}).join("");
  box.onclick=e=>{const a=e.target.closest("[data-add]");if(!a)return;const b=books.find(x=>x.key===a.dataset.add);pickPdf({key:b.key,title:b.title,cat:b.cat})};
}

function vCevsen(el){
  const okunan=Object.keys(S.cevsen).length,has=S.lib.find(l=>l.key==="cevsen");
  el.innerHTML=`<div class="card"><div class="row between"><b>Okunan bablar</b><span class="muted" id="cn">${okunan}/100</span></div><div class="bar" style="margin:10px 0"><i id="cb" style="width:${okunan}%"></i></div>
   <div class="row wrap" style="gap:8px">${has?`<button class="btn" data-go="pdf-${has.id}">Cevşen'i oku${has.page>1?" · s. "+has.page:""}</button>`:`<button class="btn acc" id="cadd">${ic("plus",16)} Cevşen PDF'ini ekle</button>`}<button class="btn line sm" id="crst">Takibi sıfırla</button></div></div>
  <h2 class="sec">1. Bab</h2>
  <div class="card"><div class="arx" style="font-size:26px">${esc(CEVSEN_BAB1.a)}</div><p class="muted small" style="font-style:italic">${esc(CEVSEN_BAB1.o)}</p><p style="margin-bottom:0;font-family:var(--serif)">${esc(CEVSEN_BAB1.m)}</p></div>
  <p class="muted small">Tam metin için kendi Cevşen PDF'inizi ekleyin. Her babın sonundaki niyaz bazı baskılarda “ecirnâ / hallisnâ / neccinâ mine'n-nâr” diye genişletilir.</p>
  <h2 class="sec">Bab takibi</h2>
  <div class="cuzgrid" id="cg" style="grid-template-columns:repeat(10,1fr);gap:5px">${Array.from({length:100},(_,i)=>`<button class="cz ${S.cevsen[i+1]?"done":""}" data-b="${i+1}" style="font-size:12px;border-radius:8px">${i+1}</button>`).join("")}</div>`;
  const add=el.querySelector("#cadd");add&&(add.onclick=()=>pickPdf({key:"cevsen",title:"Cevşen-ül Kebîr",cat:"cevsen"}));
  el.querySelector("#cg").onclick=e=>{const b=e.target.closest("[data-b]");if(!b)return;const k=b.dataset.b;if(S.cevsen[k])delete S.cevsen[k];else S.cevsen[k]=1;save();b.classList.toggle("done");const o=Object.keys(S.cevsen).length;el.querySelector("#cb").style.width=o+"%";el.querySelector("#cn").textContent=o+"/100"};
  el.querySelector("#crst").onclick=()=>confirmSheet("Bab takibi sıfırlansın mı?","Tüm işaretler kaldırılır.","Sıfırla",()=>{S.cevsen={};save();render()});
}

/* ============ TESBİHAT (5 vakit) ============ */
const AMENERRASULU={t:"Âmenerrasûlü (Bakara 285-286)",a:"اٰمَنَ الرَّسُولُ بِمَٓا اُنْزِلَ اِلَيْهِ مِنْ رَبِّه۪ وَالْمُؤْمِنُونَۜ كُلٌّ اٰمَنَ بِاللّٰهِ وَمَلٰٓئِكَتِه۪ وَكُتُبِه۪ وَرُسُلِه۪ۜ لَا نُفَرِّقُ بَيْنَ اَحَدٍ مِنْ رُسُلِه۪ۜ وَقَالُوا سَمِعْنَا وَاَطَعْنَا غُفْرَانَكَ رَبَّنَا وَاِلَيْكَ الْمَص۪يرُ ۝ لَا يُكَلِّفُ اللّٰهُ نَفْسًا اِلَّا وُسْعَهَاۜ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا اكْتَسَبَتْۜ رَبَّنَا لَا تُؤَاخِذْنَٓا اِنْ نَس۪ينَٓا اَوْ اَخْطَأْنَاۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَٓا اِصْرًا كَمَا حَمَلْتَهُ عَلَى الَّذ۪ينَ مِنْ قَبْلِنَاۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِه۪ۚ وَاعْفُ عَنَّا وَاغْفِرْ لَنَا وَارْحَمْنَاۜ اَنْتَ مَوْلٰينَا فَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِر۪ينَ",
o:"Âmenerrasûlü bimâ unzile ileyhi min rabbihî ve'l-mu'minûn. Kullun âmene billâhi ve melâiketihî ve kutubihî ve rusulih. Lâ nuferriku beyne ehadin min rusulih. Ve kâlû semi'nâ ve eta'nâ gufrâneke rabbenâ ve ileyke'l-masîr. Lâ yukellifullâhu nefsen illâ vus'ahâ. Lehâ mâ kesebet ve aleyhâ mektesebet. Rabbenâ lâ tuâhiznâ in nesînâ ev ahta'nâ. Rabbenâ ve lâ tahmil aleynâ isran kemâ hameltehû ale'llezîne min kablinâ. Rabbenâ ve lâ tuhammilnâ mâ lâ tâkate lenâ bih. Va'fu annâ vağfir lenâ verhamnâ. Ente mevlânâ fensurnâ ale'l-kavmi'l-kâfirîn.",
m:"Peygamber, Rabbinden kendisine indirilene iman etti, müminler de. Hepsi Allah'a, meleklerine, kitaplarına ve peygamberlerine iman etti; 'O'nun peygamberleri arasında ayrım yapmayız; işittik ve itaat ettik. Rabbimiz, bağışlamanı dileriz, dönüş sanadır' dediler. Allah hiç kimseye gücünün yeteceğinden fazlasını yüklemez. Herkesin kazandığı iyilik kendi lehine, kötülük kendi aleyhinedir. Rabbimiz! Unutur ya da yanılırsak bizi sorumlu tutma. Bizden öncekilere yüklediğin gibi bize ağır yük yükleme. Gücümüzün yetmediğini bize taşıtma. Bizi affet, bağışla, bize merhamet et. Sen bizim Mevlâmızsın; kâfirler topluluğuna karşı bize yardım et.",n:1};
const VAKITLER=[["sabah","Sabah","Farzdan sonra yapılır."],["ogle","Öğle","Son sünnetten sonra yapılır."],["ikindi","İkindi","Farzdan sonra yapılır."],["aksam","Akşam","Son sünnetten sonra yapılır."],["yatsi","Yatsı","Son sünnetten sonra yapılır; vitirden sonra da yapılabilir."]];
function vakitListe(v){const base=TESBIHAT.slice(0,-1),dua=TESBIHAT[TESBIHAT.length-1];
  if(v==="sabah"||v==="aksam")return [...base,...TESBIHAT_EK,dua];
  if(v==="yatsi")return [...base,dua,AMENERRASULU];
  return [...base,dua]}
function tahminiVakit(){const h=new Date().getHours()+new Date().getMinutes()/60;return h<11?"sabah":h<14.5?"ogle":h<16.75?"ikindi":h<18.25?"aksam":"yatsi"}
let tesbihSet=null;
function vTesbihat(el){
  tesbihSet=tesbihSet||tahminiVakit();
  const key=tesbihSet,list=vakitListe(key),vk=VAKITLER.find(v=>v[0]===key);S.tesbih[key]=S.tesbih[key]||{i:0,c:0};const st=S.tesbih[key];if(st.i>=list.length)st.i=0;
  const step=list[st.i],today=new Date().toISOString().slice(0,10),top=S.tesbihToplam[today]||0;
  const C=2*Math.PI*100,pct=Math.min(1,st.c/step.n);
  el.innerHTML=`<div class="seg" style="flex-wrap:nowrap">${VAKITLER.map(([k,n])=>`<button class="${k===key?"on":""}" data-s="${k}" style="padding:8px 2px">${n}</button>`).join("")}</div>
  <p class="muted small" style="margin:-4px 2px 10px">${vk[1]} namazı · ${vk[2]}${key==="sabah"||key==="aksam"?" Ecirnâ ve 10 tevhid eklenir.":key==="yatsi"?" Sonunda Âmenerrasûlü okunur.":""}</p>
  <div class="card" style="text-align:center">
    <div class="muted small">${st.i+1} / ${list.length}</div><b style="font:600 19px var(--serif)">${esc(step.t)}</b>
    ${step.a?`<div class="arx" style="text-align:center;font-size:${step.a.length>300?20:step.a.length>120?22:30}px;margin:8px 0">${esc(step.a)}</div>`:""}
    <div class="muted small" style="font-style:italic">${esc(step.o)}</div>${step.m?`<p class="small" style="margin:6px 0">${esc(step.m)}</p>`:""}
    <div class="ring"><svg viewBox="0 0 220 220"><circle cx="110" cy="110" r="100" fill="none" stroke="var(--soft)" stroke-width="8"/><circle id="arc" cx="110" cy="110" r="100" fill="none" stroke="var(--acc)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-pct)}"/></svg>
     <button id="cnt" aria-label="Say"><b>${st.c}</b><span>/ ${step.n}</span></button></div>
    <div class="row" style="gap:8px;justify-content:center"><button class="btn ghost sm" id="prev">‹ Önceki</button><button class="btn ghost sm" id="zero">Sıfırla</button><button class="btn sm" id="next">Sonraki ›</button></div>
    <p class="muted small" id="tt">Bugün toplam: ${top} zikir</p></div>
  <h2 class="sec">${vk[1]} tesbihatı sırası</h2>
  <div class="card">${list.map((s,i)=>`<div class="step ${i===st.i?"on":""}" data-i="${i}"><div class="row between"><b class="small">${esc(s.t)}</b><span class="muted small">${s.n>1?s.n+" defa":""}</span></div></div>`).join("")}</div>
  <p class="muted small">Sıralama Türkiye'de yaygın (Hanefî) uygulamaya göredir; yörelere göre küçük farklar olabilir.</p>`;
  const persist=()=>save();
  const nextStep=()=>{st.i=(st.i+1)%list.length;st.c=0;persist();vTesbihat(el)};
  el.querySelector("#cnt").onclick=()=>{st.c++;S.tesbihToplam={[today]:(S.tesbihToplam[today]||0)+1};try{navigator.vibrate&&navigator.vibrate(st.c>=step.n?[60,40,60]:12)}catch(e){}
    el.querySelector("#cnt b").textContent=st.c;el.querySelector("#arc").setAttribute("stroke-dashoffset",C*(1-Math.min(1,st.c/step.n)));el.querySelector("#tt").textContent="Bugün toplam: "+S.tesbihToplam[today]+" zikir";
    if(st.c>=step.n){persist();if(st.i===list.length-1){toast("Tesbihat tamamlandı. Allah kabul etsin.");st.i=0;st.c=0;persist();setTimeout(()=>vTesbihat(el),500);return}setTimeout(nextStep,step.n>1?400:0);return}
    clearTimeout(vTesbihat._t);vTesbihat._t=setTimeout(persist,1200)};
  el.querySelector("#next").onclick=nextStep;
  el.querySelector("#prev").onclick=()=>{st.i=(st.i-1+list.length)%list.length;st.c=0;persist();vTesbihat(el)};
  el.querySelector("#zero").onclick=()=>{st.c=0;persist();vTesbihat(el)};
  el.querySelectorAll("[data-s]").forEach(b=>b.onclick=()=>{tesbihSet=b.dataset.s;vTesbihat(el)});
  el.querySelectorAll(".step").forEach(d=>d.onclick=()=>{st.i=+d.dataset.i;st.c=0;persist();vTesbihat(el);window.scrollTo(0,0)});
}

/* ============ KİTAPLIK & PDF ============ */
let pickMeta=null;
function pickPdf(meta){pickMeta=meta;const p=$("#picker");p.value="";p.click()}
$("#picker").onchange=async e=>{
  const f=e.target.files&&e.target.files[0];if(!f)return;const meta=pickMeta||{cat:"diger"};pickMeta=null;
  if(!/pdf$/i.test(f.type)&&!/\.pdf$/i.test(f.name))return toast("PDF dosyası seçin");
  const id=uid36(),item={id,key:meta.key||null,title:meta.title||f.name.replace(/\.pdf$/i,""),cat:meta.cat||"diger",size:f.size,page:1,added:Date.now()};
  toast("Kitap ekleniyor…",1800);let ok=false;
  if(!ok){try{await IDB.put(id,f);item.src="local";ok=true}catch(err){console.warn(err)}}
  if(!ok)return toast("Dosya kaydedilemedi");
  S.lib=S.lib.filter(l=>!(item.key&&l.key===item.key)).concat(item);save();
  toast("Eklendi; bu telefonda saklandı");render();
};
const CATS={kuran:"Kur'an ve meal",tefsir:"Tefsir",siyer:"Siyer",hadis:"Hadis",cevsen:"Cevşen ve dua",diger:"Diğer"};
function vKitaplik(el){
  const groups=Object.keys(CATS).map(c=>[c,S.lib.filter(l=>l.cat===c)]).filter(([,a])=>a.length);
  el.innerHTML=`<div class="rows">
   ${[["siyer","risale","Siyer-i Nebî",SIYER.length+" bölüm · Peygamberimizin hayatı"],["peygamber","books","Peygamberler","Kur'an'da adı geçen 25 peygamber"],["sahabe","group","Sahabeler",SAHABELER.length+" sahabinin hayatı"],["hadisler","hadis","Hadis Ansiklopedisi","Konulara göre sahih hadisler ve açıklamaları"],["hadis","hadis","Sahih Hadisler","Buhârî ve Müslim'den seçmeler"],["kuran","quran","Kur'an-ı Kerîm","Arapça, Elmalılı meali"]].map(([g,i,t,s])=>`<div class="rw" data-go="${g}"><div class="ico">${ic(i)}</div><div class="tx"><b>${t}</b><span>${s}</span></div><span class="chev">${ic("chev",18)}</span></div>`).join("")}</div>
  <h2 class="sec">PDF'lerim <small>${S.lib.length} kitap</small></h2>
  <div class="row" style="gap:8px;margin-bottom:10px"><select class="in" id="cat" style="flex:1" aria-label="Kategori">${Object.entries(CATS).map(([k,v])=>`<option value="${k}">${v}</option>`).join("")}</select><button class="btn acc" id="add">${ic("plus",16)} PDF ekle</button></div>
  ${groups.length?groups.map(([c,a])=>`<div class="muted small" style="margin:12px 2px 6px;font-weight:600">${CATS[c]}</div><div class="rows">${a.map(l=>`<div class="rw" data-go="pdf-${l.id}"><div class="ico" style="color:#b0392a">${ic("pdf")}</div><div class="tx"><b>${esc(l.title)}</b><span>${(l.size/1048576).toFixed(1)} MB · bu telefonda${l.page>1?" · s. "+l.page:""}</span></div><button class="ib" style="background:none;color:var(--muted)" data-del="${l.id}" aria-label="Sil">${ic("trash",18)}</button></div>`).join("")}</div>`).join(""):`<div class="empty">Henüz PDF eklemedin. Telefonundaki kitapları yukarıdaki düğmeyle ekle.</div>`}
  <p class="muted small">Eklediğin PDF'ler yalnızca bu telefonda saklanır ve internetsiz açılır. Sadece okuma hakkına sahip olduğun kitapları ekle.</p>`;
  el.querySelector("#add").onclick=()=>pickPdf({cat:el.querySelector("#cat").value});
  el.onclick=e=>{const d=e.target.closest("[data-del]");if(!d)return;e.stopPropagation();e.preventDefault();const l=S.lib.find(x=>x.id===d.dataset.del);
    confirmSheet("Kitap silinsin mi?",l.title,"Sil",async()=>{S.lib=S.lib.filter(x=>x.id!==l.id);save();try{if(l.src==="local")await IDB.del(l.id);}catch(err){}render()})};
}
const PDFJS="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js",PDFW="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
async function vPdf(el){
  const l=S.lib.find(x=>x.id===cur.p);
  if(!l){el.innerHTML=`<div class="empty">Kitap bulunamadı. <a href="#kitaplik">Kitaplığa dön</a></div>`;return}
  setTitle(l.title,CATS[l.cat]||"");l.okuma=Date.now();save();
  el.innerHTML=`<div class="row between wrap" style="gap:6px;margin-bottom:8px">
    <div class="row" style="gap:6px"><button class="btn sm ghost" id="pv" aria-label="Önceki sayfa">‹</button><input class="in" id="pg" type="number" min="1" style="width:72px;padding:6px;text-align:center" aria-label="Sayfa"><span class="muted small" id="pt">/ –</span><button class="btn sm ghost" id="nx" aria-label="Sonraki sayfa">›</button></div>
    <div class="row" style="gap:6px"><button class="btn sm ghost" id="nt" aria-label="Gece modu">${ic("moon",16)}</button><button class="btn sm ghost" id="zm" aria-label="Uzaklaştır">−</button><button class="btn sm ghost" id="zp" aria-label="Yakınlaştır">+</button></div></div>
   <div class="pdfwrap ${S.pdfGece?"night":""}" id="pw"><div class="spin" style="border-top-color:#fff"></div></div>`;
  el.querySelector("#nt").onclick=()=>{S.pdfGece=!S.pdfGece;save();el.querySelector("#pw").classList.toggle("night",!!S.pdfGece)};
  try{
    if(!window.pdfjsLib){await loadScript(PDFJS);await loadScript(PDFW)}
    pdfjsLib.GlobalWorkerOptions.workerSrc=PDFW;
    const b=await IDB.get(l.id);if(!b)throw new Error("Bu PDF bu telefonda bulunamadı.");const src={data:new Uint8Array(await b.arrayBuffer())};
    const doc=await pdfjsLib.getDocument(src).promise;if(cur.v!=="pdf"||cur.p!==l.id)return;
    const ps={page:Math.min(l.page||1,doc.numPages),zoom:1};el.querySelector("#pt").textContent="/ "+doc.numPages;
    const show=async p=>{p=Math.max(1,Math.min(doc.numPages,p));ps.page=p;el.querySelector("#pg").value=p;
      const page=await doc.getPage(p),pw=el.querySelector("#pw"),w=Math.max(280,pw.clientWidth-4),base=page.getViewport({scale:1}),dpr=Math.min(window.devicePixelRatio||1,2.5);
      const vp=page.getViewport({scale:w/base.width*ps.zoom*dpr}),c=document.createElement("canvas");c.width=vp.width;c.height=vp.height;c.style.width=vp.width/dpr+"px";c.style.height=vp.height/dpr+"px";
      await page.render({canvasContext:c.getContext("2d"),viewport:vp}).promise;pw.innerHTML="";pw.appendChild(c);if(l.page!==p){l.page=p;save()}};
    await show(ps.page);
    el.querySelector("#pv").onclick=()=>show(ps.page-1);el.querySelector("#nx").onclick=()=>show(ps.page+1);
    el.querySelector("#pg").onchange=e=>show(+e.target.value||1);
    el.querySelector("#zm").onclick=()=>{ps.zoom=Math.max(.6,ps.zoom-.2);show(ps.page)};el.querySelector("#zp").onclick=()=>{ps.zoom=Math.min(3,ps.zoom+.2);show(ps.page)};
    let sx=null;const pw=el.querySelector("#pw");
    pw.addEventListener("touchstart",e=>{if(ps.zoom<=1&&e.touches.length===1)sx=e.touches[0].clientX},{passive:true});
    pw.addEventListener("touchend",e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>60)show(ps.page+(dx<0?1:-1))});
  }catch(e){console.warn(e);el.querySelector("#pw").innerHTML=`<div class="empty" style="color:#fff">PDF açılamadı.<br><small>${esc(e.message||e)}</small></div>`}
}

/* ============ KAYDETTİKLERİM ============ */
function vKayit(el){
  el.innerHTML=S.fav.length?S.fav.map(f=>`<div class="card hadis">${f.ar?`<div class="arx">${esc(f.ar)}</div>`:""}<p style="margin:6px 0;font-family:var(--serif)">${esc(f.metin)}</p><div class="row between"><span class="src">${esc(f.kaynak)}</span><div class="aacts" style="margin:0"><button data-w="${f.id}" aria-label="Duvar kâğıdı yap">${ic("phone")}</button><button data-r="${f.id}" aria-label="Kaldır">${ic("trash")}</button></div></div></div>`).join(""):`<div class="empty">Ayet ve hadislerdeki ${ic("bm",16)} işaretiyle kaydettiklerin burada toplanır.</div>`;
  el.onclick=e=>{const b=e.target.closest("[data-w],[data-s],[data-r]");if(!b)return;const id=b.dataset.w||b.dataset.s||b.dataset.r,f=S.fav.find(x=>x.id===id);if(!f)return;
    if(b.dataset.r){S.fav=S.fav.filter(x=>x.id!==id);save();render()}else{wp.src={a:f.ar||"",m:f.metin,k:f.kaynak};go("duvar")}};
}

/* ============ KİLİT EKRANI DUVAR KÂĞIDI ============ */
const wp={src:null,tema:null,kaynak:"ayet",stil:"cami"};
const STILLER=[["cami","Cami"],["kandil","Kandil"],["mihrap","Mihrap"],["cerceve","Çerçeve"],["zarif","Zarif"]];
let fontsReady=null;
function wpFonts(){return fontsReady=fontsReady||Promise.all(["72px Amiri","italic 48px Literata","48px Literata","600 34px Manrope"].map(f=>document.fonts.load(f).catch(()=>{})))}
function star8(x,cx,cy,r,fill,stroke,lw){x.save();x.translate(cx,cy);x.beginPath();for(let i=0;i<16;i++){const a=i*Math.PI/8-Math.PI/2,rr2=i%2?r*.72:r;x.lineTo(Math.cos(a)*rr2,Math.sin(a)*rr2)}x.closePath();if(fill){x.fillStyle=fill;x.fill()}if(stroke){x.strokeStyle=stroke;x.lineWidth=lw||3;x.stroke()}x.restore()}
const WP_EK=[["gecealtin","Gece Altın","#050a24","#1b2d70","#f2a84a"],["gunbatimi","Gün Batımı","#190a38","#6e2a6e","#ff9650"],["turkuaz","Turkuaz","#02242d","#0a6f78","#8fe8d6"],["lale","Lale","#26061a","#7d1a45","#ffad86"]];
const WP_TEMALAR=[...WP_EK.map(t=>[t[0],t[1]]),...TEMALAR.map(t=>[t[0],t[1]])];
function wpPalette(tema){const e=WP_EK.find(q=>q[0]===tema);
  if(e)return{a:e[2],b:e[3],c:e[4],ink:"#ffffff",soft:"rgba(255,255,255,.92)",gold:"#f4d283",panel:"rgba(0,0,0,.22)",pat:"#ffffff",light:false};
  const t=TEMALAR.find(q=>q[0]===tema)||TEMALAR[0];
  if(tema==="sade")return{a:"#f6f7f9",b:"#dfe4ea",c:"#ffffff",ink:"#1f2a36",soft:"rgba(31,42,54,.75)",gold:"#9a7330",panel:"rgba(255,255,255,.6)",pat:"#1f2a36",light:true};
  if(tema==="sepya")return{a:"#f2e7d2",b:"#d9c29b",c:"#fff6e0",ink:"#3b2a17",soft:"rgba(59,42,23,.78)",gold:"#94692a",panel:"rgba(255,250,240,.55)",pat:"#3b2a17",light:true};
  return{a:t[2],b:t[3],c:"#f0c070",ink:"#ffffff",soft:"rgba(255,255,255,.88)",gold:"#e2c271",panel:"rgba(0,0,0,.2)",pat:"#ffffff",light:false}}
function tohum(n){let s=n||7;return()=>(s=s*16807%2147483647)/2147483647}
function gokyuzu(x,W,H,P,ufukY){const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,P.a);g.addColorStop(ufukY/H*.75,P.b);g.addColorStop(ufukY/H,P.c);g.addColorStop(1,P.b);x.fillStyle=g;x.fillRect(0,0,W,H);
  const r=x.createRadialGradient(W/2,ufukY,20,W/2,ufukY,W*.9);r.addColorStop(0,P.c);r.addColorStop(1,"rgba(0,0,0,0)");x.save();x.globalAlpha=P.light?.35:.55;x.fillStyle=r;x.fillRect(0,0,W,H);x.restore();
  const R=tohum(11);x.save();for(let i=0;i<240;i++){const sx=R()*W,sy=R()*ufukY*.82,sr=.8+R()*R()*3.2;x.globalAlpha=(.25+R()*.7)*(1-sy/ufukY*.6);x.fillStyle="#fff";x.beginPath();x.arc(sx,sy,sr,0,7);x.fill();
    if(sr>3){x.globalAlpha*=.5;x.fillRect(sx-sr*4,sy-.6,sr*8,1.2);x.fillRect(sx-.6,sy-sr*4,1.2,sr*8)}}x.restore();
  // hilal
  const mx=W*.8,my=H*.075,mr=62;const mg=x.createRadialGradient(mx,my,mr*.6,mx,my,mr*4);mg.addColorStop(0,"rgba(255,240,200,.35)");mg.addColorStop(1,"rgba(255,240,200,0)");x.fillStyle=mg;x.fillRect(mx-mr*4,my-mr*4,mr*8,mr*8);
  x.save();x.beginPath();x.arc(mx,my,mr,0,7);x.arc(mx+mr*.42,my-mr*.22,mr*.86,0,7,true);x.fillStyle="#fff1c9";x.fill("evenodd");x.restore()}
function minare(x,mx,base,h,w){x.rect(mx-w/2,base-h,w,h);for(const f of[.5,.74])x.rect(mx-w*.85,base-h*f-6,w*1.7,14);
  x.moveTo(mx-w*.62,base-h);x.lineTo(mx,base-h-w*3.6);x.lineTo(mx+w*.62,base-h);x.closePath();x.rect(mx-1.5,base-h-w*3.6-38,3,40)}
function kubbe(x,cx,y,rx,ry){x.moveTo(cx-rx,y);x.ellipse(cx,y,rx,ry,0,Math.PI,0);x.closePath()}
function hilalCiz(x,cx,cy,r,col){x.save();x.beginPath();x.arc(cx,cy,r,0,7);x.arc(cx+r*.45,cy-r*.15,r*.82,0,7,true);x.fillStyle=col;x.fill("evenodd");x.restore()}
function camiSil(x,cx,base,s,col,isik){x.save();x.fillStyle=col;x.beginPath();
  x.rect(cx-560*s,base-70*s,1120*s,70*s);x.rect(cx-310*s,base-340*s,620*s,280*s);x.rect(cx-150*s,base-410*s,300*s,80*s);
  kubbe(x,cx,base-405*s,185*s,175*s);kubbe(x,cx-235*s,base-335*s,100*s,85*s);kubbe(x,cx+235*s,base-335*s,100*s,85*s);
  x.rect(cx-470*s,base-215*s,940*s,150*s);kubbe(x,cx-390*s,base-212*s,62*s,58*s);kubbe(x,cx+390*s,base-212*s,62*s,58*s);
  x.rect(cx-2*s,base-640*s,4*s,60*s);
  minare(x,cx-490*s,base-60*s,760*s,32*s);minare(x,cx+490*s,base-60*s,760*s,32*s);minare(x,cx-560*s,base-60*s,600*s,28*s);minare(x,cx+560*s,base-60*s,600*s,28*s);
  x.fill();hilalCiz(x,cx,base-655*s,16*s,col);
  if(isik){x.fillStyle=isik;const pen=(px,py,pw,ph)=>{x.beginPath();x.moveTo(px,py+ph);x.lineTo(px,py+pw/2);x.arc(px+pw/2,py+pw/2,pw/2,Math.PI,0);x.lineTo(px+pw,py+ph);x.closePath();x.fill()};
    for(let i=-4;i<=4;i++)pen(cx+i*58*s-11*s,base-300*s,22*s,46*s);for(let i=-3;i<=3;i++)pen(cx+i*62*s-14*s,base-200*s,28*s,62*s);
    for(const k of[-1,1])for(let i=0;i<4;i++)pen(cx+k*(345+i*32)*s-9*s,base-170*s,18*s,40*s);
    for(let i=-5;i<=5;i++)pen(cx+i*44*s-8*s,base-395*s,16*s,30*s)}
  x.restore()}
function sahneCami(x,W,H,P){const uf=H*.8;gokyuzu(x,W,H,P,uf);
  camiSil(x,W*.16,H-110,.42,"rgba(0,0,0,.28)",null);camiSil(x,W*.9,H-150,.36,"rgba(0,0,0,.22)",null);
  const sc=x.createLinearGradient(0,H*.6,0,H);sc.addColorStop(0,"#0a0f22");sc.addColorStop(1,"#03050d");
  camiSil(x,W/2,H-40,.98,P.light?"#3a3226":sc,"rgba(255,206,120,.9)");
  const ze=x.createLinearGradient(0,H-60,0,H);ze.addColorStop(0,"rgba(0,0,0,0)");ze.addColorStop(1,"rgba(0,0,0,.6)");x.fillStyle=ze;x.fillRect(0,H-60,W,60)}
function kandilCiz(x,cx,cy,s,P){x.save();
  const gl=x.createRadialGradient(cx,cy,10,cx,cy,330*s);gl.addColorStop(0,"rgba(255,214,140,.55)");gl.addColorStop(.4,"rgba(255,170,80,.18)");gl.addColorStop(1,"rgba(255,170,80,0)");x.fillStyle=gl;x.fillRect(cx-340*s,cy-340*s,680*s,680*s);
  x.strokeStyle=P.gold;x.lineWidth=3*s;x.beginPath();x.moveTo(cx,0);x.lineTo(cx,cy-150*s);x.stroke();
  for(let yy=40;yy<cy-150*s;yy+=26){x.beginPath();x.ellipse(cx,yy,5*s,10*s,0,0,7);x.stroke()}
  const govde=()=>{x.beginPath();x.moveTo(cx-34*s,cy-118*s);x.bezierCurveTo(cx-120*s,cy-80*s,cx-118*s,cy+40*s,cx-70*s,cy+92*s);x.lineTo(cx+70*s,cy+92*s);x.bezierCurveTo(cx+118*s,cy+40*s,cx+120*s,cy-80*s,cx+34*s,cy-118*s);x.closePath()};
  const ic=x.createRadialGradient(cx,cy,8*s,cx,cy,120*s);ic.addColorStop(0,"#fff8dc");ic.addColorStop(.35,"#ffd27a");ic.addColorStop(1,"rgba(200,90,30,.85)");x.fillStyle=ic;govde();x.fill();
  x.save();govde();x.clip();x.strokeStyle="rgba(90,50,10,.55)";x.lineWidth=4*s;for(let i=-3;i<=3;i++){x.beginPath();x.moveTo(cx+i*30*s,cy-130*s);x.lineTo(cx+i*24*s,cy+100*s);x.stroke()}
   x.globalAlpha=.45;for(let i=-1;i<=1;i++)star8(x,cx+i*58*s,cy-10*s,20*s,null,"#7a3a10",3*s);x.restore();
  x.lineWidth=5*s;x.strokeStyle=P.gold;govde();x.stroke();
  x.fillStyle=P.gold;x.beginPath();x.moveTo(cx-44*s,cy-116*s);x.quadraticCurveTo(cx,cy-190*s,cx+44*s,cy-116*s);x.closePath();x.fill();
  x.fillRect(cx-78*s,cy+88*s,156*s,12*s);x.beginPath();x.moveTo(cx-40*s,cy+100*s);x.lineTo(cx,cy+170*s);x.lineTo(cx+40*s,cy+100*s);x.closePath();x.fill();
  x.beginPath();x.arc(cx,cy+178*s,9*s,0,7);x.fill();x.restore()}
function sahneKandil(x,W,H,P){const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,P.a);g.addColorStop(1,P.b);x.fillStyle=g;x.fillRect(0,0,W,H);
  const R=tohum(5);x.save();for(let i=0;i<46;i++){const bx=R()*W,by=R()*H,br=8+R()*46;const b=x.createRadialGradient(bx,by,0,bx,by,br);b.addColorStop(0,"rgba(255,220,150,"+(.08+R()*.18)+")");b.addColorStop(1,"rgba(255,220,150,0)");x.fillStyle=b;x.fillRect(bx-br,by-br,br*2,br*2)}x.restore();
  x.save();const S2=150;for(let yy=H*.55;yy<H+S2;yy+=S2)for(let xx=((yy/S2|0)&1)*S2/2-S2;xx<W+S2;xx+=S2){x.globalAlpha=.07*Math.min(1,(yy-H*.55)/(H*.3));star8(x,xx,yy,44,null,P.gold,2.4)}x.restore();
  kandilCiz(x,W*.2,520,.78,P);kandilCiz(x,W*.8,470,.82,P);kandilCiz(x,W*.5,700,1.05,P)}
async function drawWallpaper(cv,c,tema,stil,vk){
  const W=1170,H=2532;cv.width=W;cv.height=H;const x=cv.getContext("2d"),P=wpPalette(tema);await wpFonts();
  if(c.a)c={...c,a:c.a.replace(/\u06EA/g,"\u0650")};
  const sahne=stil==="cami"||stil==="kandil";
  if(stil==="cami")sahneCami(x,W,H,P);else if(stil==="kandil")sahneKandil(x,W,H,P);else{
  // zemin
  const g=x.createLinearGradient(0,0,W*.35,H);g.addColorStop(0,P.a);g.addColorStop(1,P.b);x.fillStyle=g;x.fillRect(0,0,W,H);
  const rg=x.createRadialGradient(W/2,H*.62,200,W/2,H*.62,H*.75);rg.addColorStop(0,"rgba(255,255,255,"+(P.light?.25:.06)+")");rg.addColorStop(1,"rgba(0,0,0,"+(P.light?.04:.28)+")");x.fillStyle=rg;x.fillRect(0,0,W,H);
  // girih deseni: alta doğru belirginleşir
  x.save();const S2=146;for(let yy=-S2;yy<H+S2;yy+=S2)for(let xx=((yy/S2)&1)*S2/2-S2;xx<W+S2;xx+=S2){x.globalAlpha=(P.light?.05:.06)*(.35+.65*Math.max(0,yy/H));star8(x,xx,yy,40,null,P.pat,2.2)}x.restore();}
  // metin ölçüsü
  const maxW=W-360;const lines=(txt,font,w)=>{x.font=font;const out=[];let ln="";for(const wd of String(txt).split(/\s+/)){const tt=ln?ln+" "+wd:wd;if(x.measureText(tt).width>w&&ln){out.push(ln);ln=wd}else ln=tt}if(ln)out.push(ln);return out};
  let arS=c.a?(c.a.length>160?54:c.a.length>90?62:c.a.length>45?74:88):0,mS=c.m.length>220?38:c.m.length>130?44:c.m.length>70?50:58;
  const fit=()=>{const ar=c.a?lines(c.a,`${arS}px Amiri`,maxW):[];const ml=lines(c.m,`italic ${mS}px Literata`,maxW);return{ar,ml,h:ar.length*arS*1.7+(ar.length?90:0)+ml.length*mS*1.5+90}};
  const lim=stil==="cami"?620:stil==="kandil"?900:1050;let f=fit();while(f.h>lim&&(mS>30||arS>44)){mS=Math.max(30,mS-2);if(arS)arS=Math.max(44,arS-3);f=fit()}
  // içerik bloğu: saat alanı (üst ~%38) ve alt düğmeler boş kalır
  const bottom=stil==="cami"?1640:2180,top=sahne?(stil==="cami"?940:1060):Math.max(1000,bottom-f.h-(stil==="mihrap"?420:260)),cx=W/2;
  if(stil==="mihrap"){const x0=150,x1=W-150,sh=top+300;
    const arch=()=>{x.beginPath();x.moveTo(x0,bottom);x.lineTo(x0,sh);x.bezierCurveTo(x0,sh-170,cx-120,top+90,cx,top);x.bezierCurveTo(cx+120,top+90,x1,sh-170,x1,sh);x.lineTo(x1,bottom);x.closePath()};
    x.fillStyle=P.panel;arch();x.fill();x.strokeStyle=P.gold;x.lineWidth=4;arch();x.stroke();
    x.save();x.translate(0,0);x.globalAlpha=.45;x.lineWidth=2;x.beginPath();const d=18;x.moveTo(x0+d,bottom-d);x.lineTo(x0+d,sh+4);x.bezierCurveTo(x0+d,sh-160,cx-112,top+108,cx,top+26);x.bezierCurveTo(cx+112,top+108,x1-d,sh-160,x1-d,sh+4);x.lineTo(x1-d,bottom-d);x.closePath();x.stroke();x.restore();
    star8(x,cx,top,30,P.light?"#fff":P.a,P.gold,3);star8(x,cx,top,12,P.gold,null);
    x.fillStyle=P.gold;x.fillRect(x0-20,bottom,x1-x0+40,5);}
  else if(stil==="cerceve"){const fx=110,fw=W-220,fy=top,fh=bottom-top;
    x.fillStyle=P.panel;rr(x,fx,fy,fw,fh,36);x.fill();x.strokeStyle=P.gold;x.lineWidth=3.5;rr(x,fx+14,fy+14,fw-28,fh-28,28);x.stroke();x.globalAlpha=.45;x.lineWidth=2;rr(x,fx+26,fy+26,fw-52,fh-52,22);x.stroke();x.globalAlpha=1;
    for(const [px,py] of [[fx+14,fy+14],[fx+fw-14,fy+14],[fx+14,fy+fh-14],[fx+fw-14,fy+fh-14]])star8(x,px,py,20,P.light?"#fff":P.a,P.gold,3);
    star8(x,cx,fy+14,28,P.light?"#fff":P.a,P.gold,3);star8(x,cx,fy+14,10,P.gold,null);}
  else if(!sahne){star8(x,cx,top+60,26,null,P.gold,3);star8(x,cx,top+60,9,P.gold,null)}
  // metin
  const inner=stil==="mihrap"?(top+300+bottom)/2+40:(top+bottom)/2+(stil==="zarif"?50:0);let y=inner-f.h/2+arS*.85;
  if(sahne){x.shadowColor="rgba(0,0,0,.55)";x.shadowBlur=22;x.shadowOffsetY=3}x.textAlign="center";x.textBaseline="alphabetic";x.fillStyle=P.ink;x.direction="rtl";x.font=`${arS}px Amiri`;for(const l of f.ar){x.fillText(l,cx,y);y+=arS*1.7}
  x.direction="ltr";
  if(f.ar.length){y+=4-arS*.55;const gl=x.createLinearGradient(cx-220,0,cx+220,0);gl.addColorStop(0,"rgba(0,0,0,0)");gl.addColorStop(.5,P.gold);gl.addColorStop(1,"rgba(0,0,0,0)");x.fillStyle=gl;x.fillRect(cx-220,y,440,3);x.save();x.translate(cx,y+1.5);x.rotate(Math.PI/4);x.fillStyle=P.gold;x.fillRect(-9,-9,18,18);x.restore();y+=86}
  else y+=0;
  x.fillStyle=P.soft;x.font=`italic ${mS}px Literata`;y+=mS*.2;for(const l of f.ml){x.fillText(l,cx,y);y+=mS*1.5}
  x.fillStyle=P.gold;x.font="600 32px Manrope";x.fillText(c.k||"",cx,y+30);x.shadowColor="transparent";x.shadowBlur=0;x.shadowOffsetY=0;
  if(vk)vakitSeridi(x,W,stil==="cami"?740:2215,vk,P);
}
function vakitSeridi(x,W,y,vk,P){const pad=64,w=W-pad*2,h=176;x.save();
  x.fillStyle=P.light?"rgba(255,255,255,.6)":"rgba(0,0,0,.32)";rr(x,pad,y,w,h,36);x.fill();x.strokeStyle=P.gold;x.globalAlpha=.55;x.lineWidth=2;rr(x,pad+8,y+8,w-16,h-16,30);x.stroke();x.globalAlpha=1;
  x.textAlign="center";x.direction="ltr";x.fillStyle=P.gold;x.font="600 27px Manrope";x.fillText(vk.baslik,W/2,y+48);
  const cw=w/6;vk.saat.forEach((t,i)=>{const cx=pad+cw*i+cw/2;x.fillStyle=P.soft;x.font="600 25px Manrope";x.fillText(VAKIT_AD[i][1],cx,y+98);x.fillStyle=P.ink;x.font="700 39px Manrope";x.fillText(t,cx,y+146)});x.restore()}
async function wpVakit(){if(!S.il)return null;try{const g=new Date(),r=await vakitGun(g);if(!r)return null;return{baslik:`${S.il.ad} · ${g.toLocaleDateString("tr-TR",{day:"numeric",month:"long",weekday:"long"})}`,saat:r.slice(1,7)}}catch(e){return null}}
function rr(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()}
const toBlob=(cv,type,q)=>new Promise(r=>cv.toBlob(r,type,q));
async function saveWp(cv,name){const b=await toBlob(cv,"image/jpeg",.93);if(!b){toast("Resim hazırlanamadı");return false}return indir(b,name)}
function kurulumHTML(){return `<h3>Her gün otomatik değişen kilit ekranı</h3>
 <p class="muted small">Telefonlar, internet sayfalarının duvar kâğıdını kendiliğinden değiştirmesine izin vermez. Çözüm: tüm duvar kâğıtlarını bir kez indirip telefonun kendi otomasyonuna sırayla taktırmak. Bir kez kurarsın, sonra her gün kendisi değişir.</p>
 <b>1) Resimleri indir</b><p class="small">“Tümünü indir (ZIP)” düğmesine bas. 14 ayet ve 25 hadis (39 resim) seçtiğin tema ve stilde hazırlanır.</p>
 <b>iPhone</b><ol class="small" style="padding-left:18px">
 <li>Dosyalar uygulamasında ZIP'e dokun; klasör açılır. Klasörü aç → Seç → Tümünü Seç → Paylaş → “Görüntüleri Kaydet”.</li>
 <li>Fotoğraflar'da bu resimleri seç → “Albüme Ekle” → yeni albüm: <b>Nur Duvar</b>.</li>
 <li>Kestirmeler → Otomasyon → + → “Günün Saati” → 00:05, Her Gün → “Hemen Çalıştır”.</li>
 <li>Eylemler: “Fotoğrafları Bul” (Albüm: Nur Duvar) → “Listeden Öğe Al” (Rastgele Öğe) → “Duvar Kâğıdı Fotoğrafını Ayarla” (Kilit Ekranı, “Önizlemeyi Göster” kapalı). iOS sürümüne göre eylemin adı “Duvar Kâğıdını Ayarla” olabilir.</li></ol>
 <b>Android (Samsung)</b><ol class="small" style="padding-left:18px">
 <li>ZIP'i Dosyalarım'da aç → “Çıkart”. Resimler Galeri'de görünür.</li>
 <li>Ayarlar → Duvar kâğıdı ve stil → Duvar kâğıdını değiştir → Galeri → 15'e kadar resim seç → Kilit ekranı. Ekran her açıldığında sıradaki ayet gelir.</li></ol>
 <p class="muted small">Diğer Android telefonlarda Play Store'daki “otomatik duvar kâğıdı değiştirici” uygulamalarıyla aynı klasör seçilebilir.</p>`}
async function zipAll(btn){
  btn.disabled=true;const old=btn.innerHTML;
  try{await loadScript("https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js");
    const zip=new JSZip(),cv=document.createElement("canvas");
    const items=[...GUNLUK.map(d=>({a:d.a,m:d.m,k:d.k,t:"ayet"})),...HADISLER.map(h=>({a:h.a,m:h.m,k:h.s.split(";")[0],t:"hadis"}))];
    for(let i=0;i<items.length;i++){btn.textContent=`Hazırlanıyor ${i+1}/${items.length}`;const it=items[i];await drawWallpaper(cv,it,wp.tema,wp.stil);
      zip.file(`nur-${String(i+1).padStart(2,"0")}-${it.t}-${slug(it.k).slice(0,30)}.jpg`,await toBlob(cv,"image/jpeg",.9));await new Promise(r=>setTimeout(r,0))}
    btn.textContent="Paketleniyor…";const blob=await zip.generateAsync({type:"blob"});
    indir(blob,`nur-ekran-${wp.tema}-${wp.stil}.zip`);toast("İndirildi; şimdi kurulum adımlarını izle");sheet(kurulumHTML())}
  catch(e){console.warn(e);if(!(e&&e.code==="declined"))toast("Paket hazırlanamadı")}
  btn.disabled=false;btn.innerHTML=old}
function vDuvar(el){if(wp.vakit===undefined)wp.vakit=S.wpVakit!==false;
  wp.tema=wp.tema||"gecealtin";
  const today=GUNLUK[dayIdx()%GUNLUK.length],hd=HADISLER[dayIdx()%HADISLER.length];
  const pick=k=>k==="ayet"?{a:today.a,m:today.m,k:today.k}:k==="hadis"?{a:hd.a,m:hd.m,k:hd.s.split(";")[0]}:null;
  if(!wp.src)wp.src=pick("ayet");
  el.innerHTML=`<div class="seg" id="ks"><button data-k="ayet" class="${wp.kaynak==="ayet"?"on":""}">Günün ayeti</button><button data-k="hadis" class="${wp.kaynak==="hadis"?"on":""}">Günün hadisi</button><button data-k="kendi" class="${wp.kaynak==="kendi"?"on":""}">Kendi sözüm</button></div>
  <div id="kendi" class="${wp.kaynak==="kendi"?"":"hide"}" style="margin-bottom:10px"><textarea class="in" id="ks1" rows="3" placeholder="Söz veya dua">${esc(wp.kaynak==="kendi"?wp.src.m:"")}</textarea><input class="in" id="ks2" placeholder="Kaynak (isteğe bağlı)" style="margin-top:6px" value="${esc(wp.kaynak==="kendi"?wp.src.k:"")}"></div>
  <div class="wpwrap"><canvas id="cv" aria-label="Kilit ekranı önizleme"></canvas></div>
  <label class="card row between" style="margin:14px 0 0;cursor:pointer"><span>${ic("clock",18)} Bugünün namaz vakitlerini ekle${S.il?"":" <small class=\"muted\">(önce şehir seçin)</small>"}</span><input type="checkbox" id="wv" ${wp.vakit?"checked":""}></label>
  <button class="btn full acc" id="paylas" style="margin-top:14px">${ic("phone",18)} Duvar kâğıdı yap</button>
  <button class="btn full" id="add" style="margin-top:8px">${ic("dl",18)} Galeriye kaydet</button>
  <button class="btn full" id="zip" style="margin-top:8px">${ic("dl",18)} Her gün değişsin: tümünü indir (ZIP)</button>
  <h2 class="sec">Stil</h2>
  <div class="seg" id="st">${STILLER.map(([k,n])=>`<button data-st="${k}" class="${k===wp.stil?"on":""}">${n}</button>`).join("")}</div>
  <h2 class="sec" style="margin-top:4px">Tema</h2>
  <div class="themes" id="tm">${WP_TEMALAR.map(([k,n])=>{const P=wpPalette(k);return `<button class="th ${k===wp.tema?"on":""}" data-t="${k}"><i style="background:linear-gradient(170deg,${P.a},${P.b} 70%,${P.c})"></i>${n}</button>`}).join("")}</div>
  ${S.fav.length?`<button class="btn full ghost" id="fv" style="margin-top:12px">Kaydettiklerimden seç</button>`:""}
  <button class="btn full line" id="how" style="margin-top:8px">Otomatik değişim nasıl kurulur?</button>`;
  const cv=el.querySelector("#cv");let cizNo=0;
  const redraw=async()=>{const no=++cizNo;let vk=null;if(wp.vakit&&S.il){vk=await wpVakit();if(!vk)toast("Namaz vakitleri alınamadı; internet bağlantısını kontrol edin")}
    if(no!==cizNo)return;const tmp=document.createElement("canvas");await drawWallpaper(tmp,wp.src,wp.tema,wp.stil,vk);if(no!==cizNo)return;cv.width=tmp.width;cv.height=tmp.height;cv.getContext("2d").drawImage(tmp,0,0)};redraw();
  el.querySelector("#wv").onchange=e=>{wp.vakit=e.target.checked;S.wpVakit=wp.vakit;save();if(wp.vakit&&!S.il){ilSec();toast("Vakitler için önce şehrinizi seçin")}redraw()};
  el.querySelector("#ks").onclick=e=>{const b=e.target.closest("[data-k]");if(!b)return;wp.kaynak=b.dataset.k;wp.src=wp.kaynak==="kendi"?{a:"",m:"Rabbim! İlmimi artır.",k:"Tâhâ 20:114"}:pick(wp.kaynak);vDuvar(el)};
  const upd=()=>{wp.src={a:"",m:el.querySelector("#ks1").value.trim()||" ",k:el.querySelector("#ks2").value.trim()};clearTimeout(upd.t);upd.t=setTimeout(redraw,250)};
  el.querySelector("#ks1").oninput=upd;el.querySelector("#ks2").oninput=upd;
  el.querySelector("#tm").onclick=e=>{const b=e.target.closest("[data-t]");if(!b)return;wp.tema=b.dataset.t;el.querySelectorAll(".th").forEach(t=>t.classList.toggle("on",t===b));redraw()};
  el.querySelector("#st").onclick=e=>{const b=e.target.closest("[data-st]");if(!b)return;wp.stil=b.dataset.st;el.querySelectorAll("#st button").forEach(t=>t.classList.toggle("on",t===b));redraw()};
  const fv=el.querySelector("#fv");fv&&(fv.onclick=()=>sheet(`<h3>Kaydettiklerim</h3>${S.fav.map(f=>`<div class="note" data-id="${f.id}" style="cursor:pointer"><div class="grow small">${esc(f.metin.slice(0,120))}<div class="src">${esc(f.kaynak)}</div></div></div>`).join("")}`,(sh,close)=>{sh.onclick=e=>{const n=e.target.closest("[data-id]");if(!n)return;const f=S.fav.find(x=>x.id===n.dataset.id);wp.kaynak="fav";wp.src={a:f.ar||"",m:f.metin,k:f.kaynak};close();vDuvar(el)}}));
  el.querySelector("#add").onclick=async()=>{await redraw();if(await saveWp(cv,`kilit-ekrani-${slug(wp.src.k||"nur")||"nur"}.jpg`))
    sheet(`<h3>Kilit ekranına koy</h3><p class="small"><b>iPhone:</b> Açılan pencerede “Resmi Kaydet” → Fotoğraflar'da resmi aç → Paylaş → “Duvar Kâğıdı Olarak Kullan” → “Kilit Ekranı”.</p><p class="small"><b>Android:</b> Galeri'de resmi aç → ⋮ → “Duvar kağıdı olarak ayarla” → “Kilit ekranı”.</p><p class="muted small">Bunu her gün elle yapmak istemezsen, “Tümünü indir” ile bir kez kur; telefon her gün kendisi değiştirsin.</p><button class="btn full" id="hw">Otomatik kurulumu göster</button>`,(sh,close)=>{sh.querySelector("#hw").onclick=()=>{close();sheet(kurulumHTML())}})};
  el.querySelector("#paylas").onclick=async()=>{await redraw();const b=await toBlob(cv,"image/jpeg",.93);if(!b){toast("Resim hazırlanamadı");return}
    const f=new File([b],`duvar-${slug(wp.src.k||"nur")||"nur"}.jpg`,{type:"image/jpeg"});
    if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f]});return}catch(e){if(e&&e.name==="AbortError")return}}
    if(indir(b,f.name))sheet(`<h3>Duvar kâğıdı yap</h3><p class="small">Telefonunuz doğrudan paylaşmaya izin vermedi, resim Galeri'ye kaydedildi. Galeri'de resmi açın → ⋮ → <b>Duvar kağıdı olarak ayarla</b>.</p>`)};
  el.querySelector("#zip").onclick=e=>zipAll(e.currentTarget);
  el.querySelector("#how").onclick=()=>sheet(kurulumHTML());
}

