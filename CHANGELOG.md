

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
