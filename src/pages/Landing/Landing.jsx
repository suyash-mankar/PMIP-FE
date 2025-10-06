import { Link } from "react-router-dom";
import styles from "./Landing.module.scss";

function Landing() {
  return (
    <div className={styles.landing}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <span className={styles.badgeText}>
                ✨ Trusted by 1,000+ PM aspirants
              </span>
            </div>
            <h1 className={styles.heroTitle}>
              Boost your confidence,
              <br />
              <span className={styles.heroTitleGradient}>
                ace the PM interview
              </span>
            </h1>
            <p className={styles.heroSubtitle}>
              Practice PM interview questions with AI-powered feedback. Get
              instant, rubric-based scoring on product sense, metrics,
              prioritization, and communication—just like a real interview
              coach.
            </p>
            <div className={styles.heroCTA}>
              <Link to="/auth/register" className="btn btn-primary btn-xl">
                Try now for free
              </Link>
              <span className={styles.noCreditCard}>No credit card needed</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className="container">
          <h2 className={styles.sectionTitle}>How it works</h2>
          <p className={styles.sectionSubtitle}>
            Give yourself an unfair advantage in interviews
          </p>

          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Choose your level</h3>
                <p className={styles.stepDescription}>
                  Select Entry, Mid, or Senior level to get questions tailored
                  to your target role.
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Practice answering</h3>
                <p className={styles.stepDescription}>
                  Answer realistic PM interview questions covering product
                  design, strategy, metrics, and prioritization.
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Improve with AI coaching</h3>
                <p className={styles.stepDescription}>
                  Get instant feedback scored on 5 key dimensions with detailed
                  suggestions and sample answers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={styles.features}>
        <div className="container">
          <h2 className={styles.sectionTitle}>
            Make your next interview stress-free
          </h2>

          <div className={styles.comparisonTable}>
            <div className={styles.comparisonColumn}>
              <h3 className={styles.comparisonTitle}>
                ❌ Without PM Interview Practice
              </h3>
              <ul className={styles.comparisonList}>
                <li>Unprepared and nervous</li>
                <li>Don't know what to expect</li>
                <li>Inconsistent answers</li>
                <li>Miss key frameworks</li>
              </ul>
            </div>
            <div className={styles.comparisonColumn}>
              <h3 className={styles.comparisonTitle}>
                ✅ With PM Interview Practice
              </h3>
              <ul className={styles.comparisonList}>
                <li>Organized and confident</li>
                <li>Practice realistic questions</li>
                <li>Structured, rubric-based answers</li>
                <li>Receive final offers</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className={styles.keyFeatures}>
        <div className="container">
          <div className={styles.featuresGrid}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🎯</div>
              <h3 className={styles.featureTitle}>Rubric-Based Scoring</h3>
              <p className={styles.featureDescription}>
                Get scored on structure, metrics, prioritization, user empathy,
                and communication—just like real PM interviews.
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>⚡</div>
              <h3 className={styles.featureTitle}>Instant Feedback</h3>
              <p className={styles.featureDescription}>
                No waiting. Get detailed AI feedback within seconds, including
                sample answers showing how to improve.
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📈</div>
              <h3 className={styles.featureTitle}>Track Your Progress</h3>
              <p className={styles.featureDescription}>
                View your session history and improvement trends across all PM
                interview dimensions.
              </p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔒</div>
              <h3 className={styles.featureTitle}>Private & Secure</h3>
              <p className={styles.featureDescription}>
                Your answers are private and never shared. Practice in a safe
                environment without judgment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className={styles.socialProof}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Success stories</h2>
          <p className={styles.sectionSubtitle}>
            Join 1,000+ aspiring PMs who landed their dream roles
          </p>

          <div className={styles.testimonials}>
            <div className={styles.testimonial}>
              <p className={styles.testimonialText}>
                "I practiced for 2 weeks and got my dream PM role at a top tech
                company. The AI feedback was incredibly detailed and helped me
                structure my answers perfectly."
              </p>
              <div className={styles.testimonialAuthor}>
                <strong>Sarah Chen</strong>
                <span>→ Product Manager at Google</span>
              </div>
            </div>

            <div className={styles.testimonial}>
              <p className={styles.testimonialText}>
                "The rubric-based scoring helped me understand exactly what
                interviewers look for. I went from nervous to confident in just
                a few sessions."
              </p>
              <div className={styles.testimonialAuthor}>
                <strong>Michael Rodriguez</strong>
                <span>→ Senior PM at Meta</span>
              </div>
            </div>

            <div className={styles.testimonial}>
              <p className={styles.testimonialText}>
                "Best investment I made for my PM interview prep. The instant
                feedback loop helped me iterate and improve much faster than
                traditional prep."
              </p>
              <div className={styles.testimonialAuthor}>
                <strong>Emily Taylor</strong>
                <span>→ Product Manager at Amazon</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCTA}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Ready to start mastering your PM interview skills?
            </h2>
            <p className={styles.ctaSubtitle}>
              Join thousands of PM aspirants preparing for their dream job.
              Start practicing today—no credit card required.
            </p>
            <Link to="/auth/register" className="btn btn-primary btn-xl">
              Try now for free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
