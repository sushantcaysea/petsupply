import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function PageTransition() {
  const { pathname } = useLocation()
  const [on, setOn] = useState(false)

  useEffect(() => {
    setOn(true)
    const t = window.setTimeout(() => setOn(false), 420)
    return () => window.clearTimeout(t)
  }, [pathname])

  return <div className={`veil ${on ? 'is-on' : ''}`} aria-hidden="true" />
}
