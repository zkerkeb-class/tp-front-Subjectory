const InternationalNames = ({ names }) => {
    const languages = [
        { label: 'EN', value: names.english },
        { label: 'JP', value: names.japanese },
        { label: 'CH', value: names.chinese }
    ];

    return (
        <div className="international-names">
            {languages.map((lang) => (
                <div className="name-tag" key={lang.label}>
                    <span className="lang-label">{lang.label}</span>
                    <span className="lang-value">{lang.value}</span>
                </div>
            ))}
        </div>
    );
};

export default InternationalNames;