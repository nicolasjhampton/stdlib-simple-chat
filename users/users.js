const store = require('../utils/index.js');

const DEFAULT_GROUP = "public";

/**
* add
* @param {string} username
* @returns {object}
*/
module.exports.add = async (username) => {
  let [ users, publicMembers ] = await Promise.all([
    store.get("users"),
    store.get("group", DEFAULT_GROUP),
  ]);

  if (users.includes(username)) {
    throw "Username already exists"
  }

  users = [...users, username];
  publicMembers = [...publicMembers, username];

  const res = await Promise.all([
    store.set("user", username, DEFAULT_GROUP),
    store.set("users", undefined, users),
    store.set("group", DEFAULT_GROUP, publicMembers),
  ]);

  if(!res.every(x => x)) {
    throw "communication failure"
  }
  
  return { username, users, members: publicMembers }
};

/**
* info
* @param {string} username
* @returns {object}
*/
module.exports.info = async (username) => {
  const [ group, users, groups ] = await Promise.all([
    store.get("user", username),
    store.get("users"),
    store.get("groups")
  ]);

  if (!group) {
    throw "User does not exist"
  }
  
  return { username, group, users, groups }
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
    default:
      throw "Action not found"
  }
  
  return { results }
};