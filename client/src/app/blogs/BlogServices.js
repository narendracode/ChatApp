var module = angular.module('blog.services',['ngResource']);


module.factory("AuthHttpRequestInterceptor", 
               function ($localStorage) {
    return {
        request: function (config) {
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