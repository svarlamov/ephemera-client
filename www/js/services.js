function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

angular.module('starter.services', [])

.factory('Installation', function($http, $localStorage) {
  $localStorage = $localStorage.$default({
    appInstallationId: ''
  });
  function _getToken() {
    return $localStorage.appInstallationId
  }
  function _setToken(t) {
    $localStorage.appInstallationId = t
    $http.defaults.headers.common["X-INSTALLATION-ID"] = t
  }
  function _check() {
    if (_getToken().length < 30) {
      $http.post(apiRoot + 'installations').success(function(data, status, headers, config) {
        _setToken(data.data.id)
      }).error(function(data, status, headers, config) {
        console.log("Error getting app install id " + data)
      });
      return false
    } else {
      $http.defaults.headers.common["X-INSTALLATION-ID"] = _getToken()
      return true
    }
  }
  return {
    getToken: _getToken,
    check: _check
  }
})

.factory('Posts', function($http, Installation) {
  return {
		calcDisplayHeight: function(width, height, newWidth) {
      var f = newWidth / width
      return (height * f)
    },
    getPercentage: function(expiresAt, createdAt) {
      var expAt = Date.parse(expiresAt)
      var crtAt = Date.parse(createdAt)
      var range = expAt - crtAt
      var n = Date.now()
      return (100 - ((expAt-n)/range)*100)
    },
    getExpiresText: function(expiresAt) {
      var now = Date.now();
      var e = Date.parse(expiresAt)
      seconds = (now-e) / 1000;
      seconds = Math.abs(seconds);
      if (seconds < 60) {
        return ("Expires in " + seconds + " Seconds")
      }
      minutes = Math.round(seconds/60)
      if (minutes < 60) {
        if (minutes == 1) {
          return ("Expires in 1 Minute")
        }
        return ("Expires in " + minutes + " Minutes")
      }
      hours = Math.round(minutes/60)
      if (hours < 24) {
        if (hours == 1) {
          return ("Expires in 1 Hour")
        }
        return ("Expires in " + hours + " Hours")
      }
      days = Math.round(hours/24)
      if (days == 1) {
        return "Expires in 1 Day"
      }
      return ("Expires in " + days + " Days")
    },
    likePost: function(postId, callback) {
      while (!Installation.check) {
        sleep(500)
      }
      $http.post(apiRoot + 'posts/' + postId + '/likes').success(function(data, status, headers, config) {
        callback(data.data.count)
      }).error(function(data, status, headers, config) {
        if (data.data.count > 0) {
          callback(data.data.count)
        }
        console.log("Error while liking a post: " + data.message)
      });
    },
    savePost: function(postId, callback) {
      while (!Installation.check) {
        sleep(500)
      }
      $http.post(apiRoot + 'posts/' + postId + '/saves').success(function(data, status, headers, config) {
        callback(data.data.count)
      }).error(function(data, status, headers, config) {
        console.log("Error while saving a post: " + data.message)
      });
    }
  };
});