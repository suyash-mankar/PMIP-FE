import { useState } from "react";
import { createCheckoutSession } from "../../api/client";
import styles from "./Pricing.module.scss";

function Pricing() {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");

  const plans = [
    {
      id: "free",
      name: "Free",
      price: "$0",
      interval: "forever",
      features: [
        "3 practice interviews per month",
        "Basic feedback and scoring",
        "Entry level questions only",
        "Community support",
      ],
      cta: "Current Plan",
      priceId: null,
      highlighted: false,
    },
    {
      id: "pro",
      name: "Pro",
      price: "$9",
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
      priceId: "price_pro_monthly",
      highlighted: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "$99",
      interval: "month",
      features: [
        "Everything in Pro",
        "Custom question sets",
        "Team analytics",
        "Dedicated support",
        "API access",
        "Custom integrations",
      ],
      cta: "Contact Sales",
      priceId: "price_enterprise_monthly",
      highlighted: false,
    },
  ];

  const handleCheckout = async (priceId, planName) => {
    if (!priceId) {
      alert("This is your current plan!");
      return;
    }

    if (planName === "Enterprise") {
      alert(
        "Please contact sales@pminterviewpractice.com for enterprise plans."
      );
      return;
    }

    setLoading(priceId);
    setError("");

    try {
      const response = await createCheckoutSession(priceId);
      const { checkout_url } = response.data;

      if (checkout_url) {
        window.location.href = checkout_url;
      } else {
        setError("Failed to create checkout session. Please try again.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to start checkout. Please try again or contact support."
      );
    } finally {
      setLoading(null);
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
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}

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
                  <span className={styles.priceInterval}>/{plan.interval}</span>
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
                onClick={() => handleCheckout(plan.priceId, plan.name)}
                disabled={loading === plan.priceId}
              >
                {loading === plan.priceId ? "Loading..." : plan.cta}
              </button>
            </div>
          ))}
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
                We accept all major credit cards through Stripe, our secure
                payment processor.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>Is there a free trial?</h3>
              <p className={styles.faqAnswer}>
                The free plan gives you a taste of our platform. Upgrade anytime
                to unlock unlimited interviews.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
