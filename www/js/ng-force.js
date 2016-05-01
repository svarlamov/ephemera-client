/*function getForceTouchData() {
    console.log("check force touch")
    ForceTouch.getForceTouchData(function(ForceTouchData) {
      console.log("got force touch resp")
      // checking if device allows ForceTouch interaction
      var forceTouchCapability = '';
      switch (ForceTouchData.forceTouchCapability) {
        case '0':
          forceTouchCapability = 'Unknown';
          break;
        case '1':
          forceTouchCapability = 'Unavailable';
          break;
        case '2':
          forceTouchCapability = 'Available';
          break;
      }
      if (ForceTouchData.touches[0]) {
        // setting output values for first Touch Point at index:0 -> "ForceTouchData.touches[0]"
        var force = parseFloat(ForceTouchData.touches[0].force);
        console.log("valid force touch")
        $scope.cOpacity = force
      } else {
        // no Touch Point available -> resetting output values
        
      }
    })
  }
angular.module('forceTouch', [])

  .factory('$forceTouch', ['$q', '$window', function ($q, $window) {

    return {
      getForce: function() {

            var q = $q.defer(); 
            console.log($window.plugins)
            console.log(window.cordova.plugins)
            if($window.plugins.ForceTouch) {
              $window.plugins.ForceTouch.getForceTouchData(function(ForceTouchData) {
                console.log("got force touch resp")
                // checking if device allows ForceTouch interaction
                var forceTouchCapability = '';
                switch (ForceTouchData.forceTouchCapability) {
                  case '0':
                    forceTouchCapability = 'Unknown';
                    break;
                  case '1':
                    forceTouchCapability = 'Unavailable';
                    break;
                  case '2':
                    forceTouchCapability = 'Available';
                    break;
                }
                if (ForceTouchData.touches[0]) {
                  // setting output values for first Touch Point at index:0 -> "ForceTouchData.touches[0]"
                  var force = parseFloat(ForceTouchData.touches[0].force);
                  console.log("valid force touch")
                  q.resolve(force);
                } else {
                  // no Touch Point available -> resetting output values
                  q.resolve(0)
                }
              })
            } else {
              console.log("ForceTouch is undefined")
            }

            return q.promise;

        }
    };
  }]);*/