import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { createCheckoutSession } from "../../api/client";
import styles from "./Landing.module.scss";

function Landing() {
  const [isVisible, setIsVisible] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [loading, setLoading] = useState(false);
  const sectionRefs = useRef({});
  const navigate = useNavigate();

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

  const handleGoProClick = async (e) => {
    e.preventDefault();

    // Check if user is logged in
    if (!isLoggedIn) {
      navigate("/auth/login");
      return;
    }

    setLoading(true);

    try {
      // Create checkout session on backend (INR only for India launch)
      const response = await createCheckoutSession("inr");
      const {
        subscriptionId,
        amount,
        currency: curr,
        planName,
        razorpayKeyId,
        userEmail,
        userName,
      } = response.data;

      // Initialize Razorpay checkout
      const options = {
        key: razorpayKeyId,
        subscription_id: subscriptionId,
        name: "PM Interview Practice",
        description: planName,
        image: "/logo.png",
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: "#6366f1",
        },
        handler: function (response) {
          console.log("Payment successful:", response);
          navigate("/dashboard?payment=success");
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        alert("Payment failed. Please try again.");
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to start checkout. Please try again.");
      setLoading(false);
    }
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
              <div className={styles.heroSubtitle}>
                <p>
                  Practice real PM interview questions with an AI trained for
                  Product Management interviews. Get detailed feedback,
                  expert-level AI answer, and track your progress in a single
                  dashboard.
                </p>
              </div>
              <div className={styles.heroCTA}>
                <Link
                  to="/auth/register"
                  className={`btn btn-primary btn-xl ${styles.ctaButton}`}
                >
                  Start Your Free 2-Day Pro Trial
                  <span className={styles.ctaArrow}>→</span>
                </Link>
                <p className={styles.ctaNoCreditCard}>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  No credit card required • Instant access to all features
                </p>
                <Link to="/interview" className={styles.ctaSecondary}>
                  Try sample interview without signup
                </Link>
              </div>

              <div className={styles.heroStats}>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>5,000+</div>
                  <div className={styles.statLabel}>
                    PM interviews used to train the AI
                  </div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>80%</div>
                  <div className={styles.statLabel}>
                    Users improve within 3 sessions
                  </div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statNumber}>&lt;60 sec</div>
                  <div className={styles.statLabel}>
                    To start your first mock interview
                  </div>
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
                            style={{ width: "90%" }}
                          ></div>
                        </div>
                        <div className={styles.score}>9.0</div>
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
                        <div className={styles.scoreLabel}>Prioritization</div>
                        <div className={styles.scoreBar}>
                          <div
                            className={styles.scoreProgress}
                            style={{ width: "80%" }}
                          ></div>
                        </div>
                        <div className={styles.score}>8.0</div>
                      </div>
                    </div>
                    <div className={styles.scorecardFooter}>
                      <div className={styles.improvementTip}>
                        💡 <strong>Tip:</strong> Great job on structure!
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
            <p className={styles.sectionSubtext}>
              Everything you need to prepare smarter, not harder.
            </p>
          </div>
          <div
            className={`${styles.benefitsGrid} ${
              isVisible.benefits ? styles.visible : ""
            }`}
          >
            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                </svg>
              </div>
              <h3 className={styles.benefitTitle}>
                Practice Real Interview Scenarios
              </h3>
              <p className={styles.benefitDescription}>
                Tackle questions from real PM interviews — Product Design,
                Strategy, Metrics, and more. The AI adapts to your skill level
                so every session feels fresh and challenging.
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <h3 className={styles.benefitTitle}>
                Get Actionable Feedback Instantly
              </h3>
              <p className={styles.benefitDescription}>
                Receive structured feedback on every answer — with scores across
                key PM skills like structure, prioritization, and product sense.
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
                </svg>
              </div>
              <h3 className={styles.benefitTitle}>
                Learn from Expert-Level Model Answers
              </h3>
              <p className={styles.benefitDescription}>
                See how top PMs would approach the same question. Compare your
                answer with a model response and understand what "great"
                actually looks like.
              </p>
            </div>

            <div className={styles.benefitCard}>
              <div className={styles.benefitIcon}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <h3 className={styles.benefitTitle}>
                Track Your Growth Over Time
              </h3>
              <p className={styles.benefitDescription}>
                Your personal dashboard shows progress, trends, and improvement
                areas — so you know exactly where to focus next.
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
              How it works — your AI-powered interview journey.
            </h2>
          </div>
          <div
            className={`${styles.stepsTimeline} ${
              isVisible.howItWorks ? styles.visible : ""
            }`}
          >
            <div className={`${styles.timelineStep} ${styles.stepDelay1}`}>
              <div className={styles.stepIconCircle}>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <div className={styles.timelineContent}>
                <div className={styles.stepNumber}>01</div>
                <h3 className={styles.stepTitle}>Start Your Interview</h3>
                <p className={styles.stepDescription}>
                  Pick a category or practice random questions. The AI starts
                  with a realistic PM scenario from top tech interviews — and
                  tracks how long you take to respond.
                </p>
              </div>
            </div>

            <div className={styles.timelineConnector}></div>

            <div className={`${styles.timelineStep} ${styles.stepDelay2}`}>
              <div className={styles.stepIconCircle}>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className={styles.timelineContent}>
                <div className={styles.stepNumber}>02</div>
                <h3 className={styles.stepTitle}>Answer Naturally</h3>
                <p className={styles.stepDescription}>
                  Speak or type your answer just like in a real interview. Ask
                  clarifying questions, refine your thoughts, and submit when
                  ready.
                </p>
              </div>
            </div>

            <div className={styles.timelineConnector}></div>

            <div className={`${styles.timelineStep} ${styles.stepDelay3}`}>
              <div className={styles.stepIconCircle}>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div className={styles.timelineContent}>
                <div className={styles.stepNumber}>03</div>
                <h3 className={styles.stepTitle}>Get Feedback</h3>
                <p className={styles.stepDescription}>
                  Instantly receive scores, performance breakdowns, and
                  expert-level model answers to help you improve with every
                  attempt.
                </p>
              </div>
            </div>

            <div className={styles.timelineConnector}></div>

            <div className={`${styles.timelineStep} ${styles.stepDelay4}`}>
              <div className={styles.stepIconCircle}>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="20" x2="12" y2="10" />
                  <line x1="18" y1="20" x2="18" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="16" />
                </svg>
              </div>
              <div className={styles.timelineContent}>
                <div className={styles.stepNumber}>04</div>
                <h3 className={styles.stepTitle}>Track Progress</h3>
                <p className={styles.stepDescription}>
                  Monitor your daily and weekly performance in your personal
                  dashboard — see how your skills evolve over time.
                </p>
              </div>
            </div>
          </div>
          <div className={styles.howItWorksCTA}>
            <Link
              to={isLoggedIn ? "/interview" : "/auth/register"}
              className={`btn btn-primary btn-xl ${styles.ctaButton}`}
            >
              Start Your Free 2-Day Pro Trial
            </Link>
            <p className={styles.ctaSubtext}>
              No credit card required • Instant access to all features
            </p>
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
            <h2 className={styles.sectionTitle}>Simple, Transparent Plans</h2>
            <p className={styles.pricingSectionSubtitle}>
              Start Free. Upgrade When You're Ready.
              <br />
              Practice real Product Management interviews with AI — get instant
              feedback, learn from model answers, and track your progress.
            </p>
          </div>
          <div
            className={`${styles.pricingGrid} ${
              isVisible.pricing ? styles.visible : ""
            }`}
          >
            <div className={styles.leftColumn}>
              <div className={styles.whyUpgradeCard}>
                <h3 className={styles.upgradeTitle}>Why Upgrade to Pro</h3>
                <ul className={styles.upgradeList}>
                  <li>
                    Focus your prep on specific skills (Design, Metrics, RCAs,
                    Strategy)
                  </li>
                  <li>
                    Get detailed, hiring-manager-style feedback on every answer
                  </li>
                  <li>Learn from perfect "10/10" responses</li>
                  <li>Track your progress and improve faster</li>
                  <li>Practice unlimited interviews — anytime, anywhere</li>
                </ul>
              </div>

              <div className={`${styles.pricingCard} ${styles.compactCard}`}>
                <h3 className={styles.pricingTitle}>Free Plan</h3>
                <div className={styles.pricingPrice}>
                  <span className={styles.price}>₹0</span>
                  <span className={styles.period}>/month</span>
                </div>
                <ul className={styles.pricingFeatures}>
                  <li>3 mock interviews per month</li>
                  <li>Basic summary feedback</li>
                  <li>Mixed questions from all categories</li>
                </ul>
                <Link
                  to={isLoggedIn ? "/interview" : "/auth/register"}
                  className="btn btn-secondary btn-lg"
                >
                  Start Free
                </Link>
                <p className={styles.noSignupNote}>no signup needed</p>
              </div>
            </div>

            <div className={`${styles.pricingCard} ${styles.popular}`}>
              <div className={styles.popularBadge}>Most Popular</div>
              <h3 className={styles.pricingTitle}>Pro Plan</h3>
              <div className={styles.pricingPrice}>
                <span className={styles.freeTrialPrice}>Free for 48 hrs</span>
                <span className={styles.thenPrice}>then ₹499/month</span>
              </div>
              <div className={styles.noCreditCard}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                No credit card required for free trial
              </div>
              <ul className={styles.pricingFeatures}>
                <li>Unlimited mock interviews</li>
                <li>Detailed rubric-based feedback (6 dimensions + tips)</li>
                <li>Model "10/10" answers for every question</li>
                <li>Choose category (Design, Metrics, RCAs, Strategy, etc.)</li>
                <li>Voice Input & Output</li>
                <li>Progress Dashboard & Analytics</li>
                <li>Priority Support & Updates</li>
              </ul>
              <button
                onClick={handleGoProClick}
                className="btn btn-primary btn-lg"
                disabled={loading}
                style={{ width: "100%" }}
              >
                {loading ? "Loading..." : "Sign up and Try Pro"}
              </button>
              <p className={styles.trialDisclaimer}>
                Signup and get full Pro access free for 48 hours. After trial,
                automatically switch to Free plan (3 mocks/month) — no charges.
              </p>
            </div>
          </div>

          {/* <p className={styles.pricingNote}>
            No credit card required. Cancel anytime.
          </p> */}
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
              <h4>Legal</h4>
              <ul>
                <li>
                  <Link to="/terms">Terms & Conditions</Link>
                </li>
                <li>
                  <Link to="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/refund">Refund Policy</Link>
                </li>
                <li>
                  <Link to="/shipping">Shipping Policy</Link>
                </li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h4>Support</h4>
              <ul>
                <li>
                  <Link to="/contact">Contact Us</Link>
                </li>
                <li>
                  <a href="mailto:support@pminterviewpractice.com">
                    Email Support
                  </a>
                </li>
                <li>
                  <Link to="/#faq">FAQ</Link>
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
