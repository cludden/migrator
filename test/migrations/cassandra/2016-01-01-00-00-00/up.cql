// create keyspace
CREATE KEYSPACE IF NOT EXISTS test
WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };

// use it
USE test;

// create version table
CREATE TABLE version_history (
  version text,
  action text,
  start timestamp,
  end timestamp,
  PRIMARY KEY (version, action)
);

// insert version bump start
INSERT INTO version_history (version, action, start)
VALUES ('1.0.0', 'up', toTimestamp(now()));

// do migration
CREATE TABLE migrations (
  id text,
  created timestamp,
  PRIMARY KEY (id, created)
);

// insert version bump end
UPDATE version_history
WHERE version = '1.0.0'
  AND action = 'up'
SET end = toTimestamp(now());
