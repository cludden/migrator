# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.1.1"></a>
## [1.1.1](https://github.com/cludden/termigrator/compare/v1.1.0...v1.1.1) (2017-01-09)


### Bug Fixes

* **goto:** fixes issue with goto failing if no migrations have been executed, closes [#9](https://github.com/cludden/termigrator/issues/9) ([1d2a78f](https://github.com/cludden/termigrator/commit/1d2a78f))



<a name="1.1.0"></a>
# [1.1.0](https://github.com/cludden/termigrator/compare/v1.0.0...v1.1.0) (2017-01-07)


### Bug Fixes

* **docs:** updates README.md and package.json keywords ([31528b1](https://github.com/cludden/termigrator/commit/31528b1))


### Features

* **standard-version:** implements standard-version ([9b0b78a](https://github.com/cludden/termigrator/commit/9b0b78a))





## [v1.0.0] - 2016-01-05

### BREAKING CHANGES
- extracted cli functionality out into separate project
- switches eslint config from `standard` to `airbnb-base`
- switches test framework from `tape` & `testdouble` to `mocha` & `chai`

### Added
- added `goto` method to move from current state to new state in either direction

### Removed
- removed unnecessary dependencies



## [v0.4.1] - 2016-01-04

### Fixed
- Fixes build issues with cli



## [v0.4.0] - 2016-09-07

### Added
- adds `exec` cli command
- adds `silent` option for `migrator.execute`



## [v0.3.0] - 2016-08-26

### Added
- #3 adds cli component

### Fixed
- #3 prevents cli prompts for up/down migrations if there are no pending/downward migrations



## [v0.3.0-0] - 2016-08-26

### Added
- adds cli component



## [v0.2.1] - 2016-08-24

### Added
- #2 updates `README.md`



## [v0.2.0] - 2016-08-24

### Changed
- #1 refactors `#getMigrations` into hook



[Unreleased]: https://github.com/cludden/termigrator/compare/v0.4.0...HEAD
[v1.0.0]: https://github.com/cludden/termigrator/compare/v0.4.1...v1.0.0
[v0.4.1]: https://github.com/cludden/termigrator/compare/v0.4.0...v0.4.1
[v0.4.0]: https://github.com/cludden/termigrator/compare/v0.3.0...v0.4.0
[v0.3.0]: https://github.com/GaiamTV/gaia-core-api/compare/v0.2.1...v0.3.0
[v0.3.0-0]: https://github.com/GaiamTV/gaia-core-api/compare/v0.2.1...v0.3.0-0
[v0.2.1]: https://github.com/GaiamTV/gaia-core-api/compare/v0.2.0...v0.2.1
[v0.2.0]: https://github.com/GaiamTV/gaia-core-api/compare/v0.1.0...v0.2.0
