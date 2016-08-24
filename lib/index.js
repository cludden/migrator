import Bluebird from 'bluebird'
import fs from 'fs'
import joi from 'joi'

import getExecuted from './get-executed'
import getMigrations from './get-migrations'
import getPending from './get-pending'
import up from './up'

Bluebird.promisifyAll(fs)

class Migrator {
  constructor (options) {
    joi.assert(options, joi.object({
      down: joi.func().required().description('down task runner, should return promise'),
      executed: joi.func().required().description('get list of executed migrations, should return promise'),
      log: joi.func().required().description('record a successful migration, should return promise'),
      path: joi.string().required().description('absolute path to migrations folder'),
      unlog: joi.func().required().description('remove a recorded migration after a successful reversion, should return promise'),
      up: joi.func().required().description('up task runner, should return promise')
    }).required())
    this.options = options
  }
}

Migrator.prototype.getExecuted = getExecuted
Migrator.prototype.getMigrations = getMigrations
Migrator.prototype.getPending = getPending
Migrator.prototype.up = up

export default Migrator
