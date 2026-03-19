import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'We put treatments together — creative research, writing & layout for top production companies worldwide.',
};

export default function AboutPage() {
  return (
    <div className="about-page">
      <h1>About</h1>
      <div className="about-content">
        <p>
          We put treatments together (creative research, writing &amp; layout)
          for top production companies worldwide, such as{' '}
          <strong>
            Partizan, Iconoclast, RadicalMedia, Primo Content, Somesuch
          </strong>{' '}
          and others.
        </p>
        <p>
          The founder of Ghost began working in the treatment industry as a
          writer in 2011. Since then, the company has grown into a multinational
          treatment agency specializing in commercials, music videos, films, and
          series.
        </p>
        <p>
          We cover all aspects of the spectrum, from visual and creative research
          to writing and designing layouts for award-winning treatments.
        </p>
        <p>
          Some of our clients include{' '}
          <strong>
            Dave Meyers, Johnny Green, King She, Nick Martini, Daniel de
            Viciola, Mollie Mills, and many other top-tier, visionary directors.
          </strong>
        </p>
        <p>
          <a
            href="https://treatmentsbyghost.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            treatmentsbyghost.com
          </a>
        </p>
        <p>
          <a
            href="https://instagram.com/ghost_treatments"
            target="_blank"
            rel="noopener noreferrer"
          >
            @ghost_treatments
          </a>
        </p>
      </div>

      <div className="newsletter-cta">
        <h3>Join the newsletter</h3>
        <p>
          Get insights on treatment design, commercial filmmaking, and the
          advertising industry delivered to your inbox.
        </p>
        <a
          href="mailto:info@treatmentsbyghost.com?subject=Newsletter%20Signup"
          className="cta-button"
        >
          Subscribe
        </a>
      </div>
    </div>
  );
}
