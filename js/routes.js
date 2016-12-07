app.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/");

  $stateProvider

    .state('blank', {
      url: "/",
      templateUrl: "partials/blank.html"
    })

    .state('login', {
      url: "/login",
      templateUrl: "partials/login.html"
    })

    .state('photos', {
      url: "/photos",
      templateUrl: "partials/photos.html"
    })

    .state('wait', {
      url: "/wait",
      templateUrl: "partials/wait.html"
    })

});