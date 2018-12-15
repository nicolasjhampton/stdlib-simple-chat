
const store = require('../utils/index.js');
const user = require('../users/users.js');
const groups = require('../groups/groups.js');
const messages = require('../messages/messages.js');

const actionPattern = RegExp(/^([\w]+)\:([\w]+)$/);

(async function() {
  await Promise.all([
    store.set("user", "nichampton", true),
    store.set("group", "online", ["nichampton"]),
    store.set("users", ["nichampton"]),
    store.set("groups", ["public"]),
  ]);
})()

/**
* A basic chat api
* @param {string} username name of the user acting
* @param {string} action name of the action being taken
* @param {string} group group action is performed on
* @param {string} data data being attached to action taken
* @returns {object}
*/
module.exports = async (username, action="", group="", data="", context) => {
  console.log("here");
  const [command, verb, noun] = actionPattern.exec(action);
  let response = {};

  try {
    switch(noun) {
      case "user":
        response = await user.route(verb, username, data);
        break;
      case "group":
        response = await groups.route(verb, username, group);
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
