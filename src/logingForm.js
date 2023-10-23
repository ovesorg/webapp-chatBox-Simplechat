import React, { useState } from 'react';

function LoginForm() {
    const [usernameEmail, setUsernameEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();

        // Here, you would typically make an API request to authenticate the user
        // and obtain an access token or session.

        // For simplicity, we'll just log the input values.
        console.log('Username/Email:', usernameEmail);
        console.log('Password:', password);
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="Username or Email"
                value={usernameEmail}
                onChange={(e) => setUsernameEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">Log In</button>
        </form>
    );
}

export { LoginForm };
