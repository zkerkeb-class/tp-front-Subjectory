import { useNavigate } from 'react-router';
import useFavorites from '../../hook/useFavorites';
import PokeImage from './pokeImage';
import PokeTitle from './pokeTitle';
import PokeTypeBadge from './pokeTypeBadge';
import PokeStatBar from '../pokeStatBar';
import PokeIdBadge from '../pokeIdBadge';
import { TYPE_COLORS, STAT_ORDER, STAT_LABELS, MAX_STATS_GEN1 } from '../../constants/pokemonConstants';
import './index.css';

const PokeCard = ({ pokemon }) => {
    const navigate = useNavigate();
    const { isFavorite, toggleFavorite } = useFavorites();
    const isFav = isFavorite(pokemon.id);
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

            {/* Bouton favori */}
            <button 
                className={`fav-btn ${isFav ? 'active' : ''}`}
                onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(pokemon.id);
                }}
            >
                {isFav ? '⭐' : '☆'}
            </button>
            
            <div className="card-header">
                <PokeIdBadge id={pokemon.id} color={color} className="card-id" />
            </div>

            <div className="card-image-container">
                <div className="img-aura"></div>
                <PokeImage imageUrl={pokemon.image} alt={pokemon.name.french} />
            </div>

            <div className="card-info">
                <PokeTitle name={pokemon.name} />
                
                <div className="types-badges-row">
                    {pokemon.type.map((t) => (
                        <PokeTypeBadge 
                            key={t} 
                            type={t} 
                            color={TYPE_COLORS[t]} 
                        />
                    ))}
                </div>
            </div>

            <div className="card-stats-grid">
                {STAT_ORDER.map((statKey) => (
                    <PokeStatBar 
                        key={statKey}
                        label={STAT_LABELS[statKey] || statKey}
                        value={getStatValue(statKey)}
                        maxVal={MAX_STATS_GEN1[statKey]}
                        color={color}
                    />
                ))}
            </div>
        </div>
    );
};

export default PokeCard;