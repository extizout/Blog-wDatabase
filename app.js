//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const serverPort = 3000;
const dbPort = 27017;

//Setup Mongoose Connection & create DB.
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost:" + dbPort + "/blogDB");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//Create a Schema for NoSQL.
const postSchema = {
  title: String,
  content: String
};
//Create Model & Collection by using postSchema.
const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) {
//Find Object in Post's Collection
  Post.find({}, async (err, postsObj) => {
    try {
      //Pass Posts Object to Post.ejs.
      res.render("home", {
        startingContent: homeStartingContent,
        posts: postsObj
      });
    } catch (err) {
      console.log(err);
    }
  })
});

app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: aboutContent
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  //Insert a post in to MongoDB.
  post.save((err) => {
    try {
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  });

});

app.get("/posts/:postID", function(req, res) {
  const requestedID = req.params.postID;
  //Find post's id in MongoDB.
  Post.find({_id: requestedID},async (err, posts) => {
  try{
    //Foreach posts in Database.
    posts.forEach((post) => {
        const storedID = post.id;
        //(Check:are there any found item equal to stored item.)
        if (requestedID === storedID) {
          res.render("post", {
            title: post.title,
            content: post.content
          });
        };
      });
  }catch(err){
    console.log(err);
  }
  });
});

app.listen(serverPort, function() {
  console.log("Server started on port " + serverPort);
});
