import { useEffect, useState } from 'react';
import { getDrivers } from '../../services/openf1';
import type { Driver } from '../../services/openf1';
import { getRaceResults } from '../../services/jolpica';
import type { Race } from '../../services/jolpica';
import './Results.css';

const Results = () => {
    const [races, setRaces] = useState<Race[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [selectedRace, setSelectedRace] = useState<Race | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [racesData, driversData] = await Promise.all([
                    getRaceResults('current'),
                    getDrivers(),
                ]);

                setRaces(racesData.reverse()); // Most recent first
                setDrivers(driversData);

                if (racesData.length > 0) {
                    setSelectedRace(racesData[racesData.length - 1]);
                }
            } catch (error) {
                console.error('Error fetching results:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Create a driver lookup map for team colors
    const driverMap = new Map(drivers.map(d => [d.name_acronym, d]));

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner" />
                <p>Loading results...</p>
            </div>
        );
    }

    return (
        <div className="results-page">
            <div className="container">
                {/* Page Header */}
                <header className="page-header">
                    <h1>Race Results</h1>
                    <p>Complete results from the 2025 Formula 1 season</p>
                </header>

                <div className="results-layout">
                    {/* Race Selector */}
                    <aside className="race-selector">
                        <h3>Select Race</h3>
                        <div className="race-list">
                            {races.map((race) => (
                                <button
                                    key={`${race.season}-${race.round}`}
                                    className={`race-item ${selectedRace?.round === race.round ? 'active' : ''}`}
                                    onClick={() => setSelectedRace(race)}
                                >
                                    <span className="race-round">R{race.round}</span>
                                    <div className="race-item-info">
                                        <span className="race-item-name">{race.raceName}</span>
                                        <span className="race-item-date">{race.date}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Results Display */}
                    <main className="results-main">
                        {selectedRace ? (
                            <>
                                <div className="results-header glass-card">
                                    <div className="results-race-info">
                                        <span className="results-round">Round {selectedRace.round}</span>
                                        <h2>{selectedRace.raceName}</h2>
                                        <p className="results-circuit">
                                            {selectedRace.Circuit.circuitName} • {selectedRace.Circuit.Location.locality}, {selectedRace.Circuit.Location.country}
                                        </p>
                                        <p className="results-date">{selectedRace.date}</p>
                                    </div>
                                </div>

                                {/* Podium */}
                                {selectedRace.Results && selectedRace.Results.length >= 3 && (
                                    <div className="results-podium">
                                        {[1, 0, 2].map((idx) => {
                                            const result = selectedRace.Results![idx];
                                            const driverInfo = driverMap.get(result.Driver.code);
                                            return (
                                                <div
                                                    key={result.Driver.driverId}
                                                    className={`podium-item p${idx + 1}`}
                                                    style={{ '--team-color': driverInfo ? `#${driverInfo.team_colour}` : '#ffffff' } as React.CSSProperties}
                                                >
                                                    <div className="podium-position">{result.position}</div>
                                                    {driverInfo?.headshot_url && (
                                                        <img
                                                            src={driverInfo.headshot_url}
                                                            alt={result.Driver.familyName}
                                                            className="podium-image"
                                                        />
                                                    )}
                                                    <div className="podium-info">
                                                        <strong>{result.Driver.givenName} {result.Driver.familyName}</strong>
                                                        <span>{result.Constructor.name}</span>
                                                        {result.Time && <span className="podium-time">{result.Time.time}</span>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Full Results Table */}
                                <div className="results-table-container glass-card">
                                    <h3>Full Classification</h3>
                                    <table className="results-table">
                                        <thead>
                                            <tr>
                                                <th>Pos</th>
                                                <th>Driver</th>
                                                <th>Team</th>
                                                <th>Grid</th>
                                                <th>Laps</th>
                                                <th>Time/Status</th>
                                                <th>Pts</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {selectedRace.Results?.map((result) => {
                                                const driverInfo = driverMap.get(result.Driver.code);
                                                return (
                                                    <tr key={result.Driver.driverId}>
                                                        <td className="pos-cell">
                                                            <span className={`position ${parseInt(result.position) <= 3 ? `top-${result.position}` : ''}`}>
                                                                {result.positionText}
                                                            </span>
                                                        </td>
                                                        <td className="driver-cell">
                                                            <div
                                                                className="driver-color-bar"
                                                                style={{ backgroundColor: driverInfo ? `#${driverInfo.team_colour}` : '#ffffff' }}
                                                            />
                                                            <span>{result.Driver.givenName} <strong>{result.Driver.familyName}</strong></span>
                                                        </td>
                                                        <td className="team-cell">{result.Constructor.name}</td>
                                                        <td>{result.grid}</td>
                                                        <td>{result.laps}</td>
                                                        <td className="time-cell">
                                                            {result.Time?.time || result.status}
                                                        </td>
                                                        <td className="points-cell">
                                                            {parseInt(result.points) > 0 ? (
                                                                <span className="points-badge">+{result.points}</span>
                                                            ) : (
                                                                <span className="no-points">0</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Fastest Lap */}
                                {selectedRace.Results && (
                                    <div className="fastest-lap glass-card">
                                        <h4>Fastest Lap</h4>
                                        {(() => {
                                            const fastestLapper = selectedRace.Results.find(r => r.FastestLap?.rank === '1');
                                            if (!fastestLapper) return <p>No data available</p>;
                                            const driverInfo = driverMap.get(fastestLapper.Driver.code);
                                            return (
                                                <div className="fastest-lap-info">
                                                    <div
                                                        className="fl-driver"
                                                        style={{ color: driverInfo ? `#${driverInfo.team_colour}` : '#ffffff' }}
                                                    >
                                                        {fastestLapper.Driver.givenName} {fastestLapper.Driver.familyName}
                                                    </div>
                                                    <div className="fl-time">
                                                        {fastestLapper.FastestLap?.Time.time}
                                                    </div>
                                                    <div className="fl-speed">
                                                        Avg: {fastestLapper.FastestLap?.AverageSpeed.speed} {fastestLapper.FastestLap?.AverageSpeed.units}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="empty-state">
                                <h3>No race selected</h3>
                                <p>Select a race from the list to view results</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Results;
