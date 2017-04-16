app.controller('PostsController', function ($scope, $location, $state,$http,$ionicPopup, $cordovaOauth, $localStorage, voyageurPots) {

  $scope.getVoyageurPosts = function () {
    voyageurPots.get().success(function (data) {
      $scope.posts = data;
    }).error(function(data, status) {
      alert('Facebook: '+status);
    });
  };

});// end

app.factory('voyageurPots', function($http){
  return {
    get: function(){
      return $http({
        url:"https://iwannagoapi.herokuapp.com/api/prive/post/information/myPost",
        method:"GET",
        headers:{
          Authorization:localStorage.getItem('token')
        }
      });
    }
  }
})
