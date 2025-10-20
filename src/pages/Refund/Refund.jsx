import { Link } from "react-router-dom";
import styles from "./Refund.module.scss";

function Refund() {
  return (
    <div className={styles.policyPage}>
      <div className="container">
        <div className={styles.policyHeader}>
          <h1>Cancellation & Refund Policy</h1>
          <p className={styles.lastUpdated}>Last updated on Oct 18 2025</p>
        </div>

        <div className={styles.policyContent}>
          <section className={styles.section}>
            <h2>1. Overview</h2>
            <p>
              PM Interview Pro is committed to customer satisfaction. This
              Cancellation and Refund Policy outlines the terms and conditions
              for canceling your subscription and requesting refunds for our
              AI-powered interview practice service.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Free Trial</h2>
            <p>
              We offer a 48-hour free trial of our Pro plan with no credit card
              required. You can cancel at any time during the trial period
              without any charges. After the trial ends, your account will
              automatically revert to the Free plan unless you choose to
              subscribe.
            </p>
          </section>

          <section className={styles.section}>
            <h2>3. Subscription Cancellation</h2>
            <p>
              You may cancel your paid subscription at any time through your
              account settings or by contacting our support team. When you
              cancel:
            </p>
            <ul>
              <li>
                Your subscription will remain active until the end of your
                current billing period
              </li>
              <li>
                You will continue to have access to Pro features until the
                subscription expires
              </li>
              <li>
                After expiration, your account will automatically revert to the
                Free plan
              </li>
              <li>No further charges will be made to your payment method</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Refund Policy</h2>
            <h3>7-Day Money-Back Guarantee</h3>
            <p>
              If you are not satisfied with PM Interview Pro within the first 7
              days of your paid subscription, you may request a full refund. To
              qualify:
            </p>
            <ul>
              <li>
                You must request the refund within 7 days of your initial
                subscription payment
              </li>
              <li>
                Contact us at{" "}
                <a href="mailto:pminterviewpracticemain@gmail.com">
                  pminterviewpracticemain@gmail.com
                </a>{" "}
                with your refund request
              </li>
              <li>
                Provide your account email and reason for the refund (optional)
              </li>
            </ul>

            <h3>After 7 Days</h3>
            <p>
              After the 7-day period, subscription payments are non-refundable.
              However, we will consider refund requests on a case-by-case basis
              for exceptional circumstances such as:
            </p>
            <ul>
              <li>
                Technical issues that prevented you from using the service
              </li>
              <li>Billing errors or duplicate charges</li>
              <li>Service unavailability for extended periods</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. Refund Process</h2>
            <p>If your refund request is approved:</p>
            <ul>
              <li>Refunds will be processed within 5-7 business days</li>
              <li>
                The refund will be credited to your original payment method
              </li>
              <li>
                Depending on your payment provider, it may take an additional
                5-10 business days for the refund to appear in your account
              </li>
              <li>
                You will receive a confirmation email once the refund is
                processed
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>6. Non-Refundable Circumstances</h2>
            <p>Refunds will not be provided in the following cases:</p>
            <ul>
              <li>
                Requests made after the 7-day refund period (unless exceptional
                circumstances apply)
              </li>
              <li>
                Partial subscription periods (we do not provide pro-rated
                refunds)
              </li>
              <li>
                Violation of our Terms and Conditions resulting in account
                termination
              </li>
              <li>Change of mind after the 7-day refund period</li>
              <li>Failure to use the service after subscription</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>7. Billing Disputes</h2>
            <p>
              If you notice an unauthorized charge or billing error on your
              account, please contact us immediately at{" "}
              <a href="mailto:pminterviewpracticemain@gmail.com">
                pminterviewpracticemain@gmail.com
              </a>
              . We will investigate and resolve the issue promptly.
            </p>
          </section>

          <section className={styles.section}>
            <h2>8. Service Interruptions</h2>
            <p>
              In the rare event of extended service unavailability or technical
              issues that significantly impact your ability to use PM Interview
              Pro, we may offer:
            </p>
            <ul>
              <li>Extension of your subscription period</li>
              <li>Partial or full refund at our discretion</li>
              <li>Account credits for future use</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>9. How to Request a Cancellation or Refund</h2>
            <p>To cancel your subscription or request a refund:</p>
            <ol>
              <li>Log in to your PM Interview Pro account</li>
              <li>Go to Account Settings and select "Manage Subscription"</li>
              <li>Click "Cancel Subscription" or contact us directly</li>
            </ol>
            <p>
              Alternatively, email us at{" "}
              <a href="mailto:pminterviewpracticemain@gmail.com">
                pminterviewpracticemain@gmail.com
              </a>{" "}
              with your request.
            </p>
          </section>

          <section className={styles.section}>
            <h2>10. Changes to This Policy</h2>
            <p>
              We reserve the right to modify this Cancellation and Refund Policy
              at any time. Any changes will be effective immediately upon
              posting the updated policy with a new "Last updated" date.
            </p>
          </section>

          <section className={styles.section}>
            <h2>11. Contact Us</h2>
            <p>
              If you have any questions about our Cancellation and Refund
              Policy, please contact us at{" "}
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

export default Refund;
