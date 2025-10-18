import { Link } from "react-router-dom";
import { useState } from "react";
import styles from "./Contact.module.scss";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just show success message
    // In production, this would send to backend
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 5000);
  };

  return (
    <div className={styles.contactPage}>
      <div className="container">
        <div className={styles.contactHeader}>
          <h1>Contact Us</h1>
          <p className={styles.subtitle}>
            Have questions? We're here to help. Reach out to our team.
          </p>
        </div>

        <div className={styles.contactGrid}>
          {/* Contact Information */}
          <div className={styles.contactInfo}>
            <h2>Get in Touch</h2>
            <p>
              Whether you have questions about features, pricing, or need
              technical support, our team is ready to answer all your questions.
            </p>

            <div className={styles.infoCards}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div>
                  <h3>Email Support</h3>
                  <p>
                    <a href="mailto:support@pminterviewpractice.com">
                      support@pminterviewpractice.com
                    </a>
                  </p>
                  <span className={styles.responseTime}>
                    Response within 24 hours
                  </span>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <h3>Business Address</h3>
                  <p>
                    PM Interview Practice LLC
                    <br />
                    San Francisco, CA
                    <br />
                    United States
                  </p>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <h3>Support Hours</h3>
                  <p>
                    Monday - Friday: 9 AM - 6 PM PST
                    <br />
                    Weekend: Email support only
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.quickLinks}>
              <h3>Quick Links</h3>
              <ul>
                <li>
                  <Link to="/pricing">Pricing & Plans</Link>
                </li>
                <li>
                  <Link to="/refund">Refund Policy</Link>
                </li>
                <li>
                  <Link to="/terms">Terms of Service</Link>
                </li>
                <li>
                  <Link to="/privacy">Privacy Policy</Link>
                </li>
              </ul>
            </div>

            <div className={styles.emailTypes}>
              <h3>Specific Inquiries</h3>
              <ul>
                <li>
                  <strong>Billing & Payments:</strong>{" "}
                  <a href="mailto:billing@pminterviewpractice.com">
                    billing@pminterviewpractice.com
                  </a>
                </li>
                <li>
                  <strong>Enterprise & Teams:</strong>{" "}
                  <a href="mailto:enterprise@pminterviewpractice.com">
                    enterprise@pminterviewpractice.com
                  </a>
                </li>
                <li>
                  <strong>Privacy & Legal:</strong>{" "}
                  <a href="mailto:privacy@pminterviewpractice.com">
                    privacy@pminterviewpractice.com
                  </a>
                </li>
                <li>
                  <strong>Partnerships:</strong>{" "}
                  <a href="mailto:partnerships@pminterviewpractice.com">
                    partnerships@pminterviewpractice.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className={styles.contactForm}>
            <h2>Send Us a Message</h2>
            {submitted ? (
              <div className={styles.successMessage}>
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <h3>Message Sent!</h3>
                <p>
                  Thank you for reaching out. We'll get back to you within 24
                  hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="technical">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="feedback">General Feedback</option>
                    <option value="bug">Report a Bug</option>
                    <option value="enterprise">Enterprise Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Tell us how we can help..."
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-lg">
                  Send Message
                </button>

                <p className={styles.formNote}>
                  * Required fields. We typically respond within 24 hours on
                  business days.
                </p>
              </form>
            )}
          </div>
        </div>

        <div className={styles.faq}>
          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqGrid}>
            <div className={styles.faqItem}>
              <h3>How quickly will I get a response?</h3>
              <p>
                We aim to respond to all inquiries within 24 hours on business
                days. Pro users receive priority support.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3>Can I schedule a demo?</h3>
              <p>
                Yes! Email enterprise@pminterviewpractice.com to schedule a
                personalized demo for teams or enterprise plans.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3>Do you offer phone support?</h3>
              <p>
                Currently, we provide email support only. This allows us to keep
                costs low and serve you better with detailed responses.
              </p>
            </div>
            <div className={styles.faqItem}>
              <h3>How do I report a bug?</h3>
              <p>
                Use the contact form above with subject "Report a Bug" or email
                support@pminterviewpractice.com with details and screenshots.
              </p>
            </div>
          </div>
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

export default Contact;
