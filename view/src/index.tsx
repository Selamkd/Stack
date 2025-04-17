import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Admin from './admin/Admin';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  </React.StrictMode>
);
