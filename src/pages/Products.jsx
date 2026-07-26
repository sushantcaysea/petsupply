import { useEffect, useState, useDeferredValue, useCallback } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { productCopy, products } from '../data'
import { usePageMotion } from '../hooks'

export default function Products() {
  const pageRef = usePageMotion()
  const [activeIndex, setActiveIndex] = useState(2)
  const [photoIndex, setPhotoIndex] = useState(0)
  const deferredPhoto = useDeferredValue(photoIndex)
  const activeProduct = products[activeIndex]
  const activePhoto = activeProduct.images[deferredPhoto] ?? activeProduct.images[0]
  const orient = activePhoto.orient || 'square'

  useEffect(() => {
    setPhotoIndex(0)
  }, [activeProduct.id])

  const selectSize = useCallback((index) => {
    setActiveIndex(index)
  }, [])

  const stepPhoto = useCallback(
    (dir) => {
      setPhotoIndex((i) => (i + dir + activeProduct.images.length) % activeProduct.images.length)
    },
    [activeProduct.images.length],
  )

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') stepPhoto(1)
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') stepPhoto(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [stepPhoto])

  return (
    <main className="page-main products-page" ref={pageRef}>
      <PageHero
        eyebrow="Products"
        title="Original Canine Cheese Chews"
        lede="Hard smoked cheese — a long-lasting chew dogs work several hours to soften. The end piece can be microwaved into a crunchy puff. Ingredients: skim milk, citrus juice, salt."
        image="/images/products/sack.jpg"
        imagePosition="center 28%"
      />

      <section className="products">
        <div className="section-shell">
          <div className="products__dial" data-reveal="up">
            <div className="products__dial-copy">
              <p className="eyebrow">Size range</p>
              <h2 className="products__dial-name" key={activeProduct.id}>
                {activeProduct.name}
              </h2>
              <p className="products__dial-sub">
                {activeProduct.contactOnly
                  ? 'Mixed large size available — contact us for details'
                  : `${activeProduct.weight} · ${activeProduct.size}`}
              </p>
            </div>

            <div className="products__ruler" role="tablist" aria-label="Chew sizes">
              <div className="products__ruler-track" aria-hidden="true" />
              {products.map((product, i) => (
                <button
                  key={product.id}
                  type="button"
                  role="tab"
                  aria-selected={activeIndex === i}
                  className={`products__peg ${activeIndex === i ? 'is-active' : ''}`}
                  style={{ '--scale': product.scale }}
                  onClick={() => selectSize(i)}
                >
                  <span
                    className={`products__peg-stick ${
                      product.contactOnly ? 'products__peg-stick--stack' : ''
                    }`}
                  >
                    <img src={product.images[0].src} alt="" decoding="async" />
                  </span>
                  <span className="products__peg-label">{product.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="products__atelier" id="atelier" data-reveal="up">
            <div className="products__stage">
              <div className="products__stage-bg" aria-hidden="true" />

              <div className="products__viewer">
                <button
                  type="button"
                  className="products__arrow products__arrow--prev"
                  onClick={() => stepPhoto(-1)}
                  aria-label="Previous photo"
                >
                  <span aria-hidden="true">‹</span>
                </button>

                <button
                  type="button"
                  className={`products__viewport is-${orient}`}
                  key={`${activeProduct.id}-${deferredPhoto}`}
                  onClick={() => stepPhoto(1)}
                  aria-label="View next photo"
                >
                  <img src={activePhoto.src} alt={activeProduct.title} />
                </button>

                <button
                  type="button"
                  className="products__arrow products__arrow--next"
                  onClick={() => stepPhoto(1)}
                  aria-label="Next photo"
                >
                  <span aria-hidden="true">›</span>
                </button>
              </div>

              <div className="products__dots" role="tablist" aria-label="Photo pages">
                {activeProduct.images.map((photo, i) => (
                  <button
                    key={photo.src}
                    type="button"
                    role="tab"
                    aria-selected={photoIndex === i}
                    aria-label={`Photo ${i + 1}`}
                    className={photoIndex === i ? 'is-active' : ''}
                    onClick={() => setPhotoIndex(i)}
                  />
                ))}
              </div>

              <div
                className="products__thumbs"
                role="tablist"
                aria-label="Product photos"
                style={{ gridTemplateColumns: `repeat(${activeProduct.images.length}, 1fr)` }}
              >
                {activeProduct.images.map((photo, i) => (
                  <button
                    key={photo.src}
                    type="button"
                    role="tab"
                    aria-selected={photoIndex === i}
                    className={photoIndex === i ? 'is-active' : ''}
                    onClick={() => setPhotoIndex(i)}
                  >
                    <img src={photo.src} alt="" decoding="async" />
                  </button>
                ))}
              </div>
            </div>

            <aside className="products__sheet">
              <p className="products__kicker">Category · Chew</p>
              <h2>{activeProduct.title}</h2>
              <p className="products__price">
                {activeProduct.price}
                {activeProduct.pack ? <span> · {activeProduct.pack}</span> : null}
              </p>
              {activeProduct.sku ? <p className="products__sku">SKU {activeProduct.sku}</p> : null}

              <p className="products__blurb">
                {activeProduct.contactOnly
                  ? 'Mixed large size available from Sansar Pet Supply. Drop us a message for availability, packing, and wholesale pricing.'
                  : productCopy.description}
              </p>

              {!activeProduct.contactOnly ? (
                <div className="products__metrics">
                  <div>
                    <span>Weight range</span>
                    <strong>{activeProduct.weight}</strong>
                  </div>
                  <div>
                    <span>Measurements</span>
                    <strong>{activeProduct.size}</strong>
                  </div>
                  <div>
                    <span>Ingredients</span>
                    <strong>{productCopy.ingredients}</strong>
                  </div>
                  <div>
                    <span>Hue note</span>
                    <strong>{productCopy.note}</strong>
                  </div>
                </div>
              ) : null}

              <ul className="products__perks">
                {productCopy.benefits.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>

              <div className="products__actions">
                <Link className="btn btn--brand" to="/contact">
                  {activeProduct.contactOnly ? 'Contact us' : 'Request pricing'}
                </Link>
                <Link className="btn btn--ghost-dark" to="/benefits">
                  Health benefits
                </Link>
                <Link className="btn btn--ghost-dark" to="/process">
                  See how it&apos;s made
                </Link>
              </div>

              <details className="products__advice">
                <summary>Advice for use</summary>
                <ul>
                  {productCopy.advice.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </details>
            </aside>
          </div>
        </div>

        <div className="products__spectrum" data-reveal="up">
          <div className="section-shell">
            <p className="eyebrow">All sizes</p>
            <h3>Small · Medium · Large · XLarge · Mixed Large</h3>
            <ol className="products__spectrum-list">
              {products.map((product, i) => (
                <li key={product.id}>
                  <button
                    type="button"
                    className={activeIndex === i ? 'is-active' : ''}
                    onClick={() => {
                      selectSize(i)
                      document
                        .getElementById('atelier')
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                  >
                    <span className="products__spectrum-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="products__spectrum-title">{product.name}</span>
                    <span className="products__spectrum-meta">
                      {product.weight ?? 'On enquiry'}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </main>
  )
}
