import { useState } from 'react'
import PageHero from '../components/PageHero'
import { company } from '../data'
import { usePageMotion } from '../hooks'

export default function Contact() {
  const pageRef = usePageMotion()
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  })
  const [sent, setSent] = useState(false)
  const usa = company.offices[0]
  const nepal = company.offices[1]

  return (
    <main className="page-main" ref={pageRef}>
      <PageHero
        eyebrow="Get in touch"
        title="Let's talk supply"
        lede="Wholesale, custom sizes, and distribution partnerships. Drop a note — we reply as soon as your enquiry reaches us."
        image="/images/lifestyle/contact-hero.jpg"
        imagePosition="68% 45%"
      />

      <section className="contact">
        <div className="section-shell contact__grid">
          <div className="contact__copy" data-reveal="left">
            <p className="eyebrow">Reach us</p>
            <h2>Offices & lines</h2>
            <div className="contact__places">
              <div>
                <h3>{usa.region}</h3>
                <p>{usa.place}</p>
                <a href={`mailto:${usa.email}`}>{usa.email}</a>
                <a href={usa.phoneHref}>{usa.phone}</a>
              </div>
              <div>
                <h3>{nepal.region}</h3>
                <p>{nepal.place}</p>
                <a href={nepal.phoneHref}>{nepal.phone}</a>
              </div>
            </div>
          </div>

          <form
            className="contact__form"
            data-reveal="right"
            data-delay="1"
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true)
            }}
          >
            {sent ? (
              <div className="contact__success" role="status">
                <h3>Message ready</h3>
                <p>
                  Thanks {formState.firstName || 'there'}. Email us at{' '}
                  <a href={`mailto:${company.email}`}>{company.email}</a> to send this enquiry.
                </p>
              </div>
            ) : (
              <>
                <div className="contact__row">
                  <label>
                    First name
                    <input
                      required
                      value={formState.firstName}
                      onChange={(e) => setFormState((s) => ({ ...s, firstName: e.target.value }))}
                    />
                  </label>
                  <label>
                    Last name
                    <input
                      required
                      value={formState.lastName}
                      onChange={(e) => setFormState((s) => ({ ...s, lastName: e.target.value }))}
                    />
                  </label>
                </div>
                <label>
                  Email
                  <input
                    required
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                  />
                </label>
                <label>
                  Phone
                  <input
                    value={formState.phone}
                    onChange={(e) => setFormState((s) => ({ ...s, phone: e.target.value }))}
                  />
                </label>
                <label>
                  Message
                  <textarea
                    required
                    rows={5}
                    value={formState.message}
                    onChange={(e) => setFormState((s) => ({ ...s, message: e.target.value }))}
                  />
                </label>
                <button className="btn btn--brand" type="submit">
                  Send message
                </button>
              </>
            )}
          </form>
        </div>
      </section>
    </main>
  )
}
