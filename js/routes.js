app.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/photos");

  $stateProvider

    .state('private', {
      abstract: true,
      resolve: {
        profile: function(Facebook, $state, $log, $q, $timeout) {
          console.log("3123123123");
          return Facebook.me().then(function(me) {
              return me;
            }, function() {
//              $setTimeout(function() {
                $state.go('login');//, {redirect: $state.toState.name});
//              }, 1);
            });
        }
      }
    })

    .state('private.photos', {
      url: "/photos",
      templateUrl: "partials/photos.html",
      controller: "PhotosCtrl as photosCtrl"
    })

    .state('login', {
      url: "/login",
      templateUrl: "partials/login.html",
      controller: "LoginCtrl as loginCtrl"
    })


});