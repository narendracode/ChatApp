angular.module('charts',['ngResource','ui.router','chart.directives']);
angular.module('charts').config(['$stateProvider','$urlRouterProvider',
               function($stateProvider,$urlRouterProvider){
                   $urlRouterProvider.otherwise("/");
                   $stateProvider.state('chart',{
                        url: '/chart/',
                       templateUrl : 'app/charts/chart.tpl.html',
                       controller : 'ChartsController',
                       resolve : {
                            
                       },
                       data : {
                                authRequired : true,
                                access : ['user','admin']
                       }
                   });
               }
 ]);

angular.module('charts').run(function($rootScope, $location){
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


angular.module('charts').factory('chartSocket',function(){
    var socket = io.connect("http://localhost:3000");
    return socket;
});

angular.module('charts').controller('ChartsController',['$scope','$resource','$state','$location','chartSocket','$rootScope',
    function($scope,$resource,$state,$location,chartSocket,$rootScope){
        $scope.accessor = function(d){ 
            return d.value;
        };
        
        $scope.valName = '';
        $scope.val=0;
        $scope.data = [
            { label: 'Sarah', value: 10 },
            { label: 'Victor', value: 20 }
        ];
        
        $scope.updateChart = function(){
            chartSocket.emit('user:updateChart');
        };
        
        chartSocket.on('user:updateChart',function(data){
            $scope.data = data;
            $scope.$apply();
        });
        
        $scope.save = function(){
            console.log("  new data chart : "+$scope.data);
            chartSocket.emit('user:updateChart',$scope.data);
        };
        
        $scope.addSlice = function(){
            $scope.data.push({label:$scope.valName,value:$scope.val})
            $scope.valName = '';
            $scope.val=0;
        };
        
        $scope.removeSlice = function(){
            $scope.data.pop();
           // $scope.$apply();
          //  chartSocket.emit('user:updateChart',$scope.chart);
        };
    }
]);
