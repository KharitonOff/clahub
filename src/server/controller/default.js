var express = require('express');
var cla = require('./../api/cla');

//////////////////////////////////////////////////////////////////////////////////////////////
// Default router
//////////////////////////////////////////////////////////////////////////////////////////////

var router = express.Router();

router.use('/accept/:owner/:repo', function(req, res) {

    if (req.isAuthenticated()) {
		req.args = {owner:req.params.owner, repo:req.params.repo};

		cla.sign(req, function(err,data){
			if(err) {
				return res.status(500).send(err);
			}
			if (data) {
				// res.status(200).send(data);
				res.redirect(data);
			}
		});

    } else {
		req.session.next = req.baseUrl;
		res.status(200).send('/login');
    }
});

router.all('/login', function(req, res){
	return res.sendFile('login.html', {root: __dirname + './../../client'});
});

router.all('/*', function(req, res) {
    return res.sendFile('home.html', {root: __dirname + './../../client'});
});

module.exports = router;
