var ABTest = (function (window, document, undefined) {

    //unserialize
    !function(a,b){"use strict";"function"==typeof define&&define.amd?define([],b):"object"==typeof exports?module.exports=b():a.phpUnserialize=b()}(this,function(){"use strict";return function(a){var e,b=0,c=[],d=0,f=function(){var c=a.indexOf(":",b),d=a.substring(b,c);return b=c+2,parseInt(d,10)},g=function(){var c=a.indexOf(";",b),d=a.substring(b,c);return b=c+1,parseInt(d,10)},h=function(){var a=g();return c[d++]=a,a},i=function(){var e=a.indexOf(";",b),f=a.substring(b,e);return b=e+1,f=parseFloat(f),c[d++]=f,f},j=function(){var e=a.indexOf(";",b),f=a.substring(b,e);return b=e+1,f="1"===f,c[d++]=f,f},k=function(){for(var g,h,c=f(),d=0,e=0;e<c;)g=a.charCodeAt(b+d++),g<=127?e++:e+=g>2047?3:2;return h=a.substring(b,b+d),b+=d+2,h},l=function(){var a=k();return c[d++]=a,a},m=function(){var c=a.charAt(b);return b+=2,c},n=function(){var a=m();switch(a){case"i":return g();case"s":return k();default:throw{name:"Parse Error",message:"Unknown key type '"+a+"' at position "+(b-2)}}},o=function(){var k,l,m,o,p,a=f(),g=[],h={},i=g,j=d++;for(c[j]=i,m=0;m<a;m++)if(k=n(),l=e(),i===g&&parseInt(k,10)===m)g.push(l);else{if(i!==h){for(o=0,p=g.length;o<p;o++)h[o]=g[o];i=h,c[j]=i}h[k]=l}return b++,i},p=function(a,b){var c,d,e;return"\0"!==a.charAt(0)?a:(e=a.indexOf("\0",1),e>0?(c=a.substring(1,e),d=a.substr(e+1),"*"===c?d:b===c?d:c+"::"+d):void 0)},q=function(){var a,j,l,m,g={},h=d++,i=k();for(c[h]=g,a=f(),m=0;m<a;m++)j=p(n(),i),l=e(),g[j]=l;return b++,g},r=function(){var a=k(),b=k();return{__PHP_Incomplete_Class_Name:a,serialized:b}},s=function(){var a=g(),b=c[a-1];return c[d++]=b,b},t=function(){var a=g();return c[a-1]},u=function(){var a=null;return c[d++]=a,a};return(e=function(){var a=m();switch(a){case"i":return h();case"d":return i();case"b":return j();case"s":return l();case"a":return o();case"O":return q();case"C":return r();case"r":return s();case"R":return t();case"N":return u();default:throw{name:"Parse Error",message:"Unknown type '"+a+"' at position "+(b-2)}}})()}});

    var snippetParams = null;
    var TIME_START = Date.now();

    var LOG = function(msg, type) {
        if(typeof type == 'undefined'){
            type='log';
        }
        if(document.location.search.indexOf('debug=abtest') > 0) {
            console[type](msg);
        }
    }

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
            LOG(e);
        }
    };

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
         | Step 5a:
         | If user is already a part of this experiment (cookie check),
         | then return true.
         --------------------------------------------------------*/
        if(cookie_inc !== undefined) {
            return out;
        }

        /*--------------------------------------------------------
         | Step 5c:
         | If user is excluded from this exp, he definately cant be
         | a part of this experiment, ever!
         --------------------------------------------------------*/
        if(Object.keys(browserInfo.cookies).length > 0 && cookie_exc !== undefined) {
            out.participate = false;
            out.included = 0;
            return out;
        }

        /*--------------------------------------------------------
         | Step 5b:
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
                var reason = {};
                for(var criteria in matches) {
                    if(matches[criteria].run == 0) {
                        run = 0;
                        reason[criteria] = matches[criteria];
                        break;
                    }
                }
                return {
                    matches: matches,
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
                        var firstChar = url.charAt(0);
                        var lastChar = url.charAt(url.length);
                        if(firstChar == '/' && lastChar == '/') {
                            if(host_url.match(url)) {
                                output = self.getOutput(true, 'url_matched', url, 1);
                                return;
                            }
                        }else if(self.removeLastSlash(url) == host_url) {
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
                var phone = this.criteria.device.allow_mobile == "true";
                var userDevice = this.userBrowserInfo.device;

                if (desktop && userDevice == 'desktop') {
                    output = this.getOutput(true, 'device_check', userDevice, 1);
                    return output;
                }

                if (phone && userDevice == 'phone') {
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
                        if (browser.hasOwnProperty(name) && browser[name] == "false") {
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

                //exclude cookie
                if (this.criteria.cookie.exclude_cookie && this.criteria.cookie.exclude_cookie.length > 0) {
                    var excludes = this.criteria.cookie.exclude_cookie;
                    active = true;
                    excludes.forEach(function (name) {
                        if (userCookies[name]) {
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

                var userLang = this.userBrowserInfo.languages.toLowerCase();

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
                    return this.getOutput(true, 'script', null, 1);
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
        host_name: 'http://localhost:3000/',
        documentUrl: null,
        executed: false,
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
            snippetParams = params;

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
                            data.browserInfo.urlData.url = document.location.origin;
                            TargetMatcher.prototype.userBrowserInfo = data.browserInfo;

                            data.campaigns.forEach(function(campaign){
                                LOG(Date.now()-TIME_START + " : Checking if experiment will run now or next time");
                                var matchResult = self.willCampaignRun(campaign);
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
            }else{
                LOG(Date.now()-TIME_START + " : Experiments found in LocalStorage");
            }
            for(var campaign in campaigns) {
                self.execute(campaigns[campaign], function(status){
                    LOG(Date.now()-TIME_START + " : Executed experiment from LocalStorage");
                    totalCampaigns--;
                    if(totalCampaigns == 0) {
                        LOG(Date.now()-TIME_START + " : Getting latest updates from server and updating the client");
                        self.serverRequest(accountId);
                    }
                });
                //document.getElementsByTagName('html')[0].style.display = "block"
            }


        },
        campaignCleanUp: function(campaign) {
            if(typeof campaign == 'undefined') {
                for (var i=0;i < localStorage.length; i++) {
                    var key = localStorage.key(i);

                    if(key.indexOf('_ABTest_V-') === 0) {
                        localStorage.removeItem(key);
                    }
                }
            }else {
                localStorage.removeItem('_ABTest_V-' + campaign.campaign_id);
            }
        },
        willCampaignRun: function(campaign) {
            var matcher = new TargetMatcher();
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
                            data.browserInfo.urlData.url = document.location.origin;
                            TargetMatcher.prototype.userBrowserInfo = data.browserInfo;

                            data.campaigns.forEach(function(campaign){

                                var matchResult = self.willCampaignRun(campaign);
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
        execute: function(campaign,callback) {

            var self = this;
            try {
                if(this.executed) {
                    LOG(Date.now()-TIME_START + " : Syncing data between server and client");
                    self.storeVariations(campaign);
                    if(typeof callback == 'function') {
                        callback(true);
                    }
                }else{
                    run(self,campaign,callback);
                }

                function run(self,campaign,callback) {
                    var variation = campaign.variations[campaign.participationObj.var_id];
                    if(variation == undefined)
                    {
                        callback(status);
                        return;
                    }
                    LOG(Date.now()-TIME_START + " : Injecting Javascript");
                    self.runJS(variation.js, function(status){
                        LOG(Date.now()-TIME_START + " : Injecting CSS");
                        self.runCSS(variation.css);
                        self.executed = true;
                        if(!self.preview) {
                            self.storeVariations(campaign);
                            GTMPush(campaign.participationObj.campaign_id, variation.id);
                            self.setCookie('_ABTest_exp_' + campaign.participationObj.campaign_id + '_inc', campaign.participationObj.var_id);
                        }
                        if(typeof callback == 'function') {
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

            this.jQueryLoaded(function(status) {
                if(status) {
                    eval(js);
                }
                callback(status);
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