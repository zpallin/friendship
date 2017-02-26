#!/usr/bin/env node
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const sa = require('superagent');
const app = express();
const exec = require('child_process').exec;

// app uses
app.use(bodyParser.json());

// locals
const Friend = require('./friendship/friend.js').Friend;
const LocalDB = require('./friendship/localdb.js');
const Phonebook = require('./friendship/phonebook.js');
const cli = require('./friendship/cli.js');
const state = require('./friendship/state.js');
const helpers = require('./friendship/helpers.js');

// AppLogic
let ActionTell = require('./friendship/tell');
let ActionGreet = require('./friendship/greet');

////////////////////////////////////////////////////////////////////////////////
// "static"
var DEFAULT_ADDRESS = state.defaults.address;

////////////////////////////////////////////////////////////////////////////////
/*
 * Action Logic
 */

function main() {

  console.log("Friendship!");

  let args = cli.get_args();
  let path = args.path === null ? "./" : args.path;
  let meDb = new LocalDB("me", path);
  let phonebook = new Phonebook(path);
  let me = helpers.get_me(meDb, args);

  // actions
  let greet = new ActionGreet(me, phonebook);
  let tell = new ActionTell(me, phonebook);

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

  // how to greet other nodes, aka add them
  if (helpers.isDefined(args.greet)) {
    greet.to(args.target_friend);
  }

  // tell action
  if (helpers.isDefined(args.tell)) {
    tell.to(args.target_friend, args.to_do);
  }

  //if (args.hasOwnProperty("action") &&
  if (helpers.isDefined(args.listen)) {

    // Friendship!
    app.get('/', function (req, res) {
      res.send("Friendship?");
    });

    app.use('/greet', greet.router);
    app.use('/tell', tell.router);

    // get addr object and push some data
    var addr = helpers.addr_from_string(me.address);
    app.listen(addr.port, addr.host, function () {

      meDb.update(me.obj);
      console.log("Listening on " + me.address);
    });
  }
}
main();
