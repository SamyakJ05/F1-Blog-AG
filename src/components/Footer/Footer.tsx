import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 2L38 12V28L20 38L2 28V12L20 2Z" stroke="url(#footer-gradient)" strokeWidth="2" fill="none" />
                            <path d="M20 8L32 15V25L20 32L8 25V15L20 8Z" fill="url(#footer-gradient)" />
                            <defs>
                                <linearGradient id="footer-gradient" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#e10600" />
                                    <stop offset="1" stopColor="#ff4444" />
                                </linearGradient>
                            </defs>
                        </svg>
                        <span className="footer-brand-name">Apex Chronicle</span>
                    </div>
                    <p className="footer-tagline">Your source for Formula 1 news and data</p>
                </div>

                <div className="footer-credits">
                    <h4>Data Sources</h4>
                    <ul>
                        <li>
                            <a href="https://openf1.org" target="_blank" rel="noopener noreferrer">
                                OpenF1 API
                            </a>
                        </li>
                        <li>
                            <a href="https://github.com/jolpica/jolpica-f1" target="_blank" rel="noopener noreferrer">
                                Jolpica-F1 API
                            </a>
                        </li>
                    </ul>
                </div>

                <div className="footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="/drivers">Drivers</a></li>
                        <li><a href="/calendar">Calendar</a></li>
                        <li><a href="/results">Results</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container footer-bottom-content">
                    <p className="footer-legal">
                        Formula 1® and F1® are trademarks of Formula One Licensing B.V.
                        <br />
                        All driver images and circuit imagery are property of their respective owners.
                    </p>
                    <p className="footer-copyright">
                        © 2026 Apex Chronicle. Made with ❤️ for F1 fans.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
