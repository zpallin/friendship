const localdb = require('../friendship/localdb.js');
const assert = require('chai').assert;
const path = require('path');

////////////////////////////////////////////////////////////////////////////////
// fake localdb object
function LocalDB() {
  this.filepath = path.dirname(process.mainModule.filename);
  this.name = 'db';
  this.fullpath = this.filepath + '/' + this.name + '.json';
}
describe('LocalDB object', function() {
  it('can be instantiated with defaults', function() {
    var db = new localdb.LocalDB();
    var expected_db = new LocalDB();
    assert.equal(JSON.stringify(db), JSON.stringify(expected_db));
  });

  it('can be instantiated with other values', function() {
    /*
    var db = new localdb.LocalDB('testdb', './test_path', true);
    var expected_db = new LocalDB();
    expected_db.overwrite = true;
    expected_db.filepath = './test_path';
    expected_db.fullpath = './test_path/testdb.js';

    assert.equal(JSON.stringify(db), JSON.stringify(expected_db));
    */
  });
});
