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
    p(this).resolutions = {};
  }
  
  /**
   *
   */
  deferUntil(event) {
    // If resolution is stored, resolve (will reject if was error).
    if (p(this).resolutions[event]) return p(this).resolutions[event].resolve();
  
    if (!p(this).deferred[event]) p(this).deferred[event] = new DeferredQueue();

    return new Promise((resolve, reject) => {
      p(this).deferred[event].add({resolve, reject});
    });
  }

  /**
   *
   */
  isResolved(event) {
    return !!p(this).resolutions[event];
  }
  
  /**
   *
   */
  resolve(event, payload) {
    p(this).resolutions[event] = new Resolution(false, payload);
    
    if (p(this).deferred[event]) p(this).deferred[event].resolveAll(payload);
    return Promise.resolve(payload);
  }
  
  /**
   *
   */
  reject(event, payload) {
    p(this).resolutions[event] = new Resolution(true, payload);

    if (p(this).deferred[event]) p(this).deferred[event].rejectAll(payload);
    return Promise.reject(payload);
  }
  
  /**
   *
   */
  clearResolution(event) {
    delete p(this).resolution[event];
  }
}



/**
 *
 */
class DeferredQueue {
  /**
   *
   */
  constructor() {
    p(this).deferred = new Set();
  }
  
  /**
   *
   */
  add(deferred) {
    p(this).deferred.add(deferred);
  }
  
  /**
   *
   */
  resolveAll(payload) {
    p(this).deferred.forEach(deferred => deferred.resolve(payload));
    p(this).deferred.clear();
  }
  
  /**
   *
   */
  rejectAll(payload) {
    p(this).deferred.forEach(deferred => deferred.reject(payload));
    p(this).deferred.clear();
  }
}



/**
 *
 */
class Resolution {
  /**
   *
   */
  constructor(rejected, payload) {
    p(this).rejected = rejected === true;
    p(this).payload = payload;
  }
  
  /**
   *
   */
  resolve() {
    const payload = p(this).payload;
    return p(this).rejected ? Promise.reject(payload) : Promise.resolve(payload);
  }
}
