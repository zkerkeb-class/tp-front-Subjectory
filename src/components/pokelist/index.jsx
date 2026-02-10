import { useState } from "react";
import usePokemon from "../../hook/usePokemon";
import PokeCard from "../pokeCard";
import AddPokemon from "../addPokemon";
import useFavorites from '../../hook/useFavorites';
import { TYPE_COLORS } from '../../constants/pokemonConstants';
import CompareBar from '../compareBar';
import CompareModal from '../compareModal';
import { useNavigate } from 'react-router-dom';
import './index.css';

const PokeList = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const [showOnlyFavs, setShowOnlyFavs] = useState(false);
    const { favorites, favoriteData, loadingFavs, fetchFavoriteDetails } = useFavorites();
    const [showCompareModal, setShowCompareModal] = useState(false);
    const { pokemons = [], total = 0, totalPages = 0, loading, error } = usePokemon(page, searchTerm, selectedType);
    const [compareList, setCompareList] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const navigate = useNavigate();
    const suggestions = searchTerm.length > 1 
        ? pokemons.filter(p => 
            p.name.french.toLowerCase().includes(searchTerm.toLowerCase())
        ).slice(0, 5)
        : [];

    const handleToggleFavs = () => {
        const nextState = !showOnlyFavs;
        setShowOnlyFavs(nextState);
        if (nextState) {
            fetchFavoriteDetails();
        }
    };
    const handleCompare = (pokemon) => {
        setCompareList(prev => {
            if (prev.find(p => p.id === pokemon.id)) {
                return prev.filter(p => p.id !== pokemon.id);
            }
            if (prev.length >= 2) {
                alert("Vous ne pouvez comparer que 2 Pokémon à la fois.");
                return prev;
            }
            return [...prev, pokemon];
        });
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
        setShowSuggestions(true);
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
    const themeColor = selectedType !== "All" ? TYPE_COLORS[selectedType] : "#2a2a35";

    return (
        <div 
            className="poke-list-container" 
            style={{ '--theme-glow': themeColor }}
        >
            <div className="list-header">
                <h1 className="main-title">
                    Pokédex National
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
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 300)}
                            onFocus={() => setShowSuggestions(true)}
                            className="glass-search"
                        />

                        {showSuggestions && suggestions.length > 0 && (
                            <ul className="search-suggestions-glass">
                                {suggestions.map(p => (
                                    <li key={p.id} onClick={() => {
                                        setSearchTerm(p.name.french);
                                        setShowSuggestions(false);
                                        navigate(`/pokemon/${p.id}`);
                                    }}>
                                        <img src={p.image} alt={p.name.french} className="suggest-img" />
                                        <div className="suggest-info">
                                            <span className="suggest-name">{p.name.french}</span>
                                            <span className="suggest-type">{p.type.join(', ')}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}

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
                                <PokeCard key={pokemon.id} pokemon={pokemon} onCompare={handleCompare} isSelectedForCompare={compareList.some(p => p.id === pokemon.id)}/>
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
                    <div className="bottom-controls-wrapper">
                        {!showCompareModal && (
                            <>
                                {compareList.length > 0 ? (
                                    <CompareBar 
                                        selectedPokemon={compareList} 
                                        onRemove={handleCompare}
                                        onClear={() => setCompareList([])}
                                        onCompare={() => setShowCompareModal(true)} 
                                    />
                                ) : (
                                    !showOnlyFavs && pokemons.length > 0 && (
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
                                    )
                                )}
                            </>
                        )}
                    </div>
                    {showCompareModal && (
                        <CompareModal 
                            pokemon1={compareList[0]} 
                            pokemon2={compareList[1]} 
                            onClose={() => setShowCompareModal(false)} 
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default PokeList;