# Manager & Agent Ticket List Filter Rework - Implementation Guide

## Overview

The Manager & Agent Ticket List Filter has been completely redesigned to provide intuitive, role-specific filtering controls while maintaining the original filter chip UI as the primary navigation method. This rework balances powerful management capabilities with a familiar, easy-to-use interface.

## Key Changes

### 1. Filter Chip UI - Restored Original Design

The filter chips remain the primary interface for quick filtering, with role-aware visibility:

#### Agent Filter Chips (All Agents See These)
- **All Tickets** - Default view showing all visible tickets
- **My Tickets** - Only tickets assigned to the current agent
- **Open** - Tickets with 'open' status
- **In Progress** - Tickets currently being worked on
- **Pending** - Tickets awaiting customer response
- **Resolved** - Tickets that are resolved
- **Due Today** - Tickets with today's due date
- **SLA Risk** - Tickets at risk of SLA breach

#### Manager-Exclusive Filter Chips
- **Team Tickets** - All tickets assigned to any team member (positioned after "My Tickets")
- **Unassigned** - Tickets without an assigned agent (at the end of the chip bar)

### 2. Dropdown Filters - Near Search Bar

New dropdown filter controls appear next to the search bar for advanced filtering:

#### For Agents
- **Filter By** dropdown with options:
  - Priority (Critical, High, Medium, Low)
  - Status (Open, In Progress, Pending, Resolved)
  - Category (Collaboration, Hardware, Email, etc.)
  - Ticket Type (Incident, Request)
  - SLA Status (Compliant, At Risk, Breached)
  - Created Date (Today, Yesterday, This Week, etc.)
  - Due Date (Today, Tomorrow, Overdue, etc.)

#### For Managers
- **Team Member** dropdown - Filter tickets by specific agent
  - All Team Members (default)
  - Sarah Johnson (agent1)
  - Michael Chen (agent2)
  - Emma Williams (agent3)
  - James Rodriguez (agent4)
  - David Kumar (agent5)

- **Date Range** dropdown - Filter by ticket creation date
  - All (no date filter)
  - Today
  - Yesterday
  - This Week
  - Last Week
  - This Month
  - Last Month
  - This Quarter
  - Last Quarter
  - This Year
  - Custom Range (for future enhancement)

### 3. Advanced Filter Button

An "Advanced" button is available for both roles to access additional filtering options (for future implementation).

### 4. Search Bar

The search bar works across all views:
- Searches ticket ID and title
- Works in combination with all filter chips and dropdowns
- Real-time filtering with no page reload required

## Implementation Details

### File Structure

```
lib/
  ticket-filters.ts          # Filter logic and team member definitions
  role-permissions.ts        # Role-based filtering (unchanged)

app/
  tickets/
    page.tsx               # Main tickets page with filter UI
```

### State Management

**Agent Filter States:**
- `activeFilter` - Currently selected filter chip
- `searchTerm` - Search query
- `showAdvanced` - Advanced filter panel visibility
- `filterByValue` - Selected dropdown filter option

**Manager Filter States:**
- All of the above plus:
- `teamMemberFilter` - Selected team member for filtering
- `dateRangeFilter` - Selected date range for filtering

### Filter Logic Flow

1. **Get Tickets from Store** - Retrieve all tickets from application state
2. **Apply Role-Based Filtering** - Filter by user's role (agent sees only their tickets + public, manager sees all)
3. **Apply Quick Filter Chips** - Filter based on selected chip
4. **Apply Dropdown Filters** - Apply team member and date range filters (managers only)
5. **Apply Search** - Filter by search term
6. **Sort & Paginate** - Sort results and apply pagination

### Team Tickets Logic

When a manager selects "Team Tickets":
- Shows all tickets assigned to any team member (agent1-agent5)
- Excludes manager's own tickets (assigned to manager1)
- Can be further filtered by:
  - Specific team member (via dropdown)
  - Date range (via dropdown)
  - Status (via chips)
  - Priority (via dropdown)
  - Search term

### Agent Visibility Restrictions

Agents see a restricted filter interface:
- Cannot see "Team Tickets" chip
- Cannot see "Unassigned" chip
- Can only filter by "My Tickets" or view all visible tickets
- Cannot access team member filtering
- Can only see their own tickets plus public/visible tickets based on role-permissions

## UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Filter Chips Bar (Original)                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ All  My  [Team]  Open  In Progress  Pending  ...  [✗] │   │ ← [Team] only for manager
│  │                                              [Unassigned] │ ← Manager only
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  Search & Dropdown Filters Bar (New)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ [Search] [Filter By/Team Member] [Date Range] [Adv] │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  Ticket List                                                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Ticket rows with pagination                          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Usage Examples

### Agent Workflow
1. Agent logs in and sees their assigned tickets
2. Selects "My Tickets" to focus on assignments
3. Uses "Filter By" dropdown to select "Priority > High"
4. Uses search to find specific ticket
5. Clicks on ticket to view details

### Manager Workflow - Team Overview
1. Manager logs in, defaults to "Team Tickets"
2. Can see all team member tickets at once
3. Uses "Team Member" dropdown to focus on Sarah Johnson's tickets
4. Uses "Date Range" dropdown to show only this week's tickets
5. Uses "SLA Risk" chip to find escalations
6. Uses search to find specific ticket ID

### Manager Workflow - Workload Balancing
1. Manager clicks "Team Tickets"
2. Uses "Team Member" dropdown to cycle through each agent
3. Uses "In Progress" chip to see current workload
4. Uses "SLA Risk" chip to identify stressed agents
5. Reassigns tickets as needed

## Database Considerations

All filtering operates on the **master 50-ticket dataset**:
- No separate data sources per role
- No dynamic data population
- Pure frontend filtering based on role-permissions
- Maintains data consistency across all views

## Type Safety

- All filter values are TypeScript enums
- Role-aware conditional rendering prevents invalid filters
- Compiled without errors

## Future Enhancements

Potential improvements for future sprints:
1. **Custom Date Range Picker** - Allow managers to select specific date ranges
2. **Advanced Filter Panel** - Multi-criteria filtering UI
3. **Saved Filters** - Users can save their favorite filter combinations
4. **Filter Presets** - Manager-defined team filter templates
5. **Export Filtered Results** - Export ticket list as CSV
6. **Bulk Actions** - Reassign multiple tickets at once
7. **Real-time Updates** - WebSocket integration for live ticket updates

## Testing Notes

The implementation:
- ✓ Compiles without TypeScript errors
- ✓ Maintains all role-based access controls
- ✓ Preserves original filter chip UI
- ✓ Provides role-specific dropdown options
- ✓ Operates on shared 50-ticket dataset
- ✓ Supports simultaneous multi-filter application

## Browser Compatibility

- Works with all modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive design for mobile viewing
- Touch-friendly filter controls
