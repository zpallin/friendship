'use strict';

var ArgumentParser = require('argparse').ArgumentParser;
var state = require('./state.js');
var helpers = require('./helpers.js');
var DEFAULT_ADDRESS = state.defaults.address;
////////////////////////////////////////////////////////////////////////////////
/*
 * Help Sections
 *  shared to allow for printing help data
 */

var help_sections = {
  "listen": "listens as service to <address | host> for friends",
  "tell": "gives a command to a target friend <name | group | address>",
  "become": "overwrites local configuration with masking flags",
  "config": "displays all local configuration on stdout",
  "actions": "displays help text for all actions on stdout",
};

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

  parser.addArgument(["-c", "--local-config"],
    {
      dest: "local_config",
      help: "temporarily mask local-config values (<name>:<value>,<name>:<value>...)",
      required: false,
      defaultValue: "",
    }
  );

  // for consistency, store help sections for actions in a hash
  // so that we can reuse them when we want to print them all out
  switch(process.argv[2]) {
    case "listen":
      parser.addArgument("listen",
        {
          help: help_sections['listen'],
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
          help: help_sections['tell'], 
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
          help: help_sections['become'], 
        }
      );
      break;

    case "config":
      parser.addArgument("config",
        {
          help: help_sections['config'] 
        }
      );
      break;

    case "actions":
      parser.addArgument("actions",
        {
          help: help_sections['actions'], 
        }
      );
      break;

    default:
      parser.addArgument("action",
        {
          help: "run `friendship actions` to learn more",
          required: false,
        }
      );
  }

  return parser.parseArgs();
}

module.exports = {
	get_args: get_args,
  help_sections: help_sections,
}
