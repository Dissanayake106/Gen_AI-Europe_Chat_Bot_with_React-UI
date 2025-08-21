import { useEffect, useRef } from 'react';
import Message from './Message';
import TypingDots from './TypingDots';
import '../styles/Chat.css';

const ChatWindow = ({ messages, isTyping }) => {
    const messagesEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="chat-window">
            {messages.map((message) => (
                <Message
                    key={message.id}
                    text={message.text}
                    sender={message.sender}
                    timestamp={message.timestamp}
                />
            ))}

            {isTyping && (
                <div className="typing-indicator">
                    <TypingDots />
                </div>
            )}

            <div ref={messagesEndRef} className="scroll-anchor" />
        </div>
    );
};

export default ChatWindow;