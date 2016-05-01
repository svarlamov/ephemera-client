// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var apiRoot = "http://52.38.123.65:5000/v0/"

angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'ngStorage', 'starter.services', 'starter.directives', 'ngTagsInput', 'ngIOS9UIWebViewPatch' ])

.run(function($ionicPlatform, Installation) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    Installation.check();
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
  .state('tab.create', {
      url: '/create',
      views: {
        'create': {
          templateUrl: 'templates/create.html',
          controller: 'CreateCtrl'
        }
      }
    })
  
  .state('tab.feed', {
      url: '/feed',
      views: {
        'feed': {
          templateUrl: 'templates/feed.html',
          controller: 'FeedCtrl',
          params : {
            shouldRefresh : false
          }
        }
      }
    })
  
  .state('tab.library', {
      url: '/library',
      views: {
        'library': {
          templateUrl: 'templates/library.html',
          controller: 'LibraryCtrl'
        }
      }
    })
  
  /*
   * Detail example
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })
    */
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/feed');

});
