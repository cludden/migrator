UPDATE version_history
WHERE version = '1.1.0'
  AND action = 'up'
SET action = 'down',
  start = toTimestamp(now());

DELETE TABLE test;

DELETE FROM version_history
WHERE version = '1.1.0';
