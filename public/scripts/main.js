var app = angular.module("myApp", []);

// ------------------categorys-----------------------------
app.controller('categorys', ['$scope', '$http', function($scope, $http) {
  $http.get('myblog.json').then(function(categorys){
    $scope.categorys = categorys.data[1].data;
  });
}])


// ------------------blog-----------------------------
app.controller('blog', ['$scope','$rootScope', '$http', function($scope, $rootScope, $http) {
  $http.get('myblog.json').then(function(blogs){
    $rootScope.blogs = blogs.data[3].data;
    console.log($rootScope.blogs)
  });
}])
