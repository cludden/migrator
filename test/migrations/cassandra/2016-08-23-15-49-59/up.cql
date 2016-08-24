-- This file gets split on basic string split of semicolon.
-- Not a robust CQL parser. Don't confuse it.

INSERT INTO version_history (version, action, start)
VALUES ('1.1.0', 'up', toTimestamp(now()));

CREATE TABLE test (
  test_id int PRIMARY KEY,
  name text,
  value int
);

UPDATE version_history
WHERE version = '1.0.0'
  AND action = 'up'
SET end = toTimestamp(now());
