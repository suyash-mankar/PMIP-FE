import { Link } from "react-router-dom";
import styles from "./Terms.module.scss";

function Terms() {
  return (
    <div className={styles.policyPage}>
      <div className="container">
        <div className={styles.policyHeader}>
          <h1>Terms & Conditions</h1>
          <p className={styles.lastUpdated}>Last updated on Oct 18 2025</p>
        </div>

        <div className={styles.policyContent}>
          <section className={styles.section}>
            <h2>1. Agreement to Terms</h2>
            <p>
              For the purpose of these Terms and Conditions, the terms "we",
              "us", "our" used anywhere on this page shall mean PM Interview
              Pro, an AI-powered interview practice platform. The terms "you",
              "your", "user" shall mean any natural or legal person who is
              visiting our website and/or using our services.
            </p>
            <p>
              By accessing or using PM Interview Pro, you agree to be bound by
              these Terms and Conditions. If you disagree with any part of these
              terms, you may not access our service.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Service Description</h2>
            <p>
              PM Interview Pro provides an AI-powered platform for practicing
              Product Management interviews. Our service includes mock
              interviews, AI-generated feedback, model answers, progress
              tracking, and related features. We reserve the right to modify,
              suspend, or discontinue any part of our service at any time.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your
              account. You agree to notify us immediately of any unauthorized
              use of your account. We reserve the right to suspend or terminate
              accounts that violate these terms.
            </p>
          </section>

          <section className={styles.section}>
            <h2>4. Subscription and Payment</h2>
            <p>
              PM Interview Pro offers both free and paid subscription plans.
              Paid subscriptions are billed on a recurring basis. You may cancel
              your subscription at any time, but refunds are subject to our
              Refund Policy. We reserve the right to change our pricing with
              reasonable notice to existing subscribers.
            </p>
          </section>

          <section className={styles.section}>
            <h2>5. Free Trial</h2>
            <p>
              We offer a 48-hour free trial of our Pro plan. No credit card is
              required to start the trial. After the trial period ends, your
              account will automatically revert to the Free plan unless you
              choose to subscribe to the Pro plan.
            </p>
          </section>

          <section className={styles.section}>
            <h2>6. Intellectual Property</h2>
            <p>
              All content, features, and functionality of PM Interview Pro,
              including but not limited to text, graphics, logos, interview
              questions, model answers, AI-generated feedback, and software, are
              owned by PM Interview Pro and are protected by copyright,
              trademark, and other intellectual property laws. You may not
              reproduce, distribute, or create derivative works without our
              express written permission.
            </p>
          </section>

          <section className={styles.section}>
            <h2>7. User Content and Conduct</h2>
            <p>
              You retain ownership of any content you submit through our
              platform, including your interview responses. By using our
              service, you grant us a license to process and analyze your
              content to provide our services. You agree not to use our service
              for any unlawful purpose or in any way that could damage, disable,
              or impair our service.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. AI-Generated Content</h2>
            <p>
              Our service uses artificial intelligence to generate feedback and
              model answers. While we strive for accuracy, AI-generated content
              may contain errors or inaccuracies. The feedback and suggestions
              provided are for educational purposes only and should not be
              considered professional career advice.
            </p>
          </section>

          <section className={styles.section}>
            <h2>9. Limitation of Liability</h2>
            <p>
              PM Interview Pro is provided on an "as is" and "as available"
              basis. We make no warranties, express or implied, regarding the
              accuracy, reliability, or availability of our service. To the
              fullest extent permitted by law, PM Interview Pro shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages resulting from your use of our service.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Third-Party Links</h2>
            <p>
              Our service may contain links to third-party websites or services
              that are not owned or controlled by PM Interview Pro. We have no
              control over and assume no responsibility for the content, privacy
              policies, or practices of any third-party websites or services.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms and Conditions at any
              time. We will notify users of any material changes by updating the
              "Last updated" date. Your continued use of PM Interview Pro after
              any changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className={styles.section}>
            <h2>12. Governing Law</h2>
            <p>
              These Terms and Conditions shall be governed by and construed in
              accordance with the laws of India. Any disputes arising from these
              terms or your use of our service shall be subject to the exclusive
              jurisdiction of the courts of India.
            </p>
          </section>

          <section className={styles.section}>
            <h2>13. Contact Information</h2>
            <p>
              If you have any questions about these Terms and Conditions, please
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

export default Terms;
