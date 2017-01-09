'use strict';

var friend = require('../friendship/friend.js');
var helpers = require('../friendship/helpers.js');
var state = require('../friendship/state.js');
var assert = require('chai').assert;
var proxyquire = require('proxyquire');
////////////////////////////////////////////////////////////////////////////////

describe('helpers', function() {
  describe('clone', function() {
    it('returns a cloned object', function() {
      //therefore the object must be different than the original
      var obj1 = { test: 'value' };
      var obj2 = obj1;
      var obj3 = helpers.clone(obj1);

      assert.equal(obj1, obj2); // these are the same
      assert.notEqual(obj1, obj3); // as a clone, it's different! :D
    });

    it('returns empty object if undefined', function() {
      var obj1 = undefined;
      var obj2 = helpers.clone(obj1);
      assert.equal(JSON.stringify({}), JSON.stringify(obj2));
    });
  });

  describe('randomStr', function() {
    it('accepts a length parameter', function() {
      assert.equal(helpers.randomStr(10).length, 10);
    });

    it('accepts a seed', function() {
      // therefore different results for different seeds!
      // for this we need to spoof sha1 to return the string without 
      // ibeing hashed and Date
      var sha1Stub = function(string){ return string; };
      var DateStub = function(){ return 'thisIsADate'; };
      var helpers = proxyquire(
        '../friendship/helpers.js',
        {
          'sha1': sha1Stub,
        }
      );
      // since we can't get exact date, just look for some of the date info...
      var dateData = String(new Date()).split(' ');
      // 0 = dayname
      // 1 = mon
      // 2 = daynum
      var output = helpers.randomStr(60, 'test').split(' ');
      assert.include(output, dateData[0], 'Includes the day name');
      assert.include(output, dateData[1], 'Includes the month');
      assert.include(output, dateData[2], 'Includes the day date');
      assert.include(output, 'test', 'Includes the seed');
    });
  });

  describe('isDefined', function() {
    it('tells you if a string is defined or not', function() {
      var val1 = undefined;
      var val2 = 'defined';

      assert.isNotTrue(val1);
      assert.isTrue(helpers.isDefined(val2));
    });
  });

  describe('addr_from_string', function() {
    it('converts string to addr object with "host" and "port" as attr', function() {
      var exp_addr = {
        host: 'test',
        port: '9001',
      };

      var addr = helpers.addr_from_string('test:9001');

      assert.equal(exp_addr.host, addr.host);
      assert.equal(exp_addr.port, addr.port);
    });

    it('provides default port when not provided', function() {
      var exp_addr = {
        host: 'test',
        port: '8686',
      };

      var addr = helpers.addr_from_string('test');

      assert.equal(exp_addr.host, addr.host);
      assert.equal(exp_addr.port, addr.port);

      addr = helpers.addr_from_string('test:');

      assert.equal(exp_addr.host, addr.host);
      assert.equal(exp_addr.port, addr.port);
    });

    it('provides default host when not provided', function() {
      var exp_addr = {
        host: 'localhost',
        port: '8787',
      };
      var addr = helpers.addr_from_string('8787');
      assert.equal(exp_addr.host, addr.host);
      assert.equal(exp_addr.port, addr.port);

      addr = helpers.addr_from_string(':8787');
      assert.equal(exp_addr.host, addr.host);
      assert.equal(exp_addr.port, addr.port);

    });

    it('returns default addr if no passed value was defined', function() {
      var exp_addr = state.defaults.address.split(':');
      var addr = helpers.addr_from_string();
      assert.equal(addr.host, exp_addr[0]);
      assert.equal(addr.port, exp_addr[1]);
    });
  });

  describe('get_me', function() {
    it('returns an empty friend if no DB is passed', function() {
      function Friend() {
        this.name = undefined;
        this.address = undefined;
        this.role = undefined;
        this.crowd = undefined;
        this.config = state.defaults.friend_config();
      }
      var me = helpers.get_me();
      assert.equal(JSON.stringify(new Friend()), JSON.stringify(me));
    });

    // localdb spoofing for other tests...
    var localdbSpoof = {};
    localdbSpoof.get = function() { return {}; }
    localdbSpoof.update = function(data) {
      // nothing?
    }

    it('returns the data from the db as a Friend object', function() {
      function Friend() {
        this.name = 'friend1';
        this.address = 'localhost:8686';
        this.role = 'friend';
        this.crowd = 'testcrowd';
        this.config = state.defaults.friend_config();
      }

      localdbSpoof.get = function() {
        return {
          name: 'friend1',
          role: 'friend',
          crowd: 'testcrowd',
          address: 'localhost:8686',
          config: state.defaults.friend_config(),
        };
      };

      var exp_me = new Friend();
      var me = helpers.get_me(localdbSpoof, {});
      assert.equal(JSON.stringify(exp_me), JSON.stringify(me)); 
    });

    it('returns defaults from state if no db returns no data', function() {
      localdbSpoof.get = function() { return {}; };
      var me = helpers.get_me(localdbSpoof,{});
      assert.match(me.name, /friend*/, 'matches name generation default');
      assert.match(me.crowd, /crowd*/, 'matches crowd name generation default');
      assert.equal(me.role, 'friend');
      assert.equal(me.address, 'localhost:8686');
    });

    it('masks passed args over defaults and "me" data', function() {
      function Friend() {
        this.name = 'friend2';
        this.address = 'localhost:8888';
        this.role = 'popular';
        this.crowd = 'testcrowd2';
        this.config = state.defaults.friend_config();
      }
      var exp_friend = new Friend();

      localdbSpoof.get = function() {
        return {
          name: 'friend1',
          role: 'friend',
          crowd: 'testcrowd',
          address: 'localhost:8787',
          config: state.defaults.friend_config(),
        };
      }

      var spoofArgs = {
        name: 'friend2',
        role: 'popular',
        crowd: 'testcrowd2',
        address: 'localhost:8888',
      };

      var me = helpers.get_me(localdbSpoof, spoofArgs);
      assert.equal(JSON.stringify(exp_friend), JSON.stringify(me));
    });

    // there is currently no way of knowing via the function as-is
    // to detect if it actually successfully updated or not...

    it('args.become will force an update', function() {
      localdbSpoof.get = function() {
        return {
          name: 'friend1',
          role: 'friend',
          crowd: 'testcrowd',
          address: 'localhost:8787',
        };
      }
      var updated = null;
      localdbSpoof.update = function(value) {
        updated = value;
      }
      var spoofArgs = {
        name: 'friend2',
        role: 'popular',
        crowd: 'testcrowd2',
        address: 'localhost:8888',
        become: 'become',
      }

      var me = helpers.get_me(localdbSpoof, spoofArgs);

      assert.equal(JSON.stringify(me), JSON.stringify(updated));
      assert.notEqual(updated, null); // because we originally set it to null
    }); 

    it('parses string of configs into "me" object', function() {
      var original_me = {
        name: 'friend2',
        role: 'popular',
        crowd: 'testcrowd2',
        address: 'localhost:8888',
        config: {kill:false},
      }
      localdbSpoof.get = function(value) {
        return original_me;
      }

      var spoofArgs = {
        name: 'friend2',
        role: 'popular',
        crowd: 'testcrowd2',
        address: 'localhost:8888',
        local_config: 'fakeconfig:value,kill:true',
      }

      var me = helpers.get_me(localdbSpoof, spoofArgs);
      assert.equal(JSON.stringify({kill: true}), JSON.stringify(me.config));
      assert.notEqual(JSON.stringify(original_me.config), JSON.stringify(me.config));
    });

    it('converts booleans and numbers passed via config', function() {

      var stateStub = {};
      var friend = proxyquire(
        '../friendship/friend.js',
        { './state.js': stateStub }
      );

      var helpers = proxyquire(
        '../friendship/helpers.js', 
        { 
          './friend.js' : friend,
          './state.js': stateStub,
        }
      );

      stateStub.defaults = {};
      stateStub.defaults.friend_config = function() {
        return {
          num: 0,
          boolean: true,
          otherboo: false,
          string: 'string',
          kill: false,
        };
      };

      var original_me = {
        name: 'friend2',
        role: 'popular',
        crowd: 'testcrowd2',
        address: 'localhost:8888',
        config: stateStub.defaults.friend_config(),
      }

      localdbSpoof.get = function(value) {
        return original_me;
      }

      var spoofArgs = {
        local_config : 'num:11,boolean:false,otherboo:true,string:dude,kill:true'
      };
      var me = helpers.get_me(localdbSpoof, {});
      assert.equal(JSON.stringify(me.config), JSON.stringify(stateStub.defaults.friend_config()));
      var me = helpers.get_me(localdbSpoof, spoofArgs);
      assert.notEqual(JSON.stringify(me.config), JSON.stringify(stateStub.defaults.friend_config()));
      assert.equal(
        JSON.stringify({num:11,boolean:false,otherboo:true,string:'dude',kill:true}),
        JSON.stringify(me.config)
      );
    });
  });
});

