const PokeTypeBadge = ({ type, color, className = "type-badge", style = {} }) => {
    const combinedStyle = {
        '--type-bg': color || '#777',
        backgroundColor: color || '#777',
        ...style
    };

    return (
        <span 
            className={className} 
            style={combinedStyle}
        >
            {type}
        </span>
    );
};

export default PokeTypeBadge;