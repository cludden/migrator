import Bluebird from 'bluebird'
import EventEmitter from 'events'
import joi from 'joi'
import { getSection, validate } from './utils'
import _ from 'lodash'

export default class Migrator extends EventEmitter {
  constructor (options) {
    super()
    joi.assert(options, joi.object({
      execMigration: joi.func().required().description('execute migration, should return promise'),
      getLastExecuted: joi.func().required().description('get id of last executed migration, should return promise'),
      getMigrations: joi.func().required().description('get a sorted list of all available migrations, should return a promise'),
      log: joi.func().required().description('record migration event, should return promise')
    }).unknown(true).required())
    this.options = options
    this.migrations = null
  }


  /**
   * Execute the down migration for all executed migrations
   * @param  {Object} [options={}] - options
   * @param  {String} options.to - ending migration id
   * @return  {Promise} promise
   */
  down (options = {}) {
    return Bluebird.all([
      this.getLastExecuted(),
      this.getMigrations()
    ]).spread((last, migrations) => {
      if (!options.to) {
        return getSection(migrations, 'down', last)
      }
      return getSection(migrations, 'down', last, options.to)
    })
    .then(pending => {
      return Bluebird.each(pending, id => {
        return this.execute(id, 'down')
      })
    })
  }


  /**
   * Execute a single migration in one direction
   * @param  {String} id - migration id
   * @param  {String} method - migration direction ['up', 'down']
   * @param  {Object} [options] - execute options
   * @param  {Boolean} [options.log=true] - whether or not to log start/end for this migration
   * @return  {Promise} promise
   */
  execute (id, method, options = {}) {
    const exec = this.options.execMigration.bind(this, id, method)
    const log = {
      start: Bluebird.resolve,
      end: Bluebird.resolve
    }

    if (options.log !== false) {
      log.start = this.options.log.bind(this, id, method, 'start')
      log.end = this.options.log.bind(this, id, method, 'end')
    }

    return log.start()
    .then(exec)
    .then(log.end)
    .then(() => id)
  }


  /**
   * Return the id of the last executed migration
   * @return  {Promise} promise
   */
  getLastExecuted () {
    return this.options.getLastExecuted.call(this)
  }


  /**
   * Retreive the sorted list of migrations
   * @return  {Promise} promise
   * @this migrator
   */
  getMigrations () {
    return this.options.getMigrations.call(this)
  }


  /**
   * Get a list of pending migrations to be executed
   * @return  {Promise} promise
   */
  getPending () {
    return Bluebird.all([
      this.getMigrations(),
      this.getLastExecuted()
    ]).spread((migrations, last) => {
      last = _.findIndex(migrations, m => m === last)
      if (last === -1) {
        return getSection(migrations, 'up', migrations[0])
      }
      if (last === migrations.length - 1) {
        return []
      }
      return getSection(migrations, 'up', migrations[last + 1])
    })
  }


  /**
   * Go to a specific version.
   * @param  {String} version - migration version
   * @return  {Bluebird} bluebird
   */
  goto (version) {
    return Bluebird.all([
      this.getMigrations(),
      this.getLastExecuted()
    ]).spread((migrations, current) => {
      const indexes = {}
      migrations.forEach((m, i) => {
        if (m === current) {
          indexes.current = i
        } else if (m === version) {
          indexes.target = i
        }
      })
      if (!indexes.hasOwnProperty('current') && !indexes.hasOwnProperty('target')) {
        throw new Error('Unable to find current or target migration')
      }
      const direction = indexes.current < indexes.target ? 'up' : 'down'
      const fromMigration = migrations[indexes.current + (direction === 'up' ? 1 : 0)]
      return [direction, getSection(migrations, direction, fromMigration, version)]
    })
    .spread((direction, pending) => {
      return Bluebird.each(pending, id => {
        return this.execute(id, direction)
      })
      .return(pending)
    })
  }

  /**
   * Execute all pending migrations in the up direction
   * @param  {Object} [options={}] - options
   * @param  {String} options.to - ending task migration id
   * @return  {Promise} promise
   */
  up (options = {}) {
    const schema = joi.object({
      to: joi.string()
    }).default({})
    return validate(options, schema).then(validated => {
      options = validated
      return
    })
    .then(this.getPending.bind(this))
    .then(pending => {
      if (!options.to) {
        return pending
      }
      return getSection(pending, 'up', pending[0], options.to)
    })
    .then(pending => {
      this.emit('up:start', pending)
      return Bluebird.each(pending, id => {
        return this.execute(id, 'up')
      })
      .then(() => this.emit('up:end', pending))
      .return(pending)
    })
  }
}
