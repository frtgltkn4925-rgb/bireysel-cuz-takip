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
// Samsung bildirimi kapalıyken tek satırlık hap gösterir: başlık çok kısa tutulur, ayrıntı açılınca görünür
function ozMetin(o){const v=o.vakit,d=o.ders;let baslik="",sat=[];
  let dersSat="";
  if(d){if(d.simdi&&d.sonraki)dersSat=`${d.simdi.bos?"⚪ Şu an boş":"🟢 Şu an "+ozDersK(d.simdi)}  ›  🟠 Sıradaki ${ozDersK(d.sonraki)} ${d.sonraki.bas}`;
    else if(d.simdi)dersSat=d.simdi.bos?`⚪ Şu an boş saat · bitiş ${d.simdi.bit}`:`🟢 Şu an ${ozDersK(d.simdi)} · bitiş ${d.simdi.bit}`;
    else if(d.sonraki)dersSat=`🟠 Sıradaki ${ozDersK(d.sonraki)} · ${d.sonraki.bas}${d.sonraki.kalan<=120?` (${ozSure(d.sonraki.kalan)} sonra)`:""}`;
    else dersSat=`⚪ ${d.durum}`}
  if(v){baslik=`${v.ad} ${v.saat}`;sat.push(`${ozSure(v.dk)} kaldı · ${S.il.ad}`);if(dersSat)sat.push(dersSat)}
  else{baslik=d.simdi&&!d.simdi.bos?`Şu an ${d.simdi.s||ozKisa(d.simdi.d)}`:d.sonraki?`Sıradaki ${d.sonraki.s||ozKisa(d.sonraki.d)} ${d.sonraki.bas}`:d.durum;sat.push(dersSat)}
  return{baslik,govde:sat.join("\n")}}
// sağdaki yuvarlak: vakte göre renkli, ortada kalan süre
function ozIkon(o){try{const c=document.createElement("canvas"),Z=192;c.width=c.height=Z;const x=c.getContext("2d"),v=o.vakit;let d=o.ders;
  const dersRenk=!o.ders?null:o.ders.simdi?(o.ders.simdi.bos?["#64748b","#334155"]:["#22c55e","#15803d"]):o.ders.sonraki?["#f59e0b","#b45309"]:["#64748b","#334155"];
  const parca=(y,h,R)=>{const g=x.createLinearGradient(0,y,Z,y+h);g.addColorStop(0,R[0]);g.addColorStop(1,R[1]);x.fillStyle=g;x.fillRect(0,y,Z,h)};
  x.save();x.beginPath();x.arc(Z/2,Z/2,Z/2,0,7);x.clip();x.textAlign="center";
  const ust=Z;const dHap=d;d=v?null:d;
  if(v){const R=OZ_RENK[v.i];parca(0,ust,[R[1],R[0]]);const sa=Math.floor(v.dk/60),dk=v.dk%60,b=sa?`${sa}:${ikiH(dk)}`:`${dk}dk`;
    x.fillStyle=R[2];x.font=`800 ${d?20:26}px Manrope,sans-serif`;x.fillText(v.ad.toLocaleUpperCase("tr"),Z/2,d?40:62);
    x.fillStyle="#fff";x.font=`800 ${d?(b.length>4?44:50):(b.length>4?58:66)}px Manrope,sans-serif`;x.fillText(b,Z/2,d?88:126)}
  if(d){parca(v?ust:0,Z-(v?ust:0),dersRenk);const y0=v?ust:0,h=Z-y0,ana=d.simdi&&!d.simdi.bos?(d.simdi.s||d.simdi.no+"."):d.sonraki?(d.sonraki.s||d.sonraki.bas):"—";
    if(v){x.fillStyle="rgba(255,255,255,.85)";x.fillRect(0,y0,Z,3)}
    x.fillStyle="#fff";x.font=`800 ${v?38:58}px Manrope,sans-serif`;x.fillText(ana,Z/2,y0+h/2+(v?6:4));
    x.font=`800 ${v?13:18}px Manrope,sans-serif`;x.fillStyle="rgba(255,255,255,.9)";x.fillText(d.simdi&&!d.simdi.bos?"ŞU AN":d.sonraki?"SIRADAKİ":"DERS",Z/2,y0+h/2+(v?30:38))}
  x.restore();return c.toDataURL("image/png")}catch(e){return "icon-192.png"}}
// açılınca görünen kart: alçak, yatay şerit (solda vakit, sağda yan yana ders kutuları)
function ozResim(o){try{const W=720,H=180,c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d");
  x.fillStyle="#0f172a";x.fillRect(0,0,W,H);
  const VW=o.vakit?(o.ders?132:W):0;
  if(o.vakit){const R=OZ_RENK[o.vakit.i],g=x.createLinearGradient(0,0,VW,H);g.addColorStop(0,R[1]);g.addColorStop(1,R[0]);x.fillStyle=g;x.fillRect(0,0,VW,H);
    x.save();x.beginPath();x.rect(0,0,VW,H);x.clip();x.globalAlpha=.10;for(let yy=-20;yy<H+40;yy+=48)for(let xx=-20;xx<VW+40;xx+=48)star8(x,xx+((yy/48|0)%2)*24,yy,12,null,"#fff",1.1);x.restore();
    const s=Math.floor(o.vakit.dk/60),d=o.vakit.dk%60,kalan=s?`${s}:${ikiH(d)}`:`${d} dk`;
    if(o.ders){const cx=VW/2;x.textAlign="center";
      x.fillStyle=R[2];x.font="800 15px Manrope,sans-serif";x.fillText(o.vakit.ad.toLocaleUpperCase("tr"),cx,40);
      x.fillStyle="#fff";x.font=`800 ${kalan.length>4?34:38}px Manrope,sans-serif`;x.fillText(kalan,cx,88);
      x.fillStyle=R[2];x.font="600 13px Manrope,sans-serif";x.fillText(s?"sa : dk kaldı":"kaldı",cx,108);
      x.fillStyle="rgba(255,255,255,.18)";rr(x,cx-40,124,80,32,16);x.fill();x.fillStyle="#fff";x.font="800 17px Manrope,sans-serif";x.fillText(o.vakit.saat,cx,146)}
    else{x.textAlign="left";x.fillStyle=R[2];x.font="700 16px Manrope,sans-serif";x.fillText(`${S.il.ad.toLocaleUpperCase("tr")} · SIRADAKİ VAKİT`,36,46);
      x.fillStyle="#fff";x.font="800 40px Manrope,sans-serif";x.fillText(o.vakit.ad,36,100);x.fillStyle=R[2];x.font="700 22px Manrope,sans-serif";x.fillText(o.vakit.saat,36,140);
      x.textAlign="right";x.fillStyle="#fff";x.font="800 64px Manrope,sans-serif";x.fillText(kalan,W-36,112);x.fillStyle=R[2];x.font="600 16px Manrope,sans-serif";x.fillText(s?"saat : dakika kaldı":"kaldı",W-36,142)}}
  if(o.ders){const d=o.ders,X0=VW+16,Wd=W-VW-32,kutular=[];
    if(d.simdi)kutular.push([d.simdi.bos?"#94a3b8":"#22c55e","ŞU AN",d.simdi.bos?"Boş saat":(d.simdi.d||"Ders"),`${d.simdi.no}. ders · bitiş ${d.simdi.bit}`,d.simdi.bos?"":d.simdi.s]);
    if(d.sonraki)kutular.push(["#f59e0b","SIRADAKİ",d.sonraki.d||"Ders",`${d.sonraki.bas}${d.sonraki.kalan<=120?` · ${ozSure(d.sonraki.kalan)} sonra`:""}`,d.sonraki.s]);
    if(d.durum)kutular.push(["#94a3b8",(DP_GUN[Math.max(0,dpBugun())]||"").toLocaleUpperCase("tr"),d.durum,"",""]);
    const n=kutular.length,gap=12,kw=(Wd-gap*(n-1))/n,ky=22,kh=H-44;
    kutular.forEach(([renk,etiket,ana,alt,sinif],k)=>{const X=X0+k*(kw+gap);x.textAlign="left";
      x.fillStyle="rgba(255,255,255,.06)";rr(x,X,ky,kw,kh,16);x.fill();x.fillStyle=renk;rr(x,X,ky,5,kh,3);x.fill();
      x.fillStyle=renk;x.font="800 13px Manrope,sans-serif";x.fillText(etiket,X+20,ky+30);
      if(sinif){x.font="800 18px Manrope,sans-serif";const tw=Math.max(54,x.measureText(sinif).width+22),bx=X+kw-14-tw;x.fillStyle=renk;rr(x,bx,ky+12,tw,30,15);x.fill();x.fillStyle="#0f172a";x.textAlign="center";x.fillText(sinif,bx+tw/2,ky+33);x.textAlign="left"}
      x.fillStyle="#f8fafc";x.font=`700 ${n>2?20:23}px Manrope,sans-serif`;let a=ana;while(x.measureText(a).width>kw-36&&a.length>4)a=a.slice(0,-2)+"…";x.fillText(a,X+20,ky+76);
      if(alt){x.fillStyle="#94a3b8";x.font="600 15px Manrope,sans-serif";let b=alt;while(x.measureText(b).width>kw-36&&b.length>4)b=b.slice(0,-2)+"…";x.fillText(b,X+20,ky+108)}})}
  return c.toDataURL("image/png")}catch(e){return undefined}}
async function ozetGuncelle(zorla){
  if(typeof Notification==="undefined"||Notification.permission!=="granted"||!("serviceWorker" in navigator))return;
  try{const r=await navigator.serviceWorker.ready;
    (await r.getNotifications({tag:"bct-ders"})).forEach(n=>n.close());
    const o=await ozetVeri(),eski=(await r.getNotifications({tag:OZ_TAG}))[0];
    if(!o){if(eski)eski.close();return}
    const t=ozMetin(o),imza=t.baslik+"|"+t.govde;if(!zorla&&eski&&eski.data&&eski.data.imza===imza)return;
    const im=ozResim(o);await r.showNotification(t.baslik,{body:im?"":t.govde,icon:ozIkon(o),image:im,tag:OZ_TAG,renotify:false,silent:true,requireInteraction:true,badge:"rozet.png",data:{imza,url:o.ders&&dpBugun()>=0?"./#ogretmen":"./#vakit"}})}
  catch(e){console.warn("özet bildirim",e)}}
async function vakitBildirimGuncelle(){return ozetGuncelle(false)}
async function dersBildirimGuncelle(z){return ozetGuncelle(!!z)}
