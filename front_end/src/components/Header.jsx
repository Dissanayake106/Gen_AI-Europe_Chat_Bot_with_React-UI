import { Link } from 'react-router-dom';
import europeLogo from '../assets/Header-europe-logo.png';
import '../styles/global.css';

const Header = () => {
    return (
        <header className="app-header">
            <div className="header-content">
                <Link to="/" className="logo-link">
                    <img
                        src={europeLogo}
                        alt="EURO-Bot Logo"
                        className="logo"
                        style={{
                            width: '90px',
                            height: '60px',
                            filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
                        }}
                    />
                    <h1 style={{
                        color: '#FFD700',
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                        fontSize: '2rem',
                        marginLeft: '10px'
                    }}>
                        EURO-Bot
                    </h1>
                </Link>
                <nav className="nav-links">
                    <Link
                        to="/chat"
                        className="nav-link"
                        style={{
                            backgroundColor: 'rgba(255, 215, 0, 0.1)',
                            border: '1px solid rgba(255, 215, 0, 0.3)',
                            borderRadius: '20px',
                            padding: '8px 16px',
                            color: '#FFD700',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Start Chat
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;