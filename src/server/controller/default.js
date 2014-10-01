var express = require('express');

//////////////////////////////////////////////////////////////////////////////////////////////
// Default router
//////////////////////////////////////////////////////////////////////////////////////////////

var router = express.Router();

router.all('/*', function(req, res) {

    if (req.isAuthenticated()) {
        return res.sendFile('home.html', {root: __dirname + './../../client'});
    }

    req.session.next = req.url;

    return res.sendFile('login.html', {root: __dirname + './../../client'});

});

module.exports = router;
