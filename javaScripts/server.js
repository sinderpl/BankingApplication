const express = require('express');
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
//var http = require('https');

//app var
const app = express();


// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}


app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
  // Note: __dirname is directory that contains the JavaScript source code. Try logging it and see what you get!
  // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
})

/**
app.post('/quotes', (req, res) => {
  console.log(req.body)
})**/

//Test url to access
// http://localhost:3000/user/Alan%20Niemiec/2345
app.get('/user/:userName/:pin', getUserData);

//Test url to access
app.get('/accounts/:accountid', getUserAccounts);

app.listen(3000, function() {
  console.log('listening on 3000')
})


    //MONGO code
//Mongo instance
var db;

//User data objects
var currentUser;
var currentUserAccounts = new Map();

MongoClient.connect("mongodb://Test:Test@ds139187.mlab.com:39187/heroku_vh3f7203", (err, database) => {
  db = database;
})


function findOne(collectionName, query, callback){

  db.collection(collectionName).findOne(query, function (err, item){
    if (err){
      callback(err);
    }
    else{
      //Return the data with no errors
      callback(null, item);
    }
  });
}

//Find the data in collection
function getUserData(req , res){
  //Construct a query
  var query = { "username" : req.params.userName};
  //Find one user only in the database
  findOne("Users", query, function (err, item){
    //Log any errors
    if(err) {
      console.log(err);
      return;
    }

    console.log(""+req.params.userName+"");
    console.log(req.params.pin);
    //If user is found create a new user object
    if(item){
      console.log("User has been found");
      //currentUser = new userData(item.username, item.pin, item.deviceid, item.accounts, item.payees);
      //console.log(currentUser);

      if(item.pin == req.params.pin){
        console.log("pin verified\n");
        res.type('json');
        res.json(item);
      }
      else{
        console.log("Pin invalid\n");
        res.status(500).send("Pin Invalid");
      }
    }
    else{
      console.log("User has not been found\n");
      res.status(500).send("User has not been found");
    }
  });
}
//END OF GETUSERDATA





//Return a json with the user accounts
function getUserAccounts(req, res){
  //Constuct the query
  var query = {"accid" : req.params.accountid};
  console.log("acc id : " + req.params.accountid);
  //Find one user only in the database
  findOne("Accounts", query, function (err, item){
    //Log any errors
    if(err) {
      console.log(err);
      return;
    }

    //If result is not empty return the data
    if(item){
      console.log(item);
      console.log("Account has been found");
        res.type('json');
        res.json(item);

    }
    else{
      console.log("Account not found\n");
      res.status(500).send("Account has not been found");
    }
  });
}
//END OF GETUSERACCOUNTS