// import React, { useState } from 'react';

// function AuthPage({ onLogin }) {
//     const [username, setUsername] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [errorMsg, setErrorMsg] = useState('');

//     const handleLogin = () => {
//         // You can add real authentication logic here, for now, I'll assume if all fields are filled, login is successful
//         if (username && email && password) {
//             onLogin();
//         } else {
//             setErrorMsg("Please fill in all fields.");
//         }
//     };

//     return (
//         <div className="auth-container">
//             <h2>Login</h2>
//             {errorMsg && <p className="error">{errorMsg}</p>}
//             <div>
//                 <input
//                     type="text"
//                     placeholder="Username"
//                     value={username}
//                     onChange={e => setUsername(e.target.value)}
//                 />
//             </div>
//             <div>
//                 <input
//                     type="email"
//                     placeholder="Email"
//                     value={email}
//                     onChange={e => setEmail(e.target.value)}
//                 />
//             </div>
//             <div>
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={e => setPassword(e.target.value)}
//                 />
//             </div>
//             <button onClick={handleLogin}>Login</button>
//         </div>
//     );
// }

// export default AuthPage;

       // NEW CODE

