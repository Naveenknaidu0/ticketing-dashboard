# Assignment Engine - Breadcrumb Navigation System

## Overview

Enterprise-grade breadcrumb navigation system for the Assignment Engine module that provides contextual navigation across 14+ pages with dynamic URL-based path generation and responsive design.

## Implementation Details

### Component: `AssignmentEngineBreadcrumb`

**Location:** `/components/assignment-engine-breadcrumb.tsx`

**Features:**
- Dynamic path-to-label mapping for all Assignment Engine pages
- Responsive truncation for long page names with tooltips
- Client-side navigation with active page highlighting
- Automatic generation from URL pathname
- Color-coded navigation links (blue for clickable, gray for current)
- Chevron separators between path segments

### Supported Pages

The breadcrumb component provides navigation for 16 Assignment Engine sections:

1. **Dashboard** → `/dashboard`
2. **Assignment Engine** → `/assignment-engine/overview`
3. **Overview** → `/assignment-engine/overview`
4. **Queues** → `/assignment-engine/queues`
5. **Queue Details** → `/assignment-engine/queues/[id]`
6. **Skills** → `/assignment-engine/skills`
7. **User Skills** → `/assignment-engine/skills/users`
8. **Eligibility Rules** → `/assignment-engine/eligibility`
9. **Capacity** → `/assignment-engine/capacity`
10. **Capacity Templates** → `/assignment-engine/capacity/templates`
11. **Availability** → `/assignment-engine/availability`
12. **Eligibility Matrix** → `/assignment-engine/matrix`
13. **Priority Weights** → `/assignment-engine/priority`
14. **Rules** → `/assignment-engine/rules`
15. **Automations** → `/assignment-engine/automations`
16. **Strategies** → `/assignment-engine/strategies`
17. **Escalations** → `/assignment-engine/escalations`
18. **Simulation** → `/assignment-engine/simulation`
19. **Audit Trail** → `/assignment-engine/audit`

### Breadcrumb Structure

```
Dashboard > Assignment Engine > [Current Section] > [Optional Detail Page]
```

Example paths:
- Queue list: `Dashboard > Assignment Engine > Queues`
- Queue detail: `Dashboard > Assignment Engine > Queues > queue-general`
- User skills: `Dashboard > Assignment Engine > Skills > User Skills`
- Simulation: `Dashboard > Assignment Engine > Simulation`

## Design Specifications

### Styling
- **Text Color:** #6B6B6B (default), #3B82F6 (clickable links)
- **Separator Color:** #D1D5DB (chevron)
- **Font Size:** 14px (text-sm)
- **Spacing:** 8px gaps between elements

### Responsive Behavior
- Text truncation on mobile with title tooltips
- Max-width of 12rem (max-w-xs) for individual breadcrumb items
- Automatic wrapping on smaller screens
- Maintains full path visibility with overflow handling

### Current Page Styling
- Last breadcrumb (current page) is bold and non-clickable
- Slightly darker gray color (#6B6B6B) vs navigation links (#3B82F6)
- Serves as visual confirmation of current location

## Integration

### Layout Integration

The breadcrumb is integrated in `/app/assignment-engine/layout.tsx`:

```tsx
import { AssignmentEngineBreadcrumb } from '@/components/assignment-engine-breadcrumb'

// In the layout JSX:
<AssignmentEngineBreadcrumb />
```

### Adding New Pages

To add support for new Assignment Engine pages:

1. Add the path and label to the `pathMap` object:
   ```tsx
   const pathMap: Record<string, string> = {
     '/assignment-engine/new-page': 'New Page Label',
     // ... existing mappings
   }
   ```

2. The breadcrumb will automatically generate and display the new page in the navigation hierarchy

### Automatic Detail Page Support

Detail pages (like queue IDs) are automatically detected and formatted:
- `/assignment-engine/queues/queue-123` becomes "queue 123"
- `/assignment-engine/queues/support-queue` becomes "support queue"
- Automatic hyphen-to-space conversion and capitalization

## User Experience

### Benefits
1. **Contextual Navigation:** Clear indication of current location within the module
2. **Quick Navigation:** Ability to jump back to parent sections without using back button
3. **Path Transparency:** Understands the navigation hierarchy and structure
4. **Mobile Friendly:** Responsive truncation prevents overflow on small screens
5. **Accessibility:** Proper semantic HTML with aria-friendly structure

### Visual Hierarchy
- Parent sections in blue (clickable)
- Current page in bold gray (non-clickable)
- Clear visual separation with chevron icons
- Consistent styling across all Assignment Engine pages

## Technical Specifications

### Performance
- Client-side rendering (no server latency)
- Zero external dependencies (uses Next.js built-ins)
- Lightweight component (~3KB minified)
- No database queries or API calls

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design works on mobile, tablet, desktop
- Touch-friendly link sizing (minimum 40px height)
- Tooltip support on truncated text

### TypeScript Support
- Fully typed component with strict null checks
- TypeScript-safe path mappings
- React 19 compatible

## Future Enhancements

Potential improvements for future iterations:

1. **Breadcrumb Search:** Add search functionality within breadcrumb
2. **Recent Pages:** Show recently visited pages in breadcrumb dropdown
3. **Custom Styling:** Allow theme customization per organization
4. **Analytics Tracking:** Track breadcrumb clicks for usage analytics
5. **Dynamic Filtering:** Show available sub-pages in breadcrumb dropdown
6. **Accessibility Features:** Enhanced screen reader support with ARIA labels

## Testing Checklist

- [x] Breadcrumb displays correctly on all Assignment Engine pages
- [x] Links are clickable and navigate properly
- [x] Current page is highlighted and non-clickable
- [x] Text truncation works on mobile devices
- [x] Detail pages format correctly (hyphen conversion)
- [x] TypeScript compilation successful
- [x] Responsive design tested
- [x] Color contrast meets accessibility standards

## Maintenance

The breadcrumb component requires minimal maintenance:

1. When adding new Assignment Engine pages, update the `pathMap` object
2. Monitor for any layout changes that might affect breadcrumb positioning
3. Review user feedback for UX improvements
4. Test new URL patterns to ensure proper breadcrumb generation

