'use strict';


angular.module('app', ['wu.masonry'])


.controller('FacebookCtrl', function ($q, $window) {

	var self = this;
	self.accessToken = '';
	self.photos = [];
  self.isFBSdkInitialized = false;
  self.isFBLoggedIn = false;
  self.isFBDataLoaded = false;


  $window.fbAsyncInit = function() {

    FB.init({
      appId      : '1830084957235970', // AboutMe
      xfbml      : false,
      cookie     : true,  // enable cookies to allow the server to access the session
      version    : 'v2.8'
    });

    self.isFBSdkInitialized = true;
    FB.XFBML.parse(); 

    if (self.accessToken !== '') {
      // hardcoded access token (debugging)
      self.loadFBData();
    } else {
      // Now that we've initialized the FB JavaScript SDK, we call 
      // FB.getLoginStatus().  This function gets the state of the
      // person visiting this page and can return one of three states to
      // the callback you provide. 
      self.checkLoginStatus();
    }

  };


  // This is called with the response from FB.getLoginStatus() or after the FB login button is pressed.
  // The status can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not ('unknown').
  //
  // These three cases are handled in the callback function.
  self.checkLoginStatus = function() {
    FB.getLoginStatus(function(response) {
      console.log(response);
      
      self.isFBLoggedIn = response.status === 'connected';

      if (self.isFBLoggedIn) {
        self.accessToken = response.authResponse.accessToken;
        self.loadFBData();    // hardcoded access token (debugging)
      }
    });
  };

  
  // "EXPORT"
  $window.checkLoginStatus = self.checkLoginStatus;


  self.getAllPhotos = function() {
    return self.getAll('/me/photos', 'picture,images{source,width,height},created_time,link,reactions.limit(99){type},comments.limit(99){id}');
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


	self.loadFBData = function() {

		self.getAllPhotos().then(
      function(photos) {
      	self.photos = photos;
        self.isFBDataLoaded = true;

        console.log("loadFBData: " + photos.length + " photos");
     	}, 
      function(error) {
     		alert(error.message);
     	});

  };


})

  
  
