import PageHero from '../components/PageHero'
import { galleryImages } from '../data'
import { usePageMotion } from '../hooks'
import { imgs, media } from '../media'

export default function Gallery() {
  const pageRef = usePageMotion()

  const featured = [
    { type: 'video', src: media.heroVideo, caption: 'Brand atmosphere' },
    { type: 'image', src: media.lifestyleNew, caption: 'At home with the chew' },
    { type: 'image', src: media.productStudio, caption: 'Product study' },
    { type: 'video', src: media.processVideo, caption: 'Craft in motion' },
    { type: 'image', src: imgs.heroHimalaya, caption: 'Mount Everest' },
    { type: 'image', src: imgs.sack, caption: 'Wholesale supply' },
  ]

  return (
    <main className="main" ref={pageRef}>
      <PageHero
        variant="editorial"
        eyebrow="Gallery"
        title="Atmosphere, craft, and supply"
        lede="Editorial frames, cinema assets, and the everyday world around Original Canine Cheese Chews."
        image={imgs.homeConcept}
      />

      <section className="section">
        <div className="container container--wide">
          <div className="section__head" data-reveal="up">
            <p className="eyebrow">Featured</p>
            <h2 className="section-title">Signature visuals</h2>
          </div>
          <div className="gallery">
            {featured.map((frame, i) => (
              <figure key={frame.caption} data-reveal="image" data-delay={String((i % 4) + 1)}>
                {frame.type === 'video' ? (
                  <video src={frame.src} autoPlay muted loop playsInline />
                ) : (
                  <img src={frame.src} alt={frame.caption} loading="lazy" />
                )}
                <figcaption>{frame.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container container--wide">
          <div className="section__head" data-reveal="up">
            <p className="eyebrow">Library</p>
            <h2 className="section-title">Editorial &amp; supply archive</h2>
          </div>
          <div className="gallery">
            {galleryImages.map((item, i) => (
              <figure
                key={item.src}
                className={item.hasText ? 'has-text' : undefined}
                data-reveal="image"
                data-delay={String((i % 4) + 1)}
              >
                <img src={item.src} alt={item.caption} loading="lazy" />
                <figcaption>{item.caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
