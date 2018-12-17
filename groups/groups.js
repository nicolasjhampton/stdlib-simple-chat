const store = require('../utils/index.js');

/**
* list
* @returns {object}
*/
module.exports.list = async () => {
  const groups = await store.get("groups");

  return { groups }
};

/**
* info
* @param {string} group
* @returns {object}
*/
module.exports.info = async (group) => {
  const members = await store.get("group", group);

  if(!members) {
    throw "Group does not exist"
  }

  return { group, members }
};

/**
* join
* @param {string} group
* @param {string} username
* @returns {object}
*/
module.exports.join = async (group, username) => {
  let [ groups, messages ] = await Promise.all([
    store.get("groups"),
    store.get("messages", group),
  ]);

  messages = messages || [];

  let members = [];
  let setGroupList = Promise.resolve();
  let message = [username, `:::${username}::: has entered the room`];

  if(groups.includes(group)) {
    members = await store.get("group", group);
  } else {
    setGroupList = store.set("groups", undefined, [...groups, group]);
  }

  messages = [...messages, message];
  members = [...members, username];

  const res = await Promise.all([
    setGroupList,
    store.set("user", username, group),
    store.set("group", group, members),
    store.set("messages", group, messages),
  ]);

  console.log(res);

  if(!res.every(x => x)) {
    throw "communication failure"
  }

  return { group, members, messages }
};



/**
* groups
* @param {string} verb
* @param {string} username
* @param {string} group
* @returns {object}
*/
module.exports.route = async (verb, username, group, context) => {
  let results;
  
  switch (verb) {
    case "join":
      results = await this.join(group, username);
      break;
    case "info":
      results = await this.info(group);
      break;
    case "list":
      results = await this.list();
      break;
    default:
      throw "Action not found";
  }

  return { results };
};