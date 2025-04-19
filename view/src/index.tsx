import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App';
import AppTest from './app/AppTest';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Admin from './admin/Admin';
import ManageNote from './admin/forms/ManageNotes';
import ManageSnippets from './admin/forms/ManageSnippets';
import ManageQuickLookup from './admin/forms/ManageQuickLookUps';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<App />} />
          <Route index path="/admin" element={<Admin />} />
          <Route path="/admin/notes/new" element={<ManageNote />} />
          <Route path="/admin/notes/:id" element={<ManageNote />} />
          <Route path="/admin/snippets/new" element={<ManageSnippets />} />
          <Route path="/admin/snippets/:id" element={<ManageSnippets />} />
          <Route path="/admin/lookups/new" element={<ManageQuickLookup />} />
          <Route path="/admin/lookups/:id" element={<ManageSnippets />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  </React.StrictMode>
);
