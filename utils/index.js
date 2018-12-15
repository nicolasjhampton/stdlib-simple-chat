const lib = require('lib');
const kv = lib({ token: process.env.STDLIB_LIBRARY_TOKEN }).utils.kv;

/**
* set
* @param {string} noun
* @param {string} key
* @param {any} value
* @returns {any}
*/
module.exports.set = async function(noun, key="", value="") {
  switch(noun) {
    case "user":
      return await kv.set({
        key: `user:${key}`,
        value: value // currentGroup
      })
      break;
    case "users":
      return await kv.set({
        key: `users`,
        value: value // list of groups
      })
      break;
    case "group":
      return await kv.set({
        key: `group:${key}`,
        value: value //
      })
      break;
    case "groups":
      return await kv.set({
        key: `groups`,
        value: value
      })
      break;
    case "message":
      return await kv.set({
        key: `messages:${key}`,
        value: value
      })
      break;
    default:
      console.log("OOPS");
  }
}

/**
* set
* @param {string} noun
* @param {string} key
* @returns {any}
*/
module.exports.get = async function(noun, key="") {
  switch(noun) {
    case "user":
      return await kv.get({ key: `user:${key}` })
      break;
    case "users":
      return await kv.get({ key: `users` })
      break;
    case "group":
      return await kv.get({ key: `group:${key}` })
      break;
    case "groups":
      return await kv.get({ key: `groups` })
      break;
    case "message":
      return await kv.set({ key: `messages:${key}` })
      break;
    default:
      console.log("OOPS");
  }
}