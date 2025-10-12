import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import styles from "./Landing.module.scss";

function Landing() {
  const [isVisible, setIsVisible] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({
              ...prev,
              [entry.target.dataset.section]: true,
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    setIsLoggedIn(!!token);
  }, []);

  const setSectionRef = (section) => (el) => {
    sectionRefs.current[section] = el;
  };

  return (
    <div className={styles.landing}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.gradientOrb}></div>
          <div className={styles.gradientOrb2}></div>
        </div>
        <div className="container">
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <span className={styles.badgeIcon}>✨</span>
              <span className={styles.badgeText}>
                Trusted by 1,000+ PM aspirants
              </span>
            </div>
            <h1 className={styles.heroTitle}>
              Master Product
              <br />
              <span className={styles.heroTitleGradient}>
                Management Interviews
              </span>
            </h1>
            <p className={styles.heroSubtitle}>
              Practice with AI-powered feedback using Exponent-style rubrics.
              Get instant, detailed scoring on product design, strategy,
              metrics, and communication—just like a real senior PM interviewer.
            </p>
            <div className={styles.heroCTA}>
              <Link
                to={isLoggedIn ? "/interview" : "/auth/register"}
                className={`btn btn-primary btn-xl ${styles.ctaButton}`}
              >
                {isLoggedIn ? "Start Interview" : "Start Practicing Free"}
                <span className={styles.ctaArrow}>→</span>
              </Link>
              <div className={styles.trustBadges}>
                <span className={styles.trustBadge}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 0L10.472 5.528L16 8L10.472 10.472L8 16L5.528 10.472L0 8L5.528 5.528L8 0Z" />
                  </svg>
                  No credit card required
                </span>
                <span className={styles.trustBadge}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                  >
                    <path d="M8 1L10.472 5.528L16 6.528L12 10.472L12.944 16L8 13.528L3.056 16L4 10.472L0 6.528L5.528 5.528L8 1Z" />
                  </svg>
                  Free forever plan
                </span>
              </div>
            </div>

            {/* Stats Section */}
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>1,000+</div>
                <div className={styles.statLabel}>PM Aspirants</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>200+</div>
                <div className={styles.statLabel}>Interview Questions</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>6</div>
                <div className={styles.statLabel}>PM Categories</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>95%</div>
                <div className={styles.statLabel}>Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        className={styles.howItWorks}
        ref={setSectionRef("howItWorks")}
        data-section="howItWorks"
      >
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>SIMPLE PROCESS</span>
            <h2 className={styles.sectionTitle}>How it works</h2>
            <p className={styles.sectionSubtitle}>
              From practice to interview success in 3 simple steps
            </p>
          </div>

          <div
            className={`${styles.steps} ${
              isVisible.howItWorks ? styles.visible : ""
            }`}
          >
            <div className={`${styles.step} ${styles.stepDelay1}`}>
              <div className={styles.stepIcon}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M16 4L20 12L28 14L22 20L24 28L16 24L8 28L10 20L4 14L12 12L16 4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="currentColor"
                    opacity="0.2"
                  />
                </svg>
              </div>
              <div className={styles.stepNumber}>01</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Choose Category & Level</h3>
                <p className={styles.stepDescription}>
                  Select from Product Design, Strategy, Metrics, or 4 other
                  categories. Pick your experience level: Junior, Mid, or Senior
                  PM.
                </p>
              </div>
            </div>

            <div className={`${styles.step} ${styles.stepDelay2}`}>
              <div className={styles.stepIcon}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M8 6H24V26H8V6Z M12 10H20 M12 14H20 M12 18H16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className={styles.stepNumber}>02</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Practice & Clarify</h3>
                <p className={styles.stepDescription}>
                  Answer real PM interview questions. Ask clarifying questions
                  to the AI interviewer just like in an actual interview.
                </p>
              </div>
            </div>

            <div className={`${styles.step} ${styles.stepDelay3}`}>
              <div className={styles.stepIcon}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M6 16L12 22L26 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className={styles.stepNumber}>03</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Get Expert Feedback</h3>
                <p className={styles.stepDescription}>
                  Receive instant Exponent-style scoring with detailed feedback,
                  model answers, and actionable improvement suggestions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section
        className={styles.whyChoose}
        ref={setSectionRef("whyChoose")}
        data-section="whyChoose"
      >
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>WHY CHOOSE US</span>
            <h2 className={styles.sectionTitle}>
              Built by PMs, for aspiring PMs
            </h2>
            <p className={styles.sectionSubtitle}>
              The most comprehensive PM interview prep platform
            </p>
          </div>

          <div
            className={`${styles.whyGrid} ${
              isVisible.whyChoose ? styles.visible : ""
            }`}
          >
            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect
                    x="8"
                    y="8"
                    width="24"
                    height="24"
                    rx="4"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M14 18L18 22L26 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className={styles.whyCardTitle}>Exponent-Style Rubrics</h3>
              <p className={styles.whyCardDescription}>
                Get evaluated using the same structured rubrics used by top tech
                companies. Our AI provides detailed 0-10 scoring across 6 key
                dimensions.
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle
                    cx="20"
                    cy="20"
                    r="12"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M20 14V20L24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className={styles.whyCardTitle}>Instant AI Feedback</h3>
              <p className={styles.whyCardDescription}>
                No waiting for human reviewers. Get comprehensive feedback in
                seconds, including strengths, growth areas, and model answers.
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path
                    d="M10 28L16 16L22 22L30 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="16" cy="16" r="2" fill="currentColor" />
                  <circle cx="22" cy="22" r="2" fill="currentColor" />
                  <circle cx="30" cy="12" r="2" fill="currentColor" />
                </svg>
              </div>
              <h3 className={styles.whyCardTitle}>200+ Real Questions</h3>
              <p className={styles.whyCardDescription}>
                Practice questions scraped from Exponent, covering Product
                Design, Strategy, Metrics, and more from companies like Google,
                Meta, and Amazon.
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <path
                    d="M20 8V20M20 20L28 12M20 20L12 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 28H32"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className={styles.whyCardTitle}>Interactive Practice</h3>
              <p className={styles.whyCardDescription}>
                Ask clarifying questions to the AI interviewer before submitting
                your final answer—simulating real interview dynamics.
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect
                    x="10"
                    y="10"
                    width="20"
                    height="20"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M16 18H24M16 22H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className={styles.whyCardTitle}>Track Your Growth</h3>
              <p className={styles.whyCardDescription}>
                Monitor your improvement over time with detailed session history
                and category-specific performance analytics.
              </p>
            </div>

            <div className={styles.whyCard}>
              <div className={styles.whyCardIcon}>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle
                    cx="20"
                    cy="15"
                    r="5"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M10 32C10 26 14 22 20 22C26 22 30 26 30 32"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h3 className={styles.whyCardTitle}>Privacy First</h3>
              <p className={styles.whyCardDescription}>
                Your practice sessions are completely private. No data sharing,
                no judgment—just focused preparation for your dream PM role.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section
        className={styles.categories}
        ref={setSectionRef("categories")}
        data-section="categories"
      >
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>COMPREHENSIVE COVERAGE</span>
            <h2 className={styles.sectionTitle}>
              Master every PM interview category
            </h2>
            <p className={styles.sectionSubtitle}>
              Practice across 6 core PM interview categories with targeted
              questions
            </p>
          </div>

          <div
            className={`${styles.categoriesGrid} ${
              isVisible.categories ? styles.visible : ""
            }`}
          >
            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>🎨</div>
              <h3 className={styles.categoryTitle}>Product Design</h3>
              <p className={styles.categoryDescription}>
                User research, innovation, UX thinking
              </p>
            </div>
            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>🎯</div>
              <h3 className={styles.categoryTitle}>Product Strategy</h3>
              <p className={styles.categoryDescription}>
                Market analysis, competitive positioning
              </p>
            </div>
            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>📊</div>
              <h3 className={styles.categoryTitle}>Metrics</h3>
              <p className={styles.categoryDescription}>
                KPIs, A/B testing, data analysis
              </p>
            </div>
            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>🔍</div>
              <h3 className={styles.categoryTitle}>Root Cause Analysis</h3>
              <p className={styles.categoryDescription}>
                Problem identification, hypothesis testing
              </p>
            </div>
            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>⚡</div>
              <h3 className={styles.categoryTitle}>Product Improvement</h3>
              <p className={styles.categoryDescription}>
                Feature iteration, growth strategies
              </p>
            </div>
            <div className={styles.categoryCard}>
              <div className={styles.categoryIcon}>📐</div>
              <h3 className={styles.categoryTitle}>Guesstimates</h3>
              <p className={styles.categoryDescription}>
                Market sizing, estimation frameworks
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section
        className={styles.socialProof}
        ref={setSectionRef("testimonials")}
        data-section="testimonials"
      >
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>SUCCESS STORIES</span>
            <h2 className={styles.sectionTitle}>
              Trusted by aspiring PMs worldwide
            </h2>
            <p className={styles.sectionSubtitle}>
              Join 1,000+ aspiring PMs who landed their dream roles
            </p>
          </div>

          <div
            className={`${styles.testimonials} ${
              isVisible.testimonials ? styles.visible : ""
            }`}
          >
            <div className={styles.testimonial}>
              <div className={styles.testimonialQuote}>"</div>
              <p className={styles.testimonialText}>
                "I practiced for 2 weeks and got my dream PM role at a FAANG
                company. The Exponent-style rubrics and detailed AI feedback
                helped me understand exactly what senior PMs look for in
                answers."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>SC</div>
                <div>
                  <strong>Sarah Chen</strong>
                  <span>Product Manager at Google</span>
                </div>
              </div>
            </div>

            <div className={styles.testimonial}>
              <div className={styles.testimonialQuote}>"</div>
              <p className={styles.testimonialText}>
                "The interactive practice mode where you can ask clarifying
                questions is genius. It simulates real interviews perfectly. I
                went from nervous to confident in just 10 sessions."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>MR</div>
                <div>
                  <strong>Michael Rodriguez</strong>
                  <span>Senior PM at Meta</span>
                </div>
              </div>
            </div>

            <div className={styles.testimonial}>
              <div className={styles.testimonialQuote}>"</div>
              <p className={styles.testimonialText}>
                "Best investment I made for my PM interview prep. The instant
                feedback loop and model answers helped me iterate and improve
                10x faster than traditional prep methods."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>ET</div>
                <div>
                  <strong>Emily Taylor</strong>
                  <span>Product Manager at Amazon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className={styles.finalCTA}>
        <div className={styles.ctaBackground}>
          <div className={styles.ctaGradientOrb}></div>
        </div>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Ready to ace your next
              <br />
              <span className={styles.ctaTitleGradient}>PM interview?</span>
            </h2>
            <p className={styles.ctaSubtitle}>
              Join 1,000+ aspiring PMs preparing for their dream job.
              <br />
              Start practicing today with our free forever plan.
            </p>
            <div className={styles.ctaButtons}>
              <Link
                to={isLoggedIn ? "/interview" : "/auth/register"}
                className={`btn btn-primary btn-xl ${styles.ctaPrimaryButton}`}
              >
                {isLoggedIn ? "Start Interview" : "Start Practicing Free"}
                <span className={styles.ctaArrow}>→</span>
              </Link>
              <Link
                to={isLoggedIn ? "/dashboard" : "/auth/login"}
                className={`btn btn-secondary btn-xl ${styles.ctaSecondaryButton}`}
              >
                {isLoggedIn ? "Dashboard" : "Sign In"}
              </Link>
            </div>
            <div className={styles.ctaFeatures}>
              <span className={styles.ctaFeature}>
                ✓ 200+ interview questions
              </span>
              <span className={styles.ctaFeature}>
                ✓ Exponent-style rubrics
              </span>
              <span className={styles.ctaFeature}>✓ Instant AI feedback</span>
              <span className={styles.ctaFeature}>✓ Free forever</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Landing;
