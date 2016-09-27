var CampaignModel = require('../model/CampaignModel');

var Tracker = function(req,callback) {

	var test = {

		init: function() {
			CampaignModel.storeTracker(req.client_id,req.participate,req.msg);
		}
			
			
	}
	test.init();

}

module.exports.init = Tracker;