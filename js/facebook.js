'use strict';

app.controller('LoginCtrl', function(Facebook, $state) {

  var self = this;

  // This is called with the response from FB.getLoginStatus() or after the FB login button is pressed.
  // The status can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into your app or not ('unknown').
  //
  // These three cases are handled in the callback function.
  function loginStatusCallback(response) {
    console.log(response);
    console.log("go to " + $state.params.goToState);
    
    if (response.status === 'connected') {
      $state.go($state.params.goToState || 'photos');
    } 
  }

  self.showLogin = function() {
    Facebook.login(loginStatusCallback, { scope: 'public_profile,user_photos,pages_show_list' });
  };

});



/*
app.service('Facebook', function ($q, $window) {

	var self = this;
	self.accessToken = '';

  // This is called with the response from FB.getLoginStatus() or after the FB login button is pressed.
  // The status can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into your app or not ('unknown').
  //
  // These three cases are handled in the callback function.
  self.loginStatusCallback = function(response) {
    console.log(response);
    
    if (response.status === 'connected') {
      self.accessToken = response.authResponse.accessToken;
    }
  };


  self.checkLoginStatus = function() {
    FB.getLoginStatus(self.loginStatusCallback);
  };



  self.showLogin = function() {
    FB.login(self.loginStatusCallback, { scope: 'public_profile,user_photos,pages_show_list' });
  };


  self.getAllPhotos = function() {
    return self.getAll('/me/photos', 'picture,images{source,width,height},created_time,link,reactions.limit(99){type},comments.limit(99){id}');
  };


  self.getAllAlbums = function() {
    return self.getAll('/me/albums', 'name,picture,created_time,link,reactions.limit(99){type},comments.limit(99){id}');
  };


  self.getAll = function(resource, fields) {

    var deferred = $q.defer();
    var data = [];
    var after = '';

    async.doWhilst(function (callback) {

      FB.api(resource, {
        fields: fields,
        limit: '200',
        type: 'uploaded',
        access_token: self.accessToken,
        after: after
      }, function(response) {
        
        console.log(response);

        if (!response || response.error) {
          callback(response.error);
        } else {
          data = data.concat(response.data);
          if (response.paging && response.paging.next) {  // next is the best indicator to know if there are more
            after = response.paging.cursors.after;
          } else {
            after = undefined;
          }
          callback();
        }
      });

    },
    function () {
      return after !== undefined;
    },
    function (error) {
      if (error) { deferred.reject(error) } 
      else { deferred.resolve(data) }
    });

    return deferred.promise;
  };



  self.initializeNow = function() {
    if (self.accessToken !== '') {
     // hardcoded access token (debugging)
    } else {
     self.checkLoginStatus();
    }
  };



  self.readyDefer = $q.defer();

  self.ready = function() {
    return self.readyDefer.promise;
  };

  self.isLoggedIn = function() {
    return self.accessToken !== '';
  };

  console.log("fbAsyncInit 0");

  $window.fbAsyncInit = function() {

    console.log("fbAsyncInit 1");

    FB.init({
      appId      : '1830084957235970', // AboutMe
      xfbml      : false,
      version    : 'v2.8'
    });

    console.log("fbAsyncInit 2");
    
    self.initializeNow();

    self.readyDefer.resolve();

    console.log("fbAsyncInit 3");
//    $scope.$broadcast('facebook-fb-async-init', "done");    
//    $scope.$on('myCustomEvent', function (event, data) {});
  }

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));


});
*/


