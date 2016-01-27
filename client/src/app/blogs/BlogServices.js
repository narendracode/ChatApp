var module = angular.module('blog.services',['ngResource']);


module.factory("AuthHttpRequestInterceptor", 
               function ($localStorage) {
    return {
        request: function (config) {
            console.log(" ## Authorization Request :   "+$localStorage.token);
            if($localStorage.token)
                config.headers["Authorization"] = 'bearer '+ $localStorage.token; 
            return config;
        }
    };
});

module.factory('BlogService',function($resource){
    return $resource('blog/:id', 
                     {
        id: '@id'
    },
                     {
        'update': { method:'PUT' }
    },
                     {
        'get': { method: 'GET', isArray: false }
    },
                     {
        'delete': { method: 'DELETE'}
    }
  );
});

module.factory('CommentService',function($resource){
    return $resource('blog/comment/:id', 
                     {
        id: '@id'
    },
                     {
        'update': { method:'PUT' }
    },
                     {
        'get': { method: 'GET', isArray: false }
    },
                     {
        'delete': { method: 'DELETE'}
    }
                    );
});



module.factory('BlogUrlService',function($resource){
    return $resource('blog/:url', 
                     {
        url: '@url'
    },
                     {
        'update': { method:'PUT' }
    },
                     {
        'get': { method: 'GET', isArray: false }
    },
                     {
        'delete': { method: 'DELETE'}
    }
                    );
});



module.factory('ShareDataService',function(){
    var data = {
        message : ''
    };
    
    var addMessage = function(value){
        data.message = value;
    }
    
    var getMessage = function(){
        return data.message;
    }
    
    return {
        addMsg : addMessage,
        getMsg : getMessage
    };
    
});