import { Link } from "react-router-dom";
import styles from "./Shipping.module.scss";

function Shipping() {
  return (
    <div className={styles.policyPage}>
      <div className="container">
        <div className={styles.policyHeader}>
          <h1>Shipping & Delivery Policy</h1>
          <p className={styles.lastUpdated}>Last updated on Oct 18 2025</p>
        </div>

        <div className={styles.policyContent}>
          <section className={styles.section}>
            <p>
              For International buyers, orders are shipped and delivered through
              registered international courier companies and/or International
              speed post only. For domestic buyers, orders are shipped through
              registered domestic courier companies and /or speed post only.
              Orders are shipped within 0-7 days or as per the delivery date
              agreed at the time of order confirmation and delivering of the
              shipment subject to Courier Company / post office norms. SUYASH
              MANKAR is not liable for any delay in delivery by the courier
              company / postal authorities and only guarantees to hand over the
              consignment to the courier company or postal authorities within
              0-7 days from the date of the order and payment or as per the
              delivery date agreed at the time of order confirmation. Delivery
              of all orders will be to the address provided by the buyer.
              Delivery of our services will be confirmed on your mail ID as
              specified during registration. For any issues in utilizing our
              services you may contact our helpdesk on 9994489681 or{" "}
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
