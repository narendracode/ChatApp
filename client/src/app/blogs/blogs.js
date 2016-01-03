angular.module('blogs',['ngResource','ui.router','showdown.directives','ngSanitize','blog.services','ui.bootstrap','ngAnimate','ngFileUpload','angular-clipboard']);
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
                                         controller : 'BlogCreateController',
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

angular.module('blogs').controller('BlogDetailsController',['$scope','$resource','$state','$stateParams','$location','$rootScope', 'BlogService','$uibModal', 'ShareDataService',  function($scope,$resource,$state,$stateParams,$location,$rootScope,BlogService,$uibModal,ShareDataService){
    var blogService = new BlogService();   
   // var shareDataService = new ShareDataService();
    
    blogService.$get({id:$stateParams.id},function(result){
        $scope.blog = result;
    });
    
    
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
            $scope.deletedBlogId = blog_id;
            $location.path("/blog/posts")
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        }); 
    };
 
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


angular.module('blogs').controller('ModalInstanceCtrl',['$scope','$uibModalInstance','blog_id','BlogService','$resource','ShareDataService',function ($scope, $uibModalInstance, blog_id,BlogService,$resource,ShareDataService) {
    var blogService = new BlogService();
    var BlogResource = $resource('/blog/:id');
    
    $scope.blog_id = blog_id;

    $scope.ok = function () {    
        blogService.$delete({id:$scope.blog_id},function(result){
            ShareDataService.addMsg("You have successfully deleted the blog.");
            $uibModalInstance.close($scope.blog_id);
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
                                                       
]);


angular.module('blogs').controller('BlogCreateController',['$scope','$resource','$state','$location','$rootScope', 'BlogService', '$uibModal','Upload', 'ShareDataService','$timeout','$interval',function($scope,$resource,$state,$location,$rootScope,BlogService,$uibModal,Upload,ShareDataService,$timeout,$interval){
    $scope.images = [];
    $scope.profilePic = '/files/profile.png';
    var blogService = new BlogService();
    var BlogResource = $resource('/blog/:id');
    
    $scope.textToCopy = 'I can copy by clicking!';

    $scope.success = function () {
        console.log('Copied!');
    };

    $scope.fail = function (err) {
        console.error('Error!', err);
    };
    
    
    $scope.createBlog = function(){
        var blogResource = new BlogResource();
        blogResource.content = $scope.blog.content;
        blogResource.title = $scope.blog.title;
        blogResource.createdBy = $rootScope.currentUser;

        blogResource.$save(function(result){
            $scope.blog.content = '';
            $scope.blog.title = '';
            ShareDataService.addMsg('Your successfully posted the blog.');
            $location.path("/blog/posts")
        });
    }

    
    $scope.upload = function (file) {
        Upload.upload({
            url: 'blog/upload',
            data: {file: file, 'username': 'hello'}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + '   uploaded. Response: ' + JSON.stringify(resp.data));
            console.log($location.protocol() + "://" + $location.host() + ":" + $location.port());
           // $scope.profilePic = '/files/'+resp.data.file.name;
            $scope.profilePic = $location.protocol() + "://" + $location.host() + ":" + $location.port()+'/files/'+resp.data.file.name;
            $scope.images.push($location.protocol() + "://" + $location.host() + ":" + $location.port()+'/files/'+resp.data.file.name);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };
    
    
    // for multiple files:
   /* $scope.uploadFiles = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                Upload.upload({..., data: {file: files[i]}, ...})...;
            }
            // or send them all together for HTML5 browsers:
            Upload.upload({..., data: {file: files}, ...})...;
        }
    };
    */
    
}]);


angular.module('blogs').controller('BlogsController',['$scope','$resource','$state','$location','$rootScope', 'BlogService', '$uibModal', 'ShareDataService', '$timeout','$interval',function($scope,$resource,$state,$location,$rootScope,BlogService,$uibModal,ShareDataService,$timeout,$interval){
    var blogService = new BlogService();
    var BlogResource = $resource('/blog/:id');
    
    $scope.animationsEnabled = true;
    
    if(ShareDataService.getMsg()){
        $scope.sharedDateMsg = ShareDataService.getMsg();
        $timeout(function(){
            ShareDataService.addMsg('');
            $scope.sharedDateMsg = '';
        }, 3000);
    }
    
    $scope.delete = function (size,blog_id) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'deleteModal.tpl.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            resolve: {
                blog_id : function(){
                    return blog_id;
                }
            }
        });

        modalInstance.result.then(function (blog_id) {
            $scope.sharedDateMsg = ShareDataService.getMsg();
            BlogResource.query(function(results){
                $scope.blogs = results;
            });
            
            $timeout(function(){
                ShareDataService.addMsg('');
                $scope.sharedDateMsg = '';
            }, 3000);
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
