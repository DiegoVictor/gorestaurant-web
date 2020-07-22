import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Theme from './styles/theme';
import Routes from './routes';

const App: React.FC = () => (
  <>
    <Theme />
    <Router>
      <Routes />
    </Router>
  </>
);

export default App;
