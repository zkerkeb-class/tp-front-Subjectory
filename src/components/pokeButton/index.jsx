const PokeButton = ({ children, onClick, variant = "primary", disabled = false, className = "" }) => {
    return (
        <button 
            className={`poke-btn ${variant} ${className}`} 
            onClick={onClick} 
            disabled={disabled}
        >
            {children}
        </button>
    );
};
export default PokeButton;