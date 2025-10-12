import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "./Header.module.scss";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

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
                    <Link
                      to="/history"
                      className={styles.dropdownLink}
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      History
                    </Link>
                    <Link
                      to="/dashboard"
                      className={styles.dropdownLink}
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/pricing"
                      className={styles.dropdownLink}
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Pricing
                    </Link>
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
