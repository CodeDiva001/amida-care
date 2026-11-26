
import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';

import AppGate from './components/AppGate.jsx';
import './App.css';
import './index.css';

// Keep AMIDA CARE installable as a PWA
registerSW({
  immediate: true,
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppGate />
  </React.StrictMode>
);
