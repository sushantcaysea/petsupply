import { useLayoutEffect, useRef } from 'react'
import { useLenis } from 'lenis/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function HeroVideo({
  src = '/videos/hero.mp4',
  className = '',
  pinDistance = 2000,
  startTime = 0,
  endTime = 4,
  frameCount = 72,
  children,
}) {
  const lenis = useLenis()
  const sectionRef = useRef(null)
  const frameRef = useRef(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const frame = frameRef.current
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!section || !frame || !video || !canvas) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let cleanup = () => {}
    const root = document.documentElement
    const body = document.body
    const shouldLockScroll = window.scrollY < 8
    const prevRootOverflow = root.style.overflow
    const prevBodyOverflow = body.style.overflow
    let unlocked = false
    const blockedKeys = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' ', 'Spacebar'])

    const preventWheel = (event) => {
      if (!shouldLockScroll || unlocked) return
      event.preventDefault()
    }

    const preventKeyScroll = (event) => {
      if (!shouldLockScroll || unlocked) return
      if (blockedKeys.has(event.key)) event.preventDefault()
    }

    const unlockScroll = () => {
      if (unlocked || !shouldLockScroll) return
      unlocked = true
      root.style.overflow = prevRootOverflow
      body.style.overflow = prevBodyOverflow
      lenis?.start()
      window.removeEventListener('wheel', preventWheel)
      window.removeEventListener('touchmove', preventWheel)
      window.removeEventListener('keydown', preventKeyScroll)
    }

    if (shouldLockScroll) {
      root.style.overflow = 'hidden'
      body.style.overflow = 'hidden'
      lenis?.stop()
      window.addEventListener('wheel', preventWheel, { passive: false })
      window.addEventListener('touchmove', preventWheel, { passive: false })
      window.addEventListener('keydown', preventKeyScroll)
    }

    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return undefined
    const stageCanvas = document.createElement('canvas')
    const stageCtx = stageCanvas.getContext('2d', { alpha: false })
    if (!stageCtx) return undefined

    const bitmaps = []
    let disposed = false

    const drawCover = (source, targetCtx = ctx, targetCanvas = canvas) => {
      const vw = source.videoWidth || source.width
      const vh = source.videoHeight || source.height
      const bounds = frame.getBoundingClientRect()
      const cw = Math.max(1, Math.round(bounds.width))
      const ch = Math.max(1, Math.round(bounds.height))
      targetCanvas.width = cw
      targetCanvas.height = ch
      const scale = Math.max(cw / vw, ch / vh)
      const dw = vw * scale
      const dh = vh * scale
      const dx = (cw - dw) / 2
      const dy = (ch - dh) / 2
      targetCtx.clearRect(0, 0, cw, ch)
      targetCtx.drawImage(source, dx, dy, dw, dh)
    }

    const captureFrame = () =>
      new Promise((resolve) => {
        const onSeeked = async () => {
          video.removeEventListener('seeked', onSeeked)
          drawCover(video, stageCtx, stageCanvas)
          const bitmap = await createImageBitmap(stageCanvas)
          resolve(bitmap)
        }
        video.addEventListener('seeked', onSeeked, { once: true })
      })

    const init = async () => {
      if (!video.duration || Number.isNaN(video.duration)) return

      video.pause()

      const safeEnd = Math.min(video.duration - 0.001, Math.max(startTime + 0.05, endTime))
      const safeStart = Math.max(0, Math.min(startTime, safeEnd - 0.05))
      const steps = Math.max(2, frameCount)

      // Draw the first usable frame immediately so refreshes never show a black hero.
      video.currentTime = safeStart
      const firstFrame = await captureFrame()
      if (disposed) {
        firstFrame.close?.()
        return
      }
      bitmaps.push(firstFrame)
      drawCover(firstFrame)
      frame.classList.add('is-ready')

      if (reduce) {
        frame.style.setProperty('--hero-video-progress', '0')
        unlockScroll()
        return
      }

      const proxy = { progress: 0 }
      let raf = 0
      let lastIndex = -1

      const render = () => {
        raf = 0
        const maxIndex = Math.max(0, bitmaps.length - 1)
        const index = Math.min(maxIndex, Math.round(proxy.progress * maxIndex))
        if (index !== lastIndex && bitmaps[index]) {
          lastIndex = index
          drawCover(bitmaps[index])
        }
        frame.style.setProperty('--hero-video-progress', proxy.progress.toFixed(4))
      }

      const queueRender = () => {
        if (raf) return
        raf = requestAnimationFrame(render)
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${pinDistance}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      timeline.to(
        proxy,
        {
          progress: 1,
          ease: 'none',
          onUpdate: queueRender,
        },
        0,
      )

      const preloadRemainingFrames = async () => {
        for (let i = 1; i < steps; i += 1) {
          if (disposed) return
          const progress = i / (steps - 1)
          const target = safeStart + (safeEnd - safeStart) * progress
          video.currentTime = target
          // eslint-disable-next-line no-await-in-loop
          const bitmap = await captureFrame()
          if (disposed) {
            bitmap.close?.()
            return
          }
          bitmaps.push(bitmap)
          queueRender()
        }
        unlockScroll()
      }

      preloadRemainingFrames()

      cleanup = () => {
        if (raf) cancelAnimationFrame(raf)
        timeline.scrollTrigger?.kill()
        timeline.kill()
      }
    }

    const loadVideo = () => {
      video.src = src
      video.load()
    }

    const onLoadedMetadata = () => init()
    video.addEventListener('loadedmetadata', onLoadedMetadata)
    loadVideo()

    return () => {
      disposed = true
      unlockScroll()
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      bitmaps.forEach((bitmap) => bitmap.close?.())
      cleanup()
    }
  }, [endTime, frameCount, lenis, pinDistance, src, startTime])

  return (
    <section
      ref={sectionRef}
      className={['hero-video', className].filter(Boolean).join(' ')}
      aria-label="Hero animation"
    >
      <div ref={frameRef} className="hero-video__frame">
        <div className="hero-video__media">
          <canvas ref={canvasRef} className="hero-video__canvas" aria-hidden="true" />
          <video
            ref={videoRef}
            className="hero-video__video"
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            aria-hidden="true"
          />
          <span className="hero-video__shade" aria-hidden="true" />
        </div>
        {children ? <div className="hero-video__content">{children}</div> : null}
      </div>
    </section>
  )
}
