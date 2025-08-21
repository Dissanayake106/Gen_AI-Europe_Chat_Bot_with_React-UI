const Footer = () => {
    return (
        <footer className="app-footer">
            <div className="footer-content">
                <p>© {new Date().getFullYear()} EURO-Bot - Your European Specialist Assistant</p>
                <div className="footer-links">
                    <a href="/privacy" className="footer-link">Privacy Policy</a>
                    <a href="/terms" className="footer-link">Terms of Service</a>
                    <a href="https://europa.eu" target="_blank" rel="noopener noreferrer" className="footer-link">
                        EU Official Website
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;