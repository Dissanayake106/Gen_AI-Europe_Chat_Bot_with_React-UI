import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';

const container = document.getElementById('root');
const root = createRoot(container);

// Remove loading animation when app mounts
const removeLoading = () => {
    const loadingElement = document.querySelector('.loading-container');
    if (loadingElement) {
        loadingElement.style.opacity = '0';
        setTimeout(() => loadingElement.remove(), 300);
    }
};

root.render(
    <React.StrictMode>
        <App onLoad={removeLoading} />
    </React.StrictMode>
);