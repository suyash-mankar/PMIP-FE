import { useState } from "react";
import { createCheckoutSession } from "../../api/client";
import { useNavigate } from "react-router-dom";
import styles from "./Pricing.module.scss";

function Pricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const plans = [
    {
      id: "free",
      name: "Free Plan",
      price: "₹0",
      interval: "month",
      features: [
        "3 mock interviews per month",
        "Basic summary feedback",
        "Mixed questions from all categories",
      ],
      cta: "Start Free",
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
        "Detailed rubric-based feedback (6 dimensions + tips)",
        "Model '10/10' answers for every question",
        "Choose category (Design, Metrics, RCAs, Strategy, etc.)",
        "Voice Input & Output",
        "Progress Dashboard & Analytics",
        "Priority Support & Updates",
      ],
      cta: "Get Pro Free for 48 hrs",
      isFree: false,
      highlighted: true,
    },
  ];

  const handleCheckout = async (plan) => {
    if (plan.isFree) {
      navigate("/auth/register");
      return;
    }

    setLoading(true);
    setError("");

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
        image: "/logo.png", // Your logo
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: "#6366f1", // Your primary color
        },
        handler: function (response) {
          // Payment successful
          console.log("Payment successful:", response);

          // Redirect to dashboard with success message
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
        setError(
          response.error.description ||
            "Payment failed. Please try again or contact support."
        );
        setLoading(false);
      });

      rzp.open();
    } catch (err) {
      console.error("Checkout error:", err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to start checkout. Please try again or contact support."
      );
      setLoading(false);
    }
  };

  return (
    <div className={styles.pricingPage}>
      <div className="container">
        <div className={styles.header}>
          <h1 className={styles.pageTitle}>Simple, Transparent Plans</h1>
          <p className={styles.pricingSubtitle}>
            Start Free. Upgrade When You&apos;re Ready.
            <br />
            Practice real Product Management interviews with AI — get instant
            feedback, learn from model answers, and track your progress.
          </p>
        </div>

        {error && (
          <div className={styles.errorBox}>
            {error}
            <button className={styles.closeError} onClick={() => setError("")}>
              ×
            </button>
          </div>
        )}

        <div className={styles.plansGrid}>
          <div className={styles.leftColumn}>
            <div className={styles.whyUpgradeCard}>
              <h2 className={styles.upgradeTitle}>Why Upgrade to Pro</h2>
              <ul className={styles.upgradeList}>
                <li>
                  Focus your prep on specific skills (Design, Metrics, RCAs,
                  Strategy)
                </li>
                <li>
                  Get detailed, hiring-manager-style feedback on every answer
                </li>
                <li>Learn from perfect &quot;10/10&quot; responses</li>
                <li>Track your progress and improve faster</li>
                <li>Practice unlimited interviews — anytime, anywhere</li>
              </ul>
            </div>

            {plans
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
                    disabled={loading}
                  >
                    {loading ? "Loading..." : plan.cta}
                  </button>

                  {plan.showNoSignup && (
                    <p className={styles.noSignupNote}>no signup needed</p>
                  )}
                </div>
              ))}
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
                    <span className={styles.freeTrialPrice}>
                      Free for 48 hrs
                    </span>
                    <span className={styles.thenPrice}>
                      then {plan.price}/{plan.interval}
                    </span>
                  </div>
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

                <ul className={styles.featureList}>
                  {plan.features.map((feature, index) => (
                    <li key={index} className={styles.feature}>
                      <span className={styles.checkmark}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className="btn btn-primary btn-lg"
                  style={{ width: "100%" }}
                  onClick={() => handleCheckout(plan)}
                  disabled={loading}
                >
                  {loading ? "Loading..." : plan.cta}
                </button>

                <p className={styles.trialDisclaimer}>
                  Signup and get full Pro access free for 48 hours. After trial,
                  automatically switch to Free plan (3 mocks/month) — no
                  charges.
                </p>
              </div>
            ))}
        </div>

        <div className={styles.trustBadges}>
          <div className={styles.trustBadge}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            Secure Payment via Razorpay
          </div>
          <div className={styles.trustBadge}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </svg>
            7-Day Money Back Guarantee
          </div>
          <div className={styles.trustBadge}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            Cancel Anytime
          </div>
        </div>

        <div className={styles.faq}>
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Can I cancel anytime?</h3>
              <p className={styles.faqAnswer}>
                Yes! You can cancel your subscription at any time. You&apos;ll
                continue to have access until the end of your billing period.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                What payment methods do you accept?
              </h3>
              <p className={styles.faqAnswer}>
                We accept all major credit cards, debit cards, UPI, net banking,
                and wallets through Razorpay, our secure payment processor.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Is there a free trial?</h3>
              <p className={styles.faqAnswer}>
                Yes! You get a 1-Day Free Pro Trial with full access to all Pro
                features. After 24 hours, you&apos;ll automatically continue on
                the Free Plan (3 mocks/month) — no credit card required.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>
                What&apos;s the refund policy?
              </h3>
              <p className={styles.faqAnswer}>
                We offer a 7-day money-back guarantee for first-time Pro
                subscribers. See our full <a href="/refund">refund policy</a>{" "}
                for details.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Why only INR pricing?</h3>
              <p className={styles.faqAnswer}>
                We're launching in India first! All payments are processed in
                INR through Razorpay. We'll add more currencies soon.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Is my payment secure?</h3>
              <p className={styles.faqAnswer}>
                Yes! All payments are processed securely through Razorpay with
                industry-standard encryption. We never store your card details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
