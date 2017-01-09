import { Migrator } from '../../lib';
import Store from './store';

export const store = new Store();
export const migrations = ['1', '2', '3', '4', '5'];

export default new Migrator({
  execMigration(version, direction) {
    let id = direction === 'up' ? version : (version - 1).toString();
    if (id === '0') {
      id = undefined;
    }
    return store.set('version', id);
  },

  getLastExecuted() {
    return store.get('version');
  },

  getMigrations() {
    return Promise.resolve(migrations);
  },

  log(version, direction, event) {
    return store.log({ version, direction, event });
  },
});
