# Setup & Configuration Guide

## 🎯 Quick Start

This guide will help you set up the Fabric App for development and production.

---

## ✅ API Endpoint Configuration

### How to Update the API Endpoint

The application uses a **centralized API configuration** system. To change the API endpoint from the default:

#### Option 1: Using Environment Variables (Recommended)

1. Create a `.env.local` file in the project root:
```bash
cp .env.example .env.local
```

2. Update the file with your actual backend API URL:
```env
VITE_API_URL=https://your-backend-api.com
VITE_API_TIMEOUT=30000
VITE_APP_NAME=The Lev Labs
```

3. Restart your development server:
```bash
npm run dev
```

#### Option 2: Directly Update Configuration File

Edit `src/config/api.js` and change:
```javascript
const API_BASE_URL = "https://your-actual-backend-api.com";
```

#### Current Configuration
- **Default API**: `https://apperal-clothing-app-production.up.railway.app`
- **Configuration File**: `src/config/api.js`
- **Environment Variables**: `.env.local`

---

## 🔐 Authentication Flow

All authentication is now centralized through:
- `src/config/api.js` - Central API endpoint configuration
- `src/features/auth/Login.jsx` - Login page
- `src/features/auth/Signup.jsx` - Signup page
- `src/features/auth/ResetPassword.jsx` - Password reset

### Testing Auth Endpoints

1. **Login** → POST `/api/auth/login`
2. **Signup** → POST `/api/auth/signup`
3. **Reset Password** → POST `/api/auth/forgot-password`

---

## 📱 Responsive Design

The application is fully responsive for:
- **Mobile** (320px and up)
- **Tablet** (640px - 1024px)
- **Desktop** (1024px and above)

### Responsive CSS Files

- `src/styles/global.css` - Global styles
- `src/styles/responsive.css` - Responsive breakpoints and utility classes

### Responsive Tailwind Config

- `tailwind.config.js` - Tailwind CSS configuration with responsive utilities

### Mobile-First Approach

All components are built with mobile-first CSS and Tailwind utilities:

```jsx
// Example responsive padding
<Box sx={{ p: { xs: 1, sm: 2, md: 3, lg: 4 } }} />

// Example responsive grid
<Box sx={{ 
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "2fr 1fr", lg: "3fr 2fr 1fr" },
  gap: { xs: 1, md: 2, lg: 3 }
}} />
```

---

## 🗂️ Hardcoded Data Replacements

### Dashboard (`src/pages/Dashboard/Dashboard.jsx`)

**Before:**
```javascript
"Welcome back, Manju Sheriff"
```

**After:**
```javascript
const [userName, setUserName] = useState("Guest");

useEffect(() => {
  const storedUser = localStorage.getItem("userName");
  if (storedUser) {
    setUserName(storedUser);
  }
}, []);

// Use {userName} in template
```

**Update user data after login:**
```javascript
localStorage.setItem("userName", response.data.user.name);
localStorage.setItem("userEmail", response.data.user.email);
```

### Profile Dashboard (`src/pages/Profile/ProfileDashboard.jsx`)

**Before:**
```javascript
value="123 Grace garden Royapuram, Chennai 10001"
value="12 custom pieces created"
```

**After:**
```javascript
const [userProfile, setUserProfile] = useState({
  address: localStorage.getItem("userAddress") || "Not specified",
  totalDesigns: localStorage.getItem("totalDesigns") || "0",
  // ... other fields
});
```

**Update after fetching from API:**
```javascript
localStorage.setItem("userAddress", userProfile.address);
localStorage.setItem("totalDesigns", userProfile.totalDesigns);
```

---

## 🔗 Routes & Navigation

All routes are configured in `src/router/AppRouter.jsx`:

### Public Routes
- `/` - Home/Style Select
- `/login` - Login page
- `/signup` - Signup page
- `/resetpassword` - Password reset

### Protected Routes (Require Authentication)
- `/dashboard` - User dashboard
- `/profiledashboard` - User profile
- `/editprofile` - Edit profile
- `/customize/*` - All customization pages
- `/saved-designs` - Saved designs
- `/notifications` - Notifications

### Style Selection Routes
- `/shirt` - Shirt styles
- `/pant` - Pant styles
- `/jacket` - Jacket styles
- `/coat` - Coat styles
- `/waistcoat` - Waistcoat styles
- `/tuxedo*` - Tuxedo variations

---

## 📦 Component Structure

```
src/
├── config/
│   └── api.js                 # Centralized API configuration
├── components/
│   ├── layout/
│   │   ├── Header.jsx         # Main header (responsive)
│   │   ├── MainLayout.jsx
│   │   └── PageWrapper.jsx
│   ├── fabric/
│   ├── ui/
│   └── ...
├── features/
│   ├── auth/
│   │   ├── Login.jsx          # Uses API_ENDPOINTS
│   │   ├── Signup.jsx         # Uses API_ENDPOINTS
│   │   └── ResetPassword.jsx  # Uses API_ENDPOINTS
│   ├── customize/
│   ├── finish/
│   └── ...
├── pages/
│   ├── Auth/
│   ├── Dashboard/             # Dynamic user data
│   ├── Profile/
│   └── ...
├── router/
│   └── AppRouter.jsx          # All routes
├── styles/
│   ├── global.css
│   └── responsive.css         # Responsive utilities
└── App.jsx                    # Main app (imports CSS)
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/developereactapp-fz/new-fabric-app.git
cd new-fabric-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment file**
```bash
cp .env.example .env.local
```

4. **Update `.env.local` with your API URL**
```env
VITE_API_URL=https://your-backend-api.com
```

5. **Start development server**
```bash
npm run dev
```

6. **Open in browser**
```
http://localhost:5173
```

---

## 🏗️ Build for Production

```bash
npm run build
```

Output files will be in the `dist/` folder.

### Preview Production Build
```bash
npm run preview
```

---

## 📋 Environment Variables

### Required
- `VITE_API_URL` - Backend API base URL

### Optional
- `VITE_API_TIMEOUT` - Request timeout (default: 30000ms)
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - App version
- `VITE_ENABLE_DEBUG` - Enable debug mode

### Example `.env.local`
```env
VITE_API_URL=https://apparel-api.example.com
VITE_API_TIMEOUT=30000
VITE_APP_NAME=The Lev Labs
VITE_ENABLE_DEBUG=false
```

---

## 🧪 Testing

### Test Authentication

1. Create a test user via signup
2. Login with credentials
3. Check localStorage for tokens
4. Navigate to protected routes

### Test Responsiveness

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test all breakpoints:
   - Mobile: 320px, 375px, 425px
   - Tablet: 768px, 1024px
   - Desktop: 1280px, 1920px

---

## 🐛 Troubleshooting

### API Connection Issues

**Problem:** "Cannot POST /api/auth/login"

**Solution:**
1. Check `VITE_API_URL` in `.env.local`
2. Verify backend server is running
3. Check backend CORS settings
4. Use browser DevTools to inspect network requests

### Hardcoded Data Still Showing

**Problem:** Old user names appear instead of current user

**Solution:**
1. Clear localStorage: `localStorage.clear()`
2. Reload page
3. Login again to populate new data

### Responsive Layout Broken on Mobile

**Problem:** Layout doesn't adjust on mobile

**Solution:**
1. Check viewport meta tag in `index.html`
2. Verify `responsive.css` is imported
3. Use Tailwind responsive classes: `xs:`, `sm:`, `md:`, etc.

### Styles Not Loading

**Problem:** CSS files not applied

**Solution:**
1. Verify CSS files imported in `App.jsx`
2. Clear browser cache
3. Restart dev server: `npm run dev`

---

## 📚 Dependencies

Core dependencies (already installed):

- `react@19.2.4` - UI library
- `react-router-dom@7.14.0` - Routing
- `axios@1.16.1` - HTTP client
- `@mui/material@9.0.1` - Material UI components
- `tailwindcss` - Utility-first CSS
- `react-hook-form@7.76.1` - Form management
- `yup@1.7.1` - Form validation

---

## 🎨 Customization

### Change Primary Color

Update in:
1. `tailwind.config.js` - Color palette
2. `src/styles/global.css` - CSS variables
3. Auth pages - Gradient colors

### Add New API Endpoints

Edit `src/config/api.js`:

```javascript
export const API_ENDPOINTS = {
  // Add new endpoints here
  NEW_ENDPOINT: `${API_BASE_URL}/api/new-path`,
};
```

### Create New Page with Responsive Layout

```jsx
import { Box } from "@mui/material";

export default function NewPage() {
  return (
    <Box sx={{
      p: { xs: 1, sm: 2, md: 3, lg: 4 },      // Responsive padding
      display: "grid",
      gridTemplateColumns: { 
        xs: "1fr",                              // Mobile: 1 column
        md: "2fr 1fr",                          // Tablet+: 2 columns
        lg: "3fr 2fr"                           // Desktop: 3-2 split
      },
      gap: { xs: 1, md: 2 }                     // Responsive gap
    }}>
      Content here
    </Box>
  );
}
```

---

## 📞 Support

For issues or questions:

1. Check this documentation
2. Review `.env.example` for configuration
3. Check browser console for errors
4. Inspect network requests in DevTools

---

## ✨ Summary of Changes

✅ **API Endpoints**: Centralized in `src/config/api.js`
✅ **Hardcoded Data**: Replaced with localStorage and dynamic state
✅ **Responsiveness**: All pages now responsive (mobile, tablet, desktop)
✅ **Header**: Included and functional
✅ **Routes**: All connected and working
✅ **Environment Config**: `.env.local` support for API URL changes
✅ **Tailwind Config**: Added with responsive breakpoints
✅ **Responsive CSS**: Comprehensive utilities in `responsive.css`

---

**Last Updated**: May 2026
