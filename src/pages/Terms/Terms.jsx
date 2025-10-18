import { Link } from "react-router-dom";
import styles from "./Terms.module.scss";

function Terms() {
  return (
    <div className={styles.policyPage}>
      <div className="container">
        <div className={styles.policyHeader}>
          <h1>Terms and Conditions</h1>
          <p className={styles.lastUpdated}>Last Updated: October 18, 2025</p>
        </div>

        <div className={styles.policyContent}>
          <section className={styles.section}>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using PM Interview Practice ("Service"), you agree
              to be bound by these Terms and Conditions ("Terms"). If you do not
              agree to these Terms, please do not use our Service.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Description of Service</h2>
            <p>
              PM Interview Practice is an AI-powered platform that provides:
            </p>
            <ul>
              <li>Practice interview questions for Product Management roles</li>
              <li>AI-generated feedback and scoring on user responses</li>
              <li>Model answers and improvement suggestions</li>
              <li>Progress tracking and interview history</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. User Accounts</h2>

            <h3>3.1 Account Creation</h3>
            <ul>
              <li>You must be at least 18 years old to create an account</li>
              <li>You must provide accurate and complete information</li>
              <li>
                You are responsible for maintaining the confidentiality of your
                account credentials
              </li>
              <li>
                You are responsible for all activities that occur under your
                account
              </li>
            </ul>

            <h3>3.2 Account Security</h3>
            <ul>
              <li>
                Notify us immediately of any unauthorized use of your account
              </li>
              <li>Do not share your account with others</li>
              <li>
                We are not liable for losses caused by unauthorized use of your
                account
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Subscription Plans and Payments</h2>

            <h3>4.1 Free Plan</h3>
            <ul>
              <li>Limited to 3 practice interviews per month</li>
              <li>Basic feedback and scoring</li>
              <li>No credit card required</li>
            </ul>

            <h3>4.2 Pro Plan</h3>
            <ul>
              <li>Billed monthly at $9/month (USD) or ₹749/month (INR)</li>
              <li>Unlimited practice interviews</li>
              <li>Full feedback and model answers</li>
              <li>Progress tracking and history</li>
            </ul>

            <h3>4.3 Payment Terms</h3>
            <ul>
              <li>Payments are processed securely through Razorpay</li>
              <li>Subscriptions automatically renew unless cancelled</li>
              <li>
                You authorize us to charge your payment method on each billing
                cycle
              </li>
              <li>Prices are subject to change with 30 days notice</li>
            </ul>

            <h3>4.4 Cancellation</h3>
            <ul>
              <li>You may cancel your subscription at any time</li>
              <li>
                Cancellations take effect at the end of the current billing
                period
              </li>
              <li>
                No partial refunds for unused time within a billing period
              </li>
              <li>
                See our <Link to="/refund">Refund Policy</Link> for refund
                eligibility
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. User Conduct and Prohibited Activities</h2>
            <p>You agree NOT to:</p>
            <ul>
              <li>Use the Service for any illegal purpose</li>
              <li>Share or resell access to your account</li>
              <li>Scrape, copy, or redistribute our content or questions</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Use automated bots or scripts to access the Service</li>
              <li>
                Upload malicious code or attempt to compromise our systems
              </li>
              <li>Impersonate others or provide false information</li>
              <li>Use the Service to harass, abuse, or harm others</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>6. Intellectual Property Rights</h2>

            <h3>6.1 Our Content</h3>
            <p>
              All content on PM Interview Practice, including but not limited to
              interview questions, model answers, feedback algorithms, text,
              graphics, logos, and software, is owned by or licensed to us and
              protected by copyright, trademark, and other intellectual property
              laws.
            </p>

            <h3>6.2 Your Content</h3>
            <p>
              You retain ownership of your interview responses. By using our
              Service, you grant us a limited license to:
            </p>
            <ul>
              <li>Process your responses through our AI systems</li>
              <li>Store your responses for providing the Service</li>
              <li>Use anonymized data to improve our AI models</li>
            </ul>

            <h3>6.3 Restrictions</h3>
            <ul>
              <li>
                You may not copy, modify, or distribute our questions or content
              </li>
              <li>You may not create derivative works based on our Service</li>
              <li>
                Commercial use of our content is strictly prohibited without
                written permission
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>7. AI-Generated Feedback Disclaimer</h2>
            <p>
              Important: Our AI feedback is provided for educational purposes
              only. While we strive for accuracy:
            </p>
            <ul>
              <li>
                AI feedback may not be 100% accurate or applicable to all
                interview situations
              </li>
              <li>We do not guarantee interview success or job offers</li>
              <li>Use our feedback as a learning tool, not absolute truth</li>
              <li>
                Human judgment and context are important in real interviews
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>8. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law:</p>
            <ul>
              <li>
                The Service is provided "as is" without warranties of any kind
              </li>
              <li>
                We are not liable for any indirect, incidental, or consequential
                damages
              </li>
              <li>
                Our total liability shall not exceed the amount you paid in the
                last 12 months
              </li>
              <li>
                We are not responsible for third-party services (OpenAI,
                Razorpay, etc.)
              </li>
              <li>We do not guarantee uninterrupted or error-free service</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless PM Interview Practice,
              its officers, directors, employees, and agents from any claims,
              damages, losses, liabilities, and expenses arising from:
            </p>
            <ul>
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Your content or conduct on the platform</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>10. Termination</h2>
            <p>We reserve the right to suspend or terminate your account:</p>
            <ul>
              <li>If you violate these Terms</li>
              <li>If you engage in fraudulent activity</li>
              <li>If we discontinue the Service</li>
              <li>For any reason with 30 days notice</li>
            </ul>
            <p>
              Upon termination, your right to use the Service ceases
              immediately. We may delete your data in accordance with our{" "}
              <Link to="/privacy">Privacy Policy</Link>.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Modifications to Service and Terms</h2>
            <p>We reserve the right to:</p>
            <ul>
              <li>Modify or discontinue the Service at any time</li>
              <li>Update these Terms with notice to users</li>
              <li>Change pricing with 30 days notice</li>
              <li>Add or remove features from the Service</li>
            </ul>
            <p>
              Continued use after changes constitutes acceptance of modified
              Terms.
            </p>
          </section>

          <section className={styles.section}>
            <h2>12. Third-Party Links and Services</h2>
            <p>
              Our Service may contain links to third-party websites or services.
              We are not responsible for:
            </p>
            <ul>
              <li>Content or practices of third-party websites</li>
              <li>Privacy policies of external services</li>
              <li>Availability or accuracy of third-party content</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>13. Governing Law and Dispute Resolution</h2>
            <ul>
              <li>These Terms are governed by the laws of the United States</li>
              <li>
                Any disputes shall be resolved through binding arbitration
              </li>
              <li>
                You waive the right to participate in class action lawsuits
              </li>
              <li>Arbitration shall be conducted in English</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>14. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable, the
              remaining provisions will remain in full effect.
            </p>
          </section>

          <section className={styles.section}>
            <h2>15. Contact Information</h2>
            <p>For questions about these Terms, please contact us:</p>
            <ul>
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:legal@pminterviewpractice.com">
                  legal@pminterviewpractice.com
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
            <h2>16. Entire Agreement</h2>
            <p>
              These Terms, along with our Privacy Policy and Refund Policy,
              constitute the entire agreement between you and PM Interview
              Practice regarding the use of our Service.
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
