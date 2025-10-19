import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./Header.module.scss";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownOpen &&
        !event.target.closest(`.${styles.profileDropdown}`)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_email");
    setIsLoggedIn(false);
    navigate("/auth/login");
  };

  // Check if we're currently on the interview page
  const isOnInterviewPage = location.pathname === "/interview";

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <Link to="/" className={styles.logo}>
          <img
            src="/logo.svg"
            alt="PM Interview Practice Logo"
            className={styles.logoIcon}
          />
          <img
            src="/logo_text.svg"
            alt="PM Interview Practice"
            className={styles.logoText}
          />
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
          {isLoggedIn ? (
            <>
              <Link
                to="/dashboard"
                className={`${styles.navLink} ${
                  location.pathname === "/dashboard" ? styles.active : ""
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/pricing"
                className={`${styles.navLink} ${
                  location.pathname === "/pricing" ? styles.active : ""
                }`}
              >
                Pricing
              </Link>
              {!isOnInterviewPage && (
                <Link
                  to="/interview"
                  className={`btn btn-primary ${styles.startInterviewBtn}`}
                >
                  Start Interview
                </Link>
              )}
              <div className={styles.profileDropdown}>
                <button
                  className={styles.profileBtn}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                >
                  <svg
                    className={styles.profileIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {profileDropdownOpen && (
                  <div className={styles.dropdown}>
                    <button
                      onClick={handleLogout}
                      className={styles.dropdownLogoutBtn}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
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
