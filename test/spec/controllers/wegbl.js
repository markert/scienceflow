'use strict';

describe('Controller: WegblCtrl', function () {

  // load the controller's module
  beforeEach(module('sflowApp'));

  var WegblCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    WegblCtrl = $controller('WegblCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
