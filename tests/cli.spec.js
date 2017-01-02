const cli = require('../friendship/cli.js');
const assert = require('chai').assert;

////////////////////////////////////////////////////////////////////////////////
describe('Flags.get_args()', function () {
  it('compiles all arguments for the \"tell\" action', function () {
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
    var args = cli.Flags.get_args(['tell', 'localhost:8686', 'hello']);
    assert.equal(JSON.stringify(args), JSON.stringify(args_exp));

    args_exp.name = 'testnode1';
    args_exp.address = 'localhost:8787';
    args_exp.role = 'friend';
    args_exp.crowd = 'crowd1';
    args_exp.local_config = 'test:config';
    args_exp.path = './';
    args_exp.target_friend = 'localhost:8787';
    args_exp.to_do = 'hello';

    var args = cli.Flags.get_args([
      'tell', 'localhost:8787', 'hello',
      '-n', 'testnode1',
      '-a', 'localhost:8787',
      '-r', 'friend',
      '-w', 'crowd1',
      '-c', 'test:config',
      '-p', './',
    ]);

    assert.equal(JSON.stringify(args), JSON.stringify(args_exp));
  });

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
    var args = cli.Flags.get_args(['listen', 'localhost:8686']);
    assert.equal(JSON.stringify(args), JSON.stringify(args_exp));

    args_exp.name = 'testnode1';
    args_exp.address = 'localhost:8787';
    args_exp.role = 'friend';
    args_exp.crowd = 'crowd1';
    args_exp.local_config = 'test:config';
    args_exp.path = './';
    args_exp.to_address = 'localhost:8787';
    
    var args = cli.Flags.get_args([
      'listen', 'localhost:8787',
      '-n', 'testnode1',
      '-a', 'localhost:8787',
      '-r', 'friend',
      '-w', 'crowd1',
      '-c', 'test:config',
      '-p', './',
    ]);

    assert.equal(JSON.stringify(args), JSON.stringify(args_exp));
  });

  it('compiles all arguments for the "actions/other cmds" action', function () {
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
    var args = cli.Flags.get_args(['actions']);
    assert.equal(JSON.stringify(args), JSON.stringify(args_exp));
    
    // try setting all flags
    args_exp.name = 'testnode1';
    args_exp.address = 'localhost:8686';
    args_exp.role = 'friend';
    args_exp.crowd = 'crowd1';
    args_exp.local_config = 'test:config';
    args_exp.path = './';
    args_exp.actions = 'actions';

    var args = cli.Flags.get_args([
      'actions',
      '-n', 'testnode1',
      '-a', 'localhost:8686',
      '-r', 'friend',
      '-w', 'crowd1',
      '-c', 'test:config',
      '-p', './',
    ]);

    assert.equal(JSON.stringify(args), JSON.stringify(args_exp));

  });
});

