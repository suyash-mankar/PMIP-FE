# Quick Reference Card

## 🚀 Common Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm start            # Preview production build

# Quality
npm run lint         # Run ESLint
npm test             # Run tests

# Setup
npm install          # Install dependencies
cp .env.example .env # Create environment file
```

## 📁 Key Files & Locations

| What                   | Where                               |
| ---------------------- | ----------------------------------- |
| **API calls**          | `src/api/client.js`                 |
| **Routes**             | `src/App.jsx`                       |
| **Global styles**      | `src/styles/global.scss`            |
| **Theme variables**    | `src/styles/_variables.scss`        |
| **Protected routes**   | `src/components/ProtectedRoute/`    |
| **Environment config** | `.env` (create from `.env.example`) |

## 🎨 Styling Quick Tips

```scss
// Use global utility classes
<button className="btn btn-primary btn-lg">Click Me</button>

// Or use module styles
import styles from './Component.module.scss'
<div className={styles.myClass}>Content</div>

// Access theme variables
@import '../../styles/variables';
.myElement {
  color: $primary-color;
  padding: $spacing-md;
}
```

## 🔌 API Client Usage

```javascript
import { login, startInterview, getSessions } from "../api/client";

// Auth
const response = await login(email, password);
localStorage.setItem("jwt_token", response.data.token);

// Interview
const { data } = await startInterview("Mid");
const sessionId = data.session_id;

// History
const sessions = await getSessions();
```

## 🛣️ Adding a New Page

1. Create page component: `src/pages/MyPage/MyPage.jsx`
2. Create styles: `src/pages/MyPage/MyPage.module.scss`
3. Add route in `src/App.jsx`:

```jsx
import MyPage from "./pages/MyPage/MyPage";
// ...
<Route path="/mypage" element={<MyPage />} />;
```

## 🔒 Making a Route Protected

```jsx
<Route
  path="/protected"
  element={
    <ProtectedRoute>
      <YourPage />
    </ProtectedRoute>
  }
/>
```

## 🧩 Component Patterns

### Functional Component

```jsx
import styles from "./Component.module.scss";

function Component({ prop1, prop2 }) {
  return <div className={styles.container}>{prop1}</div>;
}

export default Component;
```

### With State

```jsx
import { useState, useEffect } from "react";

function Component() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // API call
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;
  return <div>{/* content */}</div>;
}
```

## 🎯 ScoreCard Props

```jsx
<ScoreCard
  scores={{
    structure: 8,
    metrics: 7,
    prioritization: 9,
    user_empathy: 6,
    communication: 8,
    feedback: "Your feedback text",
    sample_answer: "Sample answer text",
  }}
/>
```

## 📱 Responsive Breakpoints

```scss
@import "../../styles/variables";

.element {
  // Mobile first (default)
  padding: $spacing-sm;

  // Tablet and up
  @media (min-width: $breakpoint-md) {
    padding: $spacing-lg;
  }

  // Desktop and up
  @media (min-width: $breakpoint-lg) {
    padding: $spacing-xl;
  }
}
```

## 🎨 Color Classes

```scss
// Text colors
color: $text-primary; // Dark text
color: $text-secondary; // Gray text
color: $text-light; // Light gray

// Background colors
background: $bg-primary; // White
background: $bg-secondary; // Light gray
background: $bg-tertiary; // Medium gray

// Brand colors
color: $primary-color; // Blue
color: $accent-color; // Light blue
color: $success-color; // Green
color: $warning-color; // Orange
color: $error-color; // Red
```

## 📦 Button Classes

```jsx
// Primary button
<button className="btn btn-primary">Primary</button>

// Secondary button
<button className="btn btn-secondary">Secondary</button>

// Outline button
<button className="btn btn-outline">Outline</button>

// Large button
<button className="btn btn-primary btn-lg">Large</button>
```

## 🔐 Auth Flow

```javascript
// Login
const { data } = await login(email, password);
localStorage.setItem("jwt_token", data.token);
localStorage.setItem("user_email", data.user.email);
window.location.href = "/interview";

// Logout
localStorage.removeItem("jwt_token");
localStorage.removeItem("user_email");
navigate("/auth/login");

// Check auth
const token = localStorage.getItem("jwt_token");
const isLoggedIn = !!token;
```

## 🧪 Writing Tests

```javascript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Component from "./Component";

describe("Component", () => {
  it("renders correctly", () => {
    render(<Component />);
    expect(screen.getByText("Hello")).toBeTruthy();
  });
});
```

## 🐛 Debugging Tips

```javascript
// API errors
console.error("API Error:", error.response?.data);

// Component rendering
console.log("Component rendered:", { prop1, prop2 });

// State updates
useEffect(() => {
  console.log("State changed:", state);
}, [state]);
```

## 🌐 Environment Variables

```bash
# .env file
VITE_API_BASE_URL=http://localhost:4000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Access in code
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

## 🚨 Common Issues & Fixes

| Issue                     | Solution                                                 |
| ------------------------- | -------------------------------------------------------- |
| **Module not found**      | `rm -rf node_modules && npm install`                     |
| **Port in use**           | Change port in `vite.config.js` or kill process on 3000  |
| **API connection failed** | Check `.env` has correct `VITE_API_BASE_URL`             |
| **401 errors**            | Check JWT token in localStorage, may need to login again |
| **Styles not applying**   | Restart dev server, check import path                    |
| **CORS errors**           | Backend needs CORS headers for frontend origin           |

## 📚 File Naming Conventions

- Components: `PascalCase.jsx` (e.g., `ScoreCard.jsx`)
- Styles: `PascalCase.module.scss` (e.g., `ScoreCard.module.scss`)
- Utilities: `camelCase.js` (e.g., `apiClient.js`)
- Pages: `PascalCase.jsx` in `PascalCase/` folder

## 🎁 Utility Classes Reference

```html
<!-- Layout -->
<div class="container">Centered content, max-width 1200px</div>

<!-- Cards -->
<div class="card">Card with padding and shadow</div>

<!-- Forms -->
<input class="input" />
<select class="select"></select>
<textarea class="textarea"></textarea>
<label class="label">Label text</label>

<!-- Messages -->
<div class="error-message">Error text</div>
<div class="success-message">Success text</div>

<!-- Loading -->
<div class="loading">
  <div class="spinner"></div>
  <span>Loading...</span>
</div>
```

## 📞 Need Help?

- Check `README.md` for detailed docs
- Check `SETUP.md` for setup issues
- Check `PROJECT_STRUCTURE.md` for architecture
- Look at existing components for patterns
- Console.log is your friend!

---

**Happy Coding! 🚀**
