'use strict';

const proxyquire =  require('proxyquire');
const assert = require('chai').assert;
const path = require('path');


// spoofing fs
var fsStub = {};

// used as a value that should be returned with a "readFileSync" call
fsStub.readFileSync = function(fullpath) {
  return '{\n    "test": "value"\n}';
}
fsStub.expectedData = null;
fsStub.writeFileSync = function(path, data, ...options) { 
  /* don't actually write anything */ 
  // instead, return a value containing the written material
  
  return {path: path, data: data, options: options};
};

// spoofing path
var pathStub = {};

// localdb proxyquired
var localdb = proxyquire(
  '../friendship/localdb.js', 
  {
    'fs': fsStub,
    'path': pathStub,
  }
);

////////////////////////////////////////////////////////////////////////////////
// fake localdb object
function LocalDB() {
  this.filepath = path.dirname(process.mainModule.filename);
  this.name = 'db';
  this.fullpath = this.filepath + '/' + this.name + '.json';
}

////////////////////////////////////////////////////////////////////////////////
describe('LocalDB object', function() {
  it('can be instantiated with defaults', function() {
    var db = new localdb.LocalDB();
    var expected_db = new LocalDB();
    assert.equal(JSON.stringify(db), JSON.stringify(expected_db));
  });

  it('can be instantiated with other values', function() {
    var db = new localdb.LocalDB('testdb', './test_path', true);
    var expected_db = new LocalDB();
    expected_db.name = "testdb";
    expected_db.filepath = './test_path';
    expected_db.fullpath = './test_path/testdb.json';

    assert.equal(JSON.stringify(db), JSON.stringify(expected_db));
  });
  
  it('can update', function() {
    var db = new localdb.LocalDB();
    var expected_db = new LocalDB();
    var expected_output = {
      path: expected_db.fullpath,
      data: '{\n    "test": "value"\n}',
      options: []
    };
    var db_output = db.update({test: 'value'});
    assert.equal(JSON.stringify(expected_output), JSON.stringify(db_output));
  });

  it('can retrieve data with "get"', function() {
    var db = new localdb.LocalDB();
    var expected_db = new LocalDB();
    var expected_output = JSON.stringify({ test: 'value' }); 
    assert.equal(JSON.stringify(db.get()), expected_output);
  });
});
