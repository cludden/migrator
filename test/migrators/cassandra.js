import Bluebird from 'bluebird'
import fs from 'fs'
import joi from 'joi'
import Migrator from '../../lib'
import semverSort from 'semver-sort'
import { validate } from '../../lib/utils'
import { attempt, compact, findIndex } from 'lodash'

const migrator = attempt(function () {
  return new Migrator({
    /**
     * Execute a migration
     * @param  {String} id - migration id
     * @param  {String} method - migration method ['up', 'down']
     * @return  {Promise} promise
     * @this migrator
     */
    exec (id, method) {
      return fs.readFileAsync(`${__dirname}/../migrations/cassandra/${id}/${method}.cql`, 'utf8')
      .then(str => {
        return validate(str, joi.string())
        .then(validated => {
          return compact(validated.trim().split(';').map(s => s.trim()))
        })
      })
      .then(statements => {
        return Bluebird.each(statements, cql => {
          return cassandra.executeAsync(cql)
        })
      })
    },


    /**
     * Find the last executed migration
     * @return  {Promise} promise
     * @this migrator
     */
    last () {
      const cql = `SELECT * FROM version_history
      WHERE pk = 'schema_version'`
      return cassandra.executeAsync(cql)
      .then(result => {
        const last = result.rows.filter(r => r.type === 'end')[0].version
        return last
      })
      .catch(() => undefined)
    },


    /**
     * Record migration events
     * @param  {String} id - migration id
     * @param  {String} method - migration method ['up', 'down']
     * @param  {String} type - event type ['start', 'end']
     * @return  {Promise} promise
     * @this migrator
     */
    log (id, method, type) {
      // if this executing the first migration, ignore logging
      if (id === '1.0.0') {
        return Promise.resolve()
      }
      // if method is down, use prior version for logging purposes
      return this.getMigrations()
      .then(migrations => {
        if (method === 'up') {
          return id
        }
        return migrations[findIndex(migrations, m => m === id) - 1]
      })
      .then(version => {
        const cql = `INSERT INTO version_history (pk, ts, type, version)
        VALUES ('schema_version', now(), :type, :version)`
        if (type === 'end') {
          console.log('migration to ', version)
        }
        return cassandra.executeAsync(cql, { type, version }, { prepare: true })
      })
    },


    /**
     * Path to migrations folder
     * @type {String}
     */
    path: `${__dirname}/../migrations/cassandra`,


    /**
     * Sort migration ids
     * @param  {String[]} migrations - migration ids
     * @return  {String[]} sorted
     */
    sort (migrations) {
      return semverSort.asc(migrations)
    }
  })
})

export default migrator
