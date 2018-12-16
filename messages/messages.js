const store = require('../utils/index.js');

/**
* send
* @param {string} username
* @param {string} message
* @returns {object}
*/
module.exports.send = async (username, message) => {
  const group = await store.get("user", username);

  if(!currentGroup) {
    throw "User does not exist";
  }

  let messages = await store.get("messages", group);
  
  messages = [...messages, [username, message]];

  const res = await store.set("messages", group, messages);

  if(!res.every(x => x)) {
    throw "communication failure"
  }
  // need to broadcast message to all users in group here

  return { username, group, messages }
};

/**
* messages
* @param {string} verb
* @param {string} username
* @param {string} data
* @returns {object}
*/
module.exports.route = async (verb, username, data) => {
  let results;

  switch(verb) {
    case "send":
      results = await this.send(username, data);
      break;
    default:
      throw "Action not found"
  }
  
  return { results }
};