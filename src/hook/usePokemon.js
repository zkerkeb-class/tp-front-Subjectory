import { useState, useEffect } from 'react';

const usePokemon = (page = 1, search = '', type = 'All') => {
    const [data, setData] = useState({ pokemons: [], totalPages: 0, total: 0 });
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
                const isSingle = window.location.pathname.includes('pokemon');

                if (isSingle) {
                    const response = await fetch(`http://localhost:3000/pokemons/${page}`);
                    if (!response.ok) throw new Error('Erreur réseau');
                    const result = await response.json();
                    setPokemonData(result);

                } else if (type === 'All') {
                    const url = `http://localhost:3000/pokemons?page=${page}&search=${search}`;
                    const response = await fetch(url);
                    if (!response.ok) throw new Error('Erreur réseau');
                    const result = await response.json();
                    
                    setData({
                        pokemons: result.pokemons || [],
                        totalPages: result.totalPages || 1,
                        total: result.total || 0
                    });

                } else {
                    const url = `http://localhost:3000/pokemons?limit=1000`; 
                    const response = await fetch(url);
                    if (!response.ok) throw new Error('Erreur réseau');
                    const result = await response.json();
                    
                    let allPokemons = result.pokemons || result;
                    
                    let filtered = allPokemons.filter(p => 
                        p.name.french.toLowerCase().includes(search.toLowerCase())
                    );

                    if (type && type !== 'All') {
                        filtered = filtered.filter(p => p.type.includes(type));
                    }

                    const itemsPerPage = 20;
                    const totalPagesCalc = Math.ceil(filtered.length / itemsPerPage);
                    const start = (page - 1) * itemsPerPage;
                    const paginatedPokemons = filtered.slice(start, start + itemsPerPage);

                    // Mise à jour de data avec le total calculé localement pour le type
                    setData({ 
                        pokemons: paginatedPokemons, 
                        totalPages: totalPagesCalc || 1,
                        total: filtered.length // Nombre total après filtrage par type
                    });
                }
            } catch (err) {
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