'use strict';

/**
 * @ngdoc directive
 * @name websiteApp.directive:flotCanvas
 * @description
 * # flotCanvas
 */
angular.module('sflowApp')
  .directive('flotCanvas', function () {
    return {
      restrict: 'E',
      scope: {
        f: '=',
        type: '@',
        characteristic: '@',
        behavior: '@',
        options: '='
      },
      link: function (scope, element, attrs) {
        var id = scope.f.id;
        scope.f.type[id] = scope.type || 'magnitude';
        scope.f.characteristic = scope.characteristic || 'butterworth';
        scope.f.behavior = scope.behavior || 'lowpass';
        scope.f.data[id] = [];
        scope.draw = function () {
          if (!scope.f.plots[id]) {
            scope.f.plots[id] = $.plot(element, scope.f.data[id], scope.options[id]);
            element.show();
          } else {
            scope.f.plots[id].setData(scope.f.data[id]);
            scope.f.plots[id].setupGrid();
            scope.f.plots[id].draw();
          }

        };
        scope.f.switchType(id);
        scope.f.id++;
        scope.$watch('f.type', function (newValue) {
          if (!newValue) {
            return;
          }

          scope.f.switchType(id);
          scope.draw();
        });
        scope.$watch('f.fs', function (newValue) {
          if (!newValue) {
            return;
          }
          scope.f.newFilter();
          scope.f.switchType(id);
          scope.draw();
        });
        scope.$watch('f.fc', function (newValue) {
          if (!newValue) {
            return;
          }
          scope.f.newFilter();
          scope.f.switchType(id);
          scope.draw();
        });
        scope.$watch('f.characteristic', function (newValue) {
          if (!newValue) {
            return;
          }
          scope.f.newFilter();
          scope.f.switchType(id);
          scope.draw();
        });
        scope.$watch('f.behavior', function (newValue) {
          if (!newValue) {
            return;
          }
          scope.f.newFilter();
          scope.f.switchType(id);
          scope.draw();
        });
        scope.$watch('f.order', function (newValue) {
          if (!newValue) {
            return;
          }
          scope.f.newFilter();
          scope.f.switchType(id);
          scope.draw();
        });
      }
    };
  });
