import '../styles/Chat.css';

const Message = ({ text, sender, timestamp }) => {
    return (
        <div className={`message ${sender}`}>
            <div className="message-content">
                {text}
                {timestamp && <div className="message-time">{timestamp}</div>}
            </div>
        </div>
    );
};

export default Message;