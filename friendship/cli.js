'use strict';

var ArgumentParser = require('argparse').ArgumentParser;
var state = require('./state.js');
var helpers = require('./helpers.js');
var DEFAULT_ADDRESS = state.defaults.address;

////////////////////////////////////////////////////////////////////////////////
/*
 * Argument Parsing
 */

function get_args() {

  var parser = new ArgumentParser({
    version: "0.0.1",
    addHelp: true,
    description: "Friendship is a distributed systems manager"
  });

  /*
   * Ad Hoc flag arguments
   *  -
   *  Running these arguments will temporarily override
   */
  parser.addArgument(["-n", "--name"],
    {
      help: "temporarily mask the name of this friend",
      required: false,
    }
  );

  parser.addArgument(["-a", "--address"],
    {
      help: "temporarily mask the listening address of this friend",
      required: false,
    }
  );

  parser.addArgument(["-r", "--role"],
    {
      help: "temporarily mask the role of this friend",
      required: false,
    }
  );

  parser.addArgument(["-w", "--crowd"],
    {
      help: "temporarily mask the role of this friend",
      required: false,
    }
  );

  switch(process.argv[2]) {
    case "listen":
      parser.addArgument("listen",
        {
          help: "friend will listen as service to <address | host>",
        }
      );

      parser.addArgument("to_address",
        {
          help: "address to listen to [<host or address>]",
        }
      );

      // if the argv for to_address is not set, then assume "me"
      if (!process.argv[3] || process.argv[3][0] == "-") {

        // by splicing argv
        process.argv.splice(3, 0, "me");
      }
      break;

    case "tell":
      parser.addArgument("tell",
        {
          help: "gives a command to a friend",
        }
      );
      parser.addArgument("target_friend",
        {
          help: "target for the action [<host or address>]",
          required: false,
        }
      );
      parser.addArgument("to_do",
        {
          help: "an action name known by leaders or stored locally",
        }
      );
      break;

    case "become":
      parser.addArgument("become",
        {
          help: "permanently remember masking flags",
        }
      );
      break;

    default:
      parser.addArgument("action",
        {
          help: "`friendship <listen | tell | become> -h` for details",
          required: false,
        }
      );
  }

  return parser.parseArgs();
}

module.exports = {
	get_args: get_args
}
