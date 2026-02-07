import { useNavigate } from 'react-router';
import './index.css';

const TYPE_COLORS = {
    Normal: '#A8A878', Fire: '#F08030', Water: '#6890F0', Grass: '#78C850',
    Electric: '#F8D030', Ice: '#98D8D8', Fighting: '#C03028', Poison: '#A040A0',
    Ground: '#E0C068', Flying: '#A890F0', Psychic: '#F85888', Bug: '#A8B820',
    Rock: '#B8A038', Ghost: '#705898', Dragon: '#7038F8', Steel: '#B8B8D0', Fairy: '#EE99AC'
};

const STAT_LABELS = {
    HP: 'HP', Attack: 'ATK', Defense: 'DEF',
    "Special Attack": 'SPA', SpecialAttack: 'SPA',
    "Special Defense": 'SPD', SpecialDefense: 'SPD', Speed: 'SPE'
};

const STAT_ORDER = ['HP', 'Attack', 'Defense', 'SpecialAttack', 'SpecialDefense', 'Speed'];

const PokeCard = ({ pokemon }) => {
    const navigate = useNavigate();
    const mainType = pokemon.type[0];
    const color = TYPE_COLORS[mainType] || '#A8A878';

    const getStatValue = (key) => {
        return pokemon.base[key] || pokemon.base[key.replace("Special", "Special ")] || 0;
    };

    return (
        <div 
            className="poke-card-modern" 
            onClick={() => navigate(`/pokemon/${pokemon.id}`)}
            style={{ '--card-color': color }}
        >
            <div className="card-glow"></div>
            
            <div className="card-header">
                <span className="card-id">#{pokemon.id.toString().padStart(3, '0')}</span>
                <div className="card-types">
                    {pokemon.type.map(t => (
                        <span key={t} className="mini-type-dot" title={t} style={{background: TYPE_COLORS[t]}}></span>
                    ))}
                </div>
            </div>

            <div className="card-image-container">
                <div className="img-aura"></div>
                <img src={pokemon.image} alt={pokemon.name.french} className="card-img" loading="lazy" />
            </div>

            <div className="card-info">
                <h3 className="card-name">{pokemon.name.french}</h3>
                <span className="card-main-type" style={{color: color}}>{mainType}</span>
            </div>

            {/* GRILLE DES STATS */}
            <div className="card-stats-grid">
                {STAT_ORDER.map((statKey) => {
                    const value = getStatValue(statKey);
                    // Plafond à 100% pour éviter le débordement
                    const percent = Math.min((value / 150) * 100, 100); 
                    
                    return (
                        <div key={statKey} className="stat-item">
                            {/* LIGNE 1 : TEXTE */}
                            <div className="stat-header-row">
                                <span className="stat-label">{STAT_LABELS[statKey] || statKey}</span>
                                <span className="stat-value">{value}</span>
                            </div>

                            {/* LIGNE 2 : BARRE (C'est ici que ça doit s'afficher) */}
                            <div className="stat-bar-container">
                                <div 
                                    className="stat-bar-fill" 
                                    style={{width: `${percent}%`, backgroundColor: color}}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PokeCard;