"use strict";
/* ============ KUR'AN METNİ (meal, okunuş, tefsir) ============ */
const API="https://api.alquran.cloud/v1/";
const BESM2=/^بِسْمِ\s+\S+\s+\S+\s+\S+\s*/;
async function zamanli(url,ms=15000){const c=new AbortController(),t=setTimeout(()=>c.abort(),ms);try{const r=await fetch(url,{signal:c.signal});if(!r.ok)throw new Error("HTTP "+r.status);return await r.json()}finally{clearTimeout(t)}}
const qCache={};
async function loadSure(n){
  if(qCache[n])return qCache[n];
  try{const j=await zamanli(API+"surah/"+n+"/editions/quran-uthmani,tr.yazir,tr.transliteration");
    const [ar,ml,tl]=j.data;
    const v=ar.ayahs.map((a,i)=>{let t=a.text;if(i===0&&n!==1&&n!==9)t=t.replace(BESM2,"");return{n:a.numberInSurah,g:a.number,a:t,t:ml&&ml.ayahs[i]?ml.ayahs[i].text:"",o:tl&&tl.ayahs[i]?tl.ayahs[i].text:""}});
    qCache[n]={v,src:"api"};if(S.tefsir){try{await tefsirEkle(n,v)}catch(e){}}return qCache[n]}
  catch(e){
    if(GOMULU[n])return qCache[n]={v:GOMULU[n].map((x,i)=>({n:i+1,a:x[0],t:x[1],o:""})),src:"yerel"};
    const d=await zamanli("https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/"+n+".json");
    return qCache[n]={v:d.verses.map((x,i)=>({n:x.id||i+1,a:x.text,t:"",o:""})),src:"ar"}}
}
async function tefsirEkle(n,v){const j=await zamanli(API+"surah/"+n+"/ar.jalalayn");j.data.ayahs.forEach((a,i)=>{if(v[i])v[i].c=a.text})}
const mCache={};
async function cuzMetni(k){
  if(mCache[k])return mCache[k];let out;
  try{const [ar,la]=await Promise.all([zamanli(API+"juz/"+k+"/quran-uthmani"),zamanli(API+"juz/"+k+"/tr.transliteration").catch(()=>null)]);
    const lat=la&&la.data&&la.data.ayahs||[];
    out=ar.data.ayahs.map((a,i)=>{let tx=a.text;const s=a.surah.number,n=a.numberInSurah;if(n===1&&s!==1&&s!==9)tx=tx.replace(BESM2,"");return{s,n,g:a.number,p:a.page,j:a.juz,a:tx,l:lat[i]?String(lat[i].text).replace(/<[^>]+>/g,""):""}})}
  catch(e){const r=aralik(k),ss=[];for(let s=r.s;s<=r.es;s++)ss.push(s);
    const tum=await Promise.all(ss.map(s=>zamanli("https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/"+s+".json")));out=[];
    tum.forEach((d,i)=>{const s=ss[i],v=d.verses,from=s===r.s?r.a:1,to=s===r.es?r.ea:v.length;v.forEach((x,j)=>{const n=x.id||j+1;if(n>=from&&n<=to)out.push({s,n,g:BAS[s-1]+n,a:x.text,l:""})})})}
  return mCache[k]=out}
function sureCuzu(n){let k=1;CUZ.forEach(([s,a],i)=>{if(s<n||(s===n&&a===1))k=i+1});return k}
const CUZ_SAYFA=[1,22,42,62,82,102,121,142,162,182,201,222,242,262,282,302,322,342,362,382,402,422,442,462,482,502,522,542,562,582];
function sayfaCuzu(p){let k=1;CUZ_SAYFA.forEach((s,i)=>{if(p>=s)k=i+1});return k}

/* ============ TAKVİM DOSYASI (hatırlatma) ============ */
const ikiH=n=>String(n).padStart(2,"0");
const icsT=d=>`${d.getFullYear()}${ikiH(d.getMonth()+1)}${ikiH(d.getDate())}T${ikiH(d.getHours())}${ikiH(d.getMinutes())}00`;
const icsEsc=s=>String(s).replace(/[\\,;]/g,m=>"\\"+m).replace(/\n/g,"\\n");
function icsIndir(olaylar,ad,ezan){
  const now=icsT(new Date());
  const L=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Bireysel Cüz Takip//TR","CALSCALE:GREGORIAN","METHOD:PUBLISH"];
  olaylar.forEach((o,i)=>{L.push("BEGIN:VEVENT",`UID:${o.uid||now+"-"+i+"@nurokuma"}`,`DTSTAMP:${now}`,`DTSTART:${icsT(o.t)}`,`DTEND:${icsT(new Date(o.t.getTime()+(o.dk||15)*60000))}`,`SUMMARY:${icsEsc(o.b)}`);
    if(o.a)L.push(`DESCRIPTION:${icsEsc(o.a)}`);if(o.r)L.push("RRULE:"+o.r);
    L.push("BEGIN:VALARM","ACTION:DISPLAY",`DESCRIPTION:${icsEsc(o.b)}`,`TRIGGER:${o.once||"PT0M"}`,"END:VALARM","END:VEVENT")});
  L.push("END:VCALENDAR");
  indir(new Blob([L.join("\r\n")],{type:"text/calendar"}),ad);
  if(ezan)return sheet(`<h3>Son adım: takvime ekleyin</h3><ol class="small" style="padding-left:18px;line-height:1.6"><li>İnen <b>${esc(ad)}</b> dosyasına dokunun (bildirimden ya da Dosyalarım → İndirilenler).</li><li><b>Samsung Takvim</b> ya da <b>Google Takvim</b> ile açın, “Ekle / İçe aktar” deyin.</li></ol>
   <p class="small"><b>Ezan sesi için:</b> Telefonunuzda bir ezan ses dosyası varsa Takvim → ☰ → ⚙ Ayarlar → Bildirimler → Ses kısmından onu seçin. Seçmezseniz telefonun bildirim sesi çalar.</p>
   <p class="muted small">Abonelik bitmeden 10 gün önce Vakitler sayfasında “Yenile” düğmesi çıkar. Vazgeçerseniz etkinlikleri takvimden silebilirsiniz.</p><button class="btn full" id="tm">Tamam</button>`,(sh,c)=>{sh.querySelector("#tm").onclick=c});
  sheet(`<h3>Takvime ekle</h3><p class="small">İnen <b>${esc(ad)}</b> dosyasına dokunun ve telefonun takvim uygulamasıyla açın (Google Takvim veya Samsung Takvim). “Ekle / İçe aktar” deyin.</p><p class="muted small">Hatırlatmalar takvim uygulaması üzerinden gelir; uygulama kapalıyken de çalışır. Vazgeçerseniz takvimden silebilirsiniz.</p><button class="btn full" id="tm">Tamam</button>`,(sh,c)=>{sh.querySelector("#tm").onclick=c})}

/* ============ OKUMA PLANI ============ */
const PLAN_GUN=[[30,"30 gün (günde 1 cüz)"],[60,"60 gün"],[90,"90 gün"],[120,"4 ay"],[180,"6 ay"],[365,"1 yıl"]];
function gunFark(a,b){return Math.round((new Date(b+"T12:00")-new Date(a+"T12:00"))/864e5)}
const bugunISO=()=>{const d=new Date();return `${d.getFullYear()}-${ikiH(d.getMonth()+1)}-${ikiH(d.getDate())}`};
function planDurum(){const p=S.plan2;if(!p)return null;const gunluk=Math.ceil(604/p.gun),gecen=Math.max(0,gunFark(p.bas,bugunISO()))+1,beklenen=Math.min(604,gunluk*gecen),ok=S.okunanSayfa||0;
  const bas=Math.min(604,ok+1),son=Math.min(604,ok+gunluk);return{gunluk,gecen,beklenen,ok,bas,son,fark:ok-beklenen+gunluk,bitti:ok>=604}}
function planKart(){const p=S.plan2,d=planDurum();
  if(!p)return `<h2 class="sec">Okuma planı</h2><div class="card"><p style="margin:0 0 10px">Kur'an'ı belirlediğin sürede bitirmek için günlük sayfa planı kur; her gün hangi sayfaları okuyacağını gösterir ve istediğin saatte hatırlatır.</p><button class="btn full" id="pkur">Plan kur</button></div>`;
  const durum=d.bitti?"Hatim tamamlandı. Allah kabul etsin.":d.fark>=0?(d.fark>0?`Planın ${d.fark} sayfa önündesin`:"Plana göre gidiyorsun"):`Planın ${-d.fark} sayfa gerisindesin`;
  return `<h2 class="sec">Okuma planı <small>${p.gun} günde hatim</small></h2><div class="card">
   <div class="row between"><b>${d.bitti?"Tamamlandı":`Bugün: ${d.bas}–${d.son}. sayfalar`}</b><span class="muted">${d.ok}/604</span></div>
   <div class="bar" style="margin:10px 0"><i style="width:${d.ok/604*100}%"></i></div>
   <p class="muted small" style="margin:0 0 10px">${durum} · günde ${d.gunluk} sayfa · hatırlatma ${esc(S.okuSaat)}</p>
   <div class="row wrap" style="gap:8px">${d.bitti?`<button class="btn" id="pyeni">Yeni hatim başlat</button>`:`<button class="btn" id="poku">Bugünkü sayfaları aç</button><button class="btn acc" id="pokdum">Okudum ✓</button>`}<button class="btn ghost sm" id="pay">Ayarla</button></div></div>`}
function planAyarSheet(){const p=S.plan2||{gun:30,bas:bugunISO()};
  sheet(`<h3>Okuma planı</h3><label class="lb">Kaç günde bitirmek istiyorsun?</label><select class="in" id="pg">${PLAN_GUN.map(([g,t])=>`<option value="${g}" ${g===p.gun?"selected":""}>${t}</option>`).join("")}<option value="0">Kendim yazayım…</option></select>
   <input class="in hide" id="pgk" type="number" min="7" max="1000" placeholder="Gün sayısı" style="margin-top:6px" value="${PLAN_GUN.some(x=>x[0]===p.gun)?"":p.gun}">
   <label class="lb">Başlangıç tarihi</label><input class="in" type="date" id="pb" value="${p.bas}">
   <label class="lb">Şimdiye kadar okuduğun son sayfa</label><input class="in" type="number" id="ps" min="0" max="604" value="${S.okunanSayfa||0}">
   <label class="lb">Günlük hatırlatma saati</label><input class="in" type="time" id="pt" value="${esc(S.okuSaat)}">
   <div class="row wrap" style="gap:8px;margin-top:14px"><button class="btn" id="pk">Kaydet</button><button class="btn ghost" id="pic">Hatırlatmayı takvime ekle</button>${S.plan2?`<button class="btn line" id="pr">Planı kaldır</button>`:""}</div>`,(sh,close)=>{
    const sel=sh.querySelector("#pg"),gk=sh.querySelector("#pgk");const gs=()=>{gk.classList.toggle("hide",sel.value!=="0")};gs();if(!PLAN_GUN.some(x=>x[0]===p.gun)){sel.value="0";gs()}sel.onchange=gs;
    const kaydet=()=>{const g=sel.value==="0"?Math.max(7,Math.min(1000,+gk.value||30)):+sel.value;S.plan2={gun:g,bas:sh.querySelector("#pb").value||bugunISO()};S.okunanSayfa=Math.max(0,Math.min(604,+sh.querySelector("#ps").value||0));S.okuSaat=sh.querySelector("#pt").value||"21:00";save()};
    sh.querySelector("#pk").onclick=()=>{kaydet();close();toast("Plan kaydedildi");render()};
    sh.querySelector("#pic").onclick=()=>{kaydet();close();render();okumaHatirlatma()};
    const pr=sh.querySelector("#pr");pr&&(pr.onclick=()=>{S.plan2=null;save();close();render()})})}
function okumaHatirlatma(){const [h,m]=(S.okuSaat||"21:00").split(":").map(Number),t=new Date();t.setHours(h,m,0,0);if(t<new Date())t.setDate(t.getDate()+1);
  const d=planDurum();icsIndir([{t,b:"📖 Kur'an okuma vakti",a:d?`Bugünkü plan: günde ${d.gunluk} sayfa. Bireysel Cüz Takip uygulamasını açın.`:"Bireysel Cüz Takip uygulamasını açın.",r:"FREQ=DAILY",dk:30}],"kuran-okuma-hatirlatma.ics")}
function planBagla(el){
  const q=id=>el.querySelector(id);
  q("#pkur")&&(q("#pkur").onclick=planAyarSheet);q("#pay")&&(q("#pay").onclick=planAyarSheet);
  q("#poku")&&(q("#poku").onclick=()=>{const d=planDurum();okuyucu(sayfaCuzu(d.bas),{sayfa:d.bas})});
  q("#pokdum")&&(q("#pokdum").onclick=()=>{const d=planDurum();S.okunanSayfa=d.son;if(S.okunanSayfa>=604){S.hatim++;S.hatimLog.push(Date.now());toast("Hatim tamamlandı. Allah kabul etsin.")}else toast(`${d.bas}–${d.son}. sayfalar okundu. Yarın: ${d.son+1}. sayfadan`);save();render()});
  q("#pyeni")&&(q("#pyeni").onclick=()=>{S.okunanSayfa=0;S.plan2.bas=bugunISO();save();render()})}

/* ============ İL / KONUM ============ */
function ilSec(sonra){
  sheet(`<h3>Şehrinizi seçin</h3><p class="muted small">Namaz vakitleri ve hava durumu bu şehre göre gösterilir.</p>
   <button class="btn full ghost" id="gps" style="margin-bottom:10px">${ic("pin",16)} Konumumu kullan</button>
   <input class="in" id="iq" placeholder="İl ara…" aria-label="İl ara"><div class="rows" id="il" style="margin-top:8px;max-height:46vh;overflow:auto"></div>`,(sh,close)=>{
    const draw=q=>{const n=s=>s.toLocaleLowerCase("tr");sh.querySelector("#il").innerHTML=ILLER.map((x,i)=>[x,i]).filter(([x])=>!q||n(x[0]).startsWith(n(q))).map(([x,i])=>`<div class="rw" data-i="${i}"><div class="tx"><b>${esc(x[0])}</b></div>${S.il&&S.il.ad===x[0]?`<span class="src">Seçili</span>`:""}</div>`).join("")};
    draw("");sh.querySelector("#iq").oninput=e=>draw(e.target.value);
    const bit=il=>{S.il=il;save();close();toast(il.ad+" seçildi");sonra?sonra():render()};
    sh.querySelector("#il").onclick=e=>{const r=e.target.closest("[data-i]");if(!r)return;const x=ILLER[+r.dataset.i];bit({ad:x[0],lat:x[1],lon:x[2]})};
    sh.querySelector("#gps").onclick=()=>{if(!navigator.geolocation)return toast("Bu telefonda konum kullanılamıyor");toast("Konum alınıyor…");
      navigator.geolocation.getCurrentPosition(p=>{const la=p.coords.latitude,lo=p.coords.longitude;let en=ILLER[0],ed=1e9;ILLER.forEach(x=>{const d=(x[1]-la)**2+(x[2]-lo)**2;if(d<ed){ed=d;en=x}});bit({ad:en[0]+" (konumum)",lat:+la.toFixed(1),lon:+lo.toFixed(1)})},()=>toast("Konum izni verilmedi; listeden seçin"),{timeout:15000,maximumAge:600000})};
  })}
const ilAnahtar=()=>S.il?(S.il.lat.toFixed(2)+","+S.il.lon.toFixed(2)):"";

/* ============ NAMAZ VAKİTLERİ ============ */
const VAKIT_AD=[["imsak","İmsak"],["gunes","Güneş"],["ogle","Öğle"],["ikindi","İkindi"],["aksam","Akşam"],["yatsi","Yatsı"]];
async function vakitAyi(y,m){
  const key=`nv.${ilAnahtar()}.${y}-${m}`;try{const c=JSON.parse(ls.get(key)||"null");if(c&&c.length)return c}catch(e){}
  const j=await zamanli(`https://api.aladhan.com/v1/calendar/${y}/${m}?latitude=${S.il.lat}&longitude=${S.il.lon}&method=13&timezonestring=Europe/Istanbul`,20000);
  const t=x=>String(x).slice(0,5);
  const out=j.data.map(d=>[d.date.gregorian.day|0,t(d.timings.Fajr),t(d.timings.Sunrise),t(d.timings.Dhuhr),t(d.timings.Asr),t(d.timings.Maghrib),t(d.timings.Isha)]);
  try{Object.keys(localStorage).filter(k=>k.startsWith("nv.")&&!k.startsWith(`nv.${ilAnahtar()}.`)).forEach(k=>localStorage.removeItem(k));ls.set(key,JSON.stringify(out))}catch(e){}
  return out}
async function vakitGun(d){const a=await vakitAyi(d.getFullYear(),d.getMonth()+1);return a.find(x=>x[0]===d.getDate())||null}
function saatDate(gun,hhmm){const [h,m]=hhmm.split(":").map(Number);const d=new Date(gun);d.setHours(h,m,0,0);return d}
async function sonrakiVakit(){const now=new Date(),bug=await vakitGun(now);if(!bug)return null;
  for(let i=0;i<6;i++){const t=saatDate(now,bug[i+1]);if(t>now)return{i,t,bug}}
  const yar=new Date(now);yar.setDate(yar.getDate()+1);const yv=await vakitGun(yar).catch(()=>null);
  return{i:0,t:saatDate(yar,(yv||bug)[1]),bug}}
const kalanYaz=ms=>{const s=Math.max(0,Math.floor(ms/1000)),h=Math.floor(s/3600),m=Math.floor(s%3600/60),sn=s%60;return h?`${h} sa ${ikiH(m)} dk`:`${m} dk ${ikiH(sn)} sn`};
let sayacT=0;
function sayacBaslat(el,v){clearInterval(sayacT);const kutu=el.querySelector("#sayac");if(!kutu||!v)return;
  const tik=()=>{if(!kutu.isConnected){clearInterval(sayacT);return}const ms=v.t-new Date();if(ms<=0){clearInterval(sayacT);render();return}kutu.textContent=kalanYaz(ms)};tik();sayacT=setInterval(tik,1000)}
function vakitSatiri(bug,aktif){return `<div class="vakitler">${VAKIT_AD.map(([k,n],i)=>`<div class="${i===aktif?"on":""}"><span>${n}</span><b>${bug[i+1]}</b></div>`).join("")}</div>`}
async function vVakit(el){
  if(!S.il){el.innerHTML=`<div class="card empty">Namaz vakitleri için şehrinizi seçin.<br><br><button class="btn" id="sec">Şehir seç</button></div>`;el.querySelector("#sec").onclick=()=>ilSec();ilSec();return}
  setTitle("Namaz Vakitleri",S.il.ad);
  el.innerHTML=`<div class="spin"></div>`;
  const now=new Date();let ay,v;
  try{ay=await vakitAyi(now.getFullYear(),now.getMonth()+1);v=await sonrakiVakit()}catch(e){el.innerHTML=`<div class="card empty">Vakitler yüklenemedi; internet bağlantısını kontrol edin.<br><br><button class="btn" id="tk">Tekrar dene</button></div>`;el.querySelector("#tk").onclick=()=>render();return}
  if(cur.v!=="vakit")return;
  const bug=ay.find(x=>x[0]===now.getDate());const ayAd=now.toLocaleDateString("tr-TR",{month:"long",year:"numeric"});
  el.innerHTML=`<section class="frame vkt"><div class="pat"></div>
    <div class="greet">${esc(S.il.ad)} · ${now.toLocaleDateString("tr-TR",{weekday:"long",day:"numeric",month:"long"})}</div>
    <div class="kn" style="margin-top:2px">${esc(hicriYaz(now))}</div>
    <div class="nx">${v?`${VAKIT_AD[v.i][1]} vaktine`:""}</div><div class="sayac" id="sayac">–</div>
    ${bug?vakitSatiri(bug,v&&v.t.getDate()===now.getDate()?v.i:-1):""}</section>
   ${ezanKart()}
   ${vbKart()}
   <div class="row wrap" style="gap:8px;margin-bottom:12px"><button class="btn ghost sm" id="il">${ic("pin",14)} Şehri değiştir</button><button class="btn ghost sm" data-go="hava">${ic("sun",14)} Hava durumu</button><button class="btn ghost sm" data-go="kible">${ic("kible",14)} Kıble</button></div>
   <h2 class="sec">${esc(ayAd)} <small>imsakiye</small></h2>
   <div class="card" style="padding:0;overflow:auto"><table class="tablo"><thead><tr><th>Gün</th>${VAKIT_AD.map(([,n])=>`<th>${n}</th>`).join("")}</tr></thead>
    <tbody>${ay.map(r=>`<tr class="${r[0]===now.getDate()?"on":""}"><td>${r[0]}</td>${r.slice(1).map(x=>`<td>${x}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
   <p class="muted small">Vakitler, Diyanet İşleri Başkanlığı'nın hesaplama yöntemiyle (Aladhan, yöntem 13) şehir merkezi için hesaplanır; Diyanet'in yayımladığı vakitlerden 1–2 dakika farklı olabilir. Güneş vaktinde namaz kılınmaz; güneş doğduktan yaklaşık 45 dakika sonra kerahat vakti biter.</p>`;
  sayacBaslat(el,v);
  el.querySelector("#il").onclick=()=>ilSec();
  el.querySelector("#ezan").onclick=()=>vakitIcsSheet();
  el.querySelector("#vbd").onclick=vbAcKapa;
}
const EZAN_AD=["Sabah ezanı (imsak)","Güneş doğuşu","Öğle ezanı","İkindi ezanı","Akşam ezanı","Yatsı ezanı"];
function ezanKart(){const e=S.ezan,kalan=e?Math.ceil((e.bitis-Date.now())/864e5):0;
  const durum=!e?"Her vakitte telefonunuz bildirim versin. Uygulama kapalıyken de çalışır.":kalan>0?`${esc(e.il)} için ${new Date(e.bitis).toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric"})} tarihine kadar açık${kalan<=10?" · yenileme zamanı yaklaştı":""}.`:"Süresi doldu, yenilemeniz gerekiyor.";
  return `<div class="card ezan-kart ${e&&kalan>10?"acik":""}"><div class="row between" style="gap:10px"><div><b>${ic("bell",16)} Ezan aboneliği</b><div class="muted small" style="margin-top:4px">${durum}</div></div>
   <button class="btn sm ${e&&kalan>10?"ghost":"acc"}" id="ezan" style="white-space:nowrap;flex:none">${!e?"Abone ol":kalan>10?"Ayarla":"Yenile"}</button></div></div>`}
function vakitIcsSheet(){
  if(!S.il){ilSec();return}
  sheet(`<h3>Ezan aboneliği</h3><p class="muted small">Seçtiğiniz vakitler ${esc(S.il.ad)} için telefonunuzun takvimine eklenir. Her vakit girdiğinde telefon bildirim verir.</p>
   ${EZAN_AD.map((n,i)=>`<label class="row between" style="padding:6px 0"><span>${n}</span><input type="checkbox" data-v="${i}" ${i===1?"":"checked"}></label>`).join("")}
   <label class="lb">Ne kadar süreyle?</label><select class="in" id="sure"><option value="30">1 ay</option><option value="91">3 ay</option><option value="182">6 ay</option><option value="365" selected>1 yıl</option></select>
   <label class="lb">Bildirim ne zaman gelsin?</label><select class="in" id="once"><option value="0">Vakit girince</option><option value="5">5 dakika önce</option><option value="10">10 dakika önce</option><option value="15">15 dakika önce</option></select>
   <button class="btn full acc" id="ok" style="margin-top:14px">Takvime ekle</button>
   <p class="muted small" style="margin-top:10px">Aynı dosyayı tekrar eklerseniz takvim eski kayıtları günceller, çift bildirim gelmez.</p>`,(sh,close)=>{
    sh.querySelector("#ok").onclick=async()=>{const sec=[...sh.querySelectorAll("[data-v]")].filter(c=>c.checked).map(c=>+c.dataset.v);if(!sec.length)return toast("En az bir vakit seçin");
      const once=+sh.querySelector("#once").value,gunSay=+sh.querySelector("#sure").value,btn=sh.querySelector("#ok");btn.disabled=true;
      const olay=[];const d=new Date();d.setHours(0,0,0,0);const ilk=slug(S.il.ad);
      try{for(let g=0;g<gunSay;g++){const gun=new Date(d);gun.setDate(d.getDate()+g);if(g%15===0)btn.textContent=`Hazırlanıyor… %${Math.round(g/gunSay*100)}`;
          const r=await vakitGun(gun);if(!r)continue;
          for(const i of sec){const t=saatDate(gun,r[i+1]);if(t>new Date())olay.push({t,b:`🕌 ${EZAN_AD[i]}`,a:`${S.il.ad} · ${r[i+1]}`,dk:10,once:once?`-PT${once}M`:"PT0M",uid:`${icsT(gun).slice(0,8)}-${i}-${ilk}@bct-ezan`})}}
        const son=new Date(d);son.setDate(d.getDate()+gunSay);S.ezan={bitis:son.getTime(),il:S.il.ad,vakit:sec};save();close();
        icsIndir(olay,`ezan-${ilk}.ics`,true);if(cur.v==="vakit")render()}
      catch(e){btn.disabled=false;btn.textContent="Takvime ekle";toast("Vakitler alınamadı; internet bağlantısını kontrol edin")}}})}

/* ============ HAVA DURUMU ============ */
const HAVA={0:["Açık","☀️"],1:["Az bulutlu","🌤️"],2:["Parçalı bulutlu","⛅"],3:["Kapalı","☁️"],45:["Sisli","🌫️"],48:["Kırağılı sis","🌫️"],51:["Hafif çisenti","🌦️"],53:["Çisenti","🌦️"],55:["Yoğun çisenti","🌧️"],56:["Dondurucu çisenti","🌧️"],57:["Dondurucu çisenti","🌧️"],61:["Hafif yağmur","🌦️"],63:["Yağmur","🌧️"],65:["Şiddetli yağmur","🌧️"],66:["Dondurucu yağmur","🌧️"],67:["Dondurucu yağmur","🌧️"],71:["Hafif kar","🌨️"],73:["Kar","🌨️"],75:["Yoğun kar","❄️"],77:["Kar taneleri","🌨️"],80:["Hafif sağanak","🌦️"],81:["Sağanak","🌧️"],82:["Şiddetli sağanak","⛈️"],85:["Kar sağanağı","🌨️"],86:["Yoğun kar sağanağı","❄️"],95:["Gök gürültülü fırtına","⛈️"],96:["Dolulu fırtına","⛈️"],99:["Dolulu fırtına","⛈️"]};
const havaAd=c=>HAVA[c]||["—","🌡️"];
async function havaAl(){const key="hv."+ilAnahtar();try{const c=JSON.parse(ls.get(key)||"null");if(c&&Date.now()-c.t<30*60000)return c.d}catch(e){}
  const d=await zamanli(`https://api.open-meteo.com/v1/forecast?latitude=${S.il.lat}&longitude=${S.il.lon}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Europe%2FIstanbul&forecast_days=7`,15000);
  try{Object.keys(localStorage).filter(k=>k.startsWith("hv.")).forEach(k=>localStorage.removeItem(k));ls.set(key,JSON.stringify({t:Date.now(),d}))}catch(e){}return d}
async function vHava(el){
  if(!S.il){ilSec();el.innerHTML=`<div class="card empty">Hava durumu için şehrinizi seçin.</div>`;return}
  setTitle("Hava Durumu",S.il.ad);el.innerHTML=`<div class="spin"></div>`;
  let d;try{d=await havaAl()}catch(e){el.innerHTML=`<div class="card empty">Hava durumu yüklenemedi; internet bağlantısını kontrol edin.</div>`;return}
  if(cur.v!=="hava")return;const c=d.current,[ad,em]=havaAd(c.weather_code);
  el.innerHTML=`<div class="card hava-b"><div class="em">${em}</div><div><div class="deg">${Math.round(c.temperature_2m)}°</div><div>${ad}</div><div class="muted small">Hissedilen ${Math.round(c.apparent_temperature)}° · Rüzgâr ${Math.round(c.wind_speed_10m)} km/sa · Nem %${c.relative_humidity_2m}</div></div></div>
   <h2 class="sec">7 gün</h2><div class="rows">${d.daily.time.map((t,i)=>{const [a,e]=havaAd(d.daily.weather_code[i]);const g=new Date(t+"T12:00");return `<div class="rw" style="cursor:default"><div class="tx"><b>${i===0?"Bugün":g.toLocaleDateString("tr-TR",{weekday:"long"})}</b><span>${a}${d.daily.precipitation_probability_max[i]!=null?" · yağış %"+d.daily.precipitation_probability_max[i]:""}</span></div><span style="font-size:24px">${e}</span><b style="min-width:76px;text-align:right">${Math.round(d.daily.temperature_2m_max[i])}° / ${Math.round(d.daily.temperature_2m_min[i])}°</b></div>`}).join("")}</div>
   <p class="muted small">Veri: Open-Meteo. ${esc(S.il.ad)} için.</p>`}

/* ============ HİCRÎ TAKVİM VE DİNİ GÜNLER ============ */
const HF=new Intl.DateTimeFormat("en-u-ca-islamic-umalqura-nu-latn",{day:"numeric",month:"numeric",year:"numeric"});
function hicri(d){const p=HF.formatToParts(d),g=t=>+(p.find(x=>x.type===t)||{}).value;return{y:g("year"),m:g("month"),d:g("day")}}
const HICRI_AY=["Muharrem","Safer","Rebîülevvel","Rebîülâhir","Cemâziyelevvel","Cemâziyelâhir","Recep","Şaban","Ramazan","Şevval","Zilkade","Zilhicce"];
function hicriYaz(d){const h=hicri(d);return `${h.d} ${HICRI_AY[h.m-1]} ${h.y}`}
function diniGunler(){
  const out=[],bas=new Date();bas.setHours(12,0,0,0);bas.setDate(bas.getDate()-1);
  const ekle=(d,ad,not,kandil)=>out.push({d:new Date(d),ad,not,kandil});
  let regaib=null;
  for(let i=0;i<400;i++){const d=new Date(bas);d.setDate(bas.getDate()+i);const h=hicri(d),ert=new Date(d);ert.setDate(d.getDate()+1);const he=hicri(ert);
    if(h.m===1&&h.d===1)ekle(d,"Hicrî Yılbaşı",`${h.y} yılı başlar`);
    if(h.m===1&&h.d===10)ekle(d,"Âşûrâ Günü","Muharremin onuncu günü");
    if(h.m===3&&h.d===11)ekle(d,"Mevlid Kandili","Peygamberimizin doğumu; kandil bu akşam",true);
    if(h.m===7&&h.d===1)ekle(d,"Üç Ayların Başlangıcı","Recep ayı başlar");
    if(he.m===7&&he.d<=7&&ert.getDay()===5&&regaib!==he.y){regaib=he.y;ekle(d,"Regâib Kandili","Recebin ilk cuma gecesi; kandil bu akşam",true)}
    if(h.m===7&&h.d===26)ekle(d,"Mîrâc Kandili","Kandil bu akşam",true);
    if(h.m===8&&h.d===14)ekle(d,"Berat Kandili","Kandil bu akşam",true);
    if(he.m===9&&he.d===1)ekle(d,"İlk Teravih","Ramazan'ın ilk sahuru bu gece");
    if(h.m===9&&h.d===1)ekle(d,"Ramazan Başlangıcı","İlk oruç");
    if(h.m===9&&h.d===26)ekle(d,"Kadir Gecesi","Kandil bu akşam",true);
    if(he.m===10&&he.d===1)ekle(d,"Ramazan Bayramı Arifesi","");
    if(h.m===10&&h.d>=1&&h.d<=3)ekle(d,`Ramazan Bayramı ${h.d}. gün`,"");
    if(h.m===12&&h.d===9)ekle(d,"Kurban Bayramı Arifesi","");
    if(h.m===12&&h.d>=10&&h.d<=13)ekle(d,`Kurban Bayramı ${h.d-9}. gün`,"");
  }
  return out.filter(x=>x.d>=new Date(new Date().setHours(0,0,0,0)))}
function vGunler(el){
  const l=diniGunler(),bug=new Date();bug.setHours(0,0,0,0);
  el.innerHTML=`<div class="card"><b style="font-family:var(--serif)">Bugün</b><div class="muted">${new Date().toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric",weekday:"long"})} · ${esc(hicriYaz(new Date()))}</div></div>
   <div class="rows">${l.map(x=>{const g=Math.round((x.d-bug)/864e5);return `<div class="rw" style="cursor:default"><div class="ico" style="${x.kandil?"color:var(--acc)":""}">${ic(x.kandil?"moon":"cal")}</div><div class="tx"><b>${esc(x.ad)}</b><span>${x.d.toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric",weekday:"long"})}${x.not?" · "+esc(x.not):""}</span></div><span class="src" style="white-space:nowrap">${g<=0?"Bugün":g===1?"Yarın":g+" gün"}</span></div>`}).join("")}</div>
   <div class="row wrap" style="gap:8px;margin-top:12px"><button class="btn ghost sm" id="ics">${ic("cal",14)} Dini günleri takvime ekle</button></div>
   <p class="muted small">Tarihler Ümmü'l-Kurâ Hicrî takvimine göre hesaplanır; Diyanet takviminden bir gün farklı olabilir. Kandiller, belirtilen günü bağlayan gece (akşam namazından itibaren) idrak edilir.</p>`;
  el.querySelector("#ics").onclick=()=>icsIndir(l.map(x=>{const t=new Date(x.d);t.setHours(9,0,0,0);return{t,b:(x.kandil?"🌙 ":"🕌 ")+x.ad,a:x.not,dk:60}}),"dini-gunler.ics")}

/* ============ ZİKİR ============ */
function vZikir(el){
  const bugun=bugunISO(),top=(S.tesbihToplam||{})[bugun]||0;
  el.innerHTML=`<div class="big2"><div class="bigt" data-go="tesbihat"><b>Namaz tesbihatı</b><span>5 vakit · sayaçlı</span></div><div class="bigt alt" id="serbest"><b>Zikirmatik</b><span>Serbest sayaç</span></div></div>
   <h2 class="sec">Zikirler <small>bugün ${top} zikir</small></h2>
   <div class="rows">${ZIKIRLER.map((z,i)=>`<div class="rw" data-z="${i}"><div class="tx"><b>${esc(z.t)}</b><span>${esc(z.o.length>60?z.o.slice(0,58)+"…":z.o)}</span></div><span class="src">${(S.zikir[i]||0)?(S.zikir[i]+" / "):""}${z.n}</span></div>`).join("")}</div>
   <h2 class="sec">Dualar ve sureler</h2>
   <div class="rows">
    <div class="rw" data-d="kursi"><div class="ico">${ic("quran")}</div><div class="tx"><b>Âyetü'l-Kürsî</b><span>Bakara 2:255</span></div><span class="chev">${ic("chev",18)}</span></div>
    <div class="rw" data-d="amene"><div class="ico">${ic("quran")}</div><div class="tx"><b>Âmenerrasûlü</b><span>Bakara 2:285-286</span></div><span class="chev">${ic("chev",18)}</span></div>
    <div class="rw" data-go="cevsen"><div class="ico">${ic("cevsen")}</div><div class="tx"><b>Cevşen-ül Kebîr</b><span>1. bab, 100 bab takibi ve PDF</span></div><span class="chev">${ic("chev",18)}</span></div>
    <div class="rw" data-go="sure-36"><div class="ico">${ic("quran")}</div><div class="tx"><b>Yâsîn</b><span>36. sure</span></div><span class="chev">${ic("chev",18)}</span></div>
    <div class="rw" data-go="sure-67"><div class="ico">${ic("quran")}</div><div class="tx"><b>Mülk</b><span>67. sure</span></div><span class="chev">${ic("chev",18)}</span></div></div>`;
  el.querySelector("#serbest").onclick=()=>zikirmatik({t:"Zikirmatik",a:"",o:"Serbest sayaç",m:"",n:33},"serbest");
  el.onclick=e=>{const z=e.target.closest("[data-z]");if(z){const i=+z.dataset.z;zikirmatik(ZIKIRLER[i],i);return}
    const d=e.target.closest("[data-d]");if(d){const x=d.dataset.d==="kursi"?{...AYETEL_KURSI,t:"Âyetü'l-Kürsî"}:AMENERRASULU;sheet(`<h3>${esc(x.t||"Âyetü'l-Kürsî")}</h3><div class="arx" style="font-size:26px">${esc(x.a)}</div><p class="muted small" style="font-style:italic">${esc(x.o||"")}</p>${x.m?`<p style="font-family:var(--serif)">${esc(x.m)}</p>`:""}`)}}}
function zikirmatik(z,anahtar){
  S.zikir=S.zikir||{};let c=S.zikir[anahtar]||0,hedef=z.n;const C=2*Math.PI*100;
  sheet(`<h3>${esc(z.t)}</h3>${z.a?`<div class="arx" style="text-align:center;font-size:${z.a.length>120?22:30}px">${esc(z.a)}</div>`:""}<div class="muted small" style="text-align:center;font-style:italic">${esc(z.o)}</div>${z.m?`<p class="small" style="text-align:center">${esc(z.m)}</p>`:""}
   <div class="ring"><svg viewBox="0 0 220 220"><circle cx="110" cy="110" r="100" fill="none" stroke="var(--soft)" stroke-width="8"/><circle id="arc" cx="110" cy="110" r="100" fill="none" stroke="var(--acc)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg><button id="cnt" aria-label="Say"><b>0</b><span>/ ${hedef}</span></button></div>
   <div class="row" style="gap:8px;justify-content:center"><button class="btn ghost sm" id="hd">Hedef: ${hedef}</button><button class="btn ghost sm" id="zr">Sıfırla</button></div>`,(sh)=>{
    const ciz=()=>{sh.querySelector("#cnt b").textContent=c;sh.querySelector("#cnt span").textContent="/ "+hedef;sh.querySelector("#arc").setAttribute("stroke-dashoffset",C*(1-Math.min(1,(c%hedef||(c?hedef:0))/hedef)));sh.querySelector("#hd").textContent="Hedef: "+hedef};ciz();
    sh.querySelector("#cnt").onclick=()=>{c++;S.zikir[anahtar]=c;const b=bugunISO();S.tesbihToplam={[b]:((S.tesbihToplam||{})[b]||0)+1};try{navigator.vibrate&&navigator.vibrate(c%hedef===0?[60,40,60]:12)}catch(e){}if(c%hedef===0)toast(`${c} oldu. Allah kabul etsin.`);ciz();clearTimeout(zikirmatik.t);zikirmatik.t=setTimeout(save,800)};
    sh.querySelector("#zr").onclick=()=>{c=0;S.zikir[anahtar]=0;save();ciz()};
    sh.querySelector("#hd").onclick=()=>{const l=[33,99,100,500,1000];hedef=l[(l.indexOf(hedef)+1)%l.length];ciz()};
  })}

/* ============ SİYER, PEYGAMBERLER, SAHABELER ============ */
function kitapListe(el,liste,anah,baslik,alt){
  const i=cur.p!=null?parseInt(cur.p):NaN;
  if(!isNaN(i)&&liste[i]){const x=liste[i];setTitle(x.b,baslik);
    el.innerHTML=`<article class="card yazi"><div class="src">${esc(x.y||x.u||alt||"")}</div><h2>${esc(x.b)}</h2><p>${esc(x.m)}</p>${x.k?`<p class="muted small">Kur'an'da: ${esc(x.k)}</p>`:""}</article>
     <div class="row between" style="margin-top:12px">${i>0?`<button class="btn line sm" data-go="${anah}-${i-1}">‹ ${esc(liste[i-1].b)}</button>`:"<span></span>"}${i<liste.length-1?`<button class="btn sm" data-go="${anah}-${i+1}">${esc(liste[i+1].b)} ›</button>`:""}</div>`;
    S.okundu=S.okundu||{};S.okundu[anah+i]=1;save();return}
  el.innerHTML=`<div class="rows">${liste.map((x,j)=>`<div class="rw" data-go="${anah}-${j}"><div class="num">${j+1}</div><div class="tx"><b>${esc(x.b)}</b><span>${esc(x.y||x.u||(x.k?"Kur'an'da: "+x.k:""))}</span></div>${(S.okundu||{})[anah+j]?`<span class="src">✓</span>`:`<span class="chev">${ic("chev",18)}</span>`}</div>`).join("")}</div>
   <p class="muted small">Bu metinler Kur'an, sahih hadisler ve temel siyer kaynaklarındaki bilgilere dayanarak bu uygulama için kısa ve sade olarak yazılmıştır. Ayrıntılı okuma için kendi kitaplarınızı Kitaplık'tan PDF olarak ekleyebilirsiniz.</p>`}
const vSiyer=el=>kitapListe(el,SIYER,"siyer","Siyer-i Nebî");
const vPeygamber=el=>kitapListe(el,PEYGAMBERLER,"peygamber","Peygamberler");
const vSahabe=el=>kitapListe(el,SAHABELER,"sahabe","Sahabeler");

/* ============ BUGÜN ============ */
async function vBugun(el){
  const d=GUNLUK[dayIdx()%GUNLUK.length],h=HADISLER[dayIdx()%HADISLER.length],now=new Date();
  const yak=diniGunler()[0];const bug0=new Date();bug0.setHours(0,0,0,0);
  const gk=yak?Math.round((yak.d-bug0)/864e5):0;
  const hizli=[["kuran","quran","Kur'an"],["kible","kible","Kıble"],["grup","group","Grup"],["zikir","tesbih","Zikirmatik"],["cuz","cuz","Hatim planı"],["vakit","clock","İmsakiye"],["kitaplik","books","Kitaplık"],["duvar","phone","Ekran resmi"]];
  el.innerHTML=`
  <section class="hero" id="hero"><div class="pat"></div>
   <div class="hero-ust"><div><div class="h-sel">${selam()}</div><div class="h-tar">${now.toLocaleDateString("tr-TR",{day:"numeric",month:"long",weekday:"long"})}</div><div class="h-hic">${esc(hicriYaz(now))}</div></div>
    <button class="h-il" id="ilsec">${ic("pin",14)} ${S.il?esc(S.il.ad.replace(" (konumum)","")):"Şehir seç"}</button></div>
   <div id="vk">${S.il?`<div class="spin" style="border-top-color:#fff"></div>`:`<p class="h-bos">Namaz vakitleri ve hava durumu için şehrinizi seçin.</p>`}</div>
   <div class="h-hava" id="hv"></div></section>
  <div class="hizli">${hizli.map(([g,i,t])=>`<button data-go="${g}"><span>${ic(i,22)}</span>${t}</button>`).join("")}</div>
  ${hatimKarti()}
  <h2 class="sec">Öğretmenler için</h2><div class="rows dp-kart">${dpKart()}</div>
  ${S.son?`<div class="card devam" data-go="sure-${S.son.s}-a${S.son.a}"><div class="ico2">${ic("bm",20)}</div><div><span class="muted small">Kaldığınız yer</span><b>${esc(SURELER[S.son.s-1][0])} · ${S.son.a}. ayet</b></div><span class="chev">${ic("chev",18)}</span></div>`:""}
  <h2 class="sec">Grup okuma</h2>${grupKarti()}
  ${planKart()}
  <h2 class="sec">Günün ayeti</h2>
  <section class="frame"><div class="pat"></div><div class="ay">${esc(d.a)}</div><div class="ml">${esc(d.m)}</div><div class="kn">${esc(d.k)}</div>
   <div class="acts"><button id="dOku">Surede oku</button><button id="dKay">${isFav({kaynak:d.k,metin:d.m})?"Kaydedildi":"Kaydet"}</button><button data-go="duvar">Ekran resmi yap</button></div></section>
  ${yak?`<div class="card dg" data-go="gunler"><div class="dg-g"><b>${gk<=0?"Bugün":gk}</b>${gk>0?"<span>gün</span>":""}</div><div><b>${esc(yak.ad)}</b><span class="muted small">${yak.d.toLocaleDateString("tr-TR",{day:"numeric",month:"long",weekday:"long"})}</span></div><span class="chev">${ic("chev",18)}</span></div>`:""}
  <h2 class="sec">Günün hadisi</h2>
  <div class="card hadis"><div class="arx">${esc(h.a)}</div><p style="margin:6px 0;font-family:var(--serif)">${esc(h.m)}</p><span class="src">${esc(h.s)}</span></div>
  <div class="rows" style="margin-top:14px">${[["siyer","risale","Siyer-i Nebî","Peygamberimizin hayatı"],["peygamber","books","Peygamberler","Kur'an'da adı geçen 25 peygamber"],["sahabe","group","Sahabeler","Örnek hayatlar"],["kayit","bm","Kaydettiklerim",S.fav.length+" ayet ve hadis"]].map(([g,i,t,s])=>`<div class="rw" data-go="${g}"><div class="ico">${ic(i)}</div><div class="tx"><b>${t}</b><span>${s}</span></div><span class="chev">${ic("chev",18)}</span></div>`).join("")}</div>`;
  el.querySelector("#dOku").onclick=()=>go(`sure-${d.s}-a${d.n}`);
  el.querySelector("#dKay").onclick=e=>{toggleFav({tip:"Ayet",kaynak:d.k,metin:d.m,ar:d.a});e.target.textContent=isFav({kaynak:d.k,metin:d.m})?"Kaydedildi":"Kaydet"};
  planBagla(el);
  el.querySelector("#ilsec").onclick=()=>ilSec();
  grupArkaPlan();
  if(!S.il)return;
  try{const v=await sonrakiVakit();if(cur.v!=="home")return;const box=el.querySelector("#vk");
    if(v){box.innerHTML=`<div class="h-vakit"><span>${VAKIT_AD[v.i][1]} vaktine</span><b id="sayac">–</b></div>${vakitSatiri(v.bug,v.t.getDate()===new Date().getDate()?v.i:-1)}`;box.onclick=()=>go("vakit");sayacBaslat(el,v)}}
  catch(e){const box=el.querySelector("#vk");if(box)box.innerHTML=`<p class="h-bos">Vakitler için internet gerekli (bir kez).</p>`}
  havaAl().then(hd=>{if(cur.v!=="home")return;const b=el.querySelector("#hv");if(!b)return;const [a,e]=havaAd(hd.current.weather_code);
    b.innerHTML=`<span class="hv-e">${e}</span><b>${Math.round(hd.current.temperature_2m)}°</b><span>${a} · ${Math.round(hd.daily.temperature_2m_max[0])}° / ${Math.round(hd.daily.temperature_2m_min[0])}°</span>`;b.onclick=()=>go("hava")}).catch(()=>{});
}

/* ============ AYARLAR ============ */
function vAyarlar(el){
  el.innerHTML=`<div class="rows">
   <div class="rw" id="il"><div class="ico">${ic("pin")}</div><div class="tx"><b>Şehir</b><span>${S.il?esc(S.il.ad):"Seçilmedi"}</span></div><span class="chev">${ic("chev",18)}</span></div>
   <div class="rw" id="pl"><div class="ico">${ic("cuz")}</div><div class="tx"><b>Okuma planı ve hatırlatma</b><span>${S.plan2?S.plan2.gun+" günde hatim · "+esc(S.okuSaat):"Kurulmadı"}</span></div><span class="chev">${ic("chev",18)}</span></div></div>
  <h2 class="sec">Tema</h2>
  <div class="themes" id="tm">${TEMALAR.map(([k,n,a,b])=>`<button class="th ${k===S.tema?"on":""}" data-t="${k}"><i style="background:linear-gradient(150deg,${a},${b})"></i>${n}</button>`).join("")}</div>
  <h2 class="sec">Okuma</h2>
  <div class="card"><div class="row between"><span>Arapça yazı boyutu</span><div class="row" style="gap:6px"><button class="btn sm ghost" id="fm">A−</button><b id="fs">${S.afs}</b><button class="btn sm ghost" id="fp">A+</button></div></div>
   <div class="arx" id="fx" style="font-size:${S.afs}px;margin-top:8px">${BESMELE}</div>
   <label class="row between" style="margin-top:10px"><span>Meali göster (Elmalılı)</span><input type="checkbox" id="ml" ${S.meal?"checked":""}></label>
   <label class="row between" style="margin-top:8px"><span>Okunuşu göster</span><input type="checkbox" id="ok" ${S.okunus?"checked":""}></label>
   <label class="row between" style="margin-top:8px"><span>Tefsiri göster (Celâleyn)</span><input type="checkbox" id="tf" ${S.tefsir?"checked":""}></label></div>
  <h2 class="sec">İnternetsiz kullanım</h2>${typeof cdKart==="function"?cdKart():""}
  ${S.hatimAcik?`<h2 class="sec">Haftalık hatim grubu</h2>${hatimAyarHTML()}`:""}
  <h2 class="sec">Açılış</h2>
  <div class="card"><label class="row between"><span>Açılışta besmele ve selam</span><input type="checkbox" id="acs" ${S.acilis!==false?"checked":""}></label>
   <p class="muted small" style="margin:6px 0 10px">Uygulama her açıldığında besmele hafız sesinden okunur; “${ACILIS_SELAM}” yazısı ekranda görünür.</p><button class="btn sm ghost" id="acd">Şimdi dinle</button></div>
  <h2 class="sec">Sesli komut</h2>
  <div class="card"><label class="row between"><span>Mikrofon düğmesini göster</span><input type="checkbox" id="skg" ${S.sesliKomut!==false?"checked":""}></label>
   <label class="row between" style="margin-top:8px"><span>Komutlara sesli cevap ver</span><input type="checkbox" id="skc" ${S.sesliCevap!==false?"checked":""}></label>
   <label class="row between" style="margin-top:8px"><span>Açılışta mikrofonun yerini sesli söyle</span><input type="checkbox" id="skr" ${S.sesliRehber!==false?"checked":""}></label>
   <p class="muted small" style="margin:8px 0 6px">Sağ alttaki mikrofona dokunup konuşun. Örnekler:</p>
   <ul class="small sk-liste"><li>“Yasin suresini oku” · “Mülk suresini dinle”</li><li>“Beşinci cüzü dinle” · “Yirmi dördüncü cüz”</li><li>“Namaza kaç dakika var” · “Akşam ezanı kaçta” · “Bugünkü vakitler”</li><li>“Hava nasıl” · “Yarın yağmur var mı” · “Saat kaç” · “Bugün ne günü”</li><li>“Sıradaki kandil ne zaman” · “Günün ayeti” · “Günün hadisi” · “Kıble”</li><li>“Zikir” · “Hadisler” · “Ana sayfa” · “Geri”</li><li>“Hangi cüzdeyim” · “Kaldığım yer” · “Bu sayfada ne var”</li><li>“Bugün derslerim ne” · “Bugün hangi sınıflara giriyorum” · “Sıradaki dersim ne”</li><li>“Yarın derslerim” · “Altı F ile ne zaman dersim var” · “Boş saatlerim”</li><li>“Sabır ile ilgili ayetler”</li><li>Okurken: “Dur” · “Devam” · “Yardım”</li></ul></div>
  <div class="rows">
   <div class="rw" id="kur"><div class="ico">${ic("phone")}</div><div class="tx"><b>Uygulamayı telefona kur</b><span>Ana ekrandan açılsın, internetsiz çalışsın</span></div></div>
   <div class="rw" id="bk"><div class="ico">${ic("dl")}</div><div class="tx"><b>Yedek indir</b><span>Hatim, plan ve kayıtlarını dosyaya al</span></div></div>
   <div class="rw" id="rs"><div class="ico">${ic("plus")}</div><div class="tx"><b>Yedekten geri yükle</b><span>Daha önce indirdiğin .json dosyası</span></div></div></div>
  <h2 class="sec">Kaynaklar</h2>
  <div class="card small muted">Kur'an metni, Elmalılı Hamdi Yazır meali, Türkçe okunuş ve Celâleyn tefsiri: tanzil.net verileri, alquran.cloud üzerinden. Kıraat sesleri: islamic.network. Hadis Ansiklopedisi: HadeethEnc.com. Namaz vakitleri: Aladhan (Diyanet yöntemi). Hava: Open-Meteo. Siyer, peygamber ve sahabe metinleri bu uygulama için özgün olarak yazılmıştır. Seçme hadisler Buhârî ve Müslim'dendir; anlamlar sadeleştirilmiştir. Eklediğiniz PDF'ler yalnızca telefonunuzda kalır.<br><br><a href="gizlilik.html">Gizlilik politikası</a></div><div class="small muted" id="surumBilgi" style="text-align:center;margin:14px 0 4px;padding:6px">Uygulama sürümü</div>`;try{caches.keys().then(k=>{const v=k.filter(x=>/^no-v\d+$/.test(x)).sort((a,b)=>b.slice(4)-a.slice(4))[0];const d=el.querySelector("#surumBilgi");if(d){let n=0,t=0;d.onclick=()=>{clearTimeout(t);t=setTimeout(()=>{n=0},2500);if(++n>=7){n=0;if(!S.hatimAcik)hatimGiris()}}}if(d&&v)d.textContent="Uygulama sürümü: v"+v.slice(4)})}catch(e){}
  cdBagla(el);el.querySelector("#acs").onchange=e=>{S.acilis=e.target.checked;save()};el.querySelector("#skg").onchange=e=>{S.sesliKomut=e.target.checked;save();skGoster()};el.querySelector("#skc").onchange=e=>{S.sesliCevap=e.target.checked;save()};el.querySelector("#skr").onchange=e=>{S.sesliRehber=e.target.checked;save()};el.querySelector("#acd").onclick=()=>acilisGoster(true);el.querySelector("#il").onclick=()=>ilSec();el.querySelector("#pl").onclick=planAyarSheet;
  el.querySelector("#tm").onclick=e=>{const b=e.target.closest("[data-t]");if(!b)return;S.tema=b.dataset.t;applyTheme();save();el.querySelectorAll(".th").forEach(t=>t.classList.toggle("on",t===b))};
  const fz=d=>{S.afs=Math.max(20,Math.min(50,S.afs+d));save();el.querySelector("#fs").textContent=S.afs;el.querySelector("#fx").style.fontSize=S.afs+"px"};
  el.querySelector("#fm").onclick=()=>fz(-2);el.querySelector("#fp").onclick=()=>fz(2);
  el.querySelector("#ml").onchange=e=>{S.meal=e.target.checked;save()};el.querySelector("#ok").onchange=e=>{S.okunus=e.target.checked;save()};el.querySelector("#tf").onchange=e=>{S.tefsir=e.target.checked;save()};
  el.querySelector("#kur").onclick=kurulumGoster;
  el.querySelector("#bk").onclick=()=>{indir(new Blob([JSON.stringify({uygulama:"bireysel-cuz-takip",surum:1,tarih:Date.now(),durum:S},null,1)],{type:"application/json"}),`bireysel-cuz-takip-yedek-${bugunISO()}.json`);toast("Yedek indirildi")};
  el.querySelector("#rs").onclick=()=>{const p=$("#jpicker");p.value="";p.click()};
}
$("#jpicker").onchange=async e=>{const f=e.target.files&&e.target.files[0];if(!f)return;
  try{const j=JSON.parse(await f.text());if(j.uygulama!=="bireysel-cuz-takip"||!j.durum)throw 0;
    confirmSheet("Yedek geri yüklensin mi?",`${trDate(j.tarih)} tarihli yedek mevcut verilerin yerine geçer. PDF dosyaları yedekte yoktur.`,"Geri yükle",()=>{S=Object.assign(structuredClone(DEF),j.durum);save();applyTheme();toast("Yedek geri yüklendi");render()})}
  catch(err){toast("Bu dosya geçerli bir yedek değil")}};

/* ============ KURULUM, ÇEVRİMDIŞI, BAŞLAT ============ */
let kurIstegi=null;const kurulu=()=>matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
addEventListener("beforeinstallprompt",e=>{e.preventDefault();kurIstegi=e});
addEventListener("appinstalled",()=>{kurIstegi=null;toast("Bireysel Cüz Takip telefona kuruldu")});
async function kurulumGoster(){if(kurulu())return toast("Uygulama zaten kurulu");if(kurIstegi){kurIstegi.prompt();await kurIstegi.userChoice.catch(()=>null);kurIstegi=null;return}
  sheet(`<h3>Uygulamayı telefona kur</h3><p class="small"><b>Android (Chrome):</b> Sağ üstteki ⋮ menüsü → <b>Uygulamayı yükle</b> (ya da <b>Ana ekrana ekle</b>) → <b>Yükle</b>.</p><p class="small"><b>iPhone (Safari):</b> Alttaki Paylaş (□↑) → <b>Ana Ekrana Ekle</b> → <b>Ekle</b>.</p><button class="btn full" id="tm">Tamam</button>`,(sh,c)=>{sh.querySelector("#tm").onclick=c})}
$("#ayar").onclick=()=>go("ayarlar");
if("serviceWorker" in navigator)navigator.serviceWorker.register("sw.js").catch(e=>console.warn("SW",e));
cur=parse();render();
if(!S.il&&!ls.get("no.ilsoruldu")&&cur.v==="home"){ls.set("no.ilsoruldu","1");setTimeout(()=>ilSec(),400)}

/* ============ BİLDİRİM PANOSUNDA VAKİTLER ============ */
function vbKart(){const ac=S.vakitBildirim&&typeof Notification!=="undefined"&&Notification.permission==="granted";
  return `<div class="card ezan-kart ${ac?"acik":""}"><div class="row between" style="gap:10px"><div><b>${ic("phone",16)} Bildirim panosunda vakitler</b><div class="muted small" style="margin-top:4px">${ac?"Açık. Uygulamayı her açtığınızda güncellenir.":"Ekranı aşağı çektiğinizde bugünün vakitleri görünsün."}</div></div>
   <button class="btn sm ${ac?"ghost":"acc"}" id="vbd" style="white-space:nowrap;flex:none">${ac?"Kapat":"Aç"}</button></div></div>`}
async function vbAcKapa(){
  if(typeof Notification==="undefined"||!("serviceWorker" in navigator)){toast("Bu telefon bildirim göstermeyi desteklemiyor");return}
  if(S.vakitBildirim&&Notification.permission==="granted"){S.vakitBildirim=false;save();try{const r=await navigator.serviceWorker.ready;(await r.getNotifications({tag:"bct-vakit"})).forEach(n=>n.close())}catch(e){}await vakitBildirimGuncelle();render();return}
  if(!S.il){ilSec();return}
  let izin=Notification.permission;if(izin!=="granted")try{izin=await Notification.requestPermission()}catch(e){}
  if(izin!=="granted"){sheet(`<h3>Bildirim izni gerekiyor</h3><p class="small">Telefonun <b>Ayarlar → Uygulamalar → Bireysel Cüz Takip → Bildirimler</b> bölümünden bildirimlere izin verin, sonra bu düğmeye tekrar basın.</p><button class="btn full" id="tm">Tamam</button>`,(sh,c)=>{sh.querySelector("#tm").onclick=c});return}
  S.vakitBildirim=true;save();await vakitBildirimGuncelle();toast("Vakitler bildirim panosuna eklendi");render()}
function vbResim(bug,aktif){try{const W=720,H=330,c=document.createElement("canvas");c.width=W;c.height=H;const x=c.getContext("2d");
  const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,"#0b3d31");g.addColorStop(1,"#17644f");x.fillStyle=g;x.fillRect(0,0,W,H);
  x.save();x.globalAlpha=.07;for(let yy=-40;yy<H+60;yy+=80)for(let xx=-40;xx<W+60;xx+=80)star8(x,xx+((yy/80|0)%2)*40,yy,22,null,"#f3d27a",1.5);x.restore();
  x.textAlign="left";x.fillStyle="#f3d27a";x.font="600 26px Manrope,sans-serif";x.fillText(`${S.il.ad} · ${new Date().toLocaleDateString("tr-TR",{day:"numeric",month:"long",weekday:"long"})}`,34,52);
  x.textAlign="right";x.fillStyle="rgba(255,255,255,.7)";x.font="500 22px Manrope,sans-serif";x.fillText(hicriYaz(new Date()),W-34,52);
  const cw=(W-48)/3,ch=118;VAKIT_AD.forEach(([,n],i)=>{const cx=24+(i%3)*cw,cy=78+Math.floor(i/3)*(ch+8),on=i===aktif;
    x.fillStyle=on?"#f5a623":"rgba(255,255,255,.09)";rr(x,cx+6,cy,cw-12,ch,18);x.fill();if(on){x.strokeStyle="#fff3d6";x.lineWidth=3;rr(x,cx+6,cy,cw-12,ch,18);x.stroke()}
    x.textAlign="center";x.fillStyle=on?"#0b3d31":"rgba(255,255,255,.78)";x.font="600 24px Manrope,sans-serif";x.fillText(n,cx+cw/2,cy+42);
    x.fillStyle=on?"#0b3d31":"#ffffff";x.font="700 44px Manrope,sans-serif";x.fillText(bug[i+1],cx+cw/2,cy+94)});
  return c.toDataURL("image/png")}catch(e){return undefined}}
async function vakitBildirimEski(){ // eski tek vakit bildirimi; yerini bildirim.js aldı
  if(!S.vakitBildirim||!S.il||typeof Notification==="undefined"||Notification.permission!=="granted"||!("serviceWorker" in navigator))return;
  try{const now=new Date(),bug=await vakitGun(now);if(!bug)return;
    let aktif=-1;for(let i=0;i<6;i++)if(saatDate(now,bug[i+1])<=now)aktif=i;if(aktif<0)aktif=5;
    const baslik=`${S.il.ad} · ${VAKIT_AD[aktif][1]} vakti`,govde="";
    const r=await navigator.serviceWorker.ready;const var_=(await r.getNotifications({tag:"bct-vakit"}))[0];
    if(var_&&var_.title===baslik&&var_.data&&var_.data.gun===bugunISO())return;
    await r.showNotification(baslik,{body:govde,image:vbResim(bug,aktif),tag:"bct-vakit",renotify:false,silent:true,requireInteraction:true,icon:"icon-192.png",badge:"rozet.png",data:{url:"./#vakit",gun:bugunISO()}})}catch(e){console.warn("vakit bildirimi",e)}}
setTimeout(vakitBildirimGuncelle,2500);setInterval(vakitBildirimGuncelle,60000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden)vakitBildirimGuncelle()});
