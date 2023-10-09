// // ChatBot.js
// import React, { useState } from 'react';

// function ChatBot() {
//     const [messages, setMessages] = useState([]);
//     const [input, setInput] = useState('');

//     const handleSend = async () => {
//         if (input.trim() === '') return;

//         // Add user's message to the chat
//         setMessages([...messages, { type: 'user', text: input.trim() }]);

//         // Fetch response from the backend
//         try {
//             const response = await fetch('YOUR_BACKEND_ENDPOINT_URL', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ message: input.trim() })
//             });
//             const data = await response.json();

//             // Add bot's response to the chat
//             setMessages([...messages, { type: 'user', text: input.trim() }, { type: 'bot', text: data.response }]);
//         } catch (error) {
//             console.error("Error fetching response:", error);
//         }

//         setInput('');  // Clear input field
//     };

//     return (
//         <div className="chatbot-container">
//             <div className="messages-container">
//                 {messages.map((message, index) => (
//                     <div key={index} className={`message ${message.type}`}>
//                         {message.text}
//                     </div>
//                 ))}
//             </div>
//             <div className="input-container">
//                 <input value={input} onChange={e => setInput(e.target.value)} />
//                 <button onClick={handleSend}>Send</button>
//             </div>
//         </div>
//     );
// }

// export default ChatBot;




// i have introduced a websocket in the following code that will help in consuming endpoints from any db

import React, { useState, useEffect } from 'react';
import './chatbot.css';

function ChatBot() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [ws, setWs] = useState(null);

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

        websocket.onclose = ()) => {
            console.log("WebSocket connection closed");
        };

        return () => {
            websocket.close();
        };
    }, []);

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
        }

        setInput('');  // Clear input field
    };

    return (
        <div className="chatbot-container">
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
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask me anything..." />
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
}

export default ChatBot;
