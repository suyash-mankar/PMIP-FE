import { Link } from "react-router-dom";
import styles from "./Shipping.module.scss";

function Shipping() {
  return (
    <div className={styles.policyPage}>
      <div className="container">
        <div className={styles.policyHeader}>
          <h1>Shipping & Delivery Policy</h1>
          <p className={styles.lastUpdated}>Last Updated: October 18, 2025</p>
        </div>

        <div className={styles.policyContent}>
          <section className={styles.section}>
            <h2>1. Digital Service - No Physical Shipping</h2>
            <p>
              PM Interview Practice is a <strong>100% digital service</strong>.
              We do not sell, ship, or deliver any physical products. All our
              services are provided online through our web platform at
              pminterviewpractice.com.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Instant Access Upon Payment</h2>
            <p>
              When you subscribe to our Pro plan, you receive immediate access
              to all features:
            </p>
            <ul>
              <li>
                <strong>Instant Activation:</strong> Your Pro subscription is
                activated immediately after successful payment
              </li>
              <li>
                <strong>No Waiting Period:</strong> Start using unlimited
                interviews within seconds
              </li>
              <li>
                <strong>No Delivery Required:</strong> Simply log in to your
                account to access Pro features
              </li>
              <li>
                <strong>Available Worldwide:</strong> Access from any country
                with internet connection
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. How to Access Your Subscription</h2>
            <h3>After Purchase:</h3>
            <ol>
              <li>Complete payment through Razorpay secure checkout</li>
              <li>You will be automatically redirected to your dashboard</li>
              <li>Your account will show "Pro" status immediately</li>
              <li>Start practicing with unlimited interviews right away</li>
            </ol>

            <h3>Accessing from Different Devices:</h3>
            <ul>
              <li>Log in from any device (computer, tablet, mobile)</li>
              <li>Your subscription is tied to your account, not a device</li>
              <li>Use the same login credentials on all devices</li>
              <li>All your interview history syncs automatically</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. No Physical Address Required</h2>
            <p>
              Since we provide a digital service, we do not require a physical
              shipping address during checkout. We only collect:
            </p>
            <ul>
              <li>Email address (for account access and receipts)</li>
              <li>Payment information (processed securely by Razorpay)</li>
              <li>Optional: Country (for tax and currency purposes)</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Global Availability</h2>
            <p>Our service is available in most countries worldwide:</p>
            <ul>
              <li>
                <strong>No geographic restrictions:</strong> Access from
                anywhere with internet
              </li>
              <li>
                <strong>Multiple currencies:</strong> Pay in USD or INR
              </li>
              <li>
                <strong>24/7 availability:</strong> Practice anytime, any day
              </li>
              <li>
                <strong>No import fees:</strong> No customs or international
                shipping charges
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>6. Account Delivery Confirmation</h2>
            <p>
              You will receive email confirmation when your subscription is
              activated:
            </p>
            <ul>
              <li>
                <strong>Payment receipt:</strong> Sent immediately after
                purchase
              </li>
              <li>
                <strong>Subscription confirmation:</strong> Details of your Pro
                plan
              </li>
              <li>
                <strong>Getting started guide:</strong> Tips to maximize your
                practice
              </li>
              <li>
                <strong>Login link:</strong> Direct access to your account
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>7. Technical Requirements</h2>
            <p>To access our service, you need:</p>
            <ul>
              <li>
                <strong>Internet connection:</strong> Broadband or mobile data
              </li>
              <li>
                <strong>Modern web browser:</strong> Chrome, Firefox, Safari, or
                Edge (latest versions)
              </li>
              <li>
                <strong>Enabled JavaScript and cookies:</strong> Required for
                platform functionality
              </li>
              <li>
                <strong>Email access:</strong> To receive notifications and
                updates
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>8. No Downloadable Software</h2>
            <p>PM Interview Practice is a web-based platform:</p>
            <ul>
              <li>No software installation required</li>
              <li>No app downloads needed</li>
              <li>Access directly through your web browser</li>
              <li>Automatic updates - always using the latest version</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>9. Access Issues or Delays</h2>
            <p>
              If you experience any issues accessing your subscription after
              payment:
            </p>
            <ul>
              <li>
                <strong>Check spam folder:</strong> Confirmation email may be
                filtered
              </li>
              <li>
                <strong>Try logging out and back in:</strong> Refresh your
                session
              </li>
              <li>
                <strong>Clear browser cache:</strong> May resolve display issues
              </li>
              <li>
                <strong>Contact support:</strong> Email
                support@pminterviewpractice.com immediately
              </li>
            </ul>
            <p>
              We will resolve any access issues within 24 hours, typically much
              faster.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Data Portability</h2>
            <p>
              While we don't ship physical products, you can export your data:
            </p>
            <ul>
              <li>
                <strong>Interview history:</strong> Download your past responses
              </li>
              <li>
                <strong>Score reports:</strong> Export feedback and scores
              </li>
              <li>
                <strong>Progress data:</strong> Track your improvement over time
              </li>
            </ul>
            <p>
              Contact support@pminterviewpractice.com to request your data
              export.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Service Interruptions</h2>
            <p>
              In rare cases of scheduled maintenance or unexpected downtime:
            </p>
            <ul>
              <li>We notify users in advance for planned maintenance</li>
              <li>Service typically restored within hours, not days</li>
              <li>
                No "delivery delays" - access resumes immediately when service
                is restored
              </li>
              <li>Check our status page or email for updates</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>12. Promotional Materials</h2>
            <p>We do not send physical promotional materials:</p>
            <ul>
              <li>No mailers or catalogs</li>
              <li>All marketing via email (opt-out anytime)</li>
              <li>No unsolicited mail to your address</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>13. Gift Subscriptions</h2>
            <p>If we offer gift subscriptions in the future:</p>
            <ul>
              <li>Recipient receives email with access instructions</li>
              <li>No physical gift cards or certificates mailed</li>
              <li>Instant delivery to recipient's email</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>14. Frequently Asked Questions</h2>

            <h3>Q: When will I receive access after payment?</h3>
            <p>
              <strong>A:</strong> Immediately. Your account is upgraded to Pro
              within seconds of successful payment.
            </p>

            <h3>Q: Do I need to download anything?</h3>
            <p>
              <strong>A:</strong> No. Everything works in your web browser. No
              downloads required.
            </p>

            <h3>Q: Can I access from multiple devices?</h3>
            <p>
              <strong>A:</strong> Yes. Use the same login on any device with
              internet access.
            </p>

            <h3>Q: What if I don't receive my confirmation email?</h3>
            <p>
              <strong>A:</strong> Check spam folder. If still not found, contact
              support@pminterviewpractice.com with your payment details.
            </p>

            <h3>Q: Are there any shipping fees?</h3>
            <p>
              <strong>A:</strong> No. There are no shipping fees because we
              provide a digital service. The price you see is the price you pay.
            </p>
          </section>

          <section className={styles.section}>
            <h2>15. Contact Us</h2>
            <p>
              If you have questions about accessing our service, please contact
              us:
            </p>
            <ul>
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:support@pminterviewpractice.com">
                  support@pminterviewpractice.com
                </a>
              </li>
              <li>
                <strong>Response time:</strong> Within 24 hours on business days
              </li>
            </ul>
          </section>
        </div>

        <div className={styles.policyFooter}>
          <Link to="/" className="btn btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Shipping;
