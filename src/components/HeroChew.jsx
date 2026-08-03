import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import ChewShowcase3D from './ChewShowcase3D'

export default function HeroChew({ className = '', children }) {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const parallaxRef = useRef(null)
  const productRef = useRef(null)
  const contentRef = useRef(null)
  const cueRef = useRef(null)
  const floorRef = useRef(null)
  const glowRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const stage = stageRef.current
    const parallax = parallaxRef.current
    const product = productRef.current
    const content = contentRef.current
    const cue = cueRef.current
    const floor = floorRef.current
    const glow = glowRef.current
    if (!section || !stage || !product || !parallax) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const isCompact = window.matchMedia('(max-width: 960px)').matches
    const floatY = isCompact ? -6 : -11
    const shadowScaleX = isCompact ? 0.86 : 0.78
    const shadowY = isCompact ? 3 : 5

    const ctx = gsap.context(() => {
      if (content) {
        gsap.fromTo(
          content.children,
          { autoAlpha: 0, y: isCompact ? 14 : 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: reduce ? 0.01 : isCompact ? 0.55 : 0.7,
            stagger: reduce ? 0 : isCompact ? 0.05 : 0.08,
            ease: 'power3.out',
            delay: reduce ? 0 : 0.08,
          },
        )
      }

      if (!reduce) {
        gsap.fromTo(
          stage,
          { autoAlpha: 0, y: isCompact ? 18 : 28, scale: 0.95 },
          { autoAlpha: 1, y: 0, scale: 1, duration: isCompact ? 0.75 : 1, ease: 'power3.out', delay: 0.12 },
        )

        if (floor) {
          gsap.fromTo(
            floor,
            { autoAlpha: 0, scaleX: 0.55 },
            { autoAlpha: 1, scaleX: 1, duration: 0.85, ease: 'power2.out', delay: 0.4 },
          )
        }

        const breathe = gsap.timeline({
          repeat: -1,
          yoyo: true,
          defaults: { duration: isCompact ? 3.8 : 3.4, ease: 'sine.inOut' },
          delay: 1.1,
        })
        breathe.to(product, { y: floatY }, 0)
        if (floor) {
          breathe.to(
            floor,
            {
              scaleX: shadowScaleX,
              scaleY: 0.88,
              autoAlpha: 0.55,
              y: shadowY,
            },
            0,
          )
        }
        if (glow) {
          breathe.to(glow, { scale: 1.06, autoAlpha: 0.55 }, 0)
        }
      }

      if (cue) {
        gsap.fromTo(cue, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.55, delay: 0.85 })
        if (!reduce) {
          gsap.to(cue.querySelector('i'), {
            y: 6,
            duration: 1.1,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
            delay: 1.1,
          })
        }
      }
    }, section)

    let onMove
    let onLeave

    if (!reduce && finePointer) {
      gsap.set(parallax, { transformPerspective: 900 })

      const px = gsap.quickTo(parallax, 'x', { duration: 0.75, ease: 'power3.out' })
      const py = gsap.quickTo(parallax, 'y', { duration: 0.75, ease: 'power3.out' })
      const rx = gsap.quickTo(parallax, 'rotateX', { duration: 0.85, ease: 'power3.out' })
      const ry = gsap.quickTo(parallax, 'rotateY', { duration: 0.85, ease: 'power3.out' })
      const gx = glow ? gsap.quickTo(glow, 'x', { duration: 1, ease: 'power3.out' }) : null
      const gy = glow ? gsap.quickTo(glow, 'y', { duration: 1, ease: 'power3.out' }) : null

      onMove = (event) => {
        const rect = section.getBoundingClientRect()
        if (!rect.width || !rect.height) return
        const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2
        const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2
        px(nx * 16)
        py(ny * 10)
        ry(nx * 5)
        rx(-ny * 3.5)
        gx?.(nx * 28)
        gy?.(ny * 20)
      }

      onLeave = () => {
        px(0)
        py(0)
        rx(0)
        ry(0)
        gx?.(0)
        gy?.(0)
      }

      section.addEventListener('pointermove', onMove)
      section.addEventListener('pointerleave', onLeave)
    }

    return () => {
      if (onMove) section.removeEventListener('pointermove', onMove)
      if (onLeave) section.removeEventListener('pointerleave', onLeave)
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className={['hero-chew', className].filter(Boolean).join(' ')}
      aria-label="Sansaar Pet Supply canine cheese chew"
    >
      <div className="hero-chew__atmosphere" aria-hidden="true">
        <span className="hero-chew__wash hero-chew__wash--a" />
        <span className="hero-chew__wash hero-chew__wash--b" />
        <span className="hero-chew__grain" />
      </div>

      <div className="hero-chew__layout">
        {children ? (
          <div ref={contentRef} className="hero-chew__content">
            {children}
          </div>
        ) : null}

        <div ref={stageRef} className="hero-chew__visual">
          <div className="hero-chew__showcase">
            <div ref={parallaxRef} className="hero-chew__parallax">
              <span ref={glowRef} className="hero-chew__catch" aria-hidden="true" />
              <div ref={productRef} className="hero-chew__product">
                <ChewShowcase3D spinning />
              </div>
              <span className="hero-chew__mirror" aria-hidden="true" />
              <span className="hero-chew__floor-wrap" aria-hidden="true">
                <span ref={floorRef} className="hero-chew__floor" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <div ref={cueRef} className="hero-chew__cue" aria-hidden="true">
        <span>Scroll</span>
        <i />
      </div>
    </section>
  )
}
