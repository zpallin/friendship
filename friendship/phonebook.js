'use strict';

const LocalDB = require('./localdb.js');

////////////////////////////////////////////////////////////////////////////////
// phonebook obj
//  used to store data about other nodes and who to contact

class Phonebook extends LocalDB {
  constructor(path) {
    super('phonebook', path);
  }

  get_friend_by_name(name) {
    for (var f of this.get().friends) {
      if (f.name === name) {
        return f;
      }
    }
    return false;
  }
  addr_by_name_or_return(name) {
    var fwn = this.get_friend_by_name(name);
    if (fwn) {
      return fwn.address;
    } else {
      return name;
    }
  }
}

module.exports = Phonebook;
