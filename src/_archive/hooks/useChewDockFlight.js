import { useLayoutEffect } from 'react'
import { useLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll-scrubs a fixed flyer from the hero product slot into the Why Sansaar dock.
 * `heroApi` must be the live handle from HeroChew (via onReady).
 */
export function useChewDockFlight({ heroApi, dockRef, dockImgRef, flyerRef, onDockedChange }) {
  const lenis = useLenis()

  useLayoutEffect(() => {
    const dock = dockRef.current
    const dockImg = dockImgRef.current
    const flyer = flyerRef.current
    const sourceSlot = heroApi?.productSlot
    const source = heroApi?.productImg || sourceSlot
    const heroSection = heroApi?.section
    if (!heroApi || !source || !sourceSlot || !dock || !dockImg || !flyer) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduce) {
      flyer.style.visibility = 'hidden'
      flyer.style.opacity = '0'
      dock.classList.add('is-filled')
      onDockedChange?.(true)
      return undefined
    }

    const ease = gsap.parseEase('power2.inOut')
    let lastMode = ''

    const placeFlyer = (p) => {
      const s = source.getBoundingClientRect()
      const e = dockImg.getBoundingClientRect()
      const t = ease(Math.min(1, Math.max(0, p)))
      const x = gsap.utils.interpolate(s.left, e.left, t)
      const y = gsap.utils.interpolate(s.top, e.top, t)
      const w = gsap.utils.interpolate(s.width, e.width, t)
      const h = gsap.utils.interpolate(s.height, e.height, t)
      const rotate = gsap.utils.interpolate(-8, 0, t)
      const scaleNudge = 1 + Math.sin(t * Math.PI) * 0.1

      const flying = p > 0.012 && p < 0.992
      const docked = p >= 0.992
      const home = p <= 0.012

      flyer.style.visibility = flying ? 'visible' : 'hidden'
      flyer.style.opacity = flying ? '1' : '0'
      flyer.style.width = `${w}px`
      flyer.style.height = `${h}px`
      flyer.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scaleNudge})`

      const mode = docked ? 'docked' : flying ? 'flying' : 'home'
      if (mode !== lastMode) {
        lastMode = mode
        sourceSlot.classList.toggle('is-flying', !home)
        heroSection?.classList.toggle('is-flight-active', !home)
        dock.classList.toggle('is-filled', docked)
        flyer.classList.toggle('is-docked', docked)
        onDockedChange?.(docked)
        if (home) heroApi.resumeOrbit?.()
        else heroApi.pauseOrbit?.()
      }

      heroSection?.style.setProperty('--hero-flight', t.toFixed(4))
    }

    placeFlyer(0)

    const tween = gsap.to(
      {},
      {
        ease: 'none',
        scrollTrigger: {
          trigger: sourceSlot,
          start: 'center 64%',
          endTrigger: dock,
          end: 'center 56%',
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => placeFlyer(self.progress),
          onRefresh: (self) => placeFlyer(self.progress),
        },
      },
    )

    const onLenis = () => ScrollTrigger.update()
    lenis?.on('scroll', onLenis)

    const onResize = () => {
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize)
    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      lenis?.off('scroll', onLenis)
      window.removeEventListener('resize', onResize)
      tween.scrollTrigger?.kill()
      tween.kill()
      sourceSlot.classList.remove('is-flying')
      heroSection?.classList.remove('is-flight-active')
      dock.classList.remove('is-filled')
      flyer.style.opacity = '0'
      flyer.style.visibility = 'hidden'
      heroSection?.style.removeProperty('--hero-flight')
      heroApi.resumeOrbit?.()
      onDockedChange?.(false)
    }
  }, [dockImgRef, dockRef, flyerRef, heroApi, lenis, onDockedChange])
}
