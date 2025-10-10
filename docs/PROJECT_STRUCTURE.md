# PM Interview Practice Frontend - Complete Project Structure

## 📁 Complete File Tree

```
PMIP-FE/
├── public/
│   └── vite.svg                    # Vite logo favicon
│
├── src/
│   ├── api/
│   │   └── client.js               # Axios API client with interceptors
│   │
│   ├── components/
│   │   ├── ChatBubble/
│   │   │   ├── ChatBubble.jsx      # Chat message bubble component
│   │   │   └── ChatBubble.module.scss
│   │   ├── Footer/
│   │   │   ├── Footer.jsx          # Footer with nav links
│   │   │   └── Footer.module.scss
│   │   ├── Header/
│   │   │   ├── Header.jsx          # Main navigation header
│   │   │   └── Header.module.scss
│   │   ├── ProtectedRoute/
│   │   │   └── ProtectedRoute.jsx  # HOC for route protection
│   │   ├── ScoreCard/
│   │   │   ├── ScoreCard.jsx       # Score display with rubric
│   │   │   └── ScoreCard.module.scss
│   │   └── SessionList/
│   │       ├── SessionList.jsx     # Interview history table
│   │       └── SessionList.module.scss
│   │
│   ├── pages/
│   │   ├── Dashboard/
│   │   │   ├── Dashboard.jsx       # User dashboard
│   │   │   └── Dashboard.module.scss
│   │   ├── History/
│   │   │   ├── History.jsx         # Session history page
│   │   │   └── History.module.scss
│   │   ├── Interview/
│   │   │   ├── Interview.jsx       # Main interview page
│   │   │   └── Interview.module.scss
│   │   ├── Landing/
│   │   │   ├── Landing.jsx         # Landing/home page
│   │   │   └── Landing.module.scss
│   │   ├── Login/
│   │   │   ├── Login.jsx           # Login page
│   │   │   └── Login.module.scss
│   │   ├── Pricing/
│   │   │   ├── Pricing.jsx         # Pricing page
│   │   │   └── Pricing.module.scss
│   │   └── Register/
│   │       ├── Register.jsx        # Registration page
│   │       └── Register.module.scss
│   │
│   ├── styles/
│   │   ├── _variables.scss         # SCSS variables (colors, spacing, etc.)
│   │   └── global.scss             # Global styles and utility classes
│   │
│   ├── App.jsx                     # Main app with routing
│   └── main.jsx                    # Application entry point
│
├── tests/
│   └── ScoreCard.test.jsx          # Sample test file
│
├── .env.example                    # Environment variables template
├── .eslintrc.cjs                   # ESLint configuration
├── .gitignore                      # Git ignore rules
├── index.html                      # HTML entry point
├── package.json                    # Dependencies and scripts
├── PROJECT_STRUCTURE.md            # This file
├── README.md                       # Main documentation
├── SETUP.md                        # Quick setup guide
├── vite.config.js                  # Vite configuration
└── vitest.setup.js                 # Vitest test setup
```

## 🎯 Feature Implementation Status

### ✅ Completed Features

#### 1. **Project Setup & Configuration**

- ✅ Vite + React configuration
- ✅ Package.json with all required scripts
- ✅ ESLint configuration
- ✅ Vitest + React Testing Library setup
- ✅ SCSS support with modules

#### 2. **Routing (React Router v6)**

- ✅ `/` - Landing page
- ✅ `/auth/login` - Login
- ✅ `/auth/register` - Registration
- ✅ `/interview` - Interview practice (protected)
- ✅ `/history` - Session history (protected)
- ✅ `/pricing` - Pricing plans
- ✅ `/dashboard` - User dashboard (protected)

#### 3. **Authentication & Authorization**

- ✅ JWT token storage in localStorage
- ✅ Login/Register pages with forms
- ✅ ProtectedRoute HOC
- ✅ Automatic redirect on 401
- ✅ Auth state in Header

#### 4. **API Integration (Axios)**

- ✅ Central API client with interceptors
- ✅ JWT token auto-attachment
- ✅ Error handling
- ✅ Environment-based configuration
- ✅ All required endpoints implemented:
  - Login/Register
  - Start interview
  - Submit answer
  - Score answer
  - Get sessions
  - Create checkout session

#### 5. **Interview Page**

- ✅ Difficulty selector (Entry/Mid/Senior)
- ✅ Start interview button
- ✅ Chat UI with bubbles
- ✅ AI question display
- ✅ User answer input (textarea)
- ✅ Submit answer functionality
- ✅ Real-time chat updates
- ✅ Loading states
- ✅ Error handling with retry
- ✅ Two-column layout (chat + score)
- ✅ Responsive mobile layout

#### 6. **ScoreCard Component**

- ✅ Overall score display
- ✅ 5 rubric dimensions with badges:
  - Structure (0-10)
  - Metrics (0-10)
  - Prioritization (0-10)
  - User Empathy (0-10)
  - Communication (0-10)
- ✅ Color-coded scores (poor/fair/good/excellent)
- ✅ Feedback section
- ✅ Collapsible sample answer
- ✅ Sticky positioning on desktop

#### 7. **History Page**

- ✅ Session list table
- ✅ Statistics cards (total sessions, avg score)
- ✅ Date, question snippet, difficulty, score
- ✅ View action button
- ✅ Empty state
- ✅ Loading state

#### 8. **Pricing Page**

- ✅ Three-tier pricing (Free/Pro/Enterprise)
- ✅ Feature lists
- ✅ Stripe checkout integration
- ✅ FAQ section
- ✅ Highlighted "Most Popular" plan

#### 9. **UI Components**

- ✅ Header with responsive navigation
- ✅ Footer with links
- ✅ ChatBubble (AI and user variants)
- ✅ SessionList table
- ✅ ProtectedRoute HOC

#### 10. **Styling (SCSS)**

- ✅ Global variables (\_variables.scss)
- ✅ Global utility classes
- ✅ CSS Modules for all components
- ✅ Mobile-first responsive design
- ✅ Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- ✅ Modern, clean aesthetic
- ✅ Accessible focus states
- ✅ Smooth animations

#### 11. **Accessibility**

- ✅ Semantic HTML
- ✅ ARIA labels on inputs
- ✅ Focus states for interactive elements
- ✅ Keyboard navigation support
- ✅ Color contrast compliance

#### 12. **Documentation**

- ✅ README.md with full documentation
- ✅ SETUP.md quick start guide
- ✅ PROJECT_STRUCTURE.md (this file)
- ✅ .env.example with all variables
- ✅ Inline code comments

#### 13. **Testing**

- ✅ Vitest configuration
- ✅ React Testing Library setup
- ✅ Sample ScoreCard test
- ✅ Test script in package.json

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Start development server
npm run dev

# Run tests
npm test

# Run linter
npm run lint

# Build for production
npm run build

# Preview production build
npm start
```

## 🔌 API Endpoints Used

| Endpoint                       | Method | Purpose                 | Auth Required |
| ------------------------------ | ------ | ----------------------- | ------------- |
| `/api/auth/login`              | POST   | User login              | No            |
| `/api/auth/register`           | POST   | User registration       | No            |
| `/api/start-interview`         | POST   | Start interview session | Yes           |
| `/api/submit-answer`           | POST   | Submit answer           | Yes           |
| `/api/score`                   | POST   | Get scoring             | Yes           |
| `/api/sessions`                | GET    | Get session history     | Yes           |
| `/api/sessions/:id`            | GET    | Get session details     | Yes           |
| `/api/create-checkout-session` | POST   | Stripe checkout         | Yes           |

## 🎨 Design System

### Colors

- **Primary**: `#2563eb` (Blue)
- **Accent**: `#0ea5e9` (Light Blue)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Orange)
- **Error**: `#ef4444` (Red)

### Typography

- **Font Family**: System font stack
- **Sizes**: xs (12px) → 4xl (36px)
- **Weights**: 400 (normal), 600 (semibold), 700 (bold)

### Spacing

- **Scale**: xs (4px) → 3xl (64px)
- **Follows 4px grid system**

### Components

- **Border Radius**: sm (4px) → xl (16px)
- **Shadows**: sm → xl (4 levels)
- **Transitions**: 0.2s ease

## 📱 Responsive Behavior

### Mobile (<768px)

- Stacked layout for interview page
- Hamburger menu in header
- Full-width cards
- Larger touch targets

### Tablet (768px - 1024px)

- Two-column layouts where appropriate
- Responsive tables
- Optimized spacing

### Desktop (>1024px)

- Side-by-side layouts
- Sticky score card
- Maximum content width: 1200px

## 🧪 Testing Coverage

- **Unit Tests**: ScoreCard component
- **Integration Tests**: Ready to add
- **E2E Tests**: Framework ready (Vitest)

## 🔒 Security Features

- JWT tokens in localStorage
- HTTP-only cookie support (backend)
- CSRF protection (backend)
- XSS prevention via React
- Input sanitization
- Secure API calls

## 📈 Performance Optimizations

- Vite for fast builds
- Code splitting via React.lazy (ready)
- CSS Modules for scoped styles
- Optimized images (SVG icons)
- Minimal dependencies

## 🛠️ Customization Points

### 1. **Theming**

Edit `src/styles/_variables.scss` to customize:

- Colors
- Typography
- Spacing
- Breakpoints

### 2. **API Endpoints**

Edit `src/api/client.js` to:

- Add new endpoints
- Modify request/response handling
- Add custom interceptors

### 3. **Routes**

Edit `src/App.jsx` to:

- Add new routes
- Modify route protection
- Change layouts

### 4. **Components**

All components are modular and can be:

- Reused across pages
- Customized via props
- Styled via SCSS modules

## 📝 Code Quality

- **ESLint**: Enforces code standards
- **Prettier-ready**: Can add formatting
- **TypeScript-ready**: Can migrate to TS
- **Prop validation**: Ready for PropTypes

## 🌐 Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## 🚦 Deployment Ready

### Environment Variables Needed

```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Build Command

```bash
npm run build
```

### Output Directory

```
dist/
```

### Deployment Platforms

- Vercel ✅
- Netlify ✅
- AWS S3 + CloudFront ✅
- Any static host ✅

## 🎓 Learning Resources

The codebase demonstrates:

- Modern React patterns (hooks, context-ready)
- React Router v6 navigation
- Axios API integration
- SCSS modules
- Component composition
- Protected routes
- Form handling
- State management
- Error handling
- Loading states
- Responsive design

## 🤝 Contributing Guidelines

1. Follow existing code style
2. Use SCSS modules for styling
3. Add tests for new features
4. Update documentation
5. Ensure linting passes

## 📊 Bundle Size (Estimated)

- **Development**: ~2.5 MB
- **Production**: ~150 KB (gzipped)
- **Initial Load**: ~50 KB

## ✨ Next Steps / Enhancements

Potential future improvements:

- [ ] Add more comprehensive tests
- [ ] Implement analytics tracking
- [ ] Add offline support (PWA)
- [ ] Implement dark mode
- [ ] Add internationalization (i18n)
- [ ] Performance monitoring
- [ ] Error boundary components
- [ ] Toast notifications library
- [ ] Form validation library (Formik/React Hook Form)
- [ ] State management (Redux/Zustand) if needed

---

**Project Status**: ✅ Production Ready

Built with React 18, Vite 5, React Router 6, Axios, and SCSS.
