/**
* Get a section of migrations in either direction
* @param  {String[]} migrations - sorted list of migration ids
* @param  {String} method - migration direction ['up', 'down']
* @param  {String} from - start id
* @param  {String} [to] - end id
* @return  {String[]} ids
*/
export function getSection(migrations, method, from, to) {
  const copy = method === 'down' ? migrations.slice().reverse() : migrations.slice();
  const start = copy.findIndex(m => m === from);
  let end = to ? copy.findIndex(m => m === to) : copy.length;
  if (method === 'down' && to) {
    end -= 1;
  }
  if (start < 0 || end < 0) {
    throw new Error(`Unable to find valid migration list for start (${from}) and end (${to})`);
  }
  return copy.slice(start, end + 1);
}
