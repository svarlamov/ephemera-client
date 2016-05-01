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

.factory('Posts', function() {
  return {
		calcDisplayHeight: function(width, height, newWidth) {
      var f = newWidth / width
      return (height * f)
    }
  };
});

/*
.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
*/