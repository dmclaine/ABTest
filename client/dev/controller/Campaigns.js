var CampaignModel = require('../model/CampaignModel');

var Campaigns = function(req,callback) {

	return {

		getCampaigns: function(data, callback)
		{
			return CampaignModel.getCampaigns(data, function(data){
				callback(data);
			})
		},

		getCampaignById: function(data,callback)
		{
			return CampaignModel.getCampaignById(data, function(data){
				callback(data);
			})
		}
	}

}
module.exports.init = Campaigns;