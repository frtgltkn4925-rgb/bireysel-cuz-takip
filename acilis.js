"use strict";
/* ===== Açılış: Eûzü-besmele ve selam =====
   Besmele hafız sesinden çalar, selamı telefonun Türkçe konuşma motoru okur.
   Telefon sesi kendiliğinden başlatmaya izin vermezse ilk dokunuşta başlar. */
const ACILIS_SELAM="Hoş geldiniz, Allah'ın rahmeti üzerinize olsun.";
function selamSoyle(){return new Promise(res=>{try{const ss=window.speechSynthesis;if(!ss)return res(false);
  ss.cancel();const u=new SpeechSynthesisUtterance(ACILIS_SELAM);u.lang="tr-TR";u.rate=.92;
  const v=ss.getVoices().find(x=>/^tr/i.test(x.lang));if(v)u.voice=v;
  let basladi=false;u.onstart=()=>{basladi=true};u.onend=()=>res(true);u.onerror=()=>res(basladi);
  ss.speak(u);setTimeout(()=>{if(!basladi)res(false)},1500)}catch(e){res(false)}})}
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
  const au=new Audio();au.preload="auto";let bitti=false,calindi=false,selamBekliyor=false;
  const kapat=()=>{if(bitti)return;bitti=true;el.classList.remove("on");setTimeout(()=>el.remove(),450)};
  const sira=async()=>{calindi=true;const r=await besmeleCal(au);if(r==="izin"){calindi=false;el.querySelector("#acIp").textContent="🔊 Dinlemek için dokunun";return}
    if(await selamSoyle()){setTimeout(kapat,700);return}
    selamBekliyor=true;if(!bitti)el.querySelector("#acIp").textContent="Devam etmek için dokunun"};
  const dokun=()=>{if(!calindi)sira();else if(selamBekliyor){selamBekliyor=false;selamSoyle()}kapat()};
  el.addEventListener("click",dokun);
  // pencere kapandıktan sonra selam hâlâ okunmadıysa ilk dokunuşta oku
  const ilk=()=>{if(selamBekliyor&&bitti){selamBekliyor=false;selamSoyle();document.removeEventListener("pointerdown",ilk)}};
  document.addEventListener("pointerdown",ilk);setTimeout(()=>document.removeEventListener("pointerdown",ilk),60000);
  sira();
  setTimeout(()=>{if(!calindi)kapat()},9000);
  setTimeout(kapat,25000)}
if(window.speechSynthesis)try{speechSynthesis.getVoices();speechSynthesis.onvoiceschanged=()=>{}}catch(e){}
if(!/[?&]acilis=0/.test(location.search))acilisGoster(false);
