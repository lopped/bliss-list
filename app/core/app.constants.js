/**
* blisslistApp Constants
* @namespace Constants
*/
(function(){
  'use strict';

  angular
    .module('blisslistApp')
    .constant('WEBSERVER', 'https://private-anon-58d03c8e12-blissrecruitmentapi.apiary-mock.com')
    .constant('SERVERPATHS', {
      health: '/health',
      items: '/questions?limit=10',
      item: '/questions/',
      updateItem: '/questions/',
      share: '/share?destination_email='
    });
})();
