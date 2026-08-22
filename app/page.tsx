import FormHub from "@/components/FormHub";
import Header from "@/components/Header";
import StickyCta from "@/components/StickyCta";

function bookHref(packageId: string) {
  return `/?package=${packageId}#book`;
}

export default function HomePage() {
  return (
    <>
      <Header />

      <main id="top">
        <section className="hero">
          <div className="hero-media">
            <img src="/assets/hero.webp" alt="No Backboard Basketball action at NBBL" />
          </div>
          <div className="shell hero-copy">
            <div className="eyebrow">NBBL Gilbert • Gilbert, Arizona</div>
            <h1 className="display">
              The Home of
              <br />
              No Backboard
              <br />
              Basketball
            </h1>
            <div className="location">Gilbert, Arizona</div>
            <div className="opening">Opening September 1, 2026</div>
            <div className="hero-actions">
              <a className="btn primary" href="#book">
                Train Your Team →
              </a>
              <a className="btn outline" href="#showcases">
                Explore Showcases →
              </a>
            </div>
          </div>
          <div className="scrollcue">Scroll to enter the game</div>
        </section>

        <section className="section intro" id="difference">
          <div className="shell intro-grid">
            <div>
              <div className="eyebrow">A new basketball environment</div>
              <h2 className="display split-title">
                The Futsal
                <br />
                of <span className="accent">Basketball.</span>
              </h2>
            </div>
            <div>
              <p className="lead">
                NBBL creates a more demanding basketball environment designed to develop
                better shooters, faster decision makers and more skilled basketball
                players.
              </p>
              <div className="rule" />
              <div className="eyebrow">SWISH. SPEED. SKILL.</div>
            </div>
          </div>
        </section>

        <section className="section dark">
          <div className="shell">
            <div className="eyebrow">The difference</div>
            <h2 className="display section-title">
              Swish.
              <br />
              <span className="accent">Speed.</span>
              <br />
              Skill.
            </h2>
            <div className="tri-grid">
              <article className="feature-card">
                <img src="/assets/swish.webp" alt="Player finishing at the UHoop" />
                <div className="feature-copy">
                  <h3 className="display">Swish.</h3>
                  <p>
                    16 inch UHoop. No backboard. Smaller target. Softer touch. Cleaner
                    shot.
                  </p>
                </div>
              </article>
              <article className="feature-card">
                <img src="/assets/speed.webp" alt="No Backboard Basketball action" />
                <div className="feature-copy">
                  <h3 className="display">Speed.</h3>
                  <p>
                    The game does not stop. Faster transition. Faster communication.
                    Faster reads. Faster decisions.
                  </p>
                </div>
              </article>
              <article className="feature-card">
                <img src="/assets/skill.webp" alt="Players attacking the UHoop" />
                <div className="feature-copy">
                  <h3 className="display">Skill.</h3>
                  <p>Think. Communicate. Pass. Finish. Make decisions under pressure.</p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="section light" id="train">
          <div className="shell system">
            <div className="system-media">
              <img src="/assets/competition.webp" alt="Players competing on the NBBL court" />
            </div>
            <div className="system-copy">
              <div className="eyebrow">Team development</div>
              <h2 className="display">
                Practice Your System.
                <br />
                <span className="accent">Scrimmage Our System.</span>
              </h2>
              <p className="lead">
                Your team. Your coach. Your offense. Your defense. Your terminology. Your
                drills. Then finish the session playing No Backboard Basketball.
              </p>
              <div className="system-list">
                <span>Practice your system.</span>
                <span>Scrimmage our system.</span>
                <span>Take the benefits back.</span>
              </div>
              <a className="btn dark" href="#book">
                Book Team Development →
              </a>
            </div>
          </div>
        </section>

        <section className="section pricing" id="pricing">
          <div className="shell">
            <div className="pricing-head">
              <div>
                <div className="eyebrow">Start with team development</div>
                <h2 className="display section-title">
                  Bring Your Team.
                  <br />
                  <span className="yellow-text">Keep Your Coach.</span>
                </h2>
              </div>
            </div>
            <p className="lead">
              NBBL supplies the UHoop environment and performance development layer
              without replacing the program your coach already runs.
            </p>
            <div className="price-grid">
              <article className="price-card featured">
                <div className="tag">Recommended starting point</div>
                <h3>Four Session Development Evaluation</h3>
                <ul>
                  <li>4 two hour sessions</li>
                  <li>Up to 18 athletes</li>
                  <li>Performance tracking included</li>
                </ul>
                <div className="price">
                  $1,900 <small>per program</small>
                </div>
                <a className="btn primary" href={bookHref("school-eval")}>
                  Start a School Evaluation
                </a>
              </article>
              <article className="price-card">
                <div className="tag">Weekly residency</div>
                <h3>12 Week Weekly Residency</h3>
                <ul>
                  <li>12 two hour sessions</li>
                  <li>One session per week</li>
                  <li>Designed for consistent development</li>
                </ul>
                <div className="price">$5,100</div>
                <a className="btn outline" href={bookHref("school-weekly")}>
                  Request a Weekly Block
                </a>
              </article>
              <article className="price-card">
                <div className="tag">High frequency</div>
                <h3>12 Week Twice Weekly Residency</h3>
                <ul>
                  <li>24 two hour sessions</li>
                  <li>Two sessions per week</li>
                  <li>Designed for deeper development</li>
                </ul>
                <div className="price">$10,200</div>
                <a className="btn outline" href={bookHref("school-twice-weekly")}>
                  Request a Residency
                </a>
              </article>
            </div>
            <div className="rule" />
            <div className="eyebrow">Club team training</div>
            <div className="price-grid">
              <article className="price-card">
                <h3>Two Hour Team Session</h3>
                <ul>
                  <li>Up to 18 athletes</li>
                </ul>
                <div className="price">
                  $560 <small>per team</small>
                </div>
                <a className="btn outline" href={bookHref("club-2hr")}>
                  Start Club Training
                </a>
              </article>
              <article className="price-card">
                <h3>Two Session Development Cycle</h3>
                <ul>
                  <li>Up to 18 athletes</li>
                </ul>
                <div className="price">
                  $1,000 <small>per team</small>
                </div>
                <a className="btn outline" href={bookHref("club-2-session")}>
                  Start Club Training
                </a>
              </article>
              <article className="price-card">
                <h3>Four Session Development Cycle</h3>
                <ul>
                  <li>4 two hour sessions</li>
                </ul>
                <div className="price">$1,900</div>
                <a className="btn outline" href={bookHref("club-4-session")}>
                  Start Club Training
                </a>
              </article>
            </div>
          </div>
        </section>

        <section className="section blue">
          <div className="shell measure">
            <div className="measure-copy">
              <div className="eyebrow">Performance layer</div>
              <h2 className="display section-title">
                Don&apos;t Just Practice.
                <br />
                <span className="yellow-text">Measure the Work.</span>
              </h2>
              <p className="lead">
                NBBL training is being designed to evolve into a measurable development
                experience. The roadmap connects training, performance data and content.
              </p>
              <div className="roadmap">
                <div>Athlete tracking</div>
                <div>Real time reporting</div>
                <div>AI vision capture</div>
                <div>Automated clipping</div>
                <div>Performance data</div>
                <div>Athlete content</div>
              </div>
              <a className="btn yellow" href="#book">
                Learn About NBBL Training →
              </a>
            </div>
            <div className="measure-media">
              <img src="/assets/production.jpg" alt="NBBL production environment" />
              <div className="data-pill">
                <strong>
                  See the work.
                  <br />
                  Track the development.
                </strong>
                <span>
                  Roadmap capability shown as future development unless confirmed
                  operational.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="section dark" id="showcases">
          <div className="shell showcase-layout">
            <div className="showcase-image">
              <img src="/assets/showcase.webp" alt="No Backboard Basketball showcase action" />
            </div>
            <div>
              <div className="eyebrow">Competition</div>
              <h2 className="display section-title">
                Train Here.
                <br />
                <span className="accent">Then Compete Here.</span>
              </h2>
              <p className="lead">
                NBBL Club Team Showcases give teams a controlled environment to apply
                their development in real No Backboard Basketball competition.
              </p>
              <div className="showcase-stat">
                Four clubs.
                <br />
                32 athletes.
                <br />
                One controlled environment.
              </div>
              <div className="rule" />
              <div className="eyebrow">Showcase entry</div>
              <p className="lead">Up to 8 participating athletes per club • $360 per club</p>
              <a className="btn primary" href="#showcase-register">
                Register Your Club →
              </a>
            </div>
          </div>
        </section>

        <section className="section light">
          <div className="shell showcase-layout">
            <div>
              <div className="eyebrow">Audience</div>
              <h2 className="display section-title">
                Play the Game.
                <br />
                Build the <span className="accent">Audience.</span>
              </h2>
              <p className="lead">
                The room in the gym is intentionally controlled. The larger audience follows
                digitally through livestreaming and content.
              </p>
              <div className="showcase-stat">
                Limited room in the gym.
                <br />
                Unlimited room in the audience.
              </div>
              <div className="rule" />
              <div className="eyebrow">Watch from anywhere</div>
              <p className="lead">
                <strong className="ppv-price">$9.99 PPV</strong>
                <br />
                Live event access plus limited replay access.
              </p>
            </div>
            <div className="showcase-image">
              <img src="/assets/attack.webp" alt="NBBL player attacking the UHoop" />
            </div>
          </div>
        </section>

        <section className="section fundraiser" id="fundraiser">
          <div className="shell">
            <div className="eyebrow">Fundraising through basketball</div>
            <h2 className="display">
              Your Next Fundraiser Could Be a No Backboard Basketball Game!
            </h2>
            <p className="lead">
              Traditional fundraising asks families to buy something. NBBL gives them
              something to watch. Your players compete. Your club promotes the event.
              Family and supporters watch remotely.
            </p>
            <div className="bigline">Basketball becomes the fundraiser.</div>
            <div className="fundraiser-cta">
              <a className="btn primary" href="#fundraiser-inquiry">
                Turn Our Next Game Into a Fundraiser →
              </a>
            </div>
            <div className="split-economics fundraiser-economics">
              <div className="econ">
                <span>NBBL</span>
                <b>20%</b>
              </div>
              <div className="econ">
                <span>Club 1</span>
                <b>20%</b>
              </div>
              <div className="econ">
                <span>Club 2</span>
                <b>20%</b>
              </div>
              <div className="econ">
                <span>Club 3</span>
                <b>20%</b>
              </div>
              <div className="econ">
                <span>Club 4</span>
                <b>20%</b>
              </div>
            </div>
          </div>
        </section>

        <section className="section dark" id="gym">
          <div className="shell">
            <div className="eyebrow">The facility</div>
            <h2 className="display section-title">Gym #000</h2>
            <p className="lead">The first physical home of No Backboard Basketball.</p>
            <div className="gym-grid gym-grid-spaced">
              <div className="gym-photo gym-main">
                <img src="/assets/gym-wide.jpg" alt="NBBL Gilbert gym interior" />
              </div>
              <div className="gym-photo">
                <img src="/assets/gym-exterior.jpg" alt="NBBL Gilbert facility exterior" />
              </div>
              <div className="gym-photo">
                <img src="/assets/gym-court.jpg" alt="NBBL Gilbert full basketball court" />
              </div>
            </div>
            <div className="gym-info">
              <div>7,000+ Square Feet • Gilbert, Arizona</div>
              <div>Full High School Court</div>
              <div>UHoop • Bleachers • Stage</div>
              <div>Production Bird&apos;s Nest</div>
              <div>Conference Room and Classroom</div>
              <div>Filming and Event Space</div>
            </div>
          </div>
        </section>

        <section className="section yellow" id="creators">
          <div className="shell creator">
            <div className="creator-image">
              <img src="/assets/finish.webp" alt="NBBL athlete finishing at the UHoop" />
            </div>
            <div>
              <div className="eyebrow">For creators and media</div>
              <h2 className="display">
                Your Content.
                <br />
                Our Court.
              </h2>
              <p className="lead">
                A basketball first environment for video, photography, interviews, podcasts,
                social content, brand activations and commercial basketball production.
              </p>
              <div className="rule" />
              <div className="display creator-quote">
                Wait.
                <br />
                They&apos;re playing
                <br />
                without a backboard?
              </div>
              <p className="lead">Use the gym. Capture the game. Tell the story.</p>
              <a className="btn dark" href="#creator-access">
                Request Creator Access →
              </a>
            </div>
          </div>
        </section>

        <section className="section final" id="contact">
          <div className="shell">
            <div className="eyebrow">Start with your team</div>
            <h2 className="display">Bring Your Team.</h2>
            <p className="lead centered-lead">
              Bring your coach. Bring your system. Bring your athletes. We&apos;ll provide
              a different basketball environment.
            </p>
            <div className="path">
              <span>Practice Differently.</span>
              <span>Compete Locally.</span>
              <span>Measure Development.</span>
              <span>Build an Audience.</span>
              <span>Fund the Game.</span>
            </div>
            <FormHub />
          </div>
        </section>
      </main>

      <footer>
        <div className="shell footer-grid">
          <div>
            <div className="footer-brand">NBBL Gilbert</div>
            <div className="footer-small">
              The first physical home of No Backboard Basketball.
            </div>
          </div>
          <div className="footer-meta">
            <div className="footer-small">Gilbert, Arizona</div>
            <div className="footer-small">Opening September 1, 2026</div>
            <div className="footer-small footer-copy">
              © 2026 No Backboard Basketball League
            </div>
            <div className="footer-small footer-copy">
              <a href="mailto:info@nbblgilbert.com">info@nbblgilbert.com</a>
            </div>
          </div>
        </div>
      </footer>

      <StickyCta />
    </>
  );
}
