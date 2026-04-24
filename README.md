# Fabric Customization App

A modern, interactive garment customization platform built with React and Vite. This application allows users to design custom clothing including shirts, pants, jackets, coats, and formal wear with real-time visual previews.

## Features

### Style Selection
- **Shirt Customization**: Choose from various collar styles, cuffs, plackets, and fabrics
- **Tuxedo Options**: Formal wear with wing-tip collars, pique bibs, and cufflinks
- **Pants & Tuxedo Pants**: Slim fit, pleat options, and satin stripes
- **Jackets & Tuxedo Jackets**: Lapel styles, buttons, vents, and pocket configurations
- **Coats**: Single-breasted classic styles
- **Waistcoats**: V-neck formal styles with adjustable straps

### Customization Features
- **Fabric Selection**: Browse and filter premium fabrics with color swatches
- **Real-time Preview**: Layered garment visualization with zoom and pan
- **Detail Customization**: Modify specific garment parts (collar, cuff, buttons, etc.)
- **Contrast Options**: Select contrasting colors for collars and cuffs
- **Save Designs**: Store and retrieve custom designs locally
- **Finish & Review**: Complete overview before placing orders

### Technical Highlights
- Layer-based image rendering for garment assembly
- Interactive zoom and pan for detailed fabric inspection
- Filter and sort functionality for fabric selection
- Responsive design with Tailwind CSS
- Local storage for design persistence
- Tab-based navigation between fabric, customize, and finish sections

## Tech Stack

- **Framework**: React 19 with Vite 8
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4 with custom animations
- **UI Components**: Radix UI primitives (Tabs, Select, Switch, Alert Dialog)
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **Build Tool**: Vite with SWC for fast compilation
- **Linting**: ESLint 9 with React Hooks plugin

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── fabric/         # Fabric panel and subcomponents
│   │   └── subcomponents/
│   │       ├── QuickAccessToolbar.jsx
│   │       ├── FabricFilterPanel.jsx
│   │       └── FabricDetailModal.jsx
│   ├── layout/         # Layout components (Header, etc.)
│   └── ui/             # UI primitive components
├── features/           # Feature-based modules
│   ├── auth/           # Login, Signup, Reset Password
│   ├── customize/      # Garment customization pages
│   ├── finish/         # Order review and completion
│   ├── save/           # Saved designs management
│   ├── styleSelect/    # Style selection interfaces
│   └── verification/   # Account verification
├── layouts/            # Page layouts
├── router/             # Route configuration
├── styles/             # Global CSS styles
└── assets/             # Images, icons, and static assets
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/developereactapp-fz/new-fabric-app.git
   cd new-fabric-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint for code quality |

## Application Flow

1. **Style Selection** (`/` or `/style/:category`)
   - Choose garment type (Shirt, Pant, Jacket, Coat, Waistcoat)
   - Select between normal and tuxedo variants

2. **Customization** (`/customize/:type`)
   - Browse fabrics with search and filter options
   - Customize garment details (collar, cuff, buttons, etc.)
   - View real-time layered preview
   - Save design progress

3. **Finish** (`/finish`)
   - Review complete design summary
   - View fabric specifications
   - Submit enquiry or save design

4. **Saved Designs** (`/saved-designs`)
   - View all saved designs
   - Filter by type (Tuxedos, Shirts)
   - Search by name or fabric
   - View or delete saved designs

## Key Components

### FabricPanel.jsx
Main component for fabric selection and customization:
- **Fabric Tab**: Browse, search, and filter fabrics
- **Customize Tab**: Modify garment details with category selection
- **Finish Tab**: Preview and complete the design

### Subcomponents (Newly Refactored)
- **QuickAccessToolbar**: Quick navigation for profile, saved files, and style preferences
- **FabricFilterPanel**: Slide-out panel for sorting and color filtering
- **FabricDetailModal**: Detailed fabric view with specifications and layered preview

## Development Notes

### Recent Refactoring
The codebase has been refactored to improve maintainability:
- Extracted large inline components into dedicated files
- Separated UI logic into reusable subcomponents
- Improved code organization in the fabric panel

### Local Storage Usage
- Saved designs are stored in `localStorage` under `saved_designs`
- Design data for the finish page is stored under `finishDesignData`
- Selected design ID for details view is stored under `selected_saved_design_id`

### Image Assets
- Layered garment images are stored in `/assets/` folders
- Each garment type has its own asset directory structure
- Images are overlaid using absolute positioning with z-index

## Contributing

When contributing to this project:
1. Follow the existing component structure in `src/features/`
2. Use Tailwind CSS for styling with the project's design tokens
3. Maintain the feature-based folder organization
4. Ensure ESLint passes before committing

## License

Private project - All rights reserved.

---

**Built with React + Vite + Tailwind CSS**
