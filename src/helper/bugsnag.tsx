import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';
import React from 'react';
const bugsnagClient = bugsnag({
  apiKey: process.env.REACT_APP_BUGSNAG || 'disabled',
  autoNotify: !!process.env.REACT_APP_BUGSNAG, 
  appVersion: process.env.REACT_APP_VERSION,
  releaseStage: process.env.NODE_ENV,
  notifyReleaseStages: ['production', 'testing'],
  collectUserIp: false,
  autoCaptureSessions: false,
  consoleBreadcrumbsEnabled: false,
  filters: ['password', 'token', 'note'],
});
bugsnagClient.use(bugsnagReact, React);
const Bugsnag = bugsnagClient.getPlugin('react');
export default Bugsnag;
