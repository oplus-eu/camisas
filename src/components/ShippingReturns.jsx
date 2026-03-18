import { ArrowLeft, Package, Clock, Factory, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

const content = {
  en: {
    title: 'Shipping',
    titleAccent: '& Returns',
    back: 'Back to Shop',
    factoryTitle: 'Direct from the Factory',
    factoryText:
      'Every Seleção jersey ships directly from our manufacturing partner — no warehouses, no middlemen. This is how we keep our prices significantly lower than retail while maintaining the same premium quality.',
    timeTitle: 'Delivery Times',
    timeText:
      'Because we ship direct from the source, orders typically take between 10 and 22 business days to arrive, depending on your location. Customs processing may occasionally add a few extra days.',
    timeNote: 'You will receive a tracking number by email once your order has been dispatched.',
    whyTitle: 'Why does it take longer?',
    whyText:
      'Standard retailers stock items in local warehouses and ship within days — but that comes at a cost passed on to the customer. By cutting out intermediaries and shipping directly from production, we offer you the same jerseys at a fraction of the price. The trade-off is a slightly longer wait, and we believe it\'s worth it.',
    returnsTitle: 'Returns & Exchanges',
    returnsText:
      'We accept return requests within 14 days of delivery. Items must be unworn, unwashed, and in their original condition with tags attached. Because items are shipped internationally, return shipping costs are the responsibility of the customer.',
    returnsStep1: 'Email us at leumas.ejnaro@gmail.com with your order ID and reason for return.',
    returnsStep2: 'We\'ll review your request and confirm eligibility within 2 business days.',
    returnsStep3: 'Ship the item back and send us the tracking number.',
    returnsStep4: 'Refund or exchange is processed within 5 business days of receiving the item.',
    qualityTitle: 'Quality Guarantee',
    qualityText:
      'All our jerseys are inspected before dispatch. If you receive a defective or incorrect item, we will cover all return shipping costs and send a replacement at no extra charge.',
  },
  pt: {
    title: 'Envio',
    titleAccent: 'e Devoluções',
    back: 'Voltar à Loja',
    factoryTitle: 'Direto da Fábrica',
    factoryText:
      'Cada camisa da Seleção é enviada diretamente do nosso parceiro de fabricação — sem armazéns, sem intermediários. É assim que conseguimos manter nossos preços muito abaixo do varejo, mantendo a mesma qualidade premium.',
    timeTitle: 'Prazos de Entrega',
    timeText:
      'Como enviamos diretamente da origem, os pedidos geralmente levam entre 10 e 22 dias úteis para chegar, dependendo da sua localização. O desembaraço aduaneiro pode ocasionalmente adicionar alguns dias extras.',
    timeNote: 'Você receberá um número de rastreamento por e-mail assim que seu pedido for despachado.',
    whyTitle: 'Por que demora mais?',
    whyText:
      'Os varejistas convencionais estocam produtos em armazéns locais e enviam em dias — mas isso tem um custo repassado ao cliente. Ao eliminar intermediários e enviar diretamente da produção, oferecemos as mesmas camisas por uma fração do preço. A troca é uma espera um pouco mais longa, e acreditamos que vale a pena.',
    returnsTitle: 'Devoluções e Trocas',
    returnsText:
      'Aceitamos solicitações de devolução dentro de 14 dias após a entrega. Os itens devem estar sem uso, sem lavagem e em condição original com etiquetas. Como os itens são enviados internacionalmente, os custos de devolução são de responsabilidade do cliente.',
    returnsStep1: 'Envie um e-mail para leumas.ejnaro@gmail.com com seu ID de pedido e motivo da devolução.',
    returnsStep2: 'Analisaremos sua solicitação e confirmaremos a elegibilidade em até 2 dias úteis.',
    returnsStep3: 'Envie o item de volta e nos informe o número de rastreamento.',
    returnsStep4: 'O reembolso ou troca é processado em até 5 dias úteis após o recebimento do item.',
    qualityTitle: 'Garantia de Qualidade',
    qualityText:
      'Todas as nossas camisas são inspecionadas antes do envio. Se você receber um item com defeito ou incorreto, cobriremos todos os custos de devolução e enviaremos uma reposição sem custo adicional.',
  },
};

export default function ShippingReturns({ onBack, language = 'en' }) {
  const c = content[language] || content.en;

  const sectionStyle = {
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid var(--color-border)',
    borderRadius: '4px',
    padding: 'var(--space-8)',
    marginBottom: 'var(--space-6)',
  };

  const iconWrap = {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--space-3)',
    marginBottom: 'var(--space-4)',
  };

  const h3Style = {
    fontSize: '1rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--color-text-primary)',
    margin: 0,
  };

  const pStyle = {
    fontSize: '0.9rem',
    lineHeight: 1.75,
    color: 'var(--color-text-secondary)',
    margin: 0,
  };

  return (
    <div style={{ backgroundColor: 'var(--color-bg-base)', minHeight: '100vh', paddingTop: '120px', paddingBottom: 'var(--space-16)' }}>
      <div className="container" style={{ maxWidth: '760px' }}>

        {/* Back Button */}
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            cursor: 'pointer',
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: '600',
            marginBottom: 'var(--space-12)',
            padding: 0,
          }}
        >
          <ArrowLeft size={16} />
          {c.back}
        </button>

        {/* Page Title */}
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: '300',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: 'var(--space-12)',
          lineHeight: 1.1,
        }}>
          {c.title} <span style={{ color: 'var(--color-primary)', fontWeight: '700' }}>{c.titleAccent}</span>
        </h1>

        {/* Factory Direct */}
        <div style={sectionStyle}>
          <div style={iconWrap}>
            <Factory size={20} color="var(--color-primary)" />
            <h3 style={h3Style}>{c.factoryTitle}</h3>
          </div>
          <p style={pStyle}>{c.factoryText}</p>
        </div>

        {/* Delivery Times */}
        <div style={sectionStyle}>
          <div style={iconWrap}>
            <Clock size={20} color="var(--color-primary)" />
            <h3 style={h3Style}>{c.timeTitle}</h3>
          </div>

          {/* Visual timeline */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 0,
            marginBottom: 'var(--space-6)',
            overflowX: 'auto',
          }}>
            {['Order Placed', '10 Days', '22 Days', 'Delivered'].map((label, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < 3 ? 1 : 'none' }}>
                <div style={{ textAlign: 'center', minWidth: '80px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: i === 0 || i === 3 ? 'var(--color-primary)' : 'var(--color-border)',
                    border: '2px solid var(--color-primary)',
                    margin: '0 auto var(--space-2)',
                  }} />
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                </div>
                {i < 3 && <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)', margin: '0 var(--space-1)', marginBottom: '18px' }} />}
              </div>
            ))}
          </div>

          <p style={pStyle}>{c.timeText}</p>
          <p style={{ ...pStyle, marginTop: 'var(--space-4)', color: 'var(--color-primary)', fontSize: '0.8rem' }}>
            ✦ {c.timeNote}
          </p>
        </div>

        {/* Why longer */}
        <div style={sectionStyle}>
          <div style={iconWrap}>
            <Truck size={20} color="var(--color-primary)" />
            <h3 style={h3Style}>{c.whyTitle}</h3>
          </div>
          <p style={pStyle}>{c.whyText}</p>
        </div>

        {/* Returns */}
        <div style={sectionStyle}>
          <div style={iconWrap}>
            <RotateCcw size={20} color="var(--color-primary)" />
            <h3 style={h3Style}>{c.returnsTitle}</h3>
          </div>
          <p style={{ ...pStyle, marginBottom: 'var(--space-6)' }}>{c.returnsText}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[c.returnsStep1, c.returnsStep2, c.returnsStep3, c.returnsStep4].map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
                <div style={{
                  minWidth: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)',
                  color: 'black',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}>
                  {i + 1}
                </div>
                <p style={{ ...pStyle, margin: 0 }}>{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Guarantee */}
        <div style={{ ...sectionStyle, borderColor: 'rgba(255, 220, 0, 0.3)', backgroundColor: 'rgba(255, 220, 0, 0.04)' }}>
          <div style={iconWrap}>
            <ShieldCheck size={20} color="var(--color-primary)" />
            <h3 style={h3Style}>{c.qualityTitle}</h3>
          </div>
          <p style={pStyle}>{c.qualityText}</p>
        </div>

        {/* Package icon decoration */}
        <div style={{ textAlign: 'center', opacity: 0.12, marginTop: 'var(--space-16)' }}>
          <Package size={80} />
        </div>
      </div>
    </div>
  );
}
