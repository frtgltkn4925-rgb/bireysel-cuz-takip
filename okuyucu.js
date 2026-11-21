"use strict";
const zaman=t=>new Date(t).toLocaleString("tr-TR",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});
const arRakam=n=>String(n).replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d]);
const ls={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
function bildir(m,geriAl,etiket){document.querySelectorAll(".bildirim").forEach(x=>x.remove());const d=document.createElement("div");d.className="bildirim";d.setAttribute("role","status");d.textContent=m;
  if(geriAl){const b=document.createElement("button");b.textContent=etiket||"Geri al";b.onclick=()=>{d.remove();geriAl()};d.appendChild(b)}document.body.appendChild(d);setTimeout(()=>d.remove(),geriAl?5000:2800)}
function aralik(k){const [s,a]=CUZ[k-1];let es,ea;if(k===30){es=114;ea=SURELER[113][1]}else{const [ns,na]=CUZ[k];if(na===1){es=ns-1;ea=SURELER[es-1][1]}else{es=ns;ea=na-1}}return{s,a,es,ea}}
/* ===== Metin ===== */
const BAS=[0];for(let i=0;i<114;i++)BAS.push(BAS[i]+SURELER[i][1]);
const BESM=/^بِسْمِ\s+\S+\s+\S+\s+\S+\s*/;
/* ===== Mushaf görünümü (uygulama ve internetsiz dosya ortak) ===== */
const MUSHAF_CSS=`
.ms{max-width:760px;margin:0 auto}
.sf{margin:0 auto 26px;max-width:760px}
.sfb{display:flex;justify-content:space-between;align-items:flex-end;padding:0 6px 6px;font-family:'Amiri',serif;color:#5b4b2a;font-size:15px;direction:rtl}
.sfb .sn{font-size:17px}
.cerceve{background:#fdf6e3;border:5px solid #8b7a50;box-shadow:inset 0 0 0 3px #fdf6e3,inset 0 0 0 5px #8b7a50,inset 0 0 0 9px #fdf6e3,inset 0 0 0 10px #8b7a50,0 2px 10px rgba(80,60,20,.15);padding:18px 16px}
.sfn{text-align:center;font-family:'Amiri',serif;color:#5b4b2a;font-size:14px;margin-top:6px}
.ayetler{direction:rtl;text-align:justify;text-align-last:justify;font-family:'Amiri Quran','Amiri','Scheherazade New','Noto Naskh Arabic','Geeza Pro',serif;font-size:var(--yb,30px);line-height:var(--sa,2.25);color:#111;word-spacing:1px}
.ayetler.son{text-align-last:center}
.ay{border-radius:8px;transition:background .25s}
.ay.su{background:#f1dc9e}
.al{color:#c0262d}
.vk{color:#c0262d;font-size:.8em}
.no{display:inline-grid;place-items:center;width:1.25em;height:1.25em;border-radius:50%;background:#6b5a35;color:#f6e7bb;font-family:'Amiri',serif;font-size:.5em;line-height:1;vertical-align:middle;margin:0 .2em;box-shadow:0 0 0 .12em #fdf6e3,0 0 0 .2em #6b5a35}
.sb{margin:6px 0 10px;text-align:center;border:3px double #8b7a50;border-radius:10px;padding:4px 8px;background:#f4e9c8;font-family:'Amiri',serif;color:#3f3418;font-size:calc(var(--yb,30px)*.72);direction:rtl}
.bsm{font-family:'Amiri Quran','Amiri',serif;text-align:center;font-size:calc(var(--yb,30px)*.95);color:#111;margin:0 0 4px;direction:rtl}
.lat{display:block;direction:ltr;text-align:left;font:italic 15px/1.6 Georgia,serif;color:#5b5240;margin:2px 0 8px;text-align-last:auto}
.ayetler.latinli{text-align-last:auto}.ayetler.latinli .ay{display:block;padding:4px 2px;border-bottom:1px dashed #e4dcc8}`;
const SURE_AR=["الفاتحة","البقرة","آل عمران","النساء","المائدة","الأنعام","الأعراف","الأنفال","التوبة","يونس","هود","يوسف","الرعد","إبراهيم","الحجر","النحل","الإسراء","الكهف","مريم","طه","الأنبياء","الحج","المؤمنون","النور","الفرقان","الشعراء","النمل","القصص","العنكبوت","الروم","لقمان","السجدة","الأحزاب","سبأ","فاطر","يس","الصافات","ص","الزمر","غافر","فصلت","الشورى","الزخرف","الدخان","الجاثية","الأحقاف","محمد","الفتح","الحجرات","ق","الذاريات","الطور","النجم","القمر","الرحمن","الواقعة","الحديد","المجادلة","الحشر","الممتحنة","الصف","الجمعة","المنافقون","التغابن","الطلاق","التحريم","الملك","القلم","الحاقة","المعارج","نوح","الجن","المزمل","المدثر","القيامة","الإنسان","المرسلات","النبأ","النازعات","عبس","التكوير","الانفطار","المطففين","الانشقاق","البروج","الطارق","الأعلى","الغاشية","الفجر","البلد","الشمس","الليل","الضحى","الشرح","التين","العلق","القدر","البينة","الزلزلة","العاديات","القارعة","التكاثر","العصر","الهمزة","الفيل","قريش","الماعون","الكوثر","الكافرون","النصر","المسد","الإخلاص","الفلق","الناس"];
const HAREKE=/[ؐ-ًؚ-ٰٟۖ-ۭ]/g;
function ayetSusle(t){return esc(t).split(" ").map(w=>{const yal=w.replace(HAREKE,"").replace(/[ٱأإآ]/g,"ا");let o=w.replace(/([ۖ-ۜ])/g,'<span class="vk">$1</span>');return yal.includes("لله")?`<span class="al">${o}</span>`:o}).join(" ")}
function mushafHTML(ays,k,latinVar){
  let h="",sayfa=null,buf=[],ilk=true;
  const bosalt=son=>{if(buf.length)h+=`<div class="ayetler${son?" son":""}">${buf.join(" ")}</div>`;buf=[]};
  const kapatSayfa=()=>{if(sayfa===null)return;bosalt(true);h+=`</div><div class="sfn">${arRakam(sayfa)}</div></section>`};
  for(const x of ays){const p=x.p||("s"+x.s);
    if(p!==sayfa){kapatSayfa();sayfa=p;h+=`<section class="sf" id="sf${p}"><div class="sfb"><span>اَلْجُزْءُ ${arRakam(x.j||k)}</span><span class="sn">سُورَةُ ${SURE_AR[x.s-1]}</span><span>${x.p?arRakam(x.p):""}</span></div><div class="cerceve">`}
    if(x.n===1){bosalt(true);h+=`<div class="sb" id="s${x.s}">سُورَةُ ${SURE_AR[x.s-1]} · ${esc(SURELER[x.s-1][0])}</div>`;if(x.s!==1&&x.s!==9)h+=`<div class="bsm">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ</div>`}
    buf.push(`<span class="ay" data-g="${x.g}">${ayetSusle(x.a)} <span class="no">${arRakam(x.n)}</span>${latinVar&&x.l?`<span class="lat hide">${x.n}. ${esc(x.l)}</span>`:""}</span>`)}
  kapatSayfa();return h}
document.head.insertAdjacentHTML("beforeend","<style>"+MUSHAF_CSS+"</style>");
/* ===== Ses ===== */
const IMAMLAR=[["ar.abdurrahmaansudais","Abdurrahman es-Sudeys"],["ar.saoodshuraym","Suud eş-Şureym"],["ar.mahermuaiqly","Mahir el-Muaykılî"]];
const sesAdres=(im,g,i)=>[`https://cdn.islamic.network/quran/audio/64/${im}/${g}.mp3`,`https://cdn.islamic.network/quran/audio/128/${im}/${g}.mp3`,`https://cdn.islamic.network/quran/audio/192/${im}/${g}.mp3`,`https://api.islamic.app/v1/audio/ayah/${im}/${g}`][i];
const SDB={db:null,ac(){return this.db?Promise.resolve(this.db):new Promise((res,rej)=>{const r=indexedDB.open("noses",1);r.onupgradeneeded=()=>r.result.createObjectStore("s");r.onsuccess=()=>{this.db=r.result;res(r.result)};r.onerror=()=>rej(r.error)})},
 async al(k){try{const d=await this.ac();return await new Promise(res=>{const q=d.transaction("s").objectStore("s").get(k);q.onsuccess=()=>res(q.result||null);q.onerror=()=>res(null)})}catch(e){return null}},
 async koy(k,v){const d=await this.ac();return new Promise((res,rej)=>{const t=d.transaction("s","readwrite");t.objectStore("s").put(v,k);t.oncomplete=res;t.onerror=()=>rej(t.error)})}};
async function sesIndir(im,g){for(let i=0;i<4;i++){try{const r=await fetch(sesAdres(im,g,i));if(r.ok){const b=await r.blob();if(b.size>800)return b}}catch(e){}}return null}

/* ===== Okuyucu ===== */
let yb=+ls.get("no.yb")||32;
async function okuyucu(k,opt={}){
  const s0=(S.cuz[k]||{}).d;let imam=ls.get("no.imam")||IMAMLAR[0][0];
  const el=document.createElement("div");el.className="oku";el.style.setProperty("--yb",yb+"px");
  el.innerHTML=`<div class="oust"><button class="ik" id="kapat" aria-label="Kapat">✕</button><b>${k}. Cüz</b><button class="ik" id="lat" aria-label="Latin okunuş">Aa</button><button class="ik" id="kucuk" aria-label="Yazıyı küçült">A−</button><button class="ik" id="buyuk" aria-label="Yazıyı büyüt">A+</button></div>
   <div class="metin" id="metin"><div class="donen"></div></div>
   <div class="dok"><div>
     <div class="sat"><button class="yb" id="dinle" aria-label="Dinle">▶</button><select id="imam" aria-label="İmam">${IMAMLAR.map(([v,n])=>`<option value="${v}" ${v===imam?"selected":""}>${n}</option>`).join("")}</select><button class="kb" id="indir" aria-label="Sesi telefona indir">⬇ İndir</button></div>
     <div class="sat"><button class="kb" id="kay" aria-label="Otomatik kaydır">⇣ Kaydır</button><input type="range" id="hiz" min="1" max="10" value="${+(ls.get("no.hiz")||4)}" aria-label="Okuma hızı"><span class="et" id="hizEt"></span></div>
     <div class="sat"><button class="kb" id="mik" aria-label="Sesli komut">🎤</button><button class="kb" id="gizle" aria-label="Kontrolleri gizle">⤢</button>${s0?`<button class="okudum" disabled style="opacity:.6">✓ Okundu</button>`:`<button class="okudum" id="okudum">✓ Cüzü okudum</button>`}</div>
     <div class="sat" style="min-height:16px"><span class="et" id="bilgi" style="flex:1">Hazır</span><span class="et" id="mikEt">🎤 “dur” · “devam”</span></div>
   </div></div>
   <button class="goster" id="goster">Kontrolleri göster</button>`;
  document.body.appendChild(el);document.body.style.overflow="hidden";
  const M=el.querySelector("#metin"),bilgi=el.querySelector("#bilgi"),dinleB=el.querySelector("#dinle"),hiz=el.querySelector("#hiz"),hizEt=el.querySelector("#hizEt"),kayB=el.querySelector("#kay");
  let liste=[],sira=-1,caliyor=false,deneme=0,kaydir=false,raf=0,son=0,birikim=0,dy=0,tanima=null,mikAcik=false;
  const au=new Audio();au.preload="auto";const sonraki=new Audio();sonraki.preload="auto";

  // yazı ve hız
  const yaz=()=>{el.style.setProperty("--yb",yb+"px");ls.set("no.yb",yb)};
  el.querySelector("#kucuk").onclick=()=>{yb=Math.max(22,yb-2);yaz()};el.querySelector("#buyuk").onclick=()=>{yb=Math.min(60,yb+2);yaz()};
  const HIZ=[0,8,12,17,23,30,38,48,60,75,95];
  const hizYaz=()=>{hizEt.textContent=["","Çok yavaş","Yavaş","Yavaş","Orta","Orta","Orta+","Hızlı","Hızlı","Çok hızlı","En hızlı"][hiz.value]+" ("+hiz.value+")";ls.set("no.hiz",hiz.value)};hizYaz();
  hiz.oninput=hizYaz;
  const dongu=t=>{if(!kaydir)return;const dt=son?Math.min(.1,(t-son)/1000):0;son=t;birikim+=HIZ[hiz.value]*dt;const a=Math.floor(birikim);if(a){M.scrollTop+=a;birikim-=a}
    if(M.scrollTop+M.clientHeight>=M.scrollHeight-2){kayDur();bilgi.textContent="Cüzün sonu";return}raf=requestAnimationFrame(dongu)};
  const kayBasla=()=>{if(kaydir)return;kaydir=true;son=0;kayB.classList.add("on");raf=requestAnimationFrame(dongu);if(innerWidth>innerHeight)setTimeout(()=>{if(kaydir)el.classList.add("gizli")},2500)};
  function kayDur(){kaydir=false;kayB.classList.remove("on");cancelAnimationFrame(raf)}
  kayB.onclick=()=>{if(kaydir){kayDur();return}if(caliyor){bildir("Ses çalarken sayfa okunan ayeti kendisi takip eder");return}kayBasla()};
  M.addEventListener("touchstart",e=>{dy=e.touches[0].clientY},{passive:true});
  M.addEventListener("touchmove",e=>{if(kaydir&&Math.abs(e.touches[0].clientY-dy)>12)kayDur()},{passive:true});
  el.querySelector("#gizle").onclick=()=>el.classList.add("gizli");el.querySelector("#goster").onclick=()=>el.classList.remove("gizli");

  // ses çalma
  const sesDur=()=>{caliyor=false;au.pause();dinleB.textContent="▶"};
  const vurgula=it=>{M.querySelectorAll(".ay.su").forEach(x=>x.classList.remove("su"));const sp=M.querySelector(`[data-g="${it.g}"]`);if(sp){sp.classList.add("su");sp.scrollIntoView({block:"center",behavior:"smooth"})}};
  const cal=async i=>{if(i<0||i>=liste.length){sesDur();sira=-1;bilgi.textContent=liste.length?"Cüz bitti":"";return}
    sira=i;const it=liste[i];caliyor=true;dinleB.textContent="⏸";vurgula(it);bilgi.textContent=`${SURELER[it.s-1][0]} ${it.n}`;
    const yerel=await SDB.al(imam+"/"+it.g);if(sira!==i)return;
    if(yerel){if(au.dataset.u)URL.revokeObjectURL(au.dataset.u);au.dataset.u=URL.createObjectURL(yerel);deneme=9;au.src=au.dataset.u}else{deneme=0;au.src=sesAdres(imam,it.g,0)}
    au.play().catch(()=>{});
    const nx=liste[i+1];if(nx&&!(await SDB.al(imam+"/"+nx.g))){sonraki.src=sesAdres(imam,nx.g,0);sonraki.load()}};
  au.onended=()=>{if(caliyor)cal(sira+1)};
  au.onerror=()=>{if(sira<0||!caliyor)return;if(deneme>=9)deneme=-1;deneme++;if(deneme<4){au.src=sesAdres(imam,liste[sira].g,deneme);au.play().catch(()=>{})}else{bildir("Bu ayetin sesi açılamadı, sonrakine geçiliyor");cal(sira+1)}};
  const sesDevam=()=>{if(!liste.length)return;kayDur();if(sira<0)cal(0);else{caliyor=true;dinleB.textContent="⏸";au.play().catch(()=>cal(sira))}};
  dinleB.onclick=()=>caliyor?sesDur():sesDevam();
  el.querySelector("#imam").onchange=async e=>{imam=e.target.value;ls.set("no.imam",imam);indirDurum();if(caliyor)cal(sira)};
  M.onclick=e=>{if(el.classList.contains("gizli")){el.classList.remove("gizli");return}const sp=e.target.closest(".ay");if(!sp)return;const i=liste.findIndex(x=>x.g===+sp.dataset.g);if(i>=0){kayDur();cal(i)}};

  // indirme
  const indirB=el.querySelector("#indir");let indiriliyor=false;
  const indirDurum=async()=>{if(liste.length&&await SDB.al(imam+"/"+liste[liste.length-1].g)&&await SDB.al(imam+"/"+liste[0].g)){indirB.textContent="✓ Telefonda";indirB.classList.add("on")}else{indirB.textContent="⬇ İndir";indirB.classList.remove("on")}};
  indirB.onclick=async()=>{if(indiriliyor||!liste.length)return;indiriliyor=true;indirB.disabled=true;const im=imam;let bitti=0,hata=0,i=0;
    const isci=async()=>{while(i<liste.length&&el.isConnected){const it=liste[i++],key=im+"/"+it.g;if(!(await SDB.al(key))){const b=await sesIndir(im,it.g);if(b){try{await SDB.koy(key,b)}catch(e){hata++}}else hata++}bitti++;indirB.textContent=`⬇ ${Math.round(bitti/liste.length*100)}%`}};
    await Promise.all([isci(),isci(),isci(),isci()]);indiriliyor=false;indirB.disabled=false;if(!el.isConnected)return;
    if(hata>=liste.length){indirB.textContent="⬇ İndir";bildir("Ses indirilemedi; internetten çalmaya devam eder.")}else{await indirDurum();bildir(hata?`İndirildi (${hata} ayet eksik)`:"Ses telefona indirildi; internetsiz de çalar.")}};

  // sesli komut
  const mikB=el.querySelector("#mik"),mikEt=el.querySelector("#mikEt");
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  const komut=metin=>{const t=metin.toLocaleLowerCase("tr");
    if(/\b(dur|durdur|bekle|sus)\b/.test(t)){sesDur();kayDur();bilgi.textContent="Durduruldu (sesli komut)";return}
    if(/\b(devam|başla|oku|devam et)\b/.test(t)){if(sira>=0||caliyor)sesDevam();else kayBasla();bilgi.textContent="Devam ediliyor";return}
    if(/hızlan|hızlı|daha hızlı/.test(t)){hiz.value=Math.min(10,+hiz.value+1);hizYaz();return}
    if(/yavaşla|yavaş/.test(t)){hiz.value=Math.max(1,+hiz.value-1);hizYaz();return}
    if(/sonraki|geç/.test(t)&&liste.length){cal(sira+1)}};
  const mikKapat=()=>{mikAcik=false;mikB.classList.remove("on");mikEt.textContent="🎤 “dur” · “devam”";try{tanima&&tanima.stop()}catch(e){}};
  mikB.onclick=()=>{if(!SR){bildir("Bu tarayıcı sesli komutu desteklemiyor. Chrome ile açmayı deneyin.");return}
    if(mikAcik){mikKapat();return}
    mikAcik=true;mikB.classList.add("on");mikEt.innerHTML='<span class="mik"><i></i>Dinliyor…</span>';
    const basla=()=>{tanima=new SR();tanima.lang="tr-TR";tanima.continuous=true;tanima.interimResults=false;
      tanima.onresult=e=>{for(let i=e.resultIndex;i<e.results.length;i++)if(e.results[i].isFinal)komut(e.results[i][0].transcript)};
      tanima.onerror=e=>{if(e.error==="not-allowed"||e.error==="service-not-allowed"){mikKapat();bildir("Mikrofon izni verilmedi. Sayfayı Chrome'da açıp mikrofona izin verin.")}};
      tanima.onend=()=>{if(mikAcik)setTimeout(()=>{if(mikAcik)try{basla()}catch(e){}},250)};
      try{tanima.start()}catch(e){}};
    basla()};

  // kapat / okudum
  let yerKaydetDis=()=>{};
  const kapat=()=>{try{yerKaydetDis()}catch(e){}sesDur();kayDur();mikKapat();au.src="";sonraki.src="";el.remove();document.body.style.overflow=""};
  el.querySelector("#kapat").onclick=kapat;
  const ok=el.querySelector("#okudum");ok&&(ok.onclick=()=>{kapat();S.cuz[k]={d:true,t:Date.now()};save();toast(k+". cüz okundu olarak işaretlendi. Allah kabul etsin.");render()});

  // metni yükle
  try{const ays=await cuzMetni(k);if(!el.isConnected)return;
    ays.forEach(x=>liste.push({s:x.s,n:x.n,g:x.g}));
    M.innerHTML=`<div class="ms">${mushafHTML(ays,k,true)}</div><div style="height:45vh"></div>`;indirDurum();
    const yerKey="no.yer."+k;let yerT=0;
    const yerKaydet=g=>{const it=liste.find(x=>x.g===g);if(it)ls.set(yerKey,JSON.stringify({g,s:it.s,n:it.n}))};
    const ustAyet=()=>{const ust=M.getBoundingClientRect().top+40;for(const a of M.querySelectorAll(".ay")){if(a.getBoundingClientRect().bottom>ust)return +a.dataset.g}return 0};
    M.addEventListener("scroll",()=>{clearTimeout(yerT);yerT=setTimeout(()=>{const g=ustAyet();if(g)yerKaydet(g)},500)},{passive:true});
    yerKaydetDis=()=>{const g=caliyor&&sira>=0?liste[sira].g:ustAyet();if(g)yerKaydet(g)};
    const hedef=opt.sure?M.querySelector("#s"+opt.sure):opt.sayfa?M.querySelector("#sf"+opt.sayfa):null;
    if(hedef){M.scrollTop=Math.max(0,hedef.getBoundingClientRect().top-M.getBoundingClientRect().top+M.scrollTop-10)}
    else try{const y=JSON.parse(ls.get(yerKey)||"null");const sp=y&&M.querySelector(`[data-g="${y.g}"]`);
      if(sp){M.scrollTop=Math.max(0,sp.getBoundingClientRect().top-M.getBoundingClientRect().top+M.scrollTop-60);sp.classList.add("su");setTimeout(()=>sp.classList.remove("su"),2500);
        bildir(`Kaldığın yerden devam: ${SURELER[y.s-1][0]} ${y.n}. ayet`,()=>{M.scrollTop=0;try{localStorage.removeItem(yerKey)}catch(e){}},"Baştan")}}catch(e){}
    let latin=ls.get("no.lat")==="1";const latYaz=()=>{el.querySelector("#lat").classList.toggle("on",latin);M.querySelectorAll(".lat").forEach(x=>x.classList.toggle("hide",!latin));M.querySelectorAll(".ayetler").forEach(x=>x.classList.toggle("latinli",latin));ls.set("no.lat",latin?"1":"0")};
    latYaz();el.querySelector("#lat").onclick=()=>{latin=!latin;latYaz()};
  }catch(e){M.innerHTML=`<p class="sol" style="text-align:center;margin-top:40px">Arapça metin yüklenemedi; internet bağlantısını kontrol edin.<br><br><a href="https://kuran.diyanet.gov.tr/mushaf" target="_blank" rel="noopener">Diyanet Kur'an Portalı'nda aç</a></p>`}
}

