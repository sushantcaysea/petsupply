import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

export default function GlassShowcase({
  src,
  alt = 'Original Canine Cheese Chew',
  className = '',
  dockRef,
  productRef,
  active = false,
}) {
  const rootRef = useRef(null)
  const rotorRef = useRef(null)
  const productWrapRef = useRef(null)

  useLayoutEffect(() => {
    const rotor = rotorRef.current
    const productWrap = productWrapRef.current
    if (!rotor || !productWrap) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      gsap.set(rotor, { transformOrigin: '50% 100%' })
      gsap.set(productWrap, { transformOrigin: '50% 85%' })

      if (reduce) {
        gsap.set(productWrap, { rotateY: -14, rotateX: 5 })
        return
      }

      // Floor disc keeps turning like a museum stand.
      const stand = gsap.to(rotor, {
        rotateY: 360,
        duration: 18,
        ease: 'none',
        repeat: -1,
        paused: !active,
      })

      // Chew itself turns enough to feel dimensional without vanishing edge-on.
      const chew = gsap.to(productWrap, {
        rotateY: 28,
        rotateX: 8,
        duration: 3.6,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        paused: !active,
      })

      const bob = gsap.to(productWrap, {
        y: -12,
        duration: 2.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        paused: !active,
      })

      rootRef.current._glassTweens = { stand, chew, bob }
    }, rootRef)

    return () => {
      if (rootRef.current) rootRef.current._glassTweens = null
      ctx.revert()
    }
  }, [])

  useLayoutEffect(() => {
    const root = rootRef.current
    const tweens = root?._glassTweens
    if (!tweens) return

    Object.values(tweens).forEach((tween) => {
      if (active) tween.resume()
      else tween.pause()
    })

    if (active && productWrapRef.current) {
      gsap.fromTo(
        productWrapRef.current,
        { scale: 0.9, autoAlpha: 0.35 },
        { scale: 1, autoAlpha: 1, duration: 0.6, ease: 'power2.out' },
      )
    }
  }, [active])

  return (
    <div
      ref={(node) => {
        rootRef.current = node
        if (typeof dockRef === 'function') dockRef(node)
        else if (dockRef) dockRef.current = node
      }}
      className={['glass-case', active ? 'is-filled' : 'is-waiting', className].filter(Boolean).join(' ')}
      aria-label="Product glass showcase"
    >
      <div className="glass-case__frame">
        <span className="glass-case__rim glass-case__rim--top" aria-hidden="true" />
        <span className="glass-case__rim glass-case__rim--bottom" aria-hidden="true" />
        <div className="glass-case__chamber">
          <div className="glass-case__glow" aria-hidden="true" />
          <div ref={rotorRef} className="glass-case__rotor">
            <div className="glass-case__plinth" aria-hidden="true">
              <span />
            </div>
            <div ref={productWrapRef} className="glass-case__product-wrap">
              <img
                ref={productRef}
                className="glass-case__product"
                src={src}
                alt={alt}
                width={640}
                height={640}
                decoding="async"
              />
            </div>
          </div>
          <span className="glass-case__glass" aria-hidden="true" />
          <span className="glass-case__sheen" aria-hidden="true" />
        </div>
      </div>
      <p className="glass-case__tag">Estate chew · glass display</p>
    </div>
  )
}
