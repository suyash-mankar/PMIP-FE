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
            <p>
              For the purpose of these Terms and Conditions, The term "we",
              "us", "our" used anywhere on this page shall mean SUYASH MANKAR,
              whose registered/operational office is #365, Sector 7, HSR Layout
              Bengaluru KARNATAKA 560102 . "you", "your", "user", "visitor"
              shall mean any natural or legal person who is visiting our website
              and/or agreed to purchase from us.
            </p>
          </section>

          <section className={styles.section}>
            <p>
              Your use of the website and/or purchase from us are governed by
              following Terms and Conditions:
            </p>
          </section>

          <section className={styles.section}>
            <p>
              The content of the pages of this website is subject to change
              without notice.
            </p>
          </section>

          <section className={styles.section}>
            <p>
              Neither we nor any third parties provide any warranty or guarantee
              as to the accuracy, timeliness, performance, completeness or
              suitability of the information and materials found or offered on
              this website for any particular purpose. You acknowledge that such
              information and materials may contain inaccuracies or errors and
              we expressly exclude liability for any such inaccuracies or errors
              to the fullest extent permitted by law.
            </p>
          </section>

          <section className={styles.section}>
            <p>
              Your use of any information or materials on our website and/or
              product pages is entirely at your own risk, for which we shall not
              be liable. It shall be your own responsibility to ensure that any
              products, services or information available through our website
              and/or product pages meet your specific requirements.
            </p>
          </section>

          <section className={styles.section}>
            <p>
              Our website contains material which is owned by or licensed to us.
              This material includes, but are not limited to, the design,
              layout, look, appearance and graphics. Reproduction is prohibited
              other than in accordance with the copyright notice, which forms
              part of these terms and conditions.
            </p>
          </section>

          <section className={styles.section}>
            <p>
              All trademarks reproduced in our website which are not the
              property of, or licensed to, the operator are acknowledged on the
              website.
            </p>
          </section>

          <section className={styles.section}>
            <p>
              Unauthorized use of information provided by us shall give rise to
              a claim for damages and/or be a criminal offense.
            </p>
          </section>

          <section className={styles.section}>
            <p>
              From time to time our website may also include links to other
              websites. These links are provided for your convenience to provide
              further information.
            </p>
          </section>

          <section className={styles.section}>
            <p>
              You may not create a link to our website from another website or
              document without SUYASH MANKAR's prior written consent.
            </p>
          </section>

          <section className={styles.section}>
            <p>
              Any dispute arising out of use of our website and/or purchase with
              us and/or any engagement with us is subject to the laws of India .
            </p>
          </section>

          <section className={styles.section}>
            <p>
              We, shall be under no liability whatsoever in respect of any loss
              or damage arising directly or indirectly out of the decline of
              authorization for any Transaction, on Account of the Cardholder
              having exceeded the preset limit mutually agreed by us with our
              acquiring bank from time to time
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
