import { Children, cloneElement, createContext, isValidElement, useContext, useRef } from 'react'
import { useViewProgress } from '../hooks'

const CurtainContext = createContext(1)

export function easeScene(t) {
  return t * t * (3 - 2 * t)
}

function stagger(progress, index, start = 0.04, step = 0.1, span = 0.28) {
  const t = Math.min(1, Math.max(0, (progress - (start + index * step)) / span))
  return easeScene(t)
}

/** Scroll-linked opposing-side entrance — reverses on scroll up. */
export default function CurtainSplit({
  as: Tag = 'section',
  className = '',
  style,
  from = 0.94,
  to = 0.42,
  children,
  ...rest
}) {
  const ref = useRef(null)
  const progress = easeScene(useViewProgress(ref, { from, to }))

  return (
    <Tag
      ref={ref}
      className={['curtain-split', className].filter(Boolean).join(' ')}
      style={{ ...style, '--curtain': progress }}
      {...rest}
    >
      <CurtainContext.Provider value={progress}>{children}</CurtainContext.Provider>
    </Tag>
  )
}

/**
 * Copy slides in from its outer edge toward center.
 * side: 'left' | 'right' — which half of the split this copy sits on.
 */
export function CurtainCopy({ side = 'left', className = '', solid = false, children }) {
  const progress = useContext(CurtainContext)
  const items = Children.toArray(children)
  const dir = side === 'left' ? -1 : 1
  const slide = (1 - progress) * (solid ? 48 : 72) * dir

  return (
    <div
      className={['split__copy', 'curtain-split__copy', className].filter(Boolean).join(' ')}
      style={{
        transform: `translate3d(${slide.toFixed(1)}px, 0, 0)`,
        opacity: solid ? 1 : Math.max(0.1, progress),
      }}
    >
      {items.map((child, index) => {
        if (!isValidElement(child)) return child
        const local = solid ? Math.max(0.35, stagger(progress, index)) : stagger(progress, index)
        const itemSlide = (1 - local) * (solid ? 16 : 28) * dir
        const itemBlur = ((1 - local) * (solid ? 5 : 4)).toFixed(2)
        return cloneElement(child, {
          className: [child.props.className, 'curtain-split__item'].filter(Boolean).join(' '),
          style: {
            ...child.props.style,
            opacity: local,
            transform: `translate3d(${itemSlide.toFixed(1)}px, 0, 0)`,
            filter: `blur(${itemBlur}px)`,
          },
        })
      })}
    </div>
  )
}

/**
 * Image/video slides in from the opposite outer edge toward center.
 * side: which half this visual sits on ('left' | 'right').
 */
export function CurtainVisual({ side = 'right', className = '', solid = false, children }) {
  const progress = useContext(CurtainContext)
  const dir = side === 'left' ? -1 : 1
  const slide = (1 - progress) * (solid ? 56 : 96) * dir
  const scale = 1 + (1 - progress) * (solid ? 0.05 : 0.08)
  const blur = ((1 - progress) * (solid ? 10 : 8)).toFixed(2)

  return (
    <div
      className={['split__visual', 'curtain-split__visual', className].filter(Boolean).join(' ')}
      style={{
        transform: `translate3d(${slide.toFixed(1)}px, 0, 0)`,
        opacity: solid ? 1 : Math.max(0.12, progress),
      }}
    >
      <div
        className="curtain-split__media"
        style={{
          transform: `scale(${scale.toFixed(3)})`,
          filter: `blur(${blur}px)`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

/** Freeform panels (Contact) — same opposing inward slide. */
export function CurtainPanel({ as: Tag = 'div', side = 'left', className = '', children, ...rest }) {
  const progress = useContext(CurtainContext)
  const items = Children.toArray(children)
  const dir = side === 'left' ? -1 : 1
  const slide = (1 - progress) * 64 * dir

  return (
    <Tag
      className={['curtain-split__panel', className].filter(Boolean).join(' ')}
      {...rest}
      style={{
        ...rest.style,
        transform: `translate3d(${slide.toFixed(1)}px, 0, 0)`,
        opacity: Math.max(0.1, progress),
      }}
    >
      {items.map((child, index) => {
        if (!isValidElement(child)) return child
        const local = stagger(progress, index, 0.06, 0.1, 0.28)
        const itemSlide = (1 - local) * 22 * dir
        return cloneElement(child, {
          className: [child.props.className, 'curtain-split__item'].filter(Boolean).join(' '),
          style: {
            ...child.props.style,
            opacity: local,
            transform: `translate3d(${itemSlide.toFixed(1)}px, 0, 0)`,
          },
        })
      })}
    </Tag>
  )
}

/**
 * Catalog / card row: media and copy enter from opposite outer edges.
 * flip=true swaps which side the media sits on (matches sku-plate--flip).
 */
export function OpposingCard({
  as: Tag = 'article',
  className = '',
  flip = false,
  mediaClassName = '',
  copyClassName = '',
  media,
  copy,
  from = 0.96,
  to = 0.5,
  ...rest
}) {
  const ref = useRef(null)
  const progress = easeScene(useViewProgress(ref, { from, to }))
  const mediaDir = flip ? 1 : -1
  const copyDir = -mediaDir
  const mediaSlide = (1 - progress) * 88 * mediaDir
  const copySlide = (1 - progress) * 64 * copyDir
  const fade = Math.max(0.14, progress)

  const mediaBlock = (
    <div
      className={['opposing-card__media', mediaClassName].filter(Boolean).join(' ')}
      style={{
        transform: `translate3d(${mediaSlide.toFixed(1)}px, 0, 0)`,
        opacity: fade,
      }}
    >
      {media}
    </div>
  )

  const copyBlock = (
    <div
      className={['opposing-card__copy', copyClassName].filter(Boolean).join(' ')}
      style={{
        transform: `translate3d(${copySlide.toFixed(1)}px, 0, 0)`,
        opacity: fade,
      }}
    >
      {copy}
    </div>
  )

  return (
    <Tag
      ref={ref}
      className={['opposing-card', className].filter(Boolean).join(' ')}
      style={{ '--card-in': progress }}
      {...rest}
    >
      {flip ? (
        <>
          {copyBlock}
          {mediaBlock}
        </>
      ) : (
        <>
          {mediaBlock}
          {copyBlock}
        </>
      )}
    </Tag>
  )
}
