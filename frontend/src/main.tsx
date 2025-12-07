import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './mobile.css';
import './admin-mobile.css';
import { initMobileFix } from './mobile-fix';

// Initialize mobile fix
initMobileFix();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
