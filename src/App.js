import React from 'react';
import './chatbot.css';
import ChatBot from './chatbot';
import { MsalProvider } from '@azure/msal-react';
export default function App({instance}) {
    return (
        <MsalProvider instance={instance}>
        <ChatBot/>
        </MsalProvider>
    )
}