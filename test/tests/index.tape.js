import Bluebird from 'bluebird'
import Driver from 'cassandra-driver'
import retry from 'retry'
import test from 'tape'

function initializeCassandra () {
  return new Bluebird((resolve, reject) => {
    const client = new Driver.Client({
      contactPoints: ['cassandra']
    })

    const operation = retry.operation({
      forever: true,
      factor: 1,
      minTimeout: 3000,
      maxTimeout: 3000
    })

    operation.attempt(n => {
      client.connect(err => {
        if (operation.retry(err)) {
          console.error(`error on attempt ${n}`, err) // eslint-disable-line
          return
        }
        console.log('successfully connected to cassandra!') // eslint-disable-line
        global.cassandra = client
        resolve(client)
      })
    })
  })
}

test('#bootstrap', t => {
  Bluebird.all([
    initializeCassandra()
  ]).then(() => {
    t.end()
  }).catch(t.end)
})
