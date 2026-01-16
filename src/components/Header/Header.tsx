import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const location = useLocation();

    const navLinks = [
        { path: '/', label: 'Home' },
        { path: '/drivers', label: 'Drivers' },
        { path: '/calendar', label: 'Calendar' },
        { path: '/results', label: 'Results' },
    ];

    return (
        <header className="header">
            <div className="container header-content">
                <Link to="/" className="logo">
                    <div className="logo-icon">
                        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 2L38 12V28L20 38L2 28V12L20 2Z" stroke="url(#logo-gradient)" strokeWidth="2" fill="none" />
                            <path d="M20 8L32 15V25L20 32L8 25V15L20 8Z" fill="url(#logo-gradient)" />
                            <defs>
                                <linearGradient id="logo-gradient" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#e10600" />
                                    <stop offset="1" stopColor="#ff4444" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <div className="logo-text">
                        <span className="logo-name">Apex</span>
                        <span className="logo-subtitle">Chronicle</span>
                    </div>
                </Link>

                <nav className="nav">
                    {navLinks.map(({ path, label }) => (
                        <Link
                            key={path}
                            to={path}
                            className={`nav-link ${location.pathname === path ? 'active' : ''}`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="header-actions">
                    <span className="season-badge">2026</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
