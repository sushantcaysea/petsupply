import { useEffect, useState } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'

const lenisOptions = {
  autoRaf: true,
  lerp: 0.075,
  duration: 1.2,
  smoothWheel: true,
  wheelMultiplier: 0.92,
  touchMultiplier: 1.1,
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

export default function SmoothScroll({ children }) {
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
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
        lerp: enabled ? 0.075 : 1,
        duration: enabled ? 1.2 : 0,
      }}
    >
      {children}
    </ReactLenis>
  )
}
