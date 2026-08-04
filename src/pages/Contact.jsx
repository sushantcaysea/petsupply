import { useState } from 'react'
import CurtainSplit, { CurtainPanel } from '../components/CurtainSplit'
import PageHero from '../components/PageHero'
import { company } from '../data'
import { usePageMotion } from '../hooks'
import { imgs } from '../media'

export default function Contact() {
  const pageRef = usePageMotion()
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  })
  const [status, setStatus] = useState('idle')
  const [serverMessage, setServerMessage] = useState('')
  const [submissionId, setSubmissionId] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const usa = company.offices[0]
  const nepal = company.offices[1]

  const handleChange = (key) => (e) => {
    setFormState((s) => ({ ...s, [key]: e.target.value }))
    setFieldErrors((errors) => ({ ...errors, [key]: '' }))
    if (status !== 'idle') {
      setStatus('idle')
      setServerMessage('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    setServerMessage('')
    setFieldErrors({})

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      })
      const payload = await response.json()

      if (!response.ok) {
        setStatus('error')
        setServerMessage(
          payload.message || 'We could not send your enquiry yet. Check your details and try again.',
        )
        setFieldErrors(payload.fieldErrors || {})
        return
      }

      setStatus('success')
      setServerMessage(payload.message)
      setSubmissionId(payload.submissionId || '')
      setFormState({ firstName: '', lastName: '', email: '', phone: '', message: '' })
    } catch {
      setStatus('error')
      setServerMessage(
        'We could not reach the enquiry server. Check your connection, then try again or email us directly.',
      )
    }
  }

  return (
    <main className="main" ref={pageRef}>
      <PageHero
        variant="editorial"
        eyebrow="Contact"
        title="Talk wholesale supply"
        lede="Share size mix, volume, destination, and timing. We confirm when your enquiry is on record."
        image={imgs.contact}
        imagePosition="60% 40%"
      />

      <CurtainSplit className="contact contact-desk" aria-label="Offices and wholesale enquiry">
        <CurtainPanel as="aside" side="left" className="contact-desk__rail">
          <div className="contact-desk__rail-top">
            <p className="contact-desk__stamp">Dispatch desk</p>
            <p className="eyebrow contact-desk__eyebrow">Offices</p>
            <h2>Two desks. One supply line.</h2>
            <ul className="checklist contact-desk__checklist">
              <li>Wholesale &amp; distributor partnerships</li>
              <li>Custom size &amp; packaging</li>
              <li>Confirmed reference on successful send</li>
            </ul>
          </div>

          <div className="contact-desk__ports">
            <article className="contact-desk__port">
              <div className="contact-desk__port-code" aria-hidden="true">
                SEA
              </div>
              <div className="contact-desk__port-body">
                <span>01 · {usa.region}</span>
                <p>{usa.place}</p>
                <a href={`mailto:${usa.email}`}>{usa.email}</a>
                <a href={usa.phoneHref}>{usa.phone}</a>
              </div>
            </article>

            <article className="contact-desk__port">
              <div className="contact-desk__port-code" aria-hidden="true">
                KTM
              </div>
              <div className="contact-desk__port-body">
                <span>02 · {nepal.region}</span>
                <p>{nepal.place}</p>
                <a href={`mailto:${company.email}`}>{company.email}</a>
                <a href={nepal.phoneHref}>{nepal.phone}</a>
              </div>
            </article>
          </div>
        </CurtainPanel>

        <CurtainPanel
          as="form"
          side="right"
          className="contact-desk__ticket"
          onSubmit={handleSubmit}
          noValidate
        >
          <span className="contact-desk__perforation" aria-hidden="true" />

          {status === 'success' ? (
            <div className="form-success contact-desk__success" role="status">
              <p className="contact-desk__stamp">On record</p>
              <h3>Your request is logged</h3>
              <p>
                {serverMessage} {submissionId ? `Reference: ${submissionId}.` : ''} Email{' '}
                <a href={`mailto:${company.email}`}>{company.email}</a> if you need to add detail.
              </p>
            </div>
          ) : (
            <>
              <header className="contact-desk__ticket-head">
                <p className="contact-desk__stamp">Wholesale ticket</p>
                <p className="eyebrow contact-desk__eyebrow">Enquiry</p>
                <h3>Request wholesale info</h3>
                <p className="contact-desk__lede">
                  Include size mix, estimated volume, destination market, and preferred timeline.
                </p>
              </header>

              <div className="fields contact-desk__fields">
                <label>
                  <span>First name</span>
                  <input
                    required
                    value={formState.firstName}
                    onChange={handleChange('firstName')}
                    aria-invalid={fieldErrors.firstName ? 'true' : 'false'}
                  />
                  {fieldErrors.firstName ? <small>{fieldErrors.firstName}</small> : null}
                </label>
                <label>
                  <span>Last name</span>
                  <input
                    required
                    value={formState.lastName}
                    onChange={handleChange('lastName')}
                    aria-invalid={fieldErrors.lastName ? 'true' : 'false'}
                  />
                  {fieldErrors.lastName ? <small>{fieldErrors.lastName}</small> : null}
                </label>
                <label>
                  <span>Email</span>
                  <input
                    required
                    type="email"
                    value={formState.email}
                    onChange={handleChange('email')}
                    aria-invalid={fieldErrors.email ? 'true' : 'false'}
                  />
                  {fieldErrors.email ? <small>{fieldErrors.email}</small> : null}
                </label>
                <label>
                  <span>Phone</span>
                  <input value={formState.phone} onChange={handleChange('phone')} />
                </label>
                <label className="fields__full">
                  <span>Message</span>
                  <textarea
                    required
                    rows={6}
                    value={formState.message}
                    onChange={handleChange('message')}
                    aria-invalid={fieldErrors.message ? 'true' : 'false'}
                  />
                  {fieldErrors.message ? <small>{fieldErrors.message}</small> : null}
                </label>
              </div>

              <div className="form-foot contact-desk__foot">
                {status === 'error' ? (
                  <p className="form-error" role="alert">
                    {serverMessage}
                  </p>
                ) : null}
                <button className="btn btn--chew" type="submit" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Sending enquiry…' : 'Send wholesale enquiry'}
                </button>
              </div>
            </>
          )}
        </CurtainPanel>
      </CurtainSplit>
    </main>
  )
}
