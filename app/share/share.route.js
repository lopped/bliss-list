/**
* blisslistApp.share Config
* @namespace Configs
*/
(function(){
  'use strict';
  
  angular
    .module('blisslistApp.share')
    .config(config);
  
  /**
  * @desc function containing the routing states
  * @memberOf Configs
  */
  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('share', {
        url: '/share',
        templateUrl: 'share/share.view.html',
        controller: 'ShareController',
        controllerAs: 'vm',
        params: {
          params: {
            url: null
          }
        }
      });
  }
})();
