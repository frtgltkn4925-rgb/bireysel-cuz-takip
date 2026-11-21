"use strict";
/* ================= SABİT VERİLER ================= */
const SURELER=[["Fâtiha",7],["Bakara",286],["Âl-i İmrân",200],["Nisâ",176],["Mâide",120],["En'âm",165],["A'râf",206],["Enfâl",75],["Tevbe",129],["Yûnus",109],["Hûd",123],["Yûsuf",111],["Ra'd",43],["İbrâhîm",52],["Hicr",99],["Nahl",128],["İsrâ",111],["Kehf",110],["Meryem",98],["Tâhâ",135],["Enbiyâ",112],["Hac",78],["Mü'minûn",118],["Nûr",64],["Furkân",77],["Şuarâ",227],["Neml",93],["Kasas",88],["Ankebût",69],["Rûm",60],["Lokmân",34],["Secde",30],["Ahzâb",73],["Sebe'",54],["Fâtır",45],["Yâsîn",83],["Sâffât",182],["Sâd",88],["Zümer",75],["Mü'min",85],["Fussilet",54],["Şûrâ",53],["Zuhruf",89],["Duhân",59],["Câsiye",37],["Ahkâf",35],["Muhammed",38],["Fetih",29],["Hucurât",18],["Kâf",45],["Zâriyât",60],["Tûr",49],["Necm",62],["Kamer",55],["Rahmân",78],["Vâkıa",96],["Hadîd",29],["Mücâdele",22],["Haşr",24],["Mümtehine",13],["Saf",14],["Cuma",11],["Münâfikûn",11],["Teğâbün",18],["Talâk",12],["Tahrîm",12],["Mülk",30],["Kalem",52],["Hâkka",52],["Meâric",44],["Nûh",28],["Cin",28],["Müzzemmil",20],["Müddessir",56],["Kıyâme",40],["İnsân",31],["Mürselât",50],["Nebe'",40],["Nâziât",46],["Abese",42],["Tekvîr",29],["İnfitâr",19],["Mutaffifîn",36],["İnşikâk",25],["Bürûc",22],["Târık",17],["A'lâ",19],["Ğâşiye",26],["Fecr",30],["Beled",20],["Şems",15],["Leyl",21],["Duhâ",11],["İnşirâh",8],["Tîn",8],["Alak",19],["Kadir",5],["Beyyine",8],["Zilzâl",8],["Âdiyât",11],["Kâria",11],["Tekâsür",8],["Asr",3],["Hümeze",9],["Fîl",5],["Kureyş",4],["Mâûn",7],["Kevser",3],["Kâfirûn",6],["Nasr",3],["Tebbet",5],["İhlâs",4],["Felak",5],["Nâs",6]];
const CUZ=[[1,1],[2,142],[2,253],[3,93],[4,24],[4,148],[5,82],[6,111],[7,88],[8,41],[9,93],[11,6],[12,53],[15,1],[17,1],[18,75],[21,1],[23,1],[25,21],[27,56],[29,46],[33,31],[36,28],[39,32],[41,47],[46,1],[51,31],[58,1],[67,1],[78,1]];
const BESMELE="بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّح۪يمِ";

/* Çevrimdışı yedek: kısa sureler (ağ olmadan da açılır). Meal: sade Türkçe anlam. */
const GOMULU={
1:[["بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ","Rahmân ve Rahîm olan Allah'ın adıyla."],["اَلْحَمْدُ لِلّٰهِ رَبِّ الْعَالَم۪ينَ","Hamd, âlemlerin Rabbi Allah'a mahsustur."],["اَلرَّحْمٰنِ الرَّح۪يمِ","O, Rahmân'dır, Rahîm'dir."],["مَالِكِ يَوْمِ الدّ۪ينِ","Din gününün sahibidir."],["اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَع۪ينُ","Yalnız sana ibadet eder, yalnız senden yardım dileriz."],["اِهْدِنَا الصِّرَاطَ الْمُسْتَق۪يمَ","Bizi dosdoğru yola ilet."],["صِرَاطَ الَّذ۪ينَ اَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّٓالّ۪ينَ","Nimet verdiklerinin yoluna; gazaba uğrayanların ve sapmışların yoluna değil."]],
103:[["وَالْعَصْرِ","Asra yemin olsun ki,"],["اِنَّ الْاِنْسَانَ لَف۪ي خُسْرٍ","İnsan gerçekten ziyandadır."],["اِلَّا الَّذ۪ينَ اٰمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ","Ancak iman edip salih ameller işleyenler, birbirlerine hakkı ve sabrı tavsiye edenler bunun dışındadır."]],
106:[["لِا۪يلَافِ قُرَيْشٍ","Kureyş'i alıştırdığı için,"],["ا۪يلَافِهِمْ رِحْلَةَ الشِّتَٓاءِ وَالصَّيْفِ","onları kış ve yaz yolculuklarına alıştırdığı için,"],["فَلْيَعْبُدُوا رَبَّ هٰذَا الْبَيْتِ","bu Evin Rabbine ibadet etsinler;"],["اَلَّذ۪ٓي اَطْعَمَهُمْ مِنْ جُوعٍ وَاٰمَنَهُمْ مِنْ خَوْفٍ","O ki onları açlıktan doyurdu, korkudan emin kıldı."]],
108:[["اِنَّٓا اَعْطَيْنَاكَ الْكَوْثَرَ","Şüphesiz biz sana Kevser'i verdik."],["فَصَلِّ لِرَبِّكَ وَانْحَرْ","Öyleyse Rabbin için namaz kıl ve kurban kes."],["اِنَّ شَانِئَكَ هُوَ الْاَبْتَرُ","Asıl soyu kesik olan, sana buğzedendir."]],
109:[["قُلْ يَٓا اَيُّهَا الْكَافِرُونَۙ","De ki: Ey kâfirler!"],["لَٓا اَعْبُدُ مَا تَعْبُدُونَۙ","Ben sizin taptıklarınıza tapmam."],["وَلَٓا اَنْتُمْ عَابِدُونَ مَٓا اَعْبُدُۚ","Siz de benim ibadet ettiğime ibadet etmiyorsunuz."],["وَلَٓا اَنَا۬ عَابِدٌ مَا عَبَدْتُمْۙ","Ben de sizin taptıklarınıza tapacak değilim."],["وَلَٓا اَنْتُمْ عَابِدُونَ مَٓا اَعْبُدُۜ","Siz de benim ibadet ettiğime ibadet edecek değilsiniz."],["لَكُمْ د۪ينُكُمْ وَلِيَ د۪ينِ","Sizin dininiz size, benim dinim bana."]],
110:[["اِذَا جَٓاءَ نَصْرُ اللّٰهِ وَالْفَتْحُۙ","Allah'ın yardımı ve fetih geldiğinde,"],["وَرَاَيْتَ النَّاسَ يَدْخُلُونَ ف۪ي د۪ينِ اللّٰهِ اَفْوَاجًاۙ","ve insanların bölük bölük Allah'ın dinine girdiğini gördüğünde,"],["فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُۜ اِنَّهُ كَانَ تَوَّابًا","Rabbini hamd ile tesbih et ve O'ndan bağışlanma dile. O, tövbeleri çok kabul edendir."]],
111:[["تَبَّتْ يَدَٓا اَب۪ي لَهَبٍ وَتَبَّۜ","Ebû Leheb'in elleri kurusun; kurudu da."],["مَٓا اَغْنٰى عَنْهُ مَالُهُ وَمَا كَسَبَۜ","Ne malı ne de kazandıkları ona fayda verdi."],["سَيَصْلٰى نَارًا ذَاتَ لَهَبٍۚ","O, alevli bir ateşe girecek."],["وَامْرَاَتُهُۜ حَمَّالَةَ الْحَطَبِۚ","Odun taşıyıcı olarak karısı da."],["ف۪ي ج۪يدِهَا حَبْلٌ مِنْ مَسَدٍ","Boynunda hurma lifinden bir ip olduğu hâlde."]],
112:[["قُلْ هُوَ اللّٰهُ اَحَدٌۚ","De ki: O, Allah'tır, birdir."],["اَللّٰهُ الصَّمَدُۚ","Allah Samed'dir (her şey O'na muhtaçtır, O hiçbir şeye muhtaç değildir)."],["لَمْ يَلِدْ وَلَمْ يُولَدْۙ","Doğurmamış ve doğurulmamıştır."],["وَلَمْ يَكُنْ لَهُ كُفُوًا اَحَدٌ","Hiçbir şey O'na denk değildir."]],
113:[["قُلْ اَعُوذُ بِرَبِّ الْفَلَقِۙ","De ki: Sabahın Rabbine sığınırım,"],["مِنْ شَرِّ مَا خَلَقَۙ","yarattığı şeylerin şerrinden,"],["وَمِنْ شَرِّ غَاسِقٍ اِذَا وَقَبَۙ","karanlığı çöktüğünde gecenin şerrinden,"],["وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِۙ","düğümlere üfleyenlerin şerrinden,"],["وَمِنْ شَرِّ حَاسِدٍ اِذَا حَسَدَ","ve haset ettiğinde hasetçinin şerrinden."]],
114:[["قُلْ اَعُوذُ بِرَبِّ النَّاسِۙ","De ki: İnsanların Rabbine sığınırım,"],["مَلِكِ النَّاسِۙ","insanların Melik'ine,"],["اِلٰهِ النَّاسِۙ","insanların İlah'ına;"],["مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِۖ","o sinsi vesvesecinin şerrinden,"],["اَلَّذ۪ي يُوَسْوِسُ ف۪ي صُدُورِ النَّاسِۙ","ki o, insanların göğüslerine vesvese verir,"],["مِنَ الْجِنَّةِ وَالنَّاسِ","cinlerden ve insanlardan."]]
};

const AYETEL_KURSI={a:"اَللّٰهُ لَٓا اِلٰهَ اِلَّا هُوَۚ اَلْحَيُّ الْقَيُّومُۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌۜ لَهُ مَا فِي السَّمٰوَاتِ وَمَا فِي الْاَرْضِۜ مَنْ ذَا الَّذ۪ي يَشْفَعُ عِنْدَهُٓ اِلَّا بِاِذْنِه۪ۜ يَعْلَمُ مَا بَيْنَ اَيْد۪يهِمْ وَمَا خَلْفَهُمْۚ وَلَا يُح۪يطُونَ بِشَيْءٍ مِنْ عِلْمِه۪ٓ اِلَّا بِمَا شَٓاءَۚ وَسِعَ كُرْسِيُّهُ السَّمٰوَاتِ وَالْاَرْضَۚ وَلَا يَؤُ۫دُهُ حِفْظُهُمَاۚ وَهُوَ الْعَلِيُّ الْعَظ۪يمُ",
o:"Allâhu lâ ilâhe illâ huve'l-hayyu'l-kayyûm. Lâ te'huzuhû sinetun ve lâ nevm. Lehû mâ fi's-semâvâti ve mâ fi'l-ard. Men ze'llezî yeşfeu indehû illâ bi-iznih. Ya'lemu mâ beyne eydîhim ve mâ halfehum. Ve lâ yuhîtûne bi-şey'in min ilmihî illâ bimâ şâ'. Vesia kursiyyuhu's-semâvâti ve'l-ard. Ve lâ yeûduhû hifzuhumâ ve huve'l-aliyyu'l-azîm.",
m:"Allah, O'ndan başka ilah yoktur; diridir, her şeyi ayakta tutandır. O'nu ne uyuklama ne de uyku tutar. Göklerde ve yerde ne varsa O'nundur. İzni olmadan O'nun katında kim şefaat edebilir? Kulların önlerindekini ve arkalarındakini bilir. Onlar O'nun ilminden, dilediği kadarı dışında hiçbir şeyi kavrayamazlar. Kürsüsü gökleri ve yeri kuşatmıştır; onları koruyup gözetmek O'na ağır gelmez. O, yücedir, büyüktür. (Bakara 255)"};

const TESBIHAT=[
 {t:"İstiğfar",a:"اَسْتَغْفِرُ اللّٰهَ",o:"Estağfirullah",m:"Allah'tan bağışlanma dilerim.",n:3},
 {t:"Selâm duası",a:"اَللّٰهُمَّ اَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْاِكْرَامِ",o:"Allâhumme ente's-selâmu ve minke's-selâm, tebârekte yâ ze'l-celâli ve'l-ikrâm.",m:"Allah'ım! Sen selâmsın, selâmet Sendendir. Ey celâl ve ikram sahibi, Sen yücesin.",n:1},
 {t:"Salavât",a:"اَللّٰهُمَّ صَلِّ عَلٰى سَيِّدِنَا مُحَمَّدٍ وَعَلٰى اٰلِ سَيِّدِنَا مُحَمَّدٍ",o:"Allâhumme salli alâ seyyidinâ Muhammedin ve alâ âli seyyidinâ Muhammed.",m:"Allah'ım! Efendimiz Muhammed'e ve âline rahmet eyle.",n:1},
 {t:"Tesbih ve tekbir",a:"سُبْحَانَ اللّٰهِ وَالْحَمْدُ لِلّٰهِ وَلَٓا اِلٰهَ اِلَّا اللّٰهُ وَاللّٰهُ اَكْبَرُ وَلَا حَوْلَ وَلَا قُوَّةَ اِلَّا بِاللّٰهِ الْعَلِيِّ الْعَظ۪يمِ",o:"Sübhânallâhi ve'l-hamdu lillâhi ve lâ ilâhe illallâhu vallâhu ekber. Ve lâ havle ve lâ kuvvete illâ billâhi'l-aliyyi'l-azîm.",m:"Allah her türlü noksanlıktan uzaktır, hamd Allah'adır, Allah'tan başka ilah yoktur, Allah en büyüktür. Güç ve kuvvet ancak yüce ve büyük olan Allah'ındır.",n:1},
 {t:"Âyete'l-Kürsî",a:AYETEL_KURSI.a,o:AYETEL_KURSI.o,m:AYETEL_KURSI.m,n:1},
 {t:"Sübhânallah",a:"سُبْحَانَ اللّٰهِ",o:"Sübhânallah",m:"Allah her türlü noksanlıktan uzaktır.",n:33},
 {t:"Elhamdülillah",a:"اَلْحَمْدُ لِلّٰهِ",o:"Elhamdülillâh",m:"Hamd Allah'adır.",n:33},
 {t:"Allâhu ekber",a:"اَللّٰهُ اَكْبَرُ",o:"Allâhu ekber",m:"Allah en büyüktür.",n:33},
 {t:"Tevhid",a:"لَٓا اِلٰهَ اِلَّا اللّٰهُ وَحْدَهُ لَا شَر۪يكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَد۪يرٌ",o:"Lâ ilâhe illallâhu vahdehû lâ şerîke leh, lehu'l-mulku ve lehu'l-hamd, ve huve alâ kulli şey'in kadîr.",m:"Allah'tan başka ilah yoktur; O birdir, ortağı yoktur. Mülk O'nundur, hamd O'nadır. O her şeye kadirdir.",n:1},
 {t:"Dua",a:"",o:"Ellerinizi kaldırıp dilediğiniz gibi dua edin; ardından Fâtiha okuyun.",m:"",n:1}
];
const TESBIHAT_EK=[
 {t:"Sabah ve akşam: Ecirnâ",a:"اَللّٰهُمَّ اَجِرْنَا مِنَ النَّارِ",o:"Allâhumme ecirnâ mine'n-nâr",m:"Allah'ım, bizi ateşten koru.",n:7},
 {t:"Sabah ve akşam: Tevhid (10 defa)",a:"لَٓا اِلٰهَ اِلَّا اللّٰهُ وَحْدَهُ لَا شَر۪يكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْي۪ي وَيُم۪يتُ وَهُوَ حَيٌّ لَا يَمُوتُ بِيَدِهِ الْخَيْرُ وَهُوَ عَلٰى كُلِّ شَيْءٍ قَد۪يرٌ",o:"Lâ ilâhe illallâhu vahdehû lâ şerîke leh, lehu'l-mulku ve lehu'l-hamd, yuhyî ve yumît, ve huve hayyun lâ yemût, biyedihi'l-hayr, ve huve alâ kulli şey'in kadîr.",m:"Allah'tan başka ilah yoktur... Diriltir ve öldürür; O, ölmeyen diridir. Hayır O'nun elindedir; O her şeye kadirdir.",n:10}
];

const HADISLER=[
 {k:"Niyet ve ihlas",a:"اِنَّمَا الْاَعْمَالُ بِالنِّيَّاتِ وَاِنَّمَا لِكُلِّ امْرِئٍ مَا نَوٰى",m:"Ameller ancak niyetlere göredir. Herkese ancak niyet ettiği şey vardır.",s:"Buhârî, Bed'ü'l-vahy 1; Müslim, İmâre 155"},
 {k:"İman",a:"بُنِيَ الْاِسْلَامُ عَلٰى خَمْسٍ",m:"İslam beş esas üzerine kurulmuştur: Allah'tan başka ilah olmadığına ve Muhammed'in Allah'ın elçisi olduğuna şahitlik etmek, namazı kılmak, zekâtı vermek, haccetmek ve Ramazan orucunu tutmak.",s:"Buhârî, Îmân 2; Müslim, Îmân 19-22"},
 {k:"İman",a:"لَا يُؤْمِنُ اَحَدُكُمْ حَتّٰى يُحِبَّ لِاَخ۪يهِ مَا يُحِبُّ لِنَفْسِه۪",m:"Sizden biriniz, kendisi için istediğini kardeşi için de istemedikçe (kâmil) iman etmiş olmaz.",s:"Buhârî, Îmân 7; Müslim, Îmân 71"},
 {k:"İman",a:"اَلْحَيَاءُ مِنَ الْا۪يمَانِ",m:"Hayâ imandandır.",s:"Buhârî, Îmân 16; Müslim, Îmân 57"},
 {k:"Ahlak",a:"اَلْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِه۪ وَيَدِه۪",m:"Müslüman, elinden ve dilinden Müslümanların emin olduğu kimsedir.",s:"Buhârî, Îmân 4; Müslim, Îmân 64"},
 {k:"Ahlak",a:"مَنْ كَانَ يُؤْمِنُ بِاللّٰهِ وَالْيَوْمِ الْاٰخِرِ فَلْيَقُلْ خَيْرًا اَوْ لِيَصْمُتْ",m:"Allah'a ve ahiret gününe iman eden ya hayır söylesin ya da sussun.",s:"Buhârî, Edeb 31; Müslim, Îmân 74"},
 {k:"Ahlak",a:"لَا تَغْضَبْ",m:"Bir adam 'Bana öğüt ver' dedi; Peygamberimiz (s.a.v.) 'Öfkelenme' buyurdu ve bunu birkaç kez tekrarladı.",s:"Buhârî, Edeb 76"},
 {k:"Ahlak",a:"لَيْسَ الشَّد۪يدُ بِالصُّرَعَةِ اِنَّمَا الشَّد۪يدُ الَّذ۪ي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ",m:"Güçlü kimse güreşte rakibini yenen değildir; asıl güçlü, öfke anında kendine hâkim olandır.",s:"Buhârî, Edeb 76; Müslim, Birr 107"},
 {k:"Ahlak",a:"اَلْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ",m:"Güzel söz sadakadır.",s:"Buhârî, Cihâd 128; Müslim, Zekât 56"},
 {k:"Merhamet",a:"مَنْ لَا يَرْحَمُ لَا يُرْحَمُ",m:"Merhamet etmeyene merhamet olunmaz.",s:"Buhârî, Edeb 18; Müslim, Fezâil 65"},
 {k:"Kardeşlik",a:"اَلْمُؤْمِنُ لِلْمُؤْمِنِ كَالْبُنْيَانِ يَشُدُّ بَعْضُهُ بَعْضًا",m:"Mümin mümin için, parçaları birbirini tutan bir bina gibidir.",s:"Buhârî, Salât 88; Müslim, Birr 65"},
 {k:"Kardeşlik",a:"اَفْشُوا السَّلَامَ بَيْنَكُمْ",m:"Aranızda selamı yayın. (İman etmedikçe cennete giremezsiniz, birbirinizi sevmedikçe de iman etmiş olmazsınız; aranızda selamı yaygınlaştırın.)",s:"Müslim, Îmân 93"},
 {k:"Kalp",a:"اِنَّ اللّٰهَ لَا يَنْظُرُ اِلٰى صُوَرِكُمْ وَاَمْوَالِكُمْ وَلٰكِنْ يَنْظُرُ اِلٰى قُلُوبِكُمْ وَاَعْمَالِكُمْ",m:"Allah sizin dış görünüşünüze ve mallarınıza bakmaz; kalplerinize ve amellerinize bakar.",s:"Müslim, Birr 34"},
 {k:"Din",a:"اَلدّ۪ينُ النَّص۪يحَةُ",m:"Din samimiyet ve hayırhahlıktır (nasihattir).",s:"Müslim, Îmân 95"},
 {k:"Eğitim",a:"يَسِّرُوا وَلَا تُعَسِّرُوا وَبَشِّرُوا وَلَا تُنَفِّرُوا",m:"Kolaylaştırın, zorlaştırmayın; müjdeleyin, nefret ettirmeyin.",s:"Buhârî, İlim 11; Müslim, Cihâd 8"},
 {k:"İlim",a:"خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْاٰنَ وَعَلَّمَهُ",m:"Sizin en hayırlınız Kur'an'ı öğrenen ve öğretendir.",s:"Buhârî, Fezâilü'l-Kur'ân 21"},
 {k:"İlim",a:"مَنْ سَلَكَ طَر۪يقًا يَلْتَمِسُ ف۪يهِ عِلْمًا سَهَّلَ اللّٰهُ لَهُ بِه۪ طَر۪يقًا اِلَى الْجَنَّةِ",m:"Kim ilim öğrenmek için bir yola girerse, Allah ona cennete giden yolu kolaylaştırır.",s:"Müslim, Zikir 38"},
 {k:"İlim",a:"مَنْ يُرِدِ اللّٰهُ بِه۪ خَيْرًا يُفَقِّهْهُ فِي الدّ۪ينِ",m:"Allah kimin hayrını dilerse onu dinde derin anlayış sahibi kılar.",s:"Buhârî, İlim 13; Müslim, Zekât 98"},
 {k:"İlim",a:"مَنْ دَلَّ عَلٰى خَيْرٍ فَلَهُ مِثْلُ اَجْرِ فَاعِلِه۪",m:"Bir hayra yol gösteren, onu yapan kadar sevap kazanır.",s:"Müslim, İmâre 133"},
 {k:"İbadet",a:"اَلطُّهُورُ شَطْرُ الْا۪يمَانِ",m:"Temizlik imanın yarısıdır.",s:"Müslim, Tahâret 1"},
 {k:"İbadet",a:"اَحَبُّ الْاَعْمَالِ اِلَى اللّٰهِ اَدْوَمُهَا وَاِنْ قَلَّ",m:"Allah'a en sevimli amel, az da olsa devamlı olanıdır.",s:"Buhârî, Rikâk 18; Müslim, Müsâfirîn 218"},
 {k:"İbadet",a:"مَنْ صَامَ رَمَضَانَ ا۪يمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِه۪",m:"Kim inanarak ve sevabını Allah'tan umarak Ramazan orucunu tutarsa geçmiş günahları bağışlanır.",s:"Buhârî, Îmân 28; Müslim, Müsâfirîn 175"},
 {k:"Zikir",a:"كَلِمَتَانِ خَف۪يفَتَانِ عَلَى اللِّسَانِ ثَق۪يلَتَانِ فِي الْم۪يزَانِ حَب۪يبَتَانِ اِلَى الرَّحْمٰنِ سُبْحَانَ اللّٰهِ وَبِحَمْدِه۪ سُبْحَانَ اللّٰهِ الْعَظ۪يمِ",m:"İki kelime vardır ki dile hafif, mizanda ağır, Rahmân'a sevimlidir: Sübhânallâhi ve bihamdihî, sübhânallâhi'l-azîm.",s:"Buhârî, Da'avât 65; Müslim, Zikir 31"},
 {k:"Sadaka",a:"اَلْيَدُ الْعُلْيَا خَيْرٌ مِنَ الْيَدِ السُّفْلٰى",m:"Veren el, alan elden hayırlıdır.",s:"Buhârî, Zekât 18; Müslim, Zekât 94"},
 {k:"Sadaka",a:"اِذَا مَاتَ الْاِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ اِلَّا مِنْ ثَلَاثَةٍ",m:"İnsan ölünce ameli kesilir; ancak üç şey müstesna: sadaka-i câriye, kendisinden faydalanılan ilim ve kendisine dua eden salih evlat.",s:"Müslim, Vasiyyet 14"}
];
const HADIS_KITAPLARI=[
 ["Sahîh-i Buhârî","İmam Buhârî (ö. 256/870)","Kur'an'dan sonra en sahih kabul edilen hadis kitabı; yaklaşık 7.000 rivayet."],
 ["Sahîh-i Müslim","İmam Müslim (ö. 261/875)","Sahîhayn'ın ikincisi; rivayetleri konu konu toplu verir."],
 ["Sünen-i Ebû Dâvûd","Ebû Dâvûd (ö. 275/889)","Fıkhî hükümlerle ilgili hadislerin temel kaynağı."],
 ["Sünen-i Tirmizî","Tirmizî (ö. 279/892)","Her hadisin derecesini (sahih, hasen…) belirtmesiyle bilinir."],
 ["Sünen-i Nesâî","Nesâî (ö. 303/915)","Râvi tenkidinde titizliğiyle bilinir."],
 ["Sünen-i İbn Mâce","İbn Mâce (ö. 273/887)","Kütüb-i Sitte'nin altıncısı."],
 ["Muvatta","İmam Mâlik (ö. 179/795)","Günümüze ulaşan ilk hadis-fıkıh eserlerinden."],
 ["Riyâzü's-Sâlihîn","İmam Nevevî (ö. 676/1277)","Ahlak ve âdâba dair sahih hadislerden seçki; en çok okunan derlemelerden."]
];
const CEVSEN_BAB1={a:"اَللّٰهُمَّ اِنّ۪ٓي اَسْـَٔلُكَ بِاسْمِكَ يَٓا اَللّٰهُ يَا رَحْمٰنُ يَا رَح۪يمُ يَا كَر۪يمُ يَا مُق۪يمُ يَا عَظ۪يمُ يَا قَد۪يمُ يَا عَل۪يمُ يَا حَل۪يمُ يَا حَك۪يمُ ۞ سُبْحَانَكَ يَا لَٓا اِلٰهَ اِلَّٓا اَنْتَ الْاَمَانُ الْاَمَانُ خَلِّصْنَا مِنَ النَّارِ",
o:"Allâhumme innî es'eluke bi-ismike: Yâ Allâh, yâ Rahmân, yâ Rahîm, yâ Kerîm, yâ Mukîm, yâ Azîm, yâ Kadîm, yâ Alîm, yâ Halîm, yâ Hakîm. Sübhâneke yâ lâ ilâhe illâ ente'l-emân el-emân, hallisnâ mine'n-nâr.",
m:"Allah'ım! Senden isimlerinle istiyorum: Ey Allah, ey Rahmân, ey Rahîm, ey Kerîm, ey Mukîm, ey Azîm, ey Kadîm, ey Alîm, ey Halîm, ey Hakîm. Seni tesbih ederim; Senden başka ilah yoktur. Aman, aman! Bizi ateşten kurtar."};
