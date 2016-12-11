'use strict';

var app = angular.module('app', ['ui.router', 'wu.masonry', 'facebook', 'angularLazyImg']);



app.config(function(FacebookProvider) {
  FacebookProvider.init({
      appId      : '1830084957235970', // AboutMe
      xfbml      : false,
      cookie     : true,
      version    : 'v2.8'
    });
});



app.config(function ($stateProvider, $urlRouterProvider) {

//  $urlRouterProvider.otherwise("/photos");
  $urlRouterProvider.otherwise(function($injector, $location){
  
    var Facebook = $injector.get('Facebook');
    var $timeout = $injector.get('$timeout');
    var $state = $injector.get('$state');

    console.log("otherwise");
    function checkAndResolve() {
    
      if (!Facebook.isReady()) {
        console.log("otherwise: not ready; re-check later");
        $timeout(checkAndResolve, 100); 
      } else {
        console.log("otherwise: logged in?");
        Facebook.getLoginStatus(function(response) {
          console.log("otherwise: login status response");
          console.log(response);

          $state.go((response.status === 'connected') ? 'photos' : 'login');
        });
      }
    }
    checkAndResolve();
  });

  $stateProvider

    /*.state('private', {
      abstract: true,
      resolve: {
        
        profile: function(Facebook, $state, $q, $timeout) {
          console.log("resolve private");

          return Facebook.ready().then(function() {
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

    .state('photos', {
      url: "/photos",
      templateUrl: "partials/photos.html",
      controller: "PhotosCtrl as photosCtrl",
      resolve: {
        redirectIfNotAuthenticated: _redirectIfNotAuthenticated
      }
    })

    .state('login', {
      url: "/login?goToState",
      templateUrl: "partials/login.html",
      controller: "LoginCtrl as loginCtrl",
      resolve: {
//        skipIfAuthenticated: _skipIfAuthenticated
      }
    });


});

  function _skipIfAuthenticated($q, $state, Facebook) {
/*    var deferred = $q.defer();
    console.log("hey1");

    if (!Facebook.isReady()) {
      console.log("hey1 not ready");

      $timeout(function () {
        console.log("hey1 wait");
        $state.go('wait');
        deferred.reject();
      });
    }

    Facebook.getLoginStatus(function(response) {
      console.log("hey1 login status");
      console.log(response);

      if(response.status === 'connected') {
        deferred.reject();
      } else {
        deferred.resolve();
      }
    });
    return deferred.promise;*/
  }


  function _redirectIfNotAuthenticated($q, $state, $timeout, Facebook) {

    console.log("redirectIfNotAuthenticated");
    var deferred = $q.defer();

    function checkAndResolve() {
    
      if (!Facebook.isReady()) {
        console.log("not ready; re-check later");
        $timeout(checkAndResolve, 100); 
      } else {
        console.log("logged in?");
        Facebook.getLoginStatus(function(response) {
          console.log("login status response");
          console.log(response);

          if(response.status === 'connected') {
            return deferred.resolve();
          } else {
            return deferred.reject({redirectTo: 'login'});
          }
        });
      }
    }
    checkAndResolve();

    return deferred.promise;
  }


app.run(function($rootScope, $state) {
  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
    console.log(error);

    if (error.redirectTo) {
      $state.go(error.redirectTo, {goToState: toState.name});
    } else {
      //$state.go('error', {status: error.status})
    }
  });
});