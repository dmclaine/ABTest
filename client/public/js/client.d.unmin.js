var ABTest = (function (window, document, undefined) {

    /**
     * A tiny function to unserialize serialized data
     */
    !function(a,b){"use strict";"function"==typeof define&&define.amd?define([],b):"object"==typeof exports?module.exports=b():a.phpUnserialize=b()}(this,function(){"use strict";return function(a){var e,b=0,c=[],d=0,f=function(){var c=a.indexOf(":",b),d=a.substring(b,c);return b=c+2,parseInt(d,10)},g=function(){var c=a.indexOf(";",b),d=a.substring(b,c);return b=c+1,parseInt(d,10)},h=function(){var a=g();return c[d++]=a,a},i=function(){var e=a.indexOf(";",b),f=a.substring(b,e);return b=e+1,f=parseFloat(f),c[d++]=f,f},j=function(){var e=a.indexOf(";",b),f=a.substring(b,e);return b=e+1,f="1"===f,c[d++]=f,f},k=function(){for(var g,h,c=f(),d=0,e=0;e<c;)g=a.charCodeAt(b+d++),g<=127?e++:e+=g>2047?3:2;return h=a.substring(b,b+d),b+=d+2,h},l=function(){var a=k();return c[d++]=a,a},m=function(){var c=a.charAt(b);return b+=2,c},n=function(){var a=m();switch(a){case"i":return g();case"s":return k();default:throw{name:"Parse Error",message:"Unknown key type '"+a+"' at position "+(b-2)}}},o=function(){var k,l,m,o,p,a=f(),g=[],h={},i=g,j=d++;for(c[j]=i,m=0;m<a;m++)if(k=n(),l=e(),i===g&&parseInt(k,10)===m)g.push(l);else{if(i!==h){for(o=0,p=g.length;o<p;o++)h[o]=g[o];i=h,c[j]=i}h[k]=l}return b++,i},p=function(a,b){var c,d,e;return"\0"!==a.charAt(0)?a:(e=a.indexOf("\0",1),e>0?(c=a.substring(1,e),d=a.substr(e+1),"*"===c?d:b===c?d:c+"::"+d):void 0)},q=function(){var a,j,l,m,g={},h=d++,i=k();for(c[h]=g,a=f(),m=0;m<a;m++)j=p(n(),i),l=e(),g[j]=l;return b++,g},r=function(){var a=k(),b=k();return{__PHP_Incomplete_Class_Name:a,serialized:b}},s=function(){var a=g(),b=c[a-1];return c[d++]=b,b},t=function(){var a=g();return c[a-1]},u=function(){var a=null;return c[d++]=a,a};return(e=function(){var a=m();switch(a){case"i":return h();case"d":return i();case"b":return j();case"s":return l();case"a":return o();case"O":return q();case"C":return r();case"r":return s();case"R":return t();case"N":return u();default:throw{name:"Parse Error",message:"Unknown type '"+a+"' at position "+(b-2)}}})()}});

    /**
     * MobileDetect
     * */
    /*!@license Copyright 2013, Heinrich Goebl, License: MIT, see https://github.com/hgoebl/mobile-detect.js*/
    !function(a,b){a(function(){"use strict";function a(a,b){return null!=a&&null!=b&&a.toLowerCase()===b.toLowerCase()}function c(a,b){var c,d,e=a.length;if(!e||!b)return!1;for(c=b.toLowerCase(),d=0;d<e;++d)if(c===a[d].toLowerCase())return!0;return!1}function d(a){for(var b in a)h.call(a,b)&&(a[b]=new RegExp(a[b],"i"))}function e(a,b){this.ua=a||"",this._cache={},this.maxPhoneWidth=b||600}var f={};f.mobileDetectRules={phones:{iPhone:"\\biPhone\\b|\\biPod\\b",BlackBerry:"BlackBerry|\\bBB10\\b|rim[0-9]+",HTC:"HTC|HTC.*(Sensation|Evo|Vision|Explorer|6800|8100|8900|A7272|S510e|C110e|Legend|Desire|T8282)|APX515CKT|Qtek9090|APA9292KT|HD_mini|Sensation.*Z710e|PG86100|Z715e|Desire.*(A8181|HD)|ADR6200|ADR6400L|ADR6425|001HT|Inspire 4G|Android.*\\bEVO\\b|T-Mobile G1|Z520m",Nexus:"Nexus One|Nexus S|Galaxy.*Nexus|Android.*Nexus.*Mobile|Nexus 4|Nexus 5|Nexus 6",Dell:"Dell.*Streak|Dell.*Aero|Dell.*Venue|DELL.*Venue Pro|Dell Flash|Dell Smoke|Dell Mini 3iX|XCD28|XCD35|\\b001DL\\b|\\b101DL\\b|\\bGS01\\b",Motorola:"Motorola|DROIDX|DROID BIONIC|\\bDroid\\b.*Build|Android.*Xoom|HRI39|MOT-|A1260|A1680|A555|A853|A855|A953|A955|A956|Motorola.*ELECTRIFY|Motorola.*i1|i867|i940|MB200|MB300|MB501|MB502|MB508|MB511|MB520|MB525|MB526|MB611|MB612|MB632|MB810|MB855|MB860|MB861|MB865|MB870|ME501|ME502|ME511|ME525|ME600|ME632|ME722|ME811|ME860|ME863|ME865|MT620|MT710|MT716|MT720|MT810|MT870|MT917|Motorola.*TITANIUM|WX435|WX445|XT300|XT301|XT311|XT316|XT317|XT319|XT320|XT390|XT502|XT530|XT531|XT532|XT535|XT603|XT610|XT611|XT615|XT681|XT701|XT702|XT711|XT720|XT800|XT806|XT860|XT862|XT875|XT882|XT883|XT894|XT901|XT907|XT909|XT910|XT912|XT928|XT926|XT915|XT919|XT925|XT1021|\\bMoto E\\b",Samsung:"\\bSamsung\\b|SM-G9250|GT-19300|SGH-I337|BGT-S5230|GT-B2100|GT-B2700|GT-B2710|GT-B3210|GT-B3310|GT-B3410|GT-B3730|GT-B3740|GT-B5510|GT-B5512|GT-B5722|GT-B6520|GT-B7300|GT-B7320|GT-B7330|GT-B7350|GT-B7510|GT-B7722|GT-B7800|GT-C3010|GT-C3011|GT-C3060|GT-C3200|GT-C3212|GT-C3212I|GT-C3262|GT-C3222|GT-C3300|GT-C3300K|GT-C3303|GT-C3303K|GT-C3310|GT-C3322|GT-C3330|GT-C3350|GT-C3500|GT-C3510|GT-C3530|GT-C3630|GT-C3780|GT-C5010|GT-C5212|GT-C6620|GT-C6625|GT-C6712|GT-E1050|GT-E1070|GT-E1075|GT-E1080|GT-E1081|GT-E1085|GT-E1087|GT-E1100|GT-E1107|GT-E1110|GT-E1120|GT-E1125|GT-E1130|GT-E1160|GT-E1170|GT-E1175|GT-E1180|GT-E1182|GT-E1200|GT-E1210|GT-E1225|GT-E1230|GT-E1390|GT-E2100|GT-E2120|GT-E2121|GT-E2152|GT-E2220|GT-E2222|GT-E2230|GT-E2232|GT-E2250|GT-E2370|GT-E2550|GT-E2652|GT-E3210|GT-E3213|GT-I5500|GT-I5503|GT-I5700|GT-I5800|GT-I5801|GT-I6410|GT-I6420|GT-I7110|GT-I7410|GT-I7500|GT-I8000|GT-I8150|GT-I8160|GT-I8190|GT-I8320|GT-I8330|GT-I8350|GT-I8530|GT-I8700|GT-I8703|GT-I8910|GT-I9000|GT-I9001|GT-I9003|GT-I9010|GT-I9020|GT-I9023|GT-I9070|GT-I9082|GT-I9100|GT-I9103|GT-I9220|GT-I9250|GT-I9300|GT-I9305|GT-I9500|GT-I9505|GT-M3510|GT-M5650|GT-M7500|GT-M7600|GT-M7603|GT-M8800|GT-M8910|GT-N7000|GT-S3110|GT-S3310|GT-S3350|GT-S3353|GT-S3370|GT-S3650|GT-S3653|GT-S3770|GT-S3850|GT-S5210|GT-S5220|GT-S5229|GT-S5230|GT-S5233|GT-S5250|GT-S5253|GT-S5260|GT-S5263|GT-S5270|GT-S5300|GT-S5330|GT-S5350|GT-S5360|GT-S5363|GT-S5369|GT-S5380|GT-S5380D|GT-S5560|GT-S5570|GT-S5600|GT-S5603|GT-S5610|GT-S5620|GT-S5660|GT-S5670|GT-S5690|GT-S5750|GT-S5780|GT-S5830|GT-S5839|GT-S6102|GT-S6500|GT-S7070|GT-S7200|GT-S7220|GT-S7230|GT-S7233|GT-S7250|GT-S7500|GT-S7530|GT-S7550|GT-S7562|GT-S7710|GT-S8000|GT-S8003|GT-S8500|GT-S8530|GT-S8600|SCH-A310|SCH-A530|SCH-A570|SCH-A610|SCH-A630|SCH-A650|SCH-A790|SCH-A795|SCH-A850|SCH-A870|SCH-A890|SCH-A930|SCH-A950|SCH-A970|SCH-A990|SCH-I100|SCH-I110|SCH-I400|SCH-I405|SCH-I500|SCH-I510|SCH-I515|SCH-I600|SCH-I730|SCH-I760|SCH-I770|SCH-I830|SCH-I910|SCH-I920|SCH-I959|SCH-LC11|SCH-N150|SCH-N300|SCH-R100|SCH-R300|SCH-R351|SCH-R400|SCH-R410|SCH-T300|SCH-U310|SCH-U320|SCH-U350|SCH-U360|SCH-U365|SCH-U370|SCH-U380|SCH-U410|SCH-U430|SCH-U450|SCH-U460|SCH-U470|SCH-U490|SCH-U540|SCH-U550|SCH-U620|SCH-U640|SCH-U650|SCH-U660|SCH-U700|SCH-U740|SCH-U750|SCH-U810|SCH-U820|SCH-U900|SCH-U940|SCH-U960|SCS-26UC|SGH-A107|SGH-A117|SGH-A127|SGH-A137|SGH-A157|SGH-A167|SGH-A177|SGH-A187|SGH-A197|SGH-A227|SGH-A237|SGH-A257|SGH-A437|SGH-A517|SGH-A597|SGH-A637|SGH-A657|SGH-A667|SGH-A687|SGH-A697|SGH-A707|SGH-A717|SGH-A727|SGH-A737|SGH-A747|SGH-A767|SGH-A777|SGH-A797|SGH-A817|SGH-A827|SGH-A837|SGH-A847|SGH-A867|SGH-A877|SGH-A887|SGH-A897|SGH-A927|SGH-B100|SGH-B130|SGH-B200|SGH-B220|SGH-C100|SGH-C110|SGH-C120|SGH-C130|SGH-C140|SGH-C160|SGH-C170|SGH-C180|SGH-C200|SGH-C207|SGH-C210|SGH-C225|SGH-C230|SGH-C417|SGH-C450|SGH-D307|SGH-D347|SGH-D357|SGH-D407|SGH-D415|SGH-D780|SGH-D807|SGH-D980|SGH-E105|SGH-E200|SGH-E315|SGH-E316|SGH-E317|SGH-E335|SGH-E590|SGH-E635|SGH-E715|SGH-E890|SGH-F300|SGH-F480|SGH-I200|SGH-I300|SGH-I320|SGH-I550|SGH-I577|SGH-I600|SGH-I607|SGH-I617|SGH-I627|SGH-I637|SGH-I677|SGH-I700|SGH-I717|SGH-I727|SGH-i747M|SGH-I777|SGH-I780|SGH-I827|SGH-I847|SGH-I857|SGH-I896|SGH-I897|SGH-I900|SGH-I907|SGH-I917|SGH-I927|SGH-I937|SGH-I997|SGH-J150|SGH-J200|SGH-L170|SGH-L700|SGH-M110|SGH-M150|SGH-M200|SGH-N105|SGH-N500|SGH-N600|SGH-N620|SGH-N625|SGH-N700|SGH-N710|SGH-P107|SGH-P207|SGH-P300|SGH-P310|SGH-P520|SGH-P735|SGH-P777|SGH-Q105|SGH-R210|SGH-R220|SGH-R225|SGH-S105|SGH-S307|SGH-T109|SGH-T119|SGH-T139|SGH-T209|SGH-T219|SGH-T229|SGH-T239|SGH-T249|SGH-T259|SGH-T309|SGH-T319|SGH-T329|SGH-T339|SGH-T349|SGH-T359|SGH-T369|SGH-T379|SGH-T409|SGH-T429|SGH-T439|SGH-T459|SGH-T469|SGH-T479|SGH-T499|SGH-T509|SGH-T519|SGH-T539|SGH-T559|SGH-T589|SGH-T609|SGH-T619|SGH-T629|SGH-T639|SGH-T659|SGH-T669|SGH-T679|SGH-T709|SGH-T719|SGH-T729|SGH-T739|SGH-T746|SGH-T749|SGH-T759|SGH-T769|SGH-T809|SGH-T819|SGH-T839|SGH-T919|SGH-T929|SGH-T939|SGH-T959|SGH-T989|SGH-U100|SGH-U200|SGH-U800|SGH-V205|SGH-V206|SGH-X100|SGH-X105|SGH-X120|SGH-X140|SGH-X426|SGH-X427|SGH-X475|SGH-X495|SGH-X497|SGH-X507|SGH-X600|SGH-X610|SGH-X620|SGH-X630|SGH-X700|SGH-X820|SGH-X890|SGH-Z130|SGH-Z150|SGH-Z170|SGH-ZX10|SGH-ZX20|SHW-M110|SPH-A120|SPH-A400|SPH-A420|SPH-A460|SPH-A500|SPH-A560|SPH-A600|SPH-A620|SPH-A660|SPH-A700|SPH-A740|SPH-A760|SPH-A790|SPH-A800|SPH-A820|SPH-A840|SPH-A880|SPH-A900|SPH-A940|SPH-A960|SPH-D600|SPH-D700|SPH-D710|SPH-D720|SPH-I300|SPH-I325|SPH-I330|SPH-I350|SPH-I500|SPH-I600|SPH-I700|SPH-L700|SPH-M100|SPH-M220|SPH-M240|SPH-M300|SPH-M305|SPH-M320|SPH-M330|SPH-M350|SPH-M360|SPH-M370|SPH-M380|SPH-M510|SPH-M540|SPH-M550|SPH-M560|SPH-M570|SPH-M580|SPH-M610|SPH-M620|SPH-M630|SPH-M800|SPH-M810|SPH-M850|SPH-M900|SPH-M910|SPH-M920|SPH-M930|SPH-N100|SPH-N200|SPH-N240|SPH-N300|SPH-N400|SPH-Z400|SWC-E100|SCH-i909|GT-N7100|GT-N7105|SCH-I535|SM-N900A|SGH-I317|SGH-T999L|GT-S5360B|GT-I8262|GT-S6802|GT-S6312|GT-S6310|GT-S5312|GT-S5310|GT-I9105|GT-I8510|GT-S6790N|SM-G7105|SM-N9005|GT-S5301|GT-I9295|GT-I9195|SM-C101|GT-S7392|GT-S7560|GT-B7610|GT-I5510|GT-S7582|GT-S7530E|GT-I8750|SM-G9006V|SM-G9008V|SM-G9009D|SM-G900A|SM-G900D|SM-G900F|SM-G900H|SM-G900I|SM-G900J|SM-G900K|SM-G900L|SM-G900M|SM-G900P|SM-G900R4|SM-G900S|SM-G900T|SM-G900V|SM-G900W8|SHV-E160K|SCH-P709|SCH-P729|SM-T2558|GT-I9205|SM-G9350|SM-J120F",LG:"\\bLG\\b;|LG[- ]?(C800|C900|E400|E610|E900|E-900|F160|F180K|F180L|F180S|730|855|L160|LS740|LS840|LS970|LU6200|MS690|MS695|MS770|MS840|MS870|MS910|P500|P700|P705|VM696|AS680|AS695|AX840|C729|E970|GS505|272|C395|E739BK|E960|L55C|L75C|LS696|LS860|P769BK|P350|P500|P509|P870|UN272|US730|VS840|VS950|LN272|LN510|LS670|LS855|LW690|MN270|MN510|P509|P769|P930|UN200|UN270|UN510|UN610|US670|US740|US760|UX265|UX840|VN271|VN530|VS660|VS700|VS740|VS750|VS910|VS920|VS930|VX9200|VX11000|AX840A|LW770|P506|P925|P999|E612|D955|D802|MS323)",Sony:"SonyST|SonyLT|SonyEricsson|SonyEricssonLT15iv|LT18i|E10i|LT28h|LT26w|SonyEricssonMT27i|C5303|C6902|C6903|C6906|C6943|D2533",Asus:"Asus.*Galaxy|PadFone.*Mobile",NokiaLumia:"Lumia [0-9]{3,4}",Micromax:"Micromax.*\\b(A210|A92|A88|A72|A111|A110Q|A115|A116|A110|A90S|A26|A51|A35|A54|A25|A27|A89|A68|A65|A57|A90)\\b",Palm:"PalmSource|Palm",Vertu:"Vertu|Vertu.*Ltd|Vertu.*Ascent|Vertu.*Ayxta|Vertu.*Constellation(F|Quest)?|Vertu.*Monika|Vertu.*Signature",Pantech:"PANTECH|IM-A850S|IM-A840S|IM-A830L|IM-A830K|IM-A830S|IM-A820L|IM-A810K|IM-A810S|IM-A800S|IM-T100K|IM-A725L|IM-A780L|IM-A775C|IM-A770K|IM-A760S|IM-A750K|IM-A740S|IM-A730S|IM-A720L|IM-A710K|IM-A690L|IM-A690S|IM-A650S|IM-A630K|IM-A600S|VEGA PTL21|PT003|P8010|ADR910L|P6030|P6020|P9070|P4100|P9060|P5000|CDM8992|TXT8045|ADR8995|IS11PT|P2030|P6010|P8000|PT002|IS06|CDM8999|P9050|PT001|TXT8040|P2020|P9020|P2000|P7040|P7000|C790",Fly:"IQ230|IQ444|IQ450|IQ440|IQ442|IQ441|IQ245|IQ256|IQ236|IQ255|IQ235|IQ245|IQ275|IQ240|IQ285|IQ280|IQ270|IQ260|IQ250",Wiko:"KITE 4G|HIGHWAY|GETAWAY|STAIRWAY|DARKSIDE|DARKFULL|DARKNIGHT|DARKMOON|SLIDE|WAX 4G|RAINBOW|BLOOM|SUNSET|GOA(?!nna)|LENNY|BARRY|IGGY|OZZY|CINK FIVE|CINK PEAX|CINK PEAX 2|CINK SLIM|CINK SLIM 2|CINK +|CINK KING|CINK PEAX|CINK SLIM|SUBLIM",iMobile:"i-mobile (IQ|i-STYLE|idea|ZAA|Hitz)",SimValley:"\\b(SP-80|XT-930|SX-340|XT-930|SX-310|SP-360|SP60|SPT-800|SP-120|SPT-800|SP-140|SPX-5|SPX-8|SP-100|SPX-8|SPX-12)\\b",Wolfgang:"AT-B24D|AT-AS50HD|AT-AS40W|AT-AS55HD|AT-AS45q2|AT-B26D|AT-AS50Q",Alcatel:"Alcatel",Nintendo:"Nintendo 3DS",Amoi:"Amoi",INQ:"INQ",GenericPhone:"Tapatalk|PDA;|SAGEM|\\bmmp\\b|pocket|\\bpsp\\b|symbian|Smartphone|smartfon|treo|up.browser|up.link|vodafone|\\bwap\\b|nokia|Series40|Series60|S60|SonyEricsson|N900|MAUI.*WAP.*Browser"},tablets:{iPad:"iPad|iPad.*Mobile",NexusTablet:"Android.*Nexus[\\s]+(7|9|10)",SamsungTablet:"SAMSUNG.*Tablet|Galaxy.*Tab|SC-01C|GT-P1000|GT-P1003|GT-P1010|GT-P3105|GT-P6210|GT-P6800|GT-P6810|GT-P7100|GT-P7300|GT-P7310|GT-P7500|GT-P7510|SCH-I800|SCH-I815|SCH-I905|SGH-I957|SGH-I987|SGH-T849|SGH-T859|SGH-T869|SPH-P100|GT-P3100|GT-P3108|GT-P3110|GT-P5100|GT-P5110|GT-P6200|GT-P7320|GT-P7511|GT-N8000|GT-P8510|SGH-I497|SPH-P500|SGH-T779|SCH-I705|SCH-I915|GT-N8013|GT-P3113|GT-P5113|GT-P8110|GT-N8010|GT-N8005|GT-N8020|GT-P1013|GT-P6201|GT-P7501|GT-N5100|GT-N5105|GT-N5110|SHV-E140K|SHV-E140L|SHV-E140S|SHV-E150S|SHV-E230K|SHV-E230L|SHV-E230S|SHW-M180K|SHW-M180L|SHW-M180S|SHW-M180W|SHW-M300W|SHW-M305W|SHW-M380K|SHW-M380S|SHW-M380W|SHW-M430W|SHW-M480K|SHW-M480S|SHW-M480W|SHW-M485W|SHW-M486W|SHW-M500W|GT-I9228|SCH-P739|SCH-I925|GT-I9200|GT-P5200|GT-P5210|GT-P5210X|SM-T311|SM-T310|SM-T310X|SM-T210|SM-T210R|SM-T211|SM-P600|SM-P601|SM-P605|SM-P900|SM-P901|SM-T217|SM-T217A|SM-T217S|SM-P6000|SM-T3100|SGH-I467|XE500|SM-T110|GT-P5220|GT-I9200X|GT-N5110X|GT-N5120|SM-P905|SM-T111|SM-T2105|SM-T315|SM-T320|SM-T320X|SM-T321|SM-T520|SM-T525|SM-T530NU|SM-T230NU|SM-T330NU|SM-T900|XE500T1C|SM-P605V|SM-P905V|SM-T337V|SM-T537V|SM-T707V|SM-T807V|SM-P600X|SM-P900X|SM-T210X|SM-T230|SM-T230X|SM-T325|GT-P7503|SM-T531|SM-T330|SM-T530|SM-T705|SM-T705C|SM-T535|SM-T331|SM-T800|SM-T700|SM-T537|SM-T807|SM-P907A|SM-T337A|SM-T537A|SM-T707A|SM-T807A|SM-T237|SM-T807P|SM-P607T|SM-T217T|SM-T337T|SM-T807T|SM-T116NQ|SM-P550|SM-T350|SM-T550|SM-T9000|SM-P9000|SM-T705Y|SM-T805|GT-P3113|SM-T710|SM-T810|SM-T815|SM-T360|SM-T533|SM-T113|SM-T335|SM-T715|SM-T560|SM-T670|SM-T677|SM-T377|SM-T567|SM-T357T|SM-T555|SM-T561|SM-T713|SM-T719|SM-T813|SM-T819|SM-T580|SM-T355Y|SM-T280",Kindle:"Kindle|Silk.*Accelerated|Android.*\\b(KFOT|KFTT|KFJWI|KFJWA|KFOTE|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|WFJWAE|KFSAWA|KFSAWI|KFASWI|KFARWI)\\b",SurfaceTablet:"Windows NT [0-9.]+; ARM;.*(Tablet|ARMBJS)",HPTablet:"HP Slate (7|8|10)|HP ElitePad 900|hp-tablet|EliteBook.*Touch|HP 8|Slate 21|HP SlateBook 10",AsusTablet:"^.*PadFone((?!Mobile).)*$|Transformer|TF101|TF101G|TF300T|TF300TG|TF300TL|TF700T|TF700KL|TF701T|TF810C|ME171|ME301T|ME302C|ME371MG|ME370T|ME372MG|ME172V|ME173X|ME400C|Slider SL101|\\bK00F\\b|\\bK00C\\b|\\bK00E\\b|\\bK00L\\b|TX201LA|ME176C|ME102A|\\bM80TA\\b|ME372CL|ME560CG|ME372CG|ME302KL| K010 | K011 | K017 | K01E |ME572C|ME103K|ME170C|ME171C|\\bME70C\\b|ME581C|ME581CL|ME8510C|ME181C|P01Y|PO1MA|P01Z",BlackBerryTablet:"PlayBook|RIM Tablet",HTCtablet:"HTC_Flyer_P512|HTC Flyer|HTC Jetstream|HTC-P715a|HTC EVO View 4G|PG41200|PG09410",MotorolaTablet:"xoom|sholest|MZ615|MZ605|MZ505|MZ601|MZ602|MZ603|MZ604|MZ606|MZ607|MZ608|MZ609|MZ615|MZ616|MZ617",NookTablet:"Android.*Nook|NookColor|nook browser|BNRV200|BNRV200A|BNTV250|BNTV250A|BNTV400|BNTV600|LogicPD Zoom2",AcerTablet:"Android.*; \\b(A100|A101|A110|A200|A210|A211|A500|A501|A510|A511|A700|A701|W500|W500P|W501|W501P|W510|W511|W700|G100|G100W|B1-A71|B1-710|B1-711|A1-810|A1-811|A1-830)\\b|W3-810|\\bA3-A10\\b|\\bA3-A11\\b|\\bA3-A20\\b|\\bA3-A30",ToshibaTablet:"Android.*(AT100|AT105|AT200|AT205|AT270|AT275|AT300|AT305|AT1S5|AT500|AT570|AT700|AT830)|TOSHIBA.*FOLIO",LGTablet:"\\bL-06C|LG-V909|LG-V900|LG-V700|LG-V510|LG-V500|LG-V410|LG-V400|LG-VK810\\b",FujitsuTablet:"Android.*\\b(F-01D|F-02F|F-05E|F-10D|M532|Q572)\\b",PrestigioTablet:"PMP3170B|PMP3270B|PMP3470B|PMP7170B|PMP3370B|PMP3570C|PMP5870C|PMP3670B|PMP5570C|PMP5770D|PMP3970B|PMP3870C|PMP5580C|PMP5880D|PMP5780D|PMP5588C|PMP7280C|PMP7280C3G|PMP7280|PMP7880D|PMP5597D|PMP5597|PMP7100D|PER3464|PER3274|PER3574|PER3884|PER5274|PER5474|PMP5097CPRO|PMP5097|PMP7380D|PMP5297C|PMP5297C_QUAD|PMP812E|PMP812E3G|PMP812F|PMP810E|PMP880TD|PMT3017|PMT3037|PMT3047|PMT3057|PMT7008|PMT5887|PMT5001|PMT5002",LenovoTablet:"Lenovo TAB|Idea(Tab|Pad)( A1|A10| K1|)|ThinkPad([ ]+)?Tablet|YT3-X90L|YT3-X90F|YT3-X90X|Lenovo.*(S2109|S2110|S5000|S6000|K3011|A3000|A3500|A1000|A2107|A2109|A1107|A5500|A7600|B6000|B8000|B8080)(-|)(FL|F|HV|H|)",DellTablet:"Venue 11|Venue 8|Venue 7|Dell Streak 10|Dell Streak 7",YarvikTablet:"Android.*\\b(TAB210|TAB211|TAB224|TAB250|TAB260|TAB264|TAB310|TAB360|TAB364|TAB410|TAB411|TAB420|TAB424|TAB450|TAB460|TAB461|TAB464|TAB465|TAB467|TAB468|TAB07-100|TAB07-101|TAB07-150|TAB07-151|TAB07-152|TAB07-200|TAB07-201-3G|TAB07-210|TAB07-211|TAB07-212|TAB07-214|TAB07-220|TAB07-400|TAB07-485|TAB08-150|TAB08-200|TAB08-201-3G|TAB08-201-30|TAB09-100|TAB09-211|TAB09-410|TAB10-150|TAB10-201|TAB10-211|TAB10-400|TAB10-410|TAB13-201|TAB274EUK|TAB275EUK|TAB374EUK|TAB462EUK|TAB474EUK|TAB9-200)\\b",MedionTablet:"Android.*\\bOYO\\b|LIFE.*(P9212|P9514|P9516|S9512)|LIFETAB",ArnovaTablet:"97G4|AN10G2|AN7bG3|AN7fG3|AN8G3|AN8cG3|AN7G3|AN9G3|AN7dG3|AN7dG3ST|AN7dG3ChildPad|AN10bG3|AN10bG3DT|AN9G2",IntensoTablet:"INM8002KP|INM1010FP|INM805ND|Intenso Tab|TAB1004",IRUTablet:"M702pro",MegafonTablet:"MegaFon V9|\\bZTE V9\\b|Android.*\\bMT7A\\b",EbodaTablet:"E-Boda (Supreme|Impresspeed|Izzycomm|Essential)",AllViewTablet:"Allview.*(Viva|Alldro|City|Speed|All TV|Frenzy|Quasar|Shine|TX1|AX1|AX2)",ArchosTablet:"\\b(101G9|80G9|A101IT)\\b|Qilive 97R|Archos5|\\bARCHOS (70|79|80|90|97|101|FAMILYPAD|)(b|)(G10| Cobalt| TITANIUM(HD|)| Xenon| Neon|XSK| 2| XS 2| PLATINUM| CARBON|GAMEPAD)\\b",AinolTablet:"NOVO7|NOVO8|NOVO10|Novo7Aurora|Novo7Basic|NOVO7PALADIN|novo9-Spark",NokiaLumiaTablet:"Lumia 2520",SonyTablet:"Sony.*Tablet|Xperia Tablet|Sony Tablet S|SO-03E|SGPT12|SGPT13|SGPT114|SGPT121|SGPT122|SGPT123|SGPT111|SGPT112|SGPT113|SGPT131|SGPT132|SGPT133|SGPT211|SGPT212|SGPT213|SGP311|SGP312|SGP321|EBRD1101|EBRD1102|EBRD1201|SGP351|SGP341|SGP511|SGP512|SGP521|SGP541|SGP551|SGP621|SGP612|SOT31",PhilipsTablet:"\\b(PI2010|PI3000|PI3100|PI3105|PI3110|PI3205|PI3210|PI3900|PI4010|PI7000|PI7100)\\b",CubeTablet:"Android.*(K8GT|U9GT|U10GT|U16GT|U17GT|U18GT|U19GT|U20GT|U23GT|U30GT)|CUBE U8GT",CobyTablet:"MID1042|MID1045|MID1125|MID1126|MID7012|MID7014|MID7015|MID7034|MID7035|MID7036|MID7042|MID7048|MID7127|MID8042|MID8048|MID8127|MID9042|MID9740|MID9742|MID7022|MID7010",MIDTablet:"M9701|M9000|M9100|M806|M1052|M806|T703|MID701|MID713|MID710|MID727|MID760|MID830|MID728|MID933|MID125|MID810|MID732|MID120|MID930|MID800|MID731|MID900|MID100|MID820|MID735|MID980|MID130|MID833|MID737|MID960|MID135|MID860|MID736|MID140|MID930|MID835|MID733|MID4X10",MSITablet:"MSI \\b(Primo 73K|Primo 73L|Primo 81L|Primo 77|Primo 93|Primo 75|Primo 76|Primo 73|Primo 81|Primo 91|Primo 90|Enjoy 71|Enjoy 7|Enjoy 10)\\b",SMiTTablet:"Android.*(\\bMID\\b|MID-560|MTV-T1200|MTV-PND531|MTV-P1101|MTV-PND530)",RockChipTablet:"Android.*(RK2818|RK2808A|RK2918|RK3066)|RK2738|RK2808A",FlyTablet:"IQ310|Fly Vision",bqTablet:"Android.*(bq)?.*(Elcano|Curie|Edison|Maxwell|Kepler|Pascal|Tesla|Hypatia|Platon|Newton|Livingstone|Cervantes|Avant|Aquaris [E|M]10)|Maxwell.*Lite|Maxwell.*Plus",HuaweiTablet:"MediaPad|MediaPad 7 Youth|IDEOS S7|S7-201c|S7-202u|S7-101|S7-103|S7-104|S7-105|S7-106|S7-201|S7-Slim",NecTablet:"\\bN-06D|\\bN-08D",PantechTablet:"Pantech.*P4100",BronchoTablet:"Broncho.*(N701|N708|N802|a710)",VersusTablet:"TOUCHPAD.*[78910]|\\bTOUCHTAB\\b",ZyncTablet:"z1000|Z99 2G|z99|z930|z999|z990|z909|Z919|z900",PositivoTablet:"TB07STA|TB10STA|TB07FTA|TB10FTA",NabiTablet:"Android.*\\bNabi",KoboTablet:"Kobo Touch|\\bK080\\b|\\bVox\\b Build|\\bArc\\b Build",DanewTablet:"DSlide.*\\b(700|701R|702|703R|704|802|970|971|972|973|974|1010|1012)\\b",TexetTablet:"NaviPad|TB-772A|TM-7045|TM-7055|TM-9750|TM-7016|TM-7024|TM-7026|TM-7041|TM-7043|TM-7047|TM-8041|TM-9741|TM-9747|TM-9748|TM-9751|TM-7022|TM-7021|TM-7020|TM-7011|TM-7010|TM-7023|TM-7025|TM-7037W|TM-7038W|TM-7027W|TM-9720|TM-9725|TM-9737W|TM-1020|TM-9738W|TM-9740|TM-9743W|TB-807A|TB-771A|TB-727A|TB-725A|TB-719A|TB-823A|TB-805A|TB-723A|TB-715A|TB-707A|TB-705A|TB-709A|TB-711A|TB-890HD|TB-880HD|TB-790HD|TB-780HD|TB-770HD|TB-721HD|TB-710HD|TB-434HD|TB-860HD|TB-840HD|TB-760HD|TB-750HD|TB-740HD|TB-730HD|TB-722HD|TB-720HD|TB-700HD|TB-500HD|TB-470HD|TB-431HD|TB-430HD|TB-506|TB-504|TB-446|TB-436|TB-416|TB-146SE|TB-126SE",PlaystationTablet:"Playstation.*(Portable|Vita)",TrekstorTablet:"ST10416-1|VT10416-1|ST70408-1|ST702xx-1|ST702xx-2|ST80208|ST97216|ST70104-2|VT10416-2|ST10216-2A|SurfTab",PyleAudioTablet:"\\b(PTBL10CEU|PTBL10C|PTBL72BC|PTBL72BCEU|PTBL7CEU|PTBL7C|PTBL92BC|PTBL92BCEU|PTBL9CEU|PTBL9CUK|PTBL9C)\\b",AdvanTablet:"Android.* \\b(E3A|T3X|T5C|T5B|T3E|T3C|T3B|T1J|T1F|T2A|T1H|T1i|E1C|T1-E|T5-A|T4|E1-B|T2Ci|T1-B|T1-D|O1-A|E1-A|T1-A|T3A|T4i)\\b ",DanyTechTablet:"Genius Tab G3|Genius Tab S2|Genius Tab Q3|Genius Tab G4|Genius Tab Q4|Genius Tab G-II|Genius TAB GII|Genius TAB GIII|Genius Tab S1",GalapadTablet:"Android.*\\bG1\\b",MicromaxTablet:"Funbook|Micromax.*\\b(P250|P560|P360|P362|P600|P300|P350|P500|P275)\\b",KarbonnTablet:"Android.*\\b(A39|A37|A34|ST8|ST10|ST7|Smart Tab3|Smart Tab2)\\b",AllFineTablet:"Fine7 Genius|Fine7 Shine|Fine7 Air|Fine8 Style|Fine9 More|Fine10 Joy|Fine11 Wide",PROSCANTablet:"\\b(PEM63|PLT1023G|PLT1041|PLT1044|PLT1044G|PLT1091|PLT4311|PLT4311PL|PLT4315|PLT7030|PLT7033|PLT7033D|PLT7035|PLT7035D|PLT7044K|PLT7045K|PLT7045KB|PLT7071KG|PLT7072|PLT7223G|PLT7225G|PLT7777G|PLT7810K|PLT7849G|PLT7851G|PLT7852G|PLT8015|PLT8031|PLT8034|PLT8036|PLT8080K|PLT8082|PLT8088|PLT8223G|PLT8234G|PLT8235G|PLT8816K|PLT9011|PLT9045K|PLT9233G|PLT9735|PLT9760G|PLT9770G)\\b",YONESTablet:"BQ1078|BC1003|BC1077|RK9702|BC9730|BC9001|IT9001|BC7008|BC7010|BC708|BC728|BC7012|BC7030|BC7027|BC7026",ChangJiaTablet:"TPC7102|TPC7103|TPC7105|TPC7106|TPC7107|TPC7201|TPC7203|TPC7205|TPC7210|TPC7708|TPC7709|TPC7712|TPC7110|TPC8101|TPC8103|TPC8105|TPC8106|TPC8203|TPC8205|TPC8503|TPC9106|TPC9701|TPC97101|TPC97103|TPC97105|TPC97106|TPC97111|TPC97113|TPC97203|TPC97603|TPC97809|TPC97205|TPC10101|TPC10103|TPC10106|TPC10111|TPC10203|TPC10205|TPC10503",GUTablet:"TX-A1301|TX-M9002|Q702|kf026",PointOfViewTablet:"TAB-P506|TAB-navi-7-3G-M|TAB-P517|TAB-P-527|TAB-P701|TAB-P703|TAB-P721|TAB-P731N|TAB-P741|TAB-P825|TAB-P905|TAB-P925|TAB-PR945|TAB-PL1015|TAB-P1025|TAB-PI1045|TAB-P1325|TAB-PROTAB[0-9]+|TAB-PROTAB25|TAB-PROTAB26|TAB-PROTAB27|TAB-PROTAB26XL|TAB-PROTAB2-IPS9|TAB-PROTAB30-IPS9|TAB-PROTAB25XXL|TAB-PROTAB26-IPS10|TAB-PROTAB30-IPS10",OvermaxTablet:"OV-(SteelCore|NewBase|Basecore|Baseone|Exellen|Quattor|EduTab|Solution|ACTION|BasicTab|TeddyTab|MagicTab|Stream|TB-08|TB-09)",HCLTablet:"HCL.*Tablet|Connect-3G-2.0|Connect-2G-2.0|ME Tablet U1|ME Tablet U2|ME Tablet G1|ME Tablet X1|ME Tablet Y2|ME Tablet Sync",DPSTablet:"DPS Dream 9|DPS Dual 7",VistureTablet:"V97 HD|i75 3G|Visture V4( HD)?|Visture V5( HD)?|Visture V10",CrestaTablet:"CTP(-)?810|CTP(-)?818|CTP(-)?828|CTP(-)?838|CTP(-)?888|CTP(-)?978|CTP(-)?980|CTP(-)?987|CTP(-)?988|CTP(-)?989",MediatekTablet:"\\bMT8125|MT8389|MT8135|MT8377\\b",ConcordeTablet:"Concorde([ ]+)?Tab|ConCorde ReadMan",GoCleverTablet:"GOCLEVER TAB|A7GOCLEVER|M1042|M7841|M742|R1042BK|R1041|TAB A975|TAB A7842|TAB A741|TAB A741L|TAB M723G|TAB M721|TAB A1021|TAB I921|TAB R721|TAB I720|TAB T76|TAB R70|TAB R76.2|TAB R106|TAB R83.2|TAB M813G|TAB I721|GCTA722|TAB I70|TAB I71|TAB S73|TAB R73|TAB R74|TAB R93|TAB R75|TAB R76.1|TAB A73|TAB A93|TAB A93.2|TAB T72|TAB R83|TAB R974|TAB R973|TAB A101|TAB A103|TAB A104|TAB A104.2|R105BK|M713G|A972BK|TAB A971|TAB R974.2|TAB R104|TAB R83.3|TAB A1042",ModecomTablet:"FreeTAB 9000|FreeTAB 7.4|FreeTAB 7004|FreeTAB 7800|FreeTAB 2096|FreeTAB 7.5|FreeTAB 1014|FreeTAB 1001 |FreeTAB 8001|FreeTAB 9706|FreeTAB 9702|FreeTAB 7003|FreeTAB 7002|FreeTAB 1002|FreeTAB 7801|FreeTAB 1331|FreeTAB 1004|FreeTAB 8002|FreeTAB 8014|FreeTAB 9704|FreeTAB 1003",VoninoTablet:"\\b(Argus[ _]?S|Diamond[ _]?79HD|Emerald[ _]?78E|Luna[ _]?70C|Onyx[ _]?S|Onyx[ _]?Z|Orin[ _]?HD|Orin[ _]?S|Otis[ _]?S|SpeedStar[ _]?S|Magnet[ _]?M9|Primus[ _]?94[ _]?3G|Primus[ _]?94HD|Primus[ _]?QS|Android.*\\bQ8\\b|Sirius[ _]?EVO[ _]?QS|Sirius[ _]?QS|Spirit[ _]?S)\\b",ECSTablet:"V07OT2|TM105A|S10OT1|TR10CS1",StorexTablet:"eZee[_']?(Tab|Go)[0-9]+|TabLC7|Looney Tunes Tab",VodafoneTablet:"SmartTab([ ]+)?[0-9]+|SmartTabII10|SmartTabII7|VF-1497",EssentielBTablet:"Smart[ ']?TAB[ ]+?[0-9]+|Family[ ']?TAB2",RossMoorTablet:"RM-790|RM-997|RMD-878G|RMD-974R|RMT-705A|RMT-701|RME-601|RMT-501|RMT-711",iMobileTablet:"i-mobile i-note",TolinoTablet:"tolino tab [0-9.]+|tolino shine",AudioSonicTablet:"\\bC-22Q|T7-QC|T-17B|T-17P\\b",AMPETablet:"Android.* A78 ",SkkTablet:"Android.* (SKYPAD|PHOENIX|CYCLOPS)",TecnoTablet:"TECNO P9",JXDTablet:"Android.* \\b(F3000|A3300|JXD5000|JXD3000|JXD2000|JXD300B|JXD300|S5800|S7800|S602b|S5110b|S7300|S5300|S602|S603|S5100|S5110|S601|S7100a|P3000F|P3000s|P101|P200s|P1000m|P200m|P9100|P1000s|S6600b|S908|P1000|P300|S18|S6600|S9100)\\b",iJoyTablet:"Tablet (Spirit 7|Essentia|Galatea|Fusion|Onix 7|Landa|Titan|Scooby|Deox|Stella|Themis|Argon|Unique 7|Sygnus|Hexen|Finity 7|Cream|Cream X2|Jade|Neon 7|Neron 7|Kandy|Scape|Saphyr 7|Rebel|Biox|Rebel|Rebel 8GB|Myst|Draco 7|Myst|Tab7-004|Myst|Tadeo Jones|Tablet Boing|Arrow|Draco Dual Cam|Aurix|Mint|Amity|Revolution|Finity 9|Neon 9|T9w|Amity 4GB Dual Cam|Stone 4GB|Stone 8GB|Andromeda|Silken|X2|Andromeda II|Halley|Flame|Saphyr 9,7|Touch 8|Planet|Triton|Unique 10|Hexen 10|Memphis 4GB|Memphis 8GB|Onix 10)",FX2Tablet:"FX2 PAD7|FX2 PAD10",XoroTablet:"KidsPAD 701|PAD[ ]?712|PAD[ ]?714|PAD[ ]?716|PAD[ ]?717|PAD[ ]?718|PAD[ ]?720|PAD[ ]?721|PAD[ ]?722|PAD[ ]?790|PAD[ ]?792|PAD[ ]?900|PAD[ ]?9715D|PAD[ ]?9716DR|PAD[ ]?9718DR|PAD[ ]?9719QR|PAD[ ]?9720QR|TelePAD1030|Telepad1032|TelePAD730|TelePAD731|TelePAD732|TelePAD735Q|TelePAD830|TelePAD9730|TelePAD795|MegaPAD 1331|MegaPAD 1851|MegaPAD 2151",ViewsonicTablet:"ViewPad 10pi|ViewPad 10e|ViewPad 10s|ViewPad E72|ViewPad7|ViewPad E100|ViewPad 7e|ViewSonic VB733|VB100a",OdysTablet:"LOOX|XENO10|ODYS[ -](Space|EVO|Xpress|NOON)|\\bXELIO\\b|Xelio10Pro|XELIO7PHONETAB|XELIO10EXTREME|XELIOPT2|NEO_QUAD10",CaptivaTablet:"CAPTIVA PAD",IconbitTablet:"NetTAB|NT-3702|NT-3702S|NT-3702S|NT-3603P|NT-3603P|NT-0704S|NT-0704S|NT-3805C|NT-3805C|NT-0806C|NT-0806C|NT-0909T|NT-0909T|NT-0907S|NT-0907S|NT-0902S|NT-0902S",TeclastTablet:"T98 4G|\\bP80\\b|\\bX90HD\\b|X98 Air|X98 Air 3G|\\bX89\\b|P80 3G|\\bX80h\\b|P98 Air|\\bX89HD\\b|P98 3G|\\bP90HD\\b|P89 3G|X98 3G|\\bP70h\\b|P79HD 3G|G18d 3G|\\bP79HD\\b|\\bP89s\\b|\\bA88\\b|\\bP10HD\\b|\\bP19HD\\b|G18 3G|\\bP78HD\\b|\\bA78\\b|\\bP75\\b|G17s 3G|G17h 3G|\\bP85t\\b|\\bP90\\b|\\bP11\\b|\\bP98t\\b|\\bP98HD\\b|\\bG18d\\b|\\bP85s\\b|\\bP11HD\\b|\\bP88s\\b|\\bA80HD\\b|\\bA80se\\b|\\bA10h\\b|\\bP89\\b|\\bP78s\\b|\\bG18\\b|\\bP85\\b|\\bA70h\\b|\\bA70\\b|\\bG17\\b|\\bP18\\b|\\bA80s\\b|\\bA11s\\b|\\bP88HD\\b|\\bA80h\\b|\\bP76s\\b|\\bP76h\\b|\\bP98\\b|\\bA10HD\\b|\\bP78\\b|\\bP88\\b|\\bA11\\b|\\bA10t\\b|\\bP76a\\b|\\bP76t\\b|\\bP76e\\b|\\bP85HD\\b|\\bP85a\\b|\\bP86\\b|\\bP75HD\\b|\\bP76v\\b|\\bA12\\b|\\bP75a\\b|\\bA15\\b|\\bP76Ti\\b|\\bP81HD\\b|\\bA10\\b|\\bT760VE\\b|\\bT720HD\\b|\\bP76\\b|\\bP73\\b|\\bP71\\b|\\bP72\\b|\\bT720SE\\b|\\bC520Ti\\b|\\bT760\\b|\\bT720VE\\b|T720-3GE|T720-WiFi",OndaTablet:"\\b(V975i|Vi30|VX530|V701|Vi60|V701s|Vi50|V801s|V719|Vx610w|VX610W|V819i|Vi10|VX580W|Vi10|V711s|V813|V811|V820w|V820|Vi20|V711|VI30W|V712|V891w|V972|V819w|V820w|Vi60|V820w|V711|V813s|V801|V819|V975s|V801|V819|V819|V818|V811|V712|V975m|V101w|V961w|V812|V818|V971|V971s|V919|V989|V116w|V102w|V973|Vi40)\\b[\\s]+",JaytechTablet:"TPC-PA762",BlaupunktTablet:"Endeavour 800NG|Endeavour 1010",DigmaTablet:"\\b(iDx10|iDx9|iDx8|iDx7|iDxD7|iDxD8|iDsQ8|iDsQ7|iDsQ8|iDsD10|iDnD7|3TS804H|iDsQ11|iDj7|iDs10)\\b",EvolioTablet:"ARIA_Mini_wifi|Aria[ _]Mini|Evolio X10|Evolio X7|Evolio X8|\\bEvotab\\b|\\bNeura\\b",LavaTablet:"QPAD E704|\\bIvoryS\\b|E-TAB IVORY|\\bE-TAB\\b",AocTablet:"MW0811|MW0812|MW0922|MTK8382|MW1031|MW0831|MW0821|MW0931|MW0712",MpmanTablet:"MP11 OCTA|MP10 OCTA|MPQC1114|MPQC1004|MPQC994|MPQC974|MPQC973|MPQC804|MPQC784|MPQC780|\\bMPG7\\b|MPDCG75|MPDCG71|MPDC1006|MP101DC|MPDC9000|MPDC905|MPDC706HD|MPDC706|MPDC705|MPDC110|MPDC100|MPDC99|MPDC97|MPDC88|MPDC8|MPDC77|MP709|MID701|MID711|MID170|MPDC703|MPQC1010",CelkonTablet:"CT695|CT888|CT[\\s]?910|CT7 Tab|CT9 Tab|CT3 Tab|CT2 Tab|CT1 Tab|C820|C720|\\bCT-1\\b",WolderTablet:"miTab \\b(DIAMOND|SPACE|BROOKLYN|NEO|FLY|MANHATTAN|FUNK|EVOLUTION|SKY|GOCAR|IRON|GENIUS|POP|MINT|EPSILON|BROADWAY|JUMP|HOP|LEGEND|NEW AGE|LINE|ADVANCE|FEEL|FOLLOW|LIKE|LINK|LIVE|THINK|FREEDOM|CHICAGO|CLEVELAND|BALTIMORE-GH|IOWA|BOSTON|SEATTLE|PHOENIX|DALLAS|IN 101|MasterChef)\\b",MiTablet:"\\bMI PAD\\b|\\bHM NOTE 1W\\b",NibiruTablet:"Nibiru M1|Nibiru Jupiter One",NexoTablet:"NEXO NOVA|NEXO 10|NEXO AVIO|NEXO FREE|NEXO GO|NEXO EVO|NEXO 3G|NEXO SMART|NEXO KIDDO|NEXO MOBI",LeaderTablet:"TBLT10Q|TBLT10I|TBL-10WDKB|TBL-10WDKBO2013|TBL-W230V2|TBL-W450|TBL-W500|SV572|TBLT7I|TBA-AC7-8G|TBLT79|TBL-8W16|TBL-10W32|TBL-10WKB|TBL-W100",UbislateTablet:"UbiSlate[\\s]?7C",PocketBookTablet:"Pocketbook",KocasoTablet:"\\b(TB-1207)\\b",HisenseTablet:"\\b(F5281|E2371)\\b",Hudl:"Hudl HT7S3|Hudl 2",TelstraTablet:"T-Hub2",GenericTablet:"Android.*\\b97D\\b|Tablet(?!.*PC)|BNTV250A|MID-WCDMA|LogicPD Zoom2|\\bA7EB\\b|CatNova8|A1_07|CT704|CT1002|\\bM721\\b|rk30sdk|\\bEVOTAB\\b|M758A|ET904|ALUMIUM10|Smartfren Tab|Endeavour 1010|Tablet-PC-4|Tagi Tab|\\bM6pro\\b|CT1020W|arc 10HD|\\bTP750\\b"},oss:{AndroidOS:"Android",BlackBerryOS:"blackberry|\\bBB10\\b|rim tablet os",PalmOS:"PalmOS|avantgo|blazer|elaine|hiptop|palm|plucker|xiino",SymbianOS:"Symbian|SymbOS|Series60|Series40|SYB-[0-9]+|\\bS60\\b",WindowsMobileOS:"Windows CE.*(PPC|Smartphone|Mobile|[0-9]{3}x[0-9]{3})|Window Mobile|Windows Phone [0-9.]+|WCE;",WindowsPhoneOS:"Windows Phone 10.0|Windows Phone 8.1|Windows Phone 8.0|Windows Phone OS|XBLWP7|ZuneWP7|Windows NT 6.[23]; ARM;",iOS:"\\biPhone.*Mobile|\\biPod|\\biPad",MeeGoOS:"MeeGo",MaemoOS:"Maemo",JavaOS:"J2ME/|\\bMIDP\\b|\\bCLDC\\b",webOS:"webOS|hpwOS",badaOS:"\\bBada\\b",BREWOS:"BREW"},uas:{Chrome:"\\bCrMo\\b|CriOS|Android.*Chrome/[.0-9]* (Mobile)?",Dolfin:"\\bDolfin\\b",Opera:"Opera.*Mini|Opera.*Mobi|Android.*Opera|Mobile.*OPR/[0-9.]+|Coast/[0-9.]+",Skyfire:"Skyfire",Edge:"Mobile Safari/[.0-9]* Edge",IE:"IEMobile|MSIEMobile",Firefox:"fennec|firefox.*maemo|(Mobile|Tablet).*Firefox|Firefox.*Mobile|FxiOS",Bolt:"bolt",TeaShark:"teashark",Blazer:"Blazer",Safari:"Version.*Mobile.*Safari|Safari.*Mobile|MobileSafari",UCBrowser:"UC.*Browser|UCWEB",baiduboxapp:"baiduboxapp",baidubrowser:"baidubrowser",DiigoBrowser:"DiigoBrowser",Puffin:"Puffin",Mercury:"\\bMercury\\b",ObigoBrowser:"Obigo",NetFront:"NF-Browser",GenericBrowser:"NokiaBrowser|OviBrowser|OneBrowser|TwonkyBeamBrowser|SEMC.*Browser|FlyFlow|Minimo|NetFront|Novarra-Vision|MQQBrowser|MicroMessenger",PaleMoon:"Android.*PaleMoon|Mobile.*PaleMoon"},props:{Mobile:"Mobile/[VER]",Build:"Build/[VER]",Version:"Version/[VER]",VendorID:"VendorID/[VER]",iPad:"iPad.*CPU[a-z ]+[VER]",iPhone:"iPhone.*CPU[a-z ]+[VER]",iPod:"iPod.*CPU[a-z ]+[VER]",Kindle:"Kindle/[VER]",Chrome:["Chrome/[VER]","CriOS/[VER]","CrMo/[VER]"],Coast:["Coast/[VER]"],Dolfin:"Dolfin/[VER]",Firefox:["Firefox/[VER]","FxiOS/[VER]"],Fennec:"Fennec/[VER]",Edge:"Edge/[VER]",IE:["IEMobile/[VER];","IEMobile [VER]","MSIE [VER];","Trident/[0-9.]+;.*rv:[VER]"],NetFront:"NetFront/[VER]",NokiaBrowser:"NokiaBrowser/[VER]",Opera:[" OPR/[VER]","Opera Mini/[VER]","Version/[VER]"],"Opera Mini":"Opera Mini/[VER]","Opera Mobi":"Version/[VER]","UC Browser":"UC Browser[VER]",MQQBrowser:"MQQBrowser/[VER]",MicroMessenger:"MicroMessenger/[VER]",baiduboxapp:"baiduboxapp/[VER]",baidubrowser:"baidubrowser/[VER]",SamsungBrowser:"SamsungBrowser/[VER]",Iron:"Iron/[VER]",Safari:["Version/[VER]","Safari/[VER]"],Skyfire:"Skyfire/[VER]",Tizen:"Tizen/[VER]",Webkit:"webkit[ /][VER]",PaleMoon:"PaleMoon/[VER]",Gecko:"Gecko/[VER]",Trident:"Trident/[VER]",Presto:"Presto/[VER]",Goanna:"Goanna/[VER]",iOS:" \\bi?OS\\b [VER][ ;]{1}",Android:"Android [VER]",BlackBerry:["BlackBerry[\\w]+/[VER]","BlackBerry.*Version/[VER]","Version/[VER]"],BREW:"BREW [VER]",Java:"Java/[VER]","Windows Phone OS":["Windows Phone OS [VER]","Windows Phone [VER]"],"Windows Phone":"Windows Phone [VER]","Windows CE":"Windows CE/[VER]","Windows NT":"Windows NT [VER]",Symbian:["SymbianOS/[VER]","Symbian/[VER]"],webOS:["webOS/[VER]","hpwOS/[VER];"]},utils:{Bot:"Googlebot|facebookexternalhit|AdsBot-Google|Google Keyword Suggestion|Facebot|YandexBot|YandexMobileBot|bingbot|ia_archiver|AhrefsBot|Ezooms|GSLFbot|WBSearchBot|Twitterbot|TweetmemeBot|Twikle|PaperLiBot|Wotbox|UnwindFetchor|Exabot|MJ12bot|YandexImages|TurnitinBot|Pingdom",MobileBot:"Googlebot-Mobile|AdsBot-Google-Mobile|YahooSeeker/M1A1-R2D2",DesktopMode:"WPDesktop",TV:"SonyDTV|HbbTV",WebKit:"(webkit)[ /]([\\w.]+)",Console:"\\b(Nintendo|Nintendo WiiU|Nintendo 3DS|PLAYSTATION|Xbox)\\b",Watch:"SM-V700"}},f.detectMobileBrowsers={fullPattern:/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,shortPattern:/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,tabletPattern:/android|ipad|playbook|silk/i};var g,h=Object.prototype.hasOwnProperty;return f.FALLBACK_PHONE="UnknownPhone",f.FALLBACK_TABLET="UnknownTablet",f.FALLBACK_MOBILE="UnknownMobile",
        g="isArray"in Array?Array.isArray:function(a){return"[object Array]"===Object.prototype.toString.call(a)},function(){var a,b,c,e,i,j,k=f.mobileDetectRules;for(a in k.props)if(h.call(k.props,a)){for(b=k.props[a],g(b)||(b=[b]),i=b.length,e=0;e<i;++e)c=b[e],j=c.indexOf("[VER]"),j>=0&&(c=c.substring(0,j)+"([\\w._\\+]+)"+c.substring(j+5)),b[e]=new RegExp(c,"i");k.props[a]=b}d(k.oss),d(k.phones),d(k.tablets),d(k.uas),d(k.utils),k.oss0={WindowsPhoneOS:k.oss.WindowsPhoneOS,WindowsMobileOS:k.oss.WindowsMobileOS}}(),f.findMatch=function(a,b){for(var c in a)if(h.call(a,c)&&a[c].test(b))return c;return null},f.findMatches=function(a,b){var c=[];for(var d in a)h.call(a,d)&&a[d].test(b)&&c.push(d);return c},f.getVersionStr=function(a,b){var c,d,e,g,i=f.mobileDetectRules.props;if(h.call(i,a))for(c=i[a],e=c.length,d=0;d<e;++d)if(g=c[d].exec(b),null!==g)return g[1];return null},f.getVersion=function(a,b){var c=f.getVersionStr(a,b);return c?f.prepareVersionNo(c):NaN},f.prepareVersionNo=function(a){var b;return b=a.split(/[a-z._ \/\-]/i),1===b.length&&(a=b[0]),b.length>1&&(a=b[0]+".",b.shift(),a+=b.join("")),Number(a)},f.isMobileFallback=function(a){return f.detectMobileBrowsers.fullPattern.test(a)||f.detectMobileBrowsers.shortPattern.test(a.substr(0,4))},f.isTabletFallback=function(a){return f.detectMobileBrowsers.tabletPattern.test(a)},f.prepareDetectionCache=function(a,c,d){if(a.mobile===b){var g,h,i;return(h=f.findMatch(f.mobileDetectRules.tablets,c))?(a.mobile=a.tablet=h,void(a.phone=null)):(g=f.findMatch(f.mobileDetectRules.phones,c))?(a.mobile=a.phone=g,void(a.tablet=null)):void(f.isMobileFallback(c)?(i=e.isPhoneSized(d),i===b?(a.mobile=f.FALLBACK_MOBILE,a.tablet=a.phone=null):i?(a.mobile=a.phone=f.FALLBACK_PHONE,a.tablet=null):(a.mobile=a.tablet=f.FALLBACK_TABLET,a.phone=null)):f.isTabletFallback(c)?(a.mobile=a.tablet=f.FALLBACK_TABLET,a.phone=null):a.mobile=a.tablet=a.phone=null)}},f.mobileGrade=function(a){var b=null!==a.mobile();return a.os("iOS")&&a.version("iPad")>=4.3||a.os("iOS")&&a.version("iPhone")>=3.1||a.os("iOS")&&a.version("iPod")>=3.1||a.version("Android")>2.1&&a.is("Webkit")||a.version("Windows Phone OS")>=7||a.is("BlackBerry")&&a.version("BlackBerry")>=6||a.match("Playbook.*Tablet")||a.version("webOS")>=1.4&&a.match("Palm|Pre|Pixi")||a.match("hp.*TouchPad")||a.is("Firefox")&&a.version("Firefox")>=12||a.is("Chrome")&&a.is("AndroidOS")&&a.version("Android")>=4||a.is("Skyfire")&&a.version("Skyfire")>=4.1&&a.is("AndroidOS")&&a.version("Android")>=2.3||a.is("Opera")&&a.version("Opera Mobi")>11&&a.is("AndroidOS")||a.is("MeeGoOS")||a.is("Tizen")||a.is("Dolfin")&&a.version("Bada")>=2||(a.is("UC Browser")||a.is("Dolfin"))&&a.version("Android")>=2.3||a.match("Kindle Fire")||a.is("Kindle")&&a.version("Kindle")>=3||a.is("AndroidOS")&&a.is("NookTablet")||a.version("Chrome")>=11&&!b||a.version("Safari")>=5&&!b||a.version("Firefox")>=4&&!b||a.version("MSIE")>=7&&!b||a.version("Opera")>=10&&!b?"A":a.os("iOS")&&a.version("iPad")<4.3||a.os("iOS")&&a.version("iPhone")<3.1||a.os("iOS")&&a.version("iPod")<3.1||a.is("Blackberry")&&a.version("BlackBerry")>=5&&a.version("BlackBerry")<6||a.version("Opera Mini")>=5&&a.version("Opera Mini")<=6.5&&(a.version("Android")>=2.3||a.is("iOS"))||a.match("NokiaN8|NokiaC7|N97.*Series60|Symbian/3")||a.version("Opera Mobi")>=11&&a.is("SymbianOS")?"B":(a.version("BlackBerry")<5||a.match("MSIEMobile|Windows CE.*Mobile")||a.version("Windows Mobile")<=5.2,"C")},f.detectOS=function(a){return f.findMatch(f.mobileDetectRules.oss0,a)||f.findMatch(f.mobileDetectRules.oss,a)},f.getDeviceSmallerSide=function(){return window.screen.width<window.screen.height?window.screen.width:window.screen.height},e.prototype={constructor:e,mobile:function(){return f.prepareDetectionCache(this._cache,this.ua,this.maxPhoneWidth),this._cache.mobile},phone:function(){return f.prepareDetectionCache(this._cache,this.ua,this.maxPhoneWidth),this._cache.phone},tablet:function(){return f.prepareDetectionCache(this._cache,this.ua,this.maxPhoneWidth),this._cache.tablet},userAgent:function(){return this._cache.userAgent===b&&(this._cache.userAgent=f.findMatch(f.mobileDetectRules.uas,this.ua)),this._cache.userAgent},userAgents:function(){return this._cache.userAgents===b&&(this._cache.userAgents=f.findMatches(f.mobileDetectRules.uas,this.ua)),this._cache.userAgents},os:function(){return this._cache.os===b&&(this._cache.os=f.detectOS(this.ua)),this._cache.os},version:function(a){return f.getVersion(a,this.ua)},versionStr:function(a){return f.getVersionStr(a,this.ua)},is:function(b){return c(this.userAgents(),b)||a(b,this.os())||a(b,this.phone())||a(b,this.tablet())||c(f.findMatches(f.mobileDetectRules.utils,this.ua),b)},match:function(a){return a instanceof RegExp||(a=new RegExp(a,"i")),a.test(this.ua)},isPhoneSized:function(a){return e.isPhoneSized(a||this.maxPhoneWidth)},mobileGrade:function(){return this._cache.grade===b&&(this._cache.grade=f.mobileGrade(this)),this._cache.grade}},"undefined"!=typeof window&&window.screen?e.isPhoneSized=function(a){return a<0?b:f.getDeviceSmallerSide()<=a}:e.isPhoneSized=function(){},e._impl=f,e.version="1.3.5 2016-11-14",e})}(function(a){if("undefined"!=typeof module&&module.exports)return function(a){module.exports=a()};if("function"==typeof define&&define.amd)return define;if("undefined"!=typeof window)return function(a){window.MobileDetect=a()};throw new Error("unknown environment")}());

    /**
     * UAParser.js v0.7.12
     * Lightweight JavaScript-based User-Agent string parser
     * https://github.com/faisalman/ua-parser-js
     *
     * Copyright © 2012-2016 Faisal Salman <fyzlman@gmail.com>
     * Dual licensed under GPLv2 & MIT
     */(function(e,t){"use strict";var n="0.7.12",r="",i="?",s="function",o="undefined",u="object",a="string",f="major",l="model",c="name",h="type",p="vendor",d="version",v="architecture",m="console",g="mobile",y="tablet",b="smarttv",w="wearable",E="embedded",S={extend:function(e,t){var n={};for(var r in e)t[r]&&t[r].length%2===0?n[r]=t[r].concat(e[r]):n[r]=e[r];return n},has:function(e,t){return typeof e=="string"?t.toLowerCase().indexOf(e.toLowerCase())!==-1:!1},lowerize:function(e){return e.toLowerCase()},major:function(e){return typeof e===a?e.replace(/[^\d\.]/g,"").split(".")[0]:t},trim:function(e){return e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,"")}},x={rgx:function(){var e,n=0,r,i,a,f,l,c,h=arguments;while(n<h.length&&!l){var p=h[n],d=h[n+1];if(typeof e===o){e={};for(a in d)d.hasOwnProperty(a)&&(f=d[a],typeof f===u?e[f[0]]=t:e[f]=t)}r=i=0;while(r<p.length&&!l){l=p[r++].exec(this.getUA());if(!!l)for(a=0;a<d.length;a++)c=l[++i],f=d[a],typeof f===u&&f.length>0?f.length==2?typeof f[1]==s?e[f[0]]=f[1].call(this,c):e[f[0]]=f[1]:f.length==3?typeof f[1]===s&&(!f[1].exec||!f[1].test)?e[f[0]]=c?f[1].call(this,c,f[2]):t:e[f[0]]=c?c.replace(f[1],f[2]):t:f.length==4&&(e[f[0]]=c?f[3].call(this,c.replace(f[1],f[2])):t):e[f]=c?c:t}n+=2}return e},str:function(e,n){for(var r in n)if(typeof n[r]===u&&n[r].length>0){for(var s=0;s<n[r].length;s++)if(S.has(n[r][s],e))return r===i?t:r}else if(S.has(n[r],e))return r===i?t:r;return e}},T={browser:{oldsafari:{version:{"1.0":"/8",1.2:"/1",1.3:"/3","2.0":"/412","2.0.2":"/416","2.0.3":"/417","2.0.4":"/419","?":"/"}}},device:{amazon:{model:{"Fire Phone":["SD","KF"]}},sprint:{model:{"Evo Shift 4G":"7373KT"},vendor:{HTC:"APA",Sprint:"Sprint"}}},os:{windows:{version:{ME:"4.90","NT 3.11":"NT3.51","NT 4.0":"NT4.0",2e3:"NT 5.0",XP:["NT 5.1","NT 5.2"],Vista:"NT 6.0",7:"NT 6.1",8:"NT 6.2",8.1:"NT 6.3",10:["NT 6.4","NT 10.0"],RT:"ARM"}}}},N={browser:[[/(opera\smini)\/([\w\.-]+)/i,/(opera\s[mobiletab]+).+version\/([\w\.-]+)/i,/(opera).+version\/([\w\.]+)/i,/(opera)[\/\s]+([\w\.]+)/i],[c,d],[/(opios)[\/\s]+([\w\.]+)/i],[[c,"Opera Mini"],d],[/\s(opr)\/([\w\.]+)/i],[[c,"Opera"],d],[/(kindle)\/([\w\.]+)/i,/(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]+)*/i,/(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?([\w\.]*)/i,/(?:ms|\()(ie)\s([\w\.]+)/i,/(rekonq)\/([\w\.]+)*/i,/(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs)\/([\w\.-]+)/i],[c,d],[/(trident).+rv[:\s]([\w\.]+).+like\sgecko/i],[[c,"IE"],d],[/(edge)\/((\d+)?[\w\.]+)/i],[c,d],[/(yabrowser)\/([\w\.]+)/i],[[c,"Yandex"],d],[/(comodo_dragon)\/([\w\.]+)/i],[[c,/_/g," "],d],[/(micromessenger)\/([\w\.]+)/i],[[c,"WeChat"],d],[/xiaomi\/miuibrowser\/([\w\.]+)/i],[d,[c,"MIUI Browser"]],[/\swv\).+(chrome)\/([\w\.]+)/i],[[c,/(.+)/,"$1 WebView"],d],[/android.+samsungbrowser\/([\w\.]+)/i,/android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i],[d,[c,"Android Browser"]],[/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i,/(qqbrowser)[\/\s]?([\w\.]+)/i],[c,d],[/(uc\s?browser)[\/\s]?([\w\.]+)/i,/ucweb.+(ucbrowser)[\/\s]?([\w\.]+)/i,/juc.+(ucweb)[\/\s]?([\w\.]+)/i],[[c,"UCBrowser"],d],[/(dolfin)\/([\w\.]+)/i],[[c,"Dolphin"],d],[/((?:android.+)crmo|crios)\/([\w\.]+)/i],[[c,"Chrome"],d],[/;fbav\/([\w\.]+);/i],[d,[c,"Facebook"]],[/fxios\/([\w\.-]+)/i],[d,[c,"Firefox"]],[/version\/([\w\.]+).+?mobile\/\w+\s(safari)/i],[d,[c,"Mobile Safari"]],[/version\/([\w\.]+).+?(mobile\s?safari|safari)/i],[d,c],[/webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i],[c,[d,x.str,T.browser.oldsafari.version]],[/(konqueror)\/([\w\.]+)/i,/(webkit|khtml)\/([\w\.]+)/i],[c,d],[/(navigator|netscape)\/([\w\.-]+)/i],[[c,"Netscape"],d],[/(swiftfox)/i,/(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,/(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/([\w\.-]+)/i,/(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i,/(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,/(links)\s\(([\w\.]+)/i,/(gobrowser)\/?([\w\.]+)*/i,/(ice\s?browser)\/v?([\w\._]+)/i,/(mosaic)[\/\s]([\w\.]+)/i],[c,d]],cpu:[[/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],[[v,"amd64"]],[/(ia32(?=;))/i],[[v,S.lowerize]],[/((?:i[346]|x)86)[;\)]/i],[[v,"ia32"]],[/windows\s(ce|mobile);\sppc;/i],[[v,"arm"]],[/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],[[v,/ower/,"",S.lowerize]],[/(sun4\w)[;\)]/i],[[v,"sparc"]],[/((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+;))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i],[[v,S.lowerize]]],device:[[/\((ipad|playbook);[\w\s\);-]+(rim|apple)/i],[l,p,[h,y]],[/applecoremedia\/[\w\.]+ \((ipad)/],[l,[p,"Apple"],[h,y]],[/(apple\s{0,1}tv)/i],[[l,"Apple TV"],[p,"Apple"]],[/(archos)\s(gamepad2?)/i,/(hp).+(touchpad)/i,/(hp).+(tablet)/i,/(kindle)\/([\w\.]+)/i,/\s(nook)[\w\s]+build\/(\w+)/i,/(dell)\s(strea[kpr\s\d]*[\dko])/i],[p,l,[h,y]],[/(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i],[l,[p,"Amazon"],[h,y]],[/(sd|kf)[0349hijorstuw]+\sbuild\/[\w\.]+.*silk\//i],[[l,x.str,T.device.amazon.model],[p,"Amazon"],[h,g]],[/\((ip[honed|\s\w*]+);.+(apple)/i],[l,p,[h,g]],[/\((ip[honed|\s\w*]+);/i],[l,[p,"Apple"],[h,g]],[/(blackberry)[\s-]?(\w+)/i,/(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola|polytron)[\s_-]?([\w-]+)*/i,/(hp)\s([\w\s]+\w)/i,/(asus)-?(\w+)/i],[p,l,[h,g]],[/\(bb10;\s(\w+)/i],[l,[p,"BlackBerry"],[h,g]],[/android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone)/i],[l,[p,"Asus"],[h,y]],[/(sony)\s(tablet\s[ps])\sbuild\//i,/(sony)?(?:sgp.+)\sbuild\//i],[[p,"Sony"],[l,"Xperia Tablet"],[h,y]],[/(?:sony)?(?:(?:(?:c|d)\d{4})|(?:so[-l].+))\sbuild\//i],[[p,"Sony"],[l,"Xperia Phone"],[h,g]],[/\s(ouya)\s/i,/(nintendo)\s([wids3u]+)/i],[p,l,[h,m]],[/android.+;\s(shield)\sbuild/i],[l,[p,"Nvidia"],[h,m]],[/(playstation\s[34portablevi]+)/i],[l,[p,"Sony"],[h,m]],[/(sprint\s(\w+))/i],[[p,x.str,T.device.sprint.vendor],[l,x.str,T.device.sprint.model],[h,g]],[/(lenovo)\s?(S(?:5000|6000)+(?:[-][\w+]))/i],[p,l,[h,y]],[/(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i,/(zte)-(\w+)*/i,/(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i],[p,[l,/_/g," "],[h,g]],[/(nexus\s9)/i],[l,[p,"HTC"],[h,y]],[/(nexus\s6p)/i],[l,[p,"Huawei"],[h,g]],[/(microsoft);\s(lumia[\s\w]+)/i],[p,l,[h,g]],[/[\s\(;](xbox(?:\sone)?)[\s\);]/i],[l,[p,"Microsoft"],[h,m]],[/(kin\.[onetw]{3})/i],[[l,/\./g," "],[p,"Microsoft"],[h,g]],[/\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?)[\w\s]+build\//i,/mot[\s-]?(\w+)*/i,/(XT\d{3,4}) build\//i,/(nexus\s6)/i],[l,[p,"Motorola"],[h,g]],[/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i],[l,[p,"Motorola"],[h,y]],[/hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i],[[p,S.trim],[l,S.trim],[h,b]],[/hbbtv.+maple;(\d+)/i],[[l,/^/,"SmartTV"],[p,"Samsung"],[h,b]],[/\(dtv[\);].+(aquos)/i],[l,[p,"Sharp"],[h,b]],[/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,/((SM-T\w+))/i],[[p,"Samsung"],l,[h,y]],[/smart-tv.+(samsung)/i],[p,[h,b],l],[/((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,/(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i,/sec-((sgh\w+))/i],[[p,"Samsung"],l,[h,g]],[/sie-(\w+)*/i],[l,[p,"Siemens"],[h,g]],[/(maemo|nokia).*(n900|lumia\s\d+)/i,/(nokia)[\s_-]?([\w-]+)*/i],[[p,"Nokia"],l,[h,g]],[/android\s3\.[\s\w;-]{10}(a\d{3})/i],[l,[p,"Acer"],[h,y]],[/android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i],[[p,"LG"],l,[h,y]],[/(lg) netcast\.tv/i],[p,l,[h,b]],[/(nexus\s[45])/i,/lg[e;\s\/-]+(\w+)*/i],[l,[p,"LG"],[h,g]],[/android.+(ideatab[a-z0-9\-\s]+)/i],[l,[p,"Lenovo"],[h,y]],[/linux;.+((jolla));/i],[p,l,[h,g]],[/((pebble))app\/[\d\.]+\s/i],[p,l,[h,w]],[/android.+;\s(glass)\s\d/i],[l,[p,"Google"],[h,w]],[/android.+(\w+)\s+build\/hm\1/i,/android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i,/android.+(mi[\s\-_]*(?:one|one[\s_]plus|note lte)?[\s_]*(?:\d\w)?)\s+build/i],[[l,/_/g," "],[p,"Xiaomi"],[h,g]],[/android.+a000(1)\s+build/i],[l,[p,"OnePlus"],[h,g]],[/\s(tablet)[;\/]/i,/\s(mobile)(?:[;\/]|\ssafari)/i],[[h,S.lowerize],p,l]],engine:[[/windows.+\sedge\/([\w\.]+)/i],[d,[c,"EdgeHTML"]],[/(presto)\/([\w\.]+)/i,/(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i,/(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i,/(icab)[\/\s]([23]\.[\d\.]+)/i],[c,d],[/rv\:([\w\.]+).*(gecko)/i],[d,c]],os:[[/microsoft\s(windows)\s(vista|xp)/i],[c,d],[/(windows)\snt\s6\.2;\s(arm)/i,/(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s]+\w)*/i,/(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],[c,[d,x.str,T.os.windows.version]],[/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],[[c,"Windows"],[d,x.str,T.os.windows.version]],[/\((bb)(10);/i],[[c,"BlackBerry"],d],[/(blackberry)\w*\/?([\w\.]+)*/i,/(tizen)[\/\s]([\w\.]+)/i,/(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|contiki)[\/\s-]?([\w\.]+)*/i,/linux;.+(sailfish);/i],[c,d],[/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i],[[c,"Symbian"],d],[/\((series40);/i],[c],[/mozilla.+\(mobile;.+gecko.+firefox/i],[[c,"Firefox OS"],d],[/(nintendo|playstation)\s([wids34portablevu]+)/i,/(mint)[\/\s\(]?(\w+)*/i,/(mageia|vectorlinux)[;\s]/i,/(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]+)*/i,/(hurd|linux)\s?([\w\.]+)*/i,/(gnu)\s?([\w\.]+)*/i],[c,d],[/(cros)\s[\w]+\s([\w\.]+\w)/i],[[c,"Chromium OS"],d],[/(sunos)\s?([\w\.]+\d)*/i],[[c,"Solaris"],d],[/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i],[c,d],[/(haiku)\s(\w+)/i],[c,d],[/(ip[honead]+)(?:.*os\s([\w]+)*\slike\smac|;\sopera)/i],[[c,"iOS"],[d,/_/g,"."]],[/(mac\sos\sx)\s?([\w\s\.]+\w)*/i,/(macintosh|mac(?=_powerpc)\s)/i],[[c,"Mac OS"],[d,/_/g,"."]],[/((?:open)?solaris)[\/\s-]?([\w\.]+)*/i,/(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i,/(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms)/i,/(unix)\s?([\w\.]+)*/i],[c,d]]},C=function(t,n){if(this instanceof C){var i=t||(e&&e.navigator&&e.navigator.userAgent?e.navigator.userAgent:r),s=n?S.extend(N,n):N;return this.getBrowser=function(){var e=x.rgx.apply(this,s.browser);return e.major=S.major(e.version),e},this.getCPU=function(){return x.rgx.apply(this,s.cpu)},this.getDevice=function(){return x.rgx.apply(this,s.device)},this.getEngine=function(){return x.rgx.apply(this,s.engine)},this.getOS=function(){return x.rgx.apply(this,s.os)},this.getResult=function(){return{ua:this.getUA(),browser:this.getBrowser(),engine:this.getEngine(),os:this.getOS(),device:this.getDevice(),cpu:this.getCPU()}},this.getUA=function(){return i},this.setUA=function(e){return i=e,this},this}return(new C(t,n)).getResult()};C.VERSION=n,C.BROWSER={NAME:c,MAJOR:f,VERSION:d},C.CPU={ARCHITECTURE:v},C.DEVICE={MODEL:l,VENDOR:p,TYPE:h,CONSOLE:m,MOBILE:g,SMARTTV:b,TABLET:y,WEARABLE:w,EMBEDDED:E},C.ENGINE={NAME:c,VERSION:d},C.OS={NAME:c,VERSION:d},typeof exports!==o?(typeof module!==o&&module.exports&&(exports=module.exports=C),exports.UAParser=C):typeof define===s&&define.amd?define(function(){return C}):e.UAParser=C;var k=e.jQuery||e.Zepto;if(typeof k!==o){var L=new C;k.ua=L.getResult(),k.ua.get=function(){return L.getUA()},k.ua.set=function(e){L.setUA(e);var t=L.getResult();for(var n in t)k.ua[n]=t[n]}}})(typeof window=="object"?window:this);
    /**
     * Will hold the params from the client snippet
     * @type {Array}
     */
    var snippetParams = null;

    /**
     * Used for logger.
     */
    var TIME_START = Date.now();

    /**
     * Logger
     * @param {String} msg
     * @param {String} [type] - warn/log/etc
     * @constructor
     */
    var LOG = function(msg, type) {
        if(typeof type == 'undefined'){
            type='log';
        }
        if(document.location.search.indexOf('debug=abtest') > 0) {
            console[type](msg);
        }
    }

    /**
     * Used to push to GTM for Analytics
     * @param experimentId
     * @param variation
     * @constructor
     */
    var GTMPush = function (experimentId, variation) {
        
        setTimeout(function(){
            if(typeof dataLayer === "undefined") {
                dataLayer = [];
            }
            dataLayer.push({
                'event': 'abTestParticipated',
                'experimentId': 'ABTest-' + experimentId,
                'experimentVariation': variation
            });
        },1000);
    };

    /**
     * Send ajax requests
     * @param options
     */
    var $ajax = function(options) {
        try {
            var type = options.type || 'GET';
            x = new(this.XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
            x.timeout = snippetParams.library_tolerance();
            x.open(type, options.url, true);
            //x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            if(options.dataType === 'json') {
                xmlHttp.setRequestHeader("Content-type", "application/json");
            }
            x.onreadystatechange = function () {
                x.readyState > 3 && options.success && options.success(x.responseText, x);
            };
            x.send(options.data)
        } catch (e) {
            LOG(e);
        }
    };

    /**
     * Function to validate if a user is in an Experiment by checking cookie.
     * Also calculate the probability of a user participation
     * @param campaign
     * @param browserInfo
     * @returns {{participate: boolean, campaign_id: int, included: number, var_id: string, variation: string}}
     */
    var userInCampaign = function(campaign,browserInfo) {

        var cookie_inc = browserInfo.cookies['_ABTest_exp_'+campaign.campaign_id+'_inc'];
        var cookie_exc = browserInfo.cookies['_ABTest_exp_'+campaign.campaign_id+'_exc'];

        var out =  {
            participate: true,
            campaign_id: campaign.campaign_id,
            included: 1,
            var_id: cookie_inc,
            variation: ''
        };

        /*--------------------------------------------------------
         | If user is already a part of this experiment (cookie check),
         | then return true.
         --------------------------------------------------------*/
        if(cookie_inc !== undefined) {
            return out;
        }

        /*--------------------------------------------------------
         | If user is excluded from this exp, he definately cant be
         | a part of this experiment, ever!
         --------------------------------------------------------*/
        if(Object.keys(browserInfo.cookies).length > 0 && cookie_exc !== undefined) {
            out.participate = false;
            out.included = 0;
            return out;
        }

        /*--------------------------------------------------------
         | If user is new, check the probability of participation
         | in this experiment
         --------------------------------------------------------*/

        var random = Math.floor((Math.random() * 100) + 1);

        if(random <= campaign.traffic) {
            //which variation should be show ?
            var percentile = Math.floor(Math.random() * 99);
            var currentPercentile = 0;
            for (var name in campaign.variations) {
                var variation = campaign.variations[name];
                currentPercentile += parseInt(variation.traffic);
                if (percentile < currentPercentile) {
                    out.var_id = variation.id;
                    out.variation = variation.name;
                    break;
                }

            }
            return out;
        }else{
            out.participate = false;
            out.included = 0;
            return out;
        }
    }

    /**
     * Compares the experiment's configured settings with users browser for targetting
     * @param userBrowserInfo
     * @returns {{criteria: {}, userBrowserInfo: {}, formatOutput: logic.formatOutput, match: logic.match, setCampaignCriteria: logic.setCampaignCriteria, matchUrl: logic.matchUrl, matchDevice: logic.matchDevice, matchBrowser: logic.matchBrowser, matchGeographic: logic.matchGeographic, matchCookie: logic.matchCookie, matchUser: logic.matchUser, matchIP: logic.matchIP, matchLanguage: logic.matchLanguage, matchScript: logic.matchScript, removeLastSlash: logic.removeLastSlash}}
     * @constructor
     */
    var TargetMatcher = function (userBrowserInfo) {

        var logic =  {

            criteria: {},
            userBrowserInfo: {},
            formatOutput: function (matched, criteria, value, run) {
                return {
                    matched: matched,
                    criteria: criteria,
                    value: value,
                    run: run
                }
            },
            match: function (campaign) {
                this.setCampaignCriteria(campaign);
                var matches = {};
                matches.urlCriteria = this.matchUrl();
                matches.deviceCriteria = this.matchDevice();
                matches.browserCriteria = this.matchBrowser();
                matches.cookieCriteria = this.matchCookie();
                matches.userCriteria = this.matchUser();
                matches.ipCriteria = this.matchIP();
                matches.langCriteria = this.matchLanguage();
                matches.script = this.matchScript();

                var run = 1;
                var reason = {};
                for(var criteria in matches) {
                    if(matches[criteria].run == 0) {
                        run = 0;
                        reason[criteria] = matches[criteria];
                        break;
                    }
                }
                return {
                    //matches: matches,
                    execute: run,
                    reason: reason
                }


            },
            setCampaignCriteria: function (campaign) {
                this.criteria = {
                    url: JSON.parse(campaign.url),
                    device: JSON.parse(campaign.device),
                    browser: JSON.parse(campaign.browser),
                    geographic: campaign.geographic,
                    cookie: JSON.parse(campaign.cookie),
                    user: JSON.parse(campaign.user),
                    ip: JSON.parse(campaign.ip),
                    language: JSON.parse(campaign.language),
                    script: JSON.parse(campaign.script)
                }
            },
            matchUrl: function () {
                var self = this;
                var output = {};
                //url excludes
                if (this.criteria.url.url_excludes) {
                    var excludes = this.criteria.url.url_excludes;
                    excludes.forEach(function (exclude) {
                        if (self.userBrowserInfo.urlData.url.indexOf(exclude) >= 0) {
                            output = self.formatOutput(true, 'url_excludes', exclude, 0);
                            return;
                        }
                    });
                    if (output.hasOwnProperty('run')) return output;
                }


                //url includes
                if (this.criteria.url.url_contains) {
                    var includes = this.criteria.url.url_contains;
                    includes.forEach(function (include) {
                        if (self.userBrowserInfo.urlData.url.indexOf(include) >= 0) {
                            output = self.formatOutput(true, 'url_includes', include, 1);
                            return;
                        }
                    })
                    if (output.hasOwnProperty('run')) return output;
                }

                //url matches
                if (this.criteria.url.url) {

                    var host_url = this.userBrowserInfo.urlData.url;
                    var urls = this.criteria.url.url;

                    urls.forEach(function (url) {
                        var firstChar = url.charAt(0);
                        var lastChar = url.charAt(url.length-1);
                        if(firstChar == '/' && lastChar == '/') {
                            if(host_url.match(url)) {
                                output = self.formatOutput(true, 'url_matched', url, 1);
                                return;
                            }
                        }else if(self.removeLastSlash(url) == host_url) {
                            output = self.formatOutput(true, 'url_matched', url, 1);
                            return;
                        }
                    })
                    if (output.hasOwnProperty('run')) return output;
                }
                return self.formatOutput(false, 'url_check', null, 0);
            },
            matchDevice: function () {

                var output = {
                    matched: false,
                    criteria: 'device_check',
                    run: 0
                };

                var desktop = this.criteria.device.allow_desktop == "true";
                var phone = this.criteria.device.allow_mobile == "true";
                var tablet = this.criteria.device.allow_tablet == "true";
                var userDevice = this.userBrowserInfo.device;

                if (desktop && userDevice === 'desktop') {
                    output = this.formatOutput(true, 'device_check', userDevice, 1);
                    return output;
                }

                if (phone && userDevice === 'phone') {
                    output = this.formatOutput(true, 'device_check', userDevice, 1);
                    return output;
                }

                if (tablet && userDevice === 'tablet') {
                    output = this.formatOutput(true, 'device_check', userDevice, 1);
                    return output;
                }

                return output;

            },
            matchBrowser: function () {
                var userBrowser = this.userBrowserInfo.browserName;
                var output = {};
                if (this.criteria.browser) {
                    var browser = this.criteria.browser;

                    //check if there is any browser we are not allowing
                    for (var name in browser) {
                        if (browser.hasOwnProperty(name) && browser[name] == "true") {
                            //we didnt allow this browser
                            if (userBrowser.indexOf(name) >= 0) {

                                output = this.formatOutput(true, 'browser_check', name, 0);
                                break;
                            }
                        }
                    }

                    if (output.hasOwnProperty('run')) return output;
                }
                return this.formatOutput(false, 'browser_check', null, 1);
            },
            matchGeographic: function () {

            },
            matchCookie: function () {
                var self = this;
                var active = false;
                var userCookies = this.userBrowserInfo.cookies;
                var output = {};
                if (this.criteria.cookie) {
                    //exclude cookie
                    if (this.criteria.cookie.exclude_cookie && this.criteria.cookie.exclude_cookie.length > 0) {
                        var excludes = this.criteria.cookie.exclude_cookie;
                        excludes.forEach(function (name) {
                            if (userCookies[name]) {
                                active = true;
                                output = self.formatOutput(true, 'cookie_exclude', name, 0);
                                return;
                            }
                        })
                        if (output.hasOwnProperty('run')) return output;
                    }

                    //include cookie
                    if (this.criteria.cookie.include_cookie && this.criteria.cookie.include_cookie.length > 0) {
                        var includes = this.criteria.cookie.include_cookie;
                        includes.forEach(function (name) {
                            if (userCookies[name]) {
                                active = true;
                                output = self.formatOutput(true, 'cookie_include', name, 1);
                                return;
                            }
                        });
                        if (output.hasOwnProperty('run')) return output;
                    }
                }

                return (active) ? self.formatOutput(false, 'cookies', null, 0) : self.formatOutput(false, 'cookies', null, 1);
            },
            matchUser: function () {
                var self = this;
                var userCookies = this.userBrowserInfo.cookies;

                var active = false;
                var output = {};
                if (this.criteria.user) {
                    //include all users ?
                    if (this.criteria.user['all_users'] == 'true') {
                        return self.formatOutput(true, 'user_match', 'all_users', 1);
                    }

                    //only new users
                    else if (this.criteria.user['new_users'] == 'true') {
                        active = false;
                        for (var name in userCookies) {

                            if (name.indexOf('_ABTest') >= 0) {
                                output = self.formatOutput(true, 'user_match', 'new_user', 0);
                                break;
                            }
                        }
                        if (output.hasOwnProperty('run')) return output;
                    }

                    //only returning users
                    else if (this.criteria.user['returning_users'] == 'true') {
                        active = true;
                        for (var name in userCookies) {
                            if (name.indexOf('_ABTest') >= 0) {
                                output = self.formatOutput(true, 'user_match', 'returning_user', 1);
                                break;
                            }
                        }
                        if (output.hasOwnProperty('run')) return output;
                    }
                }
                return (active) ? self.formatOutput(false, 'user_match', null, 0) : self.formatOutput(false, 'user_match', null, 1);

            },
            matchIP: function () {

                var userIp = this.userBrowserInfo.ip;

                var breakUserIp = userIp.split('.');
                var output = {};
                var self = this;
                if(this.criteria.ip) {
                    //ip excludes
                    if (this.criteria.ip.exclude_ips && this.criteria.ip.exclude_ips.length > 0) {
                        var excludes = this.criteria.ip.exclude_ips;

                        excludes.forEach(function (ip) {

                            var breakIp = ip.split('.');
                            if (breakIp.length > 0) {

                                output = self.formatOutput(true, 'ip_excludes', ip, 0);

                                breakIp.forEach(function (ele, idx) {

                                    if (ele != '*' && breakUserIp[idx] != ele) {
                                        output = {};
                                        return;
                                    }
                                });
                            }
                        });
                        if (output.hasOwnProperty('run')) return output;
                    }

                    //ip includes
                    if (this.criteria.ip.include_ips && this.criteria.ip.include_ips.length > 0) {
                        var includes = this.criteria.ip.include_ips;
                        includes.forEach(function (ip) {

                            var breakIp = ip.split('.');
                            if (breakIp.length > 0) {


                                output = self.formatOutput(true, 'ip_includes', ip, 1);

                                breakIp.forEach(function (ele, idx) {

                                    if (ele != '*' && breakUserIp[idx] !== ele) {
                                        output = self.formatOutput(false, 'ip_includes', ip, 0);
                                        return;
                                    }
                                });
                            }
                        });
                        if (output.hasOwnProperty('run')) return output;
                    }
                }
                return self.formatOutput(false, 'ip', null, 1);
            },
            matchLanguage: function () {

                var userLang = this.userBrowserInfo.languages.toLowerCase();

                var output = {};
                var self = this;
                if(this.criteria.language) {
                    //language excludes
                    if (this.criteria.language.exclude_languages && this.criteria.language.exclude_languages.length > 0) {
                        var excludes = this.criteria.language.exclude_languages;

                        excludes.forEach(function (language) {

                            if (language.toLowerCase() == userLang) {
                                output = self.formatOutput(true, 'lang_exclude', userLang, 0);
                                return;
                            }

                        });
                        if (output.hasOwnProperty('run')) return output;
                    }
                    //language includes
                    if (this.criteria.language.allowed_languages && this.criteria.language.allowed_languages.length > 0) {

                        var includes = this.criteria.language.allowed_languages;

                        output = self.formatOutput(false, 'lang_include', userLang, 0);

                        includes.forEach(function (language) {

                            if (language.toLowerCase() == userLang) {
                                output = self.formatOutput(true, 'lang_include', userLang, 1);
                                return;
                            }

                        });
                        if (output.hasOwnProperty('run')) return output;
                    }
                }
                return self.formatOutput(false, 'language', null, 1);

            },
            matchScript: function() {

                if(this.criteria.script) {
                    if (this.criteria.script.js == "") {
                        return this.formatOutput(true, 'script', null, 1);
                    }

                    if (eval(this.criteria.script.js)) {
                        return this.formatOutput(true, 'script', null, 1);
                    }
                }
                return this.formatOutput(false, 'script', null, 0);
            },
            removeLastSlash: function (str) {

                if (typeof str == "string" && str.substr(-1) === '/') {
                    str = str.substr(0, str.length - 1);
                }
                return str;
            }
        }

        logic.userBrowserInfo = userBrowserInfo;

        return logic;
    }

    return {
        changes: [],
        preview: false,
        host_name: 'http://localhost:3000/',
        documentUrl: null,
        executing: false,
        snippetParams: null,
        loadjQuery: function() {
            LOG("Feature to be added - To load jquery","warn");
        },
        storeVariations: function(campaign) {
            localStorage.setItem('_ABTest_V-' + campaign.participationObj.campaign_id,JSON.stringify(campaign));
        },
        getLocalCampaigns: function() {
            var data = {};
            for (var i=0;i < localStorage.length; i++) {
                var key = localStorage.key(i);

                if(key.indexOf('_ABTest_V-') === 0) {
                    data[key] = JSON.parse(localStorage.getItem(key));
                }
            }
            return data;
        },
        setDocumentUrl: function() {
            var documentUrl = document.location.href.replace(document.location.search,'');
            this.documentUrl = this.removeLastSlash(documentUrl);
        },
        // for each experiment, load a variant if already saved for this session, or pick a random one
        init: function (accountId,params) {
            this.snippetParams = snippetParams = params;

            this.setDocumentUrl();
            try {
                if (this.getParameters('preview') == "1" && this.getParameters('cid') != "" && this.getParameters('vid') != "") {
                    LOG(Date.now()-TIME_START + " : Getting Preview");
                    this.getPreview(this.getParameters('cid'), this.getParameters('vid'));
                } else {
                    LOG(Date.now()-TIME_START + " : Getting Live");
                    this.getLive(accountId);
                }
            }catch(e){
                LOG('There was an error.' + e.toString(),'warn');
            }
        },
        parseJSON: function(data) {
            try {
                return JSON.parse(data);
            }catch(e){
                LOG('Error Parsing JSON','warn');
            }
        },
        serverRequest: function(accountId) {
            var self = this;
            $ajax({
                url: self.host_name + "running?account_id="+ accountId,
                success: function (data) {
                    var data = self.parseJSON(data);
                    if(data) {
                        LOG(Date.now()-TIME_START + " : OK from server");
                        if(data.browserInfo && data.campaigns && data.campaigns.length > 0) {
                            data.browserInfo.cookies = self.getAllCookies();
                            data.browserInfo.urlData.referrer = document.referrer;
                            data.browserInfo.urlData.url = self.documentUrl;
                            TargetMatcher.prototype.userBrowserInfo = data.browserInfo;

                            data.campaigns.forEach(function(campaign){
                                LOG(Date.now()-TIME_START + " : Checking if experiment will run now or next time");
                                var matchResult = self.willCampaignRun(campaign,data.browserInfo);
                                LOG(matchResult);
                                if(matchResult.execute) {
                                    LOG(Date.now()-TIME_START + " : experiment passed targetting criteria");
                                    campaign.variations = self.removePausedVariations(phpUnserialize(campaign.variations));
                                    LOG(Date.now()-TIME_START + " : Checking participation status");
                                    campaign.participationObj = userInCampaign(campaign,data.browserInfo);
                                    if(campaign.participationObj.participate) {
                                        LOG(Date.now()-TIME_START + " : User Participates");
                                        self.execute(campaign);
                                    }else{
                                        LOG(Date.now()-TIME_START + " : User is excluded");
                                        self.setCookie('_ABTest_exp_'+campaign.campaign_id+'_exc',1);
                                    }
                                }
                                else
                                {
                                    //clean the variation if exist
                                    self.campaignCleanUp(campaign);
                                }
                            })
                        }else{
                            //clean everything
                            self.campaignCleanUp();
                        }
                    }else{
                        LOG(Date.now()-TIME_START + " : No Experiments found from server");
                    }
                }
            });
        },
        removePausedVariations: function(variations)
        {
            for(var i in variations) {
                if(variations[i].paused == 'true') {
                    delete  variations[i];
                }
            }
            return variations;
        },
        getLive: function(accountId) {
            var self = this;
            var campaigns = self.getLocalCampaigns();
            self.executed = false;
            var totalCampaigns = Object.keys(campaigns).length;
            if(totalCampaigns == 0) {
                self.serverRequest(accountId);
                LOG(Date.now()-TIME_START + " : No experiments found in LocalStorage");
            }else{
                /* Device */
                var md = new MobileDetect(navigator.userAgent);
                var parser = new UAParser();
                var device = 'desktop';
                if(md.tablet() !== null) {
                    device = 'tablet';
                }
                else if(md.phone() !== null || md.mobile() !== null) {
                    device = 'phone';
                }
                var data = {
                    browserInfo: {
                        "urlData": {
                            referrer: document.referrer,
                            url: self.documentUrl
                        },
                        "browserName": parser.getBrowser().name,
                        "languages": "",
                        "ip": "",
                        "geo": "",
                        "device": device,
                        "cookies": self.getAllCookies()
                    }
                }
                LOG(Date.now()-TIME_START + " : Experiments found in LocalStorage");
            }
            for(var campaign in campaigns) {
                var matchResult = self.willCampaignRun(campaigns[campaign], data.browserInfo);
                LOG(matchResult);
                if(matchResult.execute) {
                    self.execute(campaigns[campaign], function(status){
                        totalCampaigns--;
                        if(totalCampaigns == 0) {
                            LOG(Date.now()-TIME_START + " : Getting latest updates from server and updating the client");
                            self.serverRequest(accountId);
                        }
                    });
                }
            }
        },
        campaignCleanUp: function(campaign) {
            if(typeof campaign == 'undefined')
            {
                for (var i=0;i < localStorage.length; i++) {
                    var key = localStorage.key(i);

                    if(key.indexOf('_ABTest_V-') === 0) {
                        localStorage.removeItem(key);
                    }
                }
            }
            else
            {
                localStorage.removeItem('_ABTest_V-' + campaign.campaign_id);
            }
        },
        willCampaignRun: function(campaign,userBrowserInfo) {
            var matcher = new TargetMatcher(userBrowserInfo);
            return matcher.match(campaign);
        },
        removeLastSlash: function(str) {
            
            if(typeof str == "string" && str.substr(-1) === '/') {
                str =  str.substr(0, str.length - 1);
            }
            return str;
        },
        getPreview: function(cid,vid) {
            var self = this;
            self.preview = true;
            $ajax({
                url: self.host_name + "running?preview=1&cid="+ cid,
                success: function (data) {
                    var data = self.parseJSON(data);
                    if(data) {
                        if(data.browserInfo && data.campaigns) {
                            data.browserInfo.cookies = self.getAllCookies();
                            data.browserInfo.urlData.referrer = document.referrer;
                            data.browserInfo.urlData.url = self.documentUrl;
                            data.campaigns.forEach(function(campaign){

                                var matchResult = self.willCampaignRun(campaign,data.browserInfo);
                                LOG(matchResult);

                                if(matchResult.execute) {
                                    campaign.variations = phpUnserialize(campaign.variations);
                                    campaign.participationObj = {
                                        participate: true,
                                        campaign_id: campaign.campaign_id,
                                        included: 1,
                                        var_id: vid,
                                        variation: ''
                                    };
                                    self.execute(campaign);
                                }
                            })
                        }
                    }
                    
                }
            });
        },
        timeoutDetected: function() {
            LOG(Date.now()-TIME_START + " : Timeout detected");
        },
        execute: function(campaign,callback) {

            var self = this;
            try {
                if(self.executing) {
                    self.storeVariations(campaign);
                    if(typeof callback == 'function') {
                        callback(true);
                    }
                }else{
                    run(self,campaign,callback);
                    self.executing = true;
                }

                function run(self,campaign,callback) {
                    var variation = campaign.variations[campaign.participationObj.var_id];
                    if(variation == undefined)
                    {
                        callback(status);
                        return;
                    }
                    //we will run the campaign only if it is under time limits
                    //var visibility = document.getElementById('_abtest_path_hides') === null;
                    //if(visibility) {
                    //    self.timeoutDetected();
                    //    return;
                    //}

                    self.runJS(variation.js, function(status){
                        LOG(Date.now()-TIME_START + " : Injected Javascript");
                        self.runCSS(variation.css);
                        LOG(Date.now()-TIME_START + " : Injected CSS");
                        if(!self.preview) {
                            self.storeVariations(campaign);
                            GTMPush(campaign.participationObj.campaign_id, variation.id);
                            self.setCookie('_ABTest_exp_' + campaign.participationObj.campaign_id + '_inc', campaign.participationObj.var_id);
                        }
                        if(typeof callback == 'function') {
                            LOG(Date.now()-TIME_START + " : Executed experiment from LocalStorage");
                            callback(status);
                        }
                    });

                    //document.getElementsByTagName('html')[0].style.display = "block";
                    //var elem = document.getElementById("_abtest_path_hides");
                    //if(elem !== null) {
                    //    elem.parentElement.removeChild(elem);
                    //}
                }

            } catch (e) {
                // not json
            }
                
        },
        runJS: function (js,callback) {

            eval(js);
            callback(true);
            //this.jQueryLoaded(function(status) {
            //    if(status) {
            //        eval(js);
            //    }
            //    callback(status);
            //})
        },
        runCSS: function (css) {
            var styleElement = document.createElement("style");
            styleElement.type = "text/css";
            if (styleElement.styleSheet) {
                styleElement.styleSheet.cssText = css;
            } else {
                styleElement.appendChild(document.createTextNode(css));
            }
            styleElement.className = 'lift-ab-test-class';
            document.getElementsByTagName("head")[0].appendChild(styleElement);
        },
        jQueryLoaded: function (callback) {
            var t = setInterval(function () {
                if (typeof jQuery !== "undefined") {
                    clearInterval(t);
                    callback(true);
                }
            }, 5);

            setTimeout(function () {
                if (typeof jQuery === "undefined") {
                    LOG("Jquery didnt load on time!","warn");
                    callback(false);
                }
                clearInterval(t);
            }, 600);
        },
        setCookie: function(name, value) {
            var d = new Date();
            d = new Date(d.getTime() + 1000 * 60 * 60 * 24 * 100);
            document.cookie = name + '=' + value + ';expires=' + d.toGMTString() + ';path=/';
        },
        removeCookie: function(sKey, sPath, sDomain) {

            document.cookie = encodeURIComponent(sKey) +
                "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" +
                (sDomain ? "; domain=" + sDomain : "") +
                (sPath ? "; path=" + sPath : "");
        },
        getAllCookies: function() {
            var cookieObj = {};
            document.cookie.split(';').forEach(function(str){
                if(str == "") return {};
                var arr = str.split('=');
                cookieObj[arr[0].trim()] = arr[1].trim();
            });
            return cookieObj;
        },
        getParameters: function(name) {
            var query_string = {};
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                // If first entry with this name
                if (typeof query_string[pair[0]] === "undefined") {
                    query_string[pair[0]] = decodeURIComponent(pair[1]);
                    // If second entry with this name
                } else if (typeof query_string[pair[0]] === "string") {
                    var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
                    query_string[pair[0]] = arr;
                    // If third or later entry with this name
                } else {
                    query_string[pair[0]].push(decodeURIComponent(pair[1]));
                }
            } 
            return (query_string[name] === undefined) ? null : query_string[name];
        }

    };
})(window, document);
window.ABTest = window.$_ABTest = ABTest;