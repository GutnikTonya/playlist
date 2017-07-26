(function(){

    "use strict";

 



    var appModule = angular.module("appModule", ["ngRoute", "homeModule", "ngCookies"]);
  
    var onlyLoggedIn = function ($cookieStore, $location) {

        var userName = $cookieStore.get('userName');
       

        if (userName != undefined) {
          

        } else {
            
            $location.path('/login');    //redirect user to login page if not login.

        }

    };



    //controller for the index html
    appModule.controller('HeaderController', function ($scope, $location, $cookieStore, $http) {

        
        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

        $scope.showLogout = function () {
            return ($location.path() == '/playlist' || $location.path() == '/addvideo' || $location.path() == '/editvideo');

        }


        $scope.logout = function () {
          
            $cookieStore.remove('userName');

            $http.post('/logout')
                   .then(
                       function (response) {

                           console.log("logout successful");

                       },
                       function (response) {
                           console.log(response);
                       }
                    );

            $location.path('/login');
        }




    });
    
    


    appModule.config(["$routeProvider", function ($routeProvider ) {

        //home route
        $routeProvider.when("/home", {
            templateUrl: "html/homeView.html",
            controller: "HomeController",
            css: "CSS/site.css",


        });


        //login route
        $routeProvider.when("/login", {
            templateUrl: "html/loginView.html",
            controller: "LoginController",
            css: "CSS/site.css",

            
        });


        //register route
        $routeProvider.when("/register", {
            templateUrl: "html/registerView.html",
            controller: "RegisterController",
            css: "CSS/site.css",


        });




        //playlist route
        $routeProvider.when("/playlist", {
            templateUrl: "html/playlistView.html",
            controller: "PlaylistController",
            css: "CSS/site.css",

            resolve: {
             
                "check": onlyLoggedIn
            }

        });


        //add new video route
        $routeProvider.when("/addvideo", {
            templateUrl: "html/addvideoView.html",
            controller: "AddvideoController",
            css: "CSS/site.css",

            resolve: {

                "check": onlyLoggedIn
            }
        });



        //Edit Video
        $routeProvider.when("/editvideo", {
            templateUrl: "html/editvideoView.html",
            controller: "EditvideoController",
            css: "CSS/site.css",

            resolve: {

                "check": onlyLoggedIn
            }
        });




        $routeProvider.otherwise({
            redirectTo: "/home"
        });

    }]);









})();