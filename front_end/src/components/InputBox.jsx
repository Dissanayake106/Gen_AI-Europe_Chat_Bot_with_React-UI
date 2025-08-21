import { useState } from 'react';
import '../styles/Chat.css';

const InputBox = ({ onSendMessage, disabled = false }) => {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <form className="input-box" onSubmit={handleSubmit}>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={disabled ? "Connecting to backend server..." : "Ask me anything about Europe..."}
                disabled={disabled}
                className={disabled ? 'input-disabled' : ''}
            />
            <button
                type="submit"
                disabled={disabled || !message.trim()}
                className={disabled ? 'button-disabled' : ''}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={disabled ? 'svg-disabled' : ''}
                >
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
            </button>
        </form>
    );
};

export default InputBox;