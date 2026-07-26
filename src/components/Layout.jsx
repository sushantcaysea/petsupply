import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { company, navLinks } from '../data'
import Logo, { LogoMark } from './Logo'

export default function Layout() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setMenuOpen(false)
    setScrolled(window.scrollY > 20)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 20)
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? (y / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)
  const navSolid = scrolled || menuOpen

  return (
    <div className="page">
      <div className="scroll-progress" style={{ width: `${progress}%` }} aria-hidden="true" />

      <header className={`nav ${navSolid ? 'nav--solid' : ''} ${menuOpen ? 'nav--open' : ''}`}>
        <div className="nav__inner">
          <Link to="/" className="nav__brand" onClick={closeMenu} aria-label="Sansar Pet home">
            <Logo markClassName="nav__mark" />
          </Link>

          <nav className="nav__links" aria-label="Primary">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => (isActive ? 'is-active' : undefined)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <Link className="nav__cta" to="/contact">
            Enquire
          </Link>

          <button
            className="nav__toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span />
            <span />
          </button>
        </div>

        <div id="mobile-menu" className={`nav__mobile ${menuOpen ? 'is-open' : ''}`}>
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={closeMenu}>
              {link.label}
            </NavLink>
          ))}
          <Link to="/contact" onClick={closeMenu}>
            Enquire now
          </Link>
        </div>
      </header>

      <Outlet />

      <footer className="footer">
        <div className="footer__glow" aria-hidden="true" />
        <div className="section-shell">
          <div className="footer__cta">
            <div>
              <p className="footer__eyebrow">Sansar Pet Supply</p>
              <h2>Want more information about our products?</h2>
              <p>
                Drop us a mail or call — we always get back to you as soon as we receive your query.
              </p>
            </div>
            <Link className="btn btn--gold" to="/contact">
              Get in touch
            </Link>
          </div>

          <div className="footer__grid">
            <div className="footer__brand-col">
              <Link to="/" className="footer__brand" aria-label="Sansar Pet home">
                <LogoMark className="footer__mark" />
                <span className="footer__name">{company.shortName}</span>
              </Link>
              <p className="footer__tagline">{company.tagline}</p>
              <p className="footer__blurb">{company.blurb}</p>
              <div className="footer__social">
                <span>Connect with us</span>
                <ul>
                  {company.socials.map((social) => (
                    <li key={social.label}>
                      <a href={social.href} target="_blank" rel="noreferrer">
                        {social.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="footer__col">
              <h3>Quick links</h3>
              <ul className="footer__nav">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {company.offices.map((office) => (
              <div className="footer__col" key={office.region}>
                <h3>{office.region}</h3>
                <ul className="footer__contact">
                  <li>{office.place}</li>
                  {office.email ? (
                    <li>
                      <a href={`mailto:${office.email}`}>{office.email}</a>
                    </li>
                  ) : null}
                  <li>
                    <a href={office.phoneHref}>{office.phone}</a>
                  </li>
                </ul>
              </div>
            ))}
          </div>

          <div className="footer__bar">
            <p>
              © {new Date().getFullYear()} {company.name}. All rights reserved.
            </p>
            <p>Original Canine Cheese Chews · Since 2008</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
