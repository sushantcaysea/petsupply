import { useEffect, useState } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

const lenisOptions = {
  // Driven by GSAP ticker below — keeps scroll + ScrollTrigger in one clock
  autoRaf: false,
  lerp: 0.07,
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.85,
  touchMultiplier: 1.1,
  syncTouch: false,
  anchors: {
    offset: -72,
  },
}

/** Sync Lenis with mobile menu lock and route-level overflow. */
export function useLenisLock(locked) {
  const lenis = useLenis()
  useEffect(() => {
    if (!lenis) return undefined
    if (locked) lenis.stop()
    else lenis.start()
    return () => lenis.start()
  }, [lenis, locked])
}

function LenisScrollTriggerBridge() {
  const lenis = useLenis()

  useEffect(() => {
    if (!lenis) return undefined

    const onScroll = () => ScrollTrigger.update()
    lenis.on('scroll', onScroll)

    const tick = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    ScrollTrigger.refresh()

    return () => {
      lenis.off('scroll', onScroll)
      gsap.ticker.remove(tick)
    }
  }, [lenis])

  return null
}

export default function SmoothScroll({ children }) {
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setEnabled(!mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return (
    <ReactLenis
      root
      options={{
        ...lenisOptions,
        smoothWheel: enabled,
        lerp: enabled ? 0.07 : 1,
        duration: enabled ? 1.2 : 0,
      }}
    >
      <LenisScrollTriggerBridge />
      {children}
    </ReactLenis>
  )
}
