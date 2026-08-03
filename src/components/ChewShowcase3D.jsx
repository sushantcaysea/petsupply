import { useEffect, useRef } from 'react'

/**
 * Hero product turntable — seamless loop + chroma-key gray plate.
 */
export default function ChewShowcase3D({
  className = '',
  src = '/videos/chew-spin-light-loop.mp4',
  spinning = true,
}) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return undefined

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.loop = true
    video.preload = 'auto'
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return undefined

    const keyR = 216
    const keyG = 216
    const keyB = 216
    const thresh = 52
    const threshSq = thresh * thresh
    const soft = 18

    let raf = 0
    let running = true
    let ready = false

    const paintKeyed = () => {
      const w = video.videoWidth
      const h = video.videoHeight
      if (!(w > 0 && h > 0) || video.readyState < 2) return false

      const maxW = 720
      const scale = Math.min(1, maxW / w)
      const cw = Math.round(w * scale)
      const ch = Math.round(h * scale)
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw
        canvas.height = ch
      }

      ctx.drawImage(video, 0, 0, cw, ch)
      const frame = ctx.getImageData(0, 0, cw, ch)
      const data = frame.data

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const dr = r - keyR
        const dg = g - keyG
        const db = b - keyB
        const distSq = dr * dr + dg * dg + db * db

        if (distSq <= threshSq) {
          const dist = Math.sqrt(distSq)
          if (dist < thresh - soft) {
            data[i + 3] = 0
          } else {
            data[i + 3] = Math.round(((dist - (thresh - soft)) / soft) * 255)
          }
        }
      }

      ctx.putImageData(frame, 0, 0)
      if (!ready) {
        ready = true
        canvas.classList.add('is-ready')
      }
      return true
    }

    const tick = () => {
      if (!running) return
      paintKeyed()
      raf = requestAnimationFrame(tick)
    }

    const playFromStart = () => {
      const start = () => {
        paintKeyed()
        if (!spinning) {
          video.pause()
          return
        }
        const attempt = video.play()
        if (attempt?.catch) attempt.catch(() => {})
      }

      const seekAndStart = () => {
        const onSeeked = () => {
          video.removeEventListener('seeked', onSeeked)
          start()
        }
        video.addEventListener('seeked', onSeeked)
        try {
          if (Math.abs(video.currentTime) > 0.01) video.currentTime = 0
          else {
            // Force a seek event even if already near 0
            video.currentTime = 0.001
            video.currentTime = 0
          }
        } catch {
          video.removeEventListener('seeked', onSeeked)
          start()
        }
      }

      if (video.readyState >= 2) seekAndStart()
      else video.addEventListener('loadeddata', seekAndStart, { once: true })
    }

    playFromStart()
    raf = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      video.pause()
      canvas.classList.remove('is-ready')
    }
  }, [spinning, src])

  return (
    <div
      className={['chew-3d', 'chew-3d--hero', className].filter(Boolean).join(' ')}
      aria-label="Rotating canine cheese chew"
    >
      <div className="chew-3d__stage">
        <video
          ref={videoRef}
          className="chew-3d__source"
          src={src}
          muted
          loop
          playsInline
          preload="auto"
          controls={false}
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
        />
        <canvas ref={canvasRef} className="chew-3d__video" aria-hidden="true" />
      </div>
    </div>
  )
}
