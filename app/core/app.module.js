/**
* blisslistApp Module
* @namespace Modules
*/
(function(){
  'use strict';
  
  angular
    .module('blisslistApp', [
      'ngAnimate',
      'ngCookies',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngTouch',
      'ui.router',
      'ngMaterial',
      'blisslistApp.loading',
      'blisslistApp.list',
      'blisslistApp.details',
      'blisslistApp.share'
    ]);
})();
