import PokeButton from '../pokeButton';
import './index.css';

const CompareBar = ({ selectedPokemon, onRemove, onCompare, onClear }) => {
    if (selectedPokemon.length === 0) return null;

    return (
        <div className="compare-bar-floating">
            <div className="compare-bar-content">
                <div className="selected-slots">
                    {selectedPokemon.map(pokemon => (
                        <div key={pokemon.id} className="mini-slot">
                            <img src={pokemon.image} alt={pokemon.name.french} />
                            <button className="remove-mini" onClick={() => onRemove(pokemon)}>✕</button>
                        </div>
                    ))}
                    {selectedPokemon.length < 2 && (
                        <div className="empty-slot">Choisir un autre...</div>
                    )}
                </div>

                <div className="compare-actions">
                    <PokeButton 
                        variant="primary" 
                        disabled={selectedPokemon.length < 2}
                        onClick={onCompare}
                    >
                        ⚔️ Comparer
                    </PokeButton>
                    <PokeButton variant="ghost" onClick={onClear}>Vider</PokeButton>
                </div>
            </div>
        </div>
    );
};

export default CompareBar;