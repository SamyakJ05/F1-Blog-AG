import './DriverCard.css';

interface DriverCardProps {
    position?: number;
    name: string;
    acronym: string;
    team: string;
    teamColor: string;
    points?: number;
    headshotUrl?: string;
    countryCode?: string;
}

const DriverCard = ({
    position,
    name,
    acronym,
    team,
    teamColor,
    points,
    headshotUrl,
    countryCode,
}: DriverCardProps) => {
    // Determine position styling
    const getPositionClass = (pos?: number) => {
        if (!pos) return '';
        if (pos === 1) return 'position-gold';
        if (pos === 2) return 'position-silver';
        if (pos === 3) return 'position-bronze';
        return '';
    };

    return (
        <div
            className="driver-card glass-card"
            style={{ '--team-color': `#${teamColor}` } as React.CSSProperties}
        >
            <div className="driver-card-accent" />

            {position && (
                <div className={`driver-position ${getPositionClass(position)}`}>
                    P{position}
                </div>
            )}

            <div className="driver-image-container">
                {headshotUrl ? (
                    <img
                        src={headshotUrl}
                        alt={name}
                        className="driver-headshot"
                        loading="lazy"
                    />
                ) : (
                    <div className="driver-headshot-placeholder">
                        <span>{acronym}</span>
                    </div>
                )}
            </div>

            <div className="driver-info">
                <div className="driver-name-row">
                    <h3 className="driver-name">{name}</h3>
                    {countryCode && (
                        <span className="driver-country">{countryCode}</span>
                    )}
                </div>
                <p className="driver-team">{team}</p>
                {points !== undefined && (
                    <div className="driver-points">
                        <span className="points-value">{points}</span>
                        <span className="points-label">PTS</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DriverCard;
