import { Link } from 'react-router-dom'
import CurtainSplit, { CurtainCopy, CurtainVisual, OpposingCard } from '../components/CurtainSplit'
import PageHero from '../components/PageHero'
import { productCopy, products } from '../data'
import { usePageMotion } from '../hooks'
import { imgs, media } from '../media'

export default function Products() {
  const pageRef = usePageMotion()
  const lineup = products.filter((p) => !p.contactOnly)
  const custom = products.find((p) => p.contactOnly)

  return (
    <main className="main" ref={pageRef}>
      <PageHero
        variant="editorial"
        className="page-hero--stretch"
        eyebrow="Products"
        title="Sizes that cover the aisle"
        lede="Original Canine Cheese Chews in Small, Medium, Large, XLarge, and mixed custom packs — price on enquiry."
        image={imgs.productsHero}
        imagePosition="72% 55%"
      />

      <CurtainSplit className="products-recipe" from={0.98} to={0.48}>
        <div className="container container--wide">
          <div className="products-recipe__band">
            <CurtainVisual side="left" solid className="products-recipe__media">
              <img src={media.productRecipe} alt="Hard smoked Himalayan cheese chews" />
            </CurtainVisual>
            <CurtainCopy side="right" solid className="products-recipe__copy">
              <p className="eyebrow">The recipe</p>
              <h2>Hard smoked cheese. Real specifications.</h2>
              <p>{productCopy.description}</p>
              <p>
                <strong>Ingredients:</strong> {productCopy.ingredients}
              </p>
              <p>{productCopy.note}</p>
            </CurtainCopy>
          </div>
        </div>
      </CurtainSplit>

      <section className="catalog">
        <div className="container container--wide">
          <div className="catalog__head" data-reveal="up">
            <div>
              <p className="eyebrow">Catalog</p>
              <h2 className="section-title">Choose the size your buyers need.</h2>
              <p className="catalog__lede">
                Four core SKUs with scale shots buyers can read — plus custom packing when the line needs a mix.
              </p>
            </div>
            <Link className="btn btn--secondary" to="/contact">
              Request quote
            </Link>
          </div>

          <div className="sku-ladder">
            {lineup.map((item, i) => {
              const shot = item.images[0]?.src
              const packShot = item.images[2]?.src
              const n = String(i + 1).padStart(2, '0')
              const flip = i % 2 === 1
              return (
                <OpposingCard
                  key={item.id}
                  className={`sku-plate${flip ? ' sku-plate--flip' : ''}`}
                  flip={flip}
                  mediaClassName="sku-plate__stage"
                  copyClassName="sku-plate__panel"
                  media={
                    <>
                      <span className="sku-plate__index" aria-hidden="true">
                        {n}
                      </span>
                      <img src={shot} alt={item.title} loading="lazy" />
                    </>
                  }
                  copy={
                    <>
                      <p className="sku-plate__kicker">Size {n}</p>
                      <h3>{item.name}</h3>
                      <p className="sku-plate__title">{item.title}</p>

                      <dl className="sku-plate__specs">
                        {item.weight ? (
                          <div>
                            <dt>Weight</dt>
                            <dd>{item.weight}</dd>
                          </div>
                        ) : null}
                        {item.size ? (
                          <div>
                            <dt>Dimensions</dt>
                            <dd>{item.size}</dd>
                          </div>
                        ) : null}
                        {item.sku ? (
                          <div>
                            <dt>SKU</dt>
                            <dd>{item.sku}</dd>
                          </div>
                        ) : null}
                        <div>
                          <dt>Pack</dt>
                          <dd>{item.pack || 'Custom packing on enquiry'}</dd>
                        </div>
                      </dl>

                      <div className="sku-plate__foot">
                        <strong>{item.price}</strong>
                        <Link className="btn btn--primary btn--sm" to="/contact">
                          Enquire
                        </Link>
                      </div>

                      {packShot ? (
                        <figure className="sku-plate__pack">
                          <img src={packShot} alt={`${item.name} packaging`} loading="lazy" />
                          <figcaption>Box presentation</figcaption>
                        </figure>
                      ) : null}
                    </>
                  }
                />
              )
            })}
          </div>

          {custom ? (
            <OpposingCard
              className="sku-custom"
              flip
              mediaClassName="sku-custom__media"
              copyClassName="sku-custom__copy"
              media={<img src={custom.images[0]?.src} alt={custom.title} loading="lazy" />}
              copy={
                <>
                  <p className="eyebrow">Custom line</p>
                  <h3>{custom.name}</h3>
                  <p>{custom.title}. Mixed sizes, private label, and packing built for your buyers.</p>
                  <Link className="btn btn--primary" to="/contact">
                    Discuss mix &amp; packing
                  </Link>
                </>
              }
            />
          ) : null}
        </div>
      </section>

      <CurtainSplit className="section">
        <div className="container container--wide">
          <div className="split">
            <CurtainCopy side="left">
              <p className="eyebrow">Buyer confidence</p>
              <h2>What dogs get. What partners trust.</h2>
              <ul className="checklist">
                {productCopy.benefits.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <p style={{ marginTop: '1.25rem' }}>
                <strong>Advice:</strong> {productCopy.advice.slice(0, 3).join(' · ')}
              </p>
              <Link className="btn btn--primary" to="/contact">
                Ask about wholesale packing
              </Link>
            </CurtainCopy>
            <CurtainVisual side="right">
              <img src={imgs.sack} alt="Wholesale supply sacks" loading="lazy" />
            </CurtainVisual>
          </div>
        </div>
      </CurtainSplit>
    </main>
  )
}
