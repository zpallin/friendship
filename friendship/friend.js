////////////////////////////////////////////////////////////////////////////////
/*
 * Friend
 *  object used to manage friend data
 */

class Friend {
  constructor(name, address, role, crowd) {

    this.name = name;
    this.address = address;
    this.role = role;
    this.crowd = crowd;
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
