////////////////////////////////////////////////////////////////////////////////
/*
 * Friend
 *  object used to manage friend data
 */
const path = require('path');

class Friend {
  constructor(name, address, role, crowd, config) {

    // shared data values
    this.name = name;
    this.address = address;
    this.role = role;
    this.crowd = crowd;
    
    // unshared config values
    this.config = {};
    this.config.dir = path.resolve("./");

    // set config if config is declared and is an object
    if (typeof config === 'object') {
      for (var c in config) {
        if (c in this.config) {
          this.config[c] = config[c];
        }
      }
    }
  }

  get obj() {

    return {
      name: this.name,
      address: this.address,
      role: this.role,
      crowd: this.crowd,
      config: this.config,
    };
  }


}

module.exports =  {
  Friend: Friend
}
