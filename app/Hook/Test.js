
const asyncHooks = require('async_hooks')
module.exports = (types) => {
  // will contain metadata for all tracked events
  this._tracked = {}
  const asyncHook = asyncHooks.createHook({
    init: (asyncId, type, triggerAsyncId, resource) => {
      if (!types || types.includes(type)) {
        const meta = {
          asyncId,
          type,
          pAsyncId: triggerAsyncId,
          res: resource
        }
        this._tracked[asyncId] = meta
        printMeta('init', meta)
      }
    },
    before: (asyncId) => {
      const meta = this._tracked[asyncId]
      if (meta) printMeta('before', meta)
    },
    after: (asyncId) => {
      const meta = this._tracked[asyncId]
      if (meta) printMeta('after', meta)
    },
    destroy: (asyncId) => {
      const meta = this._tracked[asyncId]
      if (meta) printMeta('destroy', meta)
      // delete meta for the event
      delete this._tracked[asyncId]
    },
    promiseResolve: (asyncId) => {
      const meta = this._tracked[asyncId]
      if (meta) printMeta('promiseResolve', meta)
    }
  })
  asyncHook.enable()
  function printMeta (eventName, meta) {
    console.log(`[${eventName}] asyncId=${meta.asyncId}, ` +
      `type=${meta.type}, pAsyncId=${meta.pAsyncId}, ` +
      `res type=${meta.res.constructor.name}`)
  }
}