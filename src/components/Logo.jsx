const LOGO = '/images/brand/image.png'

export function LogoMark({ className = '' }) {
  return (
    <img
      className={`logo__seal ${className}`.trim()}
      src={LOGO}
      alt=""
      width={80}
      height={80}
      decoding="async"
    />
  )
}

export default function Logo({ className = '' }) {
  return (
    <span className={`logo ${className}`.trim()}>
      <img
        className="logo__img"
        src={LOGO}
        alt="Sansar Pet Supply"
        width={120}
        height={120}
        decoding="async"
      />
    </span>
  )
}
