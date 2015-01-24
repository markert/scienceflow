'use strict';

/**
 * @ngdoc function
 * @name websiteApp.controller:IirplotCtrl
 * @description
 * # IirplotCtrl
 * Controller of the websiteApp
 */
angular.module('sflowApp')
  .controller('IirplotCtrl', ['$scope', function ($scope) {
    var xSign = function (ctx, x, y, radius) {
      var size = radius * Math.sqrt(Math.PI) / 2;
      ctx.moveTo(x - size, y - size);
      ctx.lineTo(x + size, y + size);
      ctx.moveTo(x - size, y + size);
      ctx.lineTo(x + size, y - size);
    };
    var options = {
      xaxis: {
        min: -1,
        max: 1
      },
      yaxis: {
        min: -1,
        max: 1
      },
      grid: {
        markings: [{
          yaxis: {
            from: 0,
            to: 0
          },
          color: "#000"
        }, {
          xaxis: {
            from: 0,
            to: 0
          },
          color: "#000"
        }],
        markingsLineWidth: 1
      }
    };
    $scope.options = [];
    $scope.f = {};
    $scope.f.id = 0;
    $scope.f.plots = [];
    $scope.f.order = 1;
    $scope.f.ires = 20;
    $scope.f.type = [];
    $scope.f.characteristic = "butterworth";
    $scope.f.behavior = "lowpass";
    $scope.f.fs = 1000;
    $scope.f.fc = 100;

    $scope.f.iirCalculator = new CalcCascades();

    $scope.f.newFilter = function () {
      $scope.f.iirFilterCoeffs = $scope.f.iirCalculator[$scope.f.behavior]({
        order: $scope.f.order,
        characteristic: $scope.f.characteristic,
        Fs: $scope.f.fs,
        Fc: $scope.f.fc,
        gain: 0,
        preGain: false
      });

      $scope.f.filter = new IirFilter($scope.f.iirFilterCoeffs);
    };
    $scope.f.newFilter();
    var cnt;

    $scope.f.data = [];
    var colors = ['#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#00FFFF', '#00FFFF', '#FFFF00', '#33AACC', '#9988DD', '#ABCD22', '#DD33CC', '#FF8811'];
    $scope.f.switchType = function (id) {
      if ($scope.f.type[id] === 'polezero') {
        $scope.f.data[id].length = 0;
        $scope.options[id] = options;
        $scope.f.pz = $scope.f.filter.polesZeros();
        for (cnt = 0; cnt < $scope.f.pz.length; cnt++) {
          $scope.f.data[id][2 * cnt] = {
            data: [
              [$scope.f.pz[cnt].p[0].re, $scope.f.pz[cnt].p[0].im],
              [$scope.f.pz[cnt].p[1].re, $scope.f.pz[cnt].p[1].im]
            ],
            color: colors[cnt],
            points: {
              radius: 4,
              show: true,
              symbol: xSign
            }
          };
          $scope.f.data[id][2 * cnt + 1] = {
            data: [
              [$scope.f.pz[cnt].z[0].re, $scope.f.pz[cnt].z[0].im],
              [$scope.f.pz[cnt].z[1].re, $scope.f.pz[cnt].z[1].im]
            ],
            color: colors[cnt],
            points: {
              radius: 4,
              show: true
            }
          };
        }
      } else if ($scope.f.type[id] === 'magnitude') {
        $scope.f.response = $scope.f.filter.response(480);
        $scope.f.data[id].length = 0;
        var tempData = [];
        $scope.options[id] = {};
        for (cnt = 0; cnt < $scope.f.response.length; cnt++) {
          tempData.push([$scope.f.fs / 2 * cnt / $scope.f.response.length, $scope.f.response[cnt].magnitude]);
        }
        $scope.f.data[id] = [{
          data: tempData,
          color: '#FF0000',
          label: 'magnitude'
        }];
      } else if ($scope.f.type[id] === 'groupdelay') {
        $scope.f.response = $scope.f.filter.response(480);
        $scope.f.data[id].length = 0;
        var tempData = [];
        $scope.options[id] = {};
        for (cnt = 0; cnt < $scope.f.response.length; cnt++) {
          tempData.push([$scope.f.fs / 2 * cnt / $scope.f.response.length, $scope.f.response[cnt].groupDelay]);
        }
        $scope.f.data[id] = [{
          data: tempData,
          color: '#FF0000',
          label: 'group delay'
        }];
      } else if ($scope.f.type[id] === 'impulseresponse') {
        $scope.f.response = $scope.f.filter.impulseResponse($scope.f.ires);
        $scope.f.data[id].length = 0;
        var tempData = [];
        $scope.options[id] = {};
        for (cnt = 0; cnt < $scope.f.response.out.length; cnt++) {
          tempData.push([cnt, $scope.f.response.out[cnt]]);
        }
        $scope.f.data[id] = [{
          data: tempData,
          color: '#FF0000',
          label: 'impulse resp.'
        }];
      }
    };

  }]);
