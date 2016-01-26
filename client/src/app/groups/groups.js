angular.module('groups',['ngResource','ui.router','showdown.directives','ngSanitize','blog.services','ui.bootstrap','ngAnimate','ngFileUpload','angular-clipboard','group.services']);


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

angular.module('groups').controller('GroupsController',['$scope','$resource','$state','$location','$rootScope', 'BlogService','GroupService', '$uibModal', 'ShareDataService','$timeout','$interval',function($scope,$resource,$state,$location,$rootScope,BlogService,GroupService,$uibModal,ShareDataService,$timeout,$interval){

    var GroupUrlService = $resource('/group/:url');

    GroupUrlService.query(function(results){
        if(results.length>0 && !results[0].type && results[0].cause=='UNAUTHORIZED'){
            console.log("You are not authorized for this..");
            $location.path("/")
        }

        console.log(" groups query result : "+JSON.stringify(results));
        $scope.groups = results;
    }); 
}]);

angular.module('groups').controller('GroupCreateController',['$scope','$resource','$state','$location','$rootScope', 'BlogService','GroupService','GroupUrlService', '$uibModal','Upload', 'ShareDataService','$timeout','$interval',function($scope,$resource,$state,$location,$rootScope,BlogService,GroupService,GroupUrlService,$uibModal,Upload,ShareDataService,$timeout,$interval){
    var GroupUrlService = $resource('/group/:url');
    
    $scope.createGroup = function(){
        var groupUrlService = new GroupUrlService();
        
        groupUrlService.description = $scope.group.description;
        groupUrlService.name = $scope.group.name;
        groupUrlService.type = $scope.group.type;
        
        if($scope.group.type){
            groupUrlService.type = 'private';
        }else
            groupUrlService.type = 'public';
        
        
        groupUrlService.$save(function(result){
            $scope.group.description = '';
            $scope.group.name = '';
            $scope.group.type= '';

            if(result.type){
                    ShareDataService.addMsg('Group successfully created.');
                    $location.path("/group")
            }

            if(!result.type){
                console.log(result.msg);
            }
        });
    };
    
}]);





angular.module('groups').controller('GroupDeleteModalInstanceCtrl',['$scope','$uibModalInstance','group_id','GroupService','$resource','ShareDataService',function ($scope, $uibModalInstance,group_id,GroupService,$resource,ShareDataService) {
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
}]);

angular.module('groups').controller('GroupDetailsController',['$scope','$resource','$state','$stateParams','$location','$rootScope', 'GroupService','GroupUrlService','$uibModal', 'ShareDataService',  function($scope,$resource,$state,$stateParams,$location,$rootScope,GroupService,GroupUrlService,$uibModal,ShareDataService){ 
    var groupUrlService = new GroupUrlService();
    
    groupUrlService.$get({url:$stateParams.url},function(result){
        $scope.group = result;
    });

    $scope.delete = function(size,group_id) {
        var groupModalInstance = $uibModal.open({
            templateUrl: 'deleteGroupModal.tpl.html',
            controller: 'GroupDeleteModalInstanceCtrl',
            size: size,
            resolve: {
                group_id : function(){
                    console.log(" inside resolve GroupDetailsController .. : "+group_id);
                    return group_id;
                }
            }
        });

          groupModalInstance.result.then(function(group_id) {
            $scope.deletedGroupId = group_id;
            $location.path("/group")
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        }); 
    };

}]);


angular.module('groups').controller('GroupEditController',['$scope','$resource','$state','$stateParams','$location','$rootScope', 'GroupService','GroupUrlService','$uibModal', 'ShareDataService',  function($scope,$resource,$state,$stateParams,$location,$rootScope,GroupService,GroupUrlService,BlogUrlService,$uibModal,ShareDataService){
    var groupUrlService = new GroupUrlService();
    var groupService = new GroupService();
    
    groupUrlService.$get({url:$stateParams.url},function(result){
        $scope.group = result;
        
        var abc = $uibModal.open({
            templateUrl: 'deleteGroupModal.tpl.html',
            controller: 'GroupDeleteModalInstanceCtrl',
            size: "sm",
            resolve: {
                group_id : function(){
                    console.log(" inside resolve GroupDetailsController .. : abc");
                    return "abc";
                }
            }
        });
        
        
        if($scope.group.group_type === 'private'){
            $scope.group.group_type = true;
        }
        else{
            $scope.group.group_type = false;
        }
    });

    $scope.editGroup = function(){
        groupService.description = $scope.group.description;
        groupService.name = $scope.group.name;
       // groupService.type = $scope.group.type;
        
        if($scope.group.group_type){
            groupService.group_type = 'private';
        }else
            groupService.group_type = 'public';
        
        
        groupService.$update({id:$scope.group._id},function(result){
            if(result)
                $location.path("/group/"+result.url)
        });
    }

}]);






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