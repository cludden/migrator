import Bluebird from 'bluebird';
import EventEmitter from 'events';

import { getSection } from './utils';

function migrationExists(migration) {
  return typeof migration === 'number' && migration >= 0;
}

export default class Migrator extends EventEmitter {
  constructor(options) {
    super();
    if (typeof options.execMigration !== 'function') {
      throw new Error('options.execMigration must be a function');
    }
    if (typeof options.getLastExecuted !== 'function') {
      throw new Error('options.getLastExecuted must be a function');
    }
    if (typeof options.getMigrations !== 'function') {
      throw new Error('options.getMigrations must be a function');
    }
    if (typeof options.log !== 'function') {
      throw new Error('options.log must be a function');
    }
    this.options = options;
    this.migrations = null;
  }


  /**
   * Execute the down migration for all executed migrations
   * @param  {Object} [options={}] - options
   * @param  {String} options.to - ending migration id
   * @return  {Promise} promise
   */
  down(options = {}) {
    return Bluebird.all([
      this.getLastExecuted(),
      this.getMigrations(),
    ]).spread((last, migrations) => {
      if (!options.to) {
        return getSection(migrations, 'down', last);
      }
      return getSection(migrations, 'down', last, options.to);
    })
    .then(pending => Bluebird.each(pending, id => this.execute(id, 'down')));
  }


  /**
   * Execute a single migration in one direction
   * @param  {String} id - migration id
   * @param  {String} method - migration direction ['up', 'down']
   * @param  {Object} [options] - execute options
   * @param  {Boolean} [options.log=true] - whether or not to log start/end for this migration
   * @return  {Promise} promise
   */
  execute(id, method, options = {}) {
    const exec = this.options.execMigration.bind(this, id, method);
    const log = {
      start: Bluebird.resolve,
      end: Bluebird.resolve,
    };

    if (options.log !== false) {
      log.start = this.options.log.bind(this, id, method, 'start');
      log.end = this.options.log.bind(this, id, method, 'end');
    }

    return log.start()
    .then(exec)
    .then(log.end)
    .then(() => id);
  }


  /**
   * Return the id of the last executed migration
   * @return  {Promise} promise
   */
  getLastExecuted() {
    return this.options.getLastExecuted.call(this);
  }


  /**
   * Retreive the sorted list of migrations
   * @return  {Promise} promise
   * @this migrator
   */
  getMigrations() {
    return this.options.getMigrations.call(this);
  }


  /**
   * Get a sorted list of migrations to be executed between the current
   * version and the specified version in either direction
   * @param  {String} version - the target version
   * @return  {Bluebird} bluebird
   */
  getGotoVersions(version) {
    return Bluebird.all([
      this.getMigrations(),
      this.getLastExecuted(),
    ]).spread((migrations, current) => {
      const indexes = {};
      migrations.forEach((v, i) => {
        if (v === current) {
          indexes.from = i;
        }
        if (v === version) {
          indexes.to = i;
        }
      });
      const hasCurrent = current === undefined || migrationExists(indexes.from);
      const hasTarget = migrationExists(indexes.to);
      if (!hasCurrent || !hasTarget) {
        throw new Error('Unable to find current or target migration');
      }
      const { from, to } = indexes;
      const direction = from === undefined || from <= to ? 'up' : 'down';
      const fromMigration = migrations[from === undefined ? 0 : from + (direction === 'up' ? 1 : 0)];
      return [direction, getSection(migrations, direction, fromMigration, version)];
    });
  }


  /**
   * Get a list of pending migrations to be executed
   * @return  {Promise} promise
   */
  getPending() {
    return Bluebird.all([
      this.getMigrations(),
      this.getLastExecuted(),
    ]).spread((migrations, last) => {
      const lastIndex = migrations.findIndex(m => m === last);
      if (lastIndex === -1) {
        return getSection(migrations, 'up', migrations[0]);
      }
      if (lastIndex === migrations.length - 1) {
        return [];
      }
      return getSection(migrations, 'up', migrations[lastIndex + 1]);
    });
  }


  /**
   * Go to a specific version.
   * @param  {String} version - migration version
   * @return  {Bluebird} bluebird
   */
  goto(version) {
    return this.getGotoVersions(version)
    .spread((direction, pending) => Bluebird.each(pending, id => this.execute(id, direction))
      .return(pending));
  }

  /**
   * Execute all pending migrations in the up direction
   * @param  {Object} [options={}] - options
   * @param  {String} options.to - ending task migration id
   * @return  {Promise} promise
   */
  up(options = {}) {
    return Bluebird.resolve()
    .then(this.getPending.bind(this))
    .then((pending) => {
      if (!options.to) {
        return pending;
      }
      return getSection(pending, 'up', pending[0], options.to);
    })
    .then((pending) => {
      this.emit('up:start', pending);
      return Bluebird.each(pending, id => this.execute(id, 'up'))
      .then(() => this.emit('up:end', pending))
      .return(pending);
    });
  }
}
