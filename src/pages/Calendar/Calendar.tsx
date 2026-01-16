import { useEffect, useState } from 'react';
import { getMeetings } from '../../services/openf1';
import type { Meeting } from '../../services/openf1';
import RaceCard from '../../components/RaceCard/RaceCard';
import './Calendar.css';

const Calendar = () => {
    const [meetings, setMeetings] = useState<Meeting[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedYear, setSelectedYear] = useState(2026);

    useEffect(() => {
        const fetchMeetings = async () => {
            setLoading(true);
            try {
                const data = await getMeetings(selectedYear);
                setMeetings(data);
            } catch (error) {
                console.error('Error fetching meetings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMeetings();
    }, [selectedYear]);

    // Determine upcoming/completed status
    const now = new Date();
    const meetingsWithStatus = meetings.map((meeting, index) => {
        const raceEnd = new Date(meeting.date_end);
        const raceStart = new Date(meeting.date_start);
        const isCompleted = raceEnd < now;
        const isUpcoming = raceStart > now && !meetings.slice(0, index).some(m => new Date(m.date_start) > now);

        return {
            ...meeting,
            round: index + 1,
            isCompleted,
            isUpcoming,
        };
    });

    if (loading) {
        return (
            <div className="loading">
                <div className="spinner" />
                <p>Loading calendar...</p>
            </div>
        );
    }

    return (
        <div className="calendar-page">
            <div className="container">
                {/* Page Header */}
                <header className="page-header">
                    <h1>{selectedYear} Race Calendar</h1>
                    <p>Complete schedule of all Formula 1 Grand Prix events</p>

                    <div className="year-selector">
                        {[2025, 2026].map(year => (
                            <button
                                key={year}
                                className={`year-btn ${selectedYear === year ? 'active' : ''}`}
                                onClick={() => setSelectedYear(year)}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Calendar Stats */}
                <div className="calendar-stats">
                    <div className="stat-card glass-card">
                        <span className="stat-number">{meetings.length}</span>
                        <span className="stat-label">Total Races</span>
                    </div>
                    <div className="stat-card glass-card">
                        <span className="stat-number">
                            {meetingsWithStatus.filter(m => m.isCompleted).length}
                        </span>
                        <span className="stat-label">Completed</span>
                    </div>
                    <div className="stat-card glass-card">
                        <span className="stat-number">
                            {meetingsWithStatus.filter(m => !m.isCompleted).length}
                        </span>
                        <span className="stat-label">Remaining</span>
                    </div>
                </div>

                {/* Calendar Grid */}
                <section className="section">
                    <div className="section-header">
                        <h2 className="section-title">All Races</h2>
                    </div>

                    <div className="calendar-grid">
                        {meetingsWithStatus.map((meeting) => (
                            <RaceCard
                                key={meeting.meeting_key}
                                round={meeting.round}
                                name={meeting.meeting_name}
                                location={meeting.location}
                                country={meeting.country_name}
                                countryFlag={meeting.country_flag}
                                circuitImage={meeting.circuit_image}
                                dateStart={meeting.date_start}
                                dateEnd={meeting.date_end}
                                isUpcoming={meeting.isUpcoming}
                                isCompleted={meeting.isCompleted}
                            />
                        ))}
                    </div>
                </section>

                {/* Empty State */}
                {meetings.length === 0 && !loading && (
                    <div className="empty-state">
                        <h3>No races found</h3>
                        <p>Calendar data for {selectedYear} is not available yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Calendar;
