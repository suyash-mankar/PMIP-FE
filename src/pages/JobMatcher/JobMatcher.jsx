import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./JobMatcher.module.scss";
import { trackEvent } from "../../services/analytics";
import { getJobMatcherPreferences, submitJobMatch as apiSubmitJobMatch } from "../../api/client";

function JobMatcher() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    resumeFile: null,
    jobIntentText: "",
    desiredRole: "",
    companyPrefs: "",
    locationPref: "",
    remotePref: ""
  });
  const [userEmail, setUserEmail] = useState("");
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, submitting, submitted, error
  const [runId, setRunId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasSavedPreferences, setHasSavedPreferences] = useState(false);
  const [savedResumeFileName, setSavedResumeFileName] = useState(null);

  // Load saved preferences on mount
  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const response = await getJobMatcherPreferences();
      
      // Set user email from preferences or from localStorage
      if (response.data.hasPreferences && response.data.preferences) {
        const prefs = response.data.preferences;
        setUserEmail(prefs.userEmail || localStorage.getItem("user_email") || "");
        
        setFormData({
          resumeFile: null, // Don't pre-set file, user needs to re-upload
          jobIntentText: prefs.jobIntentText || "",
          desiredRole: prefs.desiredRole || "",
          companyPrefs: prefs.companyPrefs || "",
          locationPref: prefs.locationPref || "",
          remotePref: prefs.remotePref || ""
        });
        
        if (prefs.resumeFile) {
          setSavedResumeFileName(prefs.resumeFile.fileName);
        }
        
        setHasSavedPreferences(true);
      } else {
        // No preferences yet, use email from localStorage
        setUserEmail(localStorage.getItem("user_email") || "");
      }
    } catch (err) {
      // If not authenticated, redirect to login
      if (err.response?.status === 401) {
        navigate("/auth/login");
        return;
      }
      console.error("Error loading preferences:", err);
      // Continue without preferences if error
      setUserEmail(localStorage.getItem("user_email") || "");
    } finally {
      setLoading(false);
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a PDF or DOCX file");
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }
      setFormData({ ...formData, resumeFile: file });
      setSavedResumeFileName(null); // Clear saved resume info when new file is selected
      setError(null);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.resumeFile) {
      setError("Please upload your resume");
      return;
    }
    if (!formData.jobIntentText) {
      setError("Please describe what kind of job you're looking for");
      return;
    }
    
    setStatus("submitting");
    setError(null);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("resumeFile", formData.resumeFile);
      formDataToSend.append("jobIntentText", formData.jobIntentText);
      if (formData.desiredRole) formDataToSend.append("desiredRole", formData.desiredRole);
      if (formData.companyPrefs) formDataToSend.append("companyPrefs", formData.companyPrefs);
      if (formData.locationPref) formDataToSend.append("locationPref", formData.locationPref);
      if (formData.remotePref) formDataToSend.append("remotePref", formData.remotePref);
      
      const response = await apiSubmitJobMatch(formDataToSend);
      setRunId(response.data.runId);
      setStatus("submitted");
      
      // Track analytics
      trackEvent("Job Match", "Submit", "Success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
      trackEvent("Job Match", "Submit", "Error");
    }
  };
  
  const resetForm = () => {
    setFormData({
      resumeFile: null,
      jobIntentText: "",
      desiredRole: "",
      companyPrefs: "",
      locationPref: "",
      remotePref: ""
    });
    setStatus("idle");
    setRunId(null);
    setError(null);
    setShowAdvanced(false);
    setSavedResumeFileName(null);
  };

  if (loading) {
    return (
      <div className={styles.jobMatcherPage}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading your saved preferences...</p>
        </div>
      </div>
    );
  }
  
  if (status === "submitted") {
    return (
      <div className={styles.jobMatcherPage}>
        <div className={styles.successContainer}>
          <div className={styles.successIcon}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className={styles.successTitle}>Request Submitted Successfully!</h1>
          <p className={styles.successMessage}>
            We're analyzing your resume and searching for the best job matches in India.
            <br />
            You'll receive an email at <strong>{userEmail}</strong> with your top 10 job recommendations shortly.
          </p>
          <div className={styles.successDetails}>
            <p className={styles.runId}>Request ID: <code>{runId}</code></p>
            <p className={styles.estimate}>Estimated time: 2-5 minutes</p>
          </div>
          <button onClick={resetForm} className={styles.newSearchBtn}>
            Start New Search
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={styles.jobMatcherPage}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>AI Job Matcher</h1>
        <p className={styles.subtitle}>
          Upload your resume and describe your dream job. We'll analyze your profile and email you the top 10 matching opportunities in India.
        </p>
        {hasSavedPreferences && (
          <div className={styles.savedInfo}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Your saved preferences have been loaded. You can edit them below.</span>
          </div>
        )}
      </div>
      
      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.errorBox}>
              <span>{error}</span>
              <button type="button" onClick={() => setError(null)} className={styles.closeBtn}>✕</button>
            </div>
          )}
          
          {/* Resume Upload */}
          <div className={styles.formGroup}>
            <label htmlFor="resumeFile" className={styles.label}>
              Resume <span className={styles.required}>*</span>
            </label>
            {savedResumeFileName && !formData.resumeFile && (
              <div className={styles.savedResumeInfo}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Saved resume: {savedResumeFileName}</span>
                <span className={styles.replaceHint}>(Upload a new file to replace)</span>
              </div>
            )}
            <div className={styles.fileUpload}>
              <input
                type="file"
                id="resumeFile"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className={styles.fileInput}
              />
              <label htmlFor="resumeFile" className={styles.fileLabel}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{formData.resumeFile ? formData.resumeFile.name : (savedResumeFileName ? "Replace resume file" : "Choose PDF or DOCX (max 5MB)")}</span>
              </label>
            </div>
            <p className={styles.hint}>Upload your resume in PDF or DOCX format</p>
          </div>
          
          {/* Job Intent - Free Form Text */}
          <div className={styles.formGroup}>
            <label htmlFor="jobIntentText" className={styles.label}>
              What kind of job are you looking for? <span className={styles.required}>*</span>
            </label>
            <textarea
              id="jobIntentText"
              name="jobIntentText"
              value={formData.jobIntentText}
              onChange={handleInputChange}
              placeholder="Describe your ideal job in plain English..."
              className={styles.textarea}
              rows="6"
              required
            />
            <div className={styles.examples}>
              <p className={styles.examplesTitle}>Examples:</p>
              <ul className={styles.examplesList}>
                <li>"Product Manager roles at AI companies in Bangalore"</li>
                <li>"Senior Software Engineer positions in fintech startups, remote preferred"</li>
                <li>"Entry-level Data Analyst jobs in Mumbai or Pune, with salary above 8 LPA"</li>
                <li>"Marketing Manager in B2B SaaS companies with international exposure"</li>
              </ul>
            </div>
          </div>
          
          {/* Advanced Options Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={styles.advancedToggle}
          >
            <span>{showAdvanced ? "Hide" : "Show"} Advanced Options</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={showAdvanced ? styles.iconRotated : ""}
            >
              <polyline points="6 9 12 15 18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {/* Advanced Options */}
          {showAdvanced && (
            <div className={styles.advancedOptions}>
              <p className={styles.advancedNote}>
                These fields are optional. Our AI will extract this information from your job intent and resume automatically.
              </p>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="desiredRole" className={styles.label}>
                    Desired Role
                  </label>
                  <input
                    type="text"
                    id="desiredRole"
                    name="desiredRole"
                    value={formData.desiredRole}
                    onChange={handleInputChange}
                    placeholder="e.g., Product Manager"
                    className={styles.input}
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="locationPref" className={styles.label}>
                    Location Preference
                  </label>
                  <input
                    type="text"
                    id="locationPref"
                    name="locationPref"
                    value={formData.locationPref}
                    onChange={handleInputChange}
                    placeholder="e.g., Bangalore, Mumbai"
                    className={styles.input}
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="companyPrefs" className={styles.label}>
                  Company Preferences
                </label>
                <input
                  type="text"
                  id="companyPrefs"
                  name="companyPrefs"
                  value={formData.companyPrefs}
                  onChange={handleInputChange}
                  placeholder="e.g., AI/ML companies, fintech startups"
                  className={styles.input}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="remotePref" className={styles.label}>
                  Remote Preference
                </label>
                <select
                  id="remotePref"
                  name="remotePref"
                  value={formData.remotePref}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value="">No preference</option>
                  <option value="remote">Remote only</option>
                  <option value="hybrid">Hybrid preferred</option>
                  <option value="onsite">On-site preferred</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={status === "submitting"}
          >
            {status === "submitting" ? (
              <>
                <span className={styles.spinner}></span>
                Analyzing & Searching...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Find My Dream Jobs
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default JobMatcher;

