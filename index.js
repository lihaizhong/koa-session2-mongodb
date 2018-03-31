/**
 * @author Sky
 * @email 854323752@qq.com
 * @create date 2018-03-31 03:49:52
 * @modify date 2018-03-31 03:49:52
 * @desc session持久化
 *       要求：mongodb > 3.x
 */

const { Store } = require('koa-session2')
const { MongoClient } = require('mongodb')
const log = console.log

class MongoStore extends Store {
  constructor (opts) {
    super()
    this.init(opts)
  }

  async init ({
    url,
    dbName,
    options,
    collection = 'koa__session',
    maxAge = 10 * 24 * 3600
  }) {
    try {
      const client = await MongoClient.connect(`${ url }/${ dbName }`, options)
      const db = client.db(dbName)
      this.coll = await db.createCollection(collection)
      const isExist = await this.coll.indexExists(['session__idx'])
      if (!isExist) {
        this.coll.createIndex(
          { lastAccess: 1 },
          { name: 'session_idx', expireAfterSeconds: maxAge }
        )
      }
    } catch (e) {
      log(e.message)
    }
  }

  async get (sid) {
    try {
      let doc = await this.coll.findOne({ sid: sid })
      return doc ? doc.session : undefined
    } catch (e) {
      log(e.message)
    }
  }

  async set (session, { sid = this.getID(24) }) {
    try {
      await this.coll.updateOne(
        { sid: sid },
        {
          $set: {
            sid: sid,
            session: session,
            lastAccess: new Date()
          }
        },
        { upsert: true }
      )
    } catch (e) {
      log(e.message)
    }
    return sid
  }

  async destroy (sid) {
    try {
      await this.coll.deleteOne({ sid: sid })
    } catch (e) {
      log(e.message)
    }
  }
}

module.exports = MongoStore
