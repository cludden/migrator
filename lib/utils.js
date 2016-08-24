import _ from 'lodash'

export function getSection (migrations, action, from, to) {
  migrations = action === 'down' ? _.reverse(migrations) : migrations
  const start = _.findIndex(migrations, from)
  const end = _.findIndex(migrations, to)
  return migrations.slice(start, end)
}
