import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../api/client";
import styles from "./Login.module.scss";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(email, password);
      const { token, user } = response.data;

      localStorage.setItem("jwt_token", token);
      localStorage.setItem("user_email", user?.email || email);

      // Reload to update header state
      window.location.href = "/interview";
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className="container">
        <div className={styles.loginContainer}>
          <div className="card">
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>
              Sign in to continue your PM interview practice
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
                  placeholder="Enter your password"
                  required
                  aria-label="Password"
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
                style={{ width: "100%" }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className={styles.footer}>
              <p>
                Don&apos;t have an account?{" "}
                <Link to="/auth/register" className={styles.link}>
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
