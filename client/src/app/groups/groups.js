angular.module('groups',['ngResource','ui.router','showdown.directives','ngSanitize','ui.bootstrap','ngAnimate','ngFileUpload','angular-clipboard']);


angular.module('groups').config(['$stateProvider','$urlRouterProvider','$httpProvider',
                                 function($stateProvider,$urlRouterProvider,$httpProvider){
                                    
                                     $httpProvider.interceptors.push('AuthHttpRequestInterceptor');
                                     $stateProvider
                                         .state('group_all',{
                                         url: '/group',
                                         templateUrl : 'app/groups/groups.tpl.html',
                                         controller : 'GroupsController',
                                         resolve : {

                                         }
                                     })
                                         .state('group_new',{
                                         url: '/group/new',
                                         templateUrl : 'app/groups/new.tpl.html',
                                         controller : 'GroupCreateController',
                                         resolve : {

                                         }
                                     })
                                         .state('group_detail',{
                                         url: '/group/:url',
                                         templateUrl : 'app/groups/group.tpl.html',
                                         controller : 'GroupDetailsController',
                                         resolve : {

                                         }
                                     })
                                         .state('group_edit',{
                                         url: '/group/edit/:url',
                                         templateUrl : 'app/groups/edit.tpl.html',
                                         controller : 'GroupEditController',
                                         resolve : {

                                         }
                                     });        
                                 
}]);



angular.module('groups').controller('GroupCreateController',['$scope','$resource','$state','$location','$rootScope', 'BlogService','GroupService', '$uibModal','Upload', 'ShareDataService','$timeout','$interval',function($scope,$resource,$state,$location,$rootScope,BlogService,$uibModal,Upload,ShareDataService,$timeout,$interval){


}]);


angular.module('groups').controller('GroupsController',['$scope','$resource','$state','$location','$rootScope', 'BlogService','GroupService', '$uibModal','Upload', 'ShareDataService','$timeout','$interval',function($scope,$resource,$state,$location,$rootScope,BlogService,$uibModal,Upload,ShareDataService,$timeout,$interval){


}]);



angular.module('groups').controller('GroupDetailsController',['$scope','$resource','$state','$stateParams','$location','$rootScope', 'GroupService','$uibModal', 'ShareDataService',  function($scope,$resource,$state,$stateParams,$location,$rootScope,GroupService,BlogUrlService,$uibModal,ShareDataService){
    var groupService = new GroupService();
    groupService.$get({url:$stateParams.url},function(result){
        $scope.group = result;
    });

    $scope.delete = function (size,group_id) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'deleteModal.tpl.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                blog_id : function(){
                    console.log(" inside resolve GroupDetailsController .. : "+group_id);
                    return blog_id;
                }
            }
        });

        modalInstance.result.then(function (group_id) {
            $scope.deletedGroupId = group_id;
            $location.path("/blog/posts")
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        }); 
    };

}]);


angular.module('groups').controller('ModalInstanceCtrl',['$scope','$uibModalInstance','group_id','GroupService','$resource','ShareDataService',function ($scope, $uibModalInstance, blog_id,BlogService,$resource,ShareDataService) {
    var groupService = new GroupService();
    var groupResource = $resource('/group/:id');
    $scope.group_id = group_id;

    $scope.ok = function () {    
        groupService.$delete({id:$scope.group_id},function(results){

            if(results.length>0 && !results[0].type && results[0].cause=='UNAUTHORIZED'){
                console.log("You are not authorized for this..");
                $location.path("/")
            }

            ShareDataService.addMsg("You have successfully deleted the group.");
            $uibModalInstance.close($scope.group_id);
        });
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);


angular.module('groups').run(function($rootScope, $location){
    return $rootScope.$on('$stateChangeStart', function(event,next){
        if(next){
            if(next.data){
                if(next.data.authRequired){
                    if($rootScope.currentUser){
                        //do nothing
                    }else{
                        $location.path('/login/');
                    }
                }
            }
        }else{
            console.log('found nothing for authentication');
        }
    });
});