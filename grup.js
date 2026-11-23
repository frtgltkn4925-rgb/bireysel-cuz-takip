"use strict";
/* ============ GRUP OKUMA ============ */
const GRUP_API=(self.BCT_AYAR&&self.BCT_AYAR.GRUP_API)||"";
const UYGULAMA_ADRESI="https://frtgltkn4925-rgb.github.io/bireysel-cuz-takip/";
S.gruplar=S.gruplar||[];
const grupBul=kod=>S.gruplar.find(g=>g.kod===kod);
const aktifGrup=()=>grupBul(S.aktifGrup)||S.gruplar[0]||null;
const gCache=kod=>{try{return JSON.parse(ls.get("gr."+kod)||"null")}catch(e){return null}};

function grupIstek(fn,args){return new Promise((res,rej)=>{
  if(!/^https?:/.test(GRUP_API))return rej(new Error("Grup sunucusu henüz ayarlanmadı."));
  const c=new AbortController(),t=setTimeout(()=>c.abort(),25000);
  fetch(GRUP_API,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({fn,args}),signal:c.signal,redirect:"follow"})
   .then(r=>r.json()).then(j=>j&&j.ok?res(j.veri):rej(new Error((j&&j.hata)||"Sunucu hatası")),()=>rej(new Error(navigator.onLine?"Sunucuya ulaşılamadı. Biraz sonra tekrar deneyin.":"İnternet bağlantısı yok.")))
   .finally(()=>clearTimeout(t))})}
const anahtarlar=g=>({kod:g.kod,uAnahtar:g.u||"",yAnahtar:g.y||""});
function grupKaydet(kod,d){try{ls.set("gr."+kod,JSON.stringify({t:Date.now(),d}))}catch(e){}const g=grupBul(kod);if(g&&d){g.ad=d.ad;g.ben=d.ben;save()}}
async function grupDurum(kod){const g=grupBul(kod);const d=await grupIstek("durum",g?anahtarlar(g):{kod});grupKaydet(kod,d);return d}
const tarihKisa=iso=>{if(!iso)return"";const d=new Date(iso+"T12:00");return d.toLocaleDateString("tr-TR",{day:"numeric",month:"long",weekday:"long"})};
const kalanGun=iso=>Math.round((new Date(iso+"T12:00")-new Date(new Date().setHours(12,0,0,0)))/864e5);
function davetMetni(g,d){const ben=d&&d.ben?`Ben ${d.ben}. cüzü okuyorum. `:"";
  return `🕌 *${g.ad}* hatim grubuna davetlisiniz.\n${ben}Boş bir cüz seçip katılmak için:\n${UYGULAMA_ADRESI}#grup-${g.kod}\n\nUygulamada *Grup → Gruba katıl* deyip şu kodu da yazabilirsiniz: *${g.kod}*\nAllah kabul etsin.`}
function davetGonder(g,d){const m=davetMetni(g,d);if(navigator.share){navigator.share({text:m}).catch(()=>{});return}location.href="https://wa.me/?text="+encodeURIComponent(m)}

let grupT=0;
function vGrup(el){
  clearInterval(grupT);
  const p=cur.p&&cur.p.toUpperCase();
  if(p&&!grupBul(p)){grupKatilEkrani(el,p);return}
  if(p&&grupBul(p)){S.aktifGrup=p;save()}
  const g=aktifGrup();
  if(!g){grupGiris(el);return}
  setTitle(g.ad||"Grup","Grup okuma · "+g.kod);
  const c=gCache(g.kod);grupCiz(el,g,c&&c.d,!c);
  const yenile=()=>grupDurum(g.kod).then(d=>{if(cur.v==="grup"&&aktifGrup()===g)grupCiz(el,g,d,false)}).catch(e=>{if(cur.v!=="grup")return;const n=el.querySelector("#gNot");if(n)n.textContent=e.message});
  yenile();grupT=setInterval(()=>{if(cur.v!=="grup"){clearInterval(grupT);return}if(!document.hidden)yenile()},20000);
}

function grupGiris(el){
  setTitle("Grup okuma");
  el.innerHTML=`<section class="frame gh"><div class="pat"></div>
    <div class="gh-ic">${ic("group",34)}</div>
    <h2>Birlikte hatim</h2>
    <p>30 kişilik bir hatim halkası kurun. Herkes kendi adını yazıp bir cüz alır, okuyunca işaretler. Her hafta herkes kendiliğinden bir sonraki cüze geçer.</p></section>
   <div class="big2"><button class="bigt" id="kur"><b>Grup kur</b><span>Yönetici siz olursunuz, kodu paylaşırsınız</span></button>
    <button class="bigt alt" id="kat"><b>Gruba katıl</b><span>Size gelen kodu ya da linki kullanın</span></button></div>
   <div class="card small muted">Gruptaki herkes yalnızca adları ve hangi cüzün okunduğunu görür. Telefon numarası ya da e-posta istenmez.</div>`;
  el.querySelector("#kur").onclick=grupKurSheet;
  el.querySelector("#kat").onclick=()=>kodSor();
}
function kodSor(){sheet(`<h3>Gruba katıl</h3><p class="muted small">Yöneticinin paylaştığı 6 harfli kodu yazın.</p><input class="in kodin" id="k" maxlength="8" autocapitalize="characters" placeholder="Örn. K7MZQ2"><button class="btn full" id="ok" style="margin-top:12px">Devam</button>`,(sh,c)=>{
  const i=sh.querySelector("#k");setTimeout(()=>i.focus(),60);
  const git=()=>{const k=i.value.toUpperCase().replace(/[^A-Z0-9]/g,"");if(k.length<5)return toast("Kodu eksiksiz yazın");c();go("grup-"+k)};
  sh.querySelector("#ok").onclick=git;i.onkeydown=e=>{if(e.key==="Enter")git()}})}

function cuzSecici(yer,secili){return `<div class="csec">${Array.from({length:30},(_,i)=>{const k=i+1,dolu=yer&&yer[i];return `<button type="button" data-c="${k}" class="${dolu?"dolu":""} ${k===secili?"on":""}" ${dolu?"disabled":""} aria-label="${k}. cüz${dolu?", dolu":""}">${k}</button>`}).join("")}</div>`}

function grupKurSheet(){
  const bit=new Date();bit.setDate(bit.getDate()+7);const iso=`${bit.getFullYear()}-${ikiH(bit.getMonth()+1)}-${ikiH(bit.getDate())}`;
  let sec=1;
  sheet(`<h3>Grup kur</h3>
   <label class="lb">Grup adı</label><input class="in" id="ga" maxlength="40" placeholder="Örn. Cuma Hatim Halkası">
   <label class="lb">Adınız (grupta görünecek)</label><input class="in" id="ka" maxlength="30" value="${esc(S.adim||"")}" placeholder="Adınız soyadınız">
   <label class="lb">Bu haftanın son okuma günü</label><input class="in" type="date" id="bt" value="${iso}">
   <label class="lb">Okuyacağınız cüz</label>${cuzSecici(null,1)}
   <button class="btn full" id="ok" style="margin-top:14px">Grubu kur</button>
   <p class="muted small">Son okuma günü geçince herkes kendiliğinden bir sonraki cüze geçer ve yeni hafta başlar.</p>`,(sh,close)=>{
    sh.querySelector(".csec").onclick=e=>{const b=e.target.closest("[data-c]");if(!b)return;sec=+b.dataset.c;sh.querySelectorAll(".csec button").forEach(x=>x.classList.toggle("on",x===b))};
    sh.querySelector("#ok").onclick=async e=>{const ad=sh.querySelector("#ga").value.trim(),kisi=sh.querySelector("#ka").value.trim();
      if(!ad)return toast("Grup adını yazın");if(!kisi)return toast("Adınızı yazın");
      e.target.disabled=true;e.target.textContent="Kuruluyor…";
      try{const r=await grupIstek("grupKur",{ad,kisi,cuz:sec,bitis:sh.querySelector("#bt").value});
        S.adim=kisi;S.gruplar.push({kod:r.durum.kod,ad,u:r.uAnahtar,y:r.yAnahtar,ben:r.durum.ben});S.aktifGrup=r.durum.kod;save();grupKaydet(r.durum.kod,r.durum);
        close();toast("Grup kuruldu. Şimdi davet linkini paylaşın.");
        if(cur.v==="grup")render();else go("grup");
        setTimeout(()=>davetSheet(grupBul(r.durum.kod),r.durum),500)}
      catch(er){toast(er.message);e.target.disabled=false;e.target.textContent="Grubu kur"}}})}

async function grupKatilEkrani(el,kod){
  setTitle("Gruba katıl",kod);
  el.innerHTML=`<div class="spin"></div>`;
  let d;try{d=await grupIstek("durum",{kod})}catch(e){el.innerHTML=`<div class="card empty">${esc(e.message)}<br><br><button class="btn" data-go="grup">Geri dön</button></div>`;return}
  if(cur.v!=="grup")return;
  let sec=(d.yer.indexOf(null)+1)||0;
  el.innerHTML=`<section class="frame gh"><div class="pat"></div><div class="gh-ic">${ic("group",30)}</div><h2>${esc(d.ad)}</h2>
    <p>${d.uye}/30 cüz alınmış · son okuma ${esc(tarihKisa(d.bitis))}</p></section>
   ${d.uye>=30?`<div class="card empty">Bu grup dolu. Yöneticiden yer açmasını isteyin.</div>`:`
   <div class="card"><label class="lb" style="margin-top:0">Adınız (grupta görünecek)</label><input class="in" id="ka" maxlength="30" value="${esc(S.adim||"")}" placeholder="Adınız soyadınız">
    <label class="lb">Boş bir cüz seçin</label>${cuzSecici(d.yer,sec)}
    <button class="btn full" id="ok" style="margin-top:14px">Gruba katıl</button></div>`}
   <p class="muted small" style="text-align:center">Gri cüzler başkaları tarafından alınmış.</p>`;
  const cs=el.querySelector(".csec");cs&&(cs.onclick=e=>{const b=e.target.closest("[data-c]");if(!b||b.disabled)return;sec=+b.dataset.c;cs.querySelectorAll("button").forEach(x=>x.classList.toggle("on",x===b))});
  const ok=el.querySelector("#ok");ok&&(ok.onclick=async()=>{const kisi=el.querySelector("#ka").value.trim();if(!kisi)return toast("Adınızı yazın");if(!sec)return toast("Bir cüz seçin");
    ok.disabled=true;ok.textContent="Katılıyor…";
    try{const r=await grupIstek("katil",{kod,kisi,cuz:sec});S.adim=kisi;S.gruplar.push({kod,ad:r.durum.ad,u:r.uAnahtar,y:"",ben:r.durum.ben});S.aktifGrup=kod;save();grupKaydet(kod,r.durum);
      toast(`Hoş geldiniz. Bu hafta ${r.durum.ben}. cüzü okuyacaksınız.`);render()}
    catch(er){toast(er.message);ok.disabled=false;ok.textContent="Gruba katıl";if(/dolu/.test(er.message))grupKatilEkrani(el,kod)}});
}

function grupCiz(el,g,d,yukleniyor){
  if(!d){el.innerHTML=`<div class="spin"></div><p class="muted small" id="gNot" style="text-align:center"></p>`;return}
  const ben=d.ben,benOk=ben&&d.yer[ben-1]&&d.yer[ben-1].okundu,kg=kalanGun(d.bitis);
  const coklu=S.gruplar.length>1;
  el.innerHTML=`${coklu?`<div class="seg gsec">${S.gruplar.map(x=>`<button data-gk="${x.kod}" class="${x.kod===g.kod?"on":""}">${esc(x.ad||x.kod)}</button>`).join("")}</div>`:""}
   <section class="frame gh"><div class="pat"></div>
    <div class="gh-ust"><span class="rozet">${d.hafta}. hafta</span><span class="rozet">${d.hatim} hatim</span><span class="rozet kod" id="kodK">${esc(d.kod)}</span></div>
    <div class="gh-say"><b>${d.okundu}</b><span>/ ${d.uye} okundu</span></div>
    <div class="serit2">${d.yer.map(x=>`<i class="${x?(x.okundu?"d":"v"):""}"></i>`).join("")}</div>
    <p class="gh-alt">Son okuma: <b>${esc(tarihKisa(d.bitis))}</b>${kg>=0?` · ${kg===0?"bugün":kg+" gün kaldı"}`:""}</p></section>
   ${ben?`<div class="card benim2 ${benOk?"ok":""}"><div><span class="muted small">Bu haftaki cüzünüz</span><b>${ben}. Cüz</b><span class="small muted">${benOk?"Okundu olarak işaretlendi. Allah kabul etsin.":"Henüz okunmadı"}</span></div>
     <div class="row" style="gap:8px"><button class="btn ghost" id="bOku">${ic("quran",16)} Oku</button>${benOk?`<button class="btn line" id="bGeri">Geri al</button>`:`<button class="btn acc" id="bOk">✓ Okudum</button>`}</div></div>`
    :`<div class="card"><b>Bu grupta henüz cüzünüz yok.</b><p class="muted small" style="margin:4px 0 0">Aşağıdan boş bir cüze dokunup alabilirsiniz.</p></div>`}
   <div class="row between" style="margin:16px 2px 8px"><b style="font-family:var(--serif)">30 cüz</b><span class="muted small">${yukleniyor?"Güncelleniyor…":"Dokunarak ayrıntı görün"}</span></div>
   <div class="gizgara">${d.yer.map((x,i)=>{const k=i+1;return `<button class="gz ${x?(x.okundu?"d":""):"bos"} ${k===ben?"ben":""}" data-k="${k}"><b>${k}</b><small>${x?esc(x.ad):"Boş"}</small></button>`}).join("")}</div>
   <p class="muted small" id="gNot" style="text-align:center"></p>
   <div class="row wrap" style="gap:8px;margin-top:6px"><button class="btn" id="dav">${ic("send",16)} Davet et</button>${d.yonetici?`<button class="btn ghost" id="yon">${ic("gear",16)} Yönetici</button>`:""}<button class="btn ghost" id="yeni">${ic("plus",16)} Başka grup</button></div>
   ${d.log&&d.log.length?`<h2 class="sec">Son hareketler</h2><div class="rows">${d.log.map(l=>`<div class="rw" style="cursor:default"><div class="tx"><span style="color:var(--ink)">${esc(l.m)}</span></div><span class="muted small">${new Date(l.t).toLocaleDateString("tr-TR",{day:"numeric",month:"short"})}</span></div>`).join("")}</div>`:""}
   <button class="btn line full" id="ayr" style="margin-top:16px">Bu gruptan ayrıl</button>`;
  const q=s=>el.querySelector(s);
  el.querySelectorAll("[data-gk]").forEach(b=>b.onclick=()=>{S.aktifGrup=b.dataset.gk;save();vGrup(el)});
  q("#kodK").onclick=()=>navigator.clipboard&&navigator.clipboard.writeText(d.kod).then(()=>toast("Grup kodu kopyalandı"));
  const isle=async(ok)=>{try{const r=await grupIstek("isaretle",{...anahtarlar(g),cuz:ben,okundu:ok});grupKaydet(g.kod,r);grupCiz(el,g,r,false);toast(ok?`${ben}. cüz okundu. Allah kabul etsin.`:"İşaret geri alındı")}catch(e){toast(e.message)}};
  q("#bOku")&&(q("#bOku").onclick=()=>okuyucu(ben));
  q("#bOk")&&(q("#bOk").onclick=()=>isle(true));
  q("#bGeri")&&(q("#bGeri").onclick=()=>isle(false));
  q("#dav").onclick=()=>davetSheet(g,d);
  q("#yeni").onclick=()=>sheet(`<h3>Başka bir grup</h3><div class="rows"><div class="rw" id="a1"><div class="ico">${ic("plus")}</div><div class="tx"><b>Yeni grup kur</b></div></div><div class="rw" id="a2"><div class="ico">${ic("group")}</div><div class="tx"><b>Koda göre katıl</b></div></div></div>`,(sh,c)=>{sh.querySelector("#a1").onclick=()=>{c();grupKurSheet()};sh.querySelector("#a2").onclick=()=>{c();kodSor()}});
  q("#yon")&&(q("#yon").onclick=()=>yoneticiSheet(el,g,d));
  q("#ayr").onclick=()=>confirmSheet("Gruptan ayrılınsın mı?",`${d.ad} grubundaki cüzünüz boşa çıkar.${d.yonetici?" Yönetici sizseniz yönetimi de kaybedersiniz.":""}`,"Ayrıl",async()=>{
    try{await grupIstek("ayril",anahtarlar(g))}catch(e){}
    S.gruplar=S.gruplar.filter(x=>x.kod!==g.kod);S.aktifGrup=S.gruplar[0]?S.gruplar[0].kod:null;save();try{localStorage.removeItem("gr."+g.kod)}catch(e){}toast("Gruptan ayrıldınız");go("grup")});
  q(".gizgara").onclick=e=>{const b=e.target.closest("[data-k]");if(!b)return;const k=+b.dataset.k,x=d.yer[k-1],r=aralik(k);
    sheet(`<h3>${k}. Cüz</h3><p class="muted small" style="margin-top:0">${esc(SURELER[r.s-1][0])} ${r.s}:${r.a} – ${esc(SURELER[r.es-1][0])} ${r.es}:${r.ea}</p>
      <p>${x?`Bu hafta okuyan: <b>${esc(x.ad)}</b>${x.okundu?" · ✓ okundu":""}`:"Bu cüz boş."}</p>
      <div class="row wrap" style="gap:8px"><button class="btn" id="o">${ic("quran",16)} Oku</button>${!x&&!ben?`<button class="btn acc" id="al">Bu cüzü al</button>`:""}${d.yonetici&&x?`<button class="btn ghost" id="yi">${x.okundu?"İşareti kaldır":"Okundu işaretle"}</button><button class="btn line" id="yc">Gruptan çıkar</button>`:""}</div>`,(sh,c)=>{
      sh.querySelector("#o").onclick=()=>{c();okuyucu(k)};
      const al=sh.querySelector("#al");al&&(al.onclick=()=>{c();sheet(`<h3>${k}. cüzü al</h3><label class="lb">Adınız</label><input class="in" id="ka" maxlength="30" value="${esc(S.adim||"")}"><button class="btn full" id="ok" style="margin-top:12px">Al</button>`,(s2,c2)=>{
        s2.querySelector("#ok").onclick=async()=>{const kisi=s2.querySelector("#ka").value.trim();if(!kisi)return toast("Adınızı yazın");
          try{const r=await grupIstek("katil",{kod:g.kod,kisi,cuz:k,yAnahtar:g.y||""});S.adim=kisi;g.u=r.uAnahtar;g.ben=r.durum.ben;save();grupKaydet(g.kod,r.durum);c2();grupCiz(el,g,r.durum,false);toast(`${k}. cüz sizin`)}catch(er){toast(er.message)}}})});
      const yi=sh.querySelector("#yi");yi&&(yi.onclick=async()=>{c();try{const r=await grupIstek("isaretle",{...anahtarlar(g),cuz:k,okundu:!x.okundu});grupKaydet(g.kod,r);grupCiz(el,g,r,false)}catch(er){toast(er.message)}});
      const yc=sh.querySelector("#yc");yc&&(yc.onclick=()=>{c();confirmSheet(`${x.ad} çıkarılsın mı?`,`${k}. cüz boşa çıkar.`,"Çıkar",async()=>{try{const r=await grupIstek("yonet",{...anahtarlar(g),islem:"cikar",cuz:k});grupKaydet(g.kod,r);grupCiz(el,g,r,false)}catch(er){toast(er.message)}})});
    })};
}

function davetSheet(g,d){const m=davetMetni(g,d);
  sheet(`<h3>Gruba davet et</h3><p class="muted small">Bu mesajı WhatsApp grubunuza gönderin. Linke dokunan kişi uygulamada boş bir cüz seçip katılır.</p>
   <div class="kodbuyuk">${esc(g.kod)}</div><pre class="davet">${esc(m)}</pre>
   <div class="row" style="gap:8px"><button class="btn full" id="wa" style="background:#1f9d55">${ic("send",16)} WhatsApp ile gönder</button><button class="btn ghost" id="kp">${ic("copy",16)}</button></div>`,(sh,c)=>{
    sh.querySelector("#wa").onclick=()=>{location.href="https://wa.me/?text="+encodeURIComponent(m)};
    sh.querySelector("#kp").onclick=()=>navigator.clipboard.writeText(m).then(()=>toast("Mesaj kopyalandı"),()=>toast("Kopyalanamadı"))})}

function yoneticiSheet(el,g,d){
  sheet(`<h3>Yönetici</h3>
   <div class="rows">
    <div class="rw" id="yh"><div class="ico">${ic("cuz")}</div><div class="tx"><b>Yeni haftayı şimdi başlat</b><span>Herkes bir sonraki cüze geçer, işaretler sıfırlanır</span></div></div>
    <div class="rw" id="ya"><div class="ico">${ic("gear")}</div><div class="tx"><b>Grup adı ve son okuma günü</b><span>${esc(d.ad)} · ${esc(tarihKisa(d.bitis))}</span></div></div>
    <div class="rw" id="ys"><div class="ico">${ic("trash")}</div><div class="tx"><b>Grubu sil</b><span>Tüm üyeler için kalıcı olarak silinir</span></div></div></div>
   <p class="muted small">Bir üyeyi çıkarmak ya da onun yerine işaretlemek için cüz kartına dokunun. Son okuma günü geçince yeni hafta kendiliğinden başlar.</p>`,(sh,c)=>{
    sh.querySelector("#yh").onclick=()=>{c();confirmSheet("Yeni hafta başlasın mı?","Herkes bir sonraki cüze geçer ve son okuma günü 7 gün ileri alınır.","Başlat",async()=>{try{const r=await grupIstek("yonet",{...anahtarlar(g),islem:"yeniHafta"});grupKaydet(g.kod,r);grupCiz(el,g,r,false);toast("Yeni hafta başladı");setTimeout(()=>davetSheet(g,r),400)}catch(e){toast(e.message)}})};
    sh.querySelector("#ya").onclick=()=>{c();sheet(`<h3>Grup ayarları</h3><label class="lb">Grup adı</label><input class="in" id="ga" maxlength="40" value="${esc(d.ad)}"><label class="lb">Bu haftanın son okuma günü</label><input class="in" type="date" id="bt" value="${esc(d.bitis)}"><button class="btn full" id="ok" style="margin-top:12px">Kaydet</button>`,(s2,c2)=>{
      s2.querySelector("#ok").onclick=async()=>{try{const r=await grupIstek("yonet",{...anahtarlar(g),islem:"ayar",ad:s2.querySelector("#ga").value,bitis:s2.querySelector("#bt").value});g.ad=r.ad;save();grupKaydet(g.kod,r);c2();grupCiz(el,g,r,false);toast("Kaydedildi")}catch(e){toast(e.message)}}})};
    sh.querySelector("#ys").onclick=()=>{c();confirmSheet("Grup silinsin mi?","Bu işlem geri alınamaz. Üyeler grubu artık göremez.","Sil",async()=>{try{await grupIstek("yonet",{...anahtarlar(g),islem:"sil"});S.gruplar=S.gruplar.filter(x=>x.kod!==g.kod);S.aktifGrup=null;save();toast("Grup silindi");go("grup")}catch(e){toast(e.message)}})};
  })}

/* Ana ekran için kısa grup kartı */
function grupKarti(){const g=aktifGrup();
  if(!g)return `<div class="card gk0" data-go="grup"><div class="ico2">${ic("group",22)}</div><div><b>Birlikte hatim</b><span class="muted small">30 kişilik grup kurun ya da bir gruba katılın</span></div><span class="chev">${ic("chev",18)}</span></div>`;
  const c=gCache(g.kod),d=c&&c.d;if(!d)return `<div class="card gk0" data-go="grup"><div class="ico2">${ic("group",22)}</div><div><b>${esc(g.ad||"Grubum")}</b><span class="muted small">Açmak için dokunun</span></div><span class="chev">${ic("chev",18)}</span></div>`;
  const ok=d.ben&&d.yer[d.ben-1]&&d.yer[d.ben-1].okundu,kg=kalanGun(d.bitis);
  return `<div class="card gk" data-go="grup"><div class="row between"><b>${esc(d.ad)}</b><span class="src">${d.okundu}/${d.uye} okundu</span></div>
   <div class="serit2 acik">${d.yer.map(x=>`<i class="${x?(x.okundu?"d":"v"):""}"></i>`).join("")}</div>
   <div class="row between"><span class="small">${d.ben?`Cüzünüz: <b>${d.ben}</b> · ${ok?"✓ okundu":"okunmadı"}`:"Henüz cüzünüz yok"}</span><span class="small muted">${kg>=0?(kg===0?"Son gün bugün":kg+" gün kaldı"):""}</span></div></div>`}
function grupArkaPlan(){const g=aktifGrup();if(g&&/^https?:/.test(GRUP_API))grupDurum(g.kod).catch(()=>{})}
