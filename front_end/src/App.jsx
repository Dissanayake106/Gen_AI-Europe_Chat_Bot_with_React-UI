import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/global.css';

const Layout = ({ children }) => {
    const location = useLocation();
    const isChatPage = location.pathname === '/chat';

    return (
        <div className="app-container">
            {!isChatPage && <Header />}
            <main className={isChatPage ? 'chat-main' : 'content-main'}>
                {children}
            </main>
            {!isChatPage && <Footer />}
        </div>
    );
};

function App() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/chat" element={<Chat isOnline={isOnline} />} />
                    <Route path="*" element={<Home />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;