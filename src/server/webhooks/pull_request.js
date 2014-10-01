// models
var User = require('mongoose').model('User');
var CLA = require('mongoose').model('CLA');
// services
var github = require('../services/github');
//api
var cla = require('../api/cla');

//////////////////////////////////////////////////////////////////////////////////////////////
// Github Pull Request Webhook Handler
//////////////////////////////////////////////////////////////////////////////////////////////

module.exports = function(req, res) {
	var pull_request = req.args.pull_request;

	if(req.args.action === 'opened') {
		User.remove();
		User.findOne({ uuid: pull_request.user.id }, function(err, user) {
			if (err) {
				console.log(err);
				return;
			}

			if(user) {
				user.requests.push({
					id:pull_request.id,
					url:pull_request.url,
					sha:pull_request.head.sha,
					repo:pull_request.base.repo
				});
			} else {
				user = new User({
					uuid: pull_request.user.id,
					requests:[{
						id:pull_request.id,
						url:pull_request.url,
						sha:pull_request.head.sha,
						repo:pull_request.base.repo
					}]
				});
			}

			user.save(function (error) {
				if (!error) {
					cla.updateStatus({
						args:{
							user: pull_request.user.id,
							repo: pull_request.base.repo,
							sha: pull_request.head.sha
						}},null);
				}
			});

		});
	}

  if(req.args.action === 'synchronize') {

  }

	res.status(200).send('OK');
};
