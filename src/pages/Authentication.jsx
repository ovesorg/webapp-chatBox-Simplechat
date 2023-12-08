import React, { useState, useEffect } from "react";
import './Authentification.css';
import { useGoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function AuthentificationPage(props) {
    const [page, setPage] = useState('signin')
    const [user, setUser] = useState([]);
    
    const handlePageChange = () => {
        if (page === 'signin') {
            setPage('signup')
        } else if (page === 'signup') {
            setPage('signin')
        }
    }
    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });


    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        let email = res.data.email
                        let password = res.data.id
                        console.log(email,password)
                        const credentials = btoa(`${email}:${password}`);
                        localStorage.setItem('web-id', credentials)
                        toast.success("Logged in Successful. Welcome!", {
                            position: toast.POSITION.TOP_RIGHT,
                        });
                        setTimeout(() => {
                            localStorage.setItem('user', res.data.email)
                            props.onLogin(credentials)
                        }, 2000)
                    })
                    .catch((err) => console.log(err));
            }
        },
        [user]
    );


    return (
        <>
            <ToastContainer />
            <button className='minus-button' onClick={props.handleChatClose}>
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" fill="white" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" /></svg></button>
            <div className="auth-header">
                <div className="container">
                    {page === 'signin' ? <h1>Login </h1> : <h1>Sign Up</h1>}
                    <p>Welcome to Onivoltaic. Please {page === 'signin' ? "Sign In" : "Sign Up"} </p>
                </div>
            </div>
            <div className="content-container">
                <button onClick={() => login()} className={page === 'signin' ? "google-login" : "google-signup"}>
                    <svg style={{ marginRight: "12px" }} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                    {page === "signin" ? "Login" : "Sign Up"} with Google
                </button>
            </div>
            <p className="footer-text">{page === "signin" ? "Don't" : "Already"} have an account? <span onClick={handlePageChange} className="auth-text">{page === "signin" ? "Sign Up" : "Sign In"}</span></p>
        </>
    )
}