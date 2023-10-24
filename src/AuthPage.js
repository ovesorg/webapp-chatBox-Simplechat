// Auth.js
import React, { useState } from 'react';
import './auth.css';

function Auth({ onAuthenticated }) {
       const [email, setEmail] = useState('');
       const [password, setPassword] = useState('');
       const [error, setError] = useState('');

       const handleLogin = () => {
              if (email === "admin@example.com" && password === "password123") {
                     onAuthenticated(true);
              } else {
                     setError("Invalid credentials!");
              }
       };

       return (
              <div className="auth-container">
                     <div className="auth-form">
                            {error && <div className="error-message">{error}</div>}
                            <input
                                   type="email"
                                   placeholder="Email"
                                   value={email}
                                   onChange={e => setEmail(e.target.value)}
                            />
                            <input
                                   type="password"
                                   placeholder="Password"
                                   value={password}
                                   onChange={e => setPassword(e.target.value)}
                            />
                            <button onClick={handleLogin}>Login</button>
                     </div>
              </div>
       );
}

export default Auth;
