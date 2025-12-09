# Design Guidelines: Charging Spot Finder

## Authentication & User Management
**No authentication required** - This is a utility-focused app for discovering charging locations.

**Profile/Settings Screen:**
- User-customizable avatar (generate 1 preset avatar: a minimalist battery icon silhouette in a circular frame)
- Display name field (optional, defaults to "Explorer")
- Preferences:
  - Default map style (Standard/Satellite)
  - Distance units (Miles/Kilometers)
  - Auto-locate on app open (toggle)
  - Push notifications for new nearby spots (toggle)

## Navigation Architecture
**Tab Navigation (3 tabs):**
1. **Map Tab** (leftmost) - Icon: map-pin
2. **Add Spot Tab** (center, emphasized) - Icon: plus-circle, core action
3. **List Tab** (rightmost) - Icon: list

**Screen Hierarchy:**
- Map Screen (Stack: Map)
- Add Spot Screen (Native Modal from any tab)
- List Screen (Stack: List)
  - Location Details Screen (Push in List stack)
- Settings Screen (Native Modal from Map header)

## Screen Specifications

### 1. Map Screen
**Purpose:** Primary view for discovering nearby charging spots visually

**Layout:**
- **Header:** Transparent custom header
  - Left: Settings icon button (opens Settings modal)
  - Right: Current location button (re-centers map)
  - No title text
- **Main Content:** Full-screen map view (not scrollable)
  - Custom map markers for charging spots (battery icon with location pin)
  - User location indicator (pulsing blue dot)
  - Cluster markers when zoomed out (showing count)
- **Floating Elements:**
  - Search bar at top (below header, with rounded corners, white background, shadow)
  - Filter chips below search (horizontal scroll: All, Cafe, Library, Airport, Mall, Restaurant)
  - Bottom sheet preview card (appears when marker tapped, showing spot name, distance, available outlets)

**Safe Area Insets:**
- Top: headerHeight + Spacing.xl
- Bottom: tabBarHeight + Spacing.xl

### 2. List Screen
**Purpose:** Browse charging spots in ordered list format

**Layout:**
- **Header:** Default navigation header
  - Title: "Nearby Spots"
  - Right: Filter icon button
  - Search bar integrated below header
- **Main Content:** Scrollable list
  - Sort toggle above list (Nearest/Most Outlets/Recently Added)
  - List items showing:
    - Venue name (bold)
    - Distance from user
    - Venue type tag
    - Number of available outlets
    - Small preview map thumbnail
  - Pull to refresh
- **Safe Area Insets:**
  - Top: Spacing.xl (non-transparent header)
  - Bottom: tabBarHeight + Spacing.xl

### 3. Location Details Screen
**Purpose:** View complete information about a charging spot

**Layout:**
- **Header:** Default navigation header with back button
  - Title: Venue name
  - Right: Share icon button
- **Main Content:** Scrollable form/content area
  - Top: Full-width map preview (200px height)
  - Venue information card:
    - Address with "Get Directions" button
    - Phone number (if available)
    - Hours of operation
    - Number of outlets (with icon)
    - Outlet types (USB-A, USB-C, Standard)
  - User tips section (community-contributed notes)
  - Photos carousel (if available)
- **Safe Area Insets:**
  - Top: Spacing.xl
  - Bottom: insets.bottom + Spacing.xl

### 4. Add Spot Screen
**Purpose:** Allow users to contribute new charging locations

**Layout:**
- **Header:** Default navigation header
  - Left: Cancel button
  - Title: "Add Charging Spot"
  - Right: Submit button (disabled until form valid)
- **Main Content:** Scrollable form
  - Auto-detected location (with map preview)
  - Venue name input
  - Venue type picker (dropdown)
  - Number of outlets (stepper control)
  - Outlet types (multi-select chips)
  - Optional notes (text area)
- **Safe Area Insets:**
  - Top: Spacing.xl
  - Bottom: insets.bottom + Spacing.xl

### 5. Settings Screen
**Purpose:** User preferences and app information

**Layout:**
- **Header:** Default navigation header
  - Left: Close button
  - Title: "Settings"
- **Main Content:** Scrollable grouped list
  - Profile section (avatar + display name)
  - Preferences (toggles and pickers)
  - About section (version, terms, privacy policy placeholders)
- **Safe Area Insets:**
  - Top: Spacing.xl
  - Bottom: insets.bottom + Spacing.xl

## Design System

### Color Palette
- **Primary:** #4CAF50 (Green - represents charging/power)
- **Primary Dark:** #388E3C
- **Accent:** #FFC107 (Amber - alerts/highlights)
- **Background:** #FAFAFA
- **Surface:** #FFFFFF
- **Text Primary:** #212121
- **Text Secondary:** #757575
- **Border:** #E0E0E0
- **Error:** #F44336

### Typography
- **Large Title:** 34px, Bold, Text Primary
- **Title:** 24px, SemiBold, Text Primary
- **Headline:** 18px, SemiBold, Text Primary
- **Body:** 16px, Regular, Text Primary
- **Caption:** 14px, Regular, Text Secondary
- **Small:** 12px, Regular, Text Secondary

### Spacing
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- xxl: 32px

### Component Specifications
- **Map Markers:** Battery icon (16x16px) in Primary color with white background circle
- **List Items:** 72px height, white background, 1px bottom border (Border color)
- **Search Bar:** 48px height, rounded corners (24px), white background, shadow (as specified)
- **Filter Chips:** 32px height, rounded corners (16px), tappable with Primary background when selected
- **Bottom Sheet:** Rounded top corners (16px), white background, shadow
- **Floating Action Buttons:** Use exact shadow specification from guidelines (shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2)

### Assets Required
1. **User Avatar Preset:** Minimalist battery icon silhouette in circular frame (multiple color options)
2. **Map Marker Icon:** Custom battery-shaped pin marker
3. **Empty State Illustrations:**
   - No spots nearby (location pin with battery)
   - No search results (magnifying glass)

### Interaction Design
- All touchable elements have opacity feedback (activeOpacity: 0.7)
- Map markers scale slightly on press
- List items have subtle background color change on press (#F5F5F5)
- Pull-to-refresh with standard iOS/Android spinner
- Bottom sheet can be swiped up to expand or down to dismiss

### Accessibility
- Minimum touch target: 44x44px
- Color contrast ratio: 4.5:1 for text
- VoiceOver/TalkBack labels for all interactive elements
- Map markers have descriptive accessibility labels
- Form inputs have proper labels and hints