'use strict';

/**
 * @ngdoc directive
 * @name sflowApp.directive:wegbl
 * @description
 * # wegbl
 */
angular.module('sflowApp')
  .directive('wegbl', function () {
    return {
      template: '<canvas></canvas><p></p>',
      restrict: 'E',
      scope: {
        type: '@',
        ttp: '=',
        sin: '=',
        w: '@',
        bw: '=',
        h: '@',
        td: '@'
      },
      link: function postLink(scope, element, attrs) {
        var phaseShift = 0;
        var phaseDrift = Math.PI;
        var ampl = 0.8;
        var cnt = 0;
        var w = scope.w;
        var h = scope.h;
        var fftsize = 2 * h;
        if (w > h) {
          fftsize = 2 * w;
        }
        var fft = new Fft(fftsize);
        var frequency = fftsize * Math.random();
        var frequency2 = fftsize * Math.random();
        var tpi = 2 * Math.PI;

        var fftArray = [];
        var d = [];
        var db = [];
        var viewport = {
          translate: {
            x: -0.0,
            y: 0,
            z: -0.6
          },
          rotate: {
            x: 2.3,
            y: 3.1,
            z: 0
          },
          aspectRatio: 1,
          scaling: 0.7,
          distance: 1.1,
          plane: {
            far: 1,
            near: -1
          }

        };

        var viewportr = {
          translate: {
            x: 0.0,
            y: 0,
            z: 0
          },
          rotate: {
            x: 0,
            y: 0,
            z: Math.PI / 2
          },
          aspectRatio: 1,
          scaling: 1.0,
          distance: 1.0,
          plane: {
            far: 1,
            near: -1
          }

        };

        var getTime = function () {
          if (performance && performance.now) {
            return performance.now();
          }
          return 1;
        };

        var textStyle = {
          font: '18px/30px Arial, serif',
          fill: '#000000',
          stroke: '#000000',
          plane: 'n',
          pos: [0.0, 0.0, 0.0]
        };
        scope.canvas = element.find('canvas')[0];
        scope.p = element.find('p')[0];
        scope.ctx = createWebglContext(scope.canvas, {
          types: ['webgl', 'experimental-webgl'],
          attrs: {
            antialias: true
          }
        });

        scope.renderSineWave = function () {};
        scope.renderSineHeatmap = function () {};
        scope.renderFftWaterfall = function () {};
        scope.renderText = function () {};
        scope.run = function () {
          if ((scope.type === 'line' && !scope.sin) || (scope.type === 'heatmap' && !scope.sin) || scope.type === 'waterfall') {
            fftArray.length = 0;
            for (cnt = 0; cnt < fftsize; cnt++) {
              fftArray.push(Math.sin(frequency * Math.PI * (phaseShift + (cnt) / (fftsize))) + 0.001 * Math.sin(frequency2 * Math.PI * (phaseShift + (cnt) / (fftsize))) + Math.random() / 100000);
            }
            var res = fft.forward(fftArray, 'hanning');
            res[0] = 0;
            res[fftsize - 1] = 0;
            db = fft.magToDb(fft.magnitude(res));
            var max = -Number.MAX_VALUE;
            for (cnt = 0; cnt < fftsize; cnt++) {
              if (db[cnt] > max) {
                max = db[cnt];
              }
            }
            for (cnt = 0; cnt < fftsize; cnt++) {
              db[cnt] -= max;
            }
            var nf = w;
            if (scope.type === 'waterfall') {
              nf = h;
            }
            for (cnt = 0; cnt < nf; cnt++) {
              d[cnt] = (180 + db[cnt]) / 180;
            }
          }
          var time = getTime();
          scope.renderSineWave();
          scope.renderSineHeatmap();
          scope.renderFftWaterfall();
          scope.renderText();
          var tnum = getTime() - time;
          if (scope.ttp === 0) {
            scope.ttp = 10;
          } else {
            scope.ttp = tnum * 0.04 + scope.ttp * 0.96;
          }
          scope.p.innerHTML = 'time to render: ' + scope.ttp.toFixed(2) + 'ms';
          phaseShift = (phaseShift + Math.PI / w) % (128 * Math.PI);
          var sign = Math.random();
          if (sign > 0.5) {
            phaseDrift += Math.random() / 500 * Math.PI;
            ampl += (Math.random() / 50);
            frequency = (frequency - 1) % fftsize;
            frequency2 = (frequency2 - 0.5) % fftsize;
          } else {
            phaseDrift -= Math.random() / 500 * Math.PI;
            ampl -= (Math.random() / 50);
            frequency = (frequency + 0.5) % fftsize;
            frequency2 = (frequency2 + 1) % fftsize;
          }
          if (ampl > 1) {
            ampl = 1;
          } else if (ampl < 0) {
            ampl = 0;
          }
          w = scope.w;
          h = scope.h;
          setTimeout(function () {
            requestAnimationFrame(scope.run);
          }, 50);
        };
        if (scope.type === 'line') {
          scope.lineRenderer = attachPloygonShader(scope.ctx);
          var p = [];
          var c = [];
          var sinl = function () {
            p.length = 0;
            c.length = 0;
            for (cnt = 0; cnt < w; cnt++) {
              p.push((2 * cnt) / (w) - 1);
              p.push(Math.sin(tpi * (phaseShift + (cnt) / (w))));
              c.push(cnt / w);
              c.push((w - cnt) / w);
              c.push(cnt / w);
            }

            scope.lineRenderer.draw(p, c, 'LINE_STRIP');
          };
          var fftl = function () {
            p.length = 0;
            c.length = 0;
            for (cnt = 0; cnt < w; cnt++) {
              p.push((2 * cnt) / (w) - 1);
              p.push(d[cnt] * 2 - 1);
              c.push(cnt / w);
              c.push((w - cnt) / w);
              c.push((w - cnt) / w);
            }

            scope.lineRenderer.draw(p, c, 'LINE_STRIP');
          };
          scope.renderSineWave = sinl;

        } else if (scope.type === 'heatmap') {
          scope.heatmapRenderer = attachHeatmapShader(scope.ctx, {
            x: scope.w,
            y: scope.h
          });
          scope.heatmapRenderer.setPointSize(2);
          if (scope.td) {
            scope.heatmapRenderer.transform(viewport);
          }
          var fftr = function () {
            scope.heatmapRenderer.age(0.005);
            var i = 0.1;
            var w2 = w / 2;
            var h180 = h / 180;

            var yPrev = (Math.sin(tpi * (phaseShift + (0) / (w)) + Math.PI) * w2 + w2);
            for (cnt = 1; cnt < w; cnt++) {
              var x = cnt;
              var y = -((db[cnt] - 10) * h180);
              scope.heatmapRenderer.setPixel(x, Math.floor(y), i);
            }
            if (scope.bw) {
              scope.heatmapRenderer.drawBw('POINTS');
            } else {
              scope.heatmapRenderer.drawC('POINTS');
            }
          };

          var sinr = function () {
            scope.heatmapRenderer.age(0.009);
            var i = 0.4;
            var h2 = h / 2;

            var yPrev = (Math.sin(2 * Math.PI * (phaseShift + (0) / (h)) + Math.PI) * h2 + h2);
            for (cnt = 1; cnt < w; cnt++) {
              var x = cnt;
              var y = (Math.sin(2 * Math.PI * (phaseShift + (cnt) / (h)) + Math.PI) * h2 + h2);
              var yDiff = y - yPrev;
              for (var j = 0; j < Math.floor(Math.abs(yDiff)); j++) {
                if (yDiff >= 0) {
                  scope.heatmapRenderer.setPixel(x, Math.floor(y + j), i);
                } else if (yDiff < 0) {
                  scope.heatmapRenderer.setPixel(x, Math.floor(y - j), i);
                }
              }
              yPrev = y;
            }
            if (scope.bw) {
              scope.heatmapRenderer.drawBw('POINTS');
            } else {
              scope.heatmapRenderer.drawC('POINTS');
            }
          };
          scope.renderSineHeatmap = fftr;
          scope.$watch('sin', function (newValue) {
            scope.heatmapRenderer.reinitBuffer(w, h);
            if (!newValue) {
              scope.renderSineHeatmap = fftr;
            } else {
              scope.renderSineHeatmap = sinr;
            }
          });
        } else if (scope.type === 'waterfall') {
          scope.waterfallRenderer = attachWaterfallShader(scope.ctx, {
            x: scope.w,
            y: scope.h
          });
          if (scope.td) {
            scope.waterfallRenderer.transform(viewport);
          } else {
            scope.waterfallRenderer.transform(viewportr);
          }
          scope.renderFftWaterfall = function () {
            scope.waterfallRenderer.setColumn(d);
            if (scope.bw) {
              scope.waterfallRenderer.drawBw('POINTS');
            } else {
              scope.waterfallRenderer.drawC('POINTS');
            }
          };

        } else if (scope.type === 'texture') {
          scope.textRenderer = attachTextureShader(scope.ctx);
          scope.textRenderer.setTextureSize(256, 256);
          scope.renderText = function () {
            textStyle.pos = [-0.2, 0.0, 0.0];
            scope.textRenderer.writeText('webgl text', textStyle);
          };

        }
        requestAnimationFrame(scope.run);
        scope.$watch('sin', function (newValue) {
          if (scope.heatmapRenderer) {
            scope.heatmapRenderer.reinitBuffer(w, h);
          }
          if (!newValue) {
            if (scope.lineRenderer) {
              scope.renderSineWave = fftl;
            }
            if (scope.heatmapRenderer) {
              scope.renderSineHeatmap = fftr;
            }
          } else {
            if (scope.lineRenderer) {
              scope.renderSineWave = sinl;
            }
            if (scope.heatmapRenderer) {
              scope.renderSineHeatmap = sinr;
            }
          }
        });
      }
    };
  });
