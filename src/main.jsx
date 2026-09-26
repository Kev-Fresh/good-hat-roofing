import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import business from '../shared/business.js';
import App from './App.jsx';
import './index.css';

// Apply the business's brand colors to the whole app.
const root = document.documentElement.style;
root.setProperty('--gh-brand', business.colors.brand);
root.setProperty('--gh-accent', business.colors.accent);
root.setProperty('--gh-accent-soft', business.colors.accentSoft);
root.setProperty('--gh-accent-bright', business.colors.accentBright);
root.setProperty('--gh-ink', business.colors.ink);
root.setProperty('--gh-paper', business.colors.paper);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
