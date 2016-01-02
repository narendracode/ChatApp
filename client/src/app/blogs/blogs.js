angular.module('blogs',['ngResource','ui.router','showdown.directives','ngSanitize','blog.services','ui.bootstrap','ngAnimate']);
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
                                    .state('blog_edit',{
                                         url: '/blog/edit/:id',
                                         templateUrl : 'app/blogs/edit.tpl.html',
                                         controller : 'BlogsEditController',
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
    var blogService = new BlogService();    
    blogService.$get({id:$stateParams.id},function(result){
        $scope.blog = result;
    });
}]);


angular.module('blogs').controller('BlogsEditController',['$scope','$resource','$state','$stateParams','$location','$rootScope', 'BlogService',             function($scope,$resource,$state,$stateParams,$location,$rootScope,BlogService){
    var blogService = new BlogService();
    
    blogService.$get({id:$stateParams.id},function(result){
        $scope.blog = result;
    });
    
    $scope.updateBlog = function(){
        blogService.body = $scope.blog.body;
        blogService.title = $scope.blog.title;

        blogService.$update({id:$scope.blog._id},function(result){
            if(result)
                $location.path("/blog/posts/"+result._id)
        });
    }
    
}]);


angular.module('blogs').controller('ModalInstanceCtrl',['$scope','$uibModalInstance','blog_id','BlogService','$resource',function ($scope, $uibModalInstance, blog_id,BlogService,$resource) {
    var blogService = new BlogService();
    var BlogResource = $resource('/blog/:id');
    
    $scope.blog_id = blog_id;

    $scope.ok = function () {
        console.log("Blog deleted : "+$scope.blog_id);
        blogService.$delete({id:$scope.blog_id},function(result){
            $uibModalInstance.close($scope.blog_id);
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
                                                       
]);



angular.module('blogs').controller('BlogsController',['$scope','$resource','$state','$location','$rootScope', 'BlogService', '$uibModal',                                             function($scope,$resource,$state,$location,$rootScope,BlogService,$uibModal){
    var blogService = new BlogService();
    var BlogResource = $resource('/blog/:id');

    $scope.animationsEnabled = true;
    
    
    $scope.delete = function (size,blog_id) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'deleteModal.tpl.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                blog_id : function(){
                    console.log(" inside resolve BlogsController .. : "+blog_id);
                    return blog_id;
                }
            }
        });

        modalInstance.result.then(function (blog_id) {
            console.log("####### blog id deleted : "+blog_id);
            BlogResource.query(function(results){
                $scope.blogs = results;
            });
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        }); 
    };
    
    
    BlogResource.query(function(results){
        $scope.blogs = results;
    });
    
    
    var loadAllBlogs = function(){
        return BlogResource.query(function(results){
            $scope.blogs = results;
        });
    }
    
    $scope.createBlog = function(){
        var blogResource = new BlogResource();
        blogResource.content = $scope.blog.content;
        blogResource.title = $scope.blog.title;
        blogResource.createdBy = $rootScope.currentUser;
        
        blogResource.$save(function(result){
            $scope.blog.content = '';
            $scope.blog.title = '';
            console.log("result after saving : "+JSON.stringify(result));
            $location.path("/blog/posts")
        });
    }
    
    
    $scope.editBlog = function(_id){
        blogService.$get({id:_id},function(result){
            $scope.blog = result;
            $location.path("/blog/edit/"+_id)
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
