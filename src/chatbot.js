import React, { useState, useEffect, useRef } from 'react';
import './ChatBot.js';
import './chatbot.css';
//import botIcon from './imagess/chatbot icon.jpg';

//import logo from '.';
function ChatBot() {
    const topic = useState('OvesSmart chat')[0]; // You can default it to any topic you like
    //const [chatBotActive, setChatBotActive] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [ws, setWs] = useState(null);
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
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

    useEffect(() => {
        // Check if the last message is from the user, if so, scroll to bottom
        if (messages.length > 0 && messages[messages.length - 1].type === 'user') {
            scrollToBottom();
        }
    }, [messages]); // Only re-run the effect if new messages are added to the list


    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };
    const handleSubmit = () => {
        if (input.trim() === '') return;
        const newMessage = { type: 'user', text: input.trim() };
        setMessages((prevMessages) => [
            ...prevMessages,
            newMessage
        ]);
        if (ws) {
            ws.send(input.trim()); // Send user's input to the backend
            setIsTyping(true);
            setInput('');  // Clear input field
            // Call scrollToBottom after a slight delay to ensure the message has been rendered
            setTimeout(() => {
                setIsTyping(false);
                scrollToBottom();
            }, 100);
        }
    };

    return (
        // <>
        //     {chatBotActive ? (
        //         <ChatBot />
        //     ) : (
        //             <img
        //                 src={botIcon}
        //                 alt="Open Chatbot"
        //                 onClick={() => setChatBotActive(true)}
        //                 style={{ cursor: 'pointer', position: 'fixed', bottom: '20px', right: '20px' }}
        //             />
        //         )}
        <div className="chatbot-container">
            <div className="chatbot-header">
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
                )}
                {/* {messages.map((message, index) => (
                    <div key={message.id || `msg-${index}`} className={`message ${message.type}`}>
                        {message.text}
                    </div>
                ))} */}

                <div ref={messagesEndRef} /> {/* This is the element used to scroll to */}
            </div>
            <div className="input-container">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask me anything..." />
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>

            /* <div className="input-container">
                 <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask me anything..." />
                 <button onClick={handleSubmit}>Submit</button>
             </div> */

        // </>

    );
}
export default ChatBot;
