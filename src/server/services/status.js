var url = require('./url');
var github = require('./github');
var cla = require('./cla');
module.exports = {
    update: function(args, done) {

        var status = 'pending';
        var description = "You haven't sign our CLA yet. Please accept the CLA in order to get your pull request merged.";


        cla.check({repo:args.repo_uuid, user:args.user}, function(err, claSigned){
            if (!err & claSigned) {
                status = 'success';
                description = 'CLA is accepted.';
            }

            github.call({
                obj: 'statuses',
                fun: 'create',
                arg: {
                    user: args.owner,
                    repo: args.repo,
                    sha: args.sha,
                    state: status,
                    description: description,
                    target_url: url.claURL(args.owner, args.repo_uuid)
                },
                token: config.server.github.token
            }, null);
        });
    }
};
