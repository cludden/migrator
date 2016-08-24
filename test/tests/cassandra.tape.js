import fs from 'fs'
import Migrator from '../../lib'
import test from 'tape'
import testUtils from '../utils'
import { getSection } from '../../lib/utils'
import _ from 'lodash'

const ids = fs.readdirSync(`${__dirname}/../migrations/cassandra`) // eslint-disable-line

const migrator = _.attempt(function () {
  return new Migrator({
    down (task) {
      return testUtils.processCassandraTask(cassandra, task)
    },

    executed () {
      const cql = 'SELECT * FROM migrations'
      cassandra.query(cql)
    .then(result => result.rows)
    .catch(() => [])
    },

    log (id) {
      const created = new Date()
      const cql = `INSERT INTO migrations (id, created)
    VALUES (:id, :created)`
      return cassandra.query(cql, { id, created })
    },

    path: `${__dirname}/../migrations/cassandra`,

    unlog (id) {
      const cql = `DELETE * FROM migrations
    WHERE id = :id`
      return cassandra.query(cql, { id })
    },

    up (task) {
      return testUtils.processCassandraTask(cassandra, task)
    }
  })
})

test('constructor tests', t => {
  t.equal(migrator instanceof Error, false, 'should not throw')
  t.equal(_.isObject(migrator), true, 'should be an object')
  t.end()
})

test('#getExecuted', t => {
  migrator.getExecuted()
  .then(executed => {
    t.deepEqual(executed, [], 'should return an empty array')
    t.end()
  })
  .catch(t.end)
})

test('#getMigrations', t => {
  migrator.getMigrations()
  .then(migrations => {
    t.deepEqual(migrations, ids, 'should be equal')
    t.end()
  })
  .catch(t.end)
})

test('#getPending', t => {
  migrator.getPending()
  .then(pending => {
    t.deepEqual(pending, ids, 'should be equal')
    t.end()
  })
  .catch(t.end)
})

test('#up', t => {
  migrator.up()
  .then(executed => {
    t.deepEqual(executed, ids, '#up return value should be equal to all ids')
  })
  .then(migrator.getPending)
  .then(pending => {
    t.deepEqual(pending, [], '#getPending should be an empty array')
  })
  .then(migrator.getExecuted)
  .then(executed => {
    t.deepEqual(executed, ids, '#getExecuted should be equal to all ids')
    t.end()
  })
  .catch(t.end)
})

test('#down', t => {
  migrator.down()
  .then(executed => {
    t.deepEqual(executed, ids, '#up return value should be equal to all ids')
  })
  .then(migrator.getPending)
  .then(pending => {
    t.deepEqual(pending, ids, '#getPending should be equal to all ids')
  })
  .then(migrator.getExecuted)
  .then(executed => {
    t.deepEqual(executed, [], '#getExecuted should be an empty array')
    t.end()
  })
  .catch(t.end)
})

test('#up(to)', t => {
  const expected = getSection(ids, 'up', '2016-01-01-00-00-00', '2016-08-23-15-49-59')
  migrator.up({ to: '2016-08-23-15-49-59' })
  .then(executed => {
    t.deepEequal(executed, expected)
  })
  .then(migrator.getPending)
  .then(pending => {
    t.deepEqual(pending, ['2016-08-23-21-32-26'])
  })
  .then(migrator.getExecuted)
  .then(executed => {
    t.deepEqual(executed, expected)
    t.end()
  })
  .catch(t.end)
})
