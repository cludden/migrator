import Bluebird from 'bluebird'

/**
 * Get a list of pending migrations to be executed
 * @return  {Promise} promise
 * @this migrator
 */
export default function getPending () {
  Bluebird.all([
    this.getMigrations(),
    this.getExecuted()
  ]).spread((migrations, executed) => {
    const map = executed.reduce((memo, id) => {
      memo[id] = true
      return memo[id]
    }, {})
    return migrations.filter(id => !map.hasOwnProperty(id)).sort()
  })
}
