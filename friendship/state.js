'use strict';

////////////////////////////////////////////////////////////////////////////////
/*
 * State
 *  Encompases static variables and functions that manage "state"
 */

////////////////////////////////////////////////////////////////////////////////
/*
 * defaults
 */

var defaults = {
  address : 'localhost:8686',
  role : 'friend',
  friend_config : function() {
    return {
      kill: false,
    };
  }
}

module.exports = {
  defaults : defaults,
}

