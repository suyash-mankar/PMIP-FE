import { Link } from "react-router-dom";
import styles from "./Privacy.module.scss";

function Privacy() {
  return (
    <div className={styles.policyPage}>
      <div className="container">
        <div className={styles.policyHeader}>
          <h1>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last updated on Oct 18 2025</p>
        </div>

        <div className={styles.policyContent}>
          <section className={styles.section}>
            <h2>1. Introduction</h2>
            <p>
              PM Interview Pro ("we", "us", or "our") is committed to protecting
              your privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you use our
              AI-powered interview practice platform.
            </p>
            <p>
              By using PM Interview Pro, you agree to the collection and use of
              information in accordance with this policy. If you do not agree
              with our policies and practices, please do not use our service.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>When you register for an account, we may collect:</p>
            <ul>
              <li>Name and email address</li>
              <li>Authentication information (password or OAuth tokens)</li>
              <li>
                Payment information (processed securely through our payment
                provider)
              </li>
              <li>Profile information you choose to provide</li>
            </ul>

            <h3>Usage Information</h3>
            <p>When you use our service, we automatically collect:</p>
            <ul>
              <li>Interview responses and answers you provide</li>
              <li>Practice session data and progress metrics</li>
              <li>Device information, browser type, and IP address</li>
              <li>Usage patterns and interaction with our platform</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>
                Provide, maintain, and improve our AI-powered interview practice
                service
              </li>
              <li>Generate personalized feedback and model answers</li>
              <li>Track your progress and display analytics</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send you service-related notifications and updates</li>
              <li>Respond to your support requests and inquiries</li>
              <li>Improve our AI models and platform features</li>
              <li>
                Detect, prevent, and address technical issues or fraudulent
                activity
              </li>
              <li>
                Send promotional emails about new features or offers (with your
                consent)
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. How We Share Your Information</h2>
            <p>
              We do not sell your personal information. We may share your
              information in the following circumstances:
            </p>
            <ul>
              <li>
                <strong>Service Providers:</strong> We work with third-party
                service providers (OpenAI for AI processing, payment processors,
                hosting providers) who help us operate our platform. These
                providers have access to your information only to perform
                specific tasks on our behalf.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your
                information if required by law, court order, or governmental
                regulation.
              </li>
              <li>
                <strong>Business Transfers:</strong> In the event of a merger,
                acquisition, or sale of assets, your information may be
                transferred to the new entity.
              </li>
              <li>
                <strong>With Your Consent:</strong> We may share your
                information for any other purpose with your explicit consent.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. AI Processing and OpenAI</h2>
            <p>
              PM Interview Pro uses OpenAI's API to generate feedback, model
              answers, and conduct AI-powered interviews. Your interview
              responses are sent to OpenAI for processing. OpenAI's use of data
              is governed by their data usage policies. We recommend reviewing
              OpenAI's privacy policy for more information.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational security
              measures to protect your personal information from unauthorized
              access, disclosure, alteration, or destruction. However, no method
              of transmission over the internet or electronic storage is 100%
              secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity
              on our service and store certain information. Cookies help us:
            </p>
            <ul>
              <li>Remember your login status and preferences</li>
              <li>Analyze user behavior to improve our service</li>
              <li>Provide personalized content and features</li>
            </ul>
            <p>
              You can instruct your browser to refuse all cookies or indicate
              when a cookie is being sent. However, if you do not accept
              cookies, you may not be able to use some features of our service.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to
              provide our services and fulfill the purposes outlined in this
              Privacy Policy. When you delete your account, we will delete or
              anonymize your personal information, except where we are required
              to retain it for legal or legitimate business purposes.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Your Rights and Choices</h2>
            <p>You have the right to:</p>
            <ul>
              <li>
                <strong>Access:</strong> Request access to the personal
                information we hold about you
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate or
                incomplete information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal
                information
              </li>
              <li>
                <strong>Opt-out:</strong> Unsubscribe from promotional emails at
                any time
              </li>
              <li>
                <strong>Data Portability:</strong> Request a copy of your data
                in a portable format
              </li>
            </ul>
            <p>
              To exercise any of these rights, please contact us at{" "}
              <a href="mailto:pminterviewpracticemain@gmail.com">
                pminterviewpracticemain@gmail.com
              </a>
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Children's Privacy</h2>
            <p>
              PM Interview Pro is not intended for users under the age of 18. We
              do not knowingly collect personal information from children. If
              you believe we have collected information from a child, please
              contact us immediately.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries
              other than your country of residence. These countries may have
              different data protection laws. By using our service, you consent
              to the transfer of your information to these countries.
            </p>
          </section>

          <section className={styles.section}>
            <h2>12. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by updating the "Last updated" date at the top
              of this policy. We encourage you to review this Privacy Policy
              periodically for any changes.
            </p>
          </section>

          <section className={styles.section}>
            <h2>13. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data
              practices, please contact us at{" "}
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

export default Privacy;
