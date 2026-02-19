import { createContext, useState, useEffect, useCallback } from 'react';

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('poke_favorites');
        return saved ? JSON.parse(saved) : [];
    });
    const [favoriteData, setFavoriteData] = useState([]);
    const [loadingFavs, setLoadingFavs] = useState(false);

    // Sauvegarde et synchronisation instantanée
    useEffect(() => {
        localStorage.setItem('poke_favorites', JSON.stringify(favorites));
        // Si un ID disparait, on l'enlève direct de la data affichée
        setFavoriteData(prev => prev.filter(p => favorites.includes(p.id)));
    }, [favorites]);

    const toggleFavorite = (pokemonId) => {
        setFavorites(prev => 
            prev.includes(pokemonId) 
                ? prev.filter(id => id !== pokemonId) 
                : [...prev, pokemonId]
        );
    };

    const fetchFavoriteDetails = useCallback(async () => {
        if (favorites.length === 0) return setFavoriteData([]);
        setLoadingFavs(true);
        try {
            const promises = favorites.map(id => 
                fetch(`http://localhost:3000/pokemons/${id}`).then(res => res.json())
            );
            const results = await Promise.all(promises);
            setFavoriteData(results);
        } finally {
            setLoadingFavs(false);
        }
    }, [favorites]);

    return (
        <FavoriteContext.Provider value={{ 
            favorites, favoriteData, loadingFavs, 
            toggleFavorite, fetchFavoriteDetails,
            isFavorite: (id) => favorites.includes(id)
        }}>
            {children}
        </FavoriteContext.Provider>
    );
};