var uuid = require('./src/js/lib/uuid');

module.exports = function(env) {
  // Note how for generator functions you need to call
  // the actual method and use that. If you call the
  // method each time you use it, it will never increment.
  env.addGlobal('uuid', uuid());
}