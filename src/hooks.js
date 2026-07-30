import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useLenis } from 'lenis/react'

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useReveal(rootRef, key = 0) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const nodes = [...root.querySelectorAll('[data-reveal]')]
    const reduce = prefersReducedMotion()

    const reveal = (node) => {
      node.classList.add('is-visible')
      node.querySelectorAll('[data-reveal]').forEach((child) => {
        child.classList.add('is-visible')
      })
    }

    if (reduce || typeof IntersectionObserver === 'undefined') {
      nodes.forEach(reveal)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          if (entry.intersectionRatio < 0.08) return
          reveal(entry.target)
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: [0.08, 0.18, 0.32, 0.5],
        rootMargin: '0px 0px -8% 0px',
      },
    )

    const frame = requestAnimationFrame(() => {
      nodes.forEach((node, index) => {
        // Auto stagger siblings that share a parent and have no delay set
        if (!node.hasAttribute('data-delay')) {
          const siblings = [...node.parentElement?.children || []].filter((el) =>
            el.hasAttribute?.('data-reveal'),
          )
          if (siblings.length > 1) {
            const i = siblings.indexOf(node)
            if (i > 0) node.style.setProperty('--d', String(Math.min(i, 8)))
          }
        }

        const rect = node.getBoundingClientRect()
        const inView =
          rect.top < window.innerHeight * 0.9 &&
          rect.bottom > window.innerHeight * 0.05 &&
          rect.top < window.innerHeight

        // Stagger hero-adjacent items slightly on first paint
        if (inView) {
          window.setTimeout(() => reveal(node), Math.min(index, 6) * 40)
        } else {
          observer.observe(node)
        }
      })
    })

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [rootRef, key])
}

export function useParallax(pageRef, key = 0) {
  const updateRef = useRef(() => {})

  useEffect(() => {
    const root = pageRef.current
    if (!root) return undefined
    if (prefersReducedMotion()) return undefined

    const nodes = [...root.querySelectorAll('[data-parallax]')]
    if (!nodes.length) return undefined

    let frame = 0
    const update = () => {
      frame = 0
      const vh = window.innerHeight
      nodes.forEach((node) => {
        const speed = Number(node.dataset.parallax) || 0.12
        const rect = node.getBoundingClientRect()
        const center = rect.top + rect.height / 2
        const offset = ((center - vh / 2) / vh) * -speed * 100
        const scale = 1 + Math.min(Math.abs(offset) / 800, 0.08)
        node.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`)
        node.style.setProperty('--parallax-scale', scale.toFixed(4))
      })
    }
    updateRef.current = update

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [pageRef, key])

  useLenis(() => {
    updateRef.current()
  }, [key])
}

/** Soft scale on media while it scrolls through the viewport */
export function useMediaDrift(pageRef, key = 0) {
  const updateRef = useRef(() => {})

  useEffect(() => {
    const root = pageRef.current
    if (!root) return undefined
    if (prefersReducedMotion()) return undefined

    const medias = [
      ...root.querySelectorAll(
        '.kb-split__media img, .kb-split__media video, .split__visual img, .split__visual video, .step__media img, .benefit__media:not(.benefit__media--text) img, .product__shots img, .gallery figure:not(.has-text) img, .kb-card__media img, .kb-sku__media img, .mosaic img, .page-hero__media img, .page-hero__media video',
      ),
    ]
    if (!medias.length) return undefined

    let frame = 0
    const update = () => {
      frame = 0
      const vh = window.innerHeight
      medias.forEach((media) => {
        const parent = media.parentElement
        if (!parent) return
        const revealHost = media.closest('[data-reveal]')
        if (revealHost && !revealHost.classList.contains('is-visible')) return
        const rect = parent.getBoundingClientRect()
        if (rect.bottom < -40 || rect.top > vh + 40) return
        const progress = (vh / 2 - (rect.top + rect.height / 2)) / vh
        const y = progress * 28
        const scale = 1.08 + Math.abs(progress) * 0.04
        media.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`
      })
    }
    updateRef.current = update

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [pageRef, key])

  useLenis(() => {
    updateRef.current()
  }, [key])
}

export function usePageMotion() {
  const pageRef = useRef(null)
  const { pathname } = useLocation()
  useReveal(pageRef, pathname)
  useParallax(pageRef, pathname)
  useMediaDrift(pageRef, pathname)

  useEffect(() => {
    const root = pageRef.current
    if (!root) return undefined
    root.classList.remove('page-enter')
    // force reflow for route re-entry
    void root.offsetWidth
    root.classList.add('page-enter')
    return undefined
  }, [pathname])

  return pageRef
}

export function useCountUp(active, target, duration = 1400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return undefined
    if (prefersReducedMotion()) {
      setValue(target)
      return undefined
    }
    let frame
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      setValue(Math.round(target * eased))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [active, target, duration])
  return value
}

/** Scroll progress 0–1 through a tall sticky section */
export function useScrollProgress(sectionRef) {
  const [progress, setProgress] = useState(0)

  const update = useCallback(() => {
    const el = sectionRef.current
    if (!el) return
    const total = el.offsetHeight - window.innerHeight
    if (total <= 0) {
      setProgress(0)
      return
    }
    const top = el.getBoundingClientRect().top
    const scrolled = Math.min(Math.max(-top, 0), total)
    setProgress(scrolled / total)
  }, [sectionRef])

  useLenis(() => {
    update()
  }, [update])

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        update()
      })
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [update])

  return progress
}

/**
 * Enter progress 0–1 as an element approaches mid-viewport.
 * Scrolls forward on the way down, reverses on the way up.
 */
export function useViewProgress(sectionRef, { from = 0.92, to = 0.4 } = {}) {
  const [progress, setProgress] = useState(0)

  const update = useCallback(() => {
    const el = sectionRef.current
    if (!el) return
    if (prefersReducedMotion()) {
      setProgress(1)
      return
    }
    const top = el.getBoundingClientRect().top
    const vh = window.innerHeight
    const start = vh * from
    const end = vh * to
    const t = (start - top) / Math.max(1, start - end)
    setProgress(Math.min(1, Math.max(0, t)))
  }, [sectionRef, from, to])

  useLenis(() => {
    update()
  }, [update])

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        update()
      })
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [update])

  return progress
}

/**
 * 0–1 as an element crosses the viewport (works for short sections too).
 * Used for process film scrubbing.
 */
export function useCrossingProgress(sectionRef) {
  const [progress, setProgress] = useState(0)

  const update = useCallback(() => {
    const el = sectionRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    const total = rect.height + vh * 0.55
    const scrolled = vh * 0.88 - rect.top
    setProgress(Math.min(1, Math.max(0, scrolled / Math.max(1, total))))
  }, [sectionRef])

  useLenis(() => {
    update()
  }, [update])

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        update()
      })
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [update])

  return progress
}

/**
 * Moves a fixed flyer from startSlot → endSlot while scrolling between them.
 * progress 0 = parked on start, 1 = docked on end.
 */
export function useProductFlight(startRef, endRef, flyerRef) {
  const updateRef = useRef(() => {})
  const spanRef = useRef(0)

  useLayoutEffect(() => {
    const start = startRef.current
    const end = endRef.current
    const flyer = flyerRef.current
    if (!start || !end || !flyer) return undefined

    if (prefersReducedMotion()) {
      flyer.style.visibility = 'hidden'
      flyer.style.opacity = '0'
      start.classList.remove('is-flying')
      end.classList.add('is-filled')
      return undefined
    }

    const lerp = (a, b, t) => a + (b - a) * t
    const ease = (t) => t * t * (3 - 2 * t)
    spanRef.current = 0

    const update = () => {
      const s = start.getBoundingClientRect()
      const e = end.getBoundingClientRect()
      const vh = window.innerHeight
      const dockY = vh * 0.52
      const endMid = e.top + e.height * 0.5
      const remaining = endMid - dockY

      // Capture distance-to-dock once at page top so t starts at 0 (not 1).
      if (!spanRef.current) {
        spanRef.current = Math.max(remaining, vh * 0.75)
      }

      let t = 1 - remaining / spanRef.current
      t = Math.min(1, Math.max(0, t))
      const p = ease(t)
      const flying = p > 0.03 && p < 0.97
      const docked = p >= 0.97

      const x = lerp(s.left, e.left, p)
      const y = lerp(s.top, e.top, p)
      const w = lerp(s.width, e.width, p)
      const h = lerp(s.height, e.height, p)

      flyer.style.visibility = flying ? 'visible' : 'hidden'
      flyer.style.opacity = flying ? '1' : '0'
      flyer.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      flyer.style.width = `${w.toFixed(1)}px`
      flyer.style.height = `${h.toFixed(1)}px`

      start.classList.toggle('is-flying', p > 0.03)
      end.classList.toggle('is-filled', docked)
      flyer.classList.toggle('is-docked', docked)
    }

    updateRef.current = update
    update()
    const boot = requestAnimationFrame(update)

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        update()
      })
    }

    const onResize = () => {
      spanRef.current = 0
      onScroll()
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(boot)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [startRef, endRef, flyerRef])

  useLenis(() => {
    updateRef.current()
  }, [])
}
