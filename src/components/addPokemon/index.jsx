import { useState, useEffect } from 'react';
import usePokemon from '../../hook/usePokemon';
import { TYPE_COLORS, DEFAULT_STATS } from '../../constants/pokemonConstants';
import PokeImage from '../pokeCard/pokeImage';
import PokeStatInput from '../pokeStatInput';
import PokeInputField from '../pokeInputField';
import './index.css';

const AddPokemon = () => {
    const { addPokemon } = usePokemon();
    const [isOpen, setIsOpen] = useState(false);
    const [glowColor, setGlowColor] = useState(TYPE_COLORS['Normal']);

    // Pré-remplissage du formulaire avec des valeurs par défaut
    const [formData, setFormData] = useState({
        name: { french: '' },
        type: ['Normal'],
        base: { ...DEFAULT_STATS },
        image: ''
    });

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
                            <div className="left-column">
                                <div className="image-preview-container">
                                    <div className="preview-glow" style={{background: glowColor}}></div>
                                    {formData.image ? (
                                        <PokeImage
                                            imageUrl={formData.image}
                                            alt="Preview"
                                            className="image-preview"
                                        />
                                    ) : (
                                        <div className="image-placeholder">Pas d'image</div>
                                    )}
                                </div>

                                <PokeInputField 
                                    label="Nom"
                                    placeholder="Nom (ex: ZongoLeDozo)"
                                    value={formData.name.french}
                                    inputClass="modern-input"
                                    onChange={(e) => setFormData({...formData, name: {french: e.target.value}})}
                                />

                                <div className="input-group">
                                    <select 
                                        className="modern-select"
                                        value={formData.type[0]} 
                                        onChange={(e) => setFormData({...formData, type: [e.target.value]})}
                                        style={{color: glowColor, borderColor: glowColor}}
                                    >
                                        {/* Pour chaque type sélectionné, applique la bonne couleur */}
                                        {Object.keys(TYPE_COLORS).map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                    <label className="input-label">Type Principal</label>
                                </div>

                                <PokeInputField 
                                    label="URL Image"
                                    placeholder="https://chargercharger/..."
                                    value={formData.image}
                                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                                />
                            </div>

                            <div className="right-column">
                                <h3 className="stats-title">Statistiques de base</h3>
                                <div className="stats-grid-modern">
                                    {Object.keys(formData.base).map(stat => (
                                        <PokeStatInput 
                                            key={stat}
                                            label={stat}
                                            value={formData.base[stat]}
                                            color={glowColor}
                                            className="stat-box"
                                            inputClassName="stat-input-modern"
                                            onChange={(newValue) => handleStatChange(stat, newValue)}
                                        />
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