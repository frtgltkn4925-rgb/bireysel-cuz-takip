"use strict";
/* ===== Bildirim panosunda tek özet =====
   Namaz vakti ve ders programı tek bildirimde birleşir. Kapalı hâlde: başlıkta kalan süre, altında ders satırları ve
   sağda vakte göre renk değiştiren yuvarlak sayaç. Açılınca: iki bölmeli renkli kart (solda vakit, sağda dersler). */
const OZ_TAG="bct-vakit";
const OZ_RENK=[["#2e1065","#6d28d9","#c4b5fd"],["#9a3412","#f97316","#fed7aa"],["#075985","#0ea5e9","#bae6fd"],["#854d0e","#eab308","#fef08a"],["#9f1239","#f43f5e","#fecdd3"],["#172554","#3b5bdb","#c7d2fe"]];
const ozSure=dk=>{const s=Math.floor(dk/60),d=dk%60;return s?(d?`${s} sa ${d} dk`:`${s} sa`):`${d} dk`};
const ozSaat=t=>`${ikiH(t.getHours())}:${ikiH(t.getMinutes())}`;
const ozDers=c=>`${c.s?c.s+" ":""}${c.d||"Ders"}`;
async function ozetVeri(){
  const o={vakit:null,ders:null};
  if(S.vakitBildirim&&S.il){try{const v=await sonrakiVakit();if(v)o.vakit={i:v.i,ad:VAKIT_AD[v.i][1],saat:ozSaat(v.t),dk:Math.max(0,Math.round((v.t-new Date())/60000))}}catch(e){}}
  if(S.ders&&S.ders.bildirim){const gi=dpBugun(),d={durum:"",simdi:null,sonraki:null};o.ders=d;
    if(gi<0)d.durum="Bugün ders yok";
    else{const l=dpGunDersleri(gi),sl=dpSlotAkt(),n=new Date(),now=n.getHours()*60+n.getMinutes(),m=t=>{const [h,mm]=String(t).split(":").map(Number);return h*60+mm};
      if(!l.length)d.durum="Bugün için ders girilmemiş";
      else if(!sl||now>m(l[l.length-1].bit))d.durum="Bugünkü dersler bitti";
      else{const c=S.ders.gun[gi][sl.i],simdi=sl.tur==="simdi";
        if(simdi)d.simdi=dpDolu(c)?{no:sl.i+1,s:c.s,d:c.d,bit:S.ders.saat[sl.i][1]}:{bos:true,no:sl.i+1,bit:S.ders.saat[sl.i][1]};
        const x=l.find(y=>m(y.bas)>now&&(!simdi||y.i>sl.i));if(x)d.sonraki={no:x.i+1,s:x.s,d:x.d,bas:x.bas,kalan:m(x.bas)-now};
        if(!d.simdi&&!d.sonraki)d.durum="Bugün başka ders yok"}}}
  return o.vakit||o.ders?o:null}
const ozKisa=t=>{t=String(t||"Ders");return t.length>14?t.slice(0,13).trim()+".":t};
const ozDersK=c=>`${c.s?c.s+" ":""}${ozKisa(c.d)}`;
// Android kapalı bildirimde başlık + tek satır gösterir; her şey bu iki satıra sığdırılır
// tek satır: vakit │ şu anki ders │ sıradaki ders
function ozMetin(o){const v=o.vakit,d=o.ders,p=[];
  if(v){const sa=Math.floor(v.dk/60),dk=v.dk%60;p.push(`🕌 ${v.ad} ${v.saat} · ${sa?`${sa}:${ikiH(dk)}`:`${dk} dk`}`)}
  if(d){if(d.simdi)p.push(d.simdi.bos?"⚪ Şu an boş":`🟢 Şu an ${d.simdi.s||ozKisa(d.simdi.d)}`);
    if(d.sonraki)p.push(`🟠 Sıradaki ${d.sonraki.s||ozKisa(d.sonraki.d)} ${d.sonraki.bas}`);
    if(!d.simdi&&!d.sonraki)p.push(`⚪ ${d.durum.replace("Bugünkü dersler bitti","Dersler bitti").replace("Bugün ders yok","Ders yok")}`)}
  return{baslik:p.join(" │ "),govde:""}}
// sağdaki yuvarlak: vakte göre renkli, ortada kalan süre
function ozIkon(o){try{const c=document.createElement("canvas"),Z=192;c.width=c.height=Z;const x=c.getContext("2d"),v=o.vakit,d=o.ders;
  const dersRenk=!d?null:d.simdi?(d.simdi.bos?["#64748b","#334155"]:["#22c55e","#15803d"]):d.sonraki?["#f59e0b","#b45309"]:["#64748b","#334155"];
  const parca=(y,h,R)=>{const g=x.createLinearGradient(0,y,Z,y+h);g.addColorStop(0,R[0]);g.addColorStop(1,R[1]);x.fillStyle=g;x.fillRect(0,y,Z,h)};
  x.save();x.beginPath();x.arc(Z/2,Z/2,Z/2,0,7);x.clip();x.textAlign="center";
  const ust=v&&d?Z*.56:Z;
  if(v){const R=OZ_RENK[v.i];parca(0,ust,[R[1],R[0]]);const sa=Math.floor(v.dk/60),dk=v.dk%60,b=sa?`${sa}:${ikiH(dk)}`:`${dk}dk`;
    x.fillStyle=R[2];x.font=`800 ${d?20:24}px Manrope,sans-serif`;x.fillText(v.ad.toLocaleUpperCase("tr"),Z/2,d?40:62);
    x.fillStyle="#fff";x.font=`800 ${d?(b.length>4?44:50):(b.length>4?58:66)}px Manrope,sans-serif`;x.fillText(b,Z/2,d?88:126)}
  if(d){parca(v?ust:0,Z-(v?ust:0),dersRenk);const y0=v?ust:0,h=Z-y0,ana=d.simdi&&!d.simdi.bos?(d.simdi.s||d.simdi.no+"."):d.sonraki?(d.sonraki.s||d.sonraki.bas):"—";
    if(v){x.fillStyle="rgba(255,255,255,.85)";x.fillRect(0,y0,Z,3)}
    x.fillStyle="#fff";x.font=`800 ${v?38:58}px Manrope,sans-serif`;x.fillText(ana,Z/2,y0+h/2+(v?6:4));
    x.font=`800 ${v?13:18}px Manrope,sans-serif`;x.fillStyle="rgba(255,255,255,.9)";x.fillText(d.simdi&&!d.simdi.bos?"ŞU AN":d.sonraki?"SIRADAKİ":"DERS",Z/2,y0+h/2+(v?30:38))}
  x.restore();return c.toDataURL("image/png")}catch(e){return "icon-192.png"}}
// açılınca görünen kart (Android geniş görseli yaklaşık 2:1 gösterir)
function ozResim(o){try{const W=720,H=360,c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d");
  x.fillStyle="#0f172a";x.fillRect(0,0,W,H);
  const ikiBolme=o.vakit&&o.ders,VW=ikiBolme?300:o.vakit?W:0;
  if(o.vakit){const R=OZ_RENK[o.vakit.i],g=x.createLinearGradient(0,0,VW,H);g.addColorStop(0,R[1]);g.addColorStop(1,R[0]);x.fillStyle=g;x.fillRect(0,0,VW,H);
    x.save();x.globalAlpha=.12;for(let yy=-20;yy<H+40;yy+=60)for(let xx=-20;xx<VW+40;xx+=60)star8(x,xx+((yy/60|0)%2)*30,yy,16,null,"#fff",1.4);x.restore();
    x.textAlign="left";x.fillStyle=R[2];x.font="700 22px Manrope,sans-serif";x.fillText(`${S.il.ad} · Sıradaki vakit`,28,46);
    x.fillStyle="#fff";x.font="800 54px Manrope,sans-serif";x.fillText(o.vakit.ad,28,116);
    const s=Math.floor(o.vakit.dk/60),d=o.vakit.dk%60;x.font="800 70px Manrope,sans-serif";x.fillText(s?`${s}:${ikiH(d)}`:`${d} dk`,28,212);
    x.fillStyle=R[2];x.font="600 22px Manrope,sans-serif";x.fillText(s?"saat : dakika kaldı":"kaldı",30,246);
    x.fillStyle="rgba(255,255,255,.22)";rr(x,28,274,150,54,27);x.fill();x.fillStyle="#fff";x.font="800 28px Manrope,sans-serif";x.textAlign="center";x.fillText(o.vakit.saat,103,311)}
  if(o.ders){const X=VW,Wd=W-VW,d=o.ders;x.textAlign="left";
    x.fillStyle="#93c5fd";x.font="700 22px Manrope,sans-serif";x.fillText(`${DP_GUN[Math.max(0,dpBugun())]||""} · Dersler`,X+26,46);
    const kutu=(y,renk,etiket,ana,alt,sag)=>{x.fillStyle=renk;rr(x,X+20,y,Wd-40,118,20);x.fill();
      x.fillStyle="rgba(255,255,255,.85)";x.font="800 16px Manrope,sans-serif";x.fillText(etiket,X+40,y+30);
      x.fillStyle="#fff";x.font="800 30px Manrope,sans-serif";let a=ana;while(x.measureText(a).width>Wd-160&&a.length>4)a=a.slice(0,-2)+"…";x.fillText(a,X+40,y+72);
      x.fillStyle="rgba(255,255,255,.85)";x.font="600 20px Manrope,sans-serif";x.fillText(alt,X+40,y+102);
      if(sag){x.textAlign="right";x.fillStyle="#fff";x.font="800 38px Manrope,sans-serif";x.fillText(sag,X+Wd-40,y+76);x.textAlign="left"}};
    let y=66;
    if(d.simdi){kutu(y,d.simdi.bos?"#475569":"#16a34a","ŞU AN",d.simdi.bos?"Boş saat":(d.simdi.d||"Ders"),`${d.simdi.no}. ders · bitiş ${d.simdi.bit}`,d.simdi.bos?"":d.simdi.s);y+=132}
    if(d.sonraki){kutu(y,"#d97706","SIRADAKİ",d.sonraki.d||"Ders",`${d.sonraki.no}. ders · ${d.sonraki.bas}${d.sonraki.kalan<=120?` · ${ozSure(d.sonraki.kalan)} sonra`:""}`,d.sonraki.s);y+=132}
    if(d.durum){x.fillStyle="#334155";rr(x,X+20,y,Wd-40,90,20);x.fill();x.fillStyle="#e2e8f0";x.font="700 26px Manrope,sans-serif";x.fillText(d.durum,X+40,y+55)}}
  return c.toDataURL("image/png")}catch(e){return undefined}}
async function ozetGuncelle(zorla){
  if(typeof Notification==="undefined"||Notification.permission!=="granted"||!("serviceWorker" in navigator))return;
  try{const r=await navigator.serviceWorker.ready;
    (await r.getNotifications({tag:"bct-ders"})).forEach(n=>n.close());
    const o=await ozetVeri(),eski=(await r.getNotifications({tag:OZ_TAG}))[0];
    if(!o){if(eski)eski.close();return}
    const t=ozMetin(o);if(!zorla&&eski&&eski.title===t.baslik&&eski.body===t.govde)return;
    await r.showNotification(t.baslik,{body:t.govde,tag:OZ_TAG,renotify:false,silent:true,requireInteraction:true,badge:"rozet.png",data:{url:o.ders&&dpBugun()>=0?"./#ogretmen":"./#vakit"}})}
  catch(e){console.warn("özet bildirim",e)}}
async function vakitBildirimGuncelle(){return ozetGuncelle(false)}
async function dersBildirimGuncelle(z){return ozetGuncelle(!!z)}
