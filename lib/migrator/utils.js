import Bluebird from 'bluebird'
import joi from 'joi'
import _ from 'lodash'

/**
* Get a section of migrations in either direction
* @param  {String[]} migrations - sorted list of migration ids
* @param  {String} method - migration direction ['up', 'down']
* @param  {String} from - start id
* @param  {String} [to] - end id
* @return  {String[]} ids
*/
export function getSection (migrations, method, from, to) {
  migrations = method === 'down' ? _.reverse(migrations.slice()) : migrations.slice()
  const start = _.findIndex(migrations, m => m === from)
  let end = to ? _.findIndex(migrations, m => m === to) : migrations.length
  if (method === 'down' && to) {
    end--
  }
  if (start < 0 || end < 0) {
    throw new Error(`Unable to find valid migration list for start (${from}) and end (${to})`)
  }
  return migrations.slice(start, end + 1)
}


/**
* Promisified joi validate function
* @param  {*} val - value to validate
* @param  {Function} schema - joi schema
* @param  {Object} [options={}] - validate options
* @return  {Promise} promise
*/
export function validate (val, schema, options = {}) {
  const result = joi.validate(val, schema, options)
  if (result.error) {
    return Bluebird.reject(result.error)
  }
  return Bluebird.resolve(result.value)
}
