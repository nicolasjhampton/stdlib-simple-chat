const stream = require('../utils/index.js');

/**
* @param {string} group
* @returns {object.http}
*/
module.exports = async function(group="", context) {
  return await stream.listen(group);
}