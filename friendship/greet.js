const express = require('express');
const Friend = require('./friend').Friend;
const helpers = require('./helpers');
const sagent = require('superagent');

class ActionGreet {
  constructor(me, pb) {
    this.me = me;
    this.pb = pb;
    this.router = this.generateRouter();
  }

	to(target) {
		// store taddr separately from original target
		let taddr = target;

    if (taddr === this.me.name) {
      taddr = this.me.address;
    } else {
    	// loop through phonebook friends and check
      taddr = this.pb.addr_by_name_or_return(taddr);
    }

    let addr = helpers.addr_from_string(taddr);
    let sendData = JSON.stringify(this.me.data);
		let formatReq = addr.host + ":" + addr.port + "/greet";

    return sagent.post(formatReq)
      .send(this.me.data)
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

      var data = dis.me.data;
      data.message = "Hello! This is me!";

      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(data));

      var greeter = new Friend(
        req.body.name,
        req.body.address,
        req.body.role,
        req.body.crowd
      );

      var greetName = greeter.name;

      if (greeter.sameAs(dis.me)) {
        greetName = "myself";
      } else {
        var phoneData = dis.pb.get();

        for (var i in phoneData.friends) {
          var friend = phoneData.friends[i];
          // WORK HERE
          // this right now is in development. It will evaluate whether or not
          // the friend is a new friend or just being updated... no logic yet
        }
        dis.pb.update({"friends": [greeter]});
      }

      console.log("I was just greeted by " + greetName + "!");

    });

		return router;
  }
}

module.exports = ActionGreet;
