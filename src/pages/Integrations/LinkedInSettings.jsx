import { useState, useEffect } from 'react';
import apiClient from '../../api/client';
import styles from './LinkedInSettings.module.scss';

export default function LinkedInSettings() {
  const [liAtCookie, setLiAtCookie] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // success, error, info

  // Load current status on mount
  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setLoading(true);
      const response = await apiClient.integrations.getLinkedInStatus();
      setStatus(response.data);
    } catch (error) {
      console.error('Failed to load LinkedIn status:', error);
      setStatus({ configured: false, status: 'not_set' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!liAtCookie.trim()) {
      showMessage('Please enter your li_at cookie', 'error');
      return;
    }

    try {
      setSaving(true);
      setMessage('');
      
      await apiClient.integrations.saveLinkedInCookie({ liAtCookie });
      
      showMessage('LinkedIn cookie saved successfully!', 'success');
      setLiAtCookie(''); // Clear input
      await loadStatus(); // Reload status
    } catch (error) {
      console.error('Failed to save LinkedIn cookie:', error);
      showMessage(error.response?.data?.message || 'Failed to save LinkedIn cookie', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    try {
      setTesting(true);
      setMessage('');
      
      const response = await apiClient.integrations.testLinkedInCookie();
      
      if (response.data.available) {
        showMessage('✓ Cookie is valid and working!', 'success');
      } else {
        showMessage(`✗ Cookie test failed: ${response.data.message}`, 'error');
      }
      
      await loadStatus(); // Reload status
    } catch (error) {
      console.error('Failed to test LinkedIn cookie:', error);
      showMessage(error.response?.data?.message || 'Failed to test LinkedIn cookie', 'error');
    } finally {
      setTesting(false);
    }
  };

  const handleRemove = async () => {
    if (!window.confirm('Are you sure you want to remove your LinkedIn cookie?')) {
      return;
    }

    try {
      setRemoving(true);
      setMessage('');
      
      await apiClient.integrations.removeLinkedInCookie();
      
      showMessage('LinkedIn cookie removed successfully', 'success');
      await loadStatus(); // Reload status
    } catch (error) {
      console.error('Failed to remove LinkedIn cookie:', error);
      showMessage(error.response?.data?.message || 'Failed to remove LinkedIn cookie', 'error');
    } finally {
      setRemoving(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const getStatusBadge = () => {
    if (!status) return null;

    const statusConfig = {
      not_set: { label: 'Not Set', className: styles.statusNotSet },
      active: { label: 'Active', className: styles.statusActive },
      invalid: { label: 'Invalid', className: styles.statusInvalid },
      expired: { label: 'Expired', className: styles.statusExpired },
    };

    const config = statusConfig[status.status] || statusConfig.not_set;

    return (
      <span className={`${styles.statusBadge} ${config.className}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading LinkedIn integration status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>LinkedIn Integration</h1>
          {getStatusBadge()}
        </div>

        {/* Warning Banner */}
        <div className={styles.warningBanner}>
          <div className={styles.warningIcon}>⚠️</div>
          <div className={styles.warningContent}>
            <strong>Important Security Notice</strong>
            <p>
              Your <code>li_at</code> cookie is a sensitive authentication token that grants access to your LinkedIn account.
              Never share it with anyone. We store it encrypted, but you should rotate it periodically for security.
            </p>
            <p>
              <strong>Compliance:</strong> Using session cookies to scrape LinkedIn may violate their Terms of Service
              and could lead to account restrictions. Use at your own risk.
            </p>
          </div>
        </div>

        {/* Status Display */}
        {status?.configured && (
          <div className={styles.statusInfo}>
            <div className={styles.statusRow}>
              <span className={styles.label}>Status:</span>
              <span>{status.status}</span>
            </div>
            {status.lastTestedAt && (
              <div className={styles.statusRow}>
                <span className={styles.label}>Last Tested:</span>
                <span>{new Date(status.lastTestedAt).toLocaleString()}</span>
              </div>
            )}
            <div className={styles.statusRow}>
              <span className={styles.label}>Last Updated:</span>
              <span>{new Date(status.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* Cookie Input */}
        <div className={styles.formGroup}>
          <label htmlFor="liAtCookie" className={styles.label}>
            LinkedIn <code>li_at</code> Cookie
          </label>
          <input
            id="liAtCookie"
            type="password"
            className={styles.input}
            value={liAtCookie}
            onChange={(e) => setLiAtCookie(e.target.value)}
            placeholder="Enter your li_at cookie value"
            disabled={saving}
          />
          <div className={styles.helpText}>
            <details>
              <summary>How to get your li_at cookie</summary>
              <ol>
                <li>Log in to LinkedIn in your browser</li>
                <li>Open Developer Tools (F12 or Right-click → Inspect)</li>
                <li>Go to the "Application" or "Storage" tab</li>
                <li>Click on "Cookies" → "https://www.linkedin.com"</li>
                <li>Find the cookie named "li_at"</li>
                <li>Copy its value (the long alphanumeric string)</li>
              </ol>
            </details>
          </div>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`${styles.message} ${styles[messageType]}`}>
            {message}
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.actions}>
          <button
            onClick={handleSave}
            disabled={saving || !liAtCookie.trim()}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            {saving ? 'Saving...' : status?.configured ? 'Update Cookie' : 'Save Cookie'}
          </button>

          {status?.configured && (
            <>
              <button
                onClick={handleTest}
                disabled={testing}
                className={`${styles.btn} ${styles.btnSecondary}`}
              >
                {testing ? 'Testing...' : 'Test Cookie'}
              </button>

              <button
                onClick={handleRemove}
                disabled={removing}
                className={`${styles.btn} ${styles.btnDanger}`}
              >
                {removing ? 'Removing...' : 'Remove Cookie'}
              </button>
            </>
          )}
        </div>

        {/* Info Section */}
        <div className={styles.infoSection}>
          <h3>How this works</h3>
          <p>
            The Job Matcher feature can optionally use your LinkedIn cookie to search for jobs on LinkedIn
            when other sources don't have enough results. This is disabled by default and only works when:
          </p>
          <ul>
            <li>You've saved a valid <code>li_at</code> cookie here</li>
            <li>The LinkedIn provider is enabled for your account</li>
            <li>Other job sources return fewer than expected results</li>
          </ul>
          <p>
            Your cookie is encrypted and never logged. The system makes minimal requests with rate limiting
            to avoid detection. If LinkedIn blocks access, the provider automatically disables itself.
          </p>
        </div>
      </div>
    </div>
  );
}

