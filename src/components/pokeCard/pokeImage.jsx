const PokeImage = ({ imageUrl, alt, className = "poke-image" }) => {
    return (    
        <img src={imageUrl} alt={alt} className={className} />
    );
};

export default PokeImage;