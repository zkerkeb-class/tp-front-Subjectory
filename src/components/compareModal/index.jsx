import PokeButton from '../pokeButton';
import PokeStatBar from '../pokeStatBar';
import { getWinner } from '../../utils/compare';
import './index.css';

const CompareModal = ({ pokemon1, pokemon2, onClose }) => {
    // Fonction pour déterminer quelle valeur est la plus forte
    const getStatClass = (stat1, stat2) => {
        const result = getWinner(stat1, stat2);
        if (result === 'p1') return 'winner';
        if (result === 'p2') return 'loser';
        return 'tie';
    };

    const stats = ['HP', 'Attack', 'Defense', 'SpecialAttack', 'SpecialDefense', 'Speed'];

    return (
        <div className="modal-overlay">
            <div className="compare-card-glass">
                <PokeButton variant="ghost" className="close-compare" onClick={onClose}>✕</PokeButton>
                
                <h2 className="vs-title">BATTLE VS</h2>

                <div className="duel-layout">
                    {/* Pokémon 1 */}
                    <div className="duelist">
                        <div className='pokemon-identity'>
                            <img src={pokemon1.image} alt={pokemon1.name.french} className="duel-img" />
                            <h3 className="duel-name">{pokemon1.name.french}</h3>
                        </div>
                    </div>

                    {/* Zone centrale des Stats */}
                    <div className="duel-stats-center">
                        {stats.map(stat => (
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
                            <img src={pokemon2.image} alt={pokemon2.name.french} className="duel-img" />
                            <h3 className="duel-name">{pokemon2.name.french}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompareModal;