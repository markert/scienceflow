'use strict';

describe('Controller: FirplotCtrl', function () {

  // load the controller's module
  beforeEach(module('sflowApp'));

  var FirplotCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FirplotCtrl = $controller('FirplotCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
