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
          data.data[i].percentDone = Posts.getPercentage(data.data[i].expiresAt, data.data[i].createdAt);
          data.data[i].expiryText = Posts.getExpiresText(data.data[i].expiresAt)
        }
      }
      if (isRefresh || $scope.posts.length == 0) {
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
            "tags": [ "No", "content", "here", "yet" ],
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

.controller('FeedCtrl', function($scope, $ionicScrollDelegate, $http, Posts, Installation) {
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
          data.data[i].percentDone = Posts.getPercentage(data.data[i].expiresAt, data.data[i].createdAt);
          data.data[i].expiryText = Posts.getExpiresText(data.data[i].expiresAt)
        }
      }
      if (isRefresh) {
        $scope.posts = data.data
        $scope.noMoreItemsAvailable = false;
        $scope.$broadcast('scroll.refreshComplete');
        $scope.offset += $scope.limit
        //$scope.$apply()
      } else if ($scope.posts.length == 0 && data.data.length == 0) {
        getPosts(true)
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
  $scope.onImgDoubleTap = function(id) {
    for (var i = 0; i < $scope.posts.length; i++) {
      if ($scope.posts[i].id == id) {
        if ($scope.posts[i].isLiked) {
          Posts.savePost(id, function(cnt) {
            $scope.posts[i].saveCount = cnt
            $scope.posts[i].isSaved = true
            console.log("Add to file system")
            window.open($scope.posts[i].media.url, '_system', 'location=yes');
          })
        } else {
          Posts.likePost(id, function(cnt) {
            $scope.posts[i].likeCount = cnt
            $scope.posts[i].isLiked = true
          })
        }
        break;
      }
    }
  };
  $scope.onImgOnHold = function() {
    console.log("onImgHold")
  };
})

.controller('CreateCtrl', function($scope, $http, $state, $ionicPopover, $ionicPopup, $rootScope, $ionicScrollDelegate, $ionicHistory, $ionicActionSheet, Installation) {
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
  $scope.cWidth = window.innerWidth * .92;
  $scope.cHeight = (window.innerHeight * .75) - 90;
  $scope.cOpacity = .9;
  $ionicPopover.fromTemplateUrl('templates/edit-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.editPopover = popover;
  });
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
      $scope.editPopover.remove();
      $rootScope.$broadcast('refreshFeedEvent', null);
      $ionicScrollDelegate.$getByHandle('creationScroll').scrollTop();
      $state.go('tab.feed', {shouldRefresh: true}, {reload: true})
    }).error(function(data, status, headers, config) {
      alert('Failed Posting: ' + data.message);
      console.log("Error while posting: " + data.message)
    });
  }
  
  $scope.getPhoto = function($event) {
    $scope.hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: 'Take Photo' },
          { text: 'Photo From Library' },
          { text: 'Draw Something' }
        ],
        titleText: 'Add an Image',
        cancelText: 'Cancel',
        buttonClicked: function(index) {
          $scope.addImage(index, $event);
        }
      });
  }
  
  var editPopoverIsOpen = false
  var alreadyClosedPopover = false
  var editPopoverIsRemoved = false
  $scope.addImage = function(type, $event) {
      $scope.hideSheet();
      if (type == 2) {
        if (editPopoverIsRemoved) {
          $ionicPopover.fromTemplateUrl('templates/edit-popover.html', {
            scope: $scope
          }).then(function(popover) {
            $scope.editPopover = popover;
            editPopoverIsRemoved = false
            $scope.editPopover.show($event);
            alreadyClosedPopover = false
          });
        } else {
          $scope.editPopover.show($event);
          alreadyClosedPopover = false
        }
      } else {
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
  
  $scope.saveDrawing = function() {
    // to save the drawing
    var canvas = document.getElementById('pwCanvasMain');
    canvas.toBlob(function(blob) {
      var url = URL.createObjectURL(blob);
      //preview image on img tag
      $('#image-preview').attr('src', url);
      //setting scope.lastPhoto 
      $scope.lastPhoto = blob;
      $scope.upload()
      alreadyClosedPopover = true
      $scope.editPopover.hide();
    }, 'image/jpeg', 0.75);
  }
  
  $scope.undoLast = function(){
    console.log("undo called")
    if ($scope.version > 0) {
      $scope.version--;
    }
  };
  
  $scope.$on('popover.shown', function() {
    editPopoverIsOpen = true
    //var f = $forceTouch.getForce()
    //console.log('The force: ' + f)
    //setInterval(getForceTouchData, 15);
  });
  
  $scope.$on('popover.hidden', function() {
    editPopoverIsOpen = false
    if (alreadyClosedPopover == false) {
      $scope.saveDrawing();
    }
  });
  $scope.$on('popover.removed', function() {
    editPopoverIsRemoved = true
  });
})

.controller('ImgEditCtrl', function($scope, $ionicPopover, $ionicPopup) {
  
  /*
  var width = window.innerWidth; // width of canvas
  var height = window.innerHeight; // height of canvas

  var canvas = new fabric.Canvas('c');
  console.log(document.getElementById('c'))

  canvas.selection = false;
  fabric.Object.prototype.selectable = false; // prevent drawing objects to be draggable or clickable
  canvas.setBackgroundColor('#fff')
  // sets canvas height and width
  canvas.setHeight(height);
  canvas.setWidth(width);
  // sets canvas height and width
  // *** having both canvas.setHeight and canvas.width prevents errors when saving
  canvas.width = width;
  canvas.height = height;

  canvas.isDrawingMode = false;
  canvas.freeDrawingBrush.width = 6; // size of the drawing brush
  $scope.brushcolor = '#000000'; // set brushcolor to black to begin

  // ** uncomment below to set a background image using a url **

  // canvas.setBackgroundImage('image-url-here', canvas.renderAll.bind(canvas), {
  //   height: height,
  //   width: width
  // });



  // drawing mode
  $scope.drawingMode = function() {
    console.log("drawingMode()")
    // check if fabric is in drawing mode
    if (canvas.isDrawingMode == true) {
      // if fabric is in drawing mode, exit drawing mode
      $scope.showColorPaletteIcon = false; // hind color palette icon
      canvas.isDrawingMode = false;
      console.log("Was already true")
    } else {
      // if fabric is not in drawing mode, enter drawing mode
      $scope.showColorPaletteIcon = true; // show color palette icon
      canvas.isDrawingMode = true;
      console.log("Was false")
    }
  }

  // color options popover
  $ionicPopover.fromTemplateUrl('templates/colors.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.openColorsPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closeColorsPopover = function() {
    $scope.popover.hide();
  };

  // list of colors
  $scope.colors = [
      {color: "#ecf0f1"},
      {color: "#95a5a6"},
      {color: "#bdc3c7"},
      {color: "#7f8c8d"},
      {color: "#000000"},
      {color: "#F1A9A0"},
      {color: "#D2527F"},
      {color: "#f1c40f"},
      {color: "#f39c12"},
      {color: "#e67e22"},
      {color: "#d35400"},
      {color: "#e74c3c"},
      {color: "#c0392b"},
      {color: "#6D4C41"},
      {color: "#3E2723"},
      {color: "#1abc9c"},
      {color: "#16a085"},
      {color: "#2ecc71"},
      {color: "#27ae60"},
      {color: "#3498db"},
      {color: "#2980b9"},
      {color: "#34495e"},
      {color: "#2c3e50"},
      {color: "#9b59b6"},
      {color: "#8e44ad"},
  ]

  $scope.changeBrushColor = function(color) {
    canvas.freeDrawingBrush.color = color;
    $scope.brushcolor = color; // used to change the color palatte icon's color
    $scope.popover.hide(); // hide popover
  }

  // undo last object, drawing or text
  $scope.undoLastObject = function() {
    var canvas_objects = canvas._objects;
    var last = canvas_objects[canvas_objects.length - 1];
    canvas.remove(last);
    canvas.renderAll();
  }

  $scope.addText = function() {
    // prevent user from being in drawing mode while adding text
    // this allows the user to manipulate the text object without drawing at the same time
    canvas.isDrawingMode = false; // exit drawing
    $scope.showColorPaletteIcon = false; // hide color palette icon

    $scope.data = {}

    // ionic popup used to prompt user to enter text
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.input">',
      title: 'Enter Text',
      subTitle: '',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
      }, {
        text: '<b>Save</b>',
        type: 'button-stable',
        onTap: function(e) {
          if (!$scope.data.input) {
            e.preventDefault();
          } else {
            return $scope.data.input;
          }
        }
      }]
    });
    myPopup.then(function(input) {

      // fabric js
      var t = new fabric.Text(input, {
        left: (width / 3),
        top: 100,
        fontFamily: 'Helvetica',
        fill: $scope.brushcolor, // color
        selectable: true, // draggbale

      });
      canvas.add(t); // add text to fabric.js canvas

    });
  }
  */
});

/*.controller('ImgEditCtrl', function($scope, $ionicPopover, $ionicPopup) {

  var width = window.innerWidth; // width of canvas
  var height = window.innerHeight; // height of canvas

  var canvas = new fabric.Canvas('c');
  console.log(document.getElementById('c'))

  canvas.selection = false;
  fabric.Object.prototype.selectable = false; // prevent drawing objects to be draggable or clickable
  canvas.setBackgroundColor('#fff')
  // sets canvas height and width
  canvas.setHeight(height);
  canvas.setWidth(width);
  // sets canvas height and width
  // *** having both canvas.setHeight and canvas.width prevents errors when saving
  canvas.width = width;
  canvas.height = height;

  canvas.isDrawingMode = false;
  canvas.freeDrawingBrush.width = 6; // size of the drawing brush
  $scope.brushcolor = '#000000'; // set brushcolor to black to begin

  // ** uncomment below to set a background image using a url **

  // canvas.setBackgroundImage('image-url-here', canvas.renderAll.bind(canvas), {
  //   height: height,
  //   width: width
  // });



  // drawing mode
  $scope.drawingMode = function() {
    console.log("drawingMode()")
    // check if fabric is in drawing mode
    if (canvas.isDrawingMode == true) {
      // if fabric is in drawing mode, exit drawing mode
      $scope.showColorPaletteIcon = false; // hind color palette icon
      canvas.isDrawingMode = false;
      console.log("Was already true")
    } else {
      // if fabric is not in drawing mode, enter drawing mode
      $scope.showColorPaletteIcon = true; // show color palette icon
      canvas.isDrawingMode = true;
      console.log("Was false")
    }
  }

  // color options popover
  $ionicPopover.fromTemplateUrl('templates/colors.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

  $scope.openColorsPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closeColorsPopover = function() {
    $scope.popover.hide();
  };

  // list of colors
  $scope.colors = [
      {color: "#ecf0f1"},
      {color: "#95a5a6"},
      {color: "#bdc3c7"},
      {color: "#7f8c8d"},
      {color: "#000000"},
      {color: "#F1A9A0"},
      {color: "#D2527F"},
      {color: "#f1c40f"},
      {color: "#f39c12"},
      {color: "#e67e22"},
      {color: "#d35400"},
      {color: "#e74c3c"},
      {color: "#c0392b"},
      {color: "#6D4C41"},
      {color: "#3E2723"},
      {color: "#1abc9c"},
      {color: "#16a085"},
      {color: "#2ecc71"},
      {color: "#27ae60"},
      {color: "#3498db"},
      {color: "#2980b9"},
      {color: "#34495e"},
      {color: "#2c3e50"},
      {color: "#9b59b6"},
      {color: "#8e44ad"},
  ]

  $scope.changeBrushColor = function(color) {
    canvas.freeDrawingBrush.color = color;
    $scope.brushcolor = color; // used to change the color palatte icon's color
    $scope.popover.hide(); // hide popover
  }

  // undo last object, drawing or text
  $scope.undoLastObject = function() {
    var canvas_objects = canvas._objects;
    var last = canvas_objects[canvas_objects.length - 1];
    canvas.remove(last);
    canvas.renderAll();
  }

  $scope.addText = function() {
    // prevent user from being in drawing mode while adding text
    // this allows the user to manipulate the text object without drawing at the same time
    canvas.isDrawingMode = false; // exit drawing
    $scope.showColorPaletteIcon = false; // hide color palette icon

    $scope.data = {}

    // ionic popup used to prompt user to enter text
    var myPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="data.input">',
      title: 'Enter Text',
      subTitle: '',
      scope: $scope,
      buttons: [{
        text: 'Cancel'
      }, {
        text: '<b>Save</b>',
        type: 'button-stable',
        onTap: function(e) {
          if (!$scope.data.input) {
            e.preventDefault();
          } else {
            return $scope.data.input;
          }
        }
      }]
    });
    myPopup.then(function(input) {

      // fabric js
      var t = new fabric.Text(input, {
        left: (width / 3),
        top: 100,
        fontFamily: 'Helvetica',
        fill: $scope.brushcolor, // color
        selectable: true, // draggbale

      });
      canvas.add(t); // add text to fabric.js canvas

    });
  }

  $scope.saveDrawing = function() {
    // to save the drawing
    var drawing = canvas.toDataURL();

  }



});*/

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