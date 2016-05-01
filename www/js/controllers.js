angular.module('starter.controllers', [])

.controller('LibraryCtrl', function($scope, $ionicScrollDelegate, $http, Posts, Installation) {
  $scope.currentEndpoint = 'me/saves'
  $scope.limit = 10
  $scope.offset = 0
  $scope.posts = [];
  $scope.noMoreItemsAvailable = false;
  function getPosts(isRefresh, endpoint) {
    if (isRefresh) {
      $scope.limit = 10
      $scope.offset = 0
    }
    while (!Installation.check) {
      sleep(500)
    }
    $http.defaults.headers.common["X-INSTALLATION-ID"] = Installation.getToken()
    $http.get((apiRoot + $scope.currentEndpoint + '?limit=' + $scope.limit + '&offset=' + $scope.offset)).success(function(data, status, headers, config) {
      for (var i = 0; i < data.data.length; i++) {
        if (data.data[i].doesExpire) {
          data.data[i].percentDone = 50;
          data.data[i].expiryText = "Expires in 2 Minutes"
        }
      }
      if (isRefresh) {
        if (data.data.length == 0) {
          $scope.posts = [{
            "id": "08584a13-058c-47fb-9c9d-6ac5f994ef83",
            "media": {
              "id": "244de7f5-2d97-4ecb-882d-d85c79504a9c",
              "contentType": "image/png",
              "url": "https://ephemera.s3.amazonaws.com/244de7f5-2d97-4ecb-882d-d85c79504a9c.png",
              "height": 348,
              "width": 304
            },
            "tags": [ "No", "content", "here", "yet", "..." ],
            "likeCount": 1,
            "isLiked": true,
            "viewCount": 1,
            "isSeen": true,
            "saveCount": 1,
            "isSaved": true,
            "doesExpire": false,
            "expiresAt": "0001-01-01T00:00:00Z",
            "createdAt": "2016-04-30T01:59:10Z"
          }];
          $scope.noMoreItemsAvailable = true;
          $scope.$broadcast('scroll.refreshComplete');
          $scope.offset = 0
          //$scope.$apply()
        } else {
          $scope.posts = data.data
          $scope.noMoreItemsAvailable = false;
          $scope.$broadcast('scroll.refreshComplete');
          $scope.offset += $scope.limit
          //$scope.$apply()
        }
      } else {
        $scope.posts = $scope.posts.concat(data.data)
        $scope.offset += $scope.limit
        if (data.data.length == 0) {
          $scope.noMoreItemsAvailable = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    }).error(function(data, status, headers, config) {
      console.log("Error getting more posts " + data.message)
      $scope.noMoreItemsAvailable = true;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  }
  $scope.loadSaves = function() {
    var e = 'me/saves'
    if ($scope.currentEndpoint != e) {
      console.log("Load saves")
      $scope.currentEndpoint = e
      $ionicScrollDelegate.$getByHandle('libraryScroll').scrollTop();
      $scope.doRefresh()
      console.log("Load saves done")
    }
  }
  $scope.loadCreations = function() {
    var e = 'me/creations'
    if ($scope.currentEndpoint != e) {
      console.log("Load creations")
      $scope.currentEndpoint = e
      $ionicScrollDelegate.$getByHandle('libraryScroll').scrollTop();
      $scope.doRefresh()
      console.log("Load creations done")
    }
  }
  $scope.loadLikes = function() {
    var e = 'me/likes'
    if ($scope.currentEndpoint != e) {
      console.log("Load likes")
      $scope.currentEndpoint = e
      $ionicScrollDelegate.$getByHandle('libraryScroll').scrollTop();
      $scope.doRefresh()
      console.log("Load likes done")
    }
  }
  $scope.doRefresh = function() {
    getPosts(true)
  };
  $scope.loadMore = function() {
    getPosts(false)
  };
  $scope.onImgDoubleTap = function() {
    console.log("onImgDoubleTap");
  };
  $scope.onImgOnHold = function() {
    console.log("onImgHold")
  };
})

.controller('FeedCtrl', function($scope, $stateParams, $ionicScrollDelegate, $http, Posts, Installation) {
  $scope.limit = 10
  $scope.offset = 0
  $scope.posts = [];
  $scope.$on('refreshFeedEvent', function(event, args) {
    $ionicScrollDelegate.$getByHandle('feedScroll').scrollTop();
    getPosts(true)
  });
  $scope.noMoreItemsAvailable = false;
  function getPosts(isRefresh) {
    if (isRefresh) {
      $scope.limit = 10
      $scope.offset = 0
    }
    while (!Installation.check) {
      sleep(500)
    }
    $http.defaults.headers.common["X-INSTALLATION-ID"] = Installation.getToken()
    $http.get((apiRoot + 'posts?limit=' + $scope.limit + '&offset=' + $scope.offset)).success(function(data, status, headers, config) {
      for (var i = 0; i < data.data.length; i++) {
        if (data.data[i].doesExpire) {
          data.data[i].percentDone = 50;
          data.data[i].expiryText = "Expires in 2 Minutes"
        }
      }
      if (isRefresh) {
        $scope.posts = data.data
        $scope.noMoreItemsAvailable = false;
        $scope.$broadcast('scroll.refreshComplete');
        $scope.offset += $scope.limit
        //$scope.$apply()
      } else {
        $scope.posts = $scope.posts.concat(data.data)
        $scope.offset += $scope.limit
        if (data.data.length == 0) {
          $scope.noMoreItemsAvailable = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    }).error(function(data, status, headers, config) {
      console.log("Error getting more posts " + data.message)
      $scope.noMoreItemsAvailable = true;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  }
  $scope.doRefresh = function() {
    getPosts(true)
  };
  $scope.loadMore = function() {
    getPosts(false)
  };
  $scope.onImgDoubleTap = function() {
    console.log("onImgDoubleTap");
  };
  $scope.onImgOnHold = function() {
    console.log("onImgHold")
  };
})

.controller('CreateCtrl', function($scope, $http, $state, $rootScope, $ionicScrollDelegate, $ionicHistory, $ionicActionSheet, Installation) {
  $scope.isStillUploading = false
  var dataURItoBlob = function (dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString = atob(dataURI.split(',')[1]);
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      var bb = new Blob([ab], { "type": mimeString });
      return bb;
  }
  function optionsForType(type) {
    var source;
    switch (type) {
      case 0:
        source = Camera.PictureSourceType.CAMERA;
        break;
      case 1:
        source = Camera.PictureSourceType.PHOTOLIBRARY;
        break;
    }
    return {
      quality: 75, 
      targetWidth: 720,
      targetHeight: 1080, 
      destinationType: 0,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: false,
      encodingType: Camera.EncodingType.JPEG,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false,
      sourceType: source
    };
  }
  $scope.tags = [ ];
  $scope.createPost = function() {
    while ($scope.isStillUploading) {
      sleep(200)
    }
    if ($scope.lastMediaId.length < 30) {
      alert("You'll have to select an image first!")
      return
    }
    $scope.expiresInHrs = $("div[rangeslider='']")[0].value
    var tagsArr = []
    for (var i = 0; i < $scope.tags.length; i++) {
      tagsArr.push($scope.tags[i].text)
    }
    var reqObj = {
      mediaId: $scope.lastMediaId,
      doesExpire: !($scope.expiresInHrs == 169),
      lifetimeMinutes: ($scope.expiresInHrs * 60),
      tags: tagsArr
    }
    $http.post(apiRoot + 'posts', JSON.stringify(reqObj)).success(function(data, status, headers, config) {
      console.log("Success happened")
      $scope.tags = [ ];
      $scope.imageURL = "";
      $scope.lastMediaId = "";
      $('#image-preview').attr('src', "");
      $scope.lastPhoto = undefined
      $scope.isStillUploading = false
      $scope.expiresInHrs = 0
      $rootScope.$broadcast('refreshFeedEvent', null);
      $ionicScrollDelegate.$getByHandle('creationScroll').scrollTop();
      $state.go('tab.feed', {shouldRefresh: true}, {reload: true})
    }).error(function(data, status, headers, config) {
      alert('Failed Posting: ' + data.message);
      console.log("Error while posting: " + data.message)
    });
  }
  
  $scope.getPhoto = function() {
    $scope.hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: 'Take Photo' },
          { text: 'Photo From Library' }
        ],
        titleText: 'Add an Image',
        cancelText: 'Cancel',
        buttonClicked: function(index) {
          $scope.addImage(index);
        }
      });
  }
  
  $scope.addImage = function(type) {
      $scope.hideSheet();
      navigator.camera.getPicture(onSuccess, onFail, optionsForType(type)); 
      //destination type was a base64 encoding
      function onSuccess(imageData) {
          //preview image on img tag
          $('#image-preview').attr('src', "data:image/jpeg;base64,"+imageData);
          //setting scope.lastPhoto 
          $scope.lastPhoto = dataURItoBlob("data:image/jpeg;base64,"+imageData);
          $scope.upload()
      }
      function onFail(message) {
          //alert('Could not upload image ' + message);
      }
  } 

  $scope.lastMediaId = ""
  $scope.upload = function() {
      $scope.isStillUploading = true
      var url = apiRoot + "uploads";
      var fd = new FormData();

      fd.append('file', $scope.lastPhoto, 'upload.jpg')
      $http.post(url, fd, {
          transformRequest: angular.identity,
          headers:{ 'Content-Type':undefined, 'X-INSTALLATION-ID':Installation.getToken() }
      })
      .success(function(data, status, headers){
          $scope.imageURL = data.data.url;
          $scope.lastMediaId = data.data.id;
          $scope.isStillUploading = false
      })
      .error(function(data, status, headers){
          $scope.isStillUploading = false
          var alertPopup = $ionicPopup.alert({
             title: 'Failed Uploading',
             template: data.message
           });

           alertPopup.then(function(res) {
             console.log('Failed uploading');
           });
      })
  }
});

/*
.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
*/