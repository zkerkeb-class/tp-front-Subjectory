import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import usePokemon from '../hook/usePokemon';
import './pokemonDetails.css';

const TYPE_COLORS = {
    grass: '#78C850', fire: '#F08030', water: '#6890F0', bug: '#A8B820',
    normal: '#A8A878', poison: '#A040A0', electric: '#F8D030', ground: '#E0C068',
    fairy: '#EE99AC', fighting: '#C03028', psychic: '#F85888', rock: '#B8A038',
    ghost: '#705898', ice: '#98D8D8', dragon: '#7038F8', dark: '#705848',
    steel: '#B8B8D0', flying: '#A890F0'
};

const PokemonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { pokemonData, loading, error } = usePokemon(id);
    
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (pokemonData) setForm(JSON.parse(JSON.stringify(pokemonData)));
    }, [pokemonData]);

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:3000/pokemons/update/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (response.ok) {
                setEditMode(false);
                window.location.reload();
            }
        } catch (err) { console.error("Erreur update", err); }
    };

    if (loading) return <div className="loader-container"><div className="loader"></div></div>;
    if (error || !pokemonData || !form) return (
        <div className="error-page">
            <div className="error-card">
                <div className="error-icon">👻</div>
                <h1 className="error-title">404</h1>
                <h2 className="error-subtitle">Pokémon Introuvable</h2>
                <p className="error-desc">
                    Il semble que ce Pokémon se cache bien, ou qu'il n'existe pas encore dans notre base de données.
                </p>
                <button className="btn-home" onClick={() => navigate('/')}>
                    Retour au Pokédex
                </button>
            </div>
        </div>
    );

    const mainType = pokemonData.type[0].toLowerCase();
    const themeColor = TYPE_COLORS[mainType] || '#777';

    return (
        <div 
            className="details-page" 
            style={{ 
                '--type-color': themeColor,
                '--type-color-glow': `${themeColor}44` 
            }}
        >
            <button className="back-btn" onClick={() => navigate(-1)}>
                <span className="icon">←</span> Retour au Pokédex
            </button>

            <div className="glass-container">
                <div className="pokemon-header">
                    <div className="image-section">
                        <div className="glow-circle"></div>
                        <img src={pokemonData.image} alt={pokemonData.name.french} className="main-img" />
                    </div>

                    <div className="info-section">
                        <div className="id-badge">N°{pokemonData.id.toString().padStart(3, '0')}</div>
                        
                        {/* SECTION NOM : 
                            Affichage d'un input uniquement pour le nom en mode édition 
                        */}
                        {editMode ? (
                            <div className="edit-main-info">
                                <label className="edit-label">Nom du Pokémon</label>
                                <input 
                                    className="edit-name-input"
                                    type="text" 
                                    value={form.name.french} 
                                    onChange={(e) => setForm({...form, name: {...form.name, french: e.target.value}})}
                                />
                            </div>
                        ) : (
                            <h1 className="poke-name">{pokemonData.name.french}</h1>
                        )}

                        {/* SECTION TYPES : 
                            Toujours affichée de la même manière, pas d'input ici 
                        */}
                        <div className="types-row">
                            {pokemonData.type.map(t => (
                                <span key={t} className={`type-tag ${t.toLowerCase()}`}>{t}</span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="stats-section">
                    <h3 className="section-title">Base Stats</h3>
                    <div className="stats-grid">
                        {Object.entries(form.base).map(([key, value]) => (
                            <div key={key} className="stat-row">
                                <span className="stat-label">{key}</span>
                                {editMode ? (
                                    <input 
                                        type="number" 
                                        className="stat-input-field"
                                        value={value} 
                                        onChange={(e) => setForm({
                                            ...form, 
                                            base: {...form.base, [key]: parseInt(e.target.value) || 0}
                                        })}
                                    />
                                ) : (
                                    <div className="stat-bar-wrapper">
                                        <span className="stat-num">{value}</span>
                                        <div className="stat-bar-bg">
                                            <div 
                                                className="stat-bar-fill" 
                                                style={{ width: `${Math.min((value / 200) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="footer-controls">
                    {editMode ? (
                        <div className="btn-group">
                            <button className="btn save-btn" onClick={handleUpdate}>Confirmer les modifications</button>
                            <button className="btn cancel-btn" onClick={() => setEditMode(false)}>Abandonner</button>
                        </div>
                    ) : (
                        <div className="btn-group">
                            <button className="btn edit-btn" onClick={() => setEditMode(true)}>Éditer les données</button>
                            <button className="btn delete-btn" onClick={() => setShowModal(true)}>Libérer le Pokémon</button>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="danger-modal-card">
                        <span className="warning-icon">⚠️</span>
                        
                        <h3 className="danger-title">
                            Libérer {pokemonData.name.french} ?
                        </h3>
                        
                        <p className="danger-desc">
                            Cette action est <strong>irréversible</strong>. <br/>
                            Le Pokémon retournera définitivement dans la nature.
                        </p>
                        
                        <div className="modal-actions">
                            <button 
                                className="btn-confirm-delete" 
                                onClick={async () => {
                                    await fetch(`http://localhost:3000/pokemons/${id}`, { method: 'DELETE' });
                                    navigate('/');
                                }}
                            >
                                Confirmer la libération
                            </button>
                            
                            <button 
                                className="btn-cancel-delete" 
                                onClick={() => setShowModal(false)}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PokemonDetails;