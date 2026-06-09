# Phase 2F - AdamsBridge Widget Theme Standardization

## Overview

Phase 2F implements a centralized design token system and reusable component library to ensure visual consistency across all dashboards and widgets on the AdamsBridge platform. This is a VISUAL ONLY standardization—no business logic, calculations, layouts, or dashboard structure changes.

## Design Tokens

### Core Color Palette

```
PRIMARY_TEAL:       #0B3D3B  (Brand primary color)
SECONDARY_TEAL:     #114B46  (Brand secondary)
ACCENT_GOLD:        #E0A04B  (Highlights, accents)
SUCCESS_GREEN:      #1FA971  (Positive states)
WARNING_AMBER:      #D98B2B  (Warning states)
CRITICAL_RED:       #C45B5B  (Error/Critical states)
NEUTRAL_50:         #F5F7F8  (Light backgrounds)
NEUTRAL_100:        #F3F1EE  (Very light backgrounds)
NEUTRAL_200:        #E5E7EB  (Borders, dividers)
NEUTRAL_500:        #6B7280  (Secondary text)
NEUTRAL_700:        #374151  (Primary text variants)
NEUTRAL_900:        #1F2937  (Dark text)
```

### Status Colors

```
OPEN:               PRIMARY_TEAL (#0B3D3B)
IN_PROGRESS:        ACCENT_GOLD (#E0A04B)
RESOLVED:           SUCCESS_GREEN (#1FA971)
AT_RISK:            WARNING_AMBER (#D98B2B)
BREACHED:           CRITICAL_RED (#C45B5B)
CLOSED:             SUCCESS_GREEN (#1FA971)
```

### Chart Color Palette

Consistent color ordering for all charts and data visualizations:
1. PRIMARY_TEAL
2. ACCENT_GOLD
3. SUCCESS_GREEN
4. WARNING_AMBER
5. CRITICAL_RED
6. SECONDARY_TEAL
7. NEUTRAL_500

### Progress Bar Thresholds

- **0-79%:** CRITICAL_RED (#C45B5B)
- **80-89%:** WARNING_AMBER (#D98B2B)
- **90-100%:** SUCCESS_GREEN (#1FA971)

## Files Created

### 1. Design Token System (`lib/adamsbridge-design-tokens.ts`)

Central source of truth for all visual constants:
- Color definitions
- Typography scale (sizes, weights, line-heights)
- Spacing scale
- Border radius values
- Shadow definitions
- Card styles (default, subtle, elevated)
- Widget header styles
- Table styles
- Filter styles
- Icon styles
- Widget footer styles
- Status badge styles

**Usage:**
```typescript
import { ADAMSBRIDGE_TOKENS } from '@/lib/adamsbridge-design-tokens'

// Access colors
const primaryColor = ADAMSBRIDGE_TOKENS.COLORS.PRIMARY_TEAL

// Access spacing
const padding = ADAMSBRIDGE_TOKENS.SPACING.LG

// Access card styles
const cardStyle = ADAMSBRIDGE_TOKENS.CARD_STYLES.DEFAULT
```

### 2. Styling Utilities (`lib/widget-styling-utils.ts`)

Reusable functions for common styling patterns:

- `getStatusBadgeStyle()` - Returns background and text color for status
- `getProgressBarColor()` - Returns color based on percentage threshold
- `getCardStyle()` - Returns complete card styling for variant
- `getWidgetHeaderStyle()` - Returns header typography and spacing
- `getWidgetActionButtonStyle()` - Returns button styling
- `getTableRowStyle()` - Returns row styling (header or data)
- `getStatusColor()` - Returns color for specific status type
- `getIconColor()` - Returns color for icon by type
- `getChartColors()` - Returns full chart color palette
- `getFilterDropdownStyle()` - Returns dropdown styling
- `getBorderStyle()` - Returns border styling utilities
- `getShadow()` - Returns shadow by level
- `getSpacing()` - Returns spacing value

**Usage:**
```typescript
import { getStatusBadgeStyle, getProgressBarColor } from '@/lib/widget-styling-utils'

const badgeStyle = getStatusBadgeStyle('in-progress')
const barColor = getProgressBarColor(85)
```

### 3. Reusable Components

#### StandardizedWidgetHeader (`components/standardized-widget-header.tsx`)

Header component for all widgets with consistent styling:

**Features:**
- Widget title with optional subtitle
- Tooltip support
- Action buttons (refresh, export, expand)
- Proper spacing and alignment
- Uses AdamsBridge tokens exclusively

**Usage:**
```typescript
<StandardizedWidgetHeader
  title="My Widget"
  subtitle="Optional description"
  tooltip="Help text"
  onRefresh={() => console.log('refresh')}
  onExport={() => console.log('export')}
  onExpand={() => console.log('expand')}
/>
```

#### StandardizedStatusBadge (`components/standardized-status-badge.tsx`)

Status badge component with consistent styling:

**Features:**
- Status-specific colors (open, in-progress, resolved, at-risk, breached)
- Three size variants (sm, md, lg)
- Fully rounded style
- Proper typography

**Usage:**
```typescript
<StandardizedStatusBadge status="in-progress" size="md" />
```

#### StandardizedProgressBar (`components/standardized-progress-bar.tsx`)

Progress bar component with threshold-based coloring:

**Features:**
- Automatic color based on percentage (0-79% red, 80-89% amber, 90-100% green)
- Optional percentage label
- Optional status label (Critical, Warning, Healthy)
- Multiple height variants
- Animated transitions

**Usage:**
```typescript
<StandardizedProgressBar 
  percentage={85} 
  showLabel={true}
  height="md"
/>
```

#### StandardizedCard (`components/standardized-card.tsx`)

Card container component with consistent styling:

**Features:**
- Three variants (default, subtle, elevated)
- Optional click handler with hover effects
- Inherits all border, padding, and shadow styles
- Flexible content

**Usage:**
```typescript
<StandardizedCard variant="default">
  <div>Card content here</div>
</StandardizedCard>
```

## Implementation Strategy

### Phase 1: Foundation (Current)
✓ Create centralized design token system
✓ Create styling utilities library
✓ Create reusable component library
✓ Document all tokens and utilities

### Phase 2: Widget Migration (Next Steps)
- Audit all existing widgets for token usage
- Replace hardcoded colors with ADAMSBRIDGE_TOKENS
- Replace inline styles with utility functions
- Replace custom header implementations with StandardizedWidgetHeader
- Replace custom status badges with StandardizedStatusBadge
- Replace custom progress bars with StandardizedProgressBar
- Replace custom cards with StandardizedCard

### Phase 3: Verification
- Visual consistency audit across all dashboards
- Color palette verification
- Typography verification
- Spacing verification
- No functional changes verification

## Success Criteria

✓ Centralized design token system created
✓ Styling utilities library created
✓ Reusable component library created
✓ All tokens documented with usage examples
✓ No widget logic changed
✓ No widget calculations changed
✓ No dashboard layouts changed
✓ No dashboard spacing changed
✓ Platform feels unified with AdamsBridge visual language

## Token Reference

### Available Colors
- PRIMARY_TEAL, SECONDARY_TEAL, ACCENT_GOLD
- SUCCESS_GREEN, WARNING_AMBER, CRITICAL_RED
- NEUTRAL_50, NEUTRAL_100, NEUTRAL_200, NEUTRAL_300, NEUTRAL_500, NEUTRAL_700, NEUTRAL_900
- WHITE, BLACK

### Typography Sizes
- XS (12px), SM (14px), BASE (16px), LG (18px), XL (20px), 2XL (24px), 3XL (30px)

### Spacing Values
- XS (4px), SM (8px), MD (12px), LG (16px), XL (20px), 2XL (24px), 3XL (32px)

### Border Radius
- SM (6px), MD (8px), LG (12px), XL (16px), FULL (9999px)

### Shadow Levels
- NONE, SM, MD, LG, XL

### Card Variants
- default, subtle, elevated

## Migration Checklist

For each widget, apply these changes:
1. Replace all hardcoded color hex values with ADAMSBRIDGE_TOKENS.COLORS
2. Replace custom status badge implementations with StandardizedStatusBadge
3. Replace custom progress bars with StandardizedProgressBar
4. Replace custom card styles with StandardizedCard
5. Replace custom widget headers with StandardizedWidgetHeader
6. Verify widget still functions identically
7. Test all dashboard views

## Notes

- All changes are VISUAL ONLY
- No business logic is modified
- No calculations are changed
- No layouts are modified
- All widgets maintain exact same functionality
- Dashboard Governance remains unchanged
- Configuration Registry unchanged
