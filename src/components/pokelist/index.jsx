import { useState } from "react";
import usePokemon from "../../hook/usePokemon";
import PokeCard from "../pokeCard";
import AddPokemon from "../addPokemon";
import useFavorites from '../../hook/useFavorites';
import { TYPE_COLORS } from '../../constants/pokemonConstants';
import './index.css';

const PokeList = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    
    const [showOnlyFavs, setShowOnlyFavs] = useState(false);
    const { favorites, favoriteData, loadingFavs, fetchFavoriteDetails } = useFavorites();

    const { pokemons = [], total = 0, totalPages = 0, loading, error } = usePokemon(page, searchTerm, selectedType);

    const handleToggleFavs = () => {
        const nextState = !showOnlyFavs;
        setShowOnlyFavs(nextState);
        if (nextState) {
            fetchFavoriteDetails();
        }
    };

    const baseList = showOnlyFavs 
    ? favoriteData.filter(p => favorites.includes(p.id)) 
    : pokemons;

    const displayedPokemons = baseList.filter(pokemon => {
        const matchesSearch = pokemon.name.french.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === "All" || pokemon.type.includes(selectedType);
        return matchesSearch && matchesType;
    });

    const isGlobalLoading = showOnlyFavs ? loadingFavs : loading;

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const clearSearch = () => {
        setSearchTerm("");
    };

    const handleTypeChange = (type) => {
        setSelectedType(type);
        setPage(1);
    };

    if (error) return <div className="no-result"><p>Erreur de chargement...</p></div>;

    return (
        <div className="poke-list-container">
            <div className="list-header">
                <h1 className="main-title">
                    Pokédex <span className="highlight">National</span>
                    <span className="total-badge">{total}</span>
                </h1>
                
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
                        {searchTerm && (
                            <button className="clear-search-btn" onClick={clearSearch}>
                                ✕
                            </button>
                        )}
                    </div>

                    <button className={`fav-filter-btn ${showOnlyFavs ? 'active' : ''}`} onClick={handleToggleFavs}>
                        {favorites.length > 0 ? '⭐ ' : '☆ '} 
                        Favoris 
                        {favorites.length > 0 && <span className="fav-count">{favorites.length}</span>}
                    </button>

                    <AddPokemon />
                </div>

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
            
            {isGlobalLoading ? (
                <div className="loading-container"><div className="spinner"></div></div>
            ) : (
                <>
                    <ul className="poke-list">
                        {displayedPokemons && displayedPokemons.length > 0 ? (
                            displayedPokemons.map((pokemon) => (
                                <PokeCard key={pokemon.id} pokemon={pokemon} />
                            ))
                        ) : (
                            <div className="no-result">
                                <p>
                                    {showOnlyFavs 
                                        ? `Aucun favori trouvé${searchTerm ? ` pour "${searchTerm}"` : ''}` 
                                        : `Aucun Pokémon de type ${selectedType === 'All' ? '' : selectedType} trouvé${searchTerm ? ` pour "${searchTerm}"` : ''}`}
                                </p>
                            </div>
                        )}
                    </ul>

                    {!showOnlyFavs && pokemons.length > 0 && (
                        <div className="glass-pagination">
                            <button 
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="page-btn"
                            >
                                ←
                            </button>
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