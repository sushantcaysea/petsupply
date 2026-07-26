export function LogoMark({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="19" fill="currentColor" opacity="0.14" />

      {/* Left ear */}
      <path
        fill="currentColor"
        d="M7.8 15.8 5.2 3.6c-.3-1.4 1.4-2.35 2.45-1.25L17.4 11.5c.65.55.3 1.6-.55 1.7L9 14.7c-.65.1-1.1.55-1.2 1.1Z"
      />
      {/* Right ear */}
      <path
        fill="currentColor"
        d="M32.2 15.8 34.8 3.6c.3-1.4-1.4-2.35-2.45-1.25L22.6 11.5c-.65.55-.3 1.6.55 1.7L31 14.7c.65.1 1.1.55 1.2 1.1Z"
      />

      {/* Head — eyes + nose cut out so it clearly reads as a dog */}
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M20 10c-6.85 0-12.4 5.15-12.4 11.85 0 6.4 5.05 11.65 12.4 11.65s12.4-5.25 12.4-11.65C32.4 15.15 26.85 10 20 10Zm-4.6 8.35a2.05 2.05 0 1 0 .02 4.1 2.05 2.05 0 0 0-.02-4.1Zm9.2 0a2.05 2.05 0 1 0 .02 4.1 2.05 2.05 0 0 0-.02-4.1ZM20 23.1c-1.55 0-2.7.95-2.7 1.7 0 .75 1.15 1.7 2.7 1.7s2.7-.95 2.7-1.7c0-.75-1.15-1.7-2.7-1.7Z"
      />

      {/* Smile */}
      <path
        d="M16.4 27.6c1.2 1.45 2.4 2.15 3.6 2.15s2.4-.7 3.6-2.15"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.35"
        strokeLinecap="round"
      />

      {/* Little tongue */}
      <path
        fill="currentColor"
        opacity="0.28"
        d="M18.55 29.35c.45 2.4 1 3.55 1.45 3.55s1-1.15 1.45-3.55c-.9.4-2 .4-2.9 0Z"
      />
    </svg>
  )
}

export default function Logo({ className = '', markClassName = '' }) {
  return (
    <span className={`logo ${className}`.trim()}>
      <LogoMark className={`logo__mark ${markClassName}`.trim()} />
      <span className="logo__wordmark">
        Sansar<span className="logo__pet"> Pet</span>
      </span>
    </span>
  )
}
