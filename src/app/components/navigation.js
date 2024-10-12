import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Login from '../pages/login';
import Home from '../pages/Home';
import SignUp from '../pages/SignUp';

export default function NavigationRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/SignUp" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

