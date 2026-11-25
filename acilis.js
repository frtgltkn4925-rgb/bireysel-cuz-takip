"use strict";
/* ===== Açılış: Eûzü-besmele =====
   Besmele hafız sesinden çalar; "Hoş geldiniz" yalnızca yazı olarak görünür.
   Telefon sesi kendiliğinden başlatmaya izin vermezse ilk dokunuşta başlar. */
const ACILIS_SELAM="Hoş geldiniz, Allah'ın rahmeti üzerinize olsun.";
function besmeleCal(au){return new Promise(res=>{const imam=ls.get("no.imam")||IMAMLAR[0][0];let i=0;
  const dene=()=>{au.src=sesAdres(imam,1,i);au.play().then(()=>{},err=>{if(err&&err.name==="NotAllowedError")res("izin");else if(++i<4)dene();else res("yok")})};
  au.onended=()=>res("bitti");au.onerror=()=>{if(++i<4)dene();else res("yok")};dene()})}
function acilisGoster(zorla){
  if(!zorla&&S.acilis===false)return;
  const el=document.createElement("div");el.className="acilis";el.setAttribute("role","dialog");el.setAttribute("aria-label","Hoş geldiniz");
  el.innerHTML=`<div class="ac-ic"><div class="ac-ar ac-euzu">أَعُوذُ بِاللّٰهِ مِنَ الشَّيْطَانِ الرَّجِيمِ</div>
    <div class="ac-ar ac-besmele">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ</div>
    <div class="ac-cizgi"></div><p class="ac-selam">${ACILIS_SELAM}</p>
    <p class="ac-ipucu" id="acIp">Devam etmek için dokunun</p></div>`;
  document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add("on"));
  const au=new Audio();au.preload="auto";let bitti=false,calindi=false;
  const kapat=()=>{if(bitti)return;bitti=true;el.classList.remove("on");setTimeout(()=>el.remove(),450)};
  const sira=async()=>{calindi=true;const r=await besmeleCal(au);if(r==="izin"){calindi=false;el.querySelector("#acIp").textContent="🔊 Dinlemek için dokunun";return}setTimeout(kapat,600)};
  el.addEventListener("click",()=>{if(!calindi)sira();kapat()});
  sira();
  setTimeout(()=>{if(!calindi)kapat()},9000);
  setTimeout(kapat,20000)}
if(!/[?&]acilis=0/.test(location.search))acilisGoster(false);
