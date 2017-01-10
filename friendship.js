#!/usr/bin/env node
'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var sa  = require('superagent');
var app = express();

// app uses
app.use(bodyParser.json());

// locals
var Friend = require('./friendship/friend.js').Friend;
var LocalDB = require('./friendship/localdb.js');
var Phonebook = require('./friendship/phonebook.js');
var cli = require('./friendship/cli.js');
var state = require('./friendship/state.js');
var helpers = require('./friendship/helpers.js');
////////////////////////////////////////////////////////////////////////////////
// "static"
var DEFAULT_ADDRESS = state.defaults.address;

////////////////////////////////////////////////////////////////////////////////
/*
 * Action Logic
 */

function main() {

  console.log("Friendship!");

  var args = cli.get_args();
  var path = args.path === null ? "./" : args.path;
  var meDb = new LocalDB("me", path);
  var phonebook = new Phonebook(path);
  var me = helpers.get_me(meDb, args);

  // print out configuration
  if (helpers.isDefined(args.config)) {

    console.log(JSON.stringify(me.obj, null, 4));
  }

  // print out actions help messages
  if (helpers.isDefined(args.actions)) {

    console.log("Actions: ");
    for (var a in cli.help_sections) {
      console.log(" - \"" + a + "\": " + cli.help_sections[a]);
    }
    console.log("\nRun \"--help\" with each action to learn more");
  }

  if (helpers.isDefined(args.greet)) {

    /*
     * entrypoint for running tell arguments
     */

    // first, find out if the target should be translated to an address.
    var target_address = args.target_friend; // the default

    // check if the node name is myself? assign addr accordingly
    if (target_address === me.name) {
      target_address = me.address;
 
    // loop through phonebook friends and check
    } else {
      target_address = phonebook.addr_by_name_or_return(target_address);
    }

    var addr = helpers.addr_from_string(target_address);
    var sendData = JSON.stringify(me.data);

    sa.post(addr.host + ":" + addr.port + "/greet")
      .send(me.data)
      .end(function(err, res) {
        if (err !== null) {
          console.log(err);
        } else {
          console.log(res.body);
        }
      });
  }

  //if (args.hasOwnProperty("action") &&
  if (helpers.isDefined(args.listen)) {

    // Friendship!
    app.get('/', function (req, res) {
      res.send("Friendship?");
    });

    // how to greet a node. It tells you who it is!
    // I mean, why not? It's early stage development. 
    // pffft... No need for security!
    app.post('/greet', function(req, res) {

      var data = me.data;
      data.message = "Hello! This is me!";

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data));

      var greeter = new Friend(
        req.body.name, 
        req.body.address, 
        req.body.role, 
        req.body.crowd
      );

      var greetName = greeter.name;

      if (greeter.sameAs(me)) {
        greetName = "myself";
      } else {
        var phoneData = phonebook.get();
        
        for (var i in phoneData.friends) {
          var friend = phoneData.friends[i];
          // WORK HERE
          // this right now is in development. It will evaluate whether or not
          // the friend is a new friend or just being updated... no logic yet
        }
        phonebook.update({"friends": [greeter]});
      }

      console.log("I was just greeted by " + greetName + "!");

    });

    // get addr object and push some data
    var addr = helpers.addr_from_string(me.address);
    app.listen(addr.port, addr.host, function () {

      meDb.update(me.obj);
      console.log("Listening on " + me.address);
    });
  }
}
main();
