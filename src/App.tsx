import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Theme from './styles/theme';
import Routes from './routes';

const App: React.FC = () => (
  <>
    <Theme />
    <ToastContainer />
    <Router>
      <Routes />
    </Router>
  </>
);

export default App;
