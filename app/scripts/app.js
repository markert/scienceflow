'use strict';

/**
 * @ngdoc overview
 * @name sflowApp
 * @description
 * # sflowApp
 *
 * Main module of the application.
 */
angular
  .module('sflowApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "views/home.html",
        controller: "MainCtrl"
      })
      // Pages
      .when("/author", {
        templateUrl: "views/author.html",
        controller: "MainCtrl"
      })
      .when("/impressum", {
        templateUrl: "views/impressum.html",
        controller: "MainCtrl"
      })
      .when("/pricing", {
        templateUrl: "views/pricing.html",
        controller: "MainCtrl"
      })
      .when("/services", {
        templateUrl: "views/services.html",
        controller: "MainCtrl"
      })
      .when("/contact", {
        templateUrl: "views/contact.html",
        controller: "MainCtrl"
      })
      // Blog
      .when("/science", {
        templateUrl: "views/science.html",
        controller: "MainCtrl"
      })
      .when("/science_filters", {
        templateUrl: "views/science_filters.html",
        controller: "MainCtrl"
      })
      .when("/science_graphics", {
        templateUrl: "views/science_graphics.html",
        controller: "MainCtrl"
      })
      .when("/science_gps", {
        templateUrl: "views/science_gps.html",
        controller: "MainCtrl"
      })
      // else 404
      .otherwise("/404", {
        templateUrl: "views/404.html",
        controller: "MainCtrl"
      });
  });
