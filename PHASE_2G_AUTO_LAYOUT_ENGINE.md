# Phase 2G - Auto Layout Engine

## Overview

Phase 2G implements a sophisticated auto-layout engine that automatically reorganizes dashboards when widget visibility changes. This is a **ZERO IMPACT** infrastructure feature:
- No widget logic modified
- No calculations changed
- No dashboard data modified
- Only layout behavior enhanced

## Problem Solved

**Before:**
```
Manager hides widget → Empty container remains → Gaps appear → Dashboard looks unfinished
```

**After:**
```
Manager hides widget → Dashboard recalculates → Remaining widgets move automatically → No gaps
```

## Core Features

### 1. Automatic Layout Recalculation

When widgets are hidden/shown via Dashboard Governance, the layout automatically reorganizes:

- **1 widget visible:** Full width
- **2 widgets visible:** 50/50 split
- **3 widgets visible:** 33/33/33 grid
- **4 widgets visible:** 2x2 grid
- **5+ widgets visible:** Balanced auto-flow grid

### 2. No Gaps or Empty Spaces

The engine calculates optimal grid positioning to eliminate:
- Empty container rows
- Broken alignment
- Unnecessary vertical gaps
- Horizontal scroll scenarios

### 3. Responsive Design

Automatically adapts to screen size:
- **Mobile (< 640px):** 1 column
- **Tablet (640-1024px):** 1-2 columns
- **Desktop (> 1024px):** Full layout

### 4. Smooth Transitions

300ms cubic-bezier animations for widget repositioning:
- Professional appearance
- No jarring layout shifts
- Accessible transitions

### 5. Dashboard Governance Integration

Managers can control visibility through Dashboard Governance:
- Show/hide individual widgets
- Show all / Hide all controls
- Reset to defaults
- Real-time preview (no refresh needed)

## Implementation Files

### 1. Enhanced Layout Engine (`lib/dashboard-layout-engine.ts`)

**New Methods:**

```typescript
// Calculate responsive grid classes
calculateGridClasses(visibleWidgetCount: number): string
// Returns 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' etc.

// Calculate column span for individual widget
calculateWidgetColSpan(widgetIndex: number, totalVisibleWidgets: number): string

// Auto-reflow visible widgets, removing hidden ones
autoReflowVisibleWidgets(allWidgets: Array<{id, isVisible}>): Array<{id, index}>

// Calculate CSS Grid template for automatic layout
calculateAutoGridTemplate(visibleWidgetIds: string[]): {gridTemplateColumns, gridAutoFlow, gridGap}

// Get widget layout style with transitions
getWidgetLayoutStyle(widgetId: string, indexInVisibleSet: number, totalVisibleWidgets: number): React.CSSProperties
```

**Key Functions:**
- Responsive breakpoint calculations
- Grid dimension calculations
- Automatic reflow without gaps
- CSS Grid template generation
- Smooth transition styles

### 2. Auto-Layout Container (`components/dashboard-auto-layout-container.tsx`)

**DashboardAutoLayoutContainer** - Main container component

Features:
- Tracks visible widgets
- Applies optimal grid classes
- Handles empty states
- Smooth transitions
- Full responsiveness

**Usage:**
```typescript
<DashboardAutoLayoutContainer
  widgets={[
    { id: 'widget-1', isVisible: true, component: <Widget1 /> },
    { id: 'widget-2', isVisible: false, component: <Widget2 /> },
    { id: 'widget-3', isVisible: true, component: <Widget3 /> },
  ]}
  gapSize="md"
/>
```

**DashboardAutoRow** - Wrap widgets that should reflow together

Features:
- Visibility-aware layout
- Returns null if no widgets visible
- Responsive grid calculation
- Smooth transitions

**Usage:**
```typescript
<DashboardAutoRow
  widgets={widgetDefs}
  rowClassName="mb-6"
  gridClassName="gap-4"
/>
```

### 3. Visibility Hook (`hooks/use-dashboard-widget-visibility.ts`)

**useDashboardWidgetVisibility** - State management for widget visibility

Features:
- Initialize from defaults or localStorage
- Toggle individual widget visibility
- Show/hide all operations
- Reset to defaults
- Computed grid classes
- Persistence support

**Methods:**
```typescript
const {
  visibility,              // {[widgetId]: boolean}
  toggleWidget,           // (id: string) => void
  showWidget,             // (id: string) => void
  hideWidget,             // (id: string) => void
  showAllWidgets,         // () => void
  hideAllWidgets,         // () => void
  resetToDefaults,        // () => void
  visibleCount,           // number
  visibleWidgetIds,       // string[]
  gridClasses,            // string (Tailwind classes)
  isWidgetVisible,        // (id: string) => boolean
} = useDashboardWidgetVisibility(initialWidgets, persistenceKey)
```

**Usage:**
```typescript
const {
  visibility,
  toggleWidget,
  visibleCount,
  gridClasses,
} = useDashboardWidgetVisibility([
  { id: 'widget-1', defaultVisible: true },
  { id: 'widget-2', defaultVisible: true },
  { id: 'widget-3', defaultVisible: false },
], 'agent-dashboard-visibility')
```

### 4. Visibility Toggle (`components/widget-visibility-toggle.tsx`)

**WidgetVisibilityToggle** - Single toggle button

Features:
- Eye/EyeOff icons
- Tooltip support
- Disabled state
- Accessible ARIA labels

**Usage:**
```typescript
<WidgetVisibilityToggle
  widgetId="widget-1"
  widgetName="My Widget"
  isVisible={true}
  onToggle={(id, visible) => toggleWidget(id, visible)}
/>
```

**WidgetVisibilityList** - List of toggles for governance panel

Features:
- Visibility stats (X of Y visible)
- Show All / Hide All / Reset buttons
- Widget descriptions
- Consistent styling

**Usage:**
```typescript
<WidgetVisibilityList
  widgets={[
    { id: 'w1', name: 'Widget 1', isVisible: true },
    { id: 'w2', name: 'Widget 2', description: 'My description', isVisible: false },
  ]}
  onToggle={toggleWidget}
  onShowAll={showAllWidgets}
  onHideAll={hideAllWidgets}
  onReset={resetToDefaults}
/>
```

## Architecture

### Layout Calculation Flow

```
Manager hides widget via Dashboard Governance
        ↓
useDashboardWidgetVisibility updates visibility state
        ↓
Component re-renders with new visibility
        ↓
dashboardLayoutEngine.calculateGridClasses() called
        ↓
Tailwind grid classes updated
        ↓
DashboardAutoLayoutContainer filters visible widgets
        ↓
CSS Grid applies new layout
        ↓
300ms transition animation smooths repositioning
```

### Responsive Behavior

```
Desktop (>1024px)               Tablet (640-1024px)         Mobile (<640px)
4 widgets                       2-3 widgets per row         1 widget per column
Optimal column distribution     Tablet optimized            Mobile optimized
Full layout preserved           Adjusted spacing            Single column
```

## Integration with Dashboard Governance

### Current Dashboard Governance Features

- Show/hide widgets
- Resize widgets
- Reorder widgets
- Persistent configuration
- Role-based defaults

### New Auto-Layout Integration

When Dashboard Governance visibility changes:
1. New visibility state → useDashboardWidgetVisibility
2. Visibility hook updates
3. Component re-renders
4. dashboardLayoutEngine calculates new grid
5. DashboardAutoLayoutContainer applies layout
6. Smooth 300ms transition animates widgets
7. Dashboard reorganizes with zero gaps

## Migration Guide

### Step 1: Identify Widget Rows

In Agent/Manager/Team Dashboard:
```typescript
{/* ROW 1 - Personal KPI Cards */}
<div className="mb-6">
  <div className="grid grid-cols-4 gap-4">
    <EnhancedKPICard ... />
    <EnhancedKPICard ... />
    ...
  </div>
</div>
```

### Step 2: Define Widget Definitions

```typescript
const widgets = [
  { 
    id: 'kpi-1', 
    isVisible: visibility['kpi-1'],
    component: <EnhancedKPICard ... />
  },
  { 
    id: 'kpi-2', 
    isVisible: visibility['kpi-2'],
    component: <EnhancedKPICard ... />
  },
]
```

### Step 3: Initialize Hook

```typescript
const {
  visibility,
  toggleWidget,
  gridClasses,
  visibleCount,
} = useDashboardWidgetVisibility([
  { id: 'kpi-1', defaultVisible: true },
  { id: 'kpi-2', defaultVisible: true },
])
```

### Step 4: Replace with Auto-Layout Container

```typescript
{/* ROW 1 - Personal KPI Cards (Auto-Layout) */}
<DashboardAutoRow widgets={widgets} />
```

Or:

```typescript
{/* ROW 1 - Personal KPI Cards (Manual Control) */}
<div className="mb-6">
  <div className={`grid ${gridClasses} gap-4 transition-all duration-300`}>
    {widgets.map((w, idx) => (
      <div key={w.id} style={dashboardLayoutEngine.getWidgetLayoutStyle(w.id, idx, visibleCount)}>
        {w.component}
      </div>
    ))}
  </div>
</div>
```

## Performance Considerations

- Grid recalculation is O(n) where n = visible widget count
- Only visible widgets are rendered
- Hidden widgets are completely removed from DOM
- Transitions use GPU-accelerated CSS transforms
- No expensive layout recalculations during animation

## Browser Compatibility

- CSS Grid: All modern browsers (IE 11+ with fallbacks)
- CSS Transitions: All modern browsers
- LocalStorage: All modern browsers
- ES6+ JavaScript: All modern browsers

## Testing Scenarios

1. **Hide single widget** → Others reflow without gaps
2. **Show multiple hidden widgets** → Layout recalculates smoothly
3. **Responsive resize** → Grid adapts to screen size
4. **All hidden** → Shows empty state message
5. **Reset to defaults** → Returns to initial configuration
6. **Persistence** → Visibility survives page refresh
7. **Different profiles** → Layout independent per dashboard

## Success Criteria

✓ No empty dashboard gaps when widgets hidden
✓ No broken layouts on visibility changes
✓ No widget alignment issues
✓ Widgets automatically reposition
✓ Dashboard remains responsive
✓ Managers can safely hide/show widgets
✓ Dashboard Governance fully functional
✓ Works across Agent, Manager, Team dashboards
✓ Zero widget logic changes
✓ Zero dashboard data changes
✓ Smooth 300ms transitions

## Future Enhancements

- Drag-to-reorder with auto-layout
- Widget size presets (small, medium, large)
- Save multiple layout profiles
- Widget locking (prevent accidental hide)
- Layout undo/redo
- Export layout as JSON
- Import layout from JSON
