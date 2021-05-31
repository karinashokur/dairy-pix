import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import { version } from '../package.json';
import gitlabLogo from './assets/gitlab.svg';
import App from './components/app/app';
import Bugsnag from './helper/bugsnag';
import './index.scss';
import * as serviceWorker from './serviceWorker';
ReactDOM.render(
  <Bugsnag>
    <SnackbarProvider maxSnack={2} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
      <App
        name="Pixel Diary"
        repository={{
          name: 'GitLab',
          url: 'https:
          logoSrc: gitlabLogo,
        }}
      />
    </SnackbarProvider>
  </Bugsnag>,
  document.getElementById('root'),
);
serviceWorker.register();
console.log(`Version ${version} (${process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV})`);
