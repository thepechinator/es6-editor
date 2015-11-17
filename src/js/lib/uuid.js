module.exports = function *() {
  var index = 0;
  while(true) {
    index++;
    yield `xxxx-xxxx-xxxx-${index}`;
  }
};