'use strict';

const sha1 = require('sha1');
const state = require('./state.js');
const friend = require('./friend.js');

////////////////////////////////////////////////////////////////////////////////
/* 
 * Helpers
 *  helping everyone with simple functional scripts!
 */

function clone(obj) {
  if (typeof obj === 'undefined') {
    return {};
  }
  return JSON.parse(JSON.stringify(obj));
}

function randomStr(length, seed) {

  length = isDefined(length) ? length : 10;
  seed = isDefined(seed) ? seed : sha1("Zeppelin");

  return sha1(String(new Date()) + ' ' + seed).substr(0,length);
}

function isDefined(x) {

  return (typeof x !== 'undefined' && x != null && x != "");
}

function get_me(meDb, args) {

  // if no db is supplied, just return an empty friend
  if (!isDefined(meDb)) {
    return new friend.Friend();
  }

  // shadow over
  var me = meDb.get();

  // defaults
  var name = "friend-" + randomStr();
  name = isDefined(me.name) ? me.name : name;
  name = isDefined(args.name) ? args.name : name;
  
  var role = state.defaults.role;
  role = isDefined(me.role) ? me.role : role;
  role = isDefined(args.role) ? args.role : role;

  var crowd = "crowd-" + randomStr();
  crowd = isDefined(me.crowd) ? me.crowd : crowd;
  crowd = isDefined(args.crowd) ? args.crowd : crowd;

  // address shadowing more complicated
  // me address is evaluated first,
  // then if listen_to is set...
  // then, if args.address isn't default
  // and lastly... if args.address === "me", then it's me.address

  var address = state.defaults.address;
  address = isDefined(me.address) ? me.address : address;
  address = isDefined(args.to_address) ? args.to_address : address;
  address = address === "me" ? me.address : address;
  address = isDefined(args.address) ? args.address : address;

  // now for local_config. We must loop through passed config arguments
  // since config defaults are handled inside of the friend object
  // we don't have to worry about them
  //
  // start with obtaining the current configs stored in "me"
  var curr_configs = me.config;
  var new_configs = clone(curr_configs);
  ////console.log('newconfigs: ' + JSON.stringify(new_configs));
  
  // we can overwrite configs if we know that local_config is defined
  if (args.local_config !== undefined && args.local_config !== null) {

    // store passed configs 
    var passed_configs = {};
    for (var c of args.local_config.split(',')) {
      var config = c.split(':');
      passed_configs[config[0]] = config[1];
    }

    for (var c in curr_configs) {
      var passed_c = curr_configs[c];
      if (c in passed_configs) {

        passed_c = passed_configs[c];
        // parse for boolean and num
        switch(passed_c) {
          case "true": 
            passed_c = true;
            break;
          case "false":
            passed_c = false;
            break;
          default:
            if (!isNaN(passed_c)) {
              passed_c = parseInt(passed_c);
            }
        }
      }
      new_configs[c] = passed_c;
    }
  }
 
  // generate new me 
  ////console.log('defconfigs: ' + JSON.stringify(state.defaults.friend_config()));
  var new_me = new friend.Friend(name, address, role, crowd, new_configs);

  // become clause
  if (isDefined(args.become)) {
    meDb.update(new_me);
    if (process.env.NODE_ENV !== 'test') {
      console.log("Becomming... " + JSON.stringify(new_me));
    }
  }

  return new_me;
}

function addr_from_string(string) {

  var default_split = state.defaults.address.split(':');
  
  var addr = {
    host: default_split[0],
    port: default_split[1],
  }
  
  // default return value just in case empty value
  if (typeof string === "undefined") {
    return addr;
  }

  var split = string.split(":");
  
  if (split.length === 1) {

    // if the value is just a single numerical value, they're trying to submit
    // just a port
    if (!isNaN(split[0])) {
      addr.port = split[0];

    // otherwise, they've passed a host address
    } else {
      addr.host = split[0];
    }

  // if there are two sides, time to do input validation on whether or not they
  // threw in an empty "" at the front or back of the :
  // in that case just throw the default on whichever side makes sense
  } else {
    if (split[1] === "") {
      addr.host = split[0];

    } else if (split[0] === "") {
      addr.port = split[1];

    } else {
      addr.host = split[0];
      addr.port = split[1];
    }
  }

  //stopping point for now
  return addr;
}

module.exports = {
	randomStr : randomStr,
	isDefined : isDefined,
	get_me : get_me,
	addr_from_string : addr_from_string,
  clone : clone,
}

