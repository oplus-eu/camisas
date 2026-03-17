import { ArrowLeft } from 'lucide-react';

export default function SizeGuide({ onBack, t, language }) {
    const sizingData = {
        men: [
            { size: 'S=P', length: '69-71', width: '53-55', height: '162-170' },
            { size: 'M=M', length: '71-73', width: '55-57', height: '170-176' },
            { size: 'L=G', length: '73-75', width: '57-58', height: '176-182' },
            { size: 'XL=GG', length: '75-78', width: '58-60', height: '182-190' },
            { size: 'XXL=XG', length: '78-81', width: '60-62', height: '190-195' },
            { size: 'XXXL=2XG', length: '81-83', width: '62-64', height: '192-197' },
        ],
        women: [
            { size: 'S=P', length: '61-63', width: '40-41', height: '150-160' },
            { size: 'M=M', length: '63-66', width: '41-44', height: '160-165' },
            { size: 'L=G', length: '66-69', width: '44-47', height: '165-170' },
            { size: 'XL=GG', length: '69-71', width: '47-50', height: '170-175' },
        ],
        kids: [
            { size: '16', length: '44', width: '35', height: '95-105' },
            { size: '18', length: '47', width: '37', height: '105-115' },
            { size: '20', length: '50', width: '39', height: '115-125' },
            { size: '22', length: '53', width: '41', height: '125-135' },
            { size: '24', length: '56', width: '43', height: '135-145' },
            { size: '26', length: '59', width: '45', height: '145-155' },
            { size: '28', length: '62', width: '47', height: '155-165' },
        ]
    };

    const tableHeaderStyle = {
        textAlign: 'left',
        padding: 'var(--space-4)',
        borderBottom: '2px solid var(--color-primary)',
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: 'var(--color-text-secondary)'
    };

    const tableCellStyle = {
        padding: 'var(--space-4)',
        borderBottom: '1px solid var(--color-border)',
        fontSize: '0.875rem'
    };

    const sectionHeaderStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-bg-base)',
        padding: 'var(--space-2) var(--space-4)',
        fontSize: '0.875rem',
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 'var(--space-4)',
        borderRadius: '2px 10px 0 0'
    };

    return (
        <div style={{ 
            backgroundColor: 'var(--color-bg-base)', 
            minHeight: '100vh', 
            padding: '140px 0 var(--space-16) 0' // Increased top padding for fixed header
        }}>
            <div className="container" style={{ maxWidth: '800px' }}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--color-text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        cursor: 'pointer',
                        marginBottom: 'var(--space-12)',
                        textTransform: 'uppercase',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        letterSpacing: '0.05em'
                    }}
                >
                    <ArrowLeft size={20} />
                    {language === 'en' ? 'Back to Shop' : 'Voltar para Loja'}
                </button>

                <h1 style={{
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    fontWeight: '300',
                    textTransform: 'uppercase',
                    marginBottom: 'var(--space-2)',
                    letterSpacing: '0.1em'
                }}>
                    {language === 'en' ? 'Sizing Guide' : 'Guia de Tamanhos'}
                </h1>
                <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '1.25rem',
                    marginBottom: 'var(--space-16)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em'
                }}>
                    SELEÇÃO SIZING / TAMANHOS
                </p>

                {/* MEN'S */}
                <div style={{ marginBottom: 'var(--space-16)', border: '1px solid var(--color-border)', padding: 'var(--space-4)', borderRadius: '4px' }}>
                    <div style={sectionHeaderStyle}>
                        <span>{language === 'en' ? "MEN'S SIZING" : "TAMANHOS MASCULINOS"}</span>
                        <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{language === 'en' ? 'Masculino' : 'Men\'s'}</span>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={tableHeaderStyle}>{language === 'en' ? 'SIZE' : 'TAMANHO'}</th>
                                <th style={tableHeaderStyle}>{language === 'en' ? 'LENGTH (cm)' : 'COMPRIMENTO (cm)'}</th>
                                <th style={tableHeaderStyle}>{language === 'en' ? 'WIDTH (cm)' : 'LARGURA (cm)'}</th>
                                <th style={tableHeaderStyle}>{language === 'en' ? 'HEIGHT (cm)' : 'ALTURA (cm)'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sizingData.men.map((row, idx) => (
                                <tr key={idx}>
                                    <td style={{ ...tableCellStyle, fontWeight: '700' }}>{row.size}</td>
                                    <td style={tableCellStyle}>{row.length}</td>
                                    <td style={tableCellStyle}>{row.width}</td>
                                    <td style={tableCellStyle}>{row.height}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* WOMEN'S */}
                <div style={{ marginBottom: 'var(--space-16)', border: '1px solid var(--color-border)', padding: 'var(--space-4)', borderRadius: '4px' }}>
                    <div style={sectionHeaderStyle}>
                        <span>{language === 'en' ? "WOMEN'S SIZING" : "TAMANHOS FEMININOS"}</span>
                        <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{language === 'en' ? 'Feminino' : 'Women\'s'}</span>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={tableHeaderStyle}>{language === 'en' ? 'SIZE' : 'TAMANHO'}</th>
                                <th style={tableHeaderStyle}>{language === 'en' ? 'LENGTH (cm)' : 'COMPRIMENTO (cm)'}</th>
                                <th style={tableHeaderStyle}>{language === 'en' ? 'WIDTH (cm)' : 'LARGURA (cm)'}</th>
                                <th style={tableHeaderStyle}>{language === 'en' ? 'HEIGHT (cm)' : 'ALTURA (cm)'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sizingData.women.map((row, idx) => (
                                <tr key={idx}>
                                    <td style={{ ...tableCellStyle, fontWeight: '700' }}>{row.size}</td>
                                    <td style={tableCellStyle}>{row.length}</td>
                                    <td style={tableCellStyle}>{row.width}</td>
                                    <td style={tableCellStyle}>{row.height}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* KIDS' */}
                <div style={{ marginBottom: 'var(--space-16)', border: '1px solid var(--color-border)', padding: 'var(--space-4)', borderRadius: '4px' }}>
                    <div style={sectionHeaderStyle}>
                        <span>{language === 'en' ? "KIDS' SIZING" : "TAMANHOS INFANTIS"}</span>
                        <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{language === 'en' ? 'Infantil' : 'Kids'}</span>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={tableHeaderStyle}>{language === 'en' ? 'SIZE' : 'TAMANHO'}</th>
                                <th style={tableHeaderStyle}>{language === 'en' ? 'LENGTH (cm)' : 'COMPRIMENTO (cm)'}</th>
                                <th style={tableHeaderStyle}>{language === 'en' ? 'WIDTH (cm)' : 'LARGURA (cm)'}</th>
                                <th style={tableHeaderStyle}>{language === 'en' ? 'HEIGHT (cm)' : 'ALTURA (cm)'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sizingData.kids.map((row, idx) => (
                                <tr key={idx}>
                                    <td style={{ ...tableCellStyle, fontWeight: '700' }}>{row.size}</td>
                                    <td style={tableCellStyle}>{row.length}</td>
                                    <td style={tableCellStyle}>{row.width}</td>
                                    <td style={tableCellStyle}>{row.height}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
