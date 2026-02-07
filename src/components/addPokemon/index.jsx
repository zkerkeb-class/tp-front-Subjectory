import { useState, useEffect } from 'react';
import usePokemon from '../../hook/usePokemon';
import './index.css';

// On reprend les couleurs du style "Details" pour la cohérence
const TYPE_COLORS = {
    Normal: '#A8A878', Fire: '#F08030', Water: '#6890F0', Grass: '#78C850',
    Electric: '#F8D030', Ice: '#98D8D8', Fighting: '#C03028', Poison: '#A040A0',
    Ground: '#E0C068', Flying: '#A890F0', Psychic: '#F85888', Bug: '#A8B820',
    Rock: '#B8A038', Ghost: '#705898', Dragon: '#7038F8', Steel: '#B8B8D0', Fairy: '#EE99AC'
};

const AddPokemon = () => {
    const { addPokemon } = usePokemon();
    const [isOpen, setIsOpen] = useState(false);
    const [glowColor, setGlowColor] = useState(TYPE_COLORS['Normal']);
    const [formData, setFormData] = useState({
        name: { french: '' },
        type: ['Normal'],
        base: { HP: 50, Attack: 50, Defense: 50, "Special Attack": 50, "Special Defense": 50, Speed: 50 },
        image: ''
    });

    // Met à jour la couleur de l'aura quand le type change
    useEffect(() => {
        const mainType = formData.type[0];
        setGlowColor(TYPE_COLORS[mainType] || '#fff');
    }, [formData.type]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            image: formData.image.trim() === '' ? null : formData.image
        };
        const result = await addPokemon(payload);
        if (result) {
            setIsOpen(false);
            window.location.reload();
        } else {
            alert("Erreur lors de la création");
        }
    };

    const handleStatChange = (statName, value) => {
        setFormData({
            ...formData,
            base: { ...formData.base, [statName]: parseInt(value) || 0 }
        });
    };

    return (
        <>
        <div className="add-btn-container">
            <button className="main-add-btn" onClick={() => setIsOpen(true)}>
                <span className="plus-icon">+</span> Ajouter un Pokémon
            </button>
        </div>

            {isOpen && (
                <div className="modal-overlay">
                    <div className="modal-aura" style={{ background: glowColor }}></div>
                    <form className="glass-form-card" onSubmit={handleSubmit} style={{'--active-color': glowColor}}>
                        <h2 className="form-title">Création de Pokémon</h2>
                        
                        <div className="form-layout">
                            {/* COLONNE GAUCHE : Info & Image */}
                            <div className="left-column">
                                <div className="image-preview-container">
                                    <div className="preview-glow" style={{background: glowColor}}></div>
                                    {formData.image ? (
                                        <img src={formData.image} alt="Prévisualisation" className="image-preview" onError={(e) => e.target.style.display='none'} />
                                    ) : (
                                        <div className="image-placeholder">Pas d'image</div>
                                    )}
                                </div>

                                <div className="input-group">
                                    <input 
                                        className="modern-input"
                                        type="text"
                                        placeholder="Nom (ex: Mewthree)" 
                                        value={formData.name.french}
                                        onChange={(e) => setFormData({...formData, name: {french: e.target.value}})}
                                        required 
                                    />
                                    <label className="input-label">Nom</label>
                                </div>

                                <div className="input-group">
                                    <select 
                                        className="modern-select"
                                        value={formData.type[0]} 
                                        onChange={(e) => setFormData({...formData, type: [e.target.value]})}
                                        style={{color: glowColor, borderColor: glowColor}}
                                    >
                                        {Object.keys(TYPE_COLORS).map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                    <label className="input-label">Type Principal</label>
                                </div>

                                <div className="input-group">
                                    <input 
                                        className="modern-input"
                                        type="text"
                                        placeholder="https://lien-image.com/..." 
                                        value={formData.image}
                                        onChange={(e) => setFormData({...formData, image: e.target.value})}
                                    />
                                    <label className="input-label">URL Image</label>
                                </div>
                            </div>

                            {/* COLONNE DROITE : Stats */}
                            <div className="right-column">
                                <h3 className="stats-title">Statistiques de base</h3>
                                <div className="stats-grid-modern">
                                    {Object.keys(formData.base).map(stat => (
                                        <div key={stat} className="stat-box">
                                            <label>{stat}</label>
                                            <input 
                                                type="number" 
                                                min="1" max="255"
                                                className="stat-input-modern"
                                                value={formData.base[stat]}
                                                onChange={(e) => handleStatChange(stat, e.target.value)}
                                                style={{borderColor: glowColor}}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="form-actions-modern">
                            <button type="button" className="cancel-btn-modern" onClick={() => setIsOpen(false)}>Annuler</button>
                            <button type="submit" className="save-btn-modern" style={{background: glowColor}}>Créer le Pokémon</button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default AddPokemon;