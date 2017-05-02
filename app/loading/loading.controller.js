/**
* blisslistApp.loading Controller
* @namespace Controllers
*/
(function(){
  'use strict';

  angular
    .module('blisslistApp.loading')
    .controller('LoadingController', LoadingController);

  /**
  * @namespace LoadingController
  * @desc LoadingController function
  * @memberOf Controllers
  */
  LoadingController.$inject = ['dataFactory'];
  function LoadingController(dataFactory){
    var vm = this;
    
    vm.data = dataFactory;
    
    if(!vm.data.checked) dataFactory.getHealth();
  }
})();
