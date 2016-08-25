// create keyspace
CREATE KEYSPACE IF NOT EXISTS test
WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };

// use it
USE test;

// create version table
CREATE TABLE version_history (
  pk text,
  ts timeuuid,
  type text,
  version text,
  PRIMARY KEY ((pk), ts, type)
) WITH CLUSTERING ORDER BY (ts DESC, type DESC);

// insert version bump start
INSERT INTO version_history (pk, ts, type, version)
VALUES ('schema_version', now(), 'start', '1.0.0');

// do migration
CREATE TABLE migrations (
  id text,
  created timestamp,
  PRIMARY KEY (id, created)
);

// insert version bump end
INSERT INTO version_history (pk, ts, type, version)
VALUES ('schema_version', now(), 'end', '1.0.0');
