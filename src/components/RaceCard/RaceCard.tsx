import './RaceCard.css';

interface RaceCardProps {
    round?: number;
    name: string;
    location: string;
    country: string;
    countryFlag?: string;
    circuitImage?: string;
    dateStart: string;
    dateEnd: string;
    isUpcoming?: boolean;
    isCompleted?: boolean;
}

const RaceCard = ({
    round,
    name,
    location,
    country,
    countryFlag,
    circuitImage,
    dateStart,
    dateEnd,
    isUpcoming = false,
    isCompleted = false,
}: RaceCardProps) => {
    // Format date display
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    const formatDateRange = () => {
        const start = formatDate(dateStart);
        const end = formatDate(dateEnd);
        return `${start} - ${end}`;
    };

    return (
        <div className={`race-card glass-card ${isUpcoming ? 'upcoming' : ''} ${isCompleted ? 'completed' : ''}`}>
            {round && (
                <div className="race-round">
                    <span className="round-label">Round</span>
                    <span className="round-number">{round}</span>
                </div>
            )}

            <div className="race-circuit-image">
                {circuitImage ? (
                    <img
                        src={circuitImage}
                        alt={`${name} circuit`}
                        className="circuit-img"
                        loading="lazy"
                    />
                ) : (
                    <div className="circuit-placeholder">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M9 20L3 17V4L9 7M9 20L15 17M9 20V7M15 17L21 20V7L15 4M15 17V4M9 7L15 4" />
                        </svg>
                    </div>
                )}
            </div>

            <div className="race-info">
                <div className="race-header">
                    {countryFlag && (
                        <img src={countryFlag} alt={country} className="country-flag" />
                    )}
                    <span className="race-country">{country}</span>
                </div>

                <h3 className="race-name">{name}</h3>
                <p className="race-location">{location}</p>

                <div className="race-date">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>{formatDateRange()}</span>
                </div>
            </div>

            {isUpcoming && (
                <div className="race-badge upcoming-badge">Upcoming</div>
            )}
            {isCompleted && (
                <div className="race-badge completed-badge">Completed</div>
            )}
        </div>
    );
};

export default RaceCard;
