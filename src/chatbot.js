import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.js';
import './chatbot.css';
//import logo from '.';
function ChatBot() {
    const topic = useState('OvesSmart chat')[0]; // You can default it to any topic you like
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [ws, setWs] = useState(null);
    const messagesEndRef = useRef(null);
    // const scrollToBottom = () => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // };
    useEffect(() => {
        const websocket = new WebSocket('wss://dev-chatbot.omnivoltaic.com/ws');
        setWs(websocket);
        websocket.onopen = () => {
            console.log("Connected to the WebSocket server");
        };
        websocket.onmessage = (event) => {
            const botMessage = event.data;
            setMessages((prevMessages) => [
                ...prevMessages,
                { type: 'bot', text: botMessage }
            ]);
            setIsTyping(true);
        };
        websocket.onerror = (event) => {
            console.error("WebSocket Error:", event);
        };
        websocket.onclose = () => {
            console.log("WebSocket connection closed");
        };
        return () => {
            websocket.close();
        };
    }, []);
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };
    const handleSubmit = () => {
        if (input.trim() === '') return;
        setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'user', text: input.trim() }
        ]);
        // console.log(ws);
        // console.log(input)
        if (ws) {
            ws.send(input.trim()); // Send user's input to the backend
            setIsTyping(true);
            setInput('');  // Clear input field
            setTimeout(() => {
                setIsTyping(false);
            }, 1000);
        }
    };
    return (
        <div className="chatbot-container">
            <div className="chatbot-header"> {/* Add this block for the header */}
                Topic: {topic}
            </div>
            <div className="messages-container">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.type}`}>
                        {message.text}
                    </div>
                ))}
                {isTyping && (
                    <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    // When sending a message or waiting for a response
                    //document.querySelector('.typing-indicator').classList.add('active');
                    // Once the response is received and displayed
                    //document.querySelector('.typing-indicator').classList.remove('active');
                )}
            </div>
            <div className="input-container">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..." />
                <button onClick={handleSubmit}>Submit</button>
            </div>
            <div ref={messagesEndRef} />
            {/* <div className="input-container">
                 <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask me anything..." />
                 <button onClick={handleSubmit}>Submit</button>
             </div> */}
        </div>
    );
}
export default ChatBot;
