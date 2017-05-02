/**
* data Factory
* @namespace Factories
*/
(function(){
  'use strict';

  angular
    .module('blisslistApp.list')
    .factory('listFactory', listFactory);

  /**
  * @desc listFactory function
  * @returns {Object} an object with the list module variables
  * @memberOf Factories
  */
  listFactory.$inject = ['$timeout', '$window'];
  function listFactory($timeout, $window){
    var factory = {
      doFocus: false,       //if the search field is to be focused
      isBack: true          //is the list view is the back view when in the details view
    }
    
    return factory;
  }
})();
