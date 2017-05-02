/**
* connection Factory
* @namespace Factories
*/
(function(){
  'use strict';

  angular
    .module('blisslistApp')
    .factory('dataFactory', dataFactory);

  /**
  * @desc dataFactory function
  * @returns {Object} an object with the functions to connect with the server and other data
  * @memberOf Factories
  */
  dataFactory.$inject = ['$http', '$mdToast', '$state', '$timeout', 'WEBSERVER', 'SERVERPATHS'];
  function dataFactory($http, $mdToast, $state, $timeout, WEBSERVER, SERVERPATHS){
    var timer = null;
    
    var factory = {
      connected: navigator.onLine,
      
      checked: false,
      healthy: false,
      
      types: {
        MAIN: 'main',
        SEARCH: 'search'
      },
      
      prevPage: prevPage,
      nextPage: nextPage,
      setList: setList,
      
      showMessage: showMessage,
      
      getHealth: getHealth,
      getItems: getItems,
      getItem: getItem,
      updateItem: updateItem,
      shareUrl: shareUrl
    };
    
    factory[factory.types.MAIN] = {
      page: 0,
      list: [],
      all: []
    };
    factory[factory.types.SEARCH] = {
      page: 0,
      list: [],
      all: []
    };
    
    checkConnection();

    return factory;
    
    /**
    * @desc sets a timer to check internet connection status (chrome browser only)
    * @memberOf dataFactory
    */
    function checkConnection(){
      function isChrome(){
        var isChromium = window.chrome;
        var windownav = window.navigator;
        var vendor = windownav.vendor;
        var isOpera = windownav.userAgent.indexOf('OPR') !== -1;
        var isIEedge = windownav.userAgent.indexOf('Edge') !== -1;
        var isIOSChrome = windownav.userAgent.match('CriOS');

        return isIOSChrome || (isChromium !== null && isChromium !== undefined && vendor === "Google Inc." && !isOpera && !isIEedge);
      }
      
      function check(){
        if(factory.connected !== navigator.onLine){
          factory.connected = !factory.connected;
          if(factory.connected && !factory.checked){
            getHealth();
          }
        }
        
        checkConnection();
      }
      
      if(isChrome()) timer = $timeout(check, 2000);
    }
  
    /**
    * @desc checks the remote database health status
    * @memberOf dataFactory
    */
    function getHealth(){
      function getStatus(runFunction){
        $http.get(WEBSERVER + SERVERPATHS.health).then(function(data){
          runFunction(!!data && data.status === 200);
        }).catch(function(error){
          runFunction(false);
        });
      }
      
      if(factory.connected){
        getStatus(function(success){
          if(success){
            factory.healthy = true;
            
            var hasItems = false;
            var timedOut = false;
            
            var timer = $timeout(function(){
              timedOut = true;
              if(hasItems){
                factory.checked = true;
                $state.go('list');
              }
            }, 1000);
            
            factory.getItems(0, '', function(data){
              factory.main.all = data;
              factory.setList(factory.types.MAIN);
              hasItems = true;
              if(timedOut){
                factory.checked = true;
                $state.go('list');
              }
            });
          } else {
            showMessage('The server is not OK. Try again.', true, function(){
              getHealth();
            });
          }
        });
      }
    }

    /**
    * @desc retrieves 10 (or less) items from the remote database
    * @param {Number} offset - offset of the required items
    * @param {Function} runFunction - callback function
    * @memberOf dataFactory
    */
    function getItems(offset, filter, runFunction){
      var address = [WEBSERVER, SERVERPATHS.items, '&offset=', offset];
      if(filter) address.push('&filter=', filter);
      
      $http.get(address.join('')).then(function(data){
        runFunction(data && data.status === 200 && data.data.length ? data.data : []);
      }).catch(function(error){
        runFunction([]);
      });
    }
    
    /**
    * @desc retrieves an item from the remote database
    * @param {String} id - id of the item
    * @param {Function} runFunction - callback function
    * @memberOf dataFactory
    */
    function getItem(id, runFunction){
      var address = [WEBSERVER, SERVERPATHS.item, id].join('');
      
      $http.get(address).then(function(data){
        runFunction(data && data.status === 200 && data.data ? data.data : null);
      }).catch(function(error){
        runFunction(null);
      });
    }

    /**
    * @desc updates an item on the remote database
    * @param {Object} item - item to be updated
    * @param {Function} runFunction - callback function
    * @memberOf dataFactory
    */
    function updateItem(item, runFunction){
      var address = [WEBSERVER, SERVERPATHS.updateItem, item.id].join('');
      
      $http.put(address, item).then(function(data){
        runFunction(data && data.status === 201);
      }).catch(function(error){
        runFunction(false);
      });
    }
    
    /**
    * @desc updates an item on the remote database
    * @param {String} email - email to send
    * @param {String} url - url to send
    * @param {Function} runFunction - callback function
    * @memberOf dataFactory
    */
    function shareUrl(email, url, runFunction){
      var address = [WEBSERVER, SERVERPATHS.share, encodeURIComponent(email), '&content_url=', encodeURIComponent(url)].join('');
      
      $http.post(address).then(function(data){
        runFunction(data && data.status === 200);
      }).catch(function(error){
        runFunction(false);
      });
    }
    
    /**
    * @desc shows the previous 10 items on a list
    * @param {String} type - type of list to update the items
    * @memberOf dataFactory
    */
    function prevPage(type){
      factory[type].page--;
      setList(type);
    }
    
    /**
    * @desc shows the next 10 items on a list
    * @param {String} type - type of list to update the items
    * @param {String} search - filter value to apply on the list
    * @memberOf dataFactory
    */
    function nextPage(type, search){
      if(factory[type].all.length < factory[type].list.length + 10 * factory[type].page){
        factory[type].page++;
        setList(type);
      } else {
        factory.connecting = true;
        factory.getItems((factory[type].page + 1) * 10, search ? search : '', function(data){
          if(data.length){
            factory[type].all.push.apply(factory[type].all, data);
            factory[type].page++;
            setList(type);
          }
          factory.connecting = false;
        });
      }
    }
    
    /**
    * @desc sets a list on the list view
    * @param {String} type - type of list to set
    * @memberOf dataFactory
    */
    function setList(type){
      var offset = factory[type].page * 10;
      var length = 10;
      if(factory[type].all.length - offset < 10){
        length = factory[type].all.length - offset;
        factory[type].list.length = length;
      }
      
      while(length--){
        factory[type].list[length] = factory[type].all[length + offset];
      }
    }
    
    /**
    * @desc shows a toast message
    * @param {String} message - message to show
    * @param {String} okAction - if the message showld wait for the user input
    * @param {Function} runFunction - callback function
    * @memberOf dataFactory
    */
    function showMessage(message, okAction, runFunction){
      $mdToast.show(
        $mdToast.simple()
          .textContent(message)
          .hideDelay(okAction ? 0 : 3000)
          .action('OK')
          .highlightAction(true)
      ).then(function(){
        if(okAction) runFunction();
      });
    }
  }
})();
