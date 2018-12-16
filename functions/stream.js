const messages = require('../messages/messages.js');

let id = 0;

/**
* @returns {object.http}
*/
module.exports = async function(context) {
  let body = `data:{"time": "${new Date().toTimeString()}"}\n\n`;
  id++;

  return {
    headers: {
      "Connection": "keep-alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache"
    },
    body: Buffer.from(body)
  }
};