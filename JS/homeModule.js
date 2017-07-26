(function () {

    "use strict";








    // Creating the Module (homeModule): 
    var home = angular.module("homeModule", ['ngCookies', 'ngYoutubeEmbed']);






    //my global functions
    home.factory('globalfunction', ['$http', '$cookieStore', '$location', function ($http, $cookieStore, $location) {
        return {
            //function logout,remove from cookies and change the flag "login" to false


            videoObj: {}




        };
    }]);



    //Home controller
    home.controller("HomeController", ["$scope", "$http", function ($scope, $http) {









    }]);



    //login controller
    home.controller("LoginController", ["$scope", "$http", "$location", '$rootScope', '$cookieStore', function ($scope, $http, $location, $rootScope, $cookieStore) {


        //active link in the menu
        $scope.homeActive = "";
        $scope.playlistActive = "";
        $scope.loginActive = "active";
        $scope.registerActive = "";




        $scope.login = function () {


            var userName = $scope.username;
            var userPassword = $scope.password;

            $http({
                url: '/logIn/' + userName + '/' + userPassword,
                method: "GET"
            }).then(function (response) {

                //server result, if found username true else false
                var logResult = response.data;

                if (logResult == "true") {


                    var now = new Date();
                    var exp = new Date(now.getTime() + 1);

                    //saving the login for a day

                    $cookieStore.put('userName', userName, { 'expires': exp });


                    $location.path('/playlist');

                }
                else {
                    $scope.logInError = "Sorry, username or password not found ";

                }


            }, function errorCallback(response) {
                console.log(response);

            });

        }


    }]);









    //register controller
    home.controller("RegisterController", ["$scope", "$http", "$location", '$cookieStore', function ($scope, $http, $location, $cookieStore) {

        //active link in the menu
        $scope.homeActive = "";
        $scope.playlistActive = "";
        $scope.loginActive = "";
        $scope.registerActive = "active";




        //register function
        $scope.registerUser = function () {

            var userName = $scope.usernameReg;
            var userPassword = $scope.passwordReg;





            $http.post('/register', { 'userName': userName, 'password': userPassword })
               .then(
                   function (response) {

                       if (response.data == "False") {
                           alert("User already exists");
                       }
                       else {
                           
                           $location.path('/login');
                       }
                   },
                   function (response) {
                       console.log(response);
                   }
                );



        }





    }]);



    //playlist controller
    home.controller("PlaylistController", ["$scope", "$http", "globalfunction", "$location", '$cookieStore', "$route", function ($scope, $http, globalfunction, $location, $cookieStore, $route) {

        //active link in the menu
        $scope.homeActive = "";
        $scope.playlistActive = "active";
        $scope.loginActive = "";
        $scope.registerActive = "";

        $scope.isThereVideo = function () {
            return ($scope.videoURL == undefined);
        }

        //get the username to load the playlist
        var userName = $cookieStore.get('userName');



        $http({
            url: '/playlist/' + userName,
            method: "GET"
        }).then(function (response) {

            //server result, array of obj video data
            var arrPlaylist = response.data;


            $scope.playlist = arrPlaylist;
            $scope.videoURL = arrPlaylist[0].link;



        }, function (response) {
            console.log(response);

        });



        $scope.addVideo = function () {
            $location.path('/addvideo');

        }



        $scope.playVideo = function (url) {

            $scope.videoURL = url;

        }

        $scope.editVideo = function (video) {

            globalfunction.videoObj = video;
            $location.path('/editvideo');

        }

        $scope.deleteVideo = function (videoID) {

            $http({
                url: '/deleteVideo/' + videoID,
                method: "DELETE"
            }).then(function (response) {

                $route.reload();


            }, function (response) {
                console.log(response);




            })

        }




    }]);



    //Add new video controller
    home.controller("AddvideoController", ["$scope", "$http", "$location", '$cookieStore', function ($scope, $http, $location, $cookieStore) {

        $scope.category = [{ name: "Pop", id: 1 }, { name: "Classic", id: 2 }, { name: "Trance", id: 3 }, { name: "Grunge", id: 4 }, { name: "Jazz", id: 5 }, { name: "Opera", id: 6 }, { name: "Hip Hop", id: 7 }, { name: "Relax", id: 8 }, { name: "Rock", id: 9 }];
        $scope.selectedOption = $scope.category[0];

        $scope.addVideo = function () {

            //get the username to load the playlist
            var userName = $cookieStore.get('userName');

            var title = $scope.title;
            var link = $scope.link;
            var category = $scope.selectedOption;
            var description = $scope.description;







            $http.post('/addNewVideo', { 'userName': userName, 'title': title, 'link': link, 'category': category, 'description': description })
               .then(
                   function (response) {

                   },
                   function (response) {
                       console.log(response);
                   }
                );

            $location.path('/playlist');


        }











    }]);



    //Edit video controller
    home.controller("EditvideoController", ["$scope", "$http", "globalfunction", "$location", function ($scope, $http, globalfunction, $location) {

        $scope.category = [{ name: "Pop", id: 1 }, { name: "Classic", id: 2 }, { name: "Trance", id: 3 }, { name: "Grunge", id: 4 }, { name: "Jazz", id: 5 }, { name: "Opera", id: 6 }, { name: "Hip Hop", id: 7 }, { name: "Relax", id: 8 }, { name: "Rock", id: 9 }];



        var editVideo = globalfunction.videoObj;

        $scope.title = editVideo.title;
        $scope.link = editVideo.link;
        $scope.selectedOption = $scope.category[editVideo.category.id - 1];
        $scope.description = editVideo.description;


        $scope.EditVideo = function () {


            var title = $scope.title;
            var link = $scope.link;
            var category = $scope.selectedOption;
            var description = $scope.description;
            var videoID = editVideo._id;

            $http({
                url: '/Edit/' + videoID,
                method: "PUT",
                data: {

                    'title': title, 'link': link, 'category': category, 'description': description


                }
            }).then(function (response) {

                $location.path('/playlist');

            },
            function (response) {
                console.log(response);

            });

        };



    }]);






})();