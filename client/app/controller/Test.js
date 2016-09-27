var Campaigns = require('./Campaigns');

var Test = function(req,callback) {

	var users = req.users;
	var test = {

		collect: {users: parseInt(users),participants: 0, traffic: 0},
		init: function() {
			var self = this;
			
			Campaigns.init(req, function(data){
				var data = data[0];
				users -= 1;
				if(typeof data != "undefined" && data.participate == 1) {
					self.collect.participants += 1;
					if(typeof self.collect[data.vid] === "undefined") {
						self.collect[data.vid] = {};
						self.collect[data.vid].name = data.name;
						self.collect[data.vid].count = 1;
					}else{
						self.collect[data.vid].count += 1;
						self.collect[data.vid].percentage = (self.collect[data.vid].count/self.collect.participants) *100;
						
					}
				}
				if(users > 0) {
					self.init();
					
				}else{
					self.collect.traffic = (self.collect.participants/req.users) * 100;
					callback(self.collect);
				}

			})
		}
	}
	test.init();

}

module.exports.init = Test;