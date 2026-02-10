const PokeTitle = ({ name, className = "card-name" }) => {
    return (
        <h3 className={className}>{name.french}</h3>
    );
}

export default PokeTitle;