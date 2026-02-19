import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import usePokemon from '../hook/usePokemon';
import PokeTypeBadge from '../components/pokeCard/pokeTypeBadge';
import PokeTitle from '../components/pokeCard/pokeTitle';
import PokeImage from '../components/pokeCard/pokeImage';
import PokeStatBar from '../components/pokeStatBar';
import PokeIdBadge from '../components/pokeIdBadge';
import PokeStatInput from '../components/pokeStatInput';
import InternationalNames from '../components/internationalNames';
import PokeInputField from '../components/PokeInputField';
import { getEffectiveness } from '../utils/typeChart';
import { TYPE_COLORS, MAX_STATS_GEN1 } from '../constants/pokemonConstants';
import './pokemonDetails.css';

const PokemonDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { pokemonData, loading, error } = usePokemon(id);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const effectiveness = pokemonData ? getEffectiveness(pokemonData.type) : null;
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

    const mainType = pokemonData.type[0]
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
                <span>←</span> Retour au Pokédex
            </button>

            <div className="glass-container">
                <div className="pokemon-header">
                    <div className="image-section">
                        <div className="glow-circle"></div>
                        <PokeImage 
                            imageUrl={pokemonData.image} 
                            alt={pokemonData.name.french} 
                            className="main-img" 
                        />
                    </div>

                    <div className="info-section">
                        <PokeIdBadge 
                            id={pokemonData.id} 
                            color={themeColor} 
                            className="id-badge" 
                            prefix="N°" 
                        />
                        {editMode ? (
                            <PokeInputField 
                                value={form.name.french} 
                                containerClass="edit-main-info"
                                inputClass="edit-name-input"
                                onChange={(e) => setForm({...form, name: {...form.name, french: e.target.value}})}
                            />
                        ) : (
                            <>
                                <PokeTitle 
                                    name={pokemonData.name} 
                                    className="poke-name" 
                                />
                                
                                {/* Noms du poké dans d'autres langues */}
                                <InternationalNames names={pokemonData.name} />
                            </>
                        )}
                        <div className="types-row">
                            {pokemonData.type.map((t) => (
                                <PokeTypeBadge key={t} type={t} color={TYPE_COLORS[t]} size="large" />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="stats-section">
                <h3 className="section-title">Base Stats</h3>
                <div className="stats-grid">
                    {Object.entries(form.base).map(([key, value]) => (
                        <div key={key}>
                            {editMode ? (
                                <div className="stat-row">
                                    <PokeStatInput 
                                        label={key}
                                        value={value}
                                        color={themeColor}
                                        className="stat-row"
                                        inputClassName="stat-input-modern"
                                        onChange={(newValue) => setForm({
                                            ...form, 
                                            base: { ...form.base, [key]: newValue }
                                        })}
                                    />
                                </div>
                            ) : (
                                <PokeStatBar 
                                    label={key}
                                    value={value}
                                    maxVal={MAX_STATS_GEN1[key]}
                                    color={themeColor}
                                    className="stat-row"
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>
                {effectiveness && (
                    <div className="effectiveness-section">
                        <h3 className="section-title">Faiblesses Élémentaires</h3>
                        <div className="weakness-grid">
                            {Object.entries(effectiveness)
                                .filter(([_, multiplier]) => multiplier > 1) 
                                .sort((a, b) => b[1] - a[1])
                                .map(([type, multiplier]) => (
                                    <div key={type} className="weakness-card">
                                        <PokeTypeBadge 
                                            type={type} 
                                            color={TYPE_COLORS[type]} 
                                            className="type-badge-detail" 
                                        />
                                        <span className={`multiplier x${multiplier.toString().replace('.', '')}`}>
                                            x{multiplier}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
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