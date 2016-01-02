var module = angular.module('showdown.directives',[]);


module.directive('ltMarkdown', function() {
    var converter = new Showdown.converter();
    var template = "<div ng-model='markdown' ng-bind-html-unsafe='markdown'></div>"
    return {
        restrict: 'E',
        template: template,
        compile: function(tElement, tAttrs, transclude){
            var markdown = tElement.text();
            return function(scope, element, attrs) {
                scope.$watch('blog.content', function(data){
                    scope.markdown = ( data ) ? converter.makeHtml(data) : '';
                })
            }
        }
    }
});