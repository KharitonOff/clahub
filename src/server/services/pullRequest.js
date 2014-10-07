var url = require('./url');
var github = require('./github');

module.exports = {
    badgeComment: function(owner, repo, repoId, pullNumber) {
        // var badgeUrl = url.pullRequestBadge(repoId, pullNumber);
        var claUrl = url.claURL(owner, repoId);

        github.call({
            obj: 'issues',
            fun: 'createComment',
            arg: {
                user: owner,
                repo: repo,
                number: pullNumber,
                body: 'Please sign our CLA(' + claUrl + ')'
                // body: '[![ReviewNinja](' + badgeUrl + ')](' + pullUrl + ')'
            },
            token: config.server.github.token
        }, function(err, res, meta){
            console.log(err);
            console.log(res);
        });
    }
};
