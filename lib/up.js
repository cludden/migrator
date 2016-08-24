import joi from 'joi'
import _ from 'lodash'

export default function up (options = {}) {
  _validateOptions(options)
  .then(this.getPending)
  .then(pending => {
    if (!options.to) {
      return pending
    }
    return _filterTo(pending, options.to)
  })
  .each(id => {
    return this.execute(id, 'up')
    .then(this.log)
  })
}

function _filterTo (pending, to) {
  let done = false
  return _.takeWhile(pending, id => {
    if (done === true) {
      return false
    }
    if (id === to) {
      done = true
    }
    return true
  })
}

function _validateOptions (options) {
  const schema = joi.object({
    to: joi.string()
  }).default({})
  const result = joi.validate(options, schema)
  if (result.error) {
    return Promise.reject(result.error)
  }
  return Promise.resolve(options)
}
