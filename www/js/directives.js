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
        console.log(f)
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
        dispImg.setAttribute('on-double-tap', 'onImgDoubleTap()');
        dispImg.setAttribute('on-hold', 'onImgHold()');
				element.append(dispImg);
				$compile(dispImg)(scope);
			};
			img.src = scope.post.media.url
    }
  }
}])

.directive("drawing", function(){
  return {
    restrict: "A",
    link: function(scope, element){
      console.log("In directive")
      var ctx = element[0].getContext('2d');

      // variable that decides if something should be drawn on mousemove
      var drawing = false;

      // the last coordinates before the current move
      var lastX;
      var lastY;

      element.bind('mousedown', function(event){
        console.log('mousedown')
        if(event.offsetX!==undefined){
          lastX = event.offsetX;
          lastY = event.offsetY;
        } else { // Firefox compatibility
          lastX = event.layerX - event.currentTarget.offsetLeft;
          lastY = event.layerY - event.currentTarget.offsetTop;
        }

        // begins new line
        ctx.beginPath();

        drawing = true;
      });
      element.bind('mousemove', function(event){
        console.log('mousemove')
        if(drawing){
          // get current mouse position
          if(event.offsetX!==undefined){
            currentX = event.offsetX;
            currentY = event.offsetY;
          } else {
            currentX = event.layerX - event.currentTarget.offsetLeft;
            currentY = event.layerY - event.currentTarget.offsetTop;
          }

          draw(lastX, lastY, currentX, currentY);

          // set current coordinates to last one
          lastX = currentX;
          lastY = currentY;
        }

      });
      element.bind('mouseup', function(event){
        console.log('mouseup')
        // stop drawing
        drawing = false;
      });

      // canvas reset
      function reset(){
       element[0].width = element[0].width; 
      }

      function draw(lX, lY, cX, cY){
        // line from
        ctx.moveTo(lX,lY);
        // to
        ctx.lineTo(cX,cY);
        // color
        ctx.strokeStyle = "#4bf";
        // draw it
        ctx.stroke();
      }
    }
  };
});