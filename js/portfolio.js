'use strict';


angular.module('app', ['wu.masonry'])


.controller('PortfolioCtrl', function ($q, $window) {

	var self = this;
	self.accessToken = '';
	self.images = [];


  $window.fbAsyncInit = function() {

    FB.init({
      appId      : '1830084957235970',
      xfbml      : false,
//      status     : true, // check the login status upon init?
//      cookie     : true, // set sessions cookies to allow your server to access the session?
      version    : 'v2.8'
    });

//    self.initializeNow();
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


  self.getImages = function(after) {
    var deferred = $q.defer();
    var parameters = {
      fields: 'picture',
      limit: '99',
      type: 'uploaded',
      access_token: self.accessToken,
      after: after || ''
    };

    FB.api('/me/photos', parameters, function(response) {
      if (!response || response.error) {
        deferred.reject(response.error);
      } else {
        var data = response.data;
        if (response.paging && response.paging.cursors.after) {
          self.getImages(response.paging.cursors.after)
            .then(function(dataAfter) {
              data = data.concat(dataAfter);
              deferred.resolve(data);
            }, function(error) {
              deferred.reject(error);
            });
        } else {
          deferred.resolve(data);
        }
      } 
    });
    return deferred.promise;
  };


	self.initializeNow = function() {
		self.getImages() 
    	.then(function(images) {
      	self.images = images;
        console.log("initializeNow loaded #" + images.length);
     	}, function(error) {
     		alert(error.message);
     	}
  	);
  };


})

  
  
