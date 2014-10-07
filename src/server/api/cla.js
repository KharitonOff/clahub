// module
var merge = require('merge');
var path = require('path');
// models
// var CLA = require('mongoose').model('CLA');
var User = require('mongoose').model('User');
//services
var github = require('../services/github');
var url = require('../services/url');
var cla = require('../services/cla');
var status = require('../services/status');

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

		var args = {repo: req.args.repo, user: req.user.id};

		cla.check(args,function(err, signed){
			if (!err && !signed) {
				cla.create(args, function(){
					User.findOne({uuid:req.user.id}, function(err, user){
						if (!err) {
							var number;
							var repo;
							// to do: remove updated requests
							user.requests.forEach(function(request){
								status.update({
									user: req.user.id,
									owner: req.args.owner,
									repo_uuid: request.repo.id,
									repo: request.repo.name,
									sha: request.sha
								},null);
								repo = request.repo.name;
								number = request.number;
							});

							done(err, url.githubPullRequest(req.args.owner, repo, number));
						} else {
							done(err);
						}
					});
				});
			}
		});
    }
};
