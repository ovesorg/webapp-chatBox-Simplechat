
import React, { useState, useEffect, useRef } from 'react';
import './chatbot.css';
import AuthPage from './AuthPage';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="app">
      {isLoggedIn ? (
        <ChatBot />
      ) : (
        <AuthPage onLogin={() => setIsLoggedIn(true)} />
      )}
    </div>
  );
}


// 1. ChatbotHeader
function ChatbotHeader({ topic }) {
  return <div className="chatbot-header">Topic: {topic}</div>;
}

// 2. MessagesContainer
function MessagesContainer({ messages, isTyping }) {
  return (
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
  );
}

// 3. InputContainer
function InputContainer({ input, setInput, handleSubmit, handleKeyDown }) {
  return (
    <div className="input-container">
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything..."
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

// Main ChatBot Component
function ChatBot() {
  const topic = useState('OvesSmart chat')[0];
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // (remaining logic... e.g. mockServerResponse, handleSubmit, etc.)

  return (
    <div className="chatbot-container">
      <ChatbotHeader topic={topic} />
      <MessagesContainer messages={messages} isTyping={isTyping} />
      <InputContainer
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        handleKeyDown={handleKeyDown}
      />
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatBot;

