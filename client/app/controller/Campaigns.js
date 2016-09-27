var CampaignModel = require('../model/CampaignModel');

/*-----------------------------------------------------------------------------------------------------------------------------
 | 
 | Flow:
 | 1. Get all the campaigns that are active.
 | 2. Check if any cookie value has been received
 | 3. From 1, collect the compaigns that are running parallely for a particular url (compares urls)
 | 4. Generate Random number & assign probability to each parallelly running campaign
 | 5. Loop through each relevant campaign and check if user should be a part of the experiment.
 | 		a. If user is already a part of experiment (cookie check), then return that variation
 |		b. If the user is new, then based on probablity of participation (traffic distribution), assign a cookie.
 |      c. If the user has been excluded from one exp, then check the probablity of this user 
 |         participating in parallely running experiment
 | 6. Based on step 5, either 
 |      a. Return the variation, the user was bucketed into
 |      b. Check the traffic split between variations and assign a variation
 |      c. Do nothing (excluded from experiments)
 |------------------------------------------------------------------------------------------------------------------------------
 | Preview:
 | http://dev.ehdoc/?_ab_preview=1&exp_id=19&variation=c00&_ab_preview_end
 | http://localhost:3000/test?url=http://dev.ehdoc/&c=[]&domain=dev.ehdoc&account_id=1&users=1000
 |------------------------------------------------------------------------------------------------------------------------------
 | Test New User Participation:
 | http://localhost:3000/campaign?url=http://dev.ehdoc/&c=[]&account_id=1
 |------------------------------------------------------------------------------------------------------------------------------
 | Force Test Variation:
 | http://localhost:3000/campaign?url=http://dev.ehdoc/&c=["_ABTest_exp_19_inc=c00"]
/*-----------------------------------------------------------------------------------------------------------------------------*/


var Campaigns = function(req,callback) {

	var campaign = {

		traffic:0, variations:[], campaign:{}, collect:{},host_url:"",preview:false,

		init: function() {

			if(req.url === "undefined") return [];

	    	this.host_url = decodeURIComponent(req.url);

	    	this.cleanPreviewURL();

	        this.domain = decodeURIComponent(req.url);
	        
	        this.account_id = req.account_id;

	        var output = [];

	        if(typeof this.account_id == "undefined" || typeof this.domain == "undefined" || typeof this.host_url == "undefined") {
	    		output.push({error: "Parameter account_id, domain and url are mandatory"});
	    		callback(output);
	    		return;
	    	}

	    	var self = this;

	    	var random = Math.random();

	    	/*--------------------------------------------------------
	    	 | Step 1: Get all the campaigns that are active
	    	 --------------------------------------------------------*/
	    	this.getCampaigns(function(allCampaigns){

	    		var http_cookie = req.c;
	    		
	    		var client_id = req.client_id;

	    		var cookies = self.parseCookie(http_cookie);

		    	/*--------------------------------------------------------
		    	 | Step 3: Get all the parallely running campaigns
		    	 --------------------------------------------------------*/
		    	var campaigns = self.getParallelCampaigns(allCampaigns);

		    	var totalCampaigns = campaigns.length;

		    	var campaignProbability = 1/totalCampaigns;

	    		var campaignBoundary = {
		    		r: random,
		    		lower: 0,
		    		upper: campaignProbability
		    	};

		    	for(var i=0; i < totalCampaigns; i++) {
		    		
		    		var campaign = campaigns[i];

		    		/*--------------------------------------------------------
			    	 | Step 4: Assign probability 
			    	 --------------------------------------------------------*/
		    		campaignBoundary.lower = campaignProbability * i;
		    		campaignBoundary.upper = campaignBoundary.lower + campaignProbability;

		    		self.resetCollect();

		    		self.setCampaignValues(campaign);

			        self.totalVariations = self.variations.length;
			        
			        self.setCollect('experiment',campaign.id);

			        self.setCollect('test_url',campaign.test_url);
			        
			        self.setCollect('participate',0);

			        /*--------------------------------------------------------
			    	 | Store the campaign
			    	 --------------------------------------------------------*/
			        if(self.userInExperiment(cookies,campaign.id,campaignBoundary,client_id)) {
			        	
			        	self.setCollect('participate',1);
			            //set variation
			            self.setVariation(cookies,campaign.id);
			            output.push(self.collect);
			            break;
			        }else{

			        	output.push(self.collect);
			        }
				}
				callback(output);
			});
		},
		getParallelCampaigns: function(campaigns) {
			
			var totalCampaigns = campaigns.length;

	  		var self = this;
	    	var pCampaigns = [];

	    	for(var i=0; i < totalCampaigns; i++) {
	    		var campaign = campaigns[i];
		        var runTest = self.runTest(campaign.test_url);
		        if(runTest) {
		        	pCampaigns.push(campaign);
		        }
	    	}

	    	return pCampaigns;

		},

		cleanPreviewURL: function() {

			if(this.host_url.match(/(\?|&)_ab_preview.*_ab_preview_end/) !== null) {
				this.preview = true;
				this.host_url = this.host_url.replace(/(\?|&)_ab_preview.*_ab_preview_end/, '');
			}

	    	if(req.preview !== "undefined" && req.preview == 1) {
	    		this.preview = true;
	    	}
			
		},

		runTest: function(test_url_array) {

			var host_url = this.removeLastSlash(this.host_url);

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

		setVariation: function(cookies, experimentID) {

			var variations = (campaign.variations);

			if(cookies['_ABTest_exp_'+experimentID+'_inc'] !== undefined) {
    		
	    		var variation_id = cookies['_ABTest_exp_'+experimentID+'_inc'];

	    		campaign.setCollect("vid",variation_id);

    			
	    		for(var i in variations) {

	    			var value = variations[i];
		        	if(value.id === variation_id) {
		        		campaign.setCollect("js",value.js);
		        		campaign.setCollect("css",value.css);
		        		campaign.setCollect("name",value.name);
		        		return;
		        	}
		        }

	    	}else{

		        var R = Math.random();
		        
		        var previousFactor = 0;
	        	
		        for(var i in variations) {

		        	var value = variations[i];
		        	
		        	if(value.factor > 0) 
		        	{
		        		var currentFactor = parseFloat(value.factor) + previousFactor;
		        		
			            if(R > previousFactor && R <= currentFactor) {
			                campaign.setCollect("vid",value.id);
			                campaign.setCollect("js",value.js);
			                campaign.setCollect("css",value.css);
			        		campaign.setCollect("name",value.name);
			                return;
			            }
			            previousFactor = currentFactor;
			        }
			        
		        }
		    }
		},

		userInExperiment: function(cookies,experimentID,cb,client_id) { 

			var cookie_inc = cookies['_ABTest_exp_'+experimentID+'_inc'];
			var cookie_exc = cookies['_ABTest_exp_'+experimentID+'_exc'];

			/*--------------------------------------------------------
	    	 | Step 5a: 
	    	 | If user is already a part of this experiment (cookie check), 
	    	 | then return true.
	    	 --------------------------------------------------------*/
	    	if(cookie_inc !== undefined) {
	    		return true;
	    	}
	    	
	    	/*--------------------------------------------------------
	    	 | Step 5c: 
	    	 | If user is excluded from this exp, he definately cant be
	    	 | a part of this experiment, ever!
	    	 --------------------------------------------------------*/
	    	if(Object.keys(cookies).length > 0 && cookie_exc !== undefined) {
	    		return false;
	    	}

	    	/*--------------------------------------------------------
	    	 | Step 5b: 
	    	 | If user is new, check the probability of participation 
	    	 | in this experiment
	    	 --------------------------------------------------------*/
	    	
	    	random = Math.random();

	    	if(cb.r > cb.lower && cb.r <= cb.upper) {

	    		//traffic allowed in this experiment
	    		// if traffic allowed is 0.2(20%) and the random number is 
	    		// 0.4 - cannot participate
	    		// 0.18 - can participate
	    		traffic = this.traffic;
		        if(traffic > 0 ) {
		            return (random > traffic) ? 0 : 1;
		        }
	    	}
	        
	        return false;
	    },

	    setCollect: function(key,value) {
	    	if(campaign.collect === null)campaign.collect = {};
	        campaign.collect[key] = value;
	    },

	    resetCollect: function() {
	    	this.traffic = 0;
	    	this.variations = [];
	    	this.users = 0;
	    	this.campaign = "";
	    	this.collect = null;
	    },

	    getCampaigns: function(callback) {
			CampaignModel.getActiveCampaigns(this.account_id,this.domain,this.preview,function(data){
				callback(data);
			});
	    },

	    parseCookie: function(string) {

	    	if(string == "") return [];
	    	try {
	    		var arr = JSON.parse(string);
	    	}
	    	catch(e) {
	    		var arr = [];
	    	}
	    	var result = [];

	    	for(var i=0; i< arr.length; i++) {
	    		var cookie = arr[i];
	    		keyvalue = cookie.split("=");
	    		result[keyvalue[0]] = keyvalue[1];
	    	}
	        return result;
	    },

	    setCampaignValues: function(campaign) {
	    	this.campaign = campaign.campaign;
	    	this.traffic = campaign.traffic;
	    	this.variations = campaign.variations;
	    },
	    removeLastSlash: function(str) {
	    	
	    	if(typeof str == "string" && str.substr(-1) === '/') {
		        str =  str.substr(0, str.length - 1);
		    }
		    return str;
	    }
	}

	campaign.init();

}


module.exports.init = Campaigns;