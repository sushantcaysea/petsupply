import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { galleryImages } from '../data'
import { usePageMotion } from '../hooks'

export default function Gallery() {
  const pageRef = usePageMotion()
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    document.body.style.overflow = lightbox != null ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [lightbox])

  useEffect(() => {
    if (lightbox == null) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') {
        setLightbox((i) => (i + 1) % galleryImages.length)
      }
      if (e.key === 'ArrowLeft') {
        setLightbox((i) => (i - 1 + galleryImages.length) % galleryImages.length)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  return (
    <main className="page-main" ref={pageRef}>
      <PageHero
        eyebrow="Gallery"
        title="Stories behind every chew"
        lede="Each frame carries its own message — open any image to read the matching story title."
        image="/images/lifestyle/editorial-15.jpg"
        imagePosition="center 58%"
      />

      <section className="gallery">
        <div className="section-shell">
          <div className="gallery__mosaic">
            {galleryImages.map((item, i) => (
              <button
                key={`${item.src}-${i}`}
                type="button"
                className={`gallery__item is-${item.orient || 'square'} ${item.hasText ? 'has-text' : ''}`}
                data-reveal="up"
                data-delay={String((i % 4) + 1)}
                onClick={() => setLightbox(i)}
                aria-label={item.caption}
              >
                <img src={item.src} alt={item.caption} decoding="async" />
                <span className="gallery__caption">{item.caption}</span>
              </button>
            ))}
          </div>

          <div className="page-cta" data-reveal="up">
            <Link className="btn btn--brand" to="/products">
              Explore sizes
            </Link>
            <Link className="btn btn--ghost-dark" to="/contact">
              Talk wholesale
            </Link>
          </div>
        </div>
      </section>

      {lightbox != null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="lightbox__close"
            aria-label="Close"
            onClick={() => setLightbox(null)}
          >
            Close
          </button>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation()
              setLightbox((i) => (i - 1 + galleryImages.length) % galleryImages.length)
            }}
          >
            ‹
          </button>
          <img
            src={galleryImages[lightbox].src}
            alt={galleryImages[lightbox].caption}
            onClick={(e) => e.stopPropagation()}
          />
          <p className="lightbox__caption" onClick={(e) => e.stopPropagation()}>
            {galleryImages[lightbox].caption}
          </p>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation()
              setLightbox((i) => (i + 1) % galleryImages.length)
            }}
          >
            ›
          </button>
        </div>
      )}
    </main>
  )
}
