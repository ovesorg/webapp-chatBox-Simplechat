import React, { useState, useEffect, useRef } from 'react';
import chatbotIcon from './imagess/chatbot-icon.jpg';
import userIcon from './imagess/user.png';
import botIcon from './imagess/ovesLogoimage.png';
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import './chatbot.css';
import 'react-chat-elements/dist/main.css'
import { MessageBox } from 'react-chat-elements';
// import { ChatList } from "react-chat-elements";
//import { MessageList } from "react-chat-elements";



function ChatBot() {
    const topic = useState('OvesSmart chat')[0];
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [ws, setWs] = useState(null); // Moved useRef to top level
    const messagesEndRef = useRef(null);
    // const [chatListData, setChatListData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

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
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        window.toggleChatbot = () => {
            setIsOpen(!isOpen);
        };
    }, [isOpen]);

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };



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
            // setTimeout(() => {
            //     setIsTyping(false);
            //     // scrollToBottom();
            //     // function ChatBot() {
            // },1000);
        }
    };

    const styles = {
        marginTop: "5px",
    }

    console.log(isOpen)
    return (
        <>
            <div id="chatbot-icon-container" onClick={toggleChatbot}>
                <img src={chatbotIcon} alt="Chat Icon" width={40} />
            </div>
            {
                isOpen ? <div className={isOpen ? "chatbot-container open" : "chatbot-container closed"}>
                    <div className="chatbot-header">
                        Topic: {topic}
                        <span className="chatbot-close-button" onClick={toggleChatbot}>X</span>
                    </div>
                    <div className="messages-container">
                        {messages.map((message, index) => (
                            <div key={index} className={`message-row ${message.type}`}>
                                <div className={`message ${message.type}`}>
                                    {message.type === "bot" ?
                                        <MessageBox
                                            avatar={botIcon}
                                            position="left"
                                            title='OvSmart'
                                            type="text"
                                            text={message.text}
                                            date={new Date()}// Use the timestamp from the message
                                        />
                                        : <MessageBox
                                            avatar={userIcon}
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
                        <button onClick={handleSubmit}>Submit</button>
                    </div>

                </div> : null
            }
        </>
    );
}

export default ChatBot;
