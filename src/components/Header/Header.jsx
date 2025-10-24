import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { getGoogleAuthUrl } from "../../api/client";
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
    setMobileMenuOpen(false);
    navigate("/");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleGoogleLogin = () => {
    closeMobileMenu();
    window.location.href = getGoogleAuthUrl();
  };

  // Check if we're currently on the interview page
  const isOnInterviewPage = location.pathname === "/interview";

  return (
    <header className={styles.header}>
      <div className={`container ${styles.headerContainer}`}>
        <Link to="/" className={styles.logo} onClick={closeMobileMenu}>
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
                onClick={closeMobileMenu}
              >
                Dashboard
              </Link>
              <Link
                to="/pricing"
                className={`${styles.navLink} ${
                  location.pathname === "/pricing" ? styles.active : ""
                }`}
                onClick={closeMobileMenu}
              >
                Pricing
              </Link>
              {!isOnInterviewPage && (
                <Link
                  to="/interview"
                  className={`btn btn-primary ${styles.startInterviewBtn}`}
                  onClick={closeMobileMenu}
                >
                  Start Interview
                </Link>
              )}
              {/* Show logout button on mobile, profile dropdown on desktop */}
              <button
                onClick={handleLogout}
                className={`${styles.mobileLogoutBtn}`}
              >
                Logout
              </button>
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
            <>
              <Link
                to="/pricing"
                className={`${styles.navLink} ${
                  location.pathname === "/pricing" ? styles.active : ""
                }`}
                onClick={closeMobileMenu}
              >
                Pricing
              </Link>
              <button
                onClick={handleGoogleLogin}
                className={styles.googleAuthBtn}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                    fill="#4285F4"
                  />
                  <path
                    d="M9.003 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z"
                    fill="#34A853"
                  />
                  <path
                    d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z"
                    fill="#EA4335"
                  />
                </svg>
                Login with Google
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
