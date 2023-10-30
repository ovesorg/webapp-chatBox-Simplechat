import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
//import App from './App';
import ChatBot from './ChatBot'
import reportWebVitals from './reportWebVitals';
import AuthPage from './AuthPage';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    if (!isAuthenticated) {
      return <AuthPage onAuthenticated={setIsAuthenticated} />;
    }
     return <ChatBot />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
