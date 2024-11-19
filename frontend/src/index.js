import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Import global styles
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min'; // Bootstrap JS
import { AuthContextProvider } from './context/AuthContext'; // Authentication context
import 'leaflet/dist/leaflet.css';
import { SocketContextProvider } from './context/SocketContext';

// Create a root for the React application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <SocketContextProvider>
      <App />
      </SocketContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
