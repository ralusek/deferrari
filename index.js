'use strict';

// This establishes a private namespace.
const namespace = new WeakMap();
function p(object) {
  if (!namespace.has(object)) namespace.set(object, {});
  return namespace.get(object);
}



/**
 *
 */
module.exports = class Deferrari {
  /**
   *
   */
  constructor(config) {
    config = config || {};

    if (config.Promise) Promise = config.Promise;

    p(this).deferred = {};
    p(this).promises = {};

    p(this).resolution = {};
  }
  
  /**
   *
   */
  deferUntil(event) {
    if (p(this).promises[event]) return p(this).promises[event];

    return (p(this).promises[event] = new Promise((resolve, reject) => {
      p(this).deferred[event] = {resolve, reject};
    }))
    .then((result) => {
      p(this).resolution[event] = {result};
      return result;
    })
    .catch((err) => {
      p(this).resolution[event] = {error: err};
      return Promise.reject(err);
    });
  }

  /**
   *
   */
  isFulfilled(event) {
    return !!p(this).resolutions[event];
  }

  /**
   *
   */
  isFulfilling(event) {
    return !this.isFulfilled() && !!p(this).deferred[event];
  }
  
  /**
   *
   */
  resolve(event, payload) {
    if (!p(this).deferred[event]) this.deferUntil(event);
    p(this).deferred[event].resolve(payload);
    return p(this).promises[event];
  }
  
  /**
   *
   */
  reject(event, payload) {
    p(this).deferred[event].reject(payload);
    return p(this).promises[event];
  }
  
  /**
   *
   */
  clearResolution(event) {
    if (!p(this).resolution[event]) throw new Error(`Cannot clear resolution, event (${event}) not resolved.`);
    delete p(this).deferred[event];
    delete p(this).promise[event];
    delete p(this).resolution[event];
  }
}
