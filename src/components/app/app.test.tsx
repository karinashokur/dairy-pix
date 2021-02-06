import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import gitlabLogo from '../../assets/gitlab.svg';
import App from './app';
it('renders without crashing', () => {
  const div = document.createElement('div');
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
    div,
  );
  ReactDOM.unmountComponentAtNode(div);
});
