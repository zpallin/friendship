'use strict';

var sha1 = require('sha1');
var state = require('./state.js');
var Friend = require('./friend.js').Friend;

////////////////////////////////////////////////////////////////////////////////
/* 
 * Helpers
 *  helping everyone with simple functional scripts!
 */

function randomStr(length, seed) {

  length = isDefined(length) ? length : 10;
  seed = isDefined(seed) ? seed : sha1("Zeppelin");

  return sha1(String((new Date()).UTC) + seed).substr(0,length);
}

function isDefined(variable) {

  return typeof variable !== 'undefined';
}

function get_me(meDb, args) {

  // shadow over
  var me = meDb.get();
  var name = isDefined(args.name) ? args.name : me.name;
  var role = isDefined(args.role) ? args.role : me.role;
  var crowd = isDefined(args.crowd) ? args.crowd : me.crowd;

  // address shadowing more complicated
  // me address is evaluated first,
  // then if listen_to is set...
  // then, if args.address isn't default
  // and lastly... if args.address === "me", then it's me.address

  var address = state.defaults.address;

  if (isDefined(args.to_address)) {
    if (args.to_address === "me") {
      address = me.address;
    } else {
      address = args.to_address;
    }
  }
  if (args.address !== state.defaults.address && isDefined(args.address)) {
    address = args.address;
  }
  if (args.address === 'me' && isDefined(me.address)) {
    address = me.address;
  }

  var new_me = new Friend(name, address, role, crowd);

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
    return state.defaults.address
  }

  var split = string.split(":");

  if (split.length === 1) {

    // if the value is just a single numerical value, they're trying to submit
    // just a port
    if (isNaN(split[0])) {
      return state.defaults.address.split(":")[0] + ":" + split[0];

    // otherwise, they've passed a host address
    } else {
      return split[0] + state.defaults.address.split(":")[1];
    }

  // if there are two sides, time to do input validation on whether or not they
  // threw in an empty "" at the front or back of the :
  // in that case just throw the default on whichever side makes sense
  } else {
    if (split[0] == "") {
      return split[0] + ":" + state.defaults.address.split(":")[1];

    } else if (split[1] == "") {
      return state.defaults.address.split(":")[0] + ":" + split[1];
    }
  }

  //stopping point for now
  return string;
}

module.exports = {
	randomStr : randomStr,
	isDefined : isDefined,
	get_me : get_me,
	addr_from_string : addr_from_string,
}
