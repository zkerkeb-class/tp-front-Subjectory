const PokeTypeBadge = ({ type, color, size = "small" }) => {
    const style = {
        '--type-color': color || '#777',
    };

    // On applique une classe différente selon la prop size
    const className = size === "large" ? "type-badge-metallic-lg" : "type-badge-metallic-sm";

    return (
        <span className={className} style={style}>
            {type}
        </span>
    );
};

export default PokeTypeBadge;