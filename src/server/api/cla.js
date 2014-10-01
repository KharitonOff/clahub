// module
var merge = require('merge');
var path = require('path');
// models
var CLA = require('mongoose').model('CLA');
var User = require('mongoose').model('User');
//services
var github = require('../services/github');
var url = require('../services/url');

var guid = function(){
	return 'xxxxxxxxxxxxx'.replace(/[x]/g, function(c) {
		var r = Math.floor(Math.random() * 10);
		return r.toString();
	});
};

module.exports = {
	get: function(req, done){
		done(null, {cla: {text:'text from server'}});
	},

    getPullRequests: function(req, done) {
		User.findOne({ uuid: req.user.id }, function(err, user) {
			if(user) {
				done(err, { requests: user.requests});
				return;
			}
			done(err, {});
		});
    },

    sign: function(req, done) {
		var now = new Date();
		var repoId = req.args.repo;
		var self = this;

		CLA.findOne({repo: repoId, user: req.user.id}, function(err, cla){
			if (err) {
				done(err,{});
				return;
			}

			if (!cla) {
				cla = new CLA({uuid:guid(), repo: repoId, user: req.user.id, created_at:now});
				cla.save(function(err){
					if (err) {
						done(err,{});
						return;
					}

					User.findOne({uuid:req.user.id}, function(err, user){
						if (!err) {
							user.requests.forEach(function(request){
								self.updateStatus({args:{
									user: user.uuid,
									repo: request.repo,
									sha: request.sha
								}},null);
							});
						}
					});
				});
			}
		});
    },

    updateStatus: function(req, done){
    	var status = 'pending';
		var description = "You haven't sign our CLA yet. Please accept the CLA in order to get your pull request merged.";

		CLA.findOne({repo:req.args.repo.id, user:req.args.user}, function(err, cla){
			if (err) {
				console.log(err);
				return;
			}

			if (cla) {
				status = 'success';
				description = 'CLA is accepted.';
			}
			github.call({
				obj: 'statuses',
				fun: 'create',
				arg: {
					user: req.args.repo.owner.login,
					repo: req.args.repo.name,
					sha: req.args.sha,
					state: status,
					description: description,
					target_url: url.claURL('xy', req.args.repo.id)
					// target_url: url.reviewPullRequest(args.user, args.repo, args.number)
				},
				token: 'af70aa0a29261749388e88bcde803400391c9739'
			}, null);
		});

    }
};
