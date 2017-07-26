

var express = require("express");
var bodyParser = require("body-parser"); 
var mongoose = require("mongoose");
var app = express();

var isLogin = false;

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 

app.use(express.static(__dirname));

mongoose.connect("mongodb://localhost:27017/PlayListDB", function (err) {
    if (err) {
        console.log("Error " + err);
    }
    else {
        console.log("Connected to mongoDB.");

    }

});


var UserData = mongoose.model("UserData", {

    userName: String,
    password: String

});


var UserPlayList = mongoose.model("UserPlayList", {

    userName: String,
    title: String,
    category: {
        name: String,
        id: Number
    },
    description: String,
    link: String

});



//Add new user
app.post("/register", function (request, response) {

    UserData.findOne({ userName: request.body.userName }).exec(function (err, user) {
        //error with the connection
        if (err) {
           

            response.send(err);

        }
         //if user doesn't exists, add new
        else if (user == null) {
            

            var newUser = new UserData();

            newUser.userName = request.body.userName;
            newUser.password = request.body.password;

            newUser.save();

            response.status(201);
            response.send(newUser);
        
        }
            //if exists response false
        else {
            response.send("False");
        
        }

});
});


    
    //logIn
app.get("/logIn/:userName/:password", function (request, response) {
      
    
        console.log(request.params.userName);
        
        UserData.findOne({ userName: request.params.userName }, function (err, user) {
            if (err) {

            Console.log("No connection");
            response.send("False");
            

            
        }
        else if (user == null) {
            response.send("False");
        }
        else {
           
            if (user.password == request.params.password) {
                isLogin = true;
                response.send("true");

            }
            else {
                response.send("False");

            }
           
                }
    });

});




app.post("/logout", function (request, response) {


    isLogin = false;
    response.send("logout");

    
});













app.get("/users", function (request, response) {
    UserData.find({}, function (err, users) {
        if (!err) {
            response.send(users);
        } else { throw err; }
    });

});





















//get user playlist
app.get("/playlist/:userName", function (request, response) {
    if (isLogin == false) {
        response.send("You are not logget in");
    }
    else {
        UserPlayList.find({ userName: request.params.userName }).exec(function (err, userPlaylist) {
            if (err) {
                console.log("Error: ");

            }
            else {
                response.send(userPlaylist);

            }


        });
    }
});



    //add new video
app.post("/addNewVideo", function (request, response) {

  
    if (isLogin == false) {
        response.send("You are not logged in");
    }
    else {

        var newVideo = new UserPlayList();

        newVideo.userName = request.body.userName;
        newVideo.title = request.body.title;
        newVideo.category = request.body.category;
        newVideo.description = request.body.description;
        newVideo.link = request.body.link;

        newVideo.save();
        response.status(201);
        response.send(newVideo);


    }
});

 

//Edit video
app.put("/Edit/:_id", function (request, response) {
    if (isLogin == false) {
        response.send("You are not login");
    }
    else {
        UserPlayList.findOne({ _id: request.params._id }, function (err, updatedVideo) {
            if (err) {
                console.log("Error: "+err);

            }
            else {
                
                updatedVideo.title = request.body.title;
                updatedVideo.category = request.body.category;
                updatedVideo.description = request.body.description;
                updatedVideo.link = request.body.link;

                updatedVideo.save();
                response.status(201);
                response.send(updatedVideo);

            }



        });
    }
});

    
    //delete video
app.delete("/deleteVideo/:_id", function (request, response) {
    
        UserPlayList.remove({ _id: request.params._id },function (err,deletedVideo) {
            if (err) {
                console.log("Error: "+err);

            }
            else {
                response.status(204);
                response.send();

            }
    
    
    });
    });



app.listen(3000, function () {
    console.log("Listening on: http://localhost:3000");
});











