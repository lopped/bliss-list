/**
* blisslistApp Config
* @namespace Configs
*/
(function(){
  'use strict';
  
  angular
    .module('blisslistApp')
    .config(config);
  
  /**
  * @desc function containing the routing states
  * @memberOf Configs
  */
  config.$inject = ['$urlRouterProvider'];
  function config($urlRouterProvider){
    $urlRouterProvider.otherwise('/');
  }
})();
