import React from 'react';
import ReactDOM from 'react-dom';
import Diary from './Diary';
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Diary />, div);
  ReactDOM.unmountComponentAtNode(div);
});
