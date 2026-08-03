import { useEffect, useRef } from 'react'

/**
 * Seamless loop via two stacked muted videos + opacity crossfade at the loop point.
 */
export default function LoopFilm({ src, className = '', poster }) {
  const rootRef = useRef(null)
  const aRef = useRef(null)
  const bRef = useRef(null)

  useEffect(() => {
    const a = aRef.current
    const b = bRef.current
    const root = rootRef.current
    if (!a || !b || !root) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      a.pause()
      b.pause()
      root.dataset.active = 'poster'
      return undefined
    }

    const crossfadeMs = 1200
    let active = 'a'
    let fading = false
    let raf = 0

    const prep = (video) => {
      video.muted = true
      video.playsInline = true
      video.loop = false
      video.playbackRate = 0.6
    }

    prep(a)
    prep(b)
    root.dataset.active = 'a'

    const playSafe = (video) => {
      const p = video.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    }

    const syncClasses = () => {
      a.classList.toggle('is-on', active === 'a')
      b.classList.toggle('is-on', active === 'b')
      root.dataset.active = active
    }

    const onMeta = () => playSafe(a)
    if (a.readyState >= 1) onMeta()
    else a.addEventListener('loadedmetadata', onMeta)

    const tick = () => {
      raf = requestAnimationFrame(tick)
      const lead = active === 'a' ? a : b
      const trail = active === 'a' ? b : a
      if (!lead.duration || Number.isNaN(lead.duration) || fading) return

      const remain = lead.duration - lead.currentTime
      if (remain <= crossfadeMs / 1000) {
        fading = true
        try {
          trail.currentTime = 0
        } catch {
          /* ignore */
        }
        playSafe(trail)
        active = active === 'a' ? 'b' : 'a'
        syncClasses()
        window.setTimeout(() => {
          fading = false
          lead.pause()
        }, crossfadeMs)
      }
    }

    syncClasses()
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      a.removeEventListener('loadedmetadata', onMeta)
    }
  }, [src])

  return (
    <div className={`loop-film ${className}`.trim()} ref={rootRef}>
      {poster ? <img className="loop-film__poster" src={poster} alt="" /> : null}
      <video ref={aRef} className="loop-film__vid is-on" src={src} muted playsInline preload="auto" />
      <video ref={bRef} className="loop-film__vid" src={src} muted playsInline preload="auto" />
    </div>
  )
}
