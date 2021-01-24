import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import gitlabLogo from '../assets/gitlab.svg';
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <App
      name="Test App"
      repository={{
        name: 'GitLab',
        url: 'https:
        logoSrc: gitlabLogo,
      }}
    />,
    div,
  );
  ReactDOM.unmountComponentAtNode(div);
});
