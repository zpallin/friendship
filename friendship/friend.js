////////////////////////////////////////////////////////////////////////////////
/*
 * Friend
 *  object used to manage friend data
 */
const path = require('path');

class Friend {
  constructor(name, address, role, crowd) {

    // shared data values
    this.name = name;
    this.address = address;
    this.role = role;
    this.crowd = crowd;
    
    // unshared config values
    this.config = {};
    this.config.dir = path.resolve("./");
  }

  get data() {

    return {
      name: this.name,
      address: this.address,
      role: this.role,
      crowd: this.crowd,
    };
  }
}

module.exports =  {
  Friend: Friend
}
