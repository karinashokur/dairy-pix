import React from 'react';
import ReactDOM from 'react-dom';
import App from './App/App';
import gitlabLogo from './assets/gitlab.svg';
import './index.scss';
ReactDOM.render(
  <App
    name="Pixel Diary"
    repository={{
      name: 'GitLab',
      url: 'https:
      logoSrc: gitlabLogo,
    }}
  />,
  document.getElementById('root'),
);
