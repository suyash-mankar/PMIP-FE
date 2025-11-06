import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./JobMatcher.module.scss";
import { trackEvent } from "../../services/analytics";
import { getJobMatcherPreferences, submitJobMatch as apiSubmitJobMatch, getGoogleAuthUrl } from "../../api/client";

function JobMatcher() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    resumeFile: null,
    jobIntentText: "",
    desiredRole: "",
    companyPrefs: "",
    locationPref: "",
    remotePref: "",
    enableLinkedInSearch: false
  });
  const [userEmail, setUserEmail] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, submitting, submitted, error
  const [runId, setRunId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasSavedPreferences, setHasSavedPreferences] = useState(false);
  const [savedResumeFileName, setSavedResumeFileName] = useState(null);
  const [shouldAutoSubmit, setShouldAutoSubmit] = useState(false);

  // Check login status and load saved preferences on mount
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    setIsLoggedIn(!!token);
    
    // Check if there's pending form data from before login
    const pendingFormData = localStorage.getItem('jobMatcher_pendingFormData');
    const pendingResume = localStorage.getItem('jobMatcher_pendingResume');
    const pendingResumeName = localStorage.getItem('jobMatcher_pendingResumeName');
    
    if (token) {
      // User is logged in
      if (pendingFormData) {
        // Restore form data from before login
        try {
          const savedData = JSON.parse(pendingFormData);
          
          // Restore text fields
          setFormData({
            resumeFile: null, // Will be restored from base64 if exists
            jobIntentText: savedData.jobIntentText || "",
            desiredRole: savedData.desiredRole || "",
            companyPrefs: savedData.companyPrefs || "",
            locationPref: savedData.locationPref || "",
            remotePref: savedData.remotePref || "",
            enableLinkedInSearch: savedData.enableLinkedInSearch || false,
          });
          
          // Restore resume file from base64 if exists
          if (pendingResume && pendingResumeName && pendingResume.startsWith('data:')) {
            // Convert base64 back to File object
            try {
              fetch(pendingResume)
                .then(res => res.blob())
                .then(blob => {
                  if (blob && blob.size > 0) {
                    const file = new File([blob], pendingResumeName, { type: blob.type });
                    setFormData(prev => ({ ...prev, resumeFile: file }));
                  }
                })
                .catch(err => console.error("Error restoring resume:", err));
            } catch (err) {
              console.error("Error parsing resume data:", err);
            }
          } else if (savedData.savedResumeFileName) {
            setSavedResumeFileName(savedData.savedResumeFileName);
          }
          
          // Clear pending data
          localStorage.removeItem('jobMatcher_pendingFormData');
          localStorage.removeItem('jobMatcher_pendingResume');
          localStorage.removeItem('jobMatcher_pendingResumeName');
          
          // Set flag to auto-submit after preferences are loaded
          setHasSavedPreferences(true); // Prevent loading from overriding our restored data
          setShouldAutoSubmit(true); // Flag to trigger auto-submit
        } catch (err) {
          console.error("Error restoring form data:", err);
          // Clear invalid data
          localStorage.removeItem('jobMatcher_pendingFormData');
          localStorage.removeItem('jobMatcher_pendingResume');
          localStorage.removeItem('jobMatcher_pendingResumeName');
        }
      }
      
      loadPreferences();
    } else {
      // If not logged in, skip loading preferences
      setLoading(false);
      setUserEmail("");
    }
  }, []);

  const handleGoogleLogin = useCallback(() => {
    // Save form data to localStorage before redirecting
    const formDataToSave = {
      resumeFile: formData.resumeFile ? {
        name: formData.resumeFile.name,
        size: formData.resumeFile.size,
        type: formData.resumeFile.type,
      } : null,
      jobIntentText: formData.jobIntentText,
      desiredRole: formData.desiredRole,
      companyPrefs: formData.companyPrefs,
      locationPref: formData.locationPref,
      remotePref: formData.remotePref,
      enableLinkedInSearch: formData.enableLinkedInSearch,
      savedResumeFileName: savedResumeFileName,
      timestamp: Date.now(),
    };
    
    // Store form data
    localStorage.setItem('jobMatcher_pendingFormData', JSON.stringify(formDataToSave));
    
    // Store resume file if exists (convert to base64 for storage)
    if (formData.resumeFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        localStorage.setItem('jobMatcher_pendingResume', base64Data);
        localStorage.setItem('jobMatcher_pendingResumeName', formData.resumeFile.name);
        // Redirect after file is saved
        window.location.href = `${getGoogleAuthUrl()}?redirect=/job-matcher`;
      };
      reader.readAsDataURL(formData.resumeFile);
    } else {
      // No file to save, redirect immediately
      window.location.href = `${getGoogleAuthUrl()}?redirect=/job-matcher`;
    }
  }, [formData, savedResumeFileName]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // If not logged in, redirect to login
    if (!isLoggedIn) {
      handleGoogleLogin();
      return;
    }
    
    // Validation
    // Resume is optional if saved resume exists
    if (!formData.resumeFile && !savedResumeFileName) {
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
      // Only append resume file if a new one was uploaded
      if (formData.resumeFile) {
        formDataToSend.append("resumeFile", formData.resumeFile);
      }
      formDataToSend.append("jobIntentText", formData.jobIntentText);
      if (formData.desiredRole) formDataToSend.append("desiredRole", formData.desiredRole);
      if (formData.companyPrefs) formDataToSend.append("companyPrefs", formData.companyPrefs);
      if (formData.locationPref) formDataToSend.append("locationPref", formData.locationPref);
      if (formData.remotePref) formDataToSend.append("remotePref", formData.remotePref);
      formDataToSend.append("enableLinkedInSearch", formData.enableLinkedInSearch);
      
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
  }, [isLoggedIn, formData, savedResumeFileName, handleGoogleLogin]);

  // Auto-submit effect - triggers after form data is restored and user is logged in
  useEffect(() => {
    if (shouldAutoSubmit && isLoggedIn && !loading) {
      // Wait a bit for all state to be set
      const timer = setTimeout(() => {
        // Create a synthetic submit event
        const syntheticEvent = {
          preventDefault: () => {},
          target: { checkValidity: () => true },
        };
        handleSubmit(syntheticEvent);
        setShouldAutoSubmit(false); // Reset flag
      }, 1500); // Wait for preferences to load
      
      return () => clearTimeout(timer);
    }
  }, [shouldAutoSubmit, isLoggedIn, loading, handleSubmit]);

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
          remotePref: prefs.remotePref || "",
          enableLinkedInSearch: prefs.enableLinkedInSearch || false
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

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };
  
  const resetForm = () => {
    setFormData({
      resumeFile: null,
      jobIntentText: "",
      desiredRole: "",
      companyPrefs: "",
      locationPref: "",
      remotePref: "",
      enableLinkedInSearch: false
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
        <div className={styles.loaderContainer}>
          <div className={styles.loaderContent}>
            <div className={styles.loaderRings}>
              <div className={styles.ring}></div>
              <div className={styles.ring}></div>
              <div className={styles.ring}></div>
            </div>
            <div className={styles.loaderIcon}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="14 2 14 8 20 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 15l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <h3 className={styles.loaderTitle}>Loading Your Preferences</h3>
          <p className={styles.loaderSubtitle}>
            Preparing your job matching experience...
          </p>
          <div className={styles.loaderDots}>
            <span></span>
            <span></span>
            <span></span>
          </div>
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
          <button onClick={() => navigate('/interview')} className={styles.newSearchBtn}>
            Start Practicing
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
          Stop scrolling through hundreds of irrelevant jobs. Let AI find your perfect match.
        </p>
      </div>
      
      <div className={styles.contentGrid}>
        <div className={styles.featuresColumn}>
          <div className={styles.featuresList}>
            <div className={styles.featureItem}>
              <div className={styles.featureIconCircle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8" cy="12" r="1.5" fill="currentColor" opacity="0.8"/>
                  <circle cx="8" cy="15" r="1.5" fill="currentColor" opacity="0.8"/>
                  <circle cx="8" cy="18" r="1.5" fill="currentColor" opacity="0.8"/>
                  <path d="M12 12h4M12 15h3M12 18h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
                  <circle cx="18" cy="5" r="2" fill="currentColor" opacity="0.3"/>
                  <path d="M16.5 4.5l3 3M19.5 4.5l-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
                </svg>
              </div>
              <div className={styles.featureTextBlock}>
                <div className={styles.featureHeading}>Smart Resume Analysis</div>
                <div className={styles.featureText}>AI extracts your skills, experience, and goals automatically</div>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIconCircle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                  <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
                </svg>
              </div>
              <div className={styles.featureTextBlock}>
                <div className={styles.featureHeading}>Thousands of Jobs</div>
                <div className={styles.featureText}>Searches across India to find the best matches for you</div>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIconCircle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="2" fill="currentColor"/>
                  <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className={styles.featureTextBlock}>
                <div className={styles.featureHeading}>Match Score & Reasoning</div>
                <div className={styles.featureText}>Every job includes a score and clear reasoning why it fits</div>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIconCircle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4h16v12H4z" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="10" r="2" fill="currentColor" />
                </svg>
              </div>
              <div className={styles.featureTextBlock}>
                <div className={styles.featureHeading}>Top 10 Delivered</div>
                <div className={styles.featureText}>Receive your best 10 matches directly in your inbox</div>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className={styles.howItWorks}>
            <div className={styles.hiwTitle}>How it works</div>
            <div className={styles.hiwSteps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepHeading}>Tell us your dream job</div>
                  <div className={styles.stepText}>Describe the role, location, company type or salary preferences.</div>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepHeading}>AI analyzes your resume</div>
                  <div className={styles.stepText}>We parse your resume to extract skills, experience and strengths.</div>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <div className={styles.stepHeading}>Get curated matches</div>
                  <div className={styles.stepText}>Receive top 10 roles with a match score and the reason they fit you.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust / Privacy */}
          <div className={styles.trustBar}>
            <div className={styles.trustCard}>
              <div className={styles.trustIconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={styles.trustContent}>
                <div className={styles.trustTitle}>Privacy First</div>
                <div className={styles.trustDescription}>We never share your resume. You're always in control.</div>
              </div>
            </div>
            <div className={styles.trustCard}>
              <div className={styles.trustIconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className={styles.trustContent}>
                <div className={styles.trustTitle}>Lightning Fast</div>
                <div className={styles.trustDescription}>Fast results: typically under 3 minutes.</div>
              </div>
            </div>
            <div className={styles.trustCard}>
              <div className={styles.trustIconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="2" fill="currentColor"/>
                </svg>
              </div>
              <div className={styles.trustContent}>
                <div className={styles.trustTitle}>Highly Relevant</div>
                <div className={styles.trustDescription}>High-relevance recommendations—skip the noise.</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formColumn}>
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
              Resume {!savedResumeFileName && <span className={styles.required}>*</span>}
              {savedResumeFileName && <span className={styles.optionalLabel}>(Optional - using saved resume)</span>}
            </label>
            {savedResumeFileName && !formData.resumeFile && (
              <div className={styles.savedResumeInfo}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 15l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Using saved resume: <strong>{savedResumeFileName}</strong></span>
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
            <p className={styles.hint}>
              {savedResumeFileName 
                ? "Your saved resume will be used. Upload a new file only if you want to replace it."
                : "Upload your resume in PDF or DOCX format"}
            </p>
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
              <div className={styles.examplesHeader}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span className={styles.examplesTitle}>Need inspiration? Try these examples:</span>
              </div>
              <div className={styles.examplesGrid}>
                <button
                  type="button"
                  className={styles.exampleChip}
                  onClick={() => setFormData({ ...formData, jobIntentText: "Product Manager roles at AI companies in Bangalore" })}
                >
                  Product Manager roles at AI companies in Bangalore
                </button>
                <button
                  type="button"
                  className={styles.exampleChip}
                  onClick={() => setFormData({ ...formData, jobIntentText: "Senior Software Engineer positions in fintech startups, remote preferred" })}
                >
                  Senior Software Engineer positions in fintech startups, remote preferred
                </button>
                <button
                  type="button"
                  className={styles.exampleChip}
                  onClick={() => setFormData({ ...formData, jobIntentText: "Entry-level Data Analyst jobs in Mumbai or Pune, with salary above 8 LPA" })}
                >
                  Entry-level Data Analyst jobs in Mumbai or Pune, with salary above 8 LPA
                </button>
                <button
                  type="button"
                  className={styles.exampleChip}
                  onClick={() => setFormData({ ...formData, jobIntentText: "Marketing Manager in B2B SaaS companies with international exposure" })}
                >
                  Marketing Manager in B2B SaaS companies with international exposure
                </button>
              </div>
            </div>
          </div>

          {/* LinkedIn Search Toggle - DISABLED FOR NOW */}
          {/* Will be re-enabled when LinkedIn integration is stable */}
          {/* 
          <div className={styles.formGroup}>
            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="enableLinkedInSearch"
                name="enableLinkedInSearch"
                checked={formData.enableLinkedInSearch}
                onChange={handleCheckboxChange}
                className={styles.checkbox}
              />
              <label htmlFor="enableLinkedInSearch" className={styles.checkboxLabel}>
                <span className={styles.checkboxTitle}>Enable LinkedIn Job Search</span>
                <span className={styles.checkboxDescription}>
                  Search for jobs on LinkedIn first, then supplement with other sources. Requires LinkedIn cookie to be configured in{" "}
                  <a href="/integrations/linkedin" target="_blank" rel="noopener noreferrer" className={styles.link}>
                    Integrations
                  </a>.
                </span>
              </label>
            </div>
          </div>
          */}
          
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
            ) : isLoggedIn ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Find My Dream Jobs
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Sign up and Find My Dream Jobs
              </>
            )}
          </button>
        </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobMatcher;

