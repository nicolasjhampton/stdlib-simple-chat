const lib = require('lib');
const kv = lib({ token: process.env.STDLIB_LIBRARY_TOKEN }).utils.kv;

let id = 0;
let messageUpdate = [];

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
    case "messages":
      messageUpdate.push(key);
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
    case "messages":
      return await kv.get({ key: `messages:${key}` })
      break;
    default:
      console.log("OOPS");
  }
}

/**
* drop
* @returns {any}
*/
module.exports.drop = async function() {
  return await kv.tables.truncate({ table: "nichampton" });
}

/**
* dump
* @returns {any}
*/
module.exports.dump = async function() {
  return await kv.entries();
}

/**
 * stream
 * @param {string} group
 * @returns {object.http}
 */
module.exports.listen = async function(group="") {
  

  let preamble = "data:";
  let json = JSON.stringify({
    "time": new Date().toTimeString()
  });

  const index = messageUpdate.indexOf(group)
  console.log(group);
  console.log(messageUpdate);
  console.log(index);

  if(index !== -1) {
    console.log("hello dolly!")
    messageUpdate.splice(index, 1);
    const messages = await this.get("messages", group);
    preamble = "event: " + group + "\nid: " + id + "\ndata:";
    json = JSON.stringify({
      "group": group,
      "messages": messages
    })
    id++
  }

  let body = `${preamble}${json}\n\n`;

  return {
    headers: {
      "Connection": "keep-alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache"
    },
    body: Buffer.from(body)
  }
};