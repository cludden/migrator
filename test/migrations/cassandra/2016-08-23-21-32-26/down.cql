UPDATE version_history
WHERE version = '1.1.0'
  AND action = 'up'
SET action = 'down',
  start = toTimestamp(now());

UPDATE test
DROP random;

DELETE FROM version_history
WHERE version = '1.1.0';
