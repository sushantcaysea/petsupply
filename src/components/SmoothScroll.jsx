import { useEffect, useState } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

const lenisOptions = {
  autoRaf: true,
  lerp: 0.08,
  duration: 1.05,
  smoothWheel: true,
  wheelMultiplier: 0.85,
  touchMultiplier: 1,
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
    ScrollTrigger.refresh()

    return () => {
      lenis.off('scroll', onScroll)
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
        lerp: enabled ? 0.08 : 1,
        duration: enabled ? 1.05 : 0,
      }}
    >
      <LenisScrollTriggerBridge />
      {children}
    </ReactLenis>
  )
}
