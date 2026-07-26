import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  galleryImages,
  homePathways,
  heroSlides,
  marqueeImages,
  processSteps,
  qualityPledges,
  storyContent,
} from '../data'
import { usePageMotion } from '../hooks'

const homeStoryImages = [
  '/images/story/story-begin-farm.jpg',
  '/images/story/story-begin-dog.jpg',
  '/images/story/story-begin-craft.jpg',
  '/images/lifestyle/home-pledge.jpg',
]

const galleryPeek = galleryImages.filter((item) => !item.hasText).slice(0, 4)

export default function Home() {
  const pageRef = usePageMotion()
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroSlides.length)
    }, 5200)
    return () => clearInterval(id)
  }, [])

  return (
    <main ref={pageRef}>
      <section className="hero">
        <div className="hero__media" aria-hidden="true" data-parallax="0.08">
          {heroSlides.map((slide, i) => (
            <img
              key={slide.src}
              src={slide.src}
              alt=""
              className={`hero__slide ${slide.position ? `hero__slide--${slide.position}` : ''} ${i === heroIndex ? 'is-active' : ''}`}
              fetchPriority={i === 0 ? 'high' : 'auto'}
              decoding="async"
            />
          ))}
          <div className="hero__veil" />
        </div>

        <div className="hero__content">
          <div className="hero__copy">
            <p className="hero__brand" data-reveal="up">
              Sansar Pet Supply
            </p>
            <h1 data-reveal="up" data-delay="1">
              The best your dog can have
            </h1>
            <p className="hero__lede" data-reveal="up" data-delay="2">
              Selling to the world of pet parents with the best authentic local products in the world.
            </p>
          </div>
          <div className="hero__actions" data-reveal="up" data-delay="3">
            <Link className="btn btn--gold" to="/products">
              Explore chews
            </Link>
            <Link className="btn btn--ghost" to="/story">
              More about us
            </Link>
          </div>
        </div>

        <div className="hero__pager" aria-label="Hero slides">
          {heroSlides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              className={i === heroIndex ? 'is-active' : ''}
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setHeroIndex(i)}
            />
          ))}
        </div>
        <div className="hero__scroll" aria-hidden="true">
          <span>Scroll</span>
        </div>
      </section>

      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          {[...marqueeImages, ...marqueeImages].map((item, i) => (
            <figure key={`${item.src}-${i}`}>
              <img src={item.src} alt="" decoding="async" />
            </figure>
          ))}
        </div>
      </div>

      <section className="home-pledge">
        <div className="section-shell">
          <div className="home-pledge__intro" data-reveal="up">
            <div className="home-pledge__copy">
              <p className="eyebrow">Our quality pledge</p>
              <h2>Three ingredients. Months of craft. One lasting chew.</h2>
              <p>
                Skim milk, citrus juice, and salt — pressed, smoked, dried, and aged the Himalayan
                way, then checked so pet parents can trust what their dogs work on for hours.
              </p>
            </div>
            <figure className="home-pledge__media">
              <img
                src="/images/lifestyle/home-pledge.jpg"
                alt="Natural cheese chews with simple dairy ingredients"
              />
            </figure>
          </div>
          <ul className="home-pledge__grid">
            {qualityPledges.map((item, i) => (
              <li key={item.title} data-reveal="up" data-delay={String((i % 4) + 1)}>
                <span>{String(i + 1).padStart(2, '0')}</span>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="home-pathways">
        <div className="section-shell">
          <div className="home-pathways__head" data-reveal="up">
            <p className="eyebrow">Find the right chew</p>
            <h2>Sizes tailored for every dog</h2>
          </div>
          <div className="home-pathways__row">
            {homePathways.map((item, i) => (
              <Link
                key={item.title}
                to={item.to}
                className="home-pathway"
                data-reveal="up"
                data-delay={String(i + 1)}
              >
                <span className={`home-pathway__media ${item.hasText ? 'has-text' : ''}`}>
                  <img src={item.image} alt="" decoding="async" />
                </span>
                <span className="home-pathway__copy">
                  <strong>{item.title}</strong>
                  <em>{item.text}</em>
                </span>
              </Link>
            ))}
          </div>
          <div className="home-pathways__cta" data-reveal="up">
            <Link className="btn btn--brand" to="/products">
              Browse all sizes
            </Link>
          </div>
        </div>
      </section>

      <section className="home-story">
        <div className="section-shell home-story__grid">
          <div className="home-story__copy" data-reveal="left">
            <p className="eyebrow">Our Story</p>
            <h2>{storyContent.meaning}</h2>
            <p>{storyContent.goal}</p>
            <Link className="btn btn--brand" to="/story">
              Read our story
            </Link>
          </div>
          <div className="home-story__mosaic" data-reveal="right">
            {homeStoryImages.map((src, i) => (
              <figure key={src} className={`home-story__tile home-story__tile--${i + 1}`}>
                <img src={src} alt="" decoding="async" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="home-spotlight">
        <div className="section-shell home-spotlight__grid">
          <div className="home-spotlight__copy" data-reveal="left">
            <p className="eyebrow">Original Canine Cheese Chews</p>
            <h2>Long-lasting chewing enjoyment</h2>
            <p>
              Hard smoked cheese dogs work several hours to soften — lactose-free, fat under 1%,
              and sized from Small through Mixed Large for wholesale partners.
            </p>
            <div className="home-spotlight__actions">
              <Link className="btn btn--brand" to="/products">
                Discover sizes
              </Link>
              <Link className="btn btn--ghost-dark" to="/benefits">
                Health benefits
              </Link>
            </div>
          </div>
          <div className="home-spotlight__media" data-reveal="right">
            <img src="/images/products/medium-1.jpg" alt="Original Canine Cheese Chew" />
          </div>
        </div>
      </section>

      <section className="home-concept">
        <div className="home-concept__bg" aria-hidden="true">
          <img src="/images/lifestyle/home-concept.jpg" alt="" />
          <div className="home-concept__veil" />
        </div>
        <div className="section-shell home-concept__inner" data-reveal="up">
          <p className="eyebrow">Our craft</p>
          <h2>From chhurpi tradition to canine-friendly chew</h2>
          <p>
            In 2007 we began turning traditional chhurpi into a nearly bone-hard, lactose-free
            Canine Cheese Chew — still refining size, shape, flavor, and density today.
          </p>
          <div className="home-concept__actions">
            <Link className="btn btn--gold" to="/story">
              More about us
            </Link>
            <Link className="btn btn--ghost" to="/process">
              See the process
            </Link>
          </div>
        </div>
      </section>

      <section className="home-process">
        <div className="section-shell">
          <div className="home-process__head" data-reveal="up">
            <p className="eyebrow">Process</p>
            <h2>From Himalayan milk to lasting chew</h2>
            <p>Four steps from mountain co-ops to packaged chews with a five-year shelf life.</p>
          </div>
          <div className="home-process__grid home-process__grid--teaser">
            {processSteps.map((step, i) => (
              <Link
                key={step.num}
                to="/process"
                className="home-process__card"
                data-reveal="up"
                data-delay={String((i % 4) + 1)}
              >
                <div className="home-process__media">
                  <img src={step.image} alt="" decoding="async" />
                </div>
                <span>{step.num}</span>
                <h3>{step.title}</h3>
              </Link>
            ))}
          </div>
          <div className="home-process__cta" data-reveal="up">
            <Link className="btn btn--gold" to="/process">
              Unveiling the art of production
            </Link>
          </div>
        </div>
      </section>

      <section className="home-advisor">
        <div className="section-shell home-advisor__grid">
          <div className="home-advisor__media" data-reveal="left">
            <img
              src="/images/lifestyle/benefits-hero.jpg"
              alt="Dog enjoying a natural cheese chew"
            />
          </div>
          <div className="home-advisor__copy" data-reveal="right">
            <p className="eyebrow">Health & wellbeing</p>
            <h2>Clean ingredients. Lasting chew time. Happier pets.</h2>
            <p>
              Free from toxic preservatives and binding agents — easily digestible, gluten-free,
              and a healthier alternative to rawhide.
            </p>
            <Link className="btn btn--ghost-dark" to="/benefits">
              More about health benefits
            </Link>
          </div>
        </div>
      </section>

      <section className="home-gallery-peek">
        <div className="section-shell">
          <div className="home-gallery-peek__head" data-reveal="up">
            <div>
              <p className="eyebrow">Gallery</p>
              <h2>Stories behind every chew</h2>
            </div>
            <Link className="btn btn--ghost-dark" to="/gallery">
              Open gallery
            </Link>
          </div>
          <div className="home-gallery-peek__track" data-reveal="up">
            {galleryPeek.map((item) => (
              <Link key={item.src} to="/gallery" className="home-gallery-peek__item">
                <img src={item.src} alt="" decoding="async" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
