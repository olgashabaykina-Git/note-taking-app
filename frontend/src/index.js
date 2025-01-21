// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Create a root node for the application
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rendering the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Function for processing performance metrics
const handleWebVitals = (metric) => {
 
  console.log(metric);
};

// Call reportWebVitals with a handler
reportWebVitals(handleWebVitals);
