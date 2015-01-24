'use strict';

describe('Directive: wegbl', function () {

  // load the directive's module
  beforeEach(module('sflowApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<wegbl></wegbl>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the wegbl directive');
  }));
});
