export const LOGO = '/images/brand/logo-full-light.png'

export default function Logo({ className = '' }) {
  return (
    <span className={`logo ${className}`.trim()}>
      <img
        className="logo__img"
        src={LOGO}
        alt="Sansar Pet Supply"
        width={592}
        height={592}
        decoding="async"
      />
    </span>
  )
}
