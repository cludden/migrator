import joi from 'joi'

export function processCassandraTask (cassandra, task) {
  return _splitAtSemicolon(task)
  .mapSeries(cql => {
    return cassandra.query(cql)
  })
}

function _splitAtSemicolon (str) {
  const result = joi.assert(str, joi.string())
  if (result.error) {
    return Promise.reject(result.error)
  }
  return Promise.resolve(str.split(';').map(s => s.trim()))
}
