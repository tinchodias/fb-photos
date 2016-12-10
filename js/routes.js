app.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/photos");

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
        redirectIfNotAuthenticated: _redirectIfNotAuthenticated
      }
    })

    .state('login', {
      url: "/login",
      templateUrl: "partials/login.html",
      controller: "LoginCtrl as loginCtrl",
      resolve: {
        skipIfAuthenticated: _skipIfAuthenticated
      }
    });

  function _skipIfAuthenticated($q, $state, Facebook) {
    var defer = $q.defer();
    console.log("hey1");
    Facebook.ready().when(function() {
      if(Facebook.isLoggedIn()) {
        defer.reject();
      } else {
        defer.resolve();
      }
    });
    return defer.promise;
  }
   
  function _redirectIfNotAuthenticated($q, $state, Facebook) {
    var defer = $q.defer();
    console.log("hey2");
    Facebook.ready().when(function() {
      console.log("hey2 when ready");
      if(Facebook.isLoggedIn()) {
        defer.resolve();
      } else {
        $timeout(function () {
          $state.go('login');
        });
        defer.reject();
      }
    });
    return defer.promise;
  }

});