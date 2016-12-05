'use strict';


angular.module('app', ['wu.masonry'])


.controller('FacebookCtrl', function ($q, $window) {

	var self = this;
	self.accessToken = 'EAAaAc9vI6wIBAMdMH1G5w8wEnIsHW9yEwdFY5IpqU2pR25JMP262jbDPqZBkgKYlsFJbMEnlZBO4gZBBOTPYWBOjQaQSZCzVhqyHMPAouO5PzbUIp3RAy1tsn9MSUHqJZCzRiUCjL2KOlr3QldoqwxRLtZCZBYZAQUulExsV4jI2FQZDZD';
	self.images = [];
  self.isInitialized = false;

  $window.fbAsyncInit = function() {

    FB.init({
      appId      : '1830084957235970',
      xfbml      : false,
//      status     : true, // check the login status upon init?
//      cookie     : true, // set sessions cookies to allow your server to access the session?
      version    : 'v2.8'
    });


    if (self.accessToken !== '') {
      self.initializeNow(); "hardcoded access token (debugging)"
    } else {
  		FB.getLoginStatus(function(response) {
  		  console.log(response);
  		  if (response.status === 'connected') {
  				self.accessToken = response.authResponse.accessToken;			// Is accessToken from the website visitor mandatory?
  		    self.initializeNow();
  		  }
  		  else {
  		    window.location = "index.html"    // redirect to login page
  		  }
  		});      
    }

  };



  self.getAllPhotos = function() {
    return self.getAll('/me/photos', 'picture, images{source}');
  };



  self.getAll = function(facebookApiFunction) {

    var deferred = $q.defer();
    var data = [];
    var after = '';

    async.doWhilst(function (callback) {

      FB.api(resource, {
        fields: fields,
        limit: '99',
        type: 'uploaded',
        access_token: self.accessToken,
        after: after
      }, function(response) {
        if (!response || response.error) {
          callback(response.error);
        } else {
          data = data.concat(response.data);
          if (response.paging) {
            after = response.paging.cursors.after;
          } else {
            after = undefined;
          }
          callback();
        }
      });

    },
    function () {
      return after === undefined;
    },
    function (error) {
      if (error) {
        deferred.reject(error);
      } else {
        deferred.resolve(data);
      }
    });

    return deferred.promise;
  };



	self.initializeNow = function() {
		self.getAllPhotos() 
    	.then(function(images) {
      	self.images = images;
        self.isInitialized = true;
        console.log("initializeNow loaded #" + images.length);
     	}, function(error) {
     		alert(error.message);
     	}
  	);
  };


})

  
  