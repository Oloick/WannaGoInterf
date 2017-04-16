app.controller('UserController', function ($scope, $location, $state,$http,$ionicPopup,profileVoyageur,profileServices,profileType, $cordovaOauth, $localStorage) {
  console.log(localStorage.getItem('token'));
  console.log($state.current.name);
  if ($state.current.name == "login") {
    if (localStorage.getItem('token') != null) {
      $state.go('home');
    }
  }
  $scope.signin = function () {
    $http({
      url: "https://iwannagoapi.herokuapp.com/api/public/user/register/" + $scope.choice,
      method: "PUT",
      data: {
        username: $scope.user.username,
        email: $scope.user.email,
        password: $scope.user.password,
        date: $scope.user.date
      }
    }).then(function (response) {
      console.log(response);
      $state.go('login');
    });
  }
  $scope.changePassword = function () {
    $http({
      url: "https://iwannagoapi.herokuapp.com/api/private/user/password",
      method: "POST",
      data: {
        password: $scope.nwPassword
      },
      headers: {
        Authorization: localStorage.getItem('token')
      }
    })
      .then(function (data) {
        console.log(data);

      });
  }
  $scope.verifyBeforeChangePass = function () {// VERIFIER LE MOT DE PASSE AVANT DE CHANGER
  };
  $scope.goToPass = function () {
    $state.go('pass');
  };

  $scope.disconnect = function () {
    console.log("disconnect");
    localStorage.removeItem('token');
    console.log(localStorage.getItem('token'));
    $state.go('login');
  }
  $scope.getUserInformation = function () {
    profileServices.get().success(function (data) {
      $scope.username = data.username;
      $scope.date = data.date;
      $scope.email = data.email;
      $scope.photo = data.photo;
      $scope.cover = data.cover;
    }).error(function(data, status) {
      alert('Facebook: '+status);
    });
  };

  $scope.getVoyageurInformation = function () {
    profileVoyageur.get().success(function (data) {
      //alert(JSON.stringify(data)));
      $scope.posts = data.posts;
      $scope.reservations = data.reservations;
    }).error(function(data, status) {
      alert('Facebook: '+status);
    });
  };

  $scope.connect = function (user) {
    $scope.disconnect();
    $http({
      url: "https://iwannagoapi.herokuapp.com/api/public/user/authentification",
      method: "POST",
      data: {
        username: $scope.user.username,
        password: $scope.user.password
      }
    })
      .then(function (response) {
        if (response.data.success) {
          localStorage.setItem('token', response.data.token);
          $scope.getUserInformation();
          $state.go("home");
        }
        else {
          console.log("Raté");
          console.log(response.data);
        }
      });
  };

  $scope.connectWithFb = function () {
    $cordovaOauth.facebook("290350911389056", ['email', 'user_birthday', 'user_location']).then(function(result) {
  		$http.get('https://graph.facebook.com/v2.5/me', { params: { access_token: result.access_token, fields: 'id,name,email,gender,location,picture.type(large), cover', format: 'json' }}).then(function(result) {
        //alert(JSON.stringify(result.data.cover));
        var user = {
  				profileId: result.data.id,
  				username: result.data.name,
  				email: result.data.email,
          photo: result.data.picture.data.url,
          cover: result.data.cover.source,
          token: result.config.params.access_token
  			}
  			$http.post('https://iwannagoapi.herokuapp.com/api/public/user/authentification-facebook/saveUserFb', user)
  				.success(function(data) {
            //alert(JSON.stringify(data));
            localStorage.setItem('token', 'Bearer ' + data.user.facebook.access_token);
            $http({
              url: "https://iwannagoapi.herokuapp.com/api/public/user/authentification-facebook/voyageur",
              method: "POST",
              headers: {
                Authorization: localStorage.getItem('token')
              }
            })
            $state.go("home");
  				})
  				.error(function(data, status) {
  					alert('Facebook: '+status);
  				});
  		}, function(error) {
  			alert('Facebook: '+error);
  		})
  	});
  };

  $scope.getUserType = function () {
    profileType.get().success(function (data) {
      //alert(JSON.stringify(data));
      $scope.type = data.resultat;
    }).error(function(data, status) {
      alert('Facebook: '+status);
    });
  };

}); //Fin du $scope;

// Pour obtenir le profil a tout moment avec un profileServices.get()
app.factory('profileServices', function($http) {
	return {
		get: function(){
      return $http({
          url:"https://iwannagoapi.herokuapp.com/api/prive/user/information",
          method:"GET",
          headers:{
              Authorization:localStorage.getItem('token')
          }
      });
		}
	}
})

app.factory('profileType', function($http){
  return {
    get: function(){
      return $http({
        url:"https://iwannagoapi.herokuapp.com/api/prive/user/information/type",
        method:"GET",
        headers:{
          Authorization:localStorage.getItem('token')
        }
      });
    }
  }
})

app.factory('profileVoyageur', function($http){
  return {
    get: function(){
      return $http({
        url:"https://iwannagoapi.herokuapp.com/api/prive/voyageur/information",
        method:"GET",
        headers:{
          Authorization:localStorage.getItem('token')
        }
      });
    }
  }
})
