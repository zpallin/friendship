'use strict';

var fs = require('fs');
var merge = require('merge');

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

  // not sure what this is yet but I had an idea. it'll come to me soonish
  consider(data) {

  }

  // returns the json as object
  get() {

    return JSON.parse(fs.readFileSync(this.fullpath));
  }
}

module.exports = {
	LocalDB: LocalDB
}
