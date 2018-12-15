const store = require('../utils/index.js');


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
    setGroupList = store.set("groups", [...groups, group]);
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
    default:
      throw "Action not found";
  }

  return { results };
};