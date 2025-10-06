import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./Header.module.scss";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_email");
    setIsLoggedIn(false);
    navigate("/auth/login");
  };

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoIcon}>🎯</span>
          <span className={styles.logoText}>PM Interview Practice</span>
        </Link>

        <button
          className={styles.mobileMenuBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>

        <nav
          className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ""}`}
        >
          <Link to="/" className={styles.navLink}>
            Home
          </Link>
          {isLoggedIn && (
            <>
              <Link to="/interview" className={styles.navLink}>
                Interview
              </Link>
              <Link to="/history" className={styles.navLink}>
                History
              </Link>
              <Link to="/dashboard" className={styles.navLink}>
                Dashboard
              </Link>
            </>
          )}
          <Link to="/pricing" className={styles.navLink}>
            Pricing
          </Link>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className={`btn btn-primary ${styles.authBtn}`}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/auth/login"
              className={`btn btn-primary ${styles.authBtn}`}
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
