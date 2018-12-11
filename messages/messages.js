
const lib = require('lib');
const users = require('../users/users.js');

const messages = new Map();

/**
* send
* @param {string} username
* @param {string} message
* @returns {object}
*/
module.exports.send = async (username, message) => {
  console.log("hello");
  const userInfo = await users.info(username);
  
  const { info: { currentGroup } } = userInfo;

  if(!currentGroup) {
    throw "User hasn't joined a group yet";
  }
  
  let messagelist = messages.get(currentGroup) || [];
  
  messagelist = [...messagelist, [username, message]];

  messages.set(currentGroup, messagelist);

  // need to broadcast message to all users in group here

  return { user: username, group: currentGroup, messages: Array.from(messagelist) }
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
      console.log(verb);
      results = await this.send(username, data);
      break;
    default:
      throw "Action not found"
  }
  
  return { results }
};