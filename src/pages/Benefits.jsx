import { Link } from 'react-router-dom'
import CurtainSplit, { CurtainCopy, CurtainVisual } from '../components/CurtainSplit'
import PageHero from '../components/PageHero'
import { benefits } from '../data'
import { usePageMotion } from '../hooks'
import { imgs, media } from '../media'

export default function Benefits() {
  const pageRef = usePageMotion()

  return (
    <main className="main" ref={pageRef}>
      <PageHero
        variant="editorial"
        eyebrow="Benefits"
        title="Clean chew. Lasting calm."
        lede="Lactose-free hard smoked cheese — dental work, long occupation, and nutrition without rawhide trade-offs."
        image={imgs.benefitsHero}
        imagePosition="55% 40%"
      />

      <CurtainSplit className="section">
        <div className="container container--wide">
          <div className="split" style={{ marginBottom: '3.5rem' }}>
            <CurtainCopy side="left">
              <p className="eyebrow">For dogs</p>
              <h2>Hours of work. Digests clean.</h2>
              <p>
                Free from toxic preservatives and binding agents. Nearly bone-hard, gluten-free, and designed as a
                healthier alternative to rawhide — with no waste or fuss at the end.
              </p>
              <Link className="btn btn--primary" to="/contact">
                Request wholesale info
              </Link>
            </CurtainCopy>
            <CurtainVisual side="right">
              <img src={media.lifestyleNew} alt="Dog with canine cheese chew" />
            </CurtainVisual>
          </div>

          <div className="benefit-grid">
            {benefits.map((item, i) => (
              <article className="benefit" key={item.title} data-reveal="up" data-delay={String((i % 4) + 1)}>
                <div className={`benefit__media${item.hasText ? ' benefit__media--text' : ''}`}>
                  <img src={item.image} alt={item.hasText ? item.title : ''} loading="lazy" />
                </div>
                <div className="benefit__copy">
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </CurtainSplit>
    </main>
  )
}
