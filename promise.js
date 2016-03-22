function handle(promise, val) {
  var item, deferred;

  promise.result = val;

  setTimeout(function () {
    while (promise.queue.length) {
      item = promise.queue.shift();
      if (item.state === 'REJECTED') {
        deferred = item.errback;
      } else {
        deferred = item.callback;
      }
      if (deferred) {
        try {
          promise.result = deferred(promise.result);
        } catch (e) {
          promise.state = 'REJECTED';
          promise.result = e;
        }
      }
    }   
  }, 1);
}

var Promise = function (func) {
  var that = this;
  this.state = 'PENDING';

  this.queue = [];

  func(function (value) {
    that.resolve(value)
  });
};

Promise.prototype.then = function (callback, errback) {
  this.queue.push({ callback: callback, errback: errback });
  if (this.state !== 'PENDING') {
    handle(this, this.result);
  }
  return this;
}

Promise.prototype.resolve = function (newValue) {
  // check if Rejected / Fulfilled
  if (this.state === 'REJECTED') {
    throw new Error('Promise has been rejected');
  }
  if (this.state === 'FULFILLED') {
    throw new Error('Promise can only be fulfilled once');
  }
  this.result = newValue;
  this.state = 'RESOLVED';
  handle(this, this.result);
};

Promise.prototype.reject = function (error) {
  // check if Rejected / Fulfilled
  if (this.state === 'REJECTED') {
    throw new Error('Promise has been rejected');
  }
  if (this.state === 'FULFILLED') {
    throw new Error('Promise can only be fulfilled once');
  }
  this.result = newValue;
  this.state = 'REJECTED';

  handle(this, error);
};


var Promises = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(5);
  });
});


console.log(Promises.then(function (res) {
  console.log('first: ' , res)
  return res + 1;
}).then(function (resp) {
  console.log('resp: ', resp)
  setTimeout(function () {
    return new Promise(function (resolve, reject) {
      resolve(resp+1);
    }).then(function (lastVal) {
      console.log('lastVal: ', lastVal);
    });
  }, 1000);
}));
console.log(Promises)
console.log('hey this should be first not last')