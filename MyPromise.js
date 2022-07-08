const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

class MyPromise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onResolveCallbacks = [];
    this.onRejectedClaaback = [];

    let resolve = (value) => {
      if (this.status == PENDING) {
        this.status = FULFILLED;
        this.value = value
        this.onResolveCallbacks.map(fn => fn())
      }
    }

    let reject = (reason) => {
      if (this.status == PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedClaaback.map(fn => fn())
      }
    }

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error)
    }
  };
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => { };
    onRejected = typeof onRejected === 'function' ? onRejected : (value) => { };

    switch (this.status) {
      case PENDING: {
        return new Promise((resolve, reject) => {
          this.onResolveCallbacks.push(() => {
            const result = onFulfilled(this.value);
            if (result instanceof MyPromise) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          })
          this.onRejectedClaaback.push(() => {
            const result = onRejected(this.reason);
            if (result instanceof MyPromise) {
              result.then(resolve, reject);
            } else {
              reject(result);
            }
          })

        })
      }
      case FULFILLED: {
        return new MyPromise((resolve, reject) => {
          const result = onFulfilled(this.value);
          if (result instanceof MyPromise) {
            result.then(resolve, reject);
          } else {
            resolve(result);
          }
        })
      }
      case REJECTED: {
        return new MyPromise((resolve, reject) => {
          const result = onRejected(this.reason);
          if (result instanceof MyPromise) {
            result.then(resolve, reject);
          } else {
            reject(result);
          }
        })
      }

    }
  };
  catch(onRejected) {
    return this.then(undefined, onRejected)
  };
}


console.log("1");
const p = new MyPromise((resolve, reject) => {
  console.log("2");

  // reject("失败");
  setTimeout(() => {
    console.log("4");
    resolve("成功");
  }, 0);
})
p.then((res) => {
  console.log(res, "3");
})
  .catch((res) => {
    console.log(res, "f");
  })
p.then(res => {
  console.log(null);
})
