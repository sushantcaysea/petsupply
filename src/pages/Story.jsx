import CurtainSplit, { CurtainCopy, CurtainVisual } from '../components/CurtainSplit'
import PageHero from '../components/PageHero'
import { storyContent } from '../data'
import { usePageMotion } from '../hooks'
import { imgs } from '../media'

export default function Story() {
  const pageRef = usePageMotion()
  const s = storyContent

  return (
    <main className="main story-page" ref={pageRef}>
      <PageHero
        variant="editorial"
        eyebrow="About Sansaar"
        title="Crafted for the world"
        lede={s.goal}
        image={imgs.storyHero}
        imagePosition="58% 42%"
      />

      <CurtainSplit className="section">
        <div className="container container--wide">
          <div className="split">
            <CurtainCopy side="left">
              <p className="eyebrow">{s.meaning}</p>
              <h2>From Himalayan farms to global partners.</h2>
              {s.beginnings.map((p) => (
                <p key={p.slice(0, 28)}>{p}</p>
              ))}
              {s.scale.map((p) => (
                <p key={p.slice(0, 28)}>{p}</p>
              ))}
            </CurtainCopy>
            <CurtainVisual side="right">
              <img src={imgs.storyFarm} alt="Himalayan farm context" />
            </CurtainVisual>
          </div>
        </div>
      </CurtainSplit>

      <section className="section">
        <div className="container">
          <div className="section__head" data-reveal="up">
            <p className="eyebrow">The difference</p>
            <h2 className="section-title">Chhurpi for people. Canine chews for dogs.</h2>
            <p className="section-lede">{s.differenceLead}</p>
          </div>
          <div className="compare" data-reveal="up" data-delay="1">
            <article>
              <h3>{s.comparison.chhurpi.title}</h3>
              <ul>
                {s.comparison.chhurpi.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
            <article>
              <h3>{s.comparison.canine.title}</h3>
              <ul>
                {s.comparison.canine.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <CurtainSplit className="section" style={{ paddingTop: 0 }}>
        <div className="container container--wide">
          <div className="split">
            <CurtainVisual side="left">
              <img src={imgs.storyCraft} alt="Experimentation and craft" loading="lazy" />
            </CurtainVisual>
            <CurtainCopy side="right">
              <p className="eyebrow">Invention</p>
              <h2>From request to category.</h2>
              {s.invention.map((p) => (
                <p key={p.slice(0, 28)}>{p}</p>
              ))}
              {s.today.map((p) => (
                <p key={p.slice(0, 28)}>{p}</p>
              ))}
              <ul className="values">
                {s.values.map((value) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            </CurtainCopy>
          </div>

          <div className="mission">
            <article data-reveal="up">
              <h3>Mission</h3>
              <p>{s.mission}</p>
            </article>
            <article data-reveal="up" data-delay="1">
              <h3>Vision</h3>
              <p>{s.vision}</p>
            </article>
          </div>
        </div>
      </CurtainSplit>
    </main>
  )
}
