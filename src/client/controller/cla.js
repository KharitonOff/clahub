// *****************************************************
// CLA Controller
//
// tmpl: cla.html
// path: /:repoId/:prId
// *****************************************************

module.controller( 'ClaController', ['$window', '$rootScope', '$scope', '$stateParams', '$RAW', '$RPC', '$modal', '$sce',
    function($window, $rootScope, $scope, $stateParams, $RAW, $RPC, $modal, $sce) {

        $scope.cla = {text: 'dummy text'};

        function getCLA () {
            $RPC.call('cla', 'get', {
                repo: $stateParams.repoId
            }, function(err, cla) {
                if(!err) {
                    $scope.claText = cla.value.raw;
                }
            });
        }

        getCLA();

        $scope.agree = function(){
            // $RAW.post('/accept', {owner: $stateParams.user, repo: $stateParams.repoId}, function(err, data){
            //     if (!err && data) {
            //         $window.location.href = data;
            //     }
            // });
            $RAW.get('/accept/' + $stateParams.user + '/' + $stateParams.repoId, function(err, data){
                if (!err && data) {
                    $window.location.href = data;
                }
            });
        };

        $scope.renderHtml = function(html_code)
        {
            return $sce.trustAsHtml(html_code);
        };
    }
]);
