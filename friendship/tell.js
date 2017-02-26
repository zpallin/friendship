const express = require('express');
const exec = require('child_process').exec;
const helpers = require('./helpers');
const sagent = require('superagent');

class ActionTell {

  constructor(me, pb) {
    this.me = me;
    this.pb = pb;
    this.router = this.generateRouter();
  }

  to(target, to_do) {
		let taddr = target;

    // check if the node name is myself? assign addr accordingly
    if (taddr === this.me.name) {
      taddr = this.me.address;

    // loop through phonebook friends and check
    } else {
      taddr = this.pb.addr_by_name_or_return(taddr);
    }

    let addr = helpers.addr_from_string(taddr);
    let sendData = JSON.stringify(this.me.data);
    let data = this.me.data;
		let formatReq = addr.host + ":" + addr.port + "/tell";
    data.to_do = to_do;

    return sagent.post(formatReq)
      .send(data)
      .end(function(err, res) {
        if (err !== null) {
          console.log(err);
        } else {
          console.log(res.body);
        }
      });
  }

  generateRouter() {
    let dis = this;
    let router = express.Router();

    router.post('/', function(req, res) {
        let data = dis.me.data;
        data.message = "Thanks for your task";

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(data));

        if (dis.pb.get_friend_by_name(req.body.name) && req.body.crowd === dis.me.crowd) {
          console.log("I am being told to... \"" + req.body.to_do + "\"");

          exec(req.body.to_do, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
          });
        }
    });
    return router;
  }
}

module.exports= ActionTell;
