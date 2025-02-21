import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './chatbot.css';
import 'react-chat-elements/dist/main.css'
import { MessageBox } from 'react-chat-elements';
import AuthentificationPage from './pages/Authentication';
import Rating from '@mui/material/Rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { v4 as uuidv4 } from 'uuid';

function ChatBot() {
    const topic = useState('OvesSmart chat')[0];
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [ws, setWs] = useState(null); // Moved useRef to top level
    const messagesEndRef = useRef(null);
    const [informativeTextOpen, setInformativeTextOpen] = useState(false)
    const [isChatModalOpen, setChatModalOpen] = useState(false)
    const [isSignedIn, setIsSignedIn] = useState(false)
    const [value, setValue] = useState(2);
    const [feedback, setFeedback] = useState('');
    const [isDivClicked, setIsDivClicked] = useState(false)
    const [loading, setLoading] = useState(false)
    const [parenWidth, setParentWidth] = useState(0)
    const [parentHeight, setParentHeight] =useState(0)

    useEffect(() => {
        const storedUserId = localStorage.getItem('user_id');
        if (!storedUserId) {
            const uniqueUserId = uuidv4(); // Generate a unique user ID
            localStorage.setItem('user_id', uniqueUserId); // Store the unique ID in localStorage
        }
    }, []);

    const handleClick = () => {
        setLoading(true)
        let a = messages.slice(-2)
        let userQuestion = a[0]['text']
        let botResponse = a[1]['text']
        const data = {
            user_query: userQuestion,
            bot_response: botResponse,
            user_expected_response: feedback,
            user_rating: value
        }
        const jsonData = JSON.stringify(data)
        if (ws) {
            ws.send(jsonData)
            setIsDivClicked(true)
            setLoading(false)
            setValue(2)
            setFeedback('')
        }
    };
    useEffect(() => {
        window.addEventListener('message', (event) => {
            if (event.data.width) {
                if (event.data.width < 500) {
                    resizeWindow()
                }
                setParentWidth(event.data.width)
                setParentHeight(event.data.height)
            }
        });
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    

    const handleChatOpen = () => {
        let width
        let height
        if(parenWidth> 500){
            width = 400
            height = 550
        } else if(parenWidth< 500) {
            width = (parenWidth - 10)
            height = (parentHeight -10)
        }
        window.parent.postMessage({ width: `${width}px`, height: `${height}px`, sender: "Open" }, '*');
        setChatModalOpen(!isChatModalOpen)
setTimeout(()=> {
    if (parenWidth< 500) {
        resizeWindow()
    }
}, 100)
        setInformativeTextOpen(false)

    }
    function isJSONArray(str) {
        try {
            const arr = JSON.parse(str);
            return Array.isArray(arr);
        } catch (e) {
            return false;
        }
    }
    const handleChatClose = () => {
        setChatModalOpen(false)
        window.parent.postMessage({ width: '80px', height: '80px', sender: "Close" }, '*');
    }

    const resizeWindow = () => {
        const chatbotContainer = document.querySelector('.chatbot-container');
        const messagesContainer = document.querySelector('.messages-container');
        if (chatbotContainer && messagesContainer) {

            chatbotContainer.style.width = '95%';
            chatbotContainer.style.height = '100vh';
            chatbotContainer.style.bottom = '0';
            chatbotContainer.style.right = '0';

            messagesContainer.style.width = "100%"
            messagesContainer.style.height = "80%"
        }
    }


    useEffect(() => {
        let url = `ws://20.19.33.27:6500/chat`
        const websocket = new WebSocket(url);
        setWs(websocket);
        websocket.onopen = () => {
            console.log("Connected to the WebSocket server");
    
            // Send the user_id to fetch the history when the connection is first made
            const userId = localStorage.getItem('user_id');  // Replace with actual user_id
            const data = { user_id: userId }; // Send user_id only to fetch the history
            websocket.send(JSON.stringify(data));
        };

        websocket.onmessage = (event) => {
            try {
                // Parse the incoming message once
                const data = JSON.parse(event.data);
                
                // Check if the response contains history
                if (data.history) {
                    // If it has history, set all messages from history
                    setMessages(data.history.map(item => ({
                        type: 'user',
                        text: item.question
                    })).flatMap((userMsg, index) => [
                        userMsg,
                        { 
                            type: 'bot', 
                            text: data.history[index].answer 
                        }
                    ]));
                    setIsDivClicked(true);
                } else if (data.response) {
                    // If it's a single response to the current question
                    setMessages(prevMessages => [...prevMessages, { type: 'bot', text: data.response }]);
                    setIsDivClicked(false);
                }
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
                console.log("Raw message:", event.data);
            }
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
        } else {
            setInformativeTextOpen(true)
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
        const userId = localStorage.getItem('user_id');  // Replace with actual user_id
        if (input.trim() === '') return;
        const newMessage = { type: 'user', text: input.trim() };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        if (ws) {
            const data = { user_id: userId, question: input.trim() };
            let jsonResponse = JSON.stringify(data)
            ws.send(jsonResponse);
            setInput('');
        }
    };

    const handleCloseInformativetext = () => {
        localStorage.setItem('info-text-modal', true)
        setInformativeTextOpen(false)
    }

    const handleLogin = () => {
        setIsSignedIn(true)
    }
    const styles = {
        marginTop: "5px"

    }

    return (
        <>
            {isChatModalOpen ? (
                <div className="chatbot-container">
                    {(<> <div className="chatbot-header">Topic: {topic}
                        <button className='minus-button' onClick={handleChatClose} >
                            <svg xmlns="http://www.w3.org/2000/svg" fill='white' height="1em" viewBox="0 0 384 512"><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" /></svg>
                        </button>
                    </div>
                        <div className="messages-container">
                            {messages.map((message, index) => {
                                const isLastBotMessage = message.type === "bot" && !messages.slice(index + 1).some(m => m.type === "bot");
                                return (
                                    <div key={index} className={`message-row ${message.type}`}>
                                        <div className={`message ${message.type}`}>
                                            {message.type === "bot" ?
                                                <MessageBox
                                                    position="left"
                                                    title='OvSmart'
                                                    type="text"
                                                    text={message.text}
                                                    date={new Date()}
                                                />
                                                :
                                                <MessageBox
                                                    styles={styles}
                                                    position='right'
                                                    title="you"
                                                    titleColor='grey'
                                                    type='text'
                                                    text={message.text}
                                                    date={new Date()}
                                                />
                                            }
                                            {isLastBotMessage && !isDivClicked &&

                                                <div className='response-style'>
                                                    <p>How did you find the Response</p>
                                                    <div className='response-container'>
                                                        <div className='rating'>
                                                            <p>Rating</p>
                                                            <div style={{ marginTop: -15 }}>
                                                                <Rating

                                                                    name="simple-controlled"
                                                                    value={value}
                                                                    onChange={(event, newValue) => {
                                                                        setValue(newValue);
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className='feedback'>
                                                            <textarea
                                                                onChange={(event) => {
                                                                    setFeedback(event.target.value);
                                                                }} placeholder='What was the Expected feedback' />
                                                        </div>
                                                        <button onClick={handleClick} className="response-button">SUBMIT
                                                            {loading && <FontAwesomeIcon style={{ marginLeft: 20 }} icon={faSpinner} spin />}

                                                        </button>
                                                    </div>
                                                </div>

                                            }
                                        </div>
                                    </div>

                                )
                            })}
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

                        </div></>)}
                    {/* </div></>) : <AuthentificationPage handleChatClose={handleChatClose} onLogin={handleLogin} />} */}
                </div>) : ''
            }

            <div className='initialize-chat-section'>
                <div className='initialize-button' onClick={handleChatOpen}>
                    <p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill='white' height="20px" viewBox="0 0 512 512"><path d="M512 240c0 114.9-114.6 208-256 208c-37.1 0-72.3-6.4-104.1-17.9c-11.9 8.7-31.3 20.6-54.3 30.6C73.6 471.1 44.7 480 16 480c-6.5 0-12.3-3.9-14.8-9.9c-2.5-6-1.1-12.8 3.4-17.4l0 0 0 0 0 0 0 0 .3-.3c.3-.3 .7-.7 1.3-1.4c1.1-1.2 2.8-3.1 4.9-5.7c4.1-5 9.6-12.4 15.2-21.6c10-16.6 19.5-38.4 21.4-62.9C17.7 326.8 0 285.1 0 240C0 125.1 114.6 32 256 32s256 93.1 256 208z" /></svg>
                    </p>
                </div>

                {informativeTextOpen && <div>
                    <div className='informative-text'>
                        <p>
                            Need Help, Let's Chat
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
