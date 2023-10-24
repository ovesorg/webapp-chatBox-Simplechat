

import React, { useState, useEffect, useRef } from 'react';
import './chatbot.css';
//import logo from '.';
import './chatbot.js';



function ChatBot() {
    const topic = useState('OvesSmart chat')[0]; // You can default it to any topic you like
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    function mockServerResponse(input) {
        const responses = {
            "hello": "Hi there! How can I help you?",
            "how are you": "I'm just a bot, so I don't have feelings, but thanks for asking!",
            "who are you": "I'm a mock chatbot providing temporary answers.",
            "tell me about solar panels": "Solar panels are devices that convert light into electricity. They are used to power a wide variety of applications, from small electronics to homes and businesses.",
            "what are fishing lights": "Fishing lights are specialized lights used to attract fish. They can be submerged in the water or float on the surface, and they can be particularly useful for night fishing.",
            "what is omnivoltaic": "Omnivoltaic is a company specializing in energy solutions, providing reliable and affordable power products for people without access to grid power.",
            "what services does omnivoltaic offer": "Omnivoltaic offers a range of energy solutions including solar home systems, fishing lights, and other solar-powered products to cater to off-grid power needs.",
            "tell me about energy solutions": "Energy solutions refer to a range of services and products designed to provide, conserve, or manage energy. This can include renewable energy systems, energy storage solutions, energy efficiency measures, and more.",
            "default": "I'm not sure about that. Could you please rephrase or ask something else?"
        };
        return responses[input.toLowerCase()] || responses["default"];
    }

    const handleSubmit = () => {
        if (input.trim() === '') return;

        setMessages((prevMessages) => [
            ...prevMessages,
            { type: 'user', text: input.trim() }
        ]);

        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const botReply = mockServerResponse(input.trim());
            console.log(botReply)
            setMessages((prevMessages) => [
                ...prevMessages,
                { type: 'bot', text: botReply }
            ]);
            setIsTyping(false);
        }, 1000);

    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit();
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
