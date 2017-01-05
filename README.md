# termigrator
low level, database agnostic migration client. this library makes no assumption of what a migration looks like, how it stored, etc. why the name *termigrator*? partly because all migration related names have been taken on npm, but mostly because why not?



## Installing
```bash
npm install --save termigrator
```



## Getting Started
- define one or more migrations in a way that makes sense for your database.
- instantiate new client

```javascript
import { Migrator } from 'termigrator'

const migrator = new Migrator({
  // define a migration handler that is responsible for executing the appropriate
  // migration for the given id & method combination. this method should return a
  // promise
  execMigration(id, method) {
    // .. return a promise
  },

  // define a method for determining the last executed migration
  // this should return a promise that resolves to the last executed migration
  // id or undefined if no migrations have been executed
  getLastExecuted() {
    // .. return a promise
  },

  // define a method for retrieving the sorted list of all available migration
  // ids. this method should return a promise
  getMigrations() {
    // .. return a promise
  },

  // define a method for logging migration events. this method should return a
  // promise
  log(id, method, event) {
    // .. return a promise
  },
})

// execute all pending migrations
migrator.up().then(executed => console.log(executed))

// execute all pending migrations up to a certain point
migrator.up({ to: '1.0.0' })

// rollback to a prior point
migrator.down({ to: '0.9.0' })
```



## API
### Migrator(options)
constructor function

##### Arguments
| name | type | description |
| --- | --- | --- |
| options* | Object | options |
| options.execMigration* | Function | A method in the form of `exec(id, method) => promise` that is responsible for executing the appropriate migration |
| options.getLastExecuted* | Function | A method in the form of `last() => promise` that is responsible for determining the id of the last executed migration. |
| options.getMigrations* | Function | A method in the form of `getMigrations() => promise` that is responsible for providing the sorted list of migration ids. |
| options.log* | Function | A method in the form of `log(id, method, event) => promise` that is responsible for logging migration activity. *id* is the migration id of the currently executing migration, *method* is the direction of the migration (up or down), and *event* is the migration event name (start or end) |
| options.path* | String | The absolute path to the migration directory |


### #down(options)
run downwards migrations

##### Arguments
| name | type | description |
| --- | --- | --- |
| options | *Object* | options |
| options.to | *String* | The (exclusive) id of the migration to roll back to. |

##### Returns
- promise - resolves to an array of migration ids that were executed

##### Example
```javascript
migrator.down()

migrator.down({ to: '0.9.0' })
```


### #execute(id, method)
execute a single migration in the specified direction. *note: this method is used by the #up and #down to execute migrations*

##### Arguments
| name | type | description |
| --- | --- | --- |
| id | String | the id of the migration to execute |
| method | String | *up* or *down* |

##### Returns
- promise - resolves to the id of the executed task

##### Example
```javascript
migrator.execute('1.0.0', 'up')
```


### #getGotoVersions(version)
Get a list of migrations to be executed with direction to migrate to the specified version

##### Returns
- promise - resolves to an array of migration ids that are ahead of the last executed migration

##### Example
```javascript
migrator.goto('1.0.0')
```


### #getLastExecuted()
wrapper method around the user defined #last method

##### Returns
- promise - resolves to the id of the last executed migration

##### Example
```javascript
migrator.getLastExecuted().then(id => console.log(id))
```


### #getMigrations()
get a sorted list of all defined migrations

##### Returns
- promise - resolves to an array of migration ids

##### Example
```javascript
migrator.getMigrations().then(migrations => console.log(migrations))
```


### #getPending()
get a list of pending migrations

##### Returns
- promise - resolves to an array of migration ids that are ahead of the last executed migration

##### Example
```javascript
migrator.getPending().then(pending => console.log(pending))
```


### #goto(version)
migrate to a specific version

##### Arguments
| name | type | description |
| --- | --- | --- |
| version | *String* | the target version |

##### Returns
- promise - resolves to an array in the form of `[direction, pending]` where direction is either `up` or 'down' and pending is an array of migration ids

##### Example
```javascript
migrator.goto('1.0.0')
```


### #up([options])
run pending migrations

##### Arguments
| name | type | description |
| --- | --- | --- |
| [options] | *Object* | options |
| [options.to] | *String* | The (exclusive) id of the migration to roll back to. |

##### Returns
- promise - resolves to an array of migration ids that were executed

##### Example
```javascript
migrator.up()

migrator.up({ to: '1.0.0' })
```



## Testing
run all tests **(requries Docker & Compose)**
```bash
docker-compose run migrator
```



## Contributing
1. [Fork it](https://github.com/cludden/termigrator/fork)
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request



## License
Copyright (c) 2016 Chris Ludden.
Licensed under the [MIT license](LICENSE.md).
