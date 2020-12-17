const express = require("express"); // server framework
const bodyParser = require("body-parser"); // for parsing the form data
const Pusher = require("pusher"); // for sending realtime messages
const cors = require("cors"); // for accepting requests from any host
const mustacheExpress = require('mustache-express'); // for using Mustache for templating

const { check } = require('express-validator/check'); // for validating user input for the quiz items

const sqlite3 = require('sqlite3').verbose(); // database engine
const db = new sqlite3.Database('db.sqlite'); // database file in the root of the server directory


const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cors());
  app.engine('mustache', mustacheExpress());
  app.set('view engine', 'mustache');
  app.set('views', __dirname + '/views'); // set the location of mustache files

  const pusher = new Pusher({
        appId: process.env.APP_ID,
        key: process.env.APP_KEY,
        secret: process.env.APP_SECRET,
        cluster: process.env.APP_CLUSTER
      });


// Adding users
var users = []; // this will store the username and scores for each user

    app.post("/pusher/auth", (req, res) => {
      const socketId = req.body.socket_id;
      const channel = req.body.channel_name;

      const auth = pusher.authenticate(socketId, channel);
      res.send(auth);
    });

    app.post("/login", (req, res) => {
      const username = req.body.username;
      console.log(username + " logged in");

      if (users.indexOf(username) === -1) { // check if user doesn't already exist
        console.log('users: ', users.length);
        users.push({
          username,
          score: 0 // initial score
        });
      }

      res.send('ok');
    });
