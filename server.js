var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// connecting to database
mongoose.connect("mongodb://rohit:12345@ds235778.mlab.com:35778/whitepanda");
    mongoose.connection.on('connected',() => {
      console.log("Database Connected to mlab");
    });
    mongoose.connection.on('error',() => {
      console.log("Trouble Connecting to mlab");
    });

// model
    var editorSchema = mongoose.Schema({
      content: {type:String,required:true }
    });

    var Editor = mongoose.model('Editor',editorSchema);


// serving static files
app.use(express.static(__dirname + '/public'));

// body Parser
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));

// get content
app.get('/getContent', function(req,res){
  Editor.find(function(err,docs){
    console.log(docs);
    res.json(docs);
  });
});

// post content
app.post('/postContent', function(req,res){
  Editor.create({
    content : req.body.content,
    done : false
  }, function(err,content){
    if(err){
      res.send(err);
    }
    Editor.find(function(err,content){
     if(err){
       res.send(err);
     }
     console.log("content saved");
    });
  });
});

// listening on port 8080
app.listen(8080, function(req,res){
  console.log('Task 2 is available on PORT 8080');
});
