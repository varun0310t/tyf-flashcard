// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FlashcardPage from './components/Home';
import DashboardPage from './components/dashboard';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<FlashcardPage/>} />
          <Route path="/dashboard" element={<DashboardPage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
