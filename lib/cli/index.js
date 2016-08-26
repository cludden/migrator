#!/usr/bin/env node

import colors from 'colors'
import {
  current,
  down,
  pending,
  up
} from './commands'
import program from 'commander'
import pkg from '../../package.json'
import { pick } from 'lodash'

export default function cli (getMigrator) {
  const execute = getExecute(getMigrator)

  program.version(pkg.version)

  program.command('current')
  .description('list the last executed migration')
  .action(() => {
    execute(current)
  })

  program.command('down')
  .description('run down migrations')
  .option('-t, --to [version]', 'exclusive stop point')
  .action(cmd => {
    const options = pick(cmd, ['to'])
    execute(down(options))
  })

  program.command('pending')
  .description('list all pending migrations for the current environment')
  .action(() => {
    execute(pending)
  })

  program.command('up')
  .description('run pending migrations')
  .option('-t, --to [version]', 'migration upper limit')
  .action(cmd => {
    const options = pick(cmd, ['to'])
    execute(up(options))
  })

  if (process.argv.length <= 2) {
    program.outputHelp()
  }

  return {
    _program: program,
    start () {
      program.parse(process.argv)
    }
  }
}

  /**
   * Create command wrapper
   * @param  {Function} getMigrator - function that should return a promise that resovles to a termigrator instance
   * @return {Function} executeCommand - command executor
   */
function getExecute (getMigrator) {
  return function executeCommand (command) {
    getMigrator()
    .then(command)
    .then(() => process.exit(0))
    .catch(err => {
      console.error(colors.red(err.message))
      process.exit(1)
    })
  }
}
