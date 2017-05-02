/**
* blisslistApp.loading Config
* @namespace Configs
*/
(function(){
  'use strict';
  
  angular
    .module('blisslistApp.loading')
    .config(config);
  
  /**
  * @desc function containing the routing states
  * @memberOf Configs
  */
  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('loading', {
        url: '/',
        templateUrl: 'loading/loading.view.html',
        controller: 'LoadingController',
        controllerAs: 'vm'
      });
  }
})();
