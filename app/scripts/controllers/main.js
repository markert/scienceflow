'use strict';

/**
 * @ngdoc function
 * @name sflowApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sflowApp
 */
angular.module('sflowApp')
  .controller('MainCtrl', function ($scope) {
    MathJax.Hub.Config({
      tex2jax: {
        inlineMath: [
          ['$', '$'],
          ['\\(', '\\)']
        ]
      }
    });
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  });
