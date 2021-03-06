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
  "listen": "listens as service to <address, host> for friends",
  "tell": "gives a command to a target friend <name, address>",
  "become": "overwrites local configuration with masking flags",
  "config": "displays all local configuration on stdout",
  "actions": "displays help text for all actions on stdout",
  "greet": "joins current friend to target friend's crowd",
};

////////////////////////////////////////////////////////////////////////////////
/*
 * Argument Parsing
 */


class Flags {
	// a static class object for flag generation and organization
	static ad_hoc(parser) {
		// returns parser with default ad-hoc flags attached
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
			}
		);

		parser.addArgument(["-p", "--path"],
			{
				dest: "path",
				help: "choose which management path to use -- aka where me.json lives",
				required: false,
			}
		);

		return parser;
	}

	static listen(parser) {
		// returns listen flags attached
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
    // we detect if the 4th index is not available
    // or if the first character is an empty string or beginning of a flag
    // from this we can assume that there wasn't a to_address mentioned
		if (!process.argv[3] || String(process.argv[3]).substr(0,1) === "-") {

			// so we splice "me" into it, which will further be interpreted as
      // whatever the friend's most "obvious" address is
			process.argv.splice(3, 0, "me");
		}

		return parser;
	}

  static greet(parser) {
		parser.addArgument("greet",
			{
				help: help_sections['greet'],
			}
		);
		parser.addArgument("target_friend",
			{
				help: "target for the action [<host or address>]",
				required: false,
			}
		);

    return parser;
  }

	static tell(parser) {
		// return flags for tell action
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

		return parser;
	}
	
	static get_args() {

    // look for the command that comes after "friendship" call
    // by default it's the argument that comes after the friendship call
    // at this point, we prepare to make this more dynamic
    // but it doesn't seem like there is any need for dynamic placement
    // placement checking...
		var action = process.argv[2];

		var parser = new ArgumentParser({
			version: "0.0.1",
			addHelp: true,
			description: "Friendship is a distributed systems manager"
		});

		parser = Flags.ad_hoc(parser);
		
		// for consistency, store help sections for actions in a hash
		// so that we can reuse them when we want to print them all out
		switch(action) {
			case "listen":
				parser = Flags.listen(parser);
				break;

			case "tell":
				parser = Flags.tell(parser);
				break;

      case "greet":
        parser = Flags.greet(parser);
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

      // because typos?
      case "action":
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
}

module.exports = {
	get_args: Flags.get_args,
	Flags: Flags,
  help_sections: help_sections,
}

