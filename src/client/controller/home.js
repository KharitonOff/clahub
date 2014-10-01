// *****************************************************
// Home Controller
//
// tmpl: home.html
// path: /
// *****************************************************

module.controller('HomeCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$HUB', '$RPC', '$RAW',
    function($rootScope, $scope, $state, $stateParams, $HUB, $RPC, $RAW) {

        $scope.pullRequests = [];

        $scope.hasRepos = true;

        $RPC.call('cla', 'getPullRequests', {}, function(err, data) {
            if(!err) {

                $scope.hasRequests = !!data.value.requests.length;

                data.value.requests.forEach(function(url) {
                    $RAW.get(url, function(err, pullRequest) {
                        if(!err) {
                            $scope.pullRequests.push(pullRequest);
                        }
                    });
                });
            }
        });

        // //
        // // NOTE:
        // //  if ever a user has over 100 orgs
        // //  we will have to address this problem
        // //
        // $scope.orgs = $HUB.call('user', 'getOrgs', {
        //     per_page: 100
        // });

        //
        // Actions
        //

    }
]);
