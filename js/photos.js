'use strict';

app.controller('PhotosCtrl', function (Facebook) {

	var self = this;
	self.photos = [];
  self.loading = true;

  self.getAllPhotos = function() {
    return Facebook.getAll('/me/photos', 'picture,images{source,width,height},created_time,link,reactions.limit(99){type},comments.limit(99){id}');
  };


	self.getAllPhotos().then(
    function(photos) {
    	self.photos = photos;
      console.log("got " + photos.length + " photos");
   	}, 
    function(error) {
   		console.log(error);
   	}).finally(function() {
      self.loading = false;
    });


})

  
  
