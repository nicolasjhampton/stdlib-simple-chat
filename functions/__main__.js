
const lib = require('lib');
const user = require('../users/users.js');
const groups = require('../groups/groups.js');
const messages = require('../messages/messages.js');

const actionPattern = RegExp(/^([\w]+)\:([\w]+)$/);

/**
* A basic chat api
* @param {string} username name of the user acting
* @param {string} action name of the action being taken
* @param {string} data data being attached to action taken
* @returns {object}
*/
module.exports = async (username, action="", data="", context) => {
  const [command, verb, noun] = actionPattern.exec(action);
  let response = {};

  try {
    switch(noun) {
      case "user":
        response = await user.route(verb, username, data);
        break;
      case "group":
        response = await groups.route(verb, username, data);
        break;
      case "message":
        response = await messages.route(verb, username, data);
        break;
      default:
        throw "please provide a valid noun";
    }
  } catch (e) {
    response.error = e;
  }

  response.action = command;

  return response;
  
};
