import { useState } from "react";
import usePokemon from "../../hook/usePokemon";
import PokeCard from "../pokeCard";
import AddPokemon from "../AddPokemon";
import './index.css';

const TYPE_COLORS = {
    Normal: '#A8A878', Fire: '#F08030', Water: '#6890F0', Grass: '#78C850',
    Electric: '#F8D030', Ice: '#98D8D8', Fighting: '#C03028', Poison: '#A040A0',
    Ground: '#E0C068', Flying: '#A890F0', Psychic: '#F85888', Bug: '#A8B820',
    Rock: '#B8A038', Ghost: '#705898', Dragon: '#7038F8', Steel: '#B8B8D0', Fairy: '#EE99AC', Dark: '#705848'
};

const PokeList = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("All");

    // On passe les 3 états au Hook mis à jour
    const { pokemons = [], totalPages = 0, loading, error } = usePokemon(page, searchTerm, selectedType);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1); // Retour page 1 si on cherche
    };

    const handleTypeChange = (type) => {
        setSelectedType(type);
        setPage(1); // Retour page 1 si on change de filtre
    };

    if (error) return <div className="no-result"><p>Erreur de chargement...</p></div>;

    return (
        <div className="poke-list-container">
            {/* Header & Contrôles */}
            <div className="list-header">
                <h1 className="main-title">Pokédex <span className="highlight">National</span></h1>
                
                <div className="controls-bar">
                    <div className="search-wrapper">
                        <span className="search-icon">🔍</span>
                        <input 
                            type="text" 
                            placeholder="Rechercher un Pokémon..." 
                            value={searchTerm}
                            onChange={handleSearch}
                            className="glass-search"
                        />
                    </div>
                    <AddPokemon />
                </div>

                {/* Section de filtrage repositionnée et aérée */}
                <div className="filters-wrapper">
                    <div className="filters-container">
                        <button 
                            className={`filter-chip ${selectedType === 'All' ? 'active' : ''}`}
                            onClick={() => handleTypeChange('All')}
                        >
                            Tous
                        </button>
                        
                        {Object.keys(TYPE_COLORS).map((type) => (
                            <button
                                key={type}
                                className={`filter-chip ${selectedType === type ? 'active' : ''}`}
                                style={{ '--chip-color': TYPE_COLORS[type] }}
                                onClick={() => handleTypeChange(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Contenu */}
            {loading ? (
                <div className="loading-container"><div className="spinner"></div></div>
            ) : (
                <>
                    <ul className="poke-list">
                        {pokemons && pokemons.length > 0 ? (
                            pokemons.map((pokemon) => (
                                <PokeCard key={pokemon.id} pokemon={pokemon} />
                            ))
                        ) : (
                            <div className="no-result">
                                <p>Aucun Pokémon ne correspond à votre recherche.</p>
                            </div>
                        )}
                    </ul>

                    {/* On affiche la pagination tant qu'il y a des pokémons, même s'il n'y a qu'une page */}
                    {pokemons.length > 0 && (
                        <div className="glass-pagination">
                            <button 
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="page-btn"
                            >
                                ←
                            </button>
                            
                            {/* Affiche "1 / 1" si tout tient sur une page */}
                            <span className="page-info">{page} / {totalPages || 1}</span>
                            
                            <button 
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages || totalPages === 0}
                                className="page-btn"
                            >
                                →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PokeList;