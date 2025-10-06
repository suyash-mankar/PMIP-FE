import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../../api/client";
import styles from "./Register.module.scss";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await register(email, password);
      const { token, user } = response.data;

      localStorage.setItem("jwt_token", token);
      localStorage.setItem("user_email", user?.email || email);

      // Redirect to interview page
      window.location.href = "/interview";
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerPage}>
      <div className="container">
        <div className={styles.registerContainer}>
          <div className="card">
            <h1 className={styles.title}>Create Account</h1>
            <p className={styles.subtitle}>
              Start practicing PM interviews for free
            </p>

            {error && <div className={styles.errorBox}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className="input-group">
                <label htmlFor="email" className="label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  aria-label="Email address"
                />
              </div>

              <div className="input-group">
                <label htmlFor="password" className="label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  minLength={6}
                  aria-label="Password"
                />
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword" className="label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  required
                  minLength={6}
                  aria-label="Confirm password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
                style={{ width: "100%" }}
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <div className={styles.footer}>
              <p>
                Already have an account?{" "}
                <Link to="/auth/login" className={styles.link}>
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
