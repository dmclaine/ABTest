var ABTest=function(window,document,undefined){var snippetParams=null,GTMPush=function(e,t){setTimeout(function(){"undefined"==typeof dataLayer&&(dataLayer=[]),dataLayer.push({event:"abTestParticipated",experimentId:"ABTest-"+e,experimentVariation:t})},1e3)},$ajax=function(e){try{var t=e.type||"GET";x=new(this.XMLHttpRequest||ActiveXObject)("MSXML2.XMLHTTP.3.0"),x.timeout=snippetParams.library_tolerance(),x.open(t,e.url,!0),x.setRequestHeader("Content-type","application/x-www-form-urlencoded"),"json"===e.dataType&&xmlHttp.setRequestHeader("Content-type","application/json"),x.onreadystatechange=function(){x.readyState>3&&e.success&&e.success(x.responseText,x)},x.send(e.data)}catch(n){window.console&&console.log(n)}};return{changes:[],preview:!1,host_name:"https://abclient.datastars.de/",documentUrl:null,executed:!1,snippetParams:null,loadjQuery:function(){console.warn("Feature to be added - To load jquery")},storeVariations:function(e){localStorage.setItem("variations",e)},getVariations:function(){return localStorage.getItem("variations")},setDocumentUrl:function(){var e=document.location.href.replace(document.location.search,"");this.documentUrl=this.removeLastSlash(e)},init:function(e,t){if(snippetParams=t,this.setDocumentUrl(),"1"==this.getParameters("_ab_preview")&&""!=this.getParameters("exp_id")&&""!=this.getParameters("variation")){var n="_ABTest_exp_"+this.getParameters("exp_id")+"_inc="+this.getParameters("variation");this.getPreview(e,n)}else this.getLive(e)},getLive:function(e){var t=this,n=t.getVariations();t.executed=!1,null!==n&&(t.execute(n),document.getElementsByTagName("html")[0].style.display="block"),$ajax({url:t.host_name+"campaign?account_id="+e+"&url="+encodeURIComponent(t.documentUrl)+"&c="+this.getCookies(),success:function(e){t.storeVariations(e),t.executed||"[]"==e||t.execute(e)}})},removeLastSlash:function(e){return"string"==typeof e&&"/"===e.substr(-1)&&(e=e.substr(0,e.length-1)),e},runTest:function(e){for(var t=this.documentUrl,n=0;e.length>n;n++){var a=this.removeLastSlash(e[n]),i=a.replace(/\//g,"\\/"),o="/"+i+"/";if(a==t)return!0;if(t.match(o))return!0}return!1},getPreview:function(e,t){var n=this;n.preview=!0,$ajax({url:n.host_name+"campaign?preview=1&account_id="+e+"&url="+encodeURIComponent(n.documentUrl)+'&c=["'+t+'"]',success:function(e){n.execute(e)}})},execute:function(e){function t(t,n,a,o){t.runJS(n.js,function(){t.runCSS(n.css),t.executed=!0,t.storeVariations(e),GTMPush(n.experiment,n.name),document.cookie=a+"="+o+";expires="+i.toGMTString()+";path=/"}),document.getElementsByTagName("html")[0].style.display="block"}var n=this;try{if(""!=e){var a=JSON.parse(e),i=new Date;i=new Date(i.getTime()+864e7),a.map(function(e){if(n.runTest(e.test_url))if(n.preview)t(n,e);else{if(e.participate){var a="_ABTest_exp_"+e.experiment+"_inc",o=e.vid;t(n,e,a,o)}else{var a="_ABTest_exp_"+e.experiment+"_exc",o=1;document.cookie=a+"="+o+";expires="+i.toGMTString()+";path=/"}document.cookie="ABTest_Session=1;path=/"}})}}catch(o){}setTimeout(function(){document.getElementsByTagName("html")[0].style.display="block"},900),setTimeout(function(){var e=document.getElementById("_abtest_path_hides");null!==e&&e.parentElement.removeChild(e)},800)},runJS:function(js,callback){this.jQueryLoaded(function(){eval(js),callback()})},runCSS:function(e){var t=document.createElement("style");t.type="text/css",t.styleSheet?t.styleSheet.cssText=e:t.appendChild(document.createTextNode(e)),document.getElementsByTagName("head")[0].appendChild(t)},jQueryLoaded:function(e){var t=setInterval(function(){"undefined"!=typeof jQuery&&(clearInterval(t),e())},10);setTimeout(function(){"undefined"==typeof jQuery&&console.warn("Jquery didnt load on time!"),clearInterval(t)},600)},getCookies:function(){var e=document.cookie.split(";").filter(function(e){return 0===e.trim().indexOf("_ABTest")}).map(function(e){return e.trim()});return JSON.stringify(e)},getParameters:function(e){for(var t={},n=window.location.search.substring(1),a=n.split("&"),i=0;a.length>i;i++){var o=a[i].split("=");if(t[o[0]]===undefined)t[o[0]]=decodeURIComponent(o[1]);else if("string"==typeof t[o[0]]){var r=[t[o[0]],decodeURIComponent(o[1])];t[o[0]]=r}else t[o[0]].push(decodeURIComponent(o[1]))}return t[e]===undefined?null:t[e]}}}(window,document);window.ABTest=window.$_ABTest=ABTest;