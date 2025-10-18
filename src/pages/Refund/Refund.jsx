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
            <p>
              SUYASH MANKAR believes in helping its customers as far as
              possible, and has therefore a liberal cancellation policy. Under
              this policy:
            </p>
          </section>

          <section className={styles.section}>
            <p>
              Cancellations will be considered only if the request is made
              within Same day of placing the order. However, the cancellation
              request may not be entertained if the orders have been
              communicated to the vendors/merchants and they have initiated the
              process of shipping them.
            </p>
          </section>

          <section className={styles.section}>
            <p>
              SUYASH MANKAR does not accept cancellation requests for perishable
              items like flowers, eatables etc. However, refund/replacement can
              be made if the customer establishes that the quality of product
              delivered is not good.
            </p>
          </section>

          <section className={styles.section}>
            <p>
              In case of receipt of damaged or defective items please report the
              same to our Customer Service team. The request will, however, be
              entertained once the merchant has checked and determined the same
              at his own end. This should be reported within Same day of receipt
              of the products.
            </p>
          </section>

          <section className={styles.section}>
            <p>
              In case you feel that the product received is not as shown on the
              site or as per your expectations, you must bring it to the notice
              of our customer service within Same day of receiving the product.
              The Customer Service Team after looking into your complaint will
              take an appropriate decision.
            </p>
          </section>

          <section className={styles.section}>
            <p>
              In case of complaints regarding products that come with a warranty
              from manufacturers, please refer the issue to them.
            </p>
          </section>

          <section className={styles.section}>
            <p>
              In case of any Refunds approved by the SUYASH MANKAR, it'll take
              6-8 days for the refund to be processed to the end customer.
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
