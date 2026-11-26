"use strict";
/* ===== Bildirim panosunda günlük özet =====
   Uygulama kapalıyken telefon web sayfasının saat tutmasına izin vermez; geri sayım donar. Bu yüzden bildirim
   gün boyu doğru kalan bilgiyi gösterir: bugünün altı vakti ve günün dersleri, saatleriyle. Uygulama her açıldığında
   bugünle birlikte sonraki 7 günün özeti de kaydedilir; destekleyen telefonlarda servis çalışanı bunu ertesi gün
   uygulama açılmadan da yeniler (Periodic Background Sync). */
const OZ_TAG="bct-vakit";
const OZ_RENK=[["#2e1065","#6d28d9","#c4b5fd"],["#9a3412","#f97316","#fed7aa"],["#075985","#0ea5e9","#bae6fd"],["#854d0e","#eab308","#fef08a"],["#9f1239","#f43f5e","#fecdd3"],["#172554","#3b5bdb","#c7d2fe"]];
const OZ_DERS_RENK=["#22c55e","#14b8a6","#38bdf8","#a78bfa","#f472b6","#fb923c","#facc15","#4ade80"];
const OZ_AY=["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara"];
const OZ_GUN=["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"];
const ozAnahtar=d=>`${d.getFullYear()}-${ikiH(d.getMonth()+1)}-${ikiH(d.getDate())}`;
const ozKisa=t=>{t=String(t||"Ders");return t.length>14?t.slice(0,13).trim()+".":t};
function ozDersRenk(c){const k=String(c.s||c.d||"");let h=0;for(const ch of k)h=(h*31+ch.charCodeAt(0))>>>0;return OZ_DERS_RENK[h%OZ_DERS_RENK.length]}
// belirli bir günün verisi: vakitler (6 saat) ve o günün dersleri
async function ozGunVeri(gun){
  const g={tarih:gun,anahtar:ozAnahtar(gun),vakit:null,ders:null};
  if(S.vakitBildirim&&S.il){try{const v=await vakitGun(gun);if(v)g.vakit=v.slice(1,7)}catch(e){}}
  if(S.ders&&S.ders.bildirim){const w=gun.getDay(),gi=w>=1&&w<=5?w-1:-1;
    g.ders=gi<0?{yok:"Hafta sonu, ders yok",l:[]}:{l:dpGunDersleri(gi)};
    if(gi>=0&&!g.ders.l.length)g.ders.yok="Bu gün için ders girilmemiş"}
  return g.vakit||g.ders?g:null}
function ozMetin(g){const t=g.tarih,baslik=`${OZ_GUN[t.getDay()]} ${t.getDate()} ${OZ_AY[t.getMonth()]}`,sat=[];
  if(g.vakit)sat.push(VAKIT_AD.map(([k,n],i)=>`${n} ${g.vakit[i]}`).filter((x,i)=>i!==1).join(" · "));
  if(g.ders)sat.push(g.ders.l.length?g.ders.l.map(c=>`${c.i+1}) ${c.s?c.s+" ":""}${c.s?"":ozKisa(c.d)} ${c.bas}`.replace(/\s+/g," ").trim()).join(" · "):g.ders.yok);
  return{baslik,govde:sat.join("\n")}}
// sağdaki yuvarlak: günün tarihi
function ozIkon(g){try{const c=document.createElement("canvas"),Z=192;c.width=c.height=Z;const x=c.getContext("2d"),t=g.tarih;
  x.save();x.beginPath();x.arc(Z/2,Z/2,Z/2,0,7);x.clip();const gr=x.createLinearGradient(0,0,Z,Z);gr.addColorStop(0,"#0f766e");gr.addColorStop(1,"#134e4a");x.fillStyle=gr;x.fillRect(0,0,Z,Z);
  x.textAlign="center";x.fillStyle="#fde68a";x.font="800 26px Manrope,sans-serif";x.fillText(OZ_AY[t.getMonth()].toLocaleUpperCase("tr"),Z/2,58);
  x.fillStyle="#fff";x.font="800 78px Manrope,sans-serif";x.fillText(String(t.getDate()),Z/2,132);
  x.fillStyle="rgba(255,255,255,.8)";x.font="700 20px Manrope,sans-serif";x.fillText(OZ_GUN[t.getDay()].slice(0,3).toLocaleUpperCase("tr"),Z/2,164);
  x.restore();return c.toDataURL("image/png")}catch(e){return "icon-192.png"}}
// açılınca görünen kart: üstte altı vakit, altta günün dersleri
function ozResim(g){try{const W=720,P=14,gap=8,ikisi=g.vakit&&g.ders,H=ikisi?184:110,c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d");
  x.fillStyle="#0f172a";x.fillRect(0,0,W,H);let y=P;
  if(g.vakit){const h=ikisi?74:H-2*P,w=(W-2*P-5*gap)/6;
    VAKIT_AD.forEach(([k,n],i)=>{const R=OZ_RENK[i],X=P+i*(w+gap),gr=x.createLinearGradient(X,y,X+w,y+h);gr.addColorStop(0,R[1]);gr.addColorStop(1,R[0]);
      x.fillStyle=gr;rr(x,X,y,w,h,14);x.fill();x.textAlign="center";
      x.fillStyle=R[2];x.font="800 14px Manrope,sans-serif";x.fillText(n.toLocaleUpperCase("tr"),X+w/2,y+h/2-8);
      x.fillStyle="#fff";x.font="800 24px Manrope,sans-serif";x.fillText(g.vakit[i],X+w/2,y+h/2+20)});
    y+=h+gap}
  if(g.ders){const h=H-P-y,l=g.ders.l;
    if(!l.length){x.fillStyle="rgba(255,255,255,.06)";rr(x,P,y,W-2*P,h,14);x.fill();x.fillStyle="#94a3b8";rr(x,P,y,5,h,3);x.fill();
      x.textAlign="left";x.fillStyle="#e2e8f0";x.font="700 20px Manrope,sans-serif";x.fillText(g.ders.yok,P+22,y+h/2+7)}
    else{const n=l.length,w=(W-2*P-(n-1)*gap)/n;
      l.forEach((c,k)=>{const X=P+k*(w+gap),renk=ozDersRenk(c);x.fillStyle="rgba(255,255,255,.07)";rr(x,X,y,w,h,14);x.fill();x.fillStyle=renk;rr(x,X,y,w,5,3);x.fill();
        x.textAlign="center";x.fillStyle="#94a3b8";x.font=`700 ${w<90?13:14}px Manrope,sans-serif`;x.fillText(`${c.i+1}. ${c.bas}`,X+w/2,y+h/2-6);
        let a=c.s||ozKisa(c.d);x.fillStyle=renk;x.font=`800 ${w<90?20:22}px Manrope,sans-serif`;while(x.measureText(a).width>w-12&&a.length>2)a=a.slice(0,-1);x.fillText(a,X+w/2,y+h/2+20)})}}
  return c.toDataURL("image/png")}catch(e){return undefined}}
// servis çalışanı için önümüzdeki 7 günün metin özeti
async function ozHaftaKaydet(){try{const gunler={},b=new Date();b.setHours(12,0,0,0);
  for(let k=0;k<8;k++){const d=new Date(b);d.setDate(b.getDate()+k);const g=await ozGunVeri(d);if(g){const t=ozMetin(g);gunler[g.anahtar]=t}}
  const ca=await caches.open("no-veri");await ca.put("./bct-hafta.json",new Response(JSON.stringify({gunler,url:"./#vakit"}),{headers:{"Content-Type":"application/json"}}));
  const r=await navigator.serviceWorker.ready;if(r.periodicSync){try{const izin=await navigator.permissions.query({name:"periodic-background-sync"});if(izin.state==="granted")await r.periodicSync.register("bct-gun",{minInterval:6*3600*1000})}catch(e){}}}catch(e){}}
let ozHaftaGun="";
async function ozetGuncelle(zorla){
  if(typeof Notification==="undefined"||Notification.permission!=="granted"||!("serviceWorker" in navigator))return;
  try{const r=await navigator.serviceWorker.ready;
    (await r.getNotifications({tag:"bct-ders"})).forEach(n=>n.close());
    (await r.getNotifications()).forEach(n=>{if(n.tag===OZ_TAG&&!(n.data&&String(n.data.imza||"").startsWith("g1|")))n.close()}); // eski sürümün geri sayımlı bildirimi
    const g=await ozGunVeri(new Date()),eski=(await r.getNotifications({tag:OZ_TAG}))[0];
    if(zorla||ozHaftaGun!==ozAnahtar(new Date())){ozHaftaGun=ozAnahtar(new Date());ozHaftaKaydet()}
    if(!g){if(eski)eski.close();return}
    const t=ozMetin(g),imza="g1|"+g.anahtar+"|"+t.govde;if(!zorla&&eski&&eski.data&&eski.data.imza===imza)return;
    const im=ozResim(g);await r.showNotification(t.baslik,{body:im?"":t.govde,icon:ozIkon(g),image:im,tag:OZ_TAG,renotify:false,silent:true,requireInteraction:true,badge:"rozet.png",data:{imza,url:g.ders&&g.ders.l.length?"./#ogretmen":"./#vakit"}})}
  catch(e){console.warn("özet bildirim",e)}}
async function vakitBildirimGuncelle(){return ozetGuncelle(false)}
async function dersBildirimGuncelle(z){return ozetGuncelle(!!z)}
