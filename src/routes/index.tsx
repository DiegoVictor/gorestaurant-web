import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';

export default () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
  </Routes>
);
