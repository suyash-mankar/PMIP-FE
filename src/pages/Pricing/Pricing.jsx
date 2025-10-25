import { useState, useEffect } from "react";
import { getGoogleAuthUrl, createCheckoutSession } from "../../api/client";
import styles from "./Pricing.module.scss";

function Pricing() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    setIsLoggedIn(!!token);
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const plans = [
    {
      id: "free",
      name: "Free Plan",
      price: "₹0",
      interval: "month",
      features: [
        "3 mock interviews per month",
        "Basic AI feedback summary",
        "Mixed questions from all categories",
      ],
      cta: "Start Basic Free Plan",
      isFree: true,
      highlighted: false,
      showNoSignup: true,
    },
    {
      id: "pro",
      name: "Pro Plan",
      price: "₹499",
      interval: "month",
      features: [
        "Unlimited mock interviews",
        "Detailed, rubric-based feedback (6 key PM skills + tips)",
        "Expert-level model answers for every question",
        "Choose question category (Design, Metrics, RCAs, Strategy, etc.)",
        "Voice Input & Output",
        "Progress Dashboard & Analytics",
        "Priority Support & Updates",
      ],
      cta: isLoggedIn ? "Upgrade to Pro" : "Start Free 2-Day Pro Trial",
      isFree: false,
      highlighted: true,
    },
  ];

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

  const handleCheckout = (plan) => {
    if (plan.isFree) {
      // Allow anyone to try the basic free plan - no signup needed
      window.location.href = "/interview";
      return;
    }

    // For Pro plan
    if (isLoggedIn) {
      // If logged in, initiate Razorpay checkout
      handleRazorpayCheckout();
    } else {
      // If not logged in, redirect to Google OAuth for instant signup and free trial
      window.location.href = getGoogleAuthUrl();
    }
  };

  return (
    <div className={styles.pricingPage}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>
            {isLoggedIn
              ? "Level up your interview prep with AI-powered Pro."
              : "Plans built for how PMs actually prepare."}
          </h1>
          <p className={styles.pricingSubtitle}>
            {isLoggedIn
              ? "Get unlimited PM mocks, deep feedback, and track your growth like never before."
              : "Start free, upgrade when you're ready to go unlimited."}
          </p>
        </div>

        <div className={styles.plansGrid}>
          <div className={styles.leftColumn}>
            <div className={styles.whyUpgradeCard}>
              <h2 className={styles.upgradeTitle}>Why Upgrade to Pro</h2>
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
                    See perfect, benchmark-quality responses for every question.
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

            {!isLoggedIn &&
              plans
                .filter((plan) => plan.isFree)
                .map((plan) => (
                  <div
                    key={plan.id}
                    className={`${styles.planCard} ${styles.compactCard}`}
                  >
                    <div className={styles.planHeader}>
                      <h3 className={styles.planName}>{plan.name}</h3>
                      <div className={styles.planPrice}>
                        <span className={styles.priceAmount}>{plan.price}</span>
                        {plan.interval && (
                          <span className={styles.priceInterval}>
                            /{plan.interval}
                          </span>
                        )}
                      </div>
                    </div>

                    <ul className={styles.featureList}>
                      {plan.features.map((feature, index) => (
                        <li key={index} className={styles.feature}>
                          <span className={styles.checkmark}>✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      className="btn btn-outline btn-lg"
                      style={{ width: "100%" }}
                      onClick={() => handleCheckout(plan)}
                    >
                      {plan.cta}
                    </button>

                    {plan.showNoSignup && (
                      <p className={styles.noSignupNote}>
                        Perfect for getting started. No signup needed
                      </p>
                    )}
                  </div>
                ))}

            {isLoggedIn && (
              <>
                {/* Testimonial */}
                <div className={styles.testimonialCard}>
                  <div className={styles.quoteIcon}>"</div>
                  <p className={styles.testimonialText}>
                    The AI feedback was sharper than any mock I've done with
                    mentors. It pinpointed what I missed in metrics questions —
                    super useful before my PM interview.
                  </p>
                  <div className={styles.testimonialAuthor}>
                    <div className={styles.authorAvatar}>AS</div>
                    <div>
                      <div className={styles.authorName}>Ananya S.</div>
                      <div className={styles.authorTitle}>
                        PM Candidate @ Swiggy
                      </div>
                    </div>
                  </div>
                  <div className={styles.starRating}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {plans
            .filter((plan) => plan.highlighted)
            .map((plan) => (
              <div
                key={plan.id}
                className={`${styles.planCard} ${styles.planHighlighted}`}
              >
                <div className={styles.badge}>Most Popular</div>

                <div className={styles.planHeader}>
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <div className={styles.planPrice}>
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
                        <span className={styles.thenPrice}>
                          then {plan.price}/{plan.interval}
                        </span>
                      </>
                    )}
                  </div>
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

                <ul className={styles.featureList}>
                  {plan.features.map((feature, index) => (
                    <li key={index} className={styles.feature}>
                      <span className={styles.checkmark}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`btn btn-primary btn-lg ${
                    isProcessing ? styles.buttonLoading : ""
                  }`}
                  style={{ width: "100%" }}
                  onClick={() => handleCheckout(plan)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <span className={styles.loadingContent}>
                      <span className={styles.spinner}></span>
                      <span>Processing...</span>
                    </span>
                  ) : (
                    plan.cta
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
            ))}
        </div>

        <p className={styles.pricingReassurance}>
          Thousands of PM aspirants are already preparing smarter with AI.
        </p>

        <div className={styles.faq}>
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                Is there a free trial available?
              </h3>
              <p className={styles.faqAnswer}>
                Yes! You get a 2-day free Pro Trial with full access to all Pro
                features — no credit card required. After 48 hours, your account
                automatically moves to the Free Plan (3 mocks/month), so you can
                keep practicing without interruptions.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                What&apos;s included in the Free Plan?
              </h3>
              <p className={styles.faqAnswer}>
                The Free Plan gives you 3 mock interviews per month, basic
                feedback, and mixed questions from all PM categories. It&apos;s
                perfect for getting started before upgrading to Pro.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                What do I get with the Pro Plan?
              </h3>
              <p className={styles.faqAnswer}>
                The Pro Plan unlocks everything — unlimited interviews, detailed
                rubric-based feedback (6 PM skills), expert-level model answers,
                voice input/output, progress tracking, and category selection
                (Design, Metrics, RCAs, Strategy, etc.).
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Can I cancel anytime?</h3>
              <p className={styles.faqAnswer}>
                Yes, absolutely. You can cancel your subscription anytime from
                your dashboard. You&apos;ll retain access until your billing
                period ends — no hidden charges or lock-ins.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                What payment methods do you support?
              </h3>
              <p className={styles.faqAnswer}>
                We support all major debit/credit cards, UPI, wallets, and net
                banking through Razorpay — India&apos;s most trusted payment
                gateway.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                Is my payment information secure?
              </h3>
              <p className={styles.faqAnswer}>
                Yes. All transactions are processed securely through Razorpay
                with bank-level encryption. We don&apos;t store or share your
                payment details.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                What&apos;s your refund policy?
              </h3>
              <p className={styles.faqAnswer}>
                We offer a 7-day money-back guarantee for first-time Pro users.
                If you&apos;re not satisfied, you can request a refund — no
                questions asked.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                What happens after my free trial ends?
              </h3>
              <p className={styles.faqAnswer}>
                Once your 2-day Pro trial ends, you&apos;ll automatically move
                to the Free Plan (3 mocks/month). You can upgrade to Pro anytime
                to continue unlimited practice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
