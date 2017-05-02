/**
* blisslistApp.details Config
* @namespace Configs
*/
(function(){
  'use strict';
  
  angular
    .module('blisslistApp.details')
    .config(config);
  
  /**
  * @desc function containing the routing states
  * @memberOf Configs
  */
  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('details', {
        url: '/questions?question_id',
        templateUrl: 'details/details.view.html',
        controller: 'DetailsController',
        controllerAs: 'vm',
        params: {
          params: {
            item: null
          }
        }
      });
  }
})();
