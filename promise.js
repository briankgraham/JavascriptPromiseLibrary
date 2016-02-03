var Promise = function (func) {
  var callback = null;
  this.then = function (cb) {
    callback = cb;
  }

  function resolve (value) {
    setTimeout(callback(value), 1);
  }

  func(resolve);
};