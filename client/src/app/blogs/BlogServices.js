var module = angular.module('blog.services',['ngResource']);

module.factory('BlogService',
function($resource){
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