import bugsnag from '@bugsnag/browser';
import bugsnagReact from '@bugsnag/plugin-react';
import React from 'react';
import { version } from '../../package.json';
try {
  if (!sessionStorage.getItem('random')) {
    sessionStorage.setItem('random', Math.floor(Math.random() * 1000000).toString());
  }
} catch (e) {  }
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
    try {
      report.user = { 
        id: localStorage.getItem('tester') || sessionStorage.getItem('random') || '[UNDEFINED]',
      };
    } catch (e) {  }
  },
});
bugsnagClient.use(bugsnagReact, React);
const Bugsnag = bugsnagClient.getPlugin('react');
export default Bugsnag;
