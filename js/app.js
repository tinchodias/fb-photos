'use strict';

var app = angular.module('app', ['ui.router', 'wu.masonry', 'facebook']);



app.config(function(FacebookProvider) {
  FacebookProvider.init('1830084957235970'); // AboutMe
  FacebookProvider.setSdkVersion('v2.8');
});



app.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/wait");

  $stateProvider

    /*.state('private', {
      abstract: true,
      resolve: {
        
        profile: function(Facebook, $state, $q, $timeout) {
          console.log("resolve private");

          return Facebook.ready().when(function() {
            console.log("readyyyy");
            if (!Facebook.isLoggedIn()) {
              $timeout(function () {
                $state.go('login');//, {redirect: $state.toState.name}); 
              });
            }
          })
        }

      }
    })*/

    .state('wait', {
      url: "/wait",
      templateUrl: "partials/wait.html"
    })

    .state('photos', {
      url: "/photos",
      templateUrl: "partials/photos.html",
      controller: "PhotosCtrl as photosCtrl",
      resolve: {
//        redirectIfNotAuthenticated: _redirectIfNotAuthenticated
      }
    })

    .state('login', {
      url: "/login",
      templateUrl: "partials/login.html",
      controller: "LoginCtrl as loginCtrl",
      resolve: {
//        skipIfAuthenticated: _skipIfAuthenticated
      }
    });

  function _skipIfAuthenticated($q, $state, Facebook) {
/*    var defer = $q.defer();
    console.log("hey1");

    if (!Facebook.isReady()) {
      console.log("hey1 not ready");

      $timeout(function () {
        console.log("hey1 wait");
        $state.go('wait');
        defer.reject();
      });
    }

    Facebook.getLoginStatus(function(response) {
      console.log("hey1 login status");
      console.log(response);

      if(response.status === 'connected') {
        defer.reject();
      } else {
        defer.resolve();
      }
    });
    return defer.promise;*/
  }
   
  function _redirectIfNotAuthenticated($q, $state, Facebook) {
    var defer = $q.defer();
    console.log("hey2");

    if (!Facebook.isReady()) {
      console.log("hey2 not ready");
      $state.go('wait');
      defer.reject();
    } else {
      Facebook.getLoginStatus(function(response) {
        console.log("hey2 login status");
        console.log(response);

        if(response.status === 'connected') {
          defer.resolve();
        } else {
          $timeout(function () {
            $state.go('login');
            defer.reject();
          });
        }
      });
    }

    return defer.promise;
  }

});