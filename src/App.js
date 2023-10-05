// import React, { useState} from 'react'; // Add useEffect
// import './chatbot.css';

// function ChatBot() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isTyping, setIsTyping] = useState(false);  // New state for typing indicator

//   const handleSubmit = async () => {
//     if (input.trim() === '') return;

//     // Add user's message to the chat
//     setMessages([...messages, { type: 'user', text: input.trim() }]);

//     setIsTyping(true); // Show typing indicator

//     // Simulate delay for bot response
//     setTimeout(async () => {
//       // Replace this part with your backend call in the future.
//       const botReply = "Welcome, how may I help you?";

//       setMessages([...messages, { type: 'user', text: input.trim() }, { type: 'bot', text: botReply }]);
//       setIsTyping(false); // Hide typing indicator

//       setInput('');  // Clear input field
//     }, 2000);  // 2 seconds delay for demonstration. Adjust as needed.
//   };

//   return (
//     <div className="chatbot-container">
//       <div className="messages-container">
//         {messages.map((message, index) => (
//           <div key={index} className={`message ${message.type}`}>
//             {message.text}
//           </div>
//         ))}
//         {isTyping && (
//           <div className="typing-indicator">
//             <span></span>
//             <span></span>
//             <span></span>
//           </div>
//         )}
//       </div>
//       <div className="input-container">
//         <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask me anything..." />
//         <button onClick={handleSubmit}>Submit</button>
//       </div>
//     </div>
//   );
// }

// export default ChatBot;
import React, { useState, useEffect } from 'react'; // Don't forget to import useEffect
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

      setIsTyping(false);
    };

    websocket.onerror = (error) => {
      console.error(`WebSocket Error: ${error}`);
    };

    websocket.onclose = () => {
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
