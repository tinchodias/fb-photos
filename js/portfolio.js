'use strict';


angular.module('app', [])


.controller('PortfolioCtrl', function ($q, $window) {

	var self = this;
//	var accessToken;
	self.images = [];


  $window.fbAsyncInit = function() {

    FB.init({
      appId      : '1830084957235970',
      xfbml      : false,
      version    : 'v2.8'
    });

    self.initializeNow();

/*		FB.getLoginStatus(function(response) {
		  console.log(response);
		  if (response.status === 'connected') {
				self.accessToken = response.authResponse.accessToken;
		    self.initializeNow();
		  }
		  else {
		    FB.login();
		  }
		});*/

  };


  self.getImages = function() {
    var deferred = $q.defer();
    FB.api('/me/photos', {
      fields: 'images,name,from'
      //,access_token: self.accessToken
    }, function(response) {
      if (!response || response.error) {
      	console.log(response);
          deferred.reject('Error occured');
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
     		console.log(error);
     	}
  	);
  };


})

  
  
