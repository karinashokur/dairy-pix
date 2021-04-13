import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import gitlabLogo from './assets/gitlab.svg';
import App from './components/app/app';
import './index.scss';
import * as serviceWorker from './serviceWorker';
ReactDOM.render(
  <SnackbarProvider maxSnack={2} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
    <App
      name="Pixel Diary"
      repository={{
        name: 'GitLab',
        url: 'https:
        logoSrc: gitlabLogo,
      }}
    />
  </SnackbarProvider>,
  document.getElementById('root'),
);
serviceWorker.register();
console.log('Version', process.env.REACT_APP_VERSION);
