#!/usr/bin/env nodejs
'use strict';

var express = require('express');
var app = express();
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
  var meDb = new LocalDB("me");
  var phonebook = new LocalDB("phonebook");
  var me = helpers.get_me(meDb, args);

  //if (args.hasOwnProperty("action") &&
  if (helpers.isDefined(args.listen)) {
    app.get('/', function (req, res) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(me.data));
    });

    app.get('/hello', function(req, res) {
      
    });

    // split port from 
    var addr = helpers.addr_from_string(me.address);
    app.listen(addr.port, addr.host, function () {

      meDb.update(me.data);

      console.log("Listening on " + me.address);
      //console.log(me);
    });
  }
}
main();
