var ABTest = (function (window, document, undefined) {

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

    var TargetMatcher = function () {
        var userBrowserInfo = this.userBrowserInfo;

        return {

            criteria: {},
            userBrowserInfo: {},
            getOutput: function (matched, criteria, value, run) {
                return {
                    matched: matched,
                    criteria: criteria,
                    value: value,
                    run: run
                }
            },
            match: function (campaign) {
                this.userBrowserInfo = userBrowserInfo;
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
                for(var criteria in matches) {
                    if(matches[criteria].run == 0) {
                        run = 0;
                        break;
                    }
                }
                return {
                    matches: matches,
                    execute: run
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
                            output = self.getOutput(true, 'url_excludes', exclude, 0);
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
                            output = self.getOutput(true, 'url_includes', include, 1);
                            return;
                        }
                    })
                    if (output.hasOwnProperty('run')) return output;
                }

                //url matches
                if (this.criteria.url.url) {

                    var host_url = this.removeLastSlash(this.userBrowserInfo.urlData.url);
                    var urls = this.criteria.url.url;

                    urls.forEach(function (url) {
                        var url = self.removeLastSlash(url);
                        var url1 = url.replace(/\//g, "\\/");
                        var reg_url = "/" + url1 + "/";

                        if (url == host_url || host_url.match(reg_url)) {
                            output = self.getOutput(true, 'url_matched', url, 1);
                            return;
                        }
                    })
                    if (output.hasOwnProperty('run')) return output;
                }
                return self.getOutput(false, 'url_check', null, 0);
            },
            matchDevice: function () {

                var output = {
                    matched: false,
                    criteria: 'device_check',
                    run: 0
                };

                var desktop = this.criteria.device.allow_desktop == "true";
                var mobile = this.criteria.device.allow_mobile == "true";
                var userDevice = this.userBrowserInfo.device;
debugger;
                if (desktop && userDevice == 'desktop') {
                    output = this.getOutput(true, 'device_check', userDevice, 1);
                    return output;
                }

                if (mobile && userDevice == 'mobile') {
                    output = this.getOutput(true, 'device_check', userDevice, 1);
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

                                output = this.getOutput(true, 'browser_check', name, 0);
                                break;
                            }
                        }
                    }

                    if (output.hasOwnProperty('run')) return output;
                }
                return this.getOutput(false, 'browser_check', null, 1);
            },
            matchGeographic: function () {

            },
            matchCookie: function () {
                var self = this;
                var active = false;
                var userCookies = this.userBrowserInfo.cookies;
                var output = {};
                console.log(this.criteria.cookie.exclude_cookie);
                //exclude cookie
                if (this.criteria.cookie.exclude_cookie && this.criteria.cookie.exclude_cookie.length > 0) {
                    var excludes = this.criteria.cookie.exclude_cookie;
                    active = true;
                    excludes.forEach(function (name) {
                        console.log(name);
                        if (userCookies[name]) {
                            console.log(1);
                            output = self.getOutput(true, 'cookie_exclude', name, 0);
                            return;
                        }
                    })
                    if (output.hasOwnProperty('run')) return output;
                }

                //include cookie
                if (this.criteria.cookie.include_cookie && this.criteria.cookie.include_cookie.length > 0) {
                    var includes = this.criteria.cookie.include_cookie;
                    active = true;
                    includes.forEach(function (name) {
                        if (userCookies[name]) {
                            output = self.getOutput(true, 'cookie_include', name, 1);
                            return;
                        }
                    });
                    if (output.hasOwnProperty('run')) return output;
                }

                return (active) ? self.getOutput(false, 'cookies', null, 0) : self.getOutput(false, 'cookies', null, 1);
            },
            matchUser: function () {
                var self = this;
                var userCookies = this.userBrowserInfo.cookies;

                var active = false;
                var output = {};
                //include all users ?
                if (this.criteria.user['all_users'] == 'true') {
                    return self.getOutput(true, 'user_match', 'all_users', 1);
                }

                //only new users
                else if (this.criteria.user['new_users'] == 'true') {
                    active = false;
                    for (var name in userCookies) {

                        if (name.indexOf('_ABTest') >= 0) {
                            output = self.getOutput(true, 'user_match', 'new_user', 0);
                            break;
                        }
                    }
                    if (output.hasOwnProperty('run')) return output;
                }

                //only returning users
                else if (this.criteria.user['returning_users'] == 'true') {
                    console.log('3');
                    active = true;
                    for (var name in userCookies) {
                        if (name.indexOf('_ABTest') >= 0) {
                            output = self.getOutput(true, 'user_match', 'returning_user', 1);
                            break;
                        }
                    }
                    if (output.hasOwnProperty('run')) return output;
                }
                return (active) ? self.getOutput(false, 'user_match', null, 0) : self.getOutput(false, 'user_match', null, 1);

            },
            matchIP: function () {

                var userIp = '127.0.0.1';//this.userBrowserInfo.ip;

                var breakUserIp = userIp.split('.');
                var output = {};
                var self = this;

                //ip excludes
                if (this.criteria.ip.exclude_ips && this.criteria.ip.exclude_ips.length > 0) {
                    var excludes = this.criteria.ip.exclude_ips;

                    excludes.forEach(function (ip) {

                        var breakIp = ip.split('.');
                        if (breakIp.length > 0) {

                            output = self.getOutput(true, 'ip_excludes', ip, 0);

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


                            output = self.getOutput(true, 'ip_includes', ip, 1);

                            breakIp.forEach(function (ele, idx) {

                                if (ele != '*' && breakUserIp[idx] !== ele) {
                                    output = self.getOutput(false, 'ip_includes', ip, 0);
                                    return;
                                }
                            });
                        }
                    });
                    if (output.hasOwnProperty('run')) return output;
                }

                return self.getOutput(false, 'ip', null, 1);
            },
            matchLanguage: function () {

                var userLang = this.userBrowserInfo.languages.code.toLowerCase();

                var output = {};
                var self = this;

                //language excludes
                if (this.criteria.language.exclude_languages && this.criteria.language.exclude_languages.length > 0) {
                    var excludes = this.criteria.language.exclude_languages;

                    excludes.forEach(function (language) {

                        if (language.toLowerCase() == userLang) {
                            output = self.getOutput(true, 'lang_exclude', userLang, 0);
                            return;
                        }

                    });
                    if (output.hasOwnProperty('run')) return output;
                }
                //language includes
                if (this.criteria.language.allowed_languages && this.criteria.language.allowed_languages.length > 0) {

                    var includes = this.criteria.language.allowed_languages;

                    output = self.getOutput(false, 'lang_include', userLang, 0);

                    includes.forEach(function (language) {

                        if (language.toLowerCase() == userLang) {
                            output = self.getOutput(true, 'lang_include', userLang, 1);
                            return;
                        }

                    });
                    if (output.hasOwnProperty('run')) return output;
                }

                return self.getOutput(false, 'language', null, 1);

            },
            matchScript: function() {

                if(this.criteria.script.js == "") {
                    this.getOutput(false, 'script', null, 1);
                }

                if(eval(this.criteria.script.js)) {
                    return this.getOutput(true, 'script', null, 1);
                }
                return this.getOutput(false, 'script', null, 0);
            },
            removeLastSlash: function (str) {

                if (typeof str == "string" && str.substr(-1) === '/') {
                    str = str.substr(0, str.length - 1);
                }
                return str;
            }
        }

    }

    return {
        changes: [],
        preview: false,
        host_name: '$HOST_NAME',
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
                url: self.host_name + "running?account_id="+ accountId +"&url=" + encodeURIComponent(self.documentUrl),
                success: function (data) {
                    if(data) {
                        if(data.browserInfo) {
                            data.browserInfo.cookies = self.getAllCookies();
                            data.browserInfo.urlData.referrer = document.referrer;
                            TargetMatcher.prototype.userBrowserInfo = data.browserInfo;
                        }
                        if(data.campaigns) {
                            data.campaigns.forEach(function(campaign){
                                var matcher = new TargetMatcher();
                                var matchResult = matcher.match(campaign);
                                console.log(matchResult);
                            })
                        }
                    }


                    //self.storeVariations(data);
                    //if(!self.executed && data != "[]") {
                    //    self.execute(data);
                    //}
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
        getAllCookies: function() {
            var cookieObj = {};
            document.cookie.split(';').forEach(function(str){
                var arr = str.split('=');
                cookieObj[arr[0].trim()] = arr[1].trim();

            });
            return cookieObj;
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