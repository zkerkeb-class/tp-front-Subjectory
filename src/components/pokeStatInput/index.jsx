const PokeStatInput = ({ 
    label, 
    value, 
    onChange, 
    color, 
    className,
    inputClassName
}) => (
    <div className={className}>
        <label className="stat-label">{label}</label>
        <input 
            type="number" 
            min="1" max="255"
            className={inputClassName}
            value={value} 
            onChange={(e) => onChange(parseInt(e.target.value) || 0)}
            style={{ borderColor: color }}
        />
    </div>
);

export default PokeStatInput;