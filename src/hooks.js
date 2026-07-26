import { useEffect, useRef, useState } from 'react'

export function useReveal(rootRef) {
  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const nodes = [...root.querySelectorAll('[data-reveal]')]
    const reveal = (node) => {
      node.classList.add('is-visible')
      node.querySelectorAll('[data-reveal]').forEach((child) => {
        child.classList.add('is-visible')
      })
    }

    if (typeof IntersectionObserver === 'undefined') {
      nodes.forEach(reveal)
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          // Wait until a meaningful portion is on screen for assemble fly-ins
          const needsMore =
            entry.target.getAttribute('data-reveal') === 'assemble' ||
            entry.target.classList.contains('story__assemble')
          if (needsMore && entry.intersectionRatio < 0.18) return
          reveal(entry.target)
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: [0.12, 0.2, 0.35],
        rootMargin: '0px 0px -8% 0px',
      },
    )

    nodes.forEach((node) => {
      const rect = node.getBoundingClientRect()
      // Only auto-reveal if already clearly in the viewport (not just near it)
      const inView =
        rect.top < window.innerHeight * 0.82 &&
        rect.bottom > window.innerHeight * 0.12 &&
        rect.top < window.innerHeight
      if (inView && node.getAttribute('data-reveal') !== 'assemble') reveal(node)
      else observer.observe(node)
    })

    return () => {
      observer.disconnect()
    }
  }, [rootRef])
}

export function useParallax(pageRef) {
  useEffect(() => {
    const root = pageRef.current
    if (!root) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

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
        node.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`)
      })
    }

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
  }, [pageRef])
}

export function usePageMotion() {
  const pageRef = useRef(null)
  useReveal(pageRef)
  useParallax(pageRef)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return pageRef
}

export function useCountUp(active, target, duration = 1400) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return undefined
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
