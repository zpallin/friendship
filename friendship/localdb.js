'use strict';

var fs = require('fs');
var merge = require('merge');
var path = require('path');

////////////////////////////////////////////////////////////////////////////////
/*
 * LocalDB
 *  stores json data in a json file
 */

class LocalDB {

  constructor(name, filepath, overwrite) {

    // executable path of program
    var exe_path = path.dirname(process.mainModule.filename);

    // overwrite existing file option, import by default
    overwrite = typeof overwrite === 'undefined' ? false : true;
    
    this.filepath = typeof filepath === 'undefined' ? exe_path : filepath;
    this.name = typeof name === 'undefined' ? 'db' : name;
    this.fullpath = this.filepath + '/' + this.name + '.json';

    // overwrites file if it does not exist or overwrite stated
    if (fs.existsSync(this.fullpath) === false || overwrite === true) {
      fs.writeFileSync(this.fullpath, JSON.stringify({}, null, 4));
    }
  }

  // updates data with object merge
  update(data) {

    var new_data = merge(this.get(), data);
    return fs.writeFileSync(this.fullpath, JSON.stringify(new_data, null, 4));
  }

  // returns the json as object
  get() {

    return JSON.parse(fs.readFileSync(this.fullpath));
  }
}

module.exports = LocalDB;
