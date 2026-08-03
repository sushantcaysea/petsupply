import { useMemo } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { blogPosts } from '../data'
import { usePageMotion } from '../hooks'

function shareLinks(url, title) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  return [
    {
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      className: 'blog-share__btn--facebook',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.84c0-2.52 1.49-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.48h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94Z"
          />
        </svg>
      ),
    },
    {
      label: 'Twitter',
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      className: 'blog-share__btn--twitter',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M18.2 4.5h2.4l-5.3 6.1 6.2 8.9h-4.9l-3.8-5.1-4.4 5.1H5.9l5.7-6.5L5.6 4.5h5l3.5 4.6 4.1-4.6Zm-.8 13.4h1.3L8.2 5.8H6.8l10.6 12.1Z"
          />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      className: 'blog-share__btn--linkedin',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M6.3 9.2H3.5V20h2.8V9.2ZM4.9 4C3.9 4 3.1 4.8 3.1 5.8S3.9 7.6 4.9 7.6 6.7 6.8 6.7 5.8 5.9 4 4.9 4ZM20.5 13.2c0-2.6-1.4-4.3-3.9-4.3-1.2 0-2.2.6-2.7 1.5V9.2h-2.8c0 .6 0 10.8 0 10.8h2.8v-6c0-.3 0-.7.1-1 .3-.7 1-1.5 2.2-1.5 1.5 0 2.1 1.2 2.1 2.9V20h2.8v-6.8Z"
          />
        </svg>
      ),
    },
    {
      label: 'Pinterest',
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`,
      className: 'blog-share__btn--pinterest',
      icon: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12.1 3.2c-4.8 0-7.8 3.2-7.8 7.1 0 2.2 1.2 4.9 3.1 5.7.2.1.4 0 .4-.3l.2-1c0-.3 0-.4-.2-.6-.7-.8-1.1-2-1.1-3.2 0-3.1 2.4-5.9 6.3-5.9 3.4 0 5.3 2.1 5.3 4.8 0 3.6-1.6 6.6-4 6.6-1.3 0-2.3-1.1-2-2.4.4-1.5 1.1-3.2 1.1-4.3 0-1-.5-1.8-1.6-1.8-1.3 0-2.3 1.3-2.3 3.1 0 1.1.4 1.9.4 1.9l-1.5 6.3c-.4 1.8-.1 4 0 4.2 0 .1.1.1.2.1.1 0 .2-.1.3-.2.9-1.2 1.5-2.4 2-4 .2-.5 1-4 1-4 .5 1 2 1.8 3.5 1.8 4.6 0 6.7-4.2 6.7-8.1.1-3.6-3-6.9-8-6.9Z"
          />
        </svg>
      ),
    },
  ]
}

export default function BlogPost() {
  const { slug } = useParams()
  const pageRef = usePageMotion()
  const index = blogPosts.findIndex((item) => item.slug === slug)
  const post = blogPosts[index]

  const pageUrl = useMemo(() => {
    if (typeof window === 'undefined') return `https://sansarpetsupply.com/blog/${slug}`
    return window.location.href
  }, [slug])

  if (!post) return <Navigate to="/blog" replace />

  const prev = index < blogPosts.length - 1 ? blogPosts[index + 1] : null
  const next = index > 0 ? blogPosts[index - 1] : null
  const recent = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 5)
  const shares = shareLinks(pageUrl, post.title)

  return (
    <main className="main blog-post-page" ref={pageRef}>
      <div className="blog-read">
        <article className="blog-read__shell">
          <header className="blog-read__header" data-reveal="up">
            <nav className="blog-read__crumb" aria-label="Breadcrumb">
              <Link to="/blog">Blog</Link>
              <span aria-hidden="true">/</span>
              <span>{post.title}</span>
            </nav>

            <div className="blog-read__meta">
              <span className="eyebrow">{post.category || 'Journal'}</span>
              {post.date ? <time dateTime={post.date}>{post.date}</time> : null}
            </div>

            <h1>{post.title}</h1>
            {post.excerpt ? <p className="blog-read__lede">{post.excerpt}</p> : null}
          </header>

          {post.image ? (
            <figure className="blog-read__figure" data-reveal="up" data-delay="1">
              <img src={post.image} alt="" />
            </figure>
          ) : null}

          <div className="blog-read__body" data-reveal="up" data-delay="2">
            {post.body.map((paragraph) => (
              <p key={paragraph.slice(0, 56)}>{paragraph}</p>
            ))}
          </div>

          <footer className="blog-read__footer" data-reveal="up">
            <div className="blog-read__actions">
              <Link className="btn btn--secondary" to="/blog">
                All articles
              </Link>
              <Link className="btn btn--primary" to="/contact">
                Request wholesale
              </Link>
            </div>

            <div className="blog-read__more">
              {prev ? (
                <Link className="blog-read__adjacent blog-read__adjacent--prev" to={`/blog/${prev.slug}`}>
                  <span className="eyebrow">Older</span>
                  <strong>{prev.title}</strong>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link className="blog-read__adjacent blog-read__adjacent--next" to={`/blog/${next.slug}`}>
                  <span className="eyebrow">Newer</span>
                  <strong>{next.title}</strong>
                </Link>
              ) : null}
            </div>
          </footer>
        </article>

        <aside className="blog-sidebar" data-reveal="up" data-delay="1">
          <section className="blog-sidebar__block">
            <h2 className="blog-sidebar__title">Share post</h2>
            <div className="blog-share">
              {shares.map((item) => (
                <a
                  key={item.label}
                  className={`blog-share__btn ${item.className}`}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="blog-share__icon">{item.icon}</span>
                  <span className="blog-share__label">{item.label}</span>
                </a>
              ))}
            </div>
          </section>

          <section className="blog-sidebar__block">
            <h2 className="blog-sidebar__title">Recent posts</h2>
            <ul className="blog-recent">
              {recent.map((item) => (
                <li key={item.slug}>
                  <Link className="blog-recent__item" to={`/blog/${item.slug}`}>
                    <span className="blog-recent__thumb">
                      <img src={item.image} alt="" loading="lazy" />
                    </span>
                    <span className="blog-recent__copy">
                      <strong>{item.title}</strong>
                      {item.date ? <time dateTime={item.date}>{item.date}</time> : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </main>
  )
}
