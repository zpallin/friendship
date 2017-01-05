'use strict';

const helpers = require('../friendship/helpers.js');
const assert = require('chai').assert;
const proxyquire = require('proxyquire');

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
  });

});

