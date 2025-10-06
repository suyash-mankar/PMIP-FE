import { Link } from "react-router-dom";
import styles from "./Footer.module.scss";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.footerContent}>
          <p className={styles.copyright}>
            © {currentYear} PM Interview Practice. All rights reserved.
          </p>
          <nav className={styles.footerNav}>
            <Link to="/" className={styles.footerLink}>
              Home
            </Link>
            <Link to="/pricing" className={styles.footerLink}>
              Pricing
            </Link>
            <Link to="/auth/login" className={styles.footerLink}>
              Login
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
