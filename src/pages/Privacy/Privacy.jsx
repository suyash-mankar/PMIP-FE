import { Link } from "react-router-dom";
import styles from "./Privacy.module.scss";

function Privacy() {
  return (
    <div className={styles.policyPage}>
      <div className="container">
        <div className={styles.policyHeader}>
          <h1>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last Updated: October 18, 2025</p>
        </div>

        <div className={styles.policyContent}>
          <section className={styles.section}>
            <h2>1. Introduction</h2>
            <p>
              Welcome to PM Interview Practice ("we," "our," or "us"). We are
              committed to protecting your privacy and handling your data in an
              open and transparent manner. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              use our website and services at pminterviewpractice.com.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Information We Collect</h2>

            <h3>2.1 Personal Information</h3>
            <p>We collect information that you provide directly to us:</p>
            <ul>
              <li>
                <strong>Account Information:</strong> Email address, password
                (encrypted), and name
              </li>
              <li>
                <strong>Practice Responses:</strong> Your answers to interview
                questions
              </li>
              <li>
                <strong>Payment Information:</strong> Billing details processed
                securely through Razorpay (we do not store credit card numbers)
              </li>
              <li>
                <strong>Communication Data:</strong> Messages you send to our
                support team
              </li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <ul>
              <li>
                <strong>Usage Data:</strong> Pages visited, features used, time
                spent on platform
              </li>
              <li>
                <strong>Device Information:</strong> Browser type, operating
                system, IP address
              </li>
              <li>
                <strong>Cookies:</strong> Session identifiers and preference
                cookies
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. How We Use Your Information</h2>
            <p>We use the collected information for:</p>
            <ul>
              <li>
                Providing and maintaining our AI-powered interview practice
                service
              </li>
              <li>Processing payments and managing subscriptions</li>
              <li>
                Generating personalized feedback on your interview responses
              </li>
              <li>Improving our AI models and service quality</li>
              <li>
                Sending service updates, security alerts, and support messages
              </li>
              <li>Analyzing usage patterns to enhance user experience</li>
              <li>Preventing fraud and ensuring platform security</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Third-Party Services</h2>
            <p>
              We use the following third-party services that may process your
              data:
            </p>
            <ul>
              <li>
                <strong>OpenAI:</strong> Powers our AI feedback system. Your
                responses are processed to generate feedback.
              </li>
              <li>
                <strong>Razorpay:</strong> Processes payments securely. Subject
                to Razorpay's privacy policy.
              </li>
              <li>
                <strong>Google OAuth:</strong> Optional login method. Subject to
                Google's privacy policy.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Data Storage and Security</h2>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal data:
            </p>
            <ul>
              <li>
                Passwords are encrypted using industry-standard hashing (bcrypt)
              </li>
              <li>Data is stored on secure servers with encryption at rest</li>
              <li>HTTPS/TLS encryption for data transmission</li>
              <li>Regular security audits and updates</li>
              <li>Access controls limiting employee access to personal data</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>6. Your Rights and Choices</h2>
            <p>You have the following rights regarding your personal data:</p>
            <ul>
              <li>
                <strong>Access:</strong> Request a copy of your personal data
              </li>
              <li>
                <strong>Correction:</strong> Update or correct inaccurate
                information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your account and
                data
              </li>
              <li>
                <strong>Portability:</strong> Export your interview history and
                responses
              </li>
              <li>
                <strong>Opt-out:</strong> Unsubscribe from marketing emails
                (service emails may still be sent)
              </li>
            </ul>
            <p>
              To exercise these rights, contact us at{" "}
              <a href="mailto:privacy@pminterviewpractice.com">
                privacy@pminterviewpractice.com
              </a>
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Data Retention</h2>
            <p>We retain your personal data only as long as necessary:</p>
            <ul>
              <li>
                <strong>Active Accounts:</strong> Data retained while account is
                active
              </li>
              <li>
                <strong>Deleted Accounts:</strong> Most data deleted within 30
                days; some records retained for legal/financial compliance
              </li>
              <li>
                <strong>Payment Records:</strong> Retained for 7 years for tax
                and accounting purposes
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>8. Cookies</h2>
            <p>We use cookies and similar technologies to:</p>
            <ul>
              <li>Keep you logged in (authentication cookies)</li>
              <li>Remember your preferences</li>
              <li>Analyze usage patterns</li>
            </ul>
            <p>
              You can control cookies through your browser settings, but
              disabling them may affect functionality.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Children's Privacy</h2>
            <p>
              Our service is not intended for users under 18 years of age. We do
              not knowingly collect personal information from children under 18.
              If you are a parent or guardian and believe your child has
              provided us with personal information, please contact us.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries
              other than your country of residence. We ensure appropriate
              safeguards are in place to protect your data in accordance with
              this Privacy Policy.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of material changes by posting the new policy on this
              page and updating the "Last Updated" date. Continued use of our
              services after changes constitutes acceptance of the updated
              policy.
            </p>
          </section>

          <section className={styles.section}>
            <h2>12. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our data
              practices, please contact us:
            </p>
            <ul>
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:privacy@pminterviewpractice.com">
                  privacy@pminterviewpractice.com
                </a>
              </li>
              <li>
                <strong>Support:</strong>{" "}
                <a href="mailto:support@pminterviewpractice.com">
                  support@pminterviewpractice.com
                </a>
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>13. GDPR Compliance (EU Users)</h2>
            <p>
              If you are located in the European Economic Area (EEA), you have
              additional rights under GDPR:
            </p>
            <ul>
              <li>Right to object to processing</li>
              <li>Right to restrict processing</li>
              <li>Right to lodge a complaint with a supervisory authority</li>
            </ul>
            <p>
              Our lawful basis for processing your data is primarily based on
              consent and contract performance (providing our service to you).
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

export default Privacy;
