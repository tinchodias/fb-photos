'use strict';

app.service('Facebook', function ($q, $window) {

	var self = this;
	self.accessToken = 'EAAaAc9vI6wIBAF9z19OEkPIfeGxMszGtKcwHpCRQDPinDiT2hDX4vNT6BjTh9OFtX6B1q5059okXi1yXIivHecTpKp8AL6BUvICewdO06eIjFLyCUzPOy8BanhlHGxy5rZB4XvoQEcJ3eBqtO0wvcfDGxq1ebPS13D82yqAZDZD';


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


//   $window.fbAsyncInit = function() {

//     FB.init({
//       appId      : '1830084957235970', // AboutMe
//       xfbml      : false,
// //      cookie     : true,  // enable cookies to allow the server to access the session
//       version    : 'v2.8'
//     });

//     if (self.accessToken !== '') {
//       // hardcoded access token (debugging)
//     } else {
//       self.checkLoginStatus();
//     }

//   };


  self.showLogin = function() {
    FB.login(self.loginStatusCallback, { scope: 'public_profile,user_photos,pages_show_list' });
  };


  self.me = function() {
    var deferred = $q.defer();

    FB.api('/me', {
        access_token: self.accessToken
      }, function(response) {
        
        console.log("me");
        console.log(response);

        if (!response || response.error) {
          deferred.reject(response.error);
        } else {
          deferred.resolve(response);
        }
      });

    return deferred.promise;
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




//////////////
  if (self.accessToken !== '') {
   // hardcoded access token (debugging)
  } else {
   self.checkLoginStatus();
  }
////////////////

});



app.controller('LoginCtrl', function(Facebook) {

  this.showLogin = Facebook.showLogin;

});
