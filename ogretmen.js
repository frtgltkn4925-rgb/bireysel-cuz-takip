"use strict";
/* ===== Öğretmen ders programı =====
   Programın fotoğrafı çekilir, uygulama dersleri okumaya çalışır, öğretmen tabloyu kontrol edip kaydeder.
   Bildirim panosunda o günün dersleri ve sınıfları görünür. Her şey telefonda kalır. */
const DP_GUN=["Pazartesi","Salı","Çarşamba","Perşembe","Cuma"];
const DP_SAAT=[["08:30","09:10"],["09:20","10:00"],["10:10","10:50"],["11:00","11:40"],["11:50","12:30"],["13:10","13:50"],["14:00","14:40"],["14:50","15:30"]];
function dpVeri(){if(!S.ders||!S.ders.gun){S.ders={saat:DP_SAAT.map(x=>x.slice()),gun:DP_GUN.map(()=>DP_SAAT.map(()=>({d:"",s:""}))),bildirim:false}}return S.ders}
const dpBugun=()=>{const g=new Date().getDay();return g>=1&&g<=5?g-1:-1};
const dpDolu=c=>c&&(c.d||c.s);
function dpGunDersleri(gi){const D=dpVeri();return gi<0?[]:D.gun[gi].map((c,i)=>({...c,i,bas:D.saat[i][0],bit:D.saat[i][1]})).filter(dpDolu)}
function dpSimdi(){const gi=dpBugun();if(gi<0)return null;const n=new Date(),dk=n.getHours()*60+n.getMinutes(),m=t=>{const [h,mm]=t.split(":").map(Number);return h*60+mm};
  const l=dpGunDersleri(gi);for(const c of l){if(dk<m(c.bas))return{tur:"sonraki",c};if(dk<=m(c.bit))return{tur:"simdi",c}}return l.length?{tur:"bitti"}:null}

/* ----- Sayfa ----- */
function vOgretmen(el){
  const D=dpVeri(),gi=dpBugun(),sec=+(cur.p||(gi<0?0:gi));
  const bug=dpGunDersleri(gi),sm=dpSimdi();
  el.innerHTML=`<section class="dp-ust"><div><b>${gi<0?"Bugün hafta sonu":DP_GUN[gi]}</b><span>${gi<0?"Ders yok, iyi dinlenmeler.":bug.length?`${bug.length} ders · ${bug[0].bas} – ${bug[bug.length-1].bit}`:"Bugün için ders girilmemiş"}</span></div>
     ${sm&&sm.c?`<div class="dp-simdi"><small>${sm.tur==="simdi"?"Şu an":"Sıradaki"}</small><b>${esc(sm.c.d||"Ders")}</b><span>${esc(sm.c.s)} · ${sm.c.bas}</span></div>`:""}</section>
   <div class="row wrap" style="gap:8px;margin:12px 0">
     <button class="btn acc" id="dpFoto">${ic("phone",16)} Programın fotoğrafını çek</button>
     <button class="btn ghost" id="dpBil">${ic("bell",16)} Bildirimde ${D.bildirim?"gösteriliyor":"göster"}</button></div>
   <div class="seg" id="dpGun">${DP_GUN.map((g,i)=>`<button data-g="${i}" class="${i===sec?"on":""}">${g.slice(0,3)}</button>`).join("")}</div>
   <div class="card dp-tablo">${D.saat.map((s,i)=>{const c=D.gun[sec][i];return `<div class="dp-sat ${sec===gi&&sm&&sm.c&&sm.c.i===i?"on":""}">
      <div class="dp-no">${i+1}<small>${s[0]}</small></div>
      <input class="in" data-k="d" data-i="${i}" value="${esc(c.d)}" placeholder="Ders" aria-label="${i+1}. ders adı">
      <input class="in dp-sinif" data-k="s" data-i="${i}" value="${esc(c.s)}" placeholder="Sınıf" aria-label="${i+1}. ders sınıfı"></div>`}).join("")}</div>
   <details class="card" style="margin-top:10px"><summary><b>Ders saatleri</b> <span class="muted small">okulunuza göre değiştirin</span></summary>
     <div class="dp-saatler">${D.saat.map((s,i)=>`<label>${i+1}. ders <input type="time" class="in" data-sa="${i}" data-u="0" value="${s[0]}"> – <input type="time" class="in" data-sa="${i}" data-u="1" value="${s[1]}"></label>`).join("")}</div></details>
   <div id="dpFotoAlan"></div>
   <p class="muted small">Program ve fotoğraf yalnızca bu telefonda saklanır. Bildirim, uygulamayı açtığınızda ve ders saatleri değiştikçe (uygulama açıkken) güncellenir.</p>`;
  const kaydet=()=>{save();dersBildirimGuncelle(true)};
  el.querySelector("#dpGun").onclick=e=>{const b=e.target.closest("[data-g]");if(b)go("ogretmen-"+b.dataset.g)};
  el.querySelectorAll("[data-k]").forEach(inp=>inp.onchange=()=>{D.gun[sec][+inp.dataset.i][inp.dataset.k]=inp.value.trim();kaydet()});
  el.querySelectorAll("[data-sa]").forEach(inp=>inp.onchange=()=>{D.saat[+inp.dataset.sa][+inp.dataset.u]=inp.value;kaydet()});
  el.querySelector("#dpBil").onclick=dersBildirimAcKapa;
  el.querySelector("#dpFoto").onclick=dpFotoSec;
  IDB.get("ders-foto").then(b=>{if(b&&cur.v==="ogretmen"){const u=URL.createObjectURL(b);el.querySelector("#dpFotoAlan").innerHTML=`<h2 class="sec">Programın fotoğrafı</h2><img class="dp-foto" src="${u}" alt="Ders programı fotoğrafı">`}}).catch(()=>{})}

/* ----- Fotoğraftan okuma ----- */
const DP_KISA={MAT:"Matematik",MATU:"Matematik Uygulamaları",MATUY:"Matematik Uygulamaları",REH:"Rehberlik",TÜR:"Türkçe",TUR:"Türkçe",TRK:"Türkçe",FEN:"Fen Bilimleri",FENU:"Fen Uygulamaları",SOS:"Sosyal Bilgiler",ING:"İngilizce",İNG:"İngilizce",DİN:"Din Kültürü",DIN:"Din Kültürü",DKAB:"Din Kültürü",BED:"Beden Eğitimi",BES:"Beden Eğitimi",MÜZ:"Müzik",MUZ:"Müzik",GÖR:"Görsel Sanatlar",GOR:"Görsel Sanatlar",TEK:"Teknoloji ve Tasarım",BİL:"Bilişim Teknolojileri",BIL:"Bilişim Teknolojileri",KUR:"Kur'an-ı Kerim",PEY:"Peygamberimizin Hayatı",TAR:"Tarih",İNK:"İnkılap Tarihi",INK:"İnkılap Tarihi",ARP:"Arapça",ALM:"Almanca",SEÇ:"Seçmeli",SEC:"Seçmeli"};
function dpDersAdi(t){t=String(t||"").replace(/[|_—–~.,;:'"`*()]/g," ").replace(/\s+/g," ").trim();if(!t)return"";
  const k=t.toLocaleUpperCase("tr").replace(/\d+$/,"").replace(/\s/g,"");if(DP_KISA[k])return DP_KISA[k];
  const ilk=t.split(" ")[0].toLocaleUpperCase("tr").replace(/\d+$/,"");if(DP_KISA[ilk]&&t.split(" ").length===1)return DP_KISA[ilk];
  return t.length<=2?"":t.charAt(0).toLocaleUpperCase("tr")+t.slice(1).toLocaleLowerCase("tr")}
// "6/G", "6G", "GG", "&F", "7ID" gibi okumaları sınıfa çevirir; sınıf düzeyi okunamazsa en sık görülen düzey kullanılır
function dpSinifAyikla(t){const a=String(t||"").toLocaleUpperCase("tr").replace(/[^0-9A-ZÇĞİÖŞÜ\/]/g,"");if(!a)return null;
  let m=a.match(/^(1[0-2]|[1-9])\/?I?([A-ZÇĞİÖŞÜ])$/);if(m)return{n:m[1],h:m[2]};
  m=a.match(/^([GEB&SZTŞ])\/?([A-ZÇĞİÖŞÜ])$/);if(m)return{n:null,h:m[2]};
  if(a.length===1&&/^[^0-9A-Za-zÇĞİÖŞÜçğıöşü]/.test(String(t).trim())&&/[A-ZÇĞİÖŞÜ]/.test(a))return{n:null,h:a};
  return null}
function dpSiniflariDuzelt(T){const say={};T.flat().forEach(c=>{if(c&&c._n)say[c._n]=(say[c._n]||0)+1});const enSik=Object.entries(say).sort((a,b)=>b[1]-a[1])[0];
  T.forEach(g=>g.forEach(c=>{if(c&&c._h){c.s=(c._n||(enSik?enSik[0]:"?"))+"/"+c._h}delete c._n;delete c._h}));return T}
function dpHucre(metin){const sat=String(metin||"").split(/\n|\|/).map(x=>x.trim()).filter(x=>x&&/[0-9A-Za-zÇĞİÖŞÜçğıöşü]/.test(x));let sn=null,d=[];
  for(const l of sat){for(const p of l.split(/\s+/)){const s=!sn&&dpSinifAyikla(p);if(s){sn=s;continue}d.push(p)}}
  const ders=dpDersAdi(d.join(" "));return{d:ders,s:"",_n:sn&&sn.n,_h:sn&&sn.h}}

function dpFotoSec(){const i=document.createElement("input");i.type="file";i.accept="image/*";i.setAttribute("capture","environment");
  i.onchange=async()=>{const f=i.files&&i.files[0];if(!f)return;try{await IDB.put("ders-foto",f)}catch(e){}dpOku(f)};i.click()}
async function dpOku(f){
  let iptal=false;
  sheet(`<h3>Program okunuyor</h3><p class="small" id="dpDurum">Yazı tanıma hazırlanıyor… İlk seferde birkaç dakika sürebilir.</p><div class="dp-bar"><i id="dpBar"></i></div><button class="btn full ghost" id="dpIptal" style="margin-top:12px">Vazgeç</button>`,(sh,close)=>{sh.querySelector("#dpIptal").onclick=()=>{iptal=true;close()}});
  const durum=t=>{const e=document.getElementById("dpDurum");if(e)e.textContent=t},bar=p=>{const e=document.getElementById("dpBar");if(e)e.style.width=Math.round(p*100)+"%"};
  try{await loadScript("https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js");
    const img=await dpKucult(f);
    let izgaraModu=false;
    const w=await Tesseract.createWorker("tur",1,{logger:m=>{if(m.status==="recognizing text"){if(!izgaraModu){durum("Dersler okunuyor…");bar(m.progress)}}else if(/load|init/.test(m.status))durum("Yazı tanıma hazırlanıyor…")}});
    let tablo=null;const iz=dpIzgara(img);
    if(iz){izgaraModu=true;durum("Tablo bulundu, hücreler okunuyor…");try{await w.setParameters({tessedit_pageseg_mode:"6"});tablo=await dpIzgaraOku(w,img,iz,p=>{bar(p);if(iptal)throw new Error("iptal")})}catch(e){if(iptal){await w.terminate();return}tablo=null}}
    if(!tablo){izgaraModu=false;durum("Dersler okunuyor…");await w.setParameters({tessedit_pageseg_mode:"3"});const {data}=await w.recognize(img);
      const kelimeler=(data.words||[]).filter(x=>x.confidence>30&&x.text.trim()).map(x=>({t:x.text.trim(),x:(x.bbox.x0+x.bbox.x1)/2,y:(x.bbox.y0+x.bbox.y1)/2,h:x.bbox.y1-x.bbox.y0}));
      const T=dpCozumle(kelimeler);if(T)tablo={T,saat:[]}}
    await w.terminate();if(iptal)return;
    document.querySelectorAll(".sheet-bg").forEach(x=>x.remove());
    if(!tablo){toast("Tablo okunamadı. Dersleri elle girebilirsiniz.");render();return}
    dpOnayla(tablo.T,tablo.saat)}
  catch(e){console.warn(e);document.querySelectorAll(".sheet-bg").forEach(x=>x.remove());if(!iptal)sheet(`<h3>Fotoğraf okunamadı</h3><p class="small">İnternet bağlantınızı kontrol edin ya da dersleri tabloya elle yazın. Fotoğraf sayfanın altında duruyor, bakarak doldurabilirsiniz.</p><button class="btn full" id="tm">Tamam</button>`,(sh,c)=>{sh.querySelector("#tm").onclick=()=>{c();render()}})}}

/* Tablo çizgilerini bulup hücreleri tek tek okur (taranmış ya da düz çekilmiş programlar için en sağlam yol) */
function dpIzgara(cv){const W=cv.width,H=cv.height,px=cv.getContext("2d").getImageData(0,0,W,H).data,k=new Uint8Array(W*H);
  for(let i=0;i<W*H;i++)k[i]=(px[i*4]+px[i*4+1]+px[i*4+2])<420?1:0;
  const grup=l=>{const o=[];for(const v of l){if(o.length&&v-o[o.length-1][o[o.length-1].length-1]<=4)o[o.length-1].push(v);else o.push([v])}return o.map(a=>Math.round(a.reduce((x,y)=>x+y,0)/a.length))};
  const tamamla=l=>{if(l.length<3)return l;const d=l.slice(1).map((v,i)=>v-l[i]).sort((a,b)=>a-b),tip=d[Math.floor(d.length/2)],o=[l[0]];
    for(const v of l.slice(1)){const gap=v-o[o.length-1],n=Math.round(gap/tip);if(n>=2&&Math.abs(gap-n*tip)<tip*.25)for(let j=1;j<n;j++)o.push(o[o.length-1]+Math.round(gap/n));o.push(v)}return o};
  const sat=[];for(let y=0;y<H;y++){let c=0;for(let x=0;x<W;x++)c+=k[y*W+x];if(c>W*0.45)sat.push(y)}
  let hy=tamamla(grup(sat));if(hy.length<4)return null;const top=hy[0],bot=hy[hy.length-1];
  const sut=[];for(let x=0;x<W;x++){let c=0;for(let y=top;y<bot;y++)c+=k[y*W+x];if(c>(bot-top)*0.6)sut.push(x)}
  const vx=grup(sut);if(vx.length<4)return null;return{hy,vx}}
async function dpIzgaraOku(w,cv,iz,ilerle){
  const {hy,vx}=iz,hucre=async(r,c)=>{const x0=vx[c]+5,y0=hy[r]+5,x1=vx[c+1]-5,y1=hy[r+1]-5;if(x1-x0<12||y1-y0<12)return"";
    const {data}=await w.recognize(cv,{rectangle:{left:x0,top:y0,width:x1-x0,height:y1-y0}});return(data.text||"").trim()};
  // gün satırlarını ilk sütundan bul
  const gunRe=[/^paz(artesi|artes)/i,/^sal/i,/^[çc]ar/i,/^per/i,/^cuma$/i],satirlar=[],toplam=(hy.length-1)*(vx.length-1);let say=0;
  for(let r=0;r<hy.length-1;r++){const t=(await hucre(r,0)).toLocaleLowerCase("tr").replace(/[^a-zçğıöşü]/g,"");ilerle(++say/toplam);const gi=gunRe.findIndex(re=>re.test(t));if(gi>=0&&satirlar[gi]==null)satirlar[gi]=r}
  if(satirlar.filter(x=>x!=null).length<3)return null;
  const ilkSatir=Math.min(...satirlar.filter(x=>x!=null)),saatler=[];
  // başlık satırından ders saatlerini oku
  for(let c=1;c<vx.length-1;c++){const t=await hucre(Math.max(0,ilkSatir-1),c);ilerle(++say/toplam);const z=t.match(/\d{1,2}[:.]\d{2}/g);saatler.push(z&&z.length>=2?[z[0].replace(".",":").padStart(5,"0"),z[1].replace(".",":").padStart(5,"0")]:null)}
  const T=DP_GUN.map(()=>[]);
  for(let gi=0;gi<5;gi++){const r=satirlar[gi];for(let c=1;c<vx.length-1;c++){if(r==null){T[gi].push({d:"",s:""});continue}T[gi].push(dpHucre(await hucre(r,c)));ilerle(++say/toplam)}}
  dpSiniflariDuzelt(T);
  // sütunun hiç dersi ve saati yoksa (Ma., Üc. gibi) sondan kırp
  let n=T[0].length;while(n>0&&!saatler[n-1]&&T.every(g=>!dpDolu(g[n-1])))n--;
  return{T:T.map(g=>g.slice(0,n)),saat:saatler.slice(0,n)}}
function dpKucult(f){return new Promise((res,rej)=>{const u=URL.createObjectURL(f),im=new Image();im.onload=()=>{const k=Math.min(1,2200/Math.max(im.width,im.height)),c=document.createElement("canvas");c.width=im.width*k;c.height=im.height*k;
  const x=c.getContext("2d");x.filter="grayscale(1) contrast(1.35)";x.drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);res(c)};im.onerror=rej;im.src=u})}
/* Kelimeleri gün başlıklarına ve ders sıralarına göre hücrelere yerleştirir. Günler satırda ya da sütunda olabilir. */
function dpCozumle(W){
  const gunRe=[/^paz(artesi)?/i,/^sal[ıi]?/i,/^[çc]ar(şamba|samba)?/i,/^per(şembe|sembe)?/i,/^cum(a)?$/i];
  const norm=t=>t.toLocaleLowerCase("tr").replace(/[^a-zçğıöşü0-9\/\-]/g,"");
  gunRe[0]=/^pazartes/i;const aday=gunRe.map(re=>W.filter(w=>re.test(norm(w.t))&&norm(w.t).length>=3));
  const sec=ek=>aday.map(l=>l.length?l.reduce((a,b)=>a[ek]<=b[ek]?a:b):null);
  const sirali=(l,ek)=>{const v=l.filter(Boolean);return v.length>=3&&v.every((w,i)=>i===0||w[ek]>v[i-1][ek])};
  const satirAday=sec("x"),sutunAday=sec("y");const gunler=sirali(satirAday,"y")?satirAday:sirali(sutunAday,"x")?sutunAday:satirAday;
  const bulunan=gunler.filter(Boolean);if(bulunan.length<3)return null;
  const yayX=Math.max(...bulunan.map(w=>w.x))-Math.min(...bulunan.map(w=>w.x)),yayY=Math.max(...bulunan.map(w=>w.y))-Math.min(...bulunan.map(w=>w.y));
  const gunSutun=yayX>yayY; // günler yan yana mı?
  const A=gunSutun?"x":"y",B=gunSutun?"y":"x";
  const gunKoor=DP_GUN.map((_,i)=>gunler[i]?gunler[i][A]:null);
  // eksik günleri komşulardan tahmin et
  for(let i=0;i<5;i++)if(gunKoor[i]==null){const l=gunKoor.map((v,j)=>[v,j]).filter(([v])=>v!=null);if(l.length>=2){const [[v1,j1],[v2,j2]]=[l[0],l[l.length-1]];gunKoor[i]=v1+(v2-v1)*(i-j1)/(j2-j1)}}
  const adim=Math.abs(gunKoor[4]-gunKoor[0])/4||100,basGun=Math.min(...bulunan.map(w=>w[B]));
  const icerik=W.filter(w=>!bulunan.includes(w)&&!/^([1-9]|10)\.?$/.test(w.t)&&(gunSutun?w[B]>basGun+adim*0.1:w[B]>basGun-1e9)&&!/^(\d{1,2}[:.]\d{2}|\d{1,2}\.?|ders|saat|gün|gun|günler)$/i.test(w.t));
  // ders sıralarını diğer eksende boşluklara göre kümele
  const ek=icerik.map(w=>w[B]).sort((a,b)=>a-b);if(!ek.length)return null;
  const ortH=icerik.reduce((s,w)=>s+w.h,0)/icerik.length||20,kumeler=[[ek[0]]];
  for(let i=1;i<ek.length;i++){if(ek[i]-ek[i-1]>ortH*(gunSutun?1.6:2.2))kumeler.push([]);kumeler[kumeler.length-1].push(ek[i])}
  let sira=kumeler.slice(0,10).map(k=>({a:k[0]-ortH*0.6,b:k[k.length-1]+ortH*0.6}));
  // başlıkta 1., 2., 3. … ders numaraları varsa sıraları onlara göre kur (boş kalan ders saatleri kaymasın)
  const nums=W.filter(w=>/^([1-9]|10)\.?$/.test(w.t)&&!bulunan.includes(w)).map(w=>({n:parseInt(w.t),v:w[B],a:w[A]}));
  const basA=Math.min(...gunKoor),baslik=nums.filter(q=>q.a<basA-adim*0.3);
  const tekil=[];baslik.sort((a,b)=>a.n-b.n).forEach(q=>{if(!tekil.find(t=>t.n===q.n))tekil.push(q)});
  if(tekil.length>=4&&tekil.every((q,i)=>i===0||q.v>tekil[i-1].v)){const ara=(tekil[tekil.length-1].v-tekil[0].v)/(tekil[tekil.length-1].n-tekil[0].n);
    sira=Array.from({length:Math.min(10,tekil[tekil.length-1].n)},(_,i)=>{const mrk=tekil[0].v+(i+1-tekil[0].n)*ara;return{a:mrk-ara/2,b:mrk+ara/2}})}
  const T=DP_GUN.map(()=>sira.map(()=>[]));
  for(const w of icerik){let gi=0,en=1e9;gunKoor.forEach((v,i)=>{const d=Math.abs(w[A]-v);if(d<en){en=d;gi=i}});if(en>adim*0.75)continue;
    const si=sira.findIndex(r=>w[B]>=r.a&&w[B]<=r.b);if(si<0)continue;T[gi][si].push(w)}
  const sinifRe=/^(\d{1,2})\s*[\/\-.]?\s*([A-ZÇĞİÖŞÜa-zçğıöşü])$/;
  return dpSiniflariDuzelt(T.map(gun=>gun.map(ks=>{ks.sort((a,b)=>a.y-b.y||a.x-b.x);return dpHucre(ks.map(k=>k.t).join(" "))})))}
function dpOnayla(T,saat){const D=dpVeri(),n=Math.max(...T.map(g=>g.length));saat=(saat||[]).slice(0,n);const saatVar=saat.filter(Boolean).length;
  const dolu=T.reduce((s,g)=>s+g.filter(dpDolu).length,0);
  sheet(`<h3>Okunan program</h3><p class="small">${dolu} ders bulundu${saatVar?`, ${saatVar} ders saati okundu`:""}. Kontrol edin; yanlışları sonra sayfadaki tablodan düzeltebilirsiniz.</p>
   <div class="dp-onizle"><table><thead><tr><th></th>${DP_GUN.map(g=>`<th>${g.slice(0,3)}</th>`).join("")}</tr></thead><tbody>${Array.from({length:n},(_,i)=>`<tr><th>${i+1}${saat[i]?`<br><small>${saat[i][0]}</small>`:""}</th>${T.map(g=>{const c=g[i]||{};return `<td>${esc(c.d||"")}${c.s?`<br><b>${esc(c.s)}</b>`:""}</td>`}).join("")}</tr>`).join("")}</tbody></table></div>
   <button class="btn full acc" id="dpOk" style="margin-top:12px">Tabloya aktar</button><button class="btn full ghost" id="dpNo" style="margin-top:8px">Vazgeç</button>`,(sh,close)=>{
    sh.querySelector("#dpNo").onclick=close;
    sh.querySelector("#dpOk").onclick=()=>{while(D.saat.length<n){D.saat.push(["",""]);D.gun.forEach(g=>g.push({d:"",s:""}))}saat.forEach((z,i)=>{if(z)D.saat[i]=z});if(saatVar&&D.saat.length>n){D.saat=D.saat.slice(0,n);D.gun=D.gun.map(g=>g.slice(0,n))}D.gun.forEach(g=>g.forEach(c=>{c.d="";c.s=""}));T.forEach((g,gi)=>g.forEach((c,i)=>{if(dpDolu(c))D.gun[gi][i]={d:c.d,s:c.s}}));save();close();toast("Program aktarıldı, kontrol etmeyi unutmayın");dersBildirimGuncelle(true);render()}})}

/* ----- Bildirim ----- */
async function dersBildirimAcKapa(){const D=dpVeri();
  if(typeof Notification==="undefined"||!("serviceWorker" in navigator)){toast("Bu telefon bildirim göstermeyi desteklemiyor");return}
  if(D.bildirim){D.bildirim=false;save();try{const r=await navigator.serviceWorker.ready;(await r.getNotifications({tag:"bct-ders"})).forEach(n=>n.close())}catch(e){}render();return}
  let izin=Notification.permission;if(izin!=="granted")try{izin=await Notification.requestPermission()}catch(e){}
  if(izin!=="granted"){toast("Bildirim izni verilmedi. Telefon ayarlarından izin verin.");return}
  D.bildirim=true;save();await dersBildirimGuncelle(true);toast("Bugünün dersleri bildirim panosuna eklendi");render()}
function dpResim(gi,l,akt){const W=720,satH=58,H=96+Math.max(1,l.length)*satH+18,c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d");
  const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,"#1c2f5e");g.addColorStop(1,"#2b4c8c");x.fillStyle=g;x.fillRect(0,0,W,H);
  x.fillStyle="#ffd27a";x.font="700 30px Manrope,sans-serif";x.textAlign="left";x.fillText(`${DP_GUN[gi]} · Ders programı`,30,50);
  x.fillStyle="rgba(255,255,255,.7)";x.font="500 22px Manrope,sans-serif";x.textAlign="right";x.fillText(new Date().toLocaleDateString("tr-TR",{day:"numeric",month:"long"}),W-30,50);
  if(!l.length){x.textAlign="left";x.fillStyle="#fff";x.font="500 26px Manrope,sans-serif";x.fillText("Bugün ders yok.",30,118);return c.toDataURL("image/png")}
  l.forEach((d,k)=>{const y=76+k*satH,on=d.i===akt;x.fillStyle=on?"#f5a623":"rgba(255,255,255,.08)";rr(x,20,y,W-40,satH-8,14);x.fill();
    x.textAlign="left";x.fillStyle=on?"#1c2f5e":"rgba(255,255,255,.75)";x.font="700 22px Manrope,sans-serif";x.fillText(`${d.i+1}.`,38,y+33);
    x.font="600 22px Manrope,sans-serif";x.fillText(`${d.bas}–${d.bit}`,80,y+33);
    x.fillStyle=on?"#1c2f5e":"#fff";x.font="700 25px Manrope,sans-serif";let ad=d.d||"Ders";while(x.measureText(ad).width>300&&ad.length>4)ad=ad.slice(0,-2)+"…";x.fillText(ad,240,y+34);
    x.textAlign="right";x.font="800 26px Manrope,sans-serif";x.fillText(d.s||"",W-40,y+34)});
  return c.toDataURL("image/png")}
async function dersBildirimGuncelle(zorla){const D=S.ders;
  if(!D||!D.bildirim||typeof Notification==="undefined"||Notification.permission!=="granted"||!("serviceWorker" in navigator))return;
  try{const gi=dpBugun(),l=dpGunDersleri(gi),sm=dpSimdi(),akt=sm&&sm.c?sm.c.i:-1;
    const baslik=gi<0?"Bugün ders yok":!l.length?`${DP_GUN[gi]} · Ders girilmemiş`:sm&&sm.c?`${sm.tur==="simdi"?"Şu an":"Sıradaki"}: ${sm.c.d||"Ders"}${sm.c.s?" · "+sm.c.s:""} (${sm.c.bas})`:`${DP_GUN[gi]} · Dersler bitti`;
    const r=await navigator.serviceWorker.ready,eski=(await r.getNotifications({tag:"bct-ders"}))[0];
    if(!zorla&&eski&&eski.title===baslik&&eski.data&&eski.data.gun===bugunISO())return;
    await r.showNotification(baslik,{body:"",image:dpResim(gi<0?0:gi,gi<0?[]:l,akt),tag:"bct-ders",renotify:false,silent:true,requireInteraction:true,icon:"icon-192.png",badge:"rozet.png",data:{url:"./#ogretmen",gun:bugunISO()}})}catch(e){console.warn("ders bildirimi",e)}}
setTimeout(()=>dersBildirimGuncelle(false),3000);setInterval(()=>dersBildirimGuncelle(false),60000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)dersBildirimGuncelle(false)});
function dpKart(){const D=S.ders,gi=dpBugun();
  if(!D||!D.gun)return `<div class="rw" data-go="ogretmen"><div class="ico">${ic("cal")}</div><div class="tx"><b>Öğretmenler için ders programı</b><span>Programınızın fotoğrafını çekin, günün dersleri bildirimde görünsün</span></div><span class="chev">${ic("chev",18)}</span></div>`;
  const l=dpGunDersleri(gi),sm=dpSimdi();
  return `<div class="rw" data-go="ogretmen"><div class="ico">${ic("cal")}</div><div class="tx"><b>${gi<0?"Hafta sonu, ders yok":sm&&sm.c?`${sm.tur==="simdi"?"Şu an":"Sıradaki"}: ${esc(sm.c.d||"Ders")} · ${esc(sm.c.s)}`:l.length?"Bugünkü dersler bitti":"Bugün için ders girilmemiş"}</b><span>${gi<0?"Ders programınız":l.length?l.map(c=>esc(c.s||c.d)).join(" · "):"Ders programını aç"}</span></div><span class="chev">${ic("chev",18)}</span></div>`}
