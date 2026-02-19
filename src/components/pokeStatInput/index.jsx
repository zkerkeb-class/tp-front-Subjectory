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
            style={{ borderColor: `${color}70` }}
        />
    </div>
);

export default PokeStatInput;