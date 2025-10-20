import { Link } from "react-router-dom";
import styles from "./Shipping.module.scss";

function Shipping() {
  return (
    <div className={styles.policyPage}>
      <div className="container">
        <div className={styles.policyHeader}>
          <h1>Service Delivery Policy</h1>
          <p className={styles.lastUpdated}>Last updated on Oct 18 2025</p>
        </div>

        <div className={styles.policyContent}>
          <section className={styles.section}>
            <h2>1. Digital Service Delivery</h2>
            <p>
              PM Interview Pro is a digital Software-as-a-Service (SaaS)
              platform. Unlike physical products, our service is delivered
              entirely online and does not require shipping or physical
              delivery.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Instant Access</h2>
            <p>
              Upon successful registration or subscription, you will receive
              immediate access to PM Interview Pro:
            </p>
            <ul>
              <li>
                <strong>Free Plan:</strong> Instant access upon account creation
                - no credit card required
              </li>
              <li>
                <strong>48-Hour Free Trial:</strong> Immediate Pro access upon
                signup - no credit card required
              </li>
              <li>
                <strong>Pro Subscription:</strong> Instant access after
                successful payment processing
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. Account Activation</h2>
            <p>Your account is activated as follows:</p>
            <ul>
              <li>Create your account with a valid email address</li>
              <li>Verify your email (if email verification is enabled)</li>
              <li>Log in and start using PM Interview Pro immediately</li>
              <li>
                All features according to your plan are instantly available
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Service Availability</h2>
            <p>
              PM Interview Pro is a cloud-based service accessible 24/7 from
              anywhere with an internet connection. Our service is available:
            </p>
            <ul>
              <li>Globally - accessible from any country</li>
              <li>On any device - desktop, laptop, tablet, or mobile</li>
              <li>
                Through modern web browsers (Chrome, Firefox, Safari, Edge)
              </li>
              <li>No downloads or installations required</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Subscription Confirmation</h2>
            <p>After subscribing to a paid plan, you will receive:</p>
            <ul>
              <li>An email confirmation of your subscription</li>
              <li>Payment receipt from our payment processor (Razorpay)</li>
              <li>Immediate access to all Pro features</li>
              <li>Confirmation of billing cycle and next payment date</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>6. Service Interruptions</h2>
            <p>
              While we strive to maintain 99.9% uptime, occasional service
              interruptions may occur due to:
            </p>
            <ul>
              <li>Scheduled maintenance (announced in advance)</li>
              <li>Emergency maintenance or security updates</li>
              <li>
                Third-party service provider issues (hosting, AI services)
              </li>
              <li>Unforeseen technical difficulties</li>
            </ul>
            <p>
              We will notify users of planned maintenance via email. In case of
              extended unplanned outages, we may offer subscription extensions
              or credits.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Technical Requirements</h2>
            <p>To access PM Interview Pro, you need:</p>
            <ul>
              <li>A stable internet connection</li>
              <li>A modern web browser (latest versions recommended)</li>
              <li>JavaScript enabled</li>
              <li>Cookies enabled</li>
              <li>
                For voice features: microphone access and modern browser with
                Web Speech API support
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>8. Access Issues</h2>
            <p>
              If you experience any issues accessing PM Interview Pro after
              registration or payment:
            </p>
            <ul>
              <li>Check your internet connection</li>
              <li>Clear your browser cache and cookies</li>
              <li>Try a different browser or device</li>
              <li>Verify your account is active and subscription is current</li>
              <li>Contact our support team immediately for assistance</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>9. Data and Progress Backup</h2>
            <p>Your interview data, progress, and analytics are:</p>
            <ul>
              <li>Automatically saved to our secure cloud servers</li>
              <li>Accessible from any device when you log in</li>
              <li>Regularly backed up to prevent data loss</li>
              <li>
                Retained according to our Privacy Policy and data retention
                guidelines
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>10. Multi-Device Access</h2>
            <p>Your PM Interview Pro subscription allows you to:</p>
            <ul>
              <li>Access your account from multiple devices</li>
              <li>Switch between devices seamlessly</li>
              <li>Maintain synchronized progress across all devices</li>
              <li>Log out from one device and continue on another</li>
            </ul>
            <p>
              Note: For security reasons, we may limit the number of
              simultaneous active sessions.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Customer Support</h2>
            <p>
              For any issues related to service access or delivery, our support
              team is available to help:
            </p>
            <ul>
              <li>
                Email:{" "}
                <a href="mailto:pminterviewpracticemain@gmail.com">
                  pminterviewpracticemain@gmail.com
                </a>
              </li>
              <li>We typically respond within 24-48 hours</li>
              <li>Pro subscribers receive priority support</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>12. Updates and New Features</h2>
            <p>
              As a cloud-based service, PM Interview Pro is continuously
              updated:
            </p>
            <ul>
              <li>
                New features and improvements are rolled out automatically
              </li>
              <li>No manual updates or downloads required</li>
              <li>All users receive the latest version instantly</li>
              <li>Major updates will be announced via email</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>13. Contact Us</h2>
            <p>
              If you have any questions about service delivery or access, please
              contact us at{" "}
              <a href="mailto:pminterviewpracticemain@gmail.com">
                pminterviewpracticemain@gmail.com
              </a>
            </p>
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
