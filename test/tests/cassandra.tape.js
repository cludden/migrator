import fs from 'fs'
import migrator from '../migrators/cassandra'
import test from 'tape'
import { getSection } from '../../lib/utils'
import _ from 'lodash'

const ids = fs.readdirSync(`${__dirname}/../migrators/cassandra/migrations`) // eslint-disable-line

test('constructor tests', t => {
  t.equal(migrator instanceof Error, false, 'should not throw')
  t.equal(_.isObject(migrator), true, 'should be an object')
  t.end()
})


test('#getExecuted', t => {
  migrator.getLastExecuted()
  .then(executed => {
    t.deepEqual(executed, undefined, '#getExecuted should return undefined')
    t.end()
  })
  .catch(t.end)
})


test('#getMigrations', t => {
  migrator.getMigrations()
  .then(migrations => {
    t.deepEqual(migrations, ids, `#getMigrations should equal ${JSON.stringify(ids)}`)
    t.end()
  })
  .catch(t.end)
})


test('#getPending', t => {
  migrator.getPending()
  .then(pending => {
    t.deepEqual(pending, ids, `#getPending should equal ${JSON.stringify(ids)}`)
    t.end()
  })
  .catch(t.end)
})


test('#up', t => {
  migrator.up()
  .then(executed => {
    t.deepEqual(executed, ids, '#up return value should be equal to all ids')
  })
  .then(migrator.getPending.bind(migrator))
  .then(pending => {
    t.deepEqual(pending, [], '#getPending should be an empty array')
  })
  .then(migrator.getLastExecuted.bind(migrator))
  .then(last => {
    t.equal(last, _.last(ids), '#getLastExecuted should return the last id')
    t.end()
  })
  .catch(t.end)
})


test('#down', t => {
  migrator.down()
  .then(executed => {
    const expected = _.reverse(ids.slice())
    t.deepEqual(executed, expected, `#down return value should be equal to ${JSON.stringify(expected)}`)
  })
  .then(migrator.getPending.bind(migrator))
  .then(pending => {
    t.deepEqual(pending, ids, '#getPending should be equal to all ids')
  })
  .then(migrator.getLastExecuted.bind(migrator))
  .then(last => {
    t.equal(last, undefined, '#getLastExecuted should be undefined')
    t.end()
  })
  .catch(t.end)
})


test('#up(to)', t => {
  const to = '1.1.0'
  const expected = getSection(ids, 'up', ids[0], to)
  migrator.up({ to })
  .then(executed => {
    t.deepEqual(executed, expected, '#up(to) should return correct list of executed ids')
  })
  .then(migrator.getPending.bind(migrator))
  .then(pending => {
    t.deepEqual(pending, _.takeRight(ids), '#getPending should return last id')
  })
  .then(migrator.getLastExecuted.bind(migrator))
  .then(last => {
    t.equal(last, _.last(expected), '#getLastExecuted should return last id of the slice')
    t.end()
  })
  .catch(t.end)
})


test('#down(to)', t => {
  const to = '1.0.0'
  const expected = getSection(ids, 'down', '1.1.0', to)
  migrator.down({ to })
  .then(executed => {
    t.deepEqual(executed, expected, '#down(to) should return the correct list of executed ids')
  })
  .then(migrator.getPending.bind(migrator))
  .then(pending => {
    t.deepEqual(pending, getSection(ids, 'up', '1.1.0'), '#getPending should return the correct ids')
  })
  .then(migrator.getLastExecuted.bind(migrator))
  .then(last => {
    t.equal(last, '1.0.0', 'should return correct last executed')
    t.end()
  })
  .catch(t.end)
})
