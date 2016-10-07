var ABTest = (function (window, document, undefined) {
    
    //var host = "https://webtimize.info/client/";
    
    var snippetParams = null;

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
            window.console && console.log(e);
        }
    };


    return {
        changes: [],
        preview: false,
        host_name: 'http://localhost:3000/',
        documentUrl: null,
        executed: false,
        snippetParams: null,
        loadjQuery: function() {
            console.warn("Feature to be added - To load jquery");
        },
        storeVariations: function(data) {
            localStorage.setItem('variations',data);
        },
        getVariations: function() {
            return localStorage.getItem('variations');
        },
        setDocumentUrl: function() {
            var documentUrl = document.location.href.replace(document.location.search,'');
            this.documentUrl = this.removeLastSlash(documentUrl);
        },
        // for each experiment, load a variant if already saved for this session, or pick a random one
        init: function (accountId,params) {
            
            snippetParams = params;

            this.setDocumentUrl();

            if(this.getParameters('_ab_preview') == "1" && this.getParameters('exp_id') != "" && this.getParameters('variation') != "") {
                var cookie = '_ABTest_exp_' + this.getParameters('exp_id') + '_inc=' + this.getParameters('variation');
                this.getPreview(accountId,cookie);
            }else{
                this.getLive(accountId);
            }
        },
        getLive: function(accountId) {
            var self = this;
            var variations = self.getVariations();
            self.executed = false;
            if(variations !== null) {
                self.execute(variations);
                document.getElementsByTagName('html')[0].style.display = "block"
            }
        
            $ajax({
                url: self.host_name + "campaign?account_id="+ accountId +"&url=" + encodeURIComponent(self.documentUrl) + "&c=" + (this.getCookies()),
                //dataType: 'json',
                success: function (data) {

                    //if(data == "[]") {
                    self.storeVariations(data);
                    //}

                    if(!self.executed && data != "[]") {
                        self.execute(data);
                    }
                    
                }
            });
        },
        removeLastSlash: function(str) {
            
            if(typeof str == "string" && str.substr(-1) === '/') {
                str =  str.substr(0, str.length - 1);
            }
            return str;
        },
        runTest: function(test_url_array) {

            var host_url = this.documentUrl;

            for(var i=0; i< test_url_array.length; i++) {

                var url = this.removeLastSlash(test_url_array[i]);
                var url1 = url.replace(/\//g,"\\/");
                var reg_url = "/" + url1 + "/";
                if(url == host_url) { 
                        return true;
                    }
                    else if(host_url.match(reg_url)) { 
                        return true;
                    }
                }

                return false;
        },
        getPreview: function(accountId,cookie) {
            var self = this;
            self.preview = true;
            $ajax({
                url: self.host_name + "campaign?preview=1&account_id="+ accountId +"&url=" + encodeURIComponent(self.documentUrl) + "&c=[\""+cookie+"\"]",
                success: function (data) {
                    self.execute(data);
                    
                }
            });
        }, 
        execute: function(data) {
            var self = this;
            try {
                if(data != "") {
                    var out = JSON.parse(data);
                    var d = new Date();
                    d = new Date(d.getTime() + 1000 * 60 * 60 * 24 * 100);

                    out.map(function (item) {

                        if(self.runTest(item.test_url)) {
                            
                            if(self.preview) 
                            {
                               run(self,item); 
                            }
                            else
                            {
                                if(item.participate) {
                                    var cookieName = "_ABTest_exp_" + item.experiment + "_inc";
                                    var cookieValue = item.vid;
                                    run(self,item,cookieName,cookieValue);
                                    
                                }else{
                                    var cookieName = "_ABTest_exp_" + item.experiment + "_exc";
                                    var cookieValue = 1;
                                    document.cookie = cookieName + '=' + cookieValue + ';expires=' + d.toGMTString() + ';path=/';
                                }
                                document.cookie = "ABTest_Session=1;path=/";
                            }
                        }


                    });

                    function run(self,item,cookieName,cookieValue) {
                        self.runJS(item.js, function(){
                            self.runCSS(item.css);
                            self.executed = true;
                            self.storeVariations(data);
                            GTMPush(item.experiment, item.name);
                            document.cookie = cookieName + '=' + cookieValue + ';expires=' + d.toGMTString() + ';path=/';
                        });
                        
                        document.getElementsByTagName('html')[0].style.display = "block";
                    }
                }
            } catch (e) {
                // not json
            }
            
            setTimeout(function(){document.getElementsByTagName('html')[0].style.display = "block";},900);
            setTimeout(function(){
                var elem = document.getElementById("_abtest_path_hides");
                if(elem !== null) {
                    elem.parentElement.removeChild(elem);
                }
            },800);
                
        },
        runJS: function (js,callback) {

            this.jQueryLoaded(function () {
                eval(js);
                callback();
            })
        },
        runCSS: function (css) {
            var styleElement = document.createElement("style");
            styleElement.type = "text/css";
            if (styleElement.styleSheet) {
                styleElement.styleSheet.cssText = css;
            } else {
                styleElement.appendChild(document.createTextNode(css));
            }
            //css.innerHTML = css;
            document.getElementsByTagName("head")[0].appendChild(styleElement);
        },
        jQueryLoaded: function (callback) {
            var t = setInterval(function () {
                if (typeof jQuery !== "undefined") {
                    clearInterval(t);
                    callback();
                }
            }, 10);

            setTimeout(function () {
                if (typeof jQuery === "undefined") {
                    console.warn("Jquery didnt load on time!");
                }
                clearInterval(t);
            }, 600);
        },
        getCookies: function () {
            var cookieArr = document.cookie.split(';').filter(function (c) {
                return c.trim().indexOf('_ABTest') === 0;
            }).map(function (c) {
                return c.trim();
            });

            return JSON.stringify(cookieArr);
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