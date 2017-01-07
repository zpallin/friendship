const friend = require('../friendship/friend.js');
const assert = require('chai').assert;

////////////////////////////////////////////////////////////////////////////////
// object for test purposes only
function Friend() {
  this.name = undefined;
  this.address = undefined;
  this.role = undefined;
  this.crowd = undefined;
  this.config = friend.Friend.default_config();
}

// testing the friend object
describe('Friend object', function() {
  it('can initiate', function() {
    
    var test_friend = new friend.Friend();
    var friend_exp = new Friend();
  
    // default friend after initiation equals the spoof
    assert.equal(JSON.stringify(test_friend), JSON.stringify(friend_exp));

    // test setting values in the constructor
    friend_exp.name = 'testfriend1';
    friend_exp.address = 'localhost:8686';
    friend_exp.role = 'friend';
    friend_exp.crowd = 'crowd1';
    friend_exp.config = friend.Friend.default_config();

    // use same generation data as the expected output
    var test_friend = new friend.Friend(
      friend_exp.name,
      friend_exp.address,
      friend_exp.role,
      friend_exp.crowd,
      friend_exp.config
    );

    assert.equal(JSON.stringify(test_friend), JSON.stringify(friend_exp));
  });

  it('only accepts config keys that are declared within object', function() {
    var config_value = {fakekey: 'key that doesn\'t exist'};
    var test_friend = new friend.Friend(
      'friend1', 
      '8686', 
      'friend', 
      'crowd1',
      config_value
    );

    assert.equal(
      JSON.stringify(test_friend.config), 
      JSON.stringify(friend.Friend.default_config())
    );
    assert.notEqual(
      JSON.stringify(test_friend.config),
      JSON.stringify(config_value)
    );

    config_value = {kill:true};
    var test_friend = new friend.Friend(
      'friend1',
      '8686',
      'friend',
      'crowd1',
      config_value
    );

    assert.notEqual(
      JSON.stringify(test_friend.config), 
      JSON.stringify(friend.Friend.default_config())
    );
    assert.equal(
      JSON.stringify(test_friend.config),
      JSON.stringify(config_value)
    );

  });


  it('can update config values', function() {
    var config_value = {kill: true};
    var test_friend = new friend.Friend(
      'friend1', 
      '8686', 
      'friend', 
      'crowd1',
      config_value
    );
    
    test_friend.update_config(config_value);
    assert.equal(
      JSON.stringify(test_friend.config),
      JSON.stringify(config_value)
    );
  });

  it('can get just the core data', function() {

    var exp_data = {
      name: 'testfriend1',
      address: 'localhost:8686',
      role: 'friend',
      crowd: 'crowd1',  
    };
    var test_friend = new friend.Friend(
      exp_data.name,
      exp_data.address,
      exp_data.role,
      exp_data.crowd
    );

    assert.equal(JSON.stringify(test_friend.data), JSON.stringify(exp_data));
  });

  it('can get an object containing config data also', function() {
    var exp_obj = {
      name: 'testfriend1',
      address: 'localhost:8686',
      role: 'friend',
      crowd: 'crowd1',
      config: friend.Friend.default_config(),
    };
    var test_friend = new friend.Friend(
      exp_obj.name,
      exp_obj.address,
      exp_obj.role,
      exp_obj.crowd
    );
    assert.equal(JSON.stringify(test_friend.obj), JSON.stringify(exp_obj));
  });

  it('can compare itself to another friend object', function() {
    var friend1 = new friend.Friend('friend1', 'localhost:8686', 'friend', 'crowd1');
    var friend2 = new friend.Friend('friend2', 'localhost:8787', 'friend', 'crowd1');

    // not equal
    assert.equal(false, friend1.sameAs(friend2));
    assert.equal(false, friend2.sameAs(friend1));

    // equal
    assert.equal(true, friend1.sameAs(friend1));
    assert.equal(true, friend2.sameAs(friend2));
  });
});
