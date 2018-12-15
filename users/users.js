const store = require('../utils/index.js');


/**
* add
* @param {string} username
* @returns {object}
*/
module.exports.add = async (username) => {
  
  const users = await store.get("users");

  if (users.includes(username)) {
    throw "Username already exists"
  }
  console.log(users)
  const [ userReply, usersReply ] = await Promise.all([
    store.set("user", username, true),
    store.set("users", users.push(username)),
  ]);
  
  return { user: username, users: usersReply }
};

/**
* info
* @param {string} username
* @returns {object}
*/
module.exports.info = async (username) => {
  const group = await store.get("user", username);

  if (!group) {
    throw "User does not exist"
  }
  
  return { user: username, info: group }
};

/**
* enter
* @param {string} username
* @param {string} group
* @returns {object}
*/
module.exports.enter = async (username, group) => {
  const currentGroup = store.get("user", username);

  if (!currentGroup) {
    throw "User does not exist"
  }

  await store.set("user", username, group)

  return { user: username, info: group }
};


/**
* users
* @param {string} verb
* @param {string} username
* @param {string} data
* @returns {object}
*/
module.exports.route = async (verb, username, data="", context) => {
  console.log(username, data)
  let results;
  
  switch(verb) {
    case "add":
      console.log("in the add")
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