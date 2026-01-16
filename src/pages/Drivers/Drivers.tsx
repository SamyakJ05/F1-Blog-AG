// Drivers Page Component - Displays 2026 Grid
import { useEffect, useState } from 'react';
import { getDrivers, getDriverImage } from '../../services/openf1';
import type { Driver } from '../../services/openf1';
import DriverCard from '../../components/DriverCard/DriverCard';
import './Drivers.css';

const Drivers = () => {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const driversData = await getDrivers();
                setDrivers(driversData);
            } catch (error) {
                console.error('Error fetching drivers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Define the reigning champion (Max Verstappen)
    // We hardcode this because the API returns current season drivers, but we want to highlight the champion
    const driversChampion = {
        full_name: 'Max Verstappen',
        team_name: 'Red Bull Racing',
        team_colour: '3671C6',
        driver_number: 1,
        name_acronym: 'VER',
        last_name: 'Verstappen',
        first_name: 'Max',
        headshot_url: '', // Will be generated
    } as Driver;

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner" />
                <p>Loading drivers...</p>
            </div>
        );
    }

    return (
        <div className="drivers-page">
            <div className="container">
                {/* Page Header */}
                <header className="page-header">
                    <h1>2026 Driver Lineup</h1>
                    <p>Meet all 20 drivers competing in the 2026 Formula 1 World Championship</p>
                </header>

                {/* Drivers Champion */}
                <section className="champion-spotlight">
                    <div className="spotlight-content glass-card">
                        <div className="spotlight-badge">2025 Drivers Champion</div>
                        <div className="spotlight-driver-info">
                            <h2>{driversChampion.full_name}</h2>
                            <p style={{ color: `#${driversChampion.team_colour}` }}>
                                {driversChampion.team_name}
                            </p>
                            <div className="spotlight-stats">
                                <div className="stat">
                                    <span className="stat-value">{driversChampion.name_acronym}</span>
                                    <span className="stat-label">Code</span>
                                </div>
                            </div>
                        </div>
                        <img
                            src={getDriverImage(driversChampion)}
                            alt={driversChampion.full_name}
                            className="spotlight-image"
                        />
                    </div>
                </section>

                {/* All Drivers Grid */}
                <section className="section">
                    <div className="section-header">
                        <h2 className="section-title">All Drivers</h2>
                        <span className="driver-count">{drivers.length} drivers</span>
                    </div>

                    <div className="drivers-grid">
                        {drivers.map((driver) => (
                            <DriverCard
                                key={driver.driver_number}
                                name={driver.full_name}
                                acronym={driver.name_acronym}
                                team={driver.team_name}
                                teamColor={driver.team_colour}
                                headshotUrl={getDriverImage(driver)}
                                countryCode={driver.country_code || ''}
                            />
                        ))}
                    </div>
                </section>

                {/* Teams Summary */}
                <section className="section">
                    <div className="section-header">
                        <h2 className="section-title">2026 Teams</h2>
                    </div>

                    <div className="teams-grid">
                        {Array.from(new Set(drivers.map(d => d.team_name))).map(teamName => {
                            const teamDrivers = drivers.filter(d => d.team_name === teamName);
                            const teamColor = teamDrivers[0]?.team_colour || 'ffffff';
                            return (
                                <div
                                    key={teamName}
                                    className="team-card glass-card"
                                    style={{ '--team-color': `#${teamColor}` } as React.CSSProperties}
                                >
                                    <div className="team-color-bar" />
                                    <h3 className="team-name">{teamName}</h3>
                                    <div className="team-drivers">
                                        {teamDrivers.map(d => (
                                            <span key={d.driver_number} className="team-driver-name">
                                                {d.full_name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Data Attribution */}
                <div className="data-attribution">
                    <p>
                        Driver data provided by <a href="https://openf1.org" target="_blank" rel="noopener noreferrer">OpenF1</a>.
                        Images © Formula One Licensing B.V.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Drivers;
