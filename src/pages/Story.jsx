import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { stats, storyContent as story } from '../data'
import { useCountUp, usePageMotion } from '../hooks'

function StatItem({ stat, active }) {
  const display = useCountUp(active, stat.value)
  return (
    <div className="story-stat">
      <strong>
        {stat.prefix}
        {display}
        {stat.suffix}
      </strong>
      <span>{stat.label}</span>
    </div>
  )
}

export default function Story() {
  const pageRef = usePageMotion()
  const statsRef = useRef(null)
  const [statsActive, setStatsActive] = useState(false)

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsActive(true)
          obs.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <main className="page-main story-page" ref={pageRef}>
      <PageHero
        eyebrow={story.eyebrow}
        title={story.title}
        accent={story.meaning}
        lede={story.goal}
        image="/images/process/collection.jpg"
        imagePosition="center 42%"
      />

      <section className="story">
        <article className="section-shell story__chapter">
          <div className="story__chapter-copy" data-reveal="left">
            <span className="story__index">01</span>
            <p className="eyebrow">Since 2008</p>
            <h3>Humble beginnings</h3>
            {story.beginnings.map((para) => (
              <p key={para.slice(0, 48)}>{para}</p>
            ))}
          </div>
          <div
            className="story__assemble"
            data-reveal="assemble"
            aria-label="Beginnings photos"
          >
            <figure className="story__piece story__piece--a">
              <img
                src="/images/story/story-begin-farm.jpg"
                alt="Himalayan milk cans at a mountain farm"
              />
            </figure>
            <figure className="story__piece story__piece--b">
              <img
                src="/images/story/story-begin-dog.jpg"
                alt="Happy dog with a natural cheese chew"
              />
            </figure>
            <figure className="story__piece story__piece--c">
              <img
                src="/images/story/story-begin-craft.jpg"
                alt="Handcrafting smoked cheese chews"
              />
            </figure>
          </div>
        </article>

        <aside className="story__pull" data-reveal="up">
          <div className="section-shell story__pull-inner">
            <p className="eyebrow">Our place in the industry</p>
            <h3>
              “Himalayan Dog Chew” — a category of its own
            </h3>
            {story.scale.map((para) => (
              <p key={para.slice(0, 48)}>{para}</p>
            ))}
          </div>
        </aside>

        <div className="section-shell story__metrics" ref={statsRef} data-reveal="up">
          {stats.map((stat) => (
            <StatItem key={stat.label} stat={stat} active={statsActive} />
          ))}
        </div>

        <article className="story__heritage">
          <div className="story__heritage-media" data-reveal="left" aria-hidden="true">
            <img
              src="/images/process/packaging.jpg"
              alt=""
            />
          </div>
          <div className="story__heritage-copy" data-reveal="right">
            <span className="story__index">02</span>
            <p className="eyebrow">Before the USA market</p>
            <h3>From chhurpi to Himalayan Dog Chew</h3>
            {story.heritage.map((para) => (
              <p key={para.slice(0, 48)}>{para}</p>
            ))}
          </div>
        </article>

        <article className="section-shell story__diff" data-reveal="up">
          <div className="story__diff-layout">
            <div className="story__diff-copy">
              <div className="story__diff-head">
                <span className="story__index">03</span>
                <p className="eyebrow">The major difference</p>
                <h3>Chhurpi and Canine Cheese Chews</h3>
                <p>{story.differenceLead}</p>
              </div>
              <div className="story__diff-grid">
                <div className="story__diff-col">
                  <h4>{story.comparison.chhurpi.title}</h4>
                  <ul>
                    {story.comparison.chhurpi.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
                <div className="story__diff-col story__diff-col--accent">
                  <h4>{story.comparison.canine.title}</h4>
                  <ul>
                    {story.comparison.canine.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <figure className="story__diff-media">
              <img
                src="/images/story/story-diff-chews.jpg"
                alt="Traditional chhurpi beside a hard Canine Cheese Chew"
              />
            </figure>
          </div>
        </article>

        <article className="section-shell story__chapter story__chapter--invert">
          <div className="story__chapter-visual story__chapter-visual--single" data-reveal="left">
            <figure className="story__shot story__shot--wide">
              <img
                src="/images/process/quality.jpg"
                alt="Crafting and checking canine cheese chews"
              />
            </figure>
          </div>
          <div className="story__chapter-copy" data-reveal="right">
            <span className="story__index">04</span>
            <p className="eyebrow">2007</p>
            <h3>The inventors reached out</h3>
            {story.invention.map((para) => (
              <p key={para.slice(0, 48)}>{para}</p>
            ))}
            <Link className="btn btn--brand" to="/products">
              See our sizes
            </Link>
          </div>
        </article>

        <aside className="story__today" data-reveal="up">
          <div className="section-shell story__today-inner">
            <span className="story__index story__index--light">05</span>
            <p className="eyebrow">Today</p>
            <h3>Farmers. Suppliers. Manufacturers.</h3>
            {story.today.map((para) => (
              <p key={para.slice(0, 48)}>{para}</p>
            ))}
            <div className="story__today-actions">
              <Link className="btn btn--gold" to="/process">
                See the process
              </Link>
              <Link className="btn btn--ghost" to="/benefits">
                Health benefits
              </Link>
              <Link className="btn btn--ghost" to="/contact">
                Get in touch
              </Link>
            </div>
          </div>
        </aside>

        <div className="section-shell story__beliefs" data-reveal="up">
          <div className="story__belief">
            <p className="eyebrow">Our Mission</p>
            <blockquote>“{story.mission}”</blockquote>
          </div>
          <div className="story__belief">
            <p className="eyebrow">Our Vision</p>
            <blockquote>“{story.vision}”</blockquote>
          </div>
        </div>

        <div className="section-shell story__values" data-reveal="up">
          <p className="eyebrow">Our Values</p>
          <ul>
            {story.values.map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
