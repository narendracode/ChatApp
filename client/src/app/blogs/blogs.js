angular.module('blogs',['ngResource','ui.router','showdown.directives','ngSanitize','blog.services']);
angular.module('blogs').config(['$stateProvider','$urlRouterProvider',
                                function($stateProvider,$urlRouterProvider){
                                    // $urlRouterProvider.otherwise("/blog*");
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
                                    .state('blog_post_detail',{
                                         url: '/blog/posts/:id',
                                         templateUrl : 'app/blogs/post.tpl.html',
                                         controller : 'BlogDetailsController',
                                         resolve : {

                                         }
                                     })
                                    .state('blog_published',{
                                         url: '/blog/published',
                                         templateUrl : 'app/blogs/published.tpl.html',
                                         controller : 'BlogsController',
                                         resolve : {

                                         }
                                     })
                                      .state('blog_invalid',{
                                         url: '/blog/*',
                                         templateUrl : 'app/blogs/invalid.tpl.html'
                                     })
                                     ;
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

//$stateParams

angular.module('blogs').controller('BlogDetailsController',['$scope','$resource','$state','$stateParams','$location','$rootScope', 'BlogService',             function($scope,$resource,$state,$stateParams,$location,$rootScope,BlogService){
    
    if($stateParams.id){
        console.log("$$$$$ id from stateparams : "+$stateParams.id);
    }else
        console.log("$$$$$ id from stateparams : null");
}]);


angular.module('blogs').controller('BlogsController',['$scope','$resource','$state','$location','$rootScope', 'BlogService',                                                function($scope,$resource,$state,$location,$rootScope,BlogService){
    var blogService = new BlogService();
    var BlogResource = $resource('/blog/:id');
    
    
    var loadAllBlogs = function(){
        return BlogResource.query(function(results){
            $scope.blogs = results;
        });
    }
    
    $scope.createBlog = function(){
        var blogResource = new BlogResource();
        blogResource.body = $scope.blog.body;
        blogResource.title = $scope.blog.title;
        blogResource.createdBy = $rootScope.currentUser;
        
        blogResource.$save(function(result){
            $scope.blog.body = '';
            $scope.blog.title = '';
            console.log("result after saving : "+JSON.stringify(result));
            $location.path("/blog/")
        });
    }
    
    $scope.updateBlog = function(_id){
        blogService = new BlogService();
        blogResource.body = $scope.blog.body;
        blogResource.title = $scope.blog.title;
         
        $scope.blogService.$update({id:_id},function(result){
            $location.path("/blog/")
        });
    }

    $scope.getBlog = function(_id){
        blogService = new BlogService();
        blogService.$get({id : _id},function(result){
            $scope.blog = result;
            $location.path("/blog/"+_id+"/")
        });
        $scope.blog;
    }

    $scope.deleteBlog = function(_id){
        blogService = new BlogService();
        blogService.$delete({id: _id},function(result){
            $location.path("/blog/")
        });
    }
    
}
]);
