const PokeIdBadge = ({ id, color, className = "card-id", prefix = "#" }) => {
    const formattedId = id.toString().padStart(3, '0');

    return (
        <span 
            className={className} 
            style={{ color: color }}
        >
            {prefix}{formattedId}
        </span>
    );
};

export default PokeIdBadge;