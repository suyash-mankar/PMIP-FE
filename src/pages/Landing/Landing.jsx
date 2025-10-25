import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  getGoogleAuthUrl,
  subscribeToNewsletter,
  createCheckoutSession,
} from "../../api/client";
import styles from "./Landing.module.scss";

function Landing() {
  const [isVisible, setIsVisible] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handleRazorpayCheckout = async () => {
    setIsProcessing(true);
    try {
      // Create checkout session
      const response = await createCheckoutSession("inr");
      const {
        subscriptionId,
        amount,
        currency,
        razorpayKeyId,
        userEmail,
        userName,
      } = response.data;

      // Initialize Razorpay Checkout with customization
      const options = {
        key: razorpayKeyId,
        subscription_id: subscriptionId,
        name: "PM Interview Practice",
        description: "Pro Plan - Monthly Subscription",
        image: "https://pminterviewpractice.com/logo.png", // Your logo
        amount: amount,
        currency: currency,
        prefill: {
          email: userEmail,
          name: userName,
          contact: "", // Phone number if you have it
        },
        notes: {
          plan: "Pro Plan",
          billing: "Monthly",
        },
        theme: {
          color: "#8b5cf6", // Your brand color (purple)
          backdrop_color: "rgba(0, 0, 0, 0.8)", // Dark backdrop
        },
        // Enhanced payment method display configuration
        config: {
          display: {
            blocks: {
              recommended: {
                name: "Recommended Payment Methods",
                instruments: [
                  {
                    method: "upi",
                  },
                  {
                    method: "card",
                    types: ["credit", "debit"],
                  },
                ],
              },
              other: {
                name: "Other Payment Methods",
                instruments: [
                  {
                    method: "netbanking",
                  },
                  {
                    method: "wallet",
                  },
                ],
              },
            },
            sequence: ["block.recommended", "block.other"],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
        modal: {
          backdropclose: true, // Allow closing by clicking outside
          escape: true, // Allow closing with ESC key
          handleback: true, // Handle browser back button
          confirm_close: true, // Confirm before closing
          ondismiss: function () {
            setIsProcessing(false);
          },
          animation: true, // Smooth animations
        },
        handler: function (response) {
          // Payment successful
          console.log("Payment successful:", response);
          alert("Payment successful! You now have Pro access.");
          window.location.href = "/dashboard";
        },
        notify: {
          sms: true, // Send SMS notification
          email: true, // Send email notification
        },
        remember_customer: false, // Don't remember customer details
        readonly: {
          email: false, // Allow editing email
          contact: false, // Allow editing phone
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to initiate checkout. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleGoProClick = (e) => {
    e.preventDefault();

    // If not logged in, redirect to Google OAuth for instant signup
    if (!isLoggedIn) {
      window.location.href = getGoogleAuthUrl();
      return;
    }

    // If already logged in, directly initiate Razorpay checkout
    handleRazorpayCheckout();
  };

  const handleFreeClick = (e) => {
    e.preventDefault();

    // Allow anyone to try the basic free plan - no signup needed
    navigate("/interview");
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterStatus("");
    setNewsletterLoading(true);

    try {
      const response = await subscribeToNewsletter(
        newsletterEmail,
        "landing_page"
      );
      setNewsletterStatus("success");
      setNewsletterEmail("");

      // Clear success message after 5 seconds
      setTimeout(() => {
        setNewsletterStatus("");
      }, 5000);
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setNewsletterStatus("error");

      // Clear error message after 5 seconds
      setTimeout(() => {
        setNewsletterStatus("");
      }, 5000);
    } finally {
      setNewsletterLoading(false);
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
                  AI trained to help PMs crack real interview challenges.
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
                <button
                  onClick={handleGoProClick}
                  className={`btn btn-primary btn-xl ${styles.ctaButton}`}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className={styles.spinner}></span>
                      Loading...
                    </>
                  ) : (
                    <>
                      {isLoggedIn
                        ? "Get Interview Practice Pro"
                        : "Start Your Free 2-Day Pro Trial"}
                      <span className={styles.ctaArrow}>→</span>
                    </>
                  )}
                </button>
                {!isLoggedIn && (
                  <>
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
                  </>
                )}
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
            <button
              onClick={handleGoProClick}
              className={`btn btn-primary btn-xl ${styles.ctaButton}`}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className={styles.spinner}></span>
                  Loading...
                </>
              ) : (
                <>
                  {isLoggedIn
                    ? "Get Interview Practice Pro"
                    : "Start Your Free 2-Day Pro Trial"}
                </>
              )}
            </button>
            {!isLoggedIn && (
              <p className={styles.ctaSubtext}>
                No credit card required • Instant access to all features
              </p>
            )}
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
              Plans built for how PMs actually prepare.
            </h2>
            <p className={styles.pricingSectionSubtitle}>
              Start free, upgrade when you’re ready to go unlimited.
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
                <div className={styles.upgradeList}>
                  <div className={styles.upgradeItem}>
                    <h4 className={styles.upgradeItemTitle}>
                      Master Every PM Skill
                    </h4>
                    <p className={styles.upgradeItemDesc}>
                      Practice Product Design, Metrics, RCAs, and Strategy with
                      unlimited AI mocks.
                    </p>
                  </div>
                  <div className={styles.upgradeItem}>
                    <h4 className={styles.upgradeItemTitle}>
                      Get Feedback Like a Hiring Manager
                    </h4>
                    <p className={styles.upgradeItemDesc}>
                      Receive detailed, structured feedback that mirrors real PM
                      interview rubrics.
                    </p>
                  </div>
                  <div className={styles.upgradeItem}>
                    <h4 className={styles.upgradeItemTitle}>
                      Learn from Expert-Level Answers
                    </h4>
                    <p className={styles.upgradeItemDesc}>
                      See perfect, benchmark-quality responses for every
                      question.
                    </p>
                  </div>
                  <div className={styles.upgradeItem}>
                    <h4 className={styles.upgradeItemTitle}>
                      Track Growth That Matters
                    </h4>
                    <p className={styles.upgradeItemDesc}>
                      Progress faster with insights into your strengths and weak
                      spots.
                    </p>
                  </div>
                  <div className={styles.upgradeItem}>
                    <h4 className={styles.upgradeItemTitle}>
                      Unlimited Practice, Anytime
                    </h4>
                    <p className={styles.upgradeItemDesc}>
                      No limits. Practice whenever you want — day or night.
                    </p>
                  </div>
                </div>
              </div>

              <div className={`${styles.pricingCard} ${styles.compactCard}`}>
                <h3 className={styles.pricingTitle}>Free Plan</h3>
                <div className={styles.pricingPrice}>
                  <span className={styles.price}>₹0</span>
                  <span className={styles.period}>/month</span>
                </div>
                <ul className={styles.pricingFeatures}>
                  <li>3 mock interviews per month</li>
                  <li>Basic AI feedback summary</li>
                  <li>Mixed questions from all categories</li>
                </ul>
                <button
                  onClick={handleFreeClick}
                  className="btn btn-secondary btn-lg"
                  style={{ width: "100%" }}
                  disabled={isLoggedIn}
                >
                  Start Basic Free Plan
                </button>
                {!isLoggedIn && (
                  <p className={styles.noSignupNote}>
                    Perfect for getting started. No signup needed
                  </p>
                )}
              </div>
            </div>

            <div className={`${styles.pricingCard} ${styles.popular}`}>
              <div className={styles.popularBadge}>Most Popular</div>
              <h3 className={styles.pricingTitle}>Pro Plan</h3>
              <div className={styles.pricingPrice}>
                {isLoggedIn ? (
                  <div className={styles.priceDisplay}>
                    <div className={styles.priceWrapper}>
                      <span className={styles.currency}>₹</span>
                      <span className={styles.priceAmount}>499</span>
                      <span className={styles.priceInterval}>/month</span>
                    </div>
                    <p className={styles.priceSubtext}>
                      Unlimited access to all Pro features
                    </p>
                  </div>
                ) : (
                  <>
                    <span className={styles.freeTrialPrice}>
                      Free 2-Day Pro Trial
                    </span>
                    <span className={styles.thenPrice}>then ₹499/month</span>
                  </>
                )}
              </div>
              {!isLoggedIn && (
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
              )}
              <ul className={styles.pricingFeatures}>
                <li>Unlimited mock interviews</li>
                <li>
                  Detailed, rubric-based feedback (6 key PM skills + tips)
                </li>
                <li>Expert-level model answers for every question</li>
                <li>
                  Choose question category (Design, Metrics, RCAs, Strategy,
                  etc.)
                </li>
                <li>Voice Input & Output</li>
                <li>Progress Dashboard & Analytics</li>
                <li>Priority Support & Updates</li>
              </ul>
              <button
                onClick={handleGoProClick}
                className="btn btn-primary btn-lg"
                style={{ width: "100%" }}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className={styles.spinner}></span>
                    Loading...
                  </>
                ) : isLoggedIn ? (
                  "Upgrade to Pro"
                ) : (
                  "Start Free 2-Day Pro Trial"
                )}
              </button>
              {isLoggedIn ? (
                <p className={styles.cancelNote}>
                  Cancel anytime. No lock-ins.
                </p>
              ) : (
                <p className={styles.trialDisclaimer}>
                  Start your 2-day free trial — no credit card required. After
                  trial, you'll automatically move to the Free Plan (3
                  mocks/month). No hidden charges.
                </p>
              )}
            </div>
          </div>

          <p className={styles.pricingReassurance}>
            Thousands of PM aspirants are already preparing smarter with AI.
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
            <h2 className={styles.sectionTitle}>What early users are saying</h2>
            <p className={styles.sectionSubtext}>
              Rated ★4.8/5 by aspiring PMs from India's top startups and FAANG
              companies.
            </p>
          </div>
          <div
            className={`${styles.testimonialsGrid} ${
              isVisible.testimonials ? styles.visible : ""
            }`}
          >
            <div className={styles.testimonial}>
              <StarRating />
              <p className={styles.testimonialText}>
                "The AI feedback was sharper than any mock I've done with
                mentors. It pinpointed what I missed in metrics questions —
                super useful before my Flipkart PM interview."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>AS</div>
                <div>
                  <strong>Ananya S.</strong>
                  <span>PM Candidate @ Swiggy</span>
                </div>
              </div>
            </div>

            <div className={styles.testimonial}>
              <StarRating />
              <p className={styles.testimonialText}>
                "I used the 2-day Pro trial before my interview week — the
                instant feedback and 10/10 model answers helped me tighten my
                structure in just two sessions."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>RP</div>
                <div>
                  <strong>Rohit P.</strong>
                  <span>Associate PM @ Razorpay</span>
                </div>
              </div>
            </div>

            <div className={styles.testimonial}>
              <StarRating />
              <p className={styles.testimonialText}>
                "Loved how personalized the feedback felt. It doesn't just rate
                your answer — it tells why you missed the mark. Way better than
                random YouTube prep."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>NG</div>
                <div>
                  <strong>Neha G.</strong>
                  <span>PM Aspirant, IIM Bangalore</span>
                </div>
              </div>
            </div>

            <div className={styles.testimonial}>
              <StarRating />
              <p className={styles.testimonialText}>
                "This AI is scary good. I got detailed feedback across product
                sense, empathy, and communication. It's like having a PM mentor
                on call 24x7."
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.testimonialAvatar}>KT</div>
                <div>
                  <strong>Karan T.</strong>
                  <span>Senior Product Analyst @ Zomato</span>
                </div>
              </div>
            </div>

            <div className={styles.testimonial}>
              <StarRating />
              <p className={styles.testimonialText}>
                "Practicing here made me realize where I was overexplaining. The
                feedback is super specific — something even human mock partners
                miss."
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
                  "Our AI is trained specifically for PM interviews using top frameworks and real interview data. It evaluates your answers across key PM skills — structure, metrics, prioritization, communication, and product sense — and provides detailed, actionable feedback instantly.",
              },
              {
                question: "Can I really use it for free?",
                answer:
                  "Yes! You get full Pro access free for 2 days — no credit card required. After the trial, you'll automatically switch to the Free plan (3 interviews per month).",
              },
              {
                question: "How does the AI know what's a good answer?",
                answer:
                  "It's trained on thousands of PM interview examples, case studies, and expert responses — so it knows what great answers look like and can explain why yours worked (or didn't).",
              },
              {
                question: "Can I practice one specific type of PM question?",
                answer:
                  "Yes! You can choose from focused categories like Product Design, Metrics, RCAs, and Strategy — or let the AI pick random questions across all types. It's a great way to target your weak areas or simulate a full interview experience.",
              },
              {
                question: "What companies are the questions from?",
                answer:
                  "We source real-world PM interview questions from FAANG companies and top Indian startups like Swiggy, Zomato, Razorpay, and Meesho — constantly updated.",
              },
              {
                question: "Will my answers and data stay private?",
                answer:
                  "Yes. Your answers are saved only to show progress in your dashboard and are never shared. You can delete your account and data anytime.",
              },
              {
                question: "Who do I contact if I have an issue or question?",
                answer:
                  "You can reach us directly at pminterviewpracticemain@gmail.com — whether it's a product issue, feedback, or general query. We usually respond within 24 hours.",
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
              Get Interview Ready - The Smart Way.
            </h2>
            <p className={styles.ctaSubtitle}>
              Practice real PM interview questions with AI trained for PM
              interviews. Start free and get expert-level feedback in minutes.
            </p>
            <button
              onClick={handleGoProClick}
              className={`btn btn-primary btn-xl ${styles.ctaButton}`}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <span className={styles.spinner}></span>
                  Loading...
                </>
              ) : (
                <>
                  {isLoggedIn
                    ? "Get Interview Practice Pro →"
                    : "Start Your Free 2-Day Pro Trial →"}
                </>
              )}
            </button>
            <div className={styles.trustBadges}>
              <span className={styles.trustBadge}>
                ⭐ Designed for real PM interviews.
              </span>
              <span className={styles.trustBadge}>🔒 Private & Secure</span>
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
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h4>Support</h4>
              <ul>
                <li>
                  <Link to="/contact">Contact Us</Link>
                </li>
                <li>
                  <a href="mailto:pminterviewpracticemain@gmail.com">
                    Email Support
                  </a>
                </li>
                <li>
                  <Link to="/#faq">FAQ</Link>
                </li>
              </ul>
            </div>
            <div className={styles.footerColumn}>
              <h4>Get smarter with your PM prep.</h4>
              <p>
                Join our monthly newsletter for AI tips, new interview
                questions, and product updates.
              </p>
              <form
                className={styles.newsletterForm}
                onSubmit={handleNewsletterSubmit}
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  disabled={newsletterLoading}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={newsletterLoading}
                >
                  {newsletterLoading ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
              {newsletterStatus === "success" && (
                <p className={styles.newsletterSuccess}>
                  ✓ Successfully subscribed! Check your inbox.
                </p>
              )}
              {newsletterStatus === "error" && (
                <p className={styles.newsletterError}>
                  ✗ Something went wrong. Please try again.
                </p>
              )}
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>
              © 2025 PM Interview Practice — Built for PMs. Powered by AI.
              Designed for growth.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
