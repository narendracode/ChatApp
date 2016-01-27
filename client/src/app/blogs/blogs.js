angular.module('blogs',['ngResource','ui.router','showdown.directives','ngSanitize','blog.services','ui.bootstrap','ngAnimate','ngFileUpload','angular-clipboard','angularMoment']);
angular.module('blogs').config(['$stateProvider','$urlRouterProvider','$httpProvider',
                                function($stateProvider,$urlRouterProvider,$httpProvider){
                                    // $urlRouterProvider.otherwise("/blog*");
                                    
                                    $httpProvider.interceptors.push('AuthHttpRequestInterceptor');
                                    
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
                                         url: '/blog/edit/:url',
                                         templateUrl : 'app/blogs/edit.tpl.html',
                                         controller : 'BlogsEditController',
                                         resolve : {

                                         }
                                     })
                                     .state('blog_drafts',{
                                         url: '/blog/drafts',
                                         templateUrl : 'app/blogs/drafts.tpl.html',
                                         controller : 'BlogsDraftController',
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
                                    .state('blog_post_draft_detail',{
                                         url: '/blog/posts/draft/:url',
                                         templateUrl : 'app/blogs/post_draft.tpl.html',
                                         controller : 'BlogDraftDetailsController',
                                         resolve : {

                                         }
                                     })
                                    .state('blog_post_detail',{
                                         url: '/blog/posts/:url',
                                         templateUrl : 'app/blogs/post.tpl.html',
                                         controller : 'BlogDetailsController',
                                         resolve : {

                                         }
                                     })
                                    .state('blog_published',{
                                         url: '/blog/published',
                                         templateUrl : 'app/blogs/published.tpl.html',
                                         controller : 'BlogsPublishedController',
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


angular.module('blogs').controller('BlogDraftDetailsController',['$scope','$resource','$state','$stateParams','$location','$rootScope', 'BlogService','BlogUrlService','$uibModal', 'ShareDataService',  function($scope,$resource,$state,$stateParams,$location,$rootScope,BlogService,BlogUrlService,$uibModal,ShareDataService){
    var blogUrlService = new BlogUrlService();
    blogUrlService.$get({url:$stateParams.url},function(result){
        $scope.blog = result;
    });
    
    $scope.delete = function (size,blog_id){
        var modalInstance = $uibModal.open({
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
            $location.path("/blog/drafts")
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        }); 
    };
    
}]);


angular.module('blogs').controller('BlogDetailsController',['$scope','$resource','$state','$stateParams','$location','$rootScope', 'BlogService','BlogUrlService','$uibModal', 'ShareDataService','CommentService' , function($scope,$resource,$state,$stateParams,$location,$rootScope,BlogService,BlogUrlService,$uibModal,ShareDataService,CommentService){
    var blogUrlService = new BlogUrlService();
    var commentService = new CommentService();
    var CommentResource = $resource('/blog/comment/:id');
    blogUrlService.$get({url:$stateParams.url},function(result){
        console.log("Blog data : "+JSON.stringify(result));
        $scope.blog = result;
    });

    $scope.comments = [
        {
            content:"This is first comment" 
        },
        {
            content:"This is second comment" 
        }
    ];
    
    
    $scope.addComment = function(){
       // $scope.blog.comments.push({content: $scope.comment.content });
        var commentResource = new CommentResource();
        
        commentResource.blog_id = $scope.blog._id;
        commentResource.content = $scope.comment.content;
        
        commentResource.$save(function(result){
            $scope.blog.comments.push(result);
            $scope.comment.content = '';
            console.log(" Comment save Result : "+JSON.stringify(result));
        });
        
       
    }
    
    $scope.delete = function (size,blog_id){
        var modalInstance = $uibModal.open({
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



angular.module('blogs').controller('ModalInstanceCtrl',['$scope','$uibModalInstance','blog_id','BlogService','$resource','ShareDataService',function ($scope, $uibModalInstance, blog_id,BlogService,$resource,ShareDataService) {
    var blogService = new BlogService();

    $scope.blog_id = blog_id;
    console.log(" blog id inside Modal instance : "+blog_id);
    $scope.ok = function () {    
        blogService.$delete({id:$scope.blog_id},function(results){

            if(results.length>0 && !results[0].type && results[0].cause=='UNAUTHORIZED'){
                console.log("You are not authorized for this..");
                $location.path("/")
            }

            ShareDataService.addMsg("You have successfully deleted the blog.");
            $uibModalInstance.close($scope.blog_id);
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
]);


angular.module('blogs').controller('BlogsPublishedController',['$scope','$resource','$state','$location','$rootScope', 'BlogService', '$uibModal', 'ShareDataService', '$timeout','$interval',function($scope,$resource,$state,$location,$rootScope,BlogService,$uibModal,ShareDataService,$timeout,$interval){
    var BlogResource = $resource('/blog/published/:id');

    if(ShareDataService.getMsg()){
        $scope.sharedDateMsg = ShareDataService.getMsg();
        $timeout(function(){
            ShareDataService.addMsg('');
            $scope.sharedDateMsg = '';
        }, 3000);
    }
    
    BlogResource.query(function(results){
        if(results.length>0 && !results[0].type && results[0].cause=='UNAUTHORIZED'){
            console.log("You are not authorized for this..");
            $location.path("/")
        }
        $scope.blogs = results;
    });
}]);

angular.module('blogs').controller('BlogsDraftController',['$scope','$resource','$state','$location','$rootScope', 'BlogService', '$uibModal', 'ShareDataService', '$timeout','$interval',function($scope,$resource,$state,$location,$rootScope,BlogService,$uibModal,ShareDataService,$timeout,$interval){
    var BlogResource = $resource('/blog/drafts/:id');

    
    if(ShareDataService.getMsg()){
        $scope.sharedDateMsg = ShareDataService.getMsg();
        $timeout(function(){
            ShareDataService.addMsg('');
            $scope.sharedDateMsg = '';
        }, 3000);
    }
    
    BlogResource.query(function(results){
        if(results.length>0 && !results[0].type && results[0].cause=='UNAUTHORIZED'){
            console.log("You are not authorized for this..");
            $location.path("/")
        }

        $scope.blogs = results;
    });

}]);




angular.module('blogs').controller('BlogsEditController',['$scope','$resource','$state','$stateParams','$location','$rootScope', 'BlogService','BlogUrlService',             function($scope,$resource,$state,$stateParams,$location,$rootScope,BlogService,BlogUrlService){
    var blogService = new BlogService();
    var blogUrlService = new BlogUrlService();
    
  /*  blogService.$get({id:$stateParams.id},function(result){
        $scope.blog = result;
    });
    */
    blogUrlService.$get({url:$stateParams.url},function(result){
        $scope.blog = result;
        if($scope.blog.status === 'Published'){
            $scope.blog.status = true;
        }else
            $scope.blog.status = false;
        
    });
    
    $scope.updateBlog = function(){
        blogService.content = $scope.blog.content;
        blogService.title = $scope.blog.title;
        if($scope.blog.status){
            blogService.status = 'Published';
        }else
            blogService.status = 'Draft';
        
        blogService.$update({id:$scope.blog._id},function(result){
            if(result)
                $location.path("/blog/posts/"+result.url)
        });
    }
    
}]);





angular.module('blogs').controller('BlogCreateController',['$scope','$resource','$state','$location','$rootScope', 'BlogService', '$uibModal','Upload', 'ShareDataService','$timeout','$interval',function($scope,$resource,$state,$location,$rootScope,BlogService,$uibModal,Upload,ShareDataService,$timeout,$interval){
    $scope.images = [];
    $scope.blog = {
        title:'',
        content:''
    };
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
        if($scope.blog.status){
            blogResource.status = 'Published';
        }else
            blogResource.status = 'Draft';

        blogResource.$save(function(result){
            $scope.blog.content = '';
            $scope.blog.title = '';
           
            if(result.type){
                ShareDataService.addMsg('Your successfully saved the blog as draft');
                if(result.status === 'Draft'){
                    $location.path("/blog/drafts")
                }
                if(result.status === 'Published'){
                    ShareDataService.addMsg('Your successfully published the blog.');
                    $location.path("/blog/published")
                }
            }
            
            if(!result.type){
                //do nothing
                console.log(result.msg);
            }
           
        });
    }

    
    $scope.progressPercentage = 0.0;
    
    var resetProgressBar = function(){
        $scope.progressPercentage = 0.0;
    };
    
    $scope.upload = function (file) {
       // $scope.progressPercentage = 0.0;
        Upload.upload({
            url: 'blog/upload',
            data: {file: file, 'username': 'hello'}
        }).then(function (resp) {
            console.log('Success ' + resp.config.data.file.name + '   uploaded. Response: ' + JSON.stringify(resp.data));
            console.log($location.protocol() + "://" + $location.host() + ":" + $location.port());
            $scope.profilePic = $location.protocol() + "://" + $location.host() + ":" + $location.port()+'/files/'+resp.data.file.name;
            $scope.images.push($location.protocol() + "://" + $location.host() + ":" + $location.port()+'/files/'+resp.data.file.name);
            //$scope.progressPercentage = 0.0;
            var img =  "\n \n ![Alt text]("+$location.protocol() + "://" + $location.host() + ":" + $location.port()+'/files/'+resp.data.file.name+">)";
            
            
            $scope.blog.content = $scope.blog.content.concat(img);
        }, function (resp) {
            console.log('Error status: ' + resp.status);
        }, function (evt) {
           // var psgPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + $scope.progressPercentage + '% ' + evt.config.data.file.name);
            
            if($scope.progressPercentage === 100.0){
               // resetProgressBar();
              //  $scope.progressPercentage = 0.0;
                
               
            }
            
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
    
    
    BlogResource.query(function(results){
        if(results.length>0 && !results[0].type && results[0].cause=='UNAUTHORIZED'){
            console.log("You are not authorized for this..");
            $location.path("/")
        }
        
        $scope.blogs = results;
    });
    
    
    var loadAllBlogs = function(){
        return BlogResource.query(function(results){
            $scope.blogs = results;
        });
    }
    
    $scope.editBlog = function(_id){
        blogService.$get({id:_id},function(result){
            if(results.length>0 && !results[0].type && results[0].cause=='UNAUTHORIZED'){
                console.log("You are not authorized for this..");
                $location.path("/")
            }
            $scope.blog = result;
            $location.path("/blog/edit/"+_id)
        });
    }
    
    $scope.updateBlog = function(_id){
        blogService = new BlogService();
        blogResource.body = $scope.blog.content;
        blogResource.title = $scope.blog.title;
         
        
        
        
        $scope.blogService.$update({id:_id},function(result){
            if(results.length>0 && !results[0].type && results[0].cause=='UNAUTHORIZED'){
                console.log("You are not authorized for this..");
                $location.path("/")
            }
            $location.path("/blog/")
        });
    }

    $scope.getBlog = function(_id){
        blogService = new BlogService();
        blogService.$get({id : _id},function(result){
            if(results.length>0 && !results[0].type && results[0].cause=='UNAUTHORIZED'){
                console.log("You are not authorized for this..");
                $location.path("/")
            }
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
