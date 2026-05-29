# 🎯 The Lev Labs - Fabric Customization App

A modern, fully responsive web application for premium custom suit design and customization. Built with React, Vite, Tailwind CSS, and Material-UI.

---

## ✨ Key Features

✅ **Fully Responsive Design** - Mobile, Tablet, and Desktop optimized
✅ **Centralized API Configuration** - Easy endpoint updates
✅ **Dynamic User Data** - No hardcoded user information
✅ **Comprehensive Authentication** - Login, Signup, Password Reset
✅ **Custom Suit Design** - Interactive customization pages
✅ **Design Saved Locally** - Browser storage for designs
✅ **Professional UI** - Material-UI + Tailwind CSS
✅ **Production Ready** - Environment-based configuration

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Installation

```bash
# Clone repository
git clone https://github.com/developereactapp-fz/new-fabric-app.git
cd new-fabric-app

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update .env.local with your API URL
# VITE_API_URL=https://your-backend-api.com

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 📋 API Configuration

### Update Backend API Endpoint

#### Method 1: Environment Variables (Recommended)

1. Create/Edit `.env.local`:
```env
VITE_API_URL=https://your-actual-backend-api.com
VITE_API_TIMEOUT=30000
VITE_ENABLE_DEBUG=false
```

2. Restart dev server

#### Method 2: Edit Configuration File

Edit `src/config/api.js`:
```javascript
const API_BASE_URL = "https://your-backend-api.com";
```

### Available API Endpoints

All endpoints are configured in `src/config/api.js`:

**Authentication:**
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - Create account
- `POST /api/auth/forgot-password` - Reset password
- `POST /api/auth/verify-email` - Verify email

**User Profile:**
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile

**Designs:**
- `GET /api/designs` - Get all designs
- `POST /api/designs` - Save design
- `GET /api/designs/:id` - Get design by ID
- `PUT /api/designs/:id` - Update design
- `DELETE /api/designs/:id` - Delete design

---

## 📱 Responsive Design

### Device Support

- **Mobile**: 320px - 639px (iPhone, Android phones)
- **Tablet**: 640px - 1023px (iPad, tablets)
- **Desktop**: 1024px+ (laptops, desktops)

### Responsive Utilities

Use Tailwind classes or Material-UI sx prop:

```jsx
// Tailwind approach
<div className="p-4 md:p-6 lg:p-8">
  <h1 className="text-2xl md:text-3xl lg:text-4xl">
    Responsive Title
  </h1>
</div>

// Material-UI approach
<Box sx={{
  p: { xs: 1, sm: 2, md: 3, lg: 4 },
  fontSize: { xs: '1.25rem', md: '1.5rem', lg: '2rem' }
}}>
  Responsive Content
</Box>
```

### CSS Breakpoints

- `xs`: 320px (extra small)
- `sm`: 640px (small)
- `md`: 768px (medium)
- `lg`: 1024px (large)
- `xl`: 1280px (extra large)
- `2xl`: 1536px (2x extra large)

---

## 👤 User Data Management

### Storing User Information

After authentication, store user data:

```javascript
import { saveUserProfile, saveAuthToken } from './utils/storage';

// After successful login
saveAuthToken(response.data.token);
saveUserProfile({
  name: response.data.user.name,
  email: response.data.user.email,
  address: response.data.user.address,
});
```

### Retrieving User Information

```javascript
import { getUserName, getUserProfile, getAuthToken } from './utils/storage';

const userName = getUserName(); // Gets name from storage
const profile = getUserProfile(); // Gets full profile
const token = getAuthToken(); // Gets auth token
```

### Example: Dynamic Dashboard

```jsx
import { useState, useEffect } from 'react';
import { getUserName } from '../utils/storage';

export default function Dashboard() {
  const [userName, setUserName] = useState('Guest');

  useEffect(() => {
    setUserName(getUserName());
  }, []);

  return <h1>Welcome, {userName}!</h1>;
}
```

---

## 🗂️ Project Structure

```
src/
├── config/
│   └── api.js                    # ⭐ Centralized API config
├── utils/
│   ├── storage.js                # ⭐ LocalStorage utilities
│   └── httpClient.js             # ⭐ Axios interceptors
├── components/
│   ├── layout/
│   │   ├── Header.jsx            # Main header
│   │   ├── MainLayout.jsx
│   │   └── PageWrapper.jsx
│   ├── fabric/
│   ├── ui/
│   └── ...
├── features/
│   ├── auth/
│   │   ├── Login.jsx             # ✅ Uses centralized API
│   │   ├── Signup.jsx            # ✅ Uses centralized API
│   │   └── ResetPassword.jsx     # ✅ Uses centralized API
│   ├── customize/
│   ├── finish/
│   └── ...
├── pages/
│   ├── Dashboard/                # ✅ Dynamic user data
│   ├── Profile/                  # ✅ Dynamic user data
│   └── ...
├── router/
│   └── AppRouter.jsx             # All routes configured
├── styles/
│   ├── global.css                # Global styles
│   └── responsive.css            # ⭐ Responsive utilities
└── App.jsx
```

### ⭐ = Files with major updates

---

## 🔐 Authentication Flow

1. **Login/Signup**: User submits credentials
2. **API Call**: Request sent to `VITE_API_URL/api/auth/login`
3. **Token Storage**: Response token stored in localStorage
4. **Auto Headers**: Token automatically added to all API requests
5. **Token Expiry**: 401 responses trigger logout & redirect to login

### HTTP Client Usage

```javascript
import { post, get } from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';

// Make authenticated requests (token added automatically)
const loginUser = async (email, password) => {
  const response = await post(API_ENDPOINTS.LOGIN, {
    email,
    password,
    tenantSlug: 'test-tenant'
  });
  return response;
};

// GET request
const getUserProfile = async () => {
  return await get(API_ENDPOINTS.GET_PROFILE);
};
```

---

## 🎨 Customization

### Change Theme Colors

#### Using Tailwind Config

Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your colors here
      }
    }
  }
}
```

#### Using CSS Variables

Edit `src/styles/global.css`:
```css
:root {
  --primary: #7a3f43;
  --accent: #c95a93;
  --text-primary: #1f2937;
}
```

### Add New Pages

1. Create component in `src/pages/` or `src/features/`
2. Add route to `src/router/AppRouter.jsx`
3. Use responsive classes from `responsive.css`

### Add New API Endpoints

Edit `src/config/api.js`:
```javascript
export const API_ENDPOINTS = {
  NEW_ENDPOINT: `${API_BASE_URL}/api/new-path`,
};
```

Use in components:
```javascript
import { post } from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';

const response = await post(API_ENDPOINTS.NEW_ENDPOINT, data);
```

---

## 📦 Dependencies

**Core:**
- `react@19.2.4` - React framework
- `react-dom@19.2.4` - React DOM
- `react-router-dom@7.14.0` - Routing
- `vite` - Build tool

**API & Forms:**
- `axios@1.16.1` - HTTP client
- `react-hook-form@7.76.1` - Form management
- `yup@1.7.1` - Schema validation

**UI & Styling:**
- `@mui/material@9.0.1` - Material Design components
- `@mui/icons-material@9.0.1` - Material Icons
- `tailwindcss` - Utility-first CSS
- `tailwindcss-animate` - Tailwind animations

**Utilities:**
- `clsx@2.1.1` - Conditional classnames
- `react-zoom-pan-pinch@4.0.3` - Zoom/pan library
- `html2canvas@1.4.1` - HTML to canvas
- `lucide-react@1.8.0` - Icon library

---

## 🏗️ Build & Deploy

### Development

```bash
npm run dev
```

Open `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Output: `dist/` folder

### Preview Production Build

```bash
npm run preview
```

### Deployment

Deploy the `dist/` folder to:
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- Firebase Hosting
- Any static hosting service

---

## 📋 Routing

### Public Routes
- `/` - Home / Style Selection
- `/login` - Login
- `/signup` - Signup
- `/resetpassword` - Password Reset

### Protected Routes
- `/dashboard` - User Dashboard
- `/profiledashboard` - User Profile
- `/editprofile` - Edit Profile
- `/customize/*` - Customization Pages
- `/saved-designs` - Saved Designs
- `/notifications` - Notifications

### Style Selection
- `/shirt` - Shirt styles
- `/pant` - Pant styles
- `/jacket` - Jacket styles
- `/coat` - Coat styles
- `/waistcoat` - Waistcoat styles
- `/tuxedo*` - Tuxedo variations

---

## 🧪 Testing

### Test Responsive Design

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test breakpoints: 320px, 768px, 1024px, 1920px

### Test API Endpoints

1. Check Network tab in DevTools
2. Look for API calls
3. Verify status codes and responses

### Test Authentication

1. Sign up new account
2. Login with credentials
3. Check localStorage for tokens
4. Navigate to protected routes
5. Test logout

---

## 🐛 Troubleshooting

### API Connection Failed

**Problem:** "Cannot POST /api/auth/login"

**Solution:**
1. Verify `VITE_API_URL` in `.env.local`
2. Ensure backend is running
3. Check CORS settings on backend
4. Inspect network requests in DevTools

### Styles Not Loading

**Problem:** CSS not applied to components

**Solution:**
```bash
# Clear cache and restart
rm -rf node_modules
npm install
npm run dev
```

### Hardcoded Data Showing

**Problem:** Old user names instead of current user

**Solution:**
```javascript
// Clear storage
localStorage.clear();
// Login again
```

### Mobile Layout Broken

**Problem:** Layout doesn't respond to screen size

**Solution:**
1. Check viewport meta tag in `index.html`
2. Verify responsive CSS imported
3. Use sx prop for Material-UI components
4. Use Tailwind responsive classes

---

## 📚 Resources

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Material-UI](https://mui.com)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)

---

## 📝 Environment Variables

Create `.env.local` in project root:

```env
# Required
VITE_API_URL=https://your-backend-api.com

# Optional
VITE_API_TIMEOUT=30000
VITE_APP_NAME=The Lev Labs
VITE_ENABLE_DEBUG=false
VITE_TENANT_SLUG=test-tenant
```

---

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test responsiveness
4. Commit with clear messages
5. Push and create PR

---

## 📄 License

MIT License - Feel free to use this project

---

## 🎯 Summary of Updates

✅ Centralized API configuration in `src/config/api.js`
✅ Removed hardcoded user data from components
✅ Added dynamic user data management with localStorage
✅ Comprehensive responsive design for all devices
✅ Created reusable utilities: `storage.js`, `httpClient.js`
✅ Environment-based configuration with `.env.local`
✅ Added Tailwind CSS config for responsive breakpoints
✅ Created comprehensive CSS utilities in `responsive.css`
✅ All routes connected and functional
✅ Header component properly configured
✅ Setup guide for easy configuration

---

**Last Updated**: May 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
