"use strict";
/* ============ KIBLE PUSULASI ============ */
const KABE=[21.422487,39.826206];
function kibleAcisi(lat,lon){const r=Math.PI/180,f1=lat*r,f2=KABE[0]*r,dl=(KABE[1]-lon)*r;
  const y=Math.sin(dl),x=Math.cos(f1)*Math.tan(f2)-Math.sin(f1)*Math.cos(dl);return (Math.atan2(y,x)/r+360)%360}
function kabeMesafe(lat,lon){const r=Math.PI/180,a=Math.sin((KABE[0]-lat)*r/2)**2+Math.cos(lat*r)*Math.cos(KABE[0]*r)*Math.sin((KABE[1]-lon)*r/2)**2;return Math.round(6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)))}
let kibleDinle=null;
function kibleDurdur(){if(kibleDinle){window.removeEventListener("deviceorientationabsolute",kibleDinle);window.removeEventListener("deviceorientation",kibleDinle);kibleDinle=null}}
window.addEventListener("hashchange",()=>{if(!location.hash.startsWith("#kible"))kibleDurdur()});

function vKible(el){
  kibleDurdur();
  const konum=kibleKonum;
  if(!konum.lat&&!S.il){el.innerHTML=`<div class="card empty">Kıble yönü için konumunuz gerekli.<br><br><button class="btn" id="gps">${ic("pin",16)} Konumumu kullan</button><br><br><button class="btn ghost" id="il">Şehir seç</button></div>`;
    el.querySelector("#gps").onclick=()=>kibleGps(el);el.querySelector("#il").onclick=()=>ilSec(()=>vKible(el));return}
  const lat=konum.lat||S.il.lat,lon=konum.lon||S.il.lon,qa=kibleAcisi(lat,lon);
  const tik=Array.from({length:72},(_,i)=>{const a=i*5,uzun=a%30===0;return `<line x1="150" y1="${uzun?14:19}" x2="150" y2="26" transform="rotate(${a} 150 150)" class="${uzun?"tu":"tk"}"/>`}).join("");
  const yon=[["K",0],["D",90],["G",180],["B",270]].map(([h,a])=>`<text x="150" y="46" transform="rotate(${a} 150 150)" class="${h==="K"?"kz":""}">${h}</text>`).join("");
  el.innerHTML=`<section class="kible-k">
    <div class="kb-ust"><span id="kbYer">${esc(konum.lat?"Bulunduğunuz konum":S.il.ad)}</span><span>Kâbe'ye ${kabeMesafe(lat,lon).toLocaleString("tr-TR")} km</span></div>
    <div class="pusula" id="pus">
      <div class="ok-sabit"></div>
      <svg viewBox="0 0 300 300" id="kadran"><circle cx="150" cy="150" r="140" class="dis"/><circle cx="150" cy="150" r="104" class="ic"/>${tik}${yon}
        <g transform="rotate(${qa} 150 150)"><line x1="150" y1="150" x2="150" y2="58" class="kbcizgi"/><g transform="translate(150 50)"><rect x="-13" y="-13" width="26" height="26" rx="3" class="kabe"/><rect x="-13" y="-6" width="26" height="4" class="kusak"/></g></g>
        <circle cx="150" cy="150" r="6" class="merkez"/></svg>
    </div>
    <div class="kb-derece"><b id="kbFark">${Math.round(qa)}°</b><span id="kbYazi">Kıble, kuzeyden saat yönünde ${Math.round(qa)}°</span></div>
   </section>
   <div class="row wrap" style="gap:8px;justify-content:center;margin:12px 0"><button class="btn" id="bas">${ic("kible",16)} Pusulayı başlat</button><button class="btn ghost" id="gps">${ic("pin",16)} Konumu yenile</button></div>
   <div class="card small muted">Telefonu yere paralel tutun. Kâbe işareti üstteki altın oka geldiğinde kıbleye dönmüşsünüz demektir; telefon titrer ve çember yeşile döner. Pusula şaşıyorsa telefonla havada birkaç kez 8 çizin, metal eşyalardan ve mıknatıslı kılıflardan uzak durun.</div>`;
  el.querySelector("#gps").onclick=()=>kibleGps(el);
  const kad=el.querySelector("#kadran"),pus=el.querySelector("#pus"),fark=el.querySelector("#kbFark"),yazi=el.querySelector("#kbYazi"),bas=el.querySelector("#bas");
  let yon0=null,titredi=false,son=0;
  const goster=h=>{if(yon0===null)yon0=h;let d=((h-yon0+540)%360)-180;yon0=(yon0+d*.25+360)%360;
    const now=performance.now();if(now-son<30)return;son=now;
    kad.style.transform=`rotate(${-yon0}deg)`;
    const sapma=((qa-yon0+540)%360)-180,mutlak=Math.abs(Math.round(sapma));
    const tamam=mutlak<=4;pus.classList.toggle("tamam",tamam);
    fark.textContent=tamam?"Kıble":`${mutlak}°`;
    yazi.textContent=tamam?"Kıbleye döndünüz":`${sapma>0?"Sağa":"Sola"} dönün`;
    if(tamam&&!titredi){titredi=true;try{navigator.vibrate&&navigator.vibrate(80)}catch(e){}}if(!tamam&&mutlak>10)titredi=false};
  const basla=async(dokunus)=>{
    if(dokunus===true&&typeof DeviceOrientationEvent!=="undefined"&&typeof DeviceOrientationEvent.requestPermission==="function"){try{const p=await DeviceOrientationEvent.requestPermission();if(p!=="granted")toast("Pusula için hareket sensörü izni gerekli")}catch(e){}}
    kibleDurdur();let geldi=false;
    kibleDinle=e=>{let h=null;if(typeof e.webkitCompassHeading==="number")h=e.webkitCompassHeading;else if((e.absolute||e.type==="deviceorientationabsolute")&&e.alpha!=null)h=360-e.alpha;
      if(h==null)return;const ekran=(screen.orientation&&screen.orientation.angle)||window.orientation||0;geldi=true;bas.classList.add("hide");goster((h+ekran+360)%360)};
    if("ondeviceorientationabsolute" in window)window.addEventListener("deviceorientationabsolute",kibleDinle);else window.addEventListener("deviceorientation",kibleDinle);
    setTimeout(()=>{if(!geldi&&cur.v==="kible"){yazi.textContent="Bu cihazda pusula algılanamadı. Kıble, kuzeyden saat yönünde "+Math.round(qa)+"°";bas.classList.remove("hide")}},2500)};
  bas.onclick=()=>basla(true);basla(false);
}
const kibleKonum={lat:0,lon:0};
function kibleGps(el){if(!navigator.geolocation)return toast("Bu telefonda konum kullanılamıyor");toast("Konum alınıyor…");
  navigator.geolocation.getCurrentPosition(p=>{kibleKonum.lat=p.coords.latitude;kibleKonum.lon=p.coords.longitude;vKible(el)},()=>toast("Konum izni verilmedi; şehir merkezine göre gösteriliyor"),{enableHighAccuracy:true,timeout:15000,maximumAge:300000})}
