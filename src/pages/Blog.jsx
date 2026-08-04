import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { blogPosts } from '../data'
import { usePageMotion } from '../hooks'
import { imgs } from '../media'

export default function Blog() {
  const pageRef = usePageMotion()

  return (
    <main className="main blog-page" ref={pageRef}>
      <PageHero
        variant="editorial"
        eyebrow="Blog"
        title="Dive into our blog"
        lede="Find information regarding Canine Cheese Chews — craft, health, sizing, and supply from Sansar Pet Supply."
        image={imgs.homeConcept}
        imagePosition="50% 42%"
      />

      <section className="section blog-list">
        <div className="container container--wide">
          <div className="section__head blog-list__head" data-reveal="up">
            <p className="blog-list__stamp">Articles</p>
            <h2 className="section-title">From the Sansar journal</h2>
            <p className="section-lede">
              Exact posts from sansarpetsupply.com, kept for partners and pet parents alike.
            </p>
          </div>

          <div className="blog-grid">
            {blogPosts.map((post, i) => (
              <article className="blog-card" key={post.slug} data-reveal="up" data-delay={String((i % 4) + 1)}>
                <Link className="blog-card__media" to={`/blog/${post.slug}`}>
                  <img src={post.image} alt="" loading="lazy" />
                </Link>
                <div className="blog-card__body">
                  <div className="blog-card__meta">
                    <span className="eyebrow">{post.category}</span>
                    {post.date ? <time dateTime={post.date}>{post.date}</time> : null}
                  </div>
                  <h3>
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p>{post.excerpt}</p>
                  <Link className="blog-card__more" to={`/blog/${post.slug}`}>
                    Read more
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="blog-cta" data-reveal="up">
            <div>
              <p className="eyebrow">Wholesale</p>
              <h2>Want more information about our products?</h2>
              <p>Drop us a mail or call — we get back as soon as your query arrives.</p>
            </div>
            <Link className="btn btn--primary" to="/contact">
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
