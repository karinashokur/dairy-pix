import bugsnag from '@bugsnag/browser';
import bugsnagReact from '@bugsnag/plugin-react';
import React from 'react';
import { version } from '../../package.json';
export const bugsnagClient = bugsnag({
  apiKey: process.env.REACT_APP_BUGSNAG || 'disabled',
  appVersion: version,
  releaseStage: process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV,
  notifyReleaseStages: ['production', 'testing'],
  collectUserIp: false,
  autoCaptureSessions: false,
  consoleBreadcrumbsEnabled: false,
  filters: [
    /password/i,
    /token/i,
    /note/i,
    /targetText/i, 
    /from/i, 
  ],
  beforeSend: report => {
    if (!process.env.REACT_APP_BUGSNAG) report.ignore();
  },
});
bugsnagClient.use(bugsnagReact, React);
const Bugsnag = bugsnagClient.getPlugin('react');
export default Bugsnag;
