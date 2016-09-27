var pool = require('../config/mysql.config');
var PHPUnserialize = require('php-unserialize');
module.exports = {

	getActiveCampaigns: function(account_id,domain,preview,callback) {

		var self = this;
		var matches = domain.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
		domain = matches && matches[1];
		domain = domain.replace('www.','');
		pool.getConnection(function(err, connection){
			var status = (preview) ? "":" AND status = 1 ";
			connection.query('SELECT id,name,test_url,traffic_per,variations,status FROM campaigns WHERE account_id='+account_id+' AND domain=? ' + status ,domain, function(err, rows) {
				if (err) throw err;
				connection.release();
				var result = [];

				for(var i=0; i< rows.length; i++) {
					var campaign = rows[i];

					var variation = [];
					try {
						variation = PHPUnserialize.unserialize(campaign.variations);
					}
					catch(e) {
						variation = [];
					}

					result.push({
						id   	   :  campaign.id,
						variations :  variation,
		                traffic    :  parseInt(campaign.traffic_per)/100,
		                campaign   :  campaign.name,
		                active     :  campaign.status,
		                test_url   :  JSON.parse(campaign.test_url)
					});
				}

				callback(result);
			});
			
		});
	},
	storeTracker: function(client_id,participate,msg) {

		pool.getConnection(function(err, connection){
			
			
			 	connection.query('SELECT id FROM tracker WHERE client_id=?',client_id, function(err, rows) {
			 		if (err) throw err;
			 		if(rows.length === 0) 
			 		{
						connection.query('INSERT INTO tracker (client_id, participate,msg) VALUES (?,?,?)',[client_id,participate,msg],function(err, rows) {
							if (err) throw err;

							connection.release();
						});
					}
					else
					{
						connection.release();
			 		}

			 	});
			
			
		});
	}
}