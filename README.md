# migrator
database agnostic migration client. *work in progress*



## installing
```bash
npm install --save migrator
```


## Getting Started
1. define a directory to hold your migrations
```
/root
  /migrations
    /0.0.0
      - up.js
      - down.js
    /0.1.0
      - up.js
      - down.js
```
2. instantiate new client
```javascript
import Migrator from 'migrator'

const migrator = new Migrator({
  // define a migration handler that is responsible for executing the appropriate
  // migration for the given id & method combination. this method should return a
  // promise
  exec(id, method) {
    // .. return a promise
  },

  // define a method for determining the last executed migration
  // this should return a promise that resolves to the last executed migration
  // id or undefined if no migrations have been executed
  last() {
    // .. return a promise
  },

  // define a method for logging migration events. this method should return a
  // promise
  log(id, method, event) {
    // .. return a promise
  },

  // define the path to the migration directory
  path: `${__dirname}/migrations`,

  // define a method for sorting the migration ids in the correct order
  sort(migrations) {
    return semverSort.asc(migrations)
  }
})
```
3. perform forwards or backwards migrations
```javascript
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
| options.exec* | Function | A method in the form of `exec(id, method) => promise` that is responsible for executing the appropriate migration |
| options.last* | Function | A method in the form of `last() => promise` that is responsible for determining the id of the last executed migration. |
| options.log* | Function | A method in the form of `log(id, method, event) => promise` that is responsible for logging migration activity. *id* is the migration id of the currently executing migration, *method* is the direction of the migration (up or down), and *event* is the migration event name (start or end) |
| options.path* | String | The absolute path to the migration directory |
| options.sort* | Function | A method in the form of `sort(migrations) => sorted` that is responsible for sorting the migration ids |


### migrator.down(options)
run downwards migrations

##### Arguments
| name | type | description |
| --- | --- | --- |
| options | Object | options |
| options.to | String | The (exclusive) id of the migration to roll back to. |

##### Returns
- promise - resolves to an array of migration ids that were executed

##### Example
```javascript
migrator.down()

migrator.down({ to: '0.9.0' })
```


### migrator.execute(id, method)
execute a single migration in the specified direction. *note: this method is used by the #up and #down to execute migrations*

##### Arguments
| name | type | description |
| --- | --- | --- |
| id* | String | the id of the migration to execute |
| method* | String | *up* or *down* |

##### Returns
- promise - resolves to the id of the executed task

##### Example
```javascript
migrator.execute('1.0.0', 'up')
```


### migrator.getLastExecuted()
wrapper method around the user defined #last method

##### Returns
- promise - resolves to the id of the last executed migration

##### Example
```javascript
migrator.getLastExecuted().then(id => console.log(id))
```


### migrator.getMigrations()
get a sorted list of all defined migrations

##### Returns
- promise - resolves to an array of migration ids

##### Example
```javascript
migrator.getMigrations().then(migrations => console.log(migrations))
```


### migrator.getPending()
get a list of pending migrations

##### Returns
- promise - resolves to an array of migration ids that are ahead of the last executed migration

##### Example
```javascript
migrator.getPending().then(pending => console.log(pending))
```


### migrator.up(options)
run pending migrations

##### Arguments
| name | type | description |
| --- | --- | --- |
| options | Object | options |
| options.to | String | The (exclusive) id of the migration to roll back to. |

##### Returns
- promise - resolves to an array of migration ids that were executed

##### Example
```javascript
migrator.up()

migrator.up({ to: '1.0.0' })
```
