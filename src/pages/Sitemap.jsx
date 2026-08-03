import { Link } from 'react-router-dom'
import { navLinks, products } from '../data'
import { usePageMotion } from '../hooks'

const pageLinks = [
  { to: '/', label: 'Home' },
  ...navLinks,
  { to: '/gallery', label: 'Gallery' },
  { to: '/sitemap', label: 'Sitemap' },
]

export default function Sitemap() {
  const pageRef = usePageMotion()
  const sizeLine = products.filter((p) => !p.contactOnly)

  return (
    <main className="main sitemap-page" ref={pageRef}>
      <section className="section sitemap">
        <div className="container">
          <div className="section__head" data-reveal="up">
            <p className="eyebrow">Index</p>
            <h1 className="section-title">Sitemap</h1>
            <p className="section-lede">A quick map of Sansaar Pet Supply pages and product sizes.</p>
          </div>

          <div className="sitemap__grid">
            <div className="sitemap__block" data-reveal="up">
              <h2>Pages</h2>
              <ul>
                {pageLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sitemap__block" data-reveal="up" data-delay="1">
              <h2>Products</h2>
              <ul>
                {sizeLine.map((product) => (
                  <li key={product.id}>
                    <Link to="/products">{product.title}</Link>
                  </li>
                ))}
                <li>
                  <Link to="/contact">Custom sizes & wholesale enquiry</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
