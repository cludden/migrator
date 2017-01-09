/**
 * Fake ORM to use for migrations
 */
export default function Store() {
  const store = {
    logs: [],
  };

  /**
   * Get the value at the specified key
   * @param  {Strig} key
   * @return {Promise} promise
   */
  this.get = key => new Promise((resolve) => {
    setImmediate(() => {
      resolve(store[key]);
    });
  });

  /**
   * Add entry to logs
   * @param  {Object} args
   * @param  {String} args.version
   * @param  {String} args.direction
   * @param  {String} args.event
   * @return {Promise} promise
   */
  this.log = ({ version, direction, event }) => new Promise((resolve) => {
    setImmediate(() => {
      store.logs.push({ version, direction, event });
      resolve();
    });
  });

  /**
   * Set the value at the specified key
   * @param  {String} key
   * @param  {*} val
   * @return {Promise} promise
   */
  this.set = (key, val) => new Promise((resolve) => {
    setImmediate(() => {
      store[key] = val;
      resolve();
    });
  });
}
