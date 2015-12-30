angular.module('blogs',['ngResource','ui.router','showdown.directives','ngSanitize']);
angular.module('blogs').config(['$stateProvider','$urlRouterProvider',
                                function($stateProvider,$urlRouterProvider){
                                     $urlRouterProvider.otherwise("/");
                                     $stateProvider
                                         .state('blog',{
                                         url: '/blog/',
                                         templateUrl : 'app/blogs/blog.tpl.html',
                                         controller : 'BlogsController',
                                         resolve : {

                                         },
                                         data : {
                                             authRequired : true,
                                             access : ['user','admin']
                                         }
                                     })
                                     .state('blog_new',{
                                         url: '/blog/new',
                                         templateUrl : 'app/blogs/new.tpl.html',
                                         controller : 'BlogsController',
                                         resolve : {

                                         }
                                     })
                                     .state('blog_drafts',{
                                         url: '/blog/drafts',
                                         templateUrl : 'app/blogs/drafts.tpl.html',
                                         controller : 'BlogsController',
                                         resolve : {

                                         }
                                     })
                                    .state('blog_posts',{
                                         url: '/blog/posts',
                                         templateUrl : 'app/blogs/posts.tpl.html',
                                         controller : 'BlogsController',
                                         resolve : {

                                         }
                                     })
                                    .state('blog_published',{
                                         url: '/blog/published',
                                         templateUrl : 'app/blogs/published.tpl.html',
                                         controller : 'BlogsController',
                                         resolve : {

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


angular.module('blogs').controller('BlogsController',['$scope','$resource','$state','$location','$rootScope',                                                  function($scope,$resource,$state,$location,$rootScope){
                  
            $scope.submit = function(){
                //save 
            };
    
     }
]);
