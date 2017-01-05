import Bluebird from 'bluebird';
import Driver from 'cassandra-driver';
import { before } from 'mocha';
import retry from 'retry';

/**
 * Initialize a cassandra driver to use for testing. Wait until it has
 * successfully connected to the container
 * @return {Bluebird} bluebird
 */
function initializeCassandra() {
  return new Bluebird((resolve) => {
    const client = new Driver.Client({
      contactPoints: ['cassandra'],
    });

    const operation = retry.operation({
      forever: true,
      factor: 1,
      minTimeout: 3000,
      maxTimeout: 3000,
    });

    operation.attempt((n) => {
      client.connect((err) => {
        if (operation.retry(err)) {
          console.log(`waiting for cassandra container to stabilize (${n})...`) // eslint-disable-line
          return;
        }
        console.log('successfully connected to cassandra!') // eslint-disable-line
        Bluebird.promisifyAll(client);
        global.cassandra = client;
        resolve(client);
      });
    });
  });
}

before('#bootstrap', function () {
  return Bluebird.all([
    initializeCassandra(),
  ]);
});
