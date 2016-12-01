'use strict';


angular.module('app', [])


.controller('PortfolioCtrl', function ($q, $window) {

	var self = this;
	self.accessToken = '';
	self.images = [];


  $window.fbAsyncInit = function() {

    FB.init({
      appId      : '1830084957235970',
      xfbml      : false,
      version    : 'v2.8'
    });

		FB.getLoginStatus(function(response) {
		  console.log(response);
		  if (response.status === 'connected') {
				self.accessToken = response.authResponse.accessToken;			// Is accessToken from the website visitor mandatory?
		    self.initializeNow();
		  }
		  else {
		    FB.login();
		  }
		});

  };


  self.getImages = function() {
    var deferred = $q.defer();
    FB.api('/me/photos', {					// Does user-id expire?
      fields: 'images,name',
      type: 'uploaded',
      access_token: self.accessToken
    }, function(response) {

     	console.log(response);

      if (!response || response.error) {
          deferred.reject(response.error);
      } else {
          deferred.resolve(response);
      }
    });
    return deferred.promise;
  };


	self.initializeNow = function() {

		self.getImages() 
    	.then(function(response) {
      	self.images = response.data;
     	}, function(error) {
     		alert(error.message);
     	}
  	);
  };


})

  
  
