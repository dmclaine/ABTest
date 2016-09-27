/*
 var cookieObj = {};
 document.cookie.split(';').forEach(function(str){
 var arr = str.split('=');
 cookieObj[arr[0].trim()] = arr[1].trim();

 })
 $.get('http://localhost:3001/running?account_id=1&url='+document.location.href+'&c=' + decodeURIComponent(JSON.stringify(cookieObj)))
 */

/**
 *
 * @returns {{criteria: {}, userBrowserInfo: {}, getOutput: getOutput, match: match, setCampaignCriteria: setCampaignCriteria, matchUrl: matchUrl, matchDevice: matchDevice, matchBrowser: matchBrowser, matchGeographic: matchGeographic, matchCookie: matchCookie, matchUser: matchUser, matchIP: matchIP, matchLanguage: matchLanguage, removeLastSlash: removeLastSlash}}
 * @constructor
 */

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
            console.log(matches,run);

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


module.exports = TargetMatcher;