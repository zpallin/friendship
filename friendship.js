#!/usr/bin/env nodejs
'use strict';

var express = require('express');
var app = express();
var http = require('http');

// locals
var Friend = require('./friendship/friend.js').Friend;
var LocalDB = require('./friendship/localdb.js').LocalDB;
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
  var phonebook = new LocalDB("phonebook");
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

  if (helpers.isDefined(args.tell)) {
    
    /*
     * entrypoint for running tell arguments
     */
    if (args.to_do === "hello") {
    var addr = helpers.addr_from_string(args.target_friend);
      var target = {
        host: addr.host,
        port: addr.port,
        path: "/hello",
      };

      var req = http.get(target, function(res) {
        console.log("telling " + args.target_friend + " \"hello\": " + res.statusCode);
        res.on('data', function(chunk) {
          console.log(String(chunk));
        });
      });
    } 
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
    app.get('/hello', function(req, res) {
      
      var obj = me.obj;
      obj.message = "Hello! This is me!";

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(obj));
      console.log("I was just greeted by " + req.connection.remoteAddress + "!");
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
