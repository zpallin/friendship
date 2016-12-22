#!/usr/bin/env node
'use strict';

var express = require('express');
var app = express();
var fs = require('fs');
var merge = require('merge');
var ArgumentParser = require('argparse').ArgumentParser;
var sha1 = require('sha1');


////////////////////////////////////////////////////////////////////////////////
// "static"
var DEFAULT_ADDRESS = "localhost:8686";

////////////////////////////////////////////////////////////////////////////////
/*
 * Friend
 *  object used to manage friend data
 */

class Friend {
  constructor(name, address, role) {

    this.name = name;
    this.address = address;
    this.role = role;
  }

  get data() {

    return {
      name: this.name,
      address: this.address,
      role: this.role,
    };
  }
}

////////////////////////////////////////////////////////////////////////////////
/*
 * LocalDB
 *  stores json data in a json file
 */

class LocalDB {
  
  constructor(name, path, overwrite) {

    // overwrite existing file option, import by default
    overwrite = typeof overwrite === "undefined" ? false : true;

    this.path = typeof path === "undefined" ? "." : path;
    this.name = name;
    this.fullpath = this.path + "/" + this.name + ".json";

    // overwrites file if it does not exist or overwrite stated
    if (fs.existsSync(this.fullpath) === false || overwrite === true) {
      fs.writeFileSync(this.fullpath, JSON.stringify({}, null, 4));
    }
  }
  
  // updates data with object merge 
  update(data) {

    var new_data = merge(this.get(), data);
    fs.writeFileSync(this.fullpath, JSON.stringify(new_data, null, 4));
  }

  consider(data) {

  }

  // returns the json as object
  get() {

    return JSON.parse(fs.readFileSync(this.fullpath));
  }
}

////////////////////////////////////////////////////////////////////////////////
/*
 * Argument Parsing
 */

function get_args() {

  var parser = new ArgumentParser({
    version: "0.0.1",
    addHelp: true,
    description: "Friendship is a distributed systems manager"
  });

  /*
   * Ad Hoc flag arguments
   *  -
   *  Running these arguments will temporarily override 
   */
  parser.addArgument(["-n", "--name"],
    {
      help: "temporarily mask the name of this friend",
      required: false,
      defaultValue: "unnamed-" + sha1(String((new Date()).UTC)).substr(0,10),
    }
  );

  parser.addArgument(["-a", "--address"],
    {
      help: "temporarily mask the listening address of this friend",
      required: false,
      defaultValue: DEFAULT_ADDRESS,
    }
  );

  parser.addArgument(["-r", "--role"],
    {
      help: "temporarily mask the role of this friend",
      required: false,
      defaultValue: "friend",
    }
  );

  switch(process.argv[2]) {
    case "listen":
      parser.addArgument("listen",
        {
          help: "friend will listen as service to <address | host>",
        }
      );

      parser.addArgument("to_address",
        {
          help: "address to listen to [<host or address>]",
        }
      );

      // if the argv for to_address is not set, then assume "me"
      if (!process.argv[3] || process.argv[3][0] == "-") {

        // by splicing argv
        process.argv.splice(3, 0, "me");
      }
      break;

    case "tell": 
      parser.addArgument("tell",
        {
          help: "gives a command to a friend",
        }
      );
      parser.addArgument("target_friend",
        {
          help: "target for the action [<host or address>]",
          defaultValue: "me",
          required: false,
        }
      );
      parser.addArgument("to_do",
        {
          help: "an action name known by leaders or stored locally",
        }
      );
      break;

    case "become": 
      parser.addArgument("become",
        {
          help: "permanently remember masking flags",
        }
      );
      break;

    default: 
      parser.addArgument("action",
        {
          help: "`friendship <listen | tell | become> -h` for details",
          required: false,
        }
      );
  }
 
  return parser.parseArgs();
}

////////////////////////////////////////////////////////////////////////////////
/*
 * helpers
 */

function isDefined(variable) {
  return typeof variable !== 'undefined';
}

function get_me(meDb, args) {
  
  // shadow over
  var me = meDb.get();
  var name = isDefined(args.name) ? args.name : me.name;
  var role = isDefined(args.role) ? args.role : me.role;

  // address shadowing more complicated
  // me address is evaluated first,
  // then if listen_to is set...
  // then, if args.address isn't default
  // and lastly... if args.address === "me", then it's me.address

  var address = DEFAULT_ADDRESS;
  if (isDefined(args.to_address)) {
    address = args.to_address;
  }
  if (args.address !== DEFAULT_ADDRESS && isDefined(args.address)) {
    address = args.address;
  }
  if (args.address === 'me' && isDefined(me.address)) {
    address = me.address;
  }

/*
  var address = typeof args.listen_to !== 'undefined' ? args.listen_to : me.address;
  address = args.address != DEFAULT_ADDRESS ? args.address : address;
  address = args.address === "me" && typeof args.address !== 'undefined' ? me.address : address;
*/
  var new_me = new Friend(name, address, role);

  // become clause
  if (isDefined(args.become)) {
    meDb.update(new_me);
    console.log("Became someone new: " + JSON.stringify(new_me));
  }

  return new_me;
}

function addr_from_string(string) {

  // default return value just in case empty value
  if (typeof string === "undefined") {
    return DEFAULT_ADDRESS
  }

  var split = string.split(":");

  if (split.length === 1) {
    
    // if the value is just a single numerical value, they're trying to submit
    // just a port
    if (isNaN(split[0])) {
      return DEFAULT_ADDRESS.split(":")[0] + ":" + split[0];

    // otherwise, they've passed a host address
    } else {
      return split[0] + DEFAULT_ADDRESS.split(":")[1];
    }

  // if there are two sides, time to do input validation on whether or not they
  // threw in an empty "" at the front or back of the :
  // in that case just throw the default on whichever side makes sense
  } else {
    if (split[0] == "") {
      return split[0] + ":" + DEFAULT_ADDRESS.split(":")[1];

    } else if (split[1] == "") {
      return DEFAULT_ADDRESS.split(":")[0] + ":" + split[1];
    }
  }

  //stopping point for now
  return string;
}

////////////////////////////////////////////////////////////////////////////////
/*
 * Action Logic
 */

function main() {
  console.log("Friendship!");

  var args = get_args();
  var meDb = new LocalDB("me");
  var friendsDb = new LocalDB("friends");
  var me = get_me(meDb, args);

  //if (args.hasOwnProperty("action") &&
  if (isDefined(args.listen)) {
    app.get('/', function (req, res) {

    });

    // split port from 
    var addr = addr_from_string(me.address);
    app.listen(addr.port, addr.host, function () {

      meDb.update(me.data);

      console.log("Listening on " + me.address);
      //console.log(me);
    });
  }
}
main();
