import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDrivers, getMeetings, getDriverImage } from '../../services/openf1';
import type { Driver, Meeting } from '../../services/openf1';
import { getLatestNews } from '../../services/news';
import type { NewsArticle } from '../../services/news';
import DriverCard from '../../components/DriverCard/DriverCard';
import RaceCard from '../../components/RaceCard/RaceCard';
import './Home.css';

const Home = () => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [upcomingRaces, setUpcomingRaces] = useState<Meeting[]>([]);
    const [news, setNews] = useState<NewsArticle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [driversData, meetingsData, newsData] = await Promise.all([
                    getDrivers(),
                    getMeetings(2026),
                    getLatestNews(6),
                ]);

                setDrivers(driversData);
                // Filter to only show Grand Prix races (exclude testing)
                const races = meetingsData.filter(m => m.meeting_name.includes('Grand Prix'));
                setUpcomingRaces(races.slice(0, 4));
                setNews(newsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Get top drivers (first 3)
    // Get top drivers (first 3)
    const topDrivers = drivers.slice(0, 3).map((driver) => ({
        name: driver.full_name,
        acronym: driver.name_acronym,
        team: driver.team_name,
        teamColor: driver.team_colour,
        headshotUrl: getDriverImage(driver),
        countryCode: driver.country_code || '',
    }));

    // Format date
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner" />
                <p>Loading F1 data...</p>
            </div>
        );
    }

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-bg" />
                <div className="container hero-content">
                    <div className="hero-text animate-fade-in">
                        <h1>
                            Welcome to <span className="text-gradient">Apex Chronicle</span>
                        </h1>
                        <p className="hero-subtitle">
                            Your premium destination for Formula 1 news, race results, and driver standings.
                            Covering the 2026 season with real-time data from official sources.
                        </p>
                        <div className="hero-actions">
                            <Link to="/calendar" className="btn btn-primary">
                                View 2026 Calendar
                            </Link>
                            <Link to="/drivers" className="btn btn-secondary">
                                2026 Drivers
                            </Link>
                        </div>
                    </div>

                    {upcomingRaces[0] && (
                        <div className="hero-featured animate-slide-in">
                            <div className="featured-label">Next Race</div>
                            <h2 className="featured-title">{upcomingRaces[0].meeting_name}</h2>
                            <p className="featured-location">{upcomingRaces[0].location}, {upcomingRaces[0].country_name}</p>
                            <p className="featured-date">
                                {formatDate(upcomingRaces[0].date_start)} - {formatDate(upcomingRaces[0].date_end)}
                            </p>
                            {upcomingRaces[0].circuit_image && (
                                <img
                                    src={upcomingRaces[0].circuit_image}
                                    alt={upcomingRaces[0].circuit_short_name}
                                    className="featured-circuit"
                                />
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Latest News Section */}
            <section className="section news-section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Latest News & Updates</h2>
                    </div>

                    <div className="news-grid">
                        {news.map((article) => (
                            <a
                                key={article.id}
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="news-card glass-card"
                            >
                                {article.category && (
                                    <span className="news-category">{article.category}</span>
                                )}
                                <h3 className="news-title">{article.title}</h3>
                                <p className="news-description">{article.description}</p>
                                <span className="news-date">
                                    {(() => {
                                        try {
                                            const date = new Date(article.pubDate);
                                            // Check if date is valid
                                            if (isNaN(date.getTime())) return 'Recent';
                                            return date.toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            });
                                        } catch (e) {
                                            return 'Recent';
                                        }
                                    })()}
                                </span>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* 2026 Drivers Section */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">2026 Driver Lineup</h2>
                        <Link to="/drivers" className="btn btn-secondary">View All Drivers</Link>
                    </div>

                    <div className="top-drivers-grid">
                        {topDrivers.map((driver) => (
                            <DriverCard
                                key={driver.acronym}
                                name={driver.name}
                                acronym={driver.acronym}
                                team={driver.team}
                                teamColor={driver.teamColor}
                                headshotUrl={driver.headshotUrl}
                                countryCode={driver.countryCode}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Upcoming Races Section */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">2026 Race Calendar</h2>
                        <Link to="/calendar" className="btn btn-secondary">Full Calendar</Link>
                    </div>

                    <div className="grid-4">
                        {upcomingRaces.map((race, index) => (
                            <RaceCard
                                key={race.meeting_key}
                                round={index + 1}
                                name={race.meeting_name}
                                location={race.location}
                                country={race.country_name}
                                countryFlag={race.country_flag}
                                circuitImage={race.circuit_image}
                                dateStart={race.date_start}
                                dateEnd={race.date_end}
                                isUpcoming={index === 0}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Technical Updates Section */}
            <section className="section">
                <div className="container">
                    <div className="tech-updates glass-card">
                        <div className="tech-header">
                            <h2>2026 Technical Regulations</h2>
                            <span className="tech-badge">New Era</span>
                        </div>
                        <div className="tech-content">
                            <div className="tech-item">
                                <div className="tech-icon">⚡</div>
                                <div className="tech-info">
                                    <h4>New Power Units</h4>
                                    <p>Revolutionary hybrid systems with increased electrical power and sustainable fuels.</p>
                                </div>
                            </div>
                            <div className="tech-item">
                                <div className="tech-icon">🏎️</div>
                                <div className="tech-info">
                                    <h4>Aerodynamic Changes</h4>
                                    <p>Simplified aero regulations designed to promote closer racing and overtaking.</p>
                                </div>
                            </div>
                            <div className="tech-item">
                                <div className="tech-icon">🌱</div>
                                <div className="tech-info">
                                    <h4>Sustainability Focus</h4>
                                    <p>100% sustainable fuels and enhanced efficiency targets for all teams.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Data Sources */}
            <section className="section">
                <div className="container">
                    <div className="news-cta glass-card">
                        <div className="news-cta-content">
                            <h2>Powered by Official Data</h2>
                            <p>Real-time F1 data from trusted sources, updated throughout each race weekend.</p>
                        </div>
                        <div className="news-badges">
                            <div className="api-badge">
                                <span>Live Data</span>
                                <strong>OpenF1</strong>
                            </div>
                            <div className="api-badge">
                                <span>History</span>
                                <strong>Jolpica-F1</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
