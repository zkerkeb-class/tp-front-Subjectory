import { useState, useEffect } from 'react';

const usePokemon = (page = 1, search = '', type = 'All') => { 
    const [data, setData] = useState({ pokemons: [], totalPages: 0 });
    const [pokemonData, setPokemonData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // POST un pokemon
    const addPokemon = async (newPokemon) => {
        try {
            const response = await fetch(`http://localhost:3000/pokemons`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newPokemon)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erreur lors de la création');
            }
            return await response.json();
        } catch (err) {
            console.error("Erreur addPokemon:", err);
            return null;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Détection de la page "Détails" (par l'URL)
                const isSingle = window.location.pathname.includes('pokemon');

                if (isSingle) {
                    // CAS 1 : Page détail (Un seul Pokémon)
                    // Ici 'page' contient l'ID du Pokémon
                    const response = await fetch(`http://localhost:3000/pokemons/${page}`);
                    if (!response.ok) throw new Error('Erreur réseau');
                    const result = await response.json();
                    setPokemonData(result);

                } else if (type === 'All') {
                    // CAS 2 : Liste tous les pokémons
                    // Pagination correcte (1/8) du serveur
                    const url = `http://localhost:3000/pokemons?page=${page}&search=${search}`;
                    
                    const response = await fetch(url);
                    if (!response.ok) throw new Error('Erreur réseau');
                    
                    const result = await response.json();
                    setData({
                        pokemons: result.pokemons || result,
                        totalPages: result.totalPages || 1
                    });

                } else {
                    // CAS 3 : Filtre par type de pokémon
                    const url = `http://localhost:3000/pokemons?limit=1000`; 
                    
                    const response = await fetch(url);
                    if (!response.ok) throw new Error('Erreur réseau');
                    
                    const result = await response.json();
                    let allPokemons = [];
                    if (Array.isArray(result)) allPokemons = result;
                    else if (result.pokemons) allPokemons = result.pokemons;
                    
                    // 1. Filtrage par search
                    let filtered = allPokemons.filter(p => 
                        p.name.french.toLowerCase().includes(search.toLowerCase())
                    );

                    // 2. Filtrage par type
                    if (type && type !== 'All') {
                        filtered = filtered.filter(p => p.type.includes(type));
                    }

                    // 3. Pagination par 20 pokémons maax
                    const itemsPerPage = 20;
                    const totalPagesCalc = Math.ceil(filtered.length / itemsPerPage);
                    
                    // Découpe le tableau pour la page actuelle
                    const start = (page - 1) * itemsPerPage;
                    const end = start + itemsPerPage;
                    const paginatedPokemons = filtered.slice(start, end);

                    setData({ 
                        pokemons: paginatedPokemons, 
                        totalPages: totalPagesCalc || 1 
                    });
                }
            } catch (err) {
                console.error(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();        
    }, [page, search, type]);

    return { ...data, pokemonData, loading, error, addPokemon };
};

export default usePokemon;