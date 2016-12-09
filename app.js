
var express = require('express');
var app = express();
var fs = require('fs');
var merge = require('merge');

class Friend {
  constructor(name, address, role) {

    this.name = name;
    this.address = address;
    this.role = role;
  }

  get data() {

    return {
      name: this.name,
      address: this.address,
      role: this.role,
    };
  }
}

class LocalDB {
  constructor(name, path) {

    this.path = typeof path === "undefined" ? "." : path;
    this.name = name;
    this.fullpath = this.path + "/" + this.name + ".json";

    fs.writeFileSync(this.fullpath, JSON.stringify({}, null, 4));
  }
  
  update(data) {

    var stored = JSON.parse(fs.readFileSync(this.fullpath));
    var new_data = merge(data, stored);    
    fs.writeFileSync(this.fullpath, JSON.stringify(new_data, null, 4));
  }
}

app.get('/', function (req, res) {
});

app.listen(8686, function () {
  var db, me;
  db = new LocalDB("me");
  me = new Friend("zpallin", "localhost:8686", "friend");

  db.update(me.data);
});

