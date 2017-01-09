import { expect } from 'chai';
import { describe, it } from 'mocha';

import migrator, { migrations as ids, store } from '../migrator';
import { getSection } from '../../lib/utils';

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
    const to = '2';
    const expected = getSection(ids, 'up', ids[0], to);
    return migrator.up({ to })
    .then((executed) => {
      expect(executed).to.deep.equal(expected);
    })
    .then(migrator.getPending.bind(migrator))
    .then((pending) => {
      expect(pending).to.deep.equal(['3', '4', '5']);
    })
    .then(migrator.getLastExecuted.bind(migrator))
    .then((last) => {
      expect(last).to.equal(to);
    });
  });

  it('#down(to)', function () {
    const to = '1';
    const expected = getSection(ids, 'down', '2', to);
    return migrator.down({ to })
    .then((executed) => {
      expect(executed).to.deep.equal(expected);
    })
    .then(migrator.getPending.bind(migrator))
    .then((pending) => {
      expect(pending).to.deep.equal(getSection(ids, 'up', '2'));
    })
    .then(migrator.getLastExecuted.bind(migrator))
    .then((last) => {
      expect(last).to.equal('1');
    });
  });

  it('#goto', function () {
    const first = '2';
    const second = '5';
    const third = '1';
    return migrator.goto(first)
    .then((executed) => {
      expect(executed).to.deep.equal(['2']);
      return store.get('version');
    })
    .then((version) => {
      expect(version).to.equal(first);
    })
    .then(() => migrator.goto(second))
    .then((executed) => {
      expect(executed).to.deep.equal(['3', '4', '5']);
      return store.get('version');
    })
    .then((version) => {
      expect(version).to.equal(second);
    })
    .then(() => migrator.goto(third))
    .then((executed) => {
      expect(executed).to.deep.equal(['5', '4', '3', '2']);
      return store.get('version');
    })
    .then((version) => {
      expect(version).to.equal(third);
    });
  });

  it('#exec', function () {
    const id = '2';
    return migrator.execute(id, 'up')
    .then((_id) => {
      expect(_id).to.equal(id);
      return store.get('version');
    })
    .then((version) => {
      expect(version).to.equal(id);
    });
  });

  it('#goto from beginning', function () {
    return migrator.down()
    .then(() => store.get('version'))
    .then((version) => {
      expect(version).to.equal(undefined);
    })
    .then(() => migrator.goto('5'))
    .then((executed) => {
      expect(executed).to.deep.equal(['1', '2', '3', '4', '5']);
    });
  });
});
