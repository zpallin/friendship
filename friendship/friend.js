////////////////////////////////////////////////////////////////////////////////
/*
 * Friend
 *  object used to manage friend data
 */

class Friend {
  constructor(name, address, role, crowd, config) {

    // shared data values
    this.name = name;
    this.address = address;
    this.role = role;
    this.crowd = crowd;
    
    // unshared config values
    this.config = {};

    // set config if config is declared and is an object
    if (typeof config === 'object') {
      for (var c in config) {
        if (c in this.config) {
          this.config[c] = config[c];
        }
      }
    }
  }

  _default_config() {
    //returns default configurations, which subsequently limit
    //which configurations can be passed via input filtering
    return {} // empty for now :(
  }

  get data() {

    return {
      name: this.name,
      address: this.address,
      role: this.role,
      crowd: this.crowd,
    };
  }

  get obj() {

    var obj = this.data;
    obj.config = this.config;
    return obj;
  }

  sameAs(friend) {
    var attrs = ['name','address','role','crowd'];
    for (var i in attrs) {
      var a = attrs[i];
      if (this[a] !== friend[a]) {
        return false;
      }
    }
    return true;
  }


}

module.exports =  {
  Friend: Friend
}
