// *****************************************************
// Home Controller
//
// tmpl: home.html
// path: /
// *****************************************************

module.controller('HomeCtrl', ['$rootScope', '$scope', '$state', '$stateParams', '$HUB', '$RPC', '$RAW', '$window',
    function($rootScope, $scope, $state, $stateParams, $HUB, $RPC, $RAW, $window) {

        $scope.repos = [];

        $scope.logAdminIn = function(){
            $window.location.href = '/auth/github?admin=true';
        };

        $scope.$on('user', function(event, data){
            if ($rootScope.user.value && $rootScope.user.value.admin) {
                $HUB.call('repos', 'getAll', {user:$rootScope.user.value.login}, function(err, res){
                    if (err) {
                        return;
                    }
                    $scope.repos = res.value;
                });
            }
        });

        $scope.setting = function() {
            var modal = $modal.open({
                templateUrl: '/modals/templates/setting.html',
                controller: 'SettingCtrl'
            });
        };
        // $RPC.call('cla', 'getPullRequests', {}, function(err, data) {
        //     if(!err) {

        //         $scope.hasRequests = !!data.value.requests.length;

        //         data.value.requests.forEach(function(url) {
        //             $RAW.get(url, function(err, pullRequest) {
        //                 if(!err) {
        //                     $scope.pullRequests.push(pullRequest);
        //                 }
        //             });
        //         });
        //     }
        // });

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
