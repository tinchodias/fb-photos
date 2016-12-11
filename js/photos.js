'use strict';

app.controller('PhotosCtrl', function (Facebook, $q) {

	var self = this;
	self.photos = [];
  self.loading = true;



  self.getAll = function(resource, fields) {

    var deferred = $q.defer();
    var data = [];
    var after = '';

    async.doWhilst(function (callback) {

      Facebook.api(resource, {
        fields: fields,
        limit: '200',
        type: 'uploaded',
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

  self.getAllPhotos = function() {
    return self.getAll('/me/photos', 'picture,images{source,width,height},created_time,link,reactions.limit(99){type},comments.limit(99){id}');
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


  // belongs to the view; shouldn't be here...
  self.pictureStyles = function(photo) {
    var image = photo.images[0];
    return { "padding-bottom": "" + ((parseInt(image.height) / parseInt(image.width)) * 100) + "%" }
  };


})

  
  
