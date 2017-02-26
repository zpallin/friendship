const cli = require('../friendship/cli.js');
const assert = require('chai').assert;

function GENERIC_ARG_TEST(cmd, cmdVal) {
  cmdVal = cmdVal === undefined? cmd : cmdVal;

  it('compiles flag arguments when they are present or not present', function () {
    function Namespace() {
      this.name = null;
      this.address = null;
      this.role = null;
      this.crowd = null;
      this.local_config = null;
      this.path = null;
      this[cmdVal] = cmd;
    }
    
    process.argv = ['node', 'friendship', cmd];
    var args_exp = new Namespace();
    var args = cli.Flags.get_args();
    assert.equal(JSON.stringify(args), JSON.stringify(args_exp));
    
    // try setting all flags
    args_exp.name = 'testnode1';
    args_exp.address = 'localhost:8686';
    args_exp.role = 'friend';
    args_exp.crowd = 'crowd1';
    args_exp.local_config = 'test:config';
    args_exp.path = './';
    args_exp[cmdVal] = cmd;

    process.argv = [
      'node',
      'friendship',
      cmd,
      '-n', 'testnode1',
      '-a', 'localhost:8686',
      '-r', 'friend',
      '-w', 'crowd1',
      '-c', 'test:config',
      '-p', './',
    ];
    var args = cli.Flags.get_args();

    assert.equal(JSON.stringify(args), JSON.stringify(args_exp));

  });
}

////////////////////////////////////////////////////////////////////////////////
describe('Flags.get_args()', function () {
  var original_process_argv = process.argv;

  describe('tell', function() {
    it('compiles all arguments for the \"tell\" action', function () {
      process.argv = ['node', 'friendship', 'tell', 'localhost:8686', 'hello'];
      function Namespace() {     
        this.name = null;
        this.address = null;
        this.role = null;
        this.crowd = null;
        this.local_config = null;
        this.path = null;
        this.tell = 'tell';
        this.target_friend = 'localhost:8686';
        this.to_do = 'hello';
      }

      var args_exp = new Namespace();
      var args = cli.Flags.get_args();
      assert.equal(JSON.stringify(args), JSON.stringify(args_exp));

      args_exp.name = 'testnode1';
      args_exp.address = 'localhost:8787';
      args_exp.role = 'friend';
      args_exp.crowd = 'crowd1';
      args_exp.local_config = 'test:config';
      args_exp.path = './';
      args_exp.target_friend = 'localhost:8787';
      args_exp.to_do = 'hello';


      process.argv = [
        'node',
        'friendship', 
        'tell', 'localhost:8787', 'hello',
        '-n', 'testnode1',
        '-a', 'localhost:8787',
        '-r', 'friend',
        '-w', 'crowd1',
        '-c', 'test:config',
        '-p', './',
      ];
      var args = cli.Flags.get_args();

      assert.equal(JSON.stringify(args), JSON.stringify(args_exp));
      
    });
  });

  describe('listen', function() {
    it('compiles all arguments for the \"listen\" action', function () {
      
      function Namespace() { 
        this.name = null;
        this.address = null;
        this.role = null;
        this.crowd = null;
        this.local_config = null;
        this.path = null;
        this.listen = 'listen';
        this.to_address = 'localhost:8686';
      }
      var args_exp = new Namespace();
      process.argv = ['node', 'friendship', 'listen', 'localhost:8686'];
      var args = cli.Flags.get_args();
      assert.equal(JSON.stringify(args), JSON.stringify(args_exp));

      args_exp.name = 'testnode1';
      args_exp.address = 'localhost:8787';
      args_exp.role = 'friend';
      args_exp.crowd = 'crowd1';
      args_exp.local_config = 'test:config';
      args_exp.path = './';
      args_exp.to_address = 'localhost:8787';
     
      process.argv = [
        'node',
        'friendship', 
        'listen', 'localhost:8787',
        '-n', 'testnode1',
        '-a', 'localhost:8787',
        '-r', 'friend',
        '-w', 'crowd1',
        '-c', 'test:config',
        '-p', './',
      ];
      var args = cli.Flags.get_args();

      assert.equal(JSON.stringify(args), JSON.stringify(args_exp));
    });

    it('inserts "me" into the argument if the to_address is not set', function() {
      function Namespace() {
        this.name = null;
        this.address = null;
        this.role = null;
        this.crowd = null;
        this.local_config = null;
        this.path = null;
        this.actions = 'actions';
      }

      var args_exp = new Namespace();
      process.argv = ['node', 'friendship', 'listen'];
      var args = cli.Flags.get_args();
      assert.equal(args.to_address, 'me');

      process.argv = ['node', 'friendship', 'listen', '-p', 'config'];
      var args = cli.Flags.get_args();
      assert.equal(args.to_address, 'me');

    });
  });

  describe('actions', function() {
    GENERIC_ARG_TEST('actions');
  });

  describe('become', function() {
    GENERIC_ARG_TEST('become');
  });

  describe('config', function() {
    GENERIC_ARG_TEST('config');
  });

  describe('action', function() {
    GENERIC_ARG_TEST('action', 'actions');
  });

  process.argv = original_process_argv;
});

