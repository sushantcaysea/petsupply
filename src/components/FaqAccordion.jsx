import { useId, useState } from 'react'

function FaqItem({ question, answer, delay }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div
      className={['kb-faq__item', open ? 'is-open' : ''].filter(Boolean).join(' ')}
      data-reveal="up"
      data-delay={delay}
    >
      <button
        type="button"
        className="kb-faq__trigger"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{question}</span>
        <i className="kb-faq__icon" aria-hidden="true" />
      </button>
      <div className="kb-faq__panel" id={panelId} role="region">
        <div className="kb-faq__panel-inner">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  )
}

export default function FaqAccordion({ items }) {
  return (
    <div className="kb-faq">
      {items.map((item, i) => (
        <FaqItem
          key={item.q}
          question={item.q}
          answer={item.a}
          delay={String((i % 4) + 1)}
        />
      ))}
    </div>
  )
}
