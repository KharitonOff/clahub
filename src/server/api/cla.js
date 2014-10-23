// module
var fs = require('fs');
var request = require('request');

// models
var User = require('mongoose').model('User');

//services
var github = require('../services/github');
var url = require('../services/url');
var cla = require('../services/cla');
var status = require('../services/status');

module.exports = {
	get: function(req, done){
		github.call({
			obj: 'gists',
			fun: 'get',
			arg: {
				id: config.terms
			},
			token: config.server.github.token
		}, function(err, res){
			github.call({
				obj: 'markdown',
				fun: 'render',
				arg: {
					text: res.files[Object.keys(res.files)[0]].content
				},
				token: config.server.github.token
			}, function(err, result) {
				if (result.statusCode !== 200 && err){
					done(err);
				}
				done(null, {raw:result.data});
			});
		});
	},

    sign: function(req, done) {
		var now = new Date();
		var repoId = req.args.repo;
		var self = this;

		var args = {repo: req.args.repo, user: req.user.id, href:config.terms};

		cla.check(args,function(err, signed){
			if (!err && !signed) {
				cla.create(args, function(){
					User.findOne({uuid:req.user.id}, function(err, user){
						if (!err) {
							var number;
							var repo;

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

							user.requests.length = 0;
							user.save();

							done(err, url.githubPullRequest(req.args.owner, repo, number));
						} else {
							done(err);
						}
					});
				});
			} else if (signed) {
				done(null, url.githubBase);
			}
		});
    },

    check: function(req, done){
		var args = {repo: req.args.repo, user: req.user.id, href:config.terms};
		cla.check(args, done);
    },

    remove: function(req, done) {
		cla.remove(req.args, done);
    }
};
