import { useNavigate } from 'react-router-dom';
import europeLogo from '../assets/europe-flag-logo.png';
import '../styles/global.css';
import '../styles/Landing.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container fade-in">
            <div className="hero-section">
                <img src={europeLogo} alt="EURO-Bot Logo" className="hero-logo" />
                <h1>Welcome to EURO-Bot</h1>
                <p>Your specialized assistant for European culture, history, politics, and travel information</p>
                <button
                    onClick={() => navigate('/chat')}
                    className="start-chat-btn"
                >
                    Start Chatting
                </button>
            </div>
            <div className="features-section">
                <h2>Discover Europe with EURO-Bot</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🇪🇺</div>
                        <h3>EU Knowledge</h3>
                        <p>Get accurate information about European Union policies, member states, and institutions.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🎭</div>
                        <h3>Cultural Guide</h3>
                        <p>Discover Europe's diverse cultures, traditions, festivals, and artistic heritage.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">✈️</div>
                        <h3>Travel Guide</h3>
                        <p>Get recommendations for destinations, local customs, and travel tips across Europe.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⛷️</div>
                        <h3>Seasonal Tips</h3>
                        <p>Best destinations and activities for each season in Europe.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;