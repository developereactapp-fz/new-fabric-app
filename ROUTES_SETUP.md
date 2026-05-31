# Setup Instructions for New Routes

## ✅ COMPLETED TASKS:
All 8 component files have been successfully copied to your project:

### Dashboard & Main Pages
- ✅ `src/pages/Dashboard/Dashboard.jsx`
- ✅ `src/pages/Summary/CustomSuitSummary.jsx`
- ✅ `src/pages/Notifications/NotificationCenter.jsx`

### Authentication Pages
- ✅ `src/pages/Auth/Login.jsx`
- ✅ `src/pages/Auth/ResetPassword.jsx`
- ✅ `src/pages/Auth/Signup.jsx`

### Profile Pages
- ✅ `src/pages/Profile/ProfileDashboard.jsx`
- ✅ `src/pages/Profile/EditProfile.jsx`

## 📋 NEXT STEPS - YOU MUST DO THIS:

### 1. Check if you have all the required component dependencies
These components import from other component files that you need to verify exist:

**Dashboard.jsx** requires:
- `../../layouts/MainLayout` ✓ (Should already exist)

**ProfileDashboard.jsx** requires:
- `./components/ProfileHeader` ⚠️ (Copy from source)
- `./components/InfoCard` ⚠️ (Copy from source)
- `./components/InfoRow` ⚠️ (Copy from source)
- `./components/PreferenceRow` ⚠️ (Copy from source)
- `./components/RecentOrdersCard` ⚠️ (Copy from source)
- `./components/ServiceCard` ⚠️ (Copy from source)
- `./components/AccountActions` ⚠️ (Copy from source)

**CustomSuitSummary.jsx** requires:
- `./components/SummaryHeader` ⚠️ (Copy from source)
- `./components/GarmentCard` ⚠️ (Copy from source)
- `./components/FabricInfoCard` ⚠️ (Copy from source)
- `./components/InvestmentCard` ⚠️ (Copy from source)
- `./components/FeatureCard` ⚠️ (Copy from source)

**Auth Components** (Login, Signup, ResetPassword) require:
- `../../layouts/AuthLayout` ✓ (Should already exist)

### 2. Ensure your project has these dependencies installed:
```bash
npm install react-router-dom
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install react-hook-form yup @hookform/resolvers
npm install axios
```

### 3. Update your routes file
A template routes file has been created at: `src/app/routes.jsx`
You can use this as a reference or replace your existing routes file.

**If you already have a routes file**, add these imports at the top:
```jsx
import CustomSuitSummary from "../pages/Summary/CustomSuitSummary";
import Dashboard from "../pages/Dashboard/Dashboard";
import NotificationCenter from "../pages/Notifications/NotificationCenter";
import ProfileDashboard from "../pages/Profile/ProfileDashboard";
import EditProfile from "../pages/Profile/EditProfile";
import Login from "../pages/Auth/Login";
import ResetPassword from "../pages/Auth/ResetPassword";
import Signup from "../pages/Auth/Signup";
```

**Then add these routes:**
```jsx
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/customsuitsummary" element={<CustomSuitSummary />} />
<Route path="/notifications" element={<NotificationCenter />} />

{/* Auth */}
<Route path="/login" element={<Login />} />
<Route path="/resetpassword" element={<ResetPassword />} />
<Route path="/signup" element={<Signup />} />

{/* Profile */}
<Route path="/profiledashboard" element={<ProfileDashboard />} />
<Route path="/editprofile" element={<EditProfile />} />
```

### 4. Update API endpoint
The Auth components use this API endpoint:
```
https://apperal-clothing-app.onrender.com
```

**To change it**, edit these files and replace the `API` variable:
- `src/pages/Auth/Login.jsx` (line 27)
- `src/pages/Auth/ResetPassword.jsx` (line 24)
- `src/pages/Auth/Signup.jsx` (line 38)

### 5. Copy missing sub-components
You need to copy all the sub-components from the original project:
- `src/pages/Profile/components/` → Copy all files
- `src/pages/Summary/components/` → Copy all files
- `src/layouts/MainLayout.jsx` → Verify it exists
- `src/layouts/AuthLayout.jsx` → Verify it exists

### 6. Test the routes
Visit these URLs to verify everything works:
- `/login` - Login page
- `/signup` - Signup page
- `/resetpassword` - Password reset
- `/dashboard` - Dashboard
- `/notifications` - Notifications
- `/profiledashboard` - User profile
- `/editprofile` - Edit profile
- `/customsuitsummary` - Custom suit summary

## 🚨 IMPORTANT NOTES:
1. The auth pages make API calls - ensure your backend is running
2. Some components depend on sub-components that weren't included - copy them from the source project
3. The theme/styling depends on MUI - make sure it's properly configured
4. LocalStorage is used to store auth tokens - this is already integrated
5. The layouts (MainLayout, AuthLayout) need to exist or these components will break

## Questions?
If you run into import errors, it's usually because:
- Sub-components are missing (need to copy from source project)
- Layouts are missing or have different paths
- Dependencies aren't installed
