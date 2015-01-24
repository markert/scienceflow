'use strict';

describe('Directive: flotCanvas', function () {

  // load the directive's module
  beforeEach(module('sflowApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<flot-canvas></flot-canvas>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the flotCanvas directive');
  }));
});
