angular.module('blogs',['ngResource','ui.router']);
angular.module('blogs').config(['$stateProvider','$urlRouterProvider',
                                 function($stateProvider,$urlRouterProvider){
                                     $urlRouterProvider.otherwise("/");
                                     $stateProvider.state('blog',{
                                         url: '/blog/',
                                         templateUrl : 'app/blogs/blog.tpl.html',
                                         controller : 'BlogsController',
                                         resolve : {

                                         },
                                         data : {
                                             authRequired : true,
                                             access : ['user','admin']
                                         }
                                     });
                                 }
                                ]);

angular.module('blogs').run(function($rootScope, $location){
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


angular.module('charts').controller('BlogsController',['$scope','$resource','$state','$location','$rootScope',                                                  function($scope,$resource,$state,$location,$rootScope){
                    
                }
]);
