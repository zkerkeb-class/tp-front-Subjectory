import { useState, useEffect, useCallback } from 'react';

const useFavorites = () => {
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('poke_favorites');
        return saved ? JSON.parse(saved) : [];
    });

    const [favoriteData, setFavoriteData] = useState([]);
    const [loadingFavs, setLoadingFavs] = useState(false);

    // Synchronisation forcée entre toutes les instances du hook
    useEffect(() => {
        const syncFavs = () => {
            const saved = localStorage.getItem('poke_favorites');
            const newFavs = saved ? JSON.parse(saved) : [];
            setFavorites(newFavs);
            // On filtre les données immédiatement si on est en mode favoris
            setFavoriteData(prev => prev.filter(p => newFavs.includes(p.id)));
        };

        window.addEventListener('storage', syncFavs); // Pour d'autres onglets
        window.addEventListener('favorites-updated', syncFavs); // Pour le même onglet
        
        return () => {
            window.removeEventListener('storage', syncFavs);
            window.removeEventListener('favorites-updated', syncFavs);
        };
    }, []);

    const toggleFavorite = (pokemonId) => {
        const saved = localStorage.getItem('poke_favorites');
        let current = saved ? JSON.parse(saved) : [];
        
        const newFavs = current.includes(pokemonId) 
            ? current.filter(id => id !== pokemonId) 
            : [...current, pokemonId];
        
        localStorage.setItem('poke_favorites', JSON.stringify(newFavs));
        // Event déclenché instantanément pour synchroniser les autres instances du hook
        window.dispatchEvent(new Event('favorites-updated'));
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

    return { 
        favorites, favoriteData, loadingFavs, 
        toggleFavorite, isFavorite: (id) => favorites.includes(id), 
        fetchFavoriteDetails 
    };
};

export default useFavorites;