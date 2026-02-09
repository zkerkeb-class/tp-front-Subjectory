const PokeStatBar = ({ label, value, maxVal = 100, color, className = "stat-item" }) => {
    const percent = Math.min((value / maxVal) * 100, 100);

    return (
        <div className={className}>
            <div className="stat-header-row">
                <span className="stat-label">{label}</span>
                <span className="stat-value">{value}</span>
            </div>

            <div className="stat-bar-container">
                <div 
                    className="stat-bar-fill" 
                    style={{
                        width: `${percent}%`, 
                        backgroundColor: color
                    }}
                ></div>
            </div>
        </div>
    );
};

export default PokeStatBar;