import fs from 'fs'
import { isArray } from 'lodash'

let migrations

/**
 * Retreive the sorted list of migrations
 * @return  {Promise} promise
 * @this migrator
 */
export default function getMigrations () {
  const path = this.options.path

  // return migrations if they have already been retrieved
  if (isArray(migrations)) {
    return Promise.resolve(this.migrations)
  }

  // otherwise, fetch them, sort them, and return
  return fs.readdirAsync(path)
  .filter(dir => {
    return fs.statAsync(`${path}/${dir}`)
    .then(stats => stats.isDirectory())
  })
  .then(migrations => migrations.sort())
  .then(sorted => {
    migrations = sorted
    return sorted
  })
}
