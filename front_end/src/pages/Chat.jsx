import { useState, useEffect, useRef } from 'react';
import ChatWindow from '../components/ChatWindow';
import InputBox from '../components/InputBox';
import europeLogo from '../assets/europe-logo.png';
import '../styles/Chat.css';

const API_BASE_URL = 'http://localhost:5000/api';

const Chat = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! I'm your Euro-Bot, European specialist. How can I help you today?",
            sender: 'bot',
            timestamp: new Date().toLocaleTimeString()
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [isConnected, setIsConnected] = useState(true);
    const [connectionChecked, setConnectionChecked] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Check backend connection on component mount
    useEffect(() => {
        checkBackendConnection();
    }, []);

    const checkBackendConnection = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 5000
            });

            if (response.ok) {
                setIsConnected(true);
            } else {
                setIsConnected(false);
            }
        } catch (error) {
            console.error('Backend connection failed:', error);
            setIsConnected(false);
        } finally {
            setConnectionChecked(true);
        }
    };

    const handleSendMessage = async (message) => {
        if (!message.trim()) return;

        // Add user message
        const newUserMessage = {
            id: Date.now(),
            text: message,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString()
        };
        setMessages(prev => [...prev, newUserMessage]);
        setIsTyping(true);

        try {
            const response = await fetch(`${API_BASE_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            // Add bot response
            const newBotMessage = {
                id: Date.now() + 1,
                text: data.response,
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, newBotMessage]);
            setIsConnected(true);

        } catch (error) {
            console.error('Error:', error);
            const errorMessage = {
                id: Date.now() + 1,
                text: "Sorry, I'm having trouble connecting to the backend server. Please make sure the Python server is running on port 5000.",
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, errorMessage]);
            setIsConnected(false);
        } finally {
            setIsTyping(false);
        }
    };

    const retryConnection = async () => {
        setIsTyping(true);
        await checkBackendConnection();
        setIsTyping(false);
    };

    return (
        <div className="chat-page">
            <div className="chat-container">
                <div className="chat-header" style={{
                    background: 'linear-gradient(135deg, #003366 0%, #00509e 100%)',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '15px',
                    position: 'relative',
                    minHeight: '110px'
                }}>
                    <img
                        src={europeLogo}
                        alt="EURO-Bot Logo"
                        style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 2px 3px rgba(0, 0, 0, 0.4))'
                        }}
                    />
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '5px'
                    }}>
                        <h2 style={{
                            margin: 0,
                            fontSize: '2.1rem',
                            color: '#FFD700',
                            textShadow: '2px 2px 3px rgba(0, 0, 0, 0.4)',
                            fontWeight: 700,
                            letterSpacing: '0.5px'
                        }}>
                            EURO-Bot
                        </h2>
                        <p style={{
                            margin: 0,
                            fontSize: '1rem',
                            color: 'rgba(255, 255, 255, 0.95)',
                            fontStyle: 'italic',
                            fontWeight: 400
                        }}>
                            Your European Specialist Assistant
                        </p>
                        {connectionChecked && !isConnected && (
                            <div style={{
                                marginTop: '8px',
                                padding: '4px 12px',
                                backgroundColor: '#ff4757',
                                color: 'white',
                                borderRadius: '15px',
                                fontSize: '0.8rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <span>Backend disconnected</span>
                                <button
                                    onClick={retryConnection}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.2)',
                                        border: 'none',
                                        color: 'white',
                                        padding: '2px 8px',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        fontSize: '0.7rem'
                                    }}
                                >
                                    Retry
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* REMOVED THE DUPLICATE TYPING DOTS HERE */}
                <ChatWindow messages={messages} isTyping={isTyping} />
                <div ref={messagesEndRef} />
                <InputBox
                    onSendMessage={handleSendMessage}
                    disabled={!isConnected || isTyping}
                />
            </div>
        </div>
    );
};

export default Chat;