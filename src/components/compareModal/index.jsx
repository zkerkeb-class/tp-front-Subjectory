import PokeButton from '../pokeButton';
import PokeStatBar from '../pokeStatBar';
import { getWinner } from '../../utils/compare';
import PokeTitle from '../pokeCard/pokeTitle';
import PokeImage from '../pokeCard/pokeImage';
import { STAT_ORDER } from '../../constants/pokemonConstants';
import './index.css';

const CompareModal = ({ pokemon1, pokemon2, onClose }) => {
    const getStatClass = (stat1, stat2) => {
        const result = getWinner(stat1, stat2);
        if (result === 'p1') return 'winner';
        if (result === 'p2') return 'loser';
        return 'tie';
    };
    
    return (
        <div className="modal-overlay">
            <div className="compare-card-glass">
                <PokeButton variant="ghost" className="close-compare" onClick={onClose}>✕</PokeButton>
                
                <h2 className="vs-title">BATTLE VS</h2>

                <div className="duel-layout">
                    {/* Pokémon 1 */}
                    <div className="duelist">
                        <div className='pokemon-identity'>
                            <PokeImage 
                                imageUrl={pokemon1.image} 
                                alt={pokemon1.name.french} 
                                className="duel-img" 
                            />
                            <PokeTitle 
                                name={pokemon1.name} 
                                className="duel-name" 
                            />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="duel-stats-center">
                        {STAT_ORDER.map(stat => (
                            <div key={stat} className="stat-duel-row">
                                <span className={`stat-val p1 ${getStatClass(pokemon1.base[stat], pokemon2.base[stat])}`}>
                                    {pokemon1.base[stat]}
                                </span>
                                <span className="stat-duel-label">{stat}</span>
                                <span className={`stat-val p2 ${getStatClass(pokemon2.base[stat], pokemon1.base[stat])}`}>
                                    {pokemon2.base[stat]}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Pokémon 2 */}
                    <div className="duelist">
                        <div className='pokemon-identity'>
                            <PokeImage 
                                imageUrl={pokemon2.image} 
                                alt={pokemon2.name.french} 
                                className="duel-img" 
                            />
                            <PokeTitle 
                                name={pokemon2.name} 
                                className="duel-name" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompareModal;