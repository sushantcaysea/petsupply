/**
 * Staggered word reveal for display headlines.
 * Uses data-reveal="text" — observed by useReveal like other reveals.
 */
export default function RevealText({
  as: Tag = 'h2',
  children,
  className = '',
  delay = 0,
  ...rest
}) {
  const text = typeof children === 'string' ? children : String(children ?? '')
  const words = text.split(/(\s+)/).filter(Boolean)

  let wordIndex = 0

  return (
    <Tag
      className={`reveal-text ${className}`.trim()}
      data-reveal="text"
      data-delay={delay > 0 ? String(delay) : undefined}
      aria-label={text}
      {...rest}
    >
      {words.map((token, i) => {
        if (/^\s+$/.test(token)) {
          return <span key={`s-${i}`}>{token}</span>
        }
        const index = wordIndex
        wordIndex += 1
        return (
          <span
            key={`w-${i}`}
            className="reveal-text__word"
            style={{ '--i': index }}
            aria-hidden="true"
          >
            <span className="reveal-text__inner">{token}</span>
          </span>
        )
      })}
    </Tag>
  )
}
