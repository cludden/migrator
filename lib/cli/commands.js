import Bluebird from 'bluebird'
import colors from 'colors'
import promptly from 'promptly'

Bluebird.promisifyAll(promptly)

/**
 * List the last executed migration
 * @param  {Object} migrator - migrator instance
 * @return {Promsie} promise
 */
export function current (migrator) {
  return migrator.getLastExecuted()
  .then(last => {
    if (last === undefined) {
      console.log('')
      console.log(colors.grey('It doesn\'t look like any migrations have been executed.'))
      console.log('')
    } else {
      console.log('')
      console.log(colors.grey(`The last executed migration was: ${last}`))
      console.log('')
    }
  })
}

/**
 * Run down migrations
 * @param  {Object} [options={}] - options
 * @return {Function} command
 */
export function down (options = {}) {
  return function _down (migrator) {
    return migrator.getLastExecuted()
    .then(last => {
      console.log('')
      console.log(colors.grey(`The last executed migration was ${last}`))
      const endpoint = options.to ? options.to : 'the beginning'
      const prompt = `Are you sure you want to rollback to ${endpoint}:`
      return promptly.confirm(prompt, { retry: true })
    })
    .then(confirmed => {
      if (confirmed === false) {
        return
      }
      return migrator.down(options)
    })
    .then(executed => {
      console.log('')
      return executed
    })
  }
}

/**
 * List all pending migrations
 * @param  {Object} migrator - migrator instance
 * @return {Promise} promise
 */
export function pending (migrator) {
  return migrator.getPending()
  .then(pending => {
    console.log('')
    if (pending.length === 0) {
      console.log(colors.grey('No pending migrations found, current environment is up to date.'))
    } else {
      console.log(colors.grey(`${pending.length} pending migrations found:`))
    }
    return pending
  })
  .each(version => {
    console.log(colors.grey(`- ${version}`))
  })
  .then(versions => {
    console.log('')
    return versions
  })
}

/**
 * Run pending migrations
 * @param  {Object} options - up options
 * @return {Function} command
 */
export function up (options = {}) {
  return function _up (migrator) {
    return pending(migrator)
    .then(() => {
      const prompt = 'Are you sure you want to migrate?'
      return promptly.confirm(prompt, { retry: true })
    })
    .then(confirmed => {
      if (confirmed === false) {
        return
      }
      return migrator.up(options)
    })
  }
}
