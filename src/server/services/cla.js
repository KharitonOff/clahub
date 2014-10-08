var CLA = require('mongoose').model('CLA');

var guid = function(){
	return 'xxxxxxxxxxxxx'.replace(/[x]/g, function(c) {
		var r = Math.floor(Math.random() * 10);
		return r.toString();
	});
};

module.exports = {
    check: function(args, done) {
		CLA.findOne({repo:args.repo, user:args.user, href:config.terms}, function(err, cla){
            done(err, !!cla);
        });
    },
    create: function(args, done){
		var now = new Date();

		var cla = new CLA({uuid:guid(), repo: args.repo, user: args.user, created_at:now});
		cla.save(done);
    }
};
