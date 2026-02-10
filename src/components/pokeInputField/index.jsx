const PokeInputField = ({ 
    label, 
    type = "text", 
    value, 
    onChange, 
    placeholder, 
    containerClass = "input-group", 
    inputClass = "modern-input" 
}) => (
    <div className={containerClass}>
        <input 
            className={inputClass}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required 
        />
        <label className="input-label">{label}</label>
    </div>
);

export default PokeInputField;