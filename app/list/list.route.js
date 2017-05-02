/**
* blisslistApp.list Config
* @namespace Configs
*/
(function(){
  'use strict';
  
  angular
    .module('blisslistApp.list')
    .config(config);
  
  /**
  * @desc function containing the routing states
  * @memberOf Configs
  */
  config.$inject = ['$stateProvider'];
  function config($stateProvider){
    $stateProvider
      .state('list', {
        url: '/questions?question_filter',
        templateUrl: 'list/list.view.html',
        controller: 'ListController',
        controllerAs: 'vm'
      });
  }
})();
