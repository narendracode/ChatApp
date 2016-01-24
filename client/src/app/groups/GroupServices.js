var module = angular.module('group.services',['ngResource']);


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

module.factory('GroupService',function($resource){
    return $resource('group/:id', 
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


module.factory('GroupUrlService',function($resource){
    return $resource('group/:url', 
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