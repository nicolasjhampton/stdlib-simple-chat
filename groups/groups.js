const lib = require('lib');
const users = require('../users/users.js');
const groups = new Map([
  ["online", []]
]);

/**
* join
* @param {string} group
* @param {string} username
* @returns {object}
*/
module.exports.join = async (group, username) => {
  const groupExists = groups.has(group);

  let grouplist = groupExists ? groups.get(group) : [];

  grouplist = [...grouplist, username]

  // everyone joins the online list
  const res = await users.enter(username, group);

  groups.set(group, grouplist)

  return { group: group, users: grouplist }
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