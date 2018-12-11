const lib = require('lib');
const groups = require('../groups/groups.js');

const users = new Map([
  ["nichampton", { currentGroup: "online" }]
]);

/**
* add
* @param {string} username
* @returns {object}
*/
module.exports.add = async (username) => {
  const alreadyExists = users.has(username);

  if (alreadyExists) {
    throw "Username already exists"
  }

  const info = {
    currentGroup: "online"
  }

  users.set(username, info)

  // everyone joins the online list
  await groups.join("online", username);
  
  return { user: username, users: Array.from(users.keys()) }
};

/**
* info
* @param {string} username
* @returns {object}
*/
module.exports.info = async (username) => {
  const alreadyExists = users.has(username);

  if (!alreadyExists) {
    throw "User does not exist"
  }
  
  const info = users.get(username)
  
  return { user: username, info: info }
};

/**
* enter
* @param {string} username
* @param {string} group
* @returns {object}
*/
module.exports.enter = async (username, group) => {
  const alreadyExists = users.has(username);

  if (!alreadyExists) {
    throw "User does not exist"
  }

  const info = users.get(username);
  info.currentGroup = group;
  users.set(username, info);

  return { user: username, info: info }
};


/**
* users
* @param {string} verb
* @param {string} username
* @param {string} data
* @returns {object}
*/
module.exports.route = async (verb, username, data="", context) => {
  let results;
  
  switch(verb) {
    case "add":
      results = await this.add(username);
      break;
    case "info":
      results = await this.info(username);
      break;
    case "enter":
      results = await this.enter(username, data);
      break;
    default:
      throw "Action not found"
  }
  
  return { results }
};