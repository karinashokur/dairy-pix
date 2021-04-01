import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import gitlabLogo from './assets/gitlab.svg';
import App from './components/app/app';
import './index.scss';
ReactDOM.render(
  <SnackbarProvider maxSnack={2} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
    <Router>
      <App
        name="Pixel Diary"
        repository={{
          name: 'GitLab',
          url: 'https:
          logoSrc: gitlabLogo,
        }}
      />
    </Router>
  </SnackbarProvider>,
  document.getElementById('root'),
);
