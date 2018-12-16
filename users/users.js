const store = require('../utils/index.js');

const DEFAULT_GROUP = "public";

/**
* add
* @param {string} username
* @returns {object}
*/
module.exports.add = async (username) => {
  let [ users, publicGroup ] = await Promise.all([
    store.get("users"),
    store.get("group", DEFAULT_GROUP),
  ]);

  if (users.includes(username)) {
    throw "Username already exists"
  }

  users = [...users, username]
  publicGroup = [...publicGroup, username]

  console.log("users", users);
  console.log("public group", publicGroup)

  const [ userReply, usersReply, groupsReply ] = await Promise.all([
    store.set("user", username, DEFAULT_GROUP),
    store.set("users", undefined, users),
    store.set("group", DEFAULT_GROUP, publicGroup)
  ]);

  const success = userReply && usersReply && groupsReply;
  
  return { username, users, publicGroup, success }
};

/**
* info
* @param {string} username
* @returns {object}
*/
module.exports.info = async (username) => {
  const [ currentGroup, users, groups ] = await Promise.all([
    store.get("user", username),
    store.get("users"),
    store.get("groups")
  ]);

  if (!currentGroup) {
    throw "User does not exist"
  }
  
  return { username, currentGroup, users, groups }
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