import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';

export default (): JSX.Element => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
  </Routes>
);
