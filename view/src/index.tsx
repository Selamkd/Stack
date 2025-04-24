import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app/App';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Admin from './admin/Admin';
import ManageNote from './admin/forms/ManageNotes';
import ManageSnippets from './admin/forms/ManageSnippets';
import ManageQuickLookup from './admin/forms/ManageQuickLookUps';
import ManageCategories from './admin/forms/ManageCategories';
import ManageTags from './admin/forms/ManageTags';
import AppTest from './app/AppTest';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<App />} />

          <Route path="/admin" element={<Admin />}>
            <Route index element={<Admin />} />
            <Route path="notes/new" element={<ManageNote />} />
            <Route path="notes/:id" element={<ManageNote />} />
            <Route path="snippets/new" element={<ManageSnippets />} />
            <Route path="snippets/:id" element={<ManageSnippets />} />
            <Route path="lookups/new" element={<ManageQuickLookup />} />
            <Route path="lookups/:id" element={<ManageQuickLookup />} />
            <Route path="categories/new" element={<ManageCategories />} />
            <Route path="categories/:id" element={<ManageCategories />} />
            <Route path="tags/new" element={<ManageTags />} />
            <Route path="tags/:id" element={<ManageTags />} />
          </Route>
        </Routes>
      </AppLayout>
    </BrowserRouter>
  </React.StrictMode>
);
