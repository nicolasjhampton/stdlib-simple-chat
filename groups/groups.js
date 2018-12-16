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
  const groups = store.get("groups");

  let groupUsers = [];
  let setGroupList = Promise.resolve();
  

  if(groups.includes(group)) {
    groupUsers = store.get("group", group);
  } else {
    setGroupList = store.set("groups", undefined, [...groups, group]);
  }

  groupUsers = [...groupUsers, username]

  const [groupsReply, groupReply, groupUsersReply] = await Promise.all([
    setGroupList,
    store.set("user", username, group),
    store.set("group", group, groupUsers),
  ]);

  return { group: groupReply, users: groupUsersReply }
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