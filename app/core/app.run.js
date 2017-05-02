/**
* blisslistApp Run
* @namespace Run
*/
(function(){
  'use strict';

  angular
    .module('blisslistApp')
    .run(runStateChange);

  /**
  * @desc function containing the stateChangeStart procedure
  * @memberOf Run
  */
  runStateChange.$inject = ['$rootScope', '$state', '$timeout', '$window', 'dataFactory', 'listFactory'];
  function runStateChange($rootScope, $state, $timeout, $window, dataFactory, listFactory){
    $rootScope.$on('$stateChangeStart', function(e, toState, toParams){
      if(toState.name.indexOf('loading') === 0){       //loading view
        if(dataFactory.checked) e.preventDefault();
      } else if(!dataFactory.checked){
        if(toState.name.indexOf('details') === 0 || $window.location.hash.indexOf('question_id=') !== -1){  //details view
          if(!dataFactory.checked){
            var hashD = $window.location.hash;
            var idPos = hashD.indexOf('question_id=') + 12;
            
            if(idPos < hashD.length){
              var nr = parseInt(hashD.substring(idPos), 10);
              
              if(nr && nr.toString().length === hashD.length - idPos){
                dataFactory.healthy = true;
                dataFactory.checked = true;
                
                listFactory.isBack = false;
                
                dataFactory.connecting = true;
                dataFactory.getItems(0, '', function(data){
                  dataFactory.main.all = data;
                  dataFactory.setList(dataFactory.types.MAIN);
                  dataFactory.connecting = false;
                });
                
                if(toState.name.indexOf('details') !== 0){
                  e.preventDefault();
                  $timeout(function(){
                    $state.go('details', { question_id: hashD.substring(idPos)});
                  });
                }
              } else {
                e.preventDefault();
                $state.go('loading');
              }
            } else {
              e.preventDefault();
              $state.go('loading');
            }
          }
        } else if(toState.name.indexOf('list') === 0 || $window.location.hash.indexOf('question_filter=') !== -1){  //list view
          if(!dataFactory.checked){
            dataFactory.healthy = true;
            dataFactory.checked = true;
            
            var hash = $window.location.hash;
            var filterPos = hash.indexOf('question_filter=') + 16;
            
            dataFactory.connecting = true;
            
            dataFactory.getItems(0, '', function(data){
              dataFactory.main.all = data;
              dataFactory.setList(dataFactory.types.MAIN);
              
              if(filterPos === 29){
                if(filterPos < hash.length){
                  dataFactory.getItems(0, hash.substring(filterPos), function(results){
                    dataFactory.search.all = data;
                    dataFactory.setList(dataFactory.types.SEARCH);
                    dataFactory.connecting = false;
                  });
                } else {
                  dataFactory.connecting = false;
                  listFactory.doFocus = true;
                }
              } else {
                dataFactory.connecting = false;
              }
            });
            
            if(toState.name.indexOf('list') !== 0){
              e.preventDefault();
              $timeout(function(){
                $state.go('list', { question_filter: hash.substring(filterPos)});
              });
            }
          }
        } else {
          e.preventDefault();
          $state.go('loading');
        }
      }
    });
  }
})();
