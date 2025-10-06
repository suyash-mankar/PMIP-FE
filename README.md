# PM Interview Practice - Frontend

A React-based frontend application for practicing product management interview questions with AI-powered feedback and scoring.

## 🚀 Features

- **Interactive Interview Practice**: Practice PM interview questions at Entry, Mid, and Senior levels
- **AI-Powered Feedback**: Get detailed scoring across 5 key dimensions:
  - Structure
  - Metrics
  - Prioritization
  - User Empathy
  - Communication
- **Session History**: Track your progress over time with detailed session history
- **Responsive Design**: Mobile-first design that works on all devices
- **Secure Authentication**: JWT-based authentication with protected routes
- **Modern UI**: Clean, accessible interface with SCSS modules

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Backend API running (see API endpoints below)

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
# Navigate to the project directory
cd PMIP-FE

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and configure your environment variables:

```env
VITE_API_BASE_URL=http://localhost:4000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
```

### 3. Run the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

### 5. Preview Production Build

```bash
npm start
```

## 📜 Available Scripts

- `npm run dev` - Start development server (Vite)
- `npm run build` - Build for production
- `npm start` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests with Vitest

## 🏗️ Project Structure

```
PMIP-FE/
├── src/
│   ├── api/
│   │   └── client.js           # Axios API client with auth interceptors
│   ├── components/
│   │   ├── Header/             # Navigation header
│   │   ├── Footer/             # Footer component
│   │   ├── ProtectedRoute/     # HOC for protected routes
│   │   ├── ChatBubble/         # Chat message bubble
│   │   ├── ScoreCard/          # Score display component
│   │   └── SessionList/        # History table component
│   ├── pages/
│   │   ├── Landing/            # Landing page
│   │   ├── Login/              # Login page
│   │   ├── Register/           # Registration page
│   │   ├── Interview/          # Main interview page
│   │   ├── History/            # Session history page
│   │   ├── Pricing/            # Pricing page
│   │   └── Dashboard/          # User dashboard
│   ├── styles/
│   │   ├── _variables.scss     # SCSS variables (colors, spacing, etc.)
│   │   └── global.scss         # Global styles and utilities
│   ├── App.jsx                 # Main app component with routing
│   └── main.jsx                # Application entry point
├── tests/
│   └── ScoreCard.test.jsx      # Sample test file
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── .eslintrc.cjs               # ESLint configuration
└── README.md                   # This file
```

## 🔌 API Integration

The frontend expects the following backend API endpoints:

### Authentication

- `POST /api/auth/login` - User login

  - Request: `{ email, password }`
  - Response: `{ token, user }`

- `POST /api/auth/register` - User registration
  - Request: `{ email, password }`
  - Response: `{ token, user }`

### Interview

- `POST /api/start-interview` - Start a new interview session

  - Request: `{ difficulty: "Entry" | "Mid" | "Senior" }`
  - Response: `{ session_id, question }`

- `POST /api/submit-answer` - Submit an answer

  - Request: `{ session_id, answer }`
  - Response: `{ success: true }`

- `POST /api/score` - Get scoring for submitted answer
  - Request: `{ session_id }`
  - Response: `{ scores: { structure, metrics, prioritization, user_empathy, communication, feedback, sample_answer } }`

### Sessions

- `GET /api/sessions` - Get user's session history

  - Response: `{ sessions: [...] }`

- `GET /api/sessions/:id` - Get specific session details
  - Response: `{ session: {...} }`

### Payments

- `POST /api/create-checkout-session` - Create Stripe checkout session
  - Request: `{ price_id }`
  - Response: `{ checkout_url }`

## 🎨 Styling

The project uses SCSS with CSS Modules for component-specific styles:

- **Global Styles**: `src/styles/global.scss`
- **Variables**: `src/styles/_variables.scss` (colors, spacing, breakpoints)
- **Component Styles**: Each component has its own `.module.scss` file

### Responsive Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 🧪 Testing

The project uses Vitest and React Testing Library for testing:

```bash
npm test
```

Example test location: `tests/ScoreCard.test.jsx`

## 🔒 Authentication

The app uses JWT authentication:

1. User logs in via `/auth/login`
2. JWT token is stored in `localStorage`
3. API client attaches token to all requests
4. Protected routes redirect to login if no token
5. 401 responses automatically trigger logout

## 🚦 Routes

- `/` - Landing page
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/interview` - Interview practice (protected)
- `/history` - Session history (protected)
- `/pricing` - Pricing plans
- `/dashboard` - User dashboard (protected)

## 🎯 Key Features Implementation

### Interview Flow

1. Select difficulty level (Entry/Mid/Senior)
2. Click "Start Interview" to get a question
3. Type your answer in the text area
4. Submit answer for scoring
5. View detailed feedback in the ScoreCard

### Score Card

- Shows overall score (average of 5 dimensions)
- Individual scores with color-coded badges
- Detailed feedback
- Collapsible sample answer

### Session History

- Table view of all past interviews
- Date, question, difficulty, and score
- Quick view action for details

## 🔧 Troubleshooting

### API Connection Issues

- Verify `VITE_API_BASE_URL` is set correctly in `.env`
- Ensure backend server is running
- Check browser console for CORS errors

### Build Issues

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

### Authentication Issues

- Check browser localStorage for `jwt_token`
- Verify token is being sent in request headers
- Check backend JWT validation

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run linting: `npm run lint`
4. Test your changes
5. Submit a pull request

## 📝 Sample Login Flow

For development/testing, you can use the login form with credentials that match your backend test users.

Example flow:

1. Go to `/auth/register`
2. Create account with email/password
3. Upon successful registration, you'll be redirected to `/interview`
4. JWT token is stored in localStorage
5. Start practicing!

## 🌐 Environment Variables

| Variable                      | Description                           | Example                 |
| ----------------------------- | ------------------------------------- | ----------------------- |
| `VITE_API_BASE_URL`           | Backend API base URL                  | `http://localhost:4000` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (for payments) | `pk_test_...`           |

## 📄 License

This project is licensed under the MIT License.

## 💬 Support

For issues or questions:

- Email: support@pminterviewpractice.com
- GitHub Issues: [Create an issue](https://github.com/your-repo/issues)

---

Built with ❤️ using React, Vite, and SCSS
