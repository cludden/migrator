import { expect } from 'chai';
import fs from 'fs';
import { describe, it } from 'mocha';

import { migrator } from '../migrators/cassandra';
import { getSection } from '../../lib/utils';

const ids = fs.readdirSync(`${__dirname}/../migrators/cassandra/migrations`) // eslint-disable-line

describe('Migrator', function () {
  it('#getLastExecuted should return undefined', function () {
    migrator.getLastExecuted()
    .then((executed) => {
      expect(executed).to.equal(undefined);
    });
  });

  it('#getMigrations should return a sorted list of all migrations', function () {
    return migrator.getMigrations()
    .then((migrations) => {
      expect(migrations).to.deep.equal(ids);
    });
  });

  it('#getPending should equal all migrations', function () {
    return migrator.getPending()
    .then((pending) => {
      expect(pending).to.deep.equal(ids);
    });
  });

  it('#up', function () {
    return migrator.up()
    .then((executed) => {
      expect(executed).to.deep.equal(ids);
    })
    .then(migrator.getPending.bind(migrator))
    .then((pending) => {
      expect(pending).to.deep.equal([]);
    })
    .then(migrator.getLastExecuted.bind(migrator))
    .then((last) => {
      expect(last).to.equal(ids[ids.length - 1]);
    });
  });

  it('#down', function () {
    return migrator.down()
    .then((executed) => {
      const expected = ids.slice().reverse();
      expect(executed).to.deep.equal(expected);
    })
    .then(migrator.getPending.bind(migrator))
    .then((pending) => {
      expect(pending).to.deep.equal(ids);
    })
    .then(migrator.getLastExecuted.bind(migrator))
    .then((last) => {
      expect(last).to.equal(undefined);
    });
  });

  it('#up(to)', function () {
    const to = '1.1.0';
    const expected = getSection(ids, 'up', ids[0], to);
    return migrator.up({ to })
    .then((executed) => {
      expect(executed).to.deep.equal(expected);
    })
    .then(migrator.getPending.bind(migrator))
    .then((pending) => {
      expect(pending).to.deep.equal([ids[ids.length - 1]]);
    })
    .then(migrator.getLastExecuted.bind(migrator))
    .then((last) => {
      expect(last).to.equal(expected[expected.length - 1]);
    });
  });

  it('#down(to)', function () {
    const to = '1.0.0';
    const expected = getSection(ids, 'down', '1.1.0', to);
    return migrator.down({ to })
    .then((executed) => {
      expect(executed).to.deep.equal(expected);
    })
    .then(migrator.getPending.bind(migrator))
    .then((pending) => {
      expect(pending).to.deep.equal(getSection(ids, 'up', '1.1.0'));
    })
    .then(migrator.getLastExecuted.bind(migrator))
    .then((last) => {
      expect(last).to.equal('1.0.0');
    });
  });

  it('#goto', function () {
    const first = '1.2.0';
    const second = '1.1.0';
    return migrator.goto(first)
    .then((executed) => {
      expect(executed).to.deep.equal(['1.1.0', '1.2.0']);
    })
    .then(() => migrator.goto(second))
    .then((executed) => {
      expect(executed).to.deep.equal(['1.2.0']);
    });
  });

  it('#exec', function () {
    const id = '1.2.0';
    return migrator.execute(id, 'up')
    .then((_id) => {
      expect(_id).to.equal(id);
    });
  });
});
