var UaParser = require('ua-parser');
var locale = require("locale");
var getIP = require('ipware')().get_ip;
var geoip = require('geoip-lite');
var MobileDetect = require('mobile-detect');

var BrowserInfo = function(req) {

    //req.headers['user-agent']
    var UA = req.headers['user-agent'];
    var info = {};

    /* URL data */
    info.urlData = {
        url: req.query.url,
        referrer: req.headers['referer']
    }


    /* Browser Name */
    var parser = UaParser.parse(UA);
    info.browserName = parser.ua.family;

    /* Browser Language */
    info.languages = locale.Locale["default"];

    /* Get IP*/
    info.ip = getIP(req).clientIp;

    /* Get Location */
    var geo = geoip.lookup((info.ip == '::1') ? '127.0.0.1': info.ip);
    if(geo && geo.country) {
        info.geo = geo.country;
    }

    /* Device */
    var md = new MobileDetect(UA);

    info.device = 'desktop';

    if(md.phone() !== null || md.mobile() !== null) {
        info.device = 'phone';
    }else if(md.tablet() !== null) {
        info.device = 'tablet';
    }

    /* Cookies */
    if(req.query.c) {
        info.cookies = JSON.parse(req.query.c);
    }

    return info;
}

module.exports.getInfo = BrowserInfo;