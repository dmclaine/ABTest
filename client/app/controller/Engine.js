var CampaignModel = require('../model/CampaignModel');
var Browser = require('./BrowserInfo.js');
var Campaigns = require('./Campaigns.js').init();

var Engine = function(req,callback) {

	var output = {};
	var browserInfo = Browser.getInfo(req);
	var account_id = req.query.account_id;
	var preview = req.query.preview;

	if(preview == 1) {
		Campaigns.getCampaignById({cid: req.query.cid,preview: preview},initTargetting)
		return;
	}

	Campaigns.getCampaigns({account_id: account_id,preview: preview},initTargetting);

	function initTargetting(campaigns)
	{
		output.campaigns = campaigns;
		output.browserInfo = browserInfo;
		callback(output);
	}



}


module.exports.init = Engine;