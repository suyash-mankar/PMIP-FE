import { useState } from "react";
import { createCheckoutSession } from "../../api/client";
import { useNavigate } from "react-router-dom";
import styles from "./Pricing.module.scss";

function Pricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currency, setCurrency] = useState("usd"); // 'usd' or 'inr'
  const navigate = useNavigate();

  const pricing = {
    usd: {
      symbol: "$",
      amount: "9",
      fullAmount: "9.00",
    },
    inr: {
      symbol: "₹",
      amount: "749",
      fullAmount: "749",
    },
  };

  const plans = [
    {
      id: "free",
      name: "Free",
      price: pricing[currency].symbol + "0",
      interval: "forever",
      features: [
        "3 practice interviews per month",
        "Basic feedback and scoring",
        "Entry level questions only",
        "Community support",
      ],
      cta: "Current Plan",
      isFree: true,
      highlighted: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: pricing[currency].symbol + pricing[currency].amount,
      interval: "month",
      features: [
        "Unlimited practice interviews",
        "Detailed rubric-based feedback",
        "All difficulty levels (Entry, Mid, Senior)",
        "Interview history tracking",
        "Sample answers for every question",
        "Priority email support",
      ],
      cta: "Upgrade to Pro",
      isFree: false,
      highlighted: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "Custom",
      interval: "",
      features: [
        "Everything in Pro",
        "Custom question sets",
        "Team analytics",
        "Dedicated support",
        "API access",
        "Custom integrations",
      ],
      cta: "Contact Sales",
      isEnterprise: true,
      highlighted: false,
    },
  ];

  const handleCheckout = async (plan) => {
    if (plan.isFree) {
      alert("This is the free plan - just sign up to get started!");
      return;
    }

    if (plan.isEnterprise) {
      window.location.href =
        "mailto:enterprise@pminterviewpractice.com?subject=Enterprise Plan Inquiry";
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create checkout session on backend
      const response = await createCheckoutSession(currency);
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
          <h1 className={styles.pageTitle}>Simple, Transparent Pricing</h1>
          <p className={styles.subtitle}>
            Choose the plan that&apos;s right for you. Upgrade or downgrade
            anytime.
          </p>

          {/* Currency Selector */}
          <div className={styles.currencySelector}>
            <button
              className={`${styles.currencyBtn} ${
                currency === "usd" ? styles.active : ""
              }`}
              onClick={() => setCurrency("usd")}
            >
              🇺🇸 USD ($)
            </button>
            <button
              className={`${styles.currencyBtn} ${
                currency === "inr" ? styles.active : ""
              }`}
              onClick={() => setCurrency("inr")}
            >
              🇮🇳 INR (₹)
            </button>
          </div>
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
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`${styles.planCard} ${
                plan.highlighted ? styles.planHighlighted : ""
              }`}
            >
              {plan.highlighted && (
                <div className={styles.badge}>Most Popular</div>
              )}

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
                className={`btn ${
                  plan.highlighted ? "btn-primary" : "btn-outline"
                } btn-lg`}
                style={{ width: "100%" }}
                onClick={() => handleCheckout(plan)}
                disabled={loading}
              >
                {loading ? "Loading..." : plan.cta}
              </button>
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
                The free plan gives you a taste of our platform with 3
                interviews per month. Upgrade anytime to unlock unlimited
                interviews.
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
              <h3 className={styles.faqQuestion}>
                Can I switch currencies later?
              </h3>
              <p className={styles.faqAnswer}>
                Your subscription will be in the currency you choose at
                checkout. If you need to change currencies, please contact
                support.
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
