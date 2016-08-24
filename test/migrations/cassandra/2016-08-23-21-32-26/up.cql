INSERT INTO version_history (version, action, start)
VALUES ('1.2.0', 'up', toTimestamp(now()));

ALTER TABLE test
ADD random int;

UPDATE version_history
WHERE version = '1.2.0'
  AND action = 'up'
SET end = toTimestamp(now());
