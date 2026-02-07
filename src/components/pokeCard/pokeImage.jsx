

const PokeImage = ({ imageUrl, alt }) => {
    return (    
            <img src={imageUrl} alt={alt} className="poke-image" />
    );
};

export default PokeImage;