'use strict';


angular.module('app', [])


.controller('PortfolioCtrl', function ($q, $window) {

	var self = this;


  $window.fbAsyncInit = function() {
    FB.init({
      appId      : '1830084957235970',
      xfbml      : true,
      version    : 'v2.8'
    });

    self.initializeNow();
  };

  self.getImages = function() {
    var deferred = $q.defer();
    FB.api('/me/photos', {
      fields: 'images,name',
      access_token: 'EAAaAc9vI6wIBAIjdc40UtGcQNqt5WnQy2MmOeZBeUZAjg51akZCDr9wvejfsbkFxwU07ETEeFoUf3VA4GLlUhXvU99Cr9F56ChboaKk5faCAw1tdoBzRSoPTvGykZBJnKaxZCyR5NHXNkbLuAGq9ZC6eolaPXZAPyf6WulTZATpOhAZDZD'
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


	self.images = [];

})

  
  
