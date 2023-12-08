import React from 'react';
import './chatbot.css';
import ChatBot from './chatbot';

export default function App() {
    return (
        <ChatBot/>
    )
}



// // import React, { useState} from 'react'; // Add useEffect
// // import './chatbot.css';

// // function ChatBot() {
// //   const [messages, setMessages] = useState([]);
// //   const [input, setInput] = useState('');
// //   const [isTyping, setIsTyping] = useState(false);  // New state for typing indicator

// //   const handleSubmit = async () => {
// //     if (input.trim() === '') return;

// //     // Add user's message to the chat
// //     setMessages([...messages, { type: 'user', text: input.trim() }]);

// //     setIsTyping(true); // Show typing indicator

// //     // Simulate delay for bot response
// //     setTimeout(async () => {
// //       // Replace this part with your backend call in the future.
// //       const botReply = "Welcome, how may I help you?";

// //       setMessages([...messages, { type: 'user', text: input.trim() }, { type: 'bot', text: botReply }]);
// //       setIsTyping(false); // Hide typing indicator

// //       setInput('');  // Clear input field
// //     }, 2000);  // 2 seconds delay for demonstration. Adjust as needed.
// //   };

// //   return (
// //     <div className="chatbot-container">
// //       <div className="messages-container">
// //         {messages.map((message, index) => (
// //           <div key={index} className={`message ${message.type}`}>
// //             {message.text}
// //           </div>
// //         ))}
// //         {isTyping && (
// //           <div className="typing-indicator">
// //             <span></span>
// //             <span></span>
// //             <span></span>
// //           </div>
// //         )}
// //       </div>
// //       <div className="input-container">
// //         <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask me anything..." />
// //         <button onClick={handleSubmit}>Submit</button>
// //       </div>
// //     </div>
// //   );
// // }

// // export default ChatBot;

// // A NEW CODE FOR THE BOT BEFORE THE AUTHORIZATION

// // import React, { useState, useEffect } from 'react'; // Don't forget to import useEffect
// // import './chatbot.css';




// // function ChatBot() {
// //   const [messages, setMessages] = useState([]);
// //   const [input, setInput] = useState('');
// //   const [isTyping, setIsTyping] = useState(false);
// //   const [ws, setWs] = useState(null);

// //   useEffect(() => {
// //     const websocket = new WebSocket('wss://dev-chatbot.omnivoltaic.com/ws');
// //     setWs(websocket);

// //     websocket.onopen = () => {
// //       console.log("Connected to the WebSocket server");
// //     };

// //     websocket.onmessage = (event) => {
// //       const botMessage = event.data;

// //       setMessages((prevMessages) => [
// //         ...prevMessages,
// //         { type: 'bot', text: botMessage }
// //       ]);

// //       setIsTyping(true);
// //     };

// //     websocket.onerror = (error) => {
// //       console.error(`WebSocket Error: ${error}`);
// //     };

// //     websocket.onclose = () => {
// //       console.log("WebSocket connection closed");
// //     };

// //     return () => {
// //       websocket.close();
// //     };
// //   }, []);

// //   const handleSubmit = () => {
// //     if (input.trim() === '') return;

// //     setMessages((prevMessages) => [
// //       ...prevMessages,
// //       { type: 'user', text: input.trim() }
// //     ]);

// //     if (ws) {
// //       ws.send(input.trim()); // Send user's input to the backend
// //       setIsTyping(true);
// //     }

// //     setInput('');  // Clear input field
// //   };

// //   return (
// //     <div className="chatbot-container">
// //       <div className="messages-container">
// //         {messages.map((message, index) => (
// //           <div key={index} className={`message ${message.type}`}>
// //             {message.text}
// //           </div>
// //         ))}
// //         {isTyping && (
// //           <div className="typing-indicator">
// //             <span></span>
// //             <span></span>
// //             <span></span>
// //           </div>
// //         )}
// //       </div>
// //       <div className="input-container">
// //         <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask me anything..." />
// //         <button onClick={handleSubmit}>Submit</button>
// //       </div>
// //     </div>
// //   );
// // }

// // export default ChatBot;

// import React, { useState, useEffect, useRef } from 'react';
// import './chatbot.css';
// import AuthPage from './AuthPage';
// import React from 'react';
// import { BrowserRouter, Route, Switch } from 'react-router-dom';
// import ChatbotPage from './ChatbotPage';


// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   return (
//     <div className="app">
//       {isLoggedIn ? (
//         <ChatBot />
//       ) : (
//         <AuthPage onLogin={() => setIsLoggedIn(true)} />
//       )}
//     </div>
//   );
// }


// // 1. ChatbotHeader
// function ChatbotHeader({ topic }) {
//   return <div className="chatbot-header">Topic: {topic}</div>;
// }

// // 2. MessagesContainer
// function MessagesContainer({ messages, isTyping }) {
//   return (
//     <div className="messages-container">
//       {messages.map((message, index) => (
//         <div key={index} className={`message ${message.type}`}>
//           {message.text}
//         </div>
//       ))}
//       {isTyping && (
//         <div className="typing-indicator">
//           <span></span>
//           <span></span>
//           <span></span>
//         </div>
//       )}
//     </div>
//   );
// }

// // 3. InputContainer
// function InputContainer({ input, setInput, handleSubmit, handleKeyDown }) {
//   return (
//     <div className="input-container">
//       <input
//         value={input}
//         onChange={e => setInput(e.target.value)}
//         onKeyDown={handleKeyDown}
//         placeholder="Ask me anything..."
//       />
//       <button onClick={handleSubmit}>Submit</button>
//     </div>
//   );
// }

// // Main ChatBot Component
// function ChatBot() {
//   const topic = useState('OvesSmart chat')[0];
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(scrollToBottom, [messages]);

//   // (remaining logic... e.g. mockServerResponse, handleSubmit, etc.)

//   return (
//     <div className="chatbot-container">
//       <ChatbotHeader topic={topic} />
//       <MessagesContainer messages={messages} isTyping={isTyping} />
//       <InputContainer
//         input={input}
//         setInput={setInput}
//         handleSubmit={handleSubmit}
//         handleKeyDown={handleKeyDown}
//       />
//       <div ref={messagesEndRef} />
//     </div>
//   );
// }

// export default ChatBot;

