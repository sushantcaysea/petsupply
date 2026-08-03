import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useLenis } from 'lenis/react'
import { company, navLinks } from '../data'
import { useReveal } from '../hooks'
import Logo from './Logo'
import PageTransition from './PageTransition'
import { useLenisLock } from './SmoothScroll'

export default function Layout() {
  const location = useLocation()
  const lenis = useLenis()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [progress, setProgress] = useState(0)
  const footerRef = useRef(null)

  useLenisLock(menuOpen)
  useReveal(footerRef, location.pathname)

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useLayoutEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
    const frame = requestAnimationFrame(() => {
      if (lenis) lenis.scrollTo(0, { immediate: true })
      else window.scrollTo(0, 0)
    })
    return () => cancelAnimationFrame(frame)
  }, [location.pathname, lenis])

  useEffect(() => {
    setMenuOpen(false)
    setScrolled((lenis?.scroll ?? window.scrollY) > 16)
  }, [location.pathname, lenis])

  useLenis(
    (instance) => {
      setScrolled(instance.scroll > 16)
      const max = instance.limit || 1
      setProgress(max > 0 ? (instance.scroll / max) * 100 : 0)
    },
    [location.pathname],
  )

  useEffect(() => {
    if (lenis) return undefined
    const onScroll = () => {
      setScrolled(window.scrollY > 16)
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lenis, location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)
  const jumpToHero = (to) => {
    closeMenu()
    const targetPath =
      typeof to === 'string' ? to.split('#')[0] : typeof to?.pathname === 'string' ? to.pathname : ''
    if (targetPath && targetPath === location.pathname) {
      if (lenis) lenis.scrollTo(0, { duration: 1.05 })
      else window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="page">
      <PageTransition />
      <div className="scroll-progress" style={{ width: `${progress}%` }} aria-hidden="true" />

      <header className={`nav ${scrolled ? 'nav--scrolled' : ''} ${menuOpen ? 'nav--open' : ''}`}>
        <div className="nav__shell">
          <Link to="/" className="nav__brand" onClick={() => jumpToHero('/')} aria-label="Sansar Pet Supply home">
            <Logo />
            <span className="nav__brand-meta" aria-hidden="true">
              <span>Est. 2008</span>
              <span>Himalaya</span>
            </span>
          </Link>

          <nav className="nav__rail" aria-label="Primary">
            <div className="nav__links">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => jumpToHero(link.to)}
                  className={({ isActive }) => (isActive ? 'is-active' : undefined)}
                >
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>

          <div className="nav__actions">
            <span className="nav__coords" aria-hidden="true">
              27°N · 85°E
            </span>
            <Link className="nav__cta" to="/contact" onClick={() => jumpToHero('/contact')}>
              <span>Wholesale</span>
            </Link>
            <button
              className="nav__toggle"
              type="button"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>

        <div id="mobile-nav" className="nav__drawer">
          <p className="nav__drawer-kicker">Navigate the range</p>
          <NavLink to="/" end onClick={() => jumpToHero('/')}>
            Home
          </NavLink>
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} onClick={() => jumpToHero(link.to)}>
              {link.label}
            </NavLink>
          ))}
          <Link to="/contact" className="nav__drawer-cta" onClick={() => jumpToHero('/contact')}>
            Request wholesale
          </Link>
        </div>
      </header>

      <Outlet />

      {!menuOpen ? (
        <div className="dock">
          <Link className="btn btn--primary" to="/contact" onClick={() => jumpToHero('/contact')}>
            Request wholesale
          </Link>
        </div>
      ) : null}

      <footer className="footer" ref={footerRef}>
        <div className="footer__cta" data-reveal="up">
          <div>
            <p className="eyebrow">Wholesale</p>
            <h2>Ready to stock the chew?</h2>
            <p>Custom sizes, private label, Nepal-to-warehouse supply.</p>
          </div>
          <Link className="btn btn--primary" to="/contact">
            Request wholesale
          </Link>
        </div>

        <div className="footer__grid">
          <div data-reveal="up">
            <div className="footer__brand">
              <Logo />
            </div>
            <p>{company.blurb}</p>
          </div>
          <div data-reveal="up" data-delay="1">
            <span>Explore</span>
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
            <Link to="/gallery">Gallery</Link>
          </div>
          {company.offices.map((office, i) => (
            <div key={office.region} data-reveal="up" data-delay={String(i + 2)}>
              <span>{office.region}</span>
              <p>{office.place}</p>
              {office.email ? <a href={`mailto:${office.email}`}>{office.email}</a> : null}
              <a href={office.phoneHref}>{office.phone}</a>
            </div>
          ))}
        </div>

        <div className="footer__bar" data-reveal="up">
          <p>
            © {new Date().getFullYear()} {company.name}
          </p>
          <div>
            <Link to="/sitemap">Sitemap</Link>
            {company.socials.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer">
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
