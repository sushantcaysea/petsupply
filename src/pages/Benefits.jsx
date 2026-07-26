import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { benefits } from '../data'
import { usePageMotion } from '../hooks'

export default function Benefits() {
  const pageRef = usePageMotion()

  return (
    <main className="page-main" ref={pageRef}>
      <PageHero
        eyebrow="Health & wellbeing"
        title="Health benefits of Canine Cheese Chews"
        lede="Everything pets — and pet parents — look for: clean ingredients, dental care, and a treat dogs stay satisfied with for hours."
        image="/images/lifestyle/benefits-hero.jpg"
        imagePosition="72% 45%"
      />

      <section className="benefits">
        <div className="section-shell">
          <div className="benefits__list">
            {benefits.map((item, i) => (
              <article
                key={item.title}
                className={`benefit ${i % 2 ? 'benefit--flip' : ''}`}
                data-reveal={i % 2 ? 'left' : 'right'}
              >
                <div className={`benefit__media ${item.hasText ? 'has-text' : ''}`}>
                  <img src={item.image} alt={item.title} decoding="async" data-parallax="0.1" />
                </div>
                <div className="benefit__copy">
                  <span>0{i + 1}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="page-cta" data-reveal="up">
            <Link className="btn btn--brand" to="/products">
              Explore sizes
            </Link>
            <Link className="btn btn--ghost-dark" to="/process">
              How they&apos;re made
            </Link>
            <Link className="btn btn--ghost-dark" to="/contact">
              Request pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
