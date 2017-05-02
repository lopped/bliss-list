/**
* blisslistApp.share Controller
* @namespace Controllers
*/
(function(){
  'use strict';

  angular
    .module('blisslistApp.share')
    .controller('ShareController', ShareController);

  /**
  * @namespace ShareController
  * @desc ShareController function
  * @memberOf Controllers
  */
  ShareController.$inject = ['$state', 'dataFactory'];
  function ShareController($state, dataFactory){
    var vm = this;
    
    vm.url = $state.get('share').params.params.url || '';
    vm.email = '';
    
    vm.share = share;
    vm.cancel = cancel;
    
    vm.data = dataFactory;
    
    /**
    * @desc sends the share request to the remote server
    * @memberOf ShareController
    */
    function share(){
      if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(vm.email)){
        dataFactory.connecting = true;
        dataFactory.shareUrl(vm.email, vm.url, function(success){
          if(success){
            cancel();
          } else {
            dataFactory.showMessage('Sharing the url was not successful.');
          }
          dataFactory.connecting = false;
        });
      } else {
        dataFactory.showMessage('Not a valid e-mail address.');
      }
    }
    
    /**
    * @desc returns to the previous view
    * @memberOf ShareController
    */
    function cancel(){
      history.back();
      vm.url = '';
      vm.email = '';
    }
  }
})();
