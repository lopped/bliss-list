/**
* blisslistApp.details Controller
* @namespace Controllers
*/
(function(){
  'use strict';

  angular
    .module('blisslistApp.details')
    .controller('DetailsController', DetailsController);

  /**
  * @namespace DetailsController
  * @desc DetailsController function
  * @memberOf Controllers
  */
  DetailsController.$inject = ['$state', '$window', 'dataFactory', 'listFactory'];
  function DetailsController($state, $window, dataFactory, listFactory){
    var vm = this;
    
    vm.item = {};
    
    vm.goBack = goBack;
    vm.getDataString = getDataString;
    vm.updateItem = updateItem;
    
    vm.data = dataFactory;
    
    setup();
    
    function setup(){
      var item = $state.get('details').params.params.item;
    
      vm.item = item || {};
      
      if(!item){
        var id = $state.params.question_id;
        
        dataFactory.getItem(id, function(data){
          if(data){
            vm.item = data;
          } else {
            goBack();
          }
        });
      }
    }
    
    /**
    * @desc returns to the list view
    * @memberOf DetailsController
    */
    function goBack(){
      if(listFactory.isBack){
        history.back();
      } else {
        listFactory.isBack = true;
        $state.go('list');
      }
    }
    
    /**
    * @desc navigates to the share view
    * @memberOf DetailsController
    */
    function share(){
      var url = $window.location.href;
      if(url.indexOf('question_id=') === -1) url += '&question_id=' + $state.params.question_id;
      $state.get('share').params.params.url = url;
      $state.go('share');
    }
    
    /**
    * @desc updates an item on the remote database
    * @param {Number} value - position of the choice to update
    * @memberOf DetailsController
    */
    function updateItem(value){
      vm.item.choices[value].votes++;
      dataFactory.connecting = true;
      dataFactory.updateItem(vm.item, function(success){
        console.log(success);
        if(!success){
          vm.item.choices[value].votes--;
          dataFactory.showMessage('Voting was not successful.');
        }
        dataFactory.connecting = false;
      });
    }
    
    /**
    * @desc converts a date string into a formatted string
    * @param {String} date - date string
    * @returns {String} the converted date as a string
    * @memberOf DetailsController
    */
    function getDataString(date){
      if(angular.isString(date) && date.length >= 19 && /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}[\.0-9Z]*/.test(date)){
        var datetime = date.split(/[-T:.Z]{1}/);
        return [
          datetime[2], '-', datetime[1], '-', datetime[0],
          ' - ', datetime[3], ':', datetime[4], ':', datetime[5]
        ].join('');
      } else {
        return 'N/A';
      }
    }
  }
})();
