angular.module('starter.directives', [])

.directive('rangeslider', function() {
  return {
    // Restrict it to be an attribute in this case
    restrict: 'A',
    // responsible for registering DOM listeners as well as updating the DOM
    link: function(scope, element, attrs) {
      $(element).ionRangeSlider({
        id: "expiration-slider",
        type: "single",
        min: 1,
        max: 169,
        grid: false,
        grid_snap: true,
        force_edges: true,
        prettify: function(val) {
          if (val == 1) {
            return '1 Hour';
          } else if (val == 169) {
            return "Doesn't Expire";
          } else if (val < 24) {
            return val + ' Hours'
          } else if (val == 24) {
            return '1 Day';
          } else {
            if (val % 24 == 0) {
              return (val / 24) + " Days";
            } else {
              hours = val % 24;
              days = Math.floor(val / 24);
              daysUnits = 'Days';
              if (days == 1) {
                daysUnits = 'Day';
              }
              hoursUnits = 'Hours';
              if (hours == 1) {
                hoursUnits = 'Hour'
              }
              return days + ' ' + daysUnits + ' & ' + hours + ' ' + hoursUnits;
            }
          }
        }
      });
    }
  };
})

.directive('postbox', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      
    }
  }
})

.directive('mediabox', ['$compile', function($compile) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var dispHeight = function(width, height, newWidth) {
        var f = newWidth / width
        return (height * f)
      } (scope.post.media.width, scope.post.media.height, element.width());
      element.css('height', dispHeight);
      var marginLeft = Math.round(element.width() / 2);
      marginLeft = marginLeft - 14;
      var marginTop = Math.round(element.height() / 2);
      marginTop = marginTop - 8;
      var spinner = document.createElement("ion-spinner");
      spinner.setAttribute('icon', 'lines');
      spinner.setAttribute('class', 'media-loading-spinner');
      styleStr = "padding-top: " + marginTop + "px;margin-left: " + marginLeft + "px;position: absolute;"
      spinner.setAttribute('style', styleStr);
      element.append(spinner);
      $compile(spinner)(scope);
	  	var img = new Image();
			img.onload = function(){
				spinner.setAttribute('style', 'display: none;');
				var dispImg = document.createElement("img");
				dispImg.setAttribute('style', "width:100%;max-width:100%;height:" + dispHeight + ";margin: 0px; padding: 0px;");
				dispImg.setAttribute('ng-src', this.src);
        dispImg.setAttribute('on-hold', 'onImgHold()');
        dispImg.setAttribute('on-double-tap', 'onImgDoubleTap(post.id)');
				element.append(dispImg);
				$compile(dispImg)(scope);
			};
			img.src = scope.post.media.url
    }
  }
}]);