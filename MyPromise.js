const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

class MyPromise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onResolveCallbacks = [];
    this.onRejectedCallbacks = [];

    let resolve = (value) => {
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value
        this.onResolveCallbacks.map(fn => fn())
      }
    }

    let reject = (reason) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.map(fn => fn())
      }
    }

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error)
    }
  };
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => {};
    onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err
    };;

    switch (this.status) {
      case PENDING: {
        return new MyPromise((resolve, reject) => {
          this.onResolveCallbacks.push(() => {
            try {
              const result = onFulfilled(this.value);
              if (result instanceof MyPromise) {
                result.then(resolve, reject);
              } else {
                resolve(result);
              }
            } catch (error) {
              reject(error);
            }
          })
          this.onRejectedCallbacks.push(() => {
            try {
              const result = onRejected(this.reason);
              if (result instanceof MyPromise) {
                result.then(resolve, reject);
              } else {
                reject(this.reason);
              }
            } catch (error) {
              reject(error);
            }
          })
        })
      }
      case FULFILLED: {
        return new MyPromise((resolve, reject) => {
          try {
            const result = onFulfilled(this.value);
            if (result instanceof MyPromise) {
              result.then(resolve, reject);
            } else {
              resolve(result);
            }
          } catch (error) {
            reject(error);
          }

        })
      }
      case REJECTED: {
        return new MyPromise((resolve, reject) => {
          try {
            const result = onRejected(this.reason);
            if (result instanceof MyPromise) {
              result.then(resolve, reject);
            } else {
              reject(this.reason);
            }
          } catch (error) {
            reject(error)
          }
        })
      }

    }
  };
  catch (onRejected) {
    return this.then(undefined, onRejected)
  };
}


console.log("1");

const p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    // reject("error");
    resolve("hello world"); // 不好使了
    resolve("hello world2"); // 不好使了
  }, 1000);
});

// p.then(value => console.log(value + "dpf"))
//   .then(()=>console.log(211))
//   .catch((err)=>{
//     console.log(err);
//   }
//   );
// p.then(value => console.log(value + "dpf"))


p.then((res)=>{
  let a= new MyPromise((resolve,rejected)=>{
    resolve("then promise")
  })
  return a
  // console.log(res);
}).then((res)=>{
  console.log(res);
})
