import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { PublicClientApplication, EventType } from '@azure/msal-browser';
import { msalConfig } from './pages/authConfig';

const msalInstance = new PublicClientApplication(msalConfig);


if (!msalInstance.getActiveAccount() && msalInstance.getAllAccounts().length > 0) {
    msalInstance.setActiveAccount(msalInstance.getActiveAccount()[0]);
}

// Listen for sign-in event and set active account
msalInstance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload.account) {
        const account = event.payload.account;
        msalInstance.setActiveAccount(account);
    }
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId="339941026728-3rnnmsgcci7cndh9k3r9iaegirnnkpir.apps.googleusercontent.com">
  <React.StrictMode>
    <App instance={msalInstance} />
  </React.StrictMode>
  </GoogleOAuthProvider>
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log());
