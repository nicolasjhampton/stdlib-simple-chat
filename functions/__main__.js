
const store = require('../utils/index.js');
const user = require('../users/users.js');
const groups = require('../groups/groups.js');
const messages = require('../messages/messages.js');

const actionPattern = RegExp(/^([\w]+)\:([\w]+)$/);

let initialized = false;

async function init() {
  await store.drop()
  await Promise.all([
    store.set("user", "nichampton", "public"),
    store.set("group", "public", ["nichampton"]),
    store.set("users", undefined, ["nichampton"]),
    store.set("groups", undefined, ["public"]),
  ]);
  initialized = true;
}

/**
* A basic chat api
* @param {string} username name of the user acting
* @param {string} action name of the action being taken
* @param {string} group group action is performed on
* @param {string} data data being attached to action taken
* @returns {object}
*/
module.exports = async (username, action="", group="", data="", context) => {
  const [command, verb, noun] = actionPattern.exec(action);
  let response = {};

  if(!initialized){
    await init();
  }

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

  // response.status = await store.dump();

  return response;
  
};
