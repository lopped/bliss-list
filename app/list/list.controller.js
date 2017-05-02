/**
* blisslistApp.list Controller
* @namespace Controllers
*/
(function(){
  'use strict';

  angular
    .module('blisslistApp.list')
    .controller('ListController', ListController);

  /**
  * @namespace ListController
  * @desc ListController function
  * @memberOf Controllers
  */
  ListController.$inject = ['$scope', '$state', '$timeout', '$window', 'dataFactory', 'listFactory'];
  function ListController($scope, $state, $timeout, $window, dataFactory, listFactory){
    var vm = this;
    
    vm.healthy = false;
    
    vm.search = '';
    vm.searchClicked = searchClicked;
    vm.typed = typed;
    
    vm.dismissed = true;
    vm.noResults = false;
    
    vm.dismiss = dismiss;
    vm.share = share;
    vm.showDetails = showDetails;
    
    vm.data = dataFactory;
    
    $scope.$on('$viewContentLoaded', function(){
      if(listFactory.doFocus){
        listFactory.doFocus = false;
        
        $timeout(function(){
          var element = $window.document.getElementsByTagName('input')[0];
          if(element){
            element.focus();
            vm.dismissed = false;
          }
        });
      } else if(!vm.search && vm.dismissed){
        var filter = $state.params.question_filter;
        
        if(filter){
          vm.search = filter;
          vm.dismissed = false;
        }
      }
    });
    
    /**
    * @desc sets the dismissed variable to false, if needed
    * @memberOf ListController
    */
    function searchClicked(){
      if(vm.dismissed) vm.dismissed = false;
    }
    
    /**
    * @desc applies the search to the list of items
    * @memberOf ListController
    */
    function typed(){
      if(!vm.search){
        if(vm.noResults) vm.noResults = false;
        dataFactory.search.page = dataFactory.search.list.length = dataFactory.search.all.length = 0;
        if($state.params.question_filter) $state.go('list', {question_filter: '' }, {notify: false});
      } else {
        dataFactory.connecting = true;
        dataFactory.getItems(0, vm.search, function(data){
          if(!data.length && !vm.noResults) vm.noResults = true;
          dataFactory.search.page = dataFactory.search.list.length = 0;
          dataFactory.search.all = data;
          
          dataFactory.setList(dataFactory.types.SEARCH);
          dataFactory.connecting = false;
        });
      }
    }
    
    /**
    * @desc dismisses the search feature
    * @memberOf ListController
    */
    function dismiss(){
      vm.search = '';
      typed();
      vm.dismissed = true;
    }
    
    /**
    * @desc navigates to the share view
    * @memberOf ListController
    */
    function share(){
      var url = $window.location.href;
      if(url.indexOf('question_filter=') === -1) url += '&question_filter=' + vm.search;
      $state.get('share').params.params.url = url;
      $state.go('share');
    }
    
    /**
    * @desc navigates to the details view with the item's details
    * @param {Object} item - item to present the details
    * @memberOf dataFactory
    */
    function showDetails(item){
      if(!dataFactory.connecting){
        $timeout(function(){
          $state.get('details').params.params.item = item;
          $state.go('details', { question_id: item.id });
        });
      }
    }
  }
})();
