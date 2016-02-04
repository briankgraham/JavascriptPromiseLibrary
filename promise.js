var Promise = function (func) {
  var state = 'PENDING', 
      value, 
      deferred;
  
  this.then = function (cb) {
    handle(cb);
  }

  func(resolve);
  
  function resolve (newValue) {
    value = newValue;
    state = 'RESOLVED';

    if (deferred) {
      handle(deferred);
    }
  }

  function handle (onResolved) {
    if (state === 'PENDING') {
      deferred = onResolved;
      return;
    }

    onResolved(value);
  }

};