import { SnackbarProvider } from 'notistack';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { version } from '../package.json';
import gitlabLogo from './assets/gitlab.svg';
import App from './components/app/app';
import Bugsnag from './helper/bugsnag';
import './index.scss';
import * as serviceWorker from './serviceWorker';
const Root: React.FC = () => {
  const [updateCallback, setUpdateCallback] = useState<(() => void) | undefined>(undefined);
  useEffect(() => {
    serviceWorker.register({
      onUpdate: (worker: ServiceWorkerRegistration) => setUpdateCallback(() => {
        worker.unregister().then(() => window.location.reload());
      }),
    });
  }, []);
  return (
    <Bugsnag>
      <SnackbarProvider maxSnack={2} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <App
          name="Pixel Diary"
          repository={{
            name: 'GitLab',
            url: 'https:
            logoSrc: gitlabLogo,
          }}
          update={updateCallback}
        />
      </SnackbarProvider>
    </Bugsnag>
  );
};
ReactDOM.render(<Root />, document.getElementById('root'));
console.log(`Version ${version} (${process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV})`);
