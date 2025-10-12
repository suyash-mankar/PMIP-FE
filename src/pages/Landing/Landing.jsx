import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import styles from "./Landing.module.scss";

function Landing() {
  const [isVisible, setIsVisible] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
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

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // Star Rating Component
  const StarRating = () => (
    <div className={styles.stars}>
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M8 1L10 6L15 6.5L11.5 10L12.5 15L8 12.5L3.5 15L4.5 10L1 6.5L6 6L8 1Z" />
        </svg>
      ))}
    </div>
  );

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
            <div className={styles.heroText}>
              <div className={styles.badge}>
                <span className={styles.badgeIcon}>✨</span>
                <span className={styles.badgeText}>
                  Trusted by 1,000+ PM aspirants preparing for FAANG & top
                  startups
                </span>
              </div>
              <h1 className={styles.heroTitle}>
                <span className={styles.titleLine1}>
                  Master Product Management
                </span>
                <span className={styles.titleLine2}>
                  Interviews with{" "}
                  <span className={styles.titleGradient}>AI</span>
                </span>
              </h1>
              <p className={styles.heroSubtitle}>
                Practice with 200+ real PM interview questions from FAANG
                companies. Get detailed scoring across 6 key areas with instant
                feedback and model answers.
              </p>
              <div className={styles.heroCTA}>
                <Link
                  to={isLoggedIn ? "/interview" : "/auth/register"}
                  className={`btn btn-primary btn-xl ${styles.ctaButton}`}
                >
                  Start Practicing Free
                  <span className={styles.ctaArrow}>→</span>
                </Link>
              </div>

              <div className={styles.heroStats}>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>200+</div>
                  <div className={styles.statLabel}>Real Questions</div>
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
            <div className={styles.productScreenshot}>
              <div className={styles.screenshotPlaceholder}>
                {/* Mac Browser Header */}
                <div className={styles.browserHeader}>
                  <div className={styles.browserControls}>
                    <div
                      className={`${styles.browserDot} ${styles.close}`}
                    ></div>
                    <div
                      className={`${styles.browserDot} ${styles.minimize}`}
                    ></div>
                    <div
                      className={`${styles.browserDot} ${styles.maximize}`}
                    ></div>
                  </div>
                  <div className={styles.browserUrlBar}>
                    <div className={styles.browserIcon}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 2L2 7L12 12L22 7L12 2Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 17L12 22L22 17"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2 12L12 17L22 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className={styles.urlText}>
                      pminterviewpractice.com
                    </div>
                    <div className={styles.browserActions}>
                      <div className={styles.actionIcon}>↻</div>
                      <div className={styles.actionIcon}>⋮</div>
                    </div>
                  </div>
                </div>
                <div className={styles.mockChat}>
                  <div className={styles.chatHeader}>
                    <div className={styles.chatAvatar}>
                      <div className={styles.avatarIcon}>🤖</div>
                      <div className={styles.avatarPulse}></div>
                    </div>
                    <div className={styles.chatInfo}>
                      <span className={styles.chatName}>AI Interviewer</span>
                      <span className={styles.chatStatus}>Online</span>
                    </div>
                    <div className={styles.chatActions}>
                      <div className={styles.actionBtn}>⋯</div>
                    </div>
                  </div>
                  <div className={styles.chatMessages}>
                    <div className={`${styles.message} ${styles.ai}`}>
                      <div className={styles.messageAvatar}>AI</div>
                      <div className={styles.messageContent}>
                        <p>
                          How would you improve user engagement for a social
                          media app?
                        </p>
                        <div className={styles.messageTime}>2:34 PM</div>
                      </div>
                    </div>
                    <div className={`${styles.message} ${styles.user}`}>
                      <div className={styles.messageContent}>
                        <p>
                          I'd focus on three key areas: content discovery,
                          community building, and personalization. For content
                          discovery, I'd implement an algorithmic feed that
                          learns from user behavior...
                        </p>
                        <div className={styles.messageTime}>2:36 PM</div>
                      </div>
                    </div>
                    <div className={`${styles.message} ${styles.ai}`}>
                      <div className={styles.messageAvatar}>AI</div>
                      <div className={styles.messageContent}>
                        <p>
                          Great start! Can you elaborate on the metrics you'd
                          use to measure success?
                        </p>
                        <div className={styles.messageTime}>2:37 PM</div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.scorecard}>
                    <div className={styles.scorecardHeader}>
                      <div className={styles.scorecardIcon}>📊</div>
                      <div>
                        <div className={styles.scoreHeader}>
                          Interview Results
                        </div>
                        <div className={styles.scoreSubtext}>
                          Overall Score: 8.0/10
                        </div>
                      </div>
                    </div>
                    <div className={styles.scoreGrid}>
                      <div className={styles.scoreItem}>
                        <div className={styles.scoreLabel}>Structure</div>
                        <div className={styles.scoreBar}>
                          <div
                            className={styles.scoreProgress}
                            style={{ width: "80%" }}
                          ></div>
                        </div>
                        <div className={styles.score}>8.0</div>
                      </div>
                      <div className={styles.scoreItem}>
                        <div className={styles.scoreLabel}>Metrics</div>
                        <div className={styles.scoreBar}>
                          <div
                            className={styles.scoreProgress}
                            style={{ width: "70%" }}
                          ></div>
                        </div>
                        <div className={styles.score}>7.0</div>
                      </div>
                      <div className={styles.scoreItem}>
                        <div className={styles.scoreLabel}>Communication</div>
                        <div className={styles.scoreBar}>
                          <div
                            className={styles.scoreProgress}
                            style={{ width: "90%" }}
                          ></div>
                        </div>
                        <div className={styles.score}>9.0</div>
                      </div>
                    </div>
                    <div className={styles.scorecardFooter}>
                      <div className={styles.improvementTip}>
                        💡 <strong>Tip:</strong> Great job on communication!
                        Consider adding more specific metrics like DAU/MAU
                        ratios.
                      </div>
                    </div>
                  </div>
                  <div className={styles.chatInput}>
                    <div className={styles.inputField}>
                      <span className={styles.inputPlaceholder}>
                        Type your response...
                      </span>
                    </div>
                    <div className={styles.sendButton}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path d="M1.5 8L15 1L10.5 8L15 15L1.5 8Z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners/Trust Section (Commented Out) */}
      {/* 
      <section className={styles.partners}>
        <div className="container">
          <h2 className={styles.partnersTitle}>Trusted by PMs from leading companies</h2>
          <p className={styles.partnersSubtitle}>PMs from these companies use our platform to stay interview-ready</p>
          <div className={styles.logos}>
            <span>Google</span> | <span>Amazon</span> | <span>Meta</span> | <span>Microsoft</span> | <span>Swiggy</span> | <span>DoorDash</span> | <span>ByteDance</span>
          </div>
        </div>
      </section>
      */}

      {/* Benefits Section */}
      <section
        className={styles.benefits}
        ref={setSectionRef("benefits")}
        data-section="benefits"
      >
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Built to make you interview-ready — fast.
            </h2>
          </div>
          <div
            className={`${styles.benefitsGrid} ${
              isVisible.benefits ? styles.visible : ""
            }`}
          >
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 className={styles.benefitTitle}>Practice Real Scenarios</h3>
              <p className={styles.benefitDescription}>
                Answer realistic PM interview questions in Product Design,
                Metrics, and Strategy.
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4" />
                  <path d="M9 11V9a3 3 0 0 1 6 0v2" />
                  <path d="M12 16v-2" />
                </svg>
              </div>
              <h3 className={styles.benefitTitle}>
                Get Instant, Honest Feedback
              </h3>
              <p className={styles.benefitDescription}>
                AI scores you across key PM skills — structure, prioritization,
                communication, and product sense.
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              </div>
              <h3 className={styles.benefitTitle}>
                Learn What Top PMs Would Say
              </h3>
              <p className={styles.benefitDescription}>
                See a 10/10 model answer after every response — understand what
                "great" actually looks like.
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 20V10" />
                  <path d="M12 20V4" />
                  <path d="M6 20v-6" />
                </svg>
              </div>
              <h3 className={styles.benefitTitle}>Track Your Progress</h3>
              <p className={styles.benefitDescription}>
                Watch your scores improve over time and identify where you need
                to focus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        className={styles.howItWorks}
        ref={setSectionRef("howItWorks")}
        data-section="howItWorks"
        id="how-it-works"
      >
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Interview practice that actually feels real.
            </h2>
          </div>
          <div
            className={`${styles.steps} ${
              isVisible.howItWorks ? styles.visible : ""
            }`}
          >
            <div className={`${styles.step} ${styles.stepDelay1}`}>
              <div className={styles.stepNumber}>01</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Start a Mock Interview</h3>
                <p className={styles.stepDescription}>
                  Choose a difficulty (Entry / Mid / Senior) and get your first
                  AI question.
                </p>
              </div>
            </div>

            <div className={`${styles.step} ${styles.stepDelay2}`}>
              <div className={styles.stepNumber}>02</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Answer Naturally</h3>
                <p className={styles.stepDescription}>
                  Type or speak your answer — the AI behaves like a real
                  interviewer.
                </p>
              </div>
            </div>

            <div className={`${styles.step} ${styles.stepDelay3}`}>
              <div className={styles.stepNumber}>03</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Get Feedback Instantly</h3>
                <p className={styles.stepDescription}>
                  Receive detailed scoring, improvement notes, and a 10/10
                  sample answer within seconds.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.howItWorksCTA}>
            <Link
              to={isLoggedIn ? "/interview" : "/auth/register"}
              className={`btn btn-primary btn-xl ${styles.ctaButton}`}
            >
              Try Your First Interview Free →
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        className={styles.pricing}
        ref={setSectionRef("pricing")}
        data-section="pricing"
      >
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Simple pricing. No surprises.
            </h2>
            <p className={styles.sectionSubtitle}>
              Start free. Upgrade only when you're ready for unlimited practice.
            </p>
          </div>
          <div
            className={`${styles.pricingGrid} ${
              isVisible.pricing ? styles.visible : ""
            }`}
          >
            <div className={styles.pricingCard}>
              <h3 className={styles.pricingTitle}>Free Plan</h3>
              <div className={styles.pricingPrice}>
                <span className={styles.price}>$0</span>
                <span className={styles.period}>/month</span>
              </div>
              <p className={styles.pricingDescription}>Try basic practice</p>
              <ul className={styles.pricingFeatures}>
                <li>3 mock interviews per month</li>
                <li>Basic feedback</li>
                <li>Access to all categories</li>
              </ul>
              <Link
                to={isLoggedIn ? "/interview" : "/auth/register"}
                className="btn btn-secondary btn-lg"
              >
                Start Free
              </Link>
            </div>

            <div className={`${styles.pricingCard} ${styles.popular}`}>
              <div className={styles.popularBadge}>Most Popular</div>
              <h3 className={styles.pricingTitle}>Pro Plan</h3>
              <div className={styles.pricingPrice}>
                <span className={styles.price}>$10</span>
                <span className={styles.period}>/month</span>
              </div>
              <p className={styles.pricingDescription}>For serious PM prep</p>
              <ul className={styles.pricingFeatures}>
                <li>Unlimited practice sessions</li>
                <li>Full feedback & 10/10 answers</li>
                <li>Progress dashboard</li>
                <li>Priority support</li>
              </ul>
              <Link to="/pricing" className="btn btn-primary btn-lg">
                Go Pro
              </Link>
            </div>
          </div>
          <p className={styles.pricingNote}>
            💳 No credit card required for free plan. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        className={styles.testimonials}
        ref={setSectionRef("testimonials")}
        data-section="testimonials"
      >
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Loved by aspiring PMs worldwide
            </h2>
          </div>
          <div
            className={`${styles.testimonialsGrid} ${
              isVisible.testimonials ? styles.visible : ""
            }`}
          >
            <div className={styles.testimonial}>
              <StarRating />
              <p className={styles.testimonialText}>
                "I used to struggle structuring my answers — this AI gave me
                instant clarity. The feedback felt like a real PM mentor."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>RK</div>
                <div>
                  <strong>Rachel K.</strong>
                  <span>Associate PM @ Microsoft</span>
                </div>
              </div>
            </div>

            <div className={styles.testimonial}>
              <StarRating />
              <p className={styles.testimonialText}>
                "It's better than mock interviews I paid $100+ for. The scoring
                rubric is spot on."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>VS</div>
                <div>
                  <strong>Vikram S.</strong>
                  <span>PM Candidate</span>
                </div>
              </div>
            </div>

            <div className={styles.testimonial}>
              <StarRating />
              <p className={styles.testimonialText}>
                "I finally got confident enough to ace my Meta interview. The
                10/10 model answers helped a lot."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>JL</div>
                <div>
                  <strong>Jenny L.</strong>
                  <span>PM @ Meta</span>
                </div>
              </div>
            </div>

            <div className={styles.testimonial}>
              <StarRating />
              <p className={styles.testimonialText}>
                "Practicing with this tool saved me weeks of prep time. The
                instant feedback loop is incredibly valuable."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>DM</div>
                <div>
                  <strong>David M.</strong>
                  <span>Senior PM @ Amazon</span>
                </div>
              </div>
            </div>

            <div className={styles.testimonial}>
              <StarRating />
              <p className={styles.testimonialText}>
                "The AI's feedback is surprisingly accurate. It helped me
                identify blind spots I didn't even know I had."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>PR</div>
                <div>
                  <strong>Priya R.</strong>
                  <span>PM @ Google</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        className={styles.faq}
        ref={setSectionRef("faq")}
        data-section="faq"
      >
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          </div>
          <div
            className={`${styles.faqList} ${
              isVisible.faq ? styles.visible : ""
            }`}
          >
            {[
              {
                question: "How accurate is the AI feedback?",
                answer:
                  "The AI uses structured PM rubrics based on real interview frameworks (like Exponent and FAANG guidelines). It gives reliable, detailed feedback instantly.",
              },
              {
                question: "Can I really use it for free?",
                answer:
                  "Yes. You can try 3 interviews per month for free. No credit card needed.",
              },
              {
                question: "How does the AI know what's a good answer?",
                answer:
                  "It's trained on thousands of real-world PM interview responses and follows evaluation rubrics from top product companies.",
              },
              {
                question: "Is this only for entry-level PMs?",
                answer:
                  "No — you can choose difficulty levels (Entry, Mid, Senior) based on your experience.",
              },
              {
                question: "Can teams or bootcamps use it?",
                answer:
                  "Yes! We offer special accounts for training programs and PM coaching cohorts. Contact us to learn more.",
              },
              {
                question: "What companies are the questions from?",
                answer:
                  "Our questions are based on real interview questions from companies like Google, Meta, Amazon, Microsoft, and many top startups.",
              },
            ].map((faq, index) => (
              <div key={index} className={styles.faqItem}>
                <button
                  className={styles.faqQuestion}
                  onClick={() => toggleFAQ(index)}
                >
                  <span>{faq.question}</span>
                  <svg
                    className={`${styles.faqIcon} ${
                      openFAQ === index ? styles.open : ""
                    }`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l4 4 4-4" />
                  </svg>
                </button>
                <div
                  className={`${styles.faqAnswer} ${
                    openFAQ === index ? styles.open : ""
                  }`}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={styles.finalCTA}>
        <div className={styles.ctaBackground}>
          <div className={styles.ctaGradientOrb}></div>
        </div>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              Ready to ace your next PM interview?
            </h2>
            <p className={styles.ctaSubtitle}>
              Start your first mock interview today — it's free, and you'll get
              detailed feedback in minutes.
            </p>
            <Link
              to={isLoggedIn ? "/interview" : "/auth/register"}
              className={`btn btn-primary btn-xl ${styles.ctaButton}`}
            >
              Start Practicing Free →
            </Link>
            <div className={styles.trustBadges}>
              <span className={styles.trustBadge}>
                ⭐ 1,000+ users practicing already
              </span>
              <span className={styles.trustBadge}>
                🔒 Secure & private sessions
              </span>
              <span className={styles.trustBadge}>
                💳 No credit card required
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContent}>
            <div className={styles.footerColumn}>
              <h4>Product</h4>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/#benefits">Features</Link>
                </li>
                <li>
                  <Link to="/pricing">Pricing</Link>
                </li>
                <li>
                  <Link to="/auth/login">Login</Link>
                </li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h4>Company</h4>
              <ul>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/terms">Terms</Link>
                </li>
                <li>
                  <Link to="/privacy">Privacy</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h4>Social</h4>
              <ul>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" target="_blank" rel="noopener noreferrer">
                    Product Hunt
                  </a>
                </li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h4>Newsletter</h4>
              <p>Get interview tips & product updates monthly.</p>
              <div className={styles.newsletterForm}>
                <input type="email" placeholder="Enter your email" />
                <button className="btn btn-primary">Subscribe</button>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>© 2025 PM Interview Practice — Built for PMs, powered by AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
