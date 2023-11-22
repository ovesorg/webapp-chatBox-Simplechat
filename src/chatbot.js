import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './chatbot.css';
import 'react-chat-elements/dist/main.css'
import { MessageBox } from 'react-chat-elements';
import AuthentificationPage from './pages/Authentication';



function ChatBot() {
    const topic = useState('OvesSmart chat')[0];
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [ws, setWs] = useState(null); // Moved useRef to top level
    const messagesEndRef = useRef(null);
    const [informativeTextOpen, setInformativeTextOpen] = useState(true)
    const [isChatModalOpen, setChatModalOpen] = useState(false)
    const [isSignedIn, setIsSignedIn] = useState(false)
    // const [chatListData, setChatListData] = useState([]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleChatOpen = () => {
        setChatModalOpen(true)
        setInformativeTextOpen(false)
    }

    const handleChatClose = () => {
        setChatModalOpen(false)
    }

    useEffect(() => {
        const websocket = new WebSocket('wss://dev-chatbot.omnivoltaic.com/ws');
        setWs(websocket);
        websocket.onopen = () => console.log("Connected to the WebSocket server");
        websocket.onmessage = (event) => {
            const botMessage = event.data;
            setMessages((prevMessages) => [...prevMessages, { type: 'bot', text: botMessage }]);
            setIsTyping(true);
        };
        websocket.onerror = (event) => console.error("WebSocket Error:", event);
        websocket.onclose = () => console.log("WebSocket connection closed");
        return () => websocket.close();
    }, []);

    useEffect(() => {
        let infotextmodal = localStorage.getItem('info-text-modal')
        let user = localStorage.getItem('user')
        if (infotextmodal === 'true') {
            setInformativeTextOpen(false)
        }
        if (user) {
            setIsSignedIn(true)
        }
    }, [])

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSubmit();
    };

    const handleSubmit = () => {

        if (input.trim() === '') return;
        const newMessage = { type: 'user', text: input.trim() };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        if (ws) {
            ws.send(input.trim());
            setIsTyping(true);
            setInput('');
        }
    };

    const handleCloseInformativetext = () => {
        localStorage.setItem('info-text-modal', true)
        setInformativeTextOpen(false)
    }
    const styles = {
        marginTop: "5px"

    }
    return (
        <>
            {isChatModalOpen ? (
                <div className="chatbot-container">
                    <div className="chatbot-header">Topic: {topic}
                        <button className='minus-button' onClick={handleChatClose} >
                            <svg xmlns="http://www.w3.org/2000/svg" fill='white' height="1em" viewBox="0 0 448 512"><path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" /></svg></button>
                    </div>
                    <div className="messages-container">
                        {messages.map((message, index) => (
                            <div key={index} className={`message-row ${message.type}`}>
                                <div className={`message ${message.type}`}>
                                    {/* {message.text} */}
                                    {message.type === "bot" ?
                                        <MessageBox
                                            position="left"
                                            title='OvSmart'
                                            type="text"
                                            text={message.text}
                                            date={new Date()}// Use the timestamp from the message
                                        />
                                        : <MessageBox
                                            styles={styles}
                                            position='right'
                                            title={message.type}
                                            titleColor='grey'
                                            type='text'
                                            text={message.text}
                                            date={new Date()}
                                        />
                                    }

                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="input-container">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask me anything..."
                        />
                        <button onClick={handleSubmit} className='submit-button'>
                            <svg className='message-button' fill='white' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M16.1 260.2c-22.6 12.9-20.5 47.3 3.6 57.3L160 376V479.3c0 18.1 14.6 32.7 32.7 32.7c9.7 0 18.9-4.3 25.1-11.8l62-74.3 123.9 51.6c18.9 7.9 40.8-4.5 43.9-24.7l64-416c1.9-12.1-3.4-24.3-13.5-31.2s-23.3-7.5-34-1.4l-448 256zm52.1 25.5L409.7 90.6 190.1 336l1.2 1L68.2 285.7zM403.3 425.4L236.7 355.9 450.8 116.6 403.3 425.4z" /></svg>
                        </button>
                    </div>
                </div>) : ''
            }

            <div className='initialize-chat-section'>
                <div className='initialize-button' onClick={handleChatOpen}>
                    <p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill='white' height="20px" viewBox="0 0 512 512"><path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z" /></svg>
                        <span>Help</span>
                    </p>
                </div>

                {informativeTextOpen && <div>
                    <div className='informative-text'>
                        <p>
                            Hello I can Connect you with an Omnivoltaic representative
                            or answer questions you have about our products
                        </p>
                    </div>
                    <button className='close-icon-button' onClick={handleCloseInformativetext} >
                        <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M464 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-83.6 290.5c4.8 4.8 4.8 12.6 0 17.4l-40.5 40.5c-4.8 4.8-12.6 4.8-17.4 0L256 313.3l-66.5 67.1c-4.8 4.8-12.6 4.8-17.4 0l-40.5-40.5c-4.8-4.8-4.8-12.6 0-17.4l67.1-66.5-67.1-66.5c-4.8-4.8-4.8-12.6 0-17.4l40.5-40.5c4.8-4.8 12.6-4.8 17.4 0l66.5 67.1 66.5-67.1c4.8-4.8 12.6-4.8 17.4 0l40.5 40.5c4.8 4.8 4.8 12.6 0 17.4L313.3 256l67.1 66.5z" /></svg>
                    </button>
                </div>}
            </div>
        </>

    );
}

export default ChatBot;
