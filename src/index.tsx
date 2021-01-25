import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App';
import gitlabLogo from './assets/gitlab.svg';
import './index.scss';
ReactDOM.render(
  <SnackbarProvider maxSnack={1}>
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
