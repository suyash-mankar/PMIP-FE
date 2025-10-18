import { Link } from "react-router-dom";
import styles from "./Refund.module.scss";

function Refund() {
  return (
    <div className={styles.policyPage}>
      <div className="container">
        <div className={styles.policyHeader}>
          <h1>Cancellation & Refund Policy</h1>
          <p className={styles.lastUpdated}>Last Updated: October 18, 2025</p>
        </div>

        <div className={styles.policyContent}>
          <section className={styles.section}>
            <h2>1. Overview</h2>
            <p>
              At PM Interview Practice, we want you to be completely satisfied
              with our service. This policy explains how cancellations and
              refunds work for our subscription plans.
            </p>
          </section>

          <section className={styles.section}>
            <h2>2. Free Plan</h2>
            <ul>
              <li>No payment required - cancel anytime</li>
              <li>Simply stop using the service or delete your account</li>
              <li>No refunds applicable as no charges are made</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>3. Pro Plan Cancellation</h2>

            <h3>3.1 How to Cancel</h3>
            <p>You can cancel your Pro subscription at any time by:</p>
            <ul>
              <li>Going to your Account Settings → Subscription</li>
              <li>Clicking "Cancel Subscription"</li>
              <li>
                Or emailing us at{" "}
                <a href="mailto:support@pminterviewpractice.com">
                  support@pminterviewpractice.com
                </a>
              </li>
            </ul>

            <h3>3.2 When Cancellation Takes Effect</h3>
            <ul>
              <li>
                Your cancellation will take effect at the end of your current
                billing period
              </li>
              <li>
                You will retain full access until the end of the paid period
              </li>
              <li>No further charges will be made after cancellation</li>
              <li>Your account will automatically revert to the Free plan</li>
            </ul>

            <h3>3.3 No Partial Refunds</h3>
            <ul>
              <li>
                We do not provide pro-rated refunds for unused time within a
                billing period
              </li>
              <li>
                If you cancel mid-month, you keep access until the end of that
                month
              </li>
              <li>
                Example: If you cancel on January 15, you retain access until
                January 31
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>4. Refund Policy</h2>

            <h3>4.1 7-Day Money-Back Guarantee</h3>
            <p>
              We offer a 7-day money-back guarantee for first-time Pro
              subscribers:
            </p>
            <ul>
              <li>
                If you're not satisfied within 7 days of your first payment,
                request a full refund
              </li>
              <li>
                Email{" "}
                <a href="mailto:support@pminterviewpractice.com">
                  support@pminterviewpractice.com
                </a>{" "}
                with "Refund Request" in subject line
              </li>
              <li>
                Refunds are processed within 5-10 business days to your original
                payment method
              </li>
              <li>
                This guarantee applies only to your first subscription purchase
              </li>
            </ul>

            <h3>4.2 Refund Eligibility</h3>
            <p>Refunds are granted in the following situations:</p>
            <ul>
              <li>
                <strong>Within 7 days:</strong> First-time subscribers (full
                refund)
              </li>
              <li>
                <strong>Duplicate charges:</strong> Accidental double billing
                (full refund of duplicate)
              </li>
              <li>
                <strong>Service unavailability:</strong> Extended outages
                preventing service use (pro-rated refund)
              </li>
              <li>
                <strong>Billing errors:</strong> Incorrect amount charged
                (difference refunded)
              </li>
            </ul>

            <h3>4.3 Non-Refundable Situations</h3>
            <p>Refunds will NOT be provided for:</p>
            <ul>
              <li>Cancellations after the 7-day guarantee period</li>
              <li>Partial month usage ("I only used it twice this month")</li>
              <li>Change of mind after the 7-day period</li>
              <li>Failure to cancel before renewal</li>
              <li>Account suspension due to Terms of Service violations</li>
              <li>
                Subscription renewals (only first payment eligible for 7-day
                guarantee)
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>5. How to Request a Refund</h2>
            <p>To request a refund within the eligible period:</p>
            <ol>
              <li>
                Email{" "}
                <a href="mailto:support@pminterviewpractice.com">
                  support@pminterviewpractice.com
                </a>
              </li>
              <li>Subject: "Refund Request - [Your Email]"</li>
              <li>
                Include:
                <ul>
                  <li>Your account email address</li>
                  <li>Date of payment</li>
                  <li>Transaction ID (if available)</li>
                  <li>Brief reason for refund (optional but helpful)</li>
                </ul>
              </li>
              <li>We will review and respond within 2 business days</li>
              <li>Approved refunds are processed within 5-10 business days</li>
            </ol>
          </section>

          <section className={styles.section}>
            <h2>6. Refund Processing Time</h2>
            <ul>
              <li>
                <strong>Request review:</strong> 1-2 business days
              </li>
              <li>
                <strong>Refund initiation:</strong> Within 24 hours of approval
              </li>
              <li>
                <strong>Bank/card processing:</strong> 5-10 business days
                (depends on your bank)
              </li>
              <li>
                <strong>Total time:</strong> Up to 14 business days from request
                to receipt
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>7. Refund Method</h2>
            <ul>
              <li>All refunds are issued to the original payment method</li>
              <li>If paid by credit card, refund goes back to that card</li>
              <li>
                If the original payment method is no longer valid, contact us
                for alternative arrangements
              </li>
              <li>Refunds are processed through Razorpay</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>8. Subscription Renewal</h2>
            <ul>
              <li>Pro subscriptions automatically renew monthly</li>
              <li>You will be charged on the same day each month</li>
              <li>We send a reminder email 3 days before renewal</li>
              <li>Cancel before the renewal date to avoid the next charge</li>
              <li>
                Renewal charges are not eligible for the 7-day refund guarantee
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>9. Failed Payments</h2>
            <ul>
              <li>
                If a payment fails, we will retry up to 3 times over 7 days
              </li>
              <li>You will receive email notifications of failed attempts</li>
              <li>Update your payment method in Account Settings</li>
              <li>
                After 3 failed attempts, your subscription will be cancelled
              </li>
              <li>You can resubscribe anytime</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>10. Price Changes</h2>
            <ul>
              <li>
                If we increase subscription prices, existing subscribers are
                notified 30 days in advance
              </li>
              <li>
                Your current rate remains until the next billing cycle after the
                notice period
              </li>
              <li>You can cancel before the price increase takes effect</li>
              <li>Price decreases apply automatically to all subscribers</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>11. Account Deletion</h2>
            <ul>
              <li>
                Deleting your account does not automatically cancel your
                subscription
              </li>
              <li>Cancel your subscription BEFORE deleting your account</li>
              <li>
                If you delete your account with an active subscription, you will
                still be charged
              </li>
              <li>
                Contact support if you accidentally deleted your account without
                cancelling
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>12. Enterprise and Custom Plans</h2>
            <p>
              Enterprise plans and custom agreements may have different
              cancellation and refund terms as specified in your contract.
              Contact your account manager or email{" "}
              <a href="mailto:enterprise@pminterviewpractice.com">
                enterprise@pminterviewpractice.com
              </a>{" "}
              for details.
            </p>
          </section>

          <section className={styles.section}>
            <h2>13. Questions and Support</h2>
            <p>
              If you have questions about cancellations, refunds, or billing:
            </p>
            <ul>
              <li>
                <strong>Email:</strong>{" "}
                <a href="mailto:support@pminterviewpractice.com">
                  support@pminterviewpractice.com
                </a>
              </li>
              <li>
                <strong>Billing inquiries:</strong>{" "}
                <a href="mailto:billing@pminterviewpractice.com">
                  billing@pminterviewpractice.com
                </a>
              </li>
              <li>
                <strong>Response time:</strong> Within 24 hours on business days
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>14. Changes to This Policy</h2>
            <p>
              We may update this Cancellation & Refund Policy from time to time.
              Changes will be posted on this page with an updated "Last Updated"
              date. Continued use of our service after changes constitutes
              acceptance of the updated policy.
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
