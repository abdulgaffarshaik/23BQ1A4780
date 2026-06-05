export const NOTIFICATION_TYPES = {
  PLACEMENT: 'Placement',
  RESULT: 'Result',
  EVENT: 'Event'
};

export const PRIORITY_WEIGHTS = {
  [NOTIFICATION_TYPES.PLACEMENT]: 3,
  [NOTIFICATION_TYPES.RESULT]: 2,
  [NOTIFICATION_TYPES.EVENT]: 1
};

export const LOG_LEVELS = {
  DEBUG: 'debug',
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  FATAL: 'fatal'
};

export const LOG_PACKAGES = {
  CACHE: 'cache',
  CONTROLLER: 'controller',
  CRON_JOB: 'cron_job',
  DB: 'db',
  DOMAIN: 'domain',
  HANDLER: 'handler',
  REPOSITORY: 'repository',
  ROUTE: 'route',
  SERVICE: 'service',
  MIDDLEWARE: 'middleware',
  AUTH: 'auth',
  CONFIG: 'config',
  UTILS: 'utils'
};

export const LOG_STACKS = {
  BACKEND: 'backend',
  FRONTEND: 'frontend'
};
