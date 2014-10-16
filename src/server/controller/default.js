var express = require('express');
var cla = require('./../api/cla');

//////////////////////////////////////////////////////////////////////////////////////////////
// Default router
//////////////////////////////////////////////////////////////////////////////////////////////

var router = express.Router();

// router.use('/accept', function(req, res) {
router.use('/accept/:owner/:repo', function(req, res) {
	req.args = {owner:req.params.owner, repo:req.params.repo};

    if (req.isAuthenticated()) {
		cla.sign(req, function(){
			res.redirect('/' + req.args.owner + '/' + req.args.repo);
		});

    } else {
		req.session.next = req.baseUrl;
		return res.redirect('/login');
    }
});

router.all('/login', function(req, res){
	return res.sendFile('login.html', {root: __dirname + './../../client'});
});

router.all('/*', function(req, res) {
    return res.sendFile('home.html', {root: __dirname + './../../client'});
});

module.exports = router;
