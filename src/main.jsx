import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; 
import './App.css'; 
import HomePage from './pages/HomePage'; 
import HouseDetailPage from './pages/HouseDetailPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}
createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/house/:id" element={<HouseDetailPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
