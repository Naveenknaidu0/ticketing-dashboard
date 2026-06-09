# Business Logic Engine - Implementation Guide

## Overview

The **Business Logic Engine** transforms AdamsBridge from a static data display application into a fully-functioning ticketing platform. Every ticket action now triggers cascading updates across all interconnected modules, creating a cohesive ecosystem where metrics, dashboards, and analytics automatically update in real-time.

## Architecture

### File: `/lib/business-logic-engine.ts` (586 lines)

The engine is a singleton class that subscribes to ticket mutations and orchestrates coordinated updates across all modules.

```typescript
class BusinessLogicEngine {
  private store: Store
  
  constructor(store: Store) {
    this.store = store
    this.setupListeners()
  }
}
```

### Integration Points: `/app/store-context.tsx`

The engine is instantiated once in the StoreProvider and listens to all ticket-related events:

```typescript
const [engine] = useState(() => new BusinessLogicEngine(applicationStore))
```

All emitted events from the engine automatically trigger state updates via existing listeners.

## Ticket Action Workflows

### 1. Create Ticket → `handleTicketCreated()`

**Cascading Updates:**
- ✓ Dashboard: New ticket appears in metrics
- ✓ Agent Dashboard: Updates workload summary
- ✓ Team Dashboard: Reflects team ticket count
- ✓ Reports: Incident growth tracking
- ✓ Leaderboard: Ticket creation counted (if applicable)
- ✓ Priority Breakdown: Distribution updated
- ✓ Workload: Agent workload recalculated

**Business Logic:**
```typescript
handleTicketCreated(ticket: Ticket) {
  // Update all metrics
  this.updateDashboard()
  this.updateAgentDashboard(ticket.assignedTo)
  this.updateTeamDashboard()
  this.updateReports()
  // ... more updates
  
  // Emit notifications
  this.store.emit('notification.created', {
    message: `New ticket ${ticket.id} created`,
    type: 'info'
  })
}
```

### 2. Assign Ticket → `handleTicketAssigned()`

**Cascading Updates:**
- ✓ Agent Workload: Agent's task count increases
- ✓ Team Dashboard: Unassigned count decreases
- ✓ To-Do List: New task added to agent's queue
- ✓ Workload Breakdown: Agent's metrics updated
- ✓ Dashboard: Unassigned count decreases
- ✓ Priority Breakdown: Distribution updated

**Business Logic:**
```typescript
handleTicketAssigned(ticketId: string, assignedTo: string) {
  // Update agent-specific views
  this.updateAgentDashboard(assignedTo)
  this.addTicketToToDo(assignedTo, ticketId)
  
  // Update team views
  this.updateTeamDashboard()
  this.updateAgentWorkloadBreakdown()
  
  // Create notification for agent
  this.store.emit('notification.created', {
    message: `Ticket ${ticketId} assigned to you`,
    type: 'info'
  })
}
```

### 3. Update Status → `handleStatusChanged()`

**Status Transitions & Their Effects:**

| From | To | Effect |
|------|-----|--------|
| open | in-progress | Started time captured, SLA timer begins |
| in-progress | resolved | Resolution time calculated, CSAT triggered |
| resolved | closed | Agent performance metrics updated |

**Cascading Updates:**
- ✓ SLA Metrics: Timer updates, status tracking
- ✓ Dashboard: Status distribution updated
- ✓ Reports: Status timeline tracked
- ✓ Leaderboard: Agent metrics updated
- ✓ To-Do: Task status reflected
- ✓ CSAT: Survey triggered on resolution

### 4. Resolve Ticket → `handleTicketResolved()`

**Most Complex Workflow - Comprehensive Updates:**

```
handleTicketResolved(ticketId)
  ├─ Calculate Metrics
  │  ├─ Resolution time
  │  ├─ MTTR (Mean Time to Resolve)
  │  ├─ Agent performance
  │  └─ Team performance
  ├─ Update Views
  │  ├─ Dashboard (resolved count +1)
  │  ├─ Agent Dashboard (metrics updated)
  │  ├─ Team Dashboard (performance metrics)
  │  ├─ Reports (analytics)
  │  ├─ Leaderboard (agent ranking)
  │  ├─ SLA Metrics (compliance tracked)
  │  └─ To-Do (task marked complete)
  └─ Trigger Post-Resolution
     ├─ CSAT survey
     └─ Notifications
```

**Business Logic:**
```typescript
handleTicketResolved(ticketId: string) {
  const ticket = this.store.getTicket(ticketId)
  const resolutionTime = this.calculateResolutionTime(ticket)
  
  // Update all dashboards
  this.updateTicketListView()
  this.updateDashboard()
  this.updateAgentDashboard(ticket.assignedTo)
  this.updateTeamDashboard()
  
  // Update analytics
  this.updateReports()
  this.updateLeaderboard()
  this.updateSLAMetrics(ticketId)
  
  // Trigger post-resolution actions
  this.triggerCSATSurvey(ticketId)
  this.store.emit('notification.created', {
    message: `Ticket ${ticketId} resolved (${resolutionTime}ms)`
  })
}
```

### 5. Update Priority → `handlePriorityChanged()`

**Cascading Updates:**
- ✓ SLA Metrics: SLA target adjusts based on priority
- ✓ Dashboard: Priority distribution updated
- ✓ Leaderboard: High-priority resolution tracking
- ✓ Reports: Priority trend analysis
- ✓ Agent Dashboard: High-priority tasks highlighted
- ✓ Priority Breakdown: Category distribution updated

### 6. Update Category → `handleCategoryChanged()`

**Cascading Updates:**
- ✓ Dashboard: Category breakdown updated
- ✓ Reports: Category trends tracked
- ✓ Priority Breakdown: Category-priority matrix updated
- ✓ Knowledge Base: Relevant articles suggested

## Module Update Orchestration

### View Update Methods

Each method updates its corresponding module with the latest state:

```typescript
updateDashboard()        // Main dashboard metrics
updateAgentDashboard()   // Agent-specific dashboard
updateTeamDashboard()    // Team performance overview
updateManagerDashboard() // Manager's overview
updateReports()          // Analytics and trend reports
updateSLAMetrics()       // SLA compliance tracking
updateWorkload()         // Workload metrics
updateLeaderboard()      // Agent rankings
updateToDoList()         // Personal task lists
updatePriorityBreakdown() // Priority distribution
updateAgentWorkloadBreakdown() // Workload distribution
```

### Event Propagation

Each update method emits a corresponding event:

```typescript
private updateDashboard() {
  // Calculate metrics
  const metrics = this.calculateDashboardMetrics()
  
  // Update store
  this.store.dashboardMetrics = metrics
  
  // Emit event for UI updates
  this.store.emit('dashboard.updated', metrics)
}
```

## Real-Time Sync with StoreContext

The StoreProvider listens to all engine events and triggers React re-renders:

```typescript
// In StoreProvider
applicationStore.on('dashboard.updated', handleStateChange)
applicationStore.on('agent-dashboard.updated', handleStateChange)
applicationStore.on('reports.updated', handleStateChange)
// ... more event listeners

const handleStateChange = () => {
  setState({ ...applicationStore.state })
}
```

This pattern ensures UI components automatically re-render whenever business logic updates any module.

## Agent Workload Management

### To-Do List Integration

When a ticket is assigned:
```typescript
addTicketToToDo(agentId: string, ticketId: string) {
  const todo = {
    id: `todo-${ticketId}`,
    ticketId,
    status: 'pending',
    priority: ticket.priority,
    dueDate: ticket.dueDate,
    createdAt: Date.now()
  }
  
  // Add to agent's queue
  this.store.agentToDo[agentId].push(todo)
  this.store.emit('todo.refreshed', agentId)
}
```

When a ticket is resolved:
```typescript
completeTicketInToDo(agentId: string, ticketId: string) {
  const todo = this.store.agentToDo[agentId]
    .find(t => t.ticketId === ticketId)
  
  if (todo) {
    todo.status = 'completed'
    todo.completedAt = Date.now()
    this.store.emit('todo.refreshed', agentId)
  }
}
```

## SLA Compliance Tracking

The engine automatically:

1. **Calculates SLA targets** based on ticket priority and category
2. **Tracks elapsed time** from creation to current status
3. **Determines status**:
   - `met`: Within SLA window
   - `at-risk`: 80% of SLA window used
   - `breached`: Exceeded SLA window
4. **Updates dashboards** with compliance metrics

```typescript
updateSLAMetrics(ticketId: string) {
  const ticket = this.store.getTicket(ticketId)
  const slaTarget = this.calculateSLATarget(ticket.priority)
  const elapsed = Date.now() - new Date(ticket.createdAt).getTime()
  
  const slaStatus = elapsed > slaTarget ? 'breached'
    : elapsed > slaTarget * 0.8 ? 'at-risk'
    : 'met'
  
  this.store.emit('sla.updated', { ticketId, slaStatus })
}
```

## Leaderboard Calculation

Rankings based on multiple factors:

- **Tickets Resolved**: Primary metric
- **Resolution Time**: Secondary (lower is better)
- **SLA Compliance**: Tertiary (% of tickets within SLA)
- **Customer Satisfaction**: Quaternary (CSAT score average)

```typescript
updateLeaderboard() {
  const agents = this.store.getAllAgents()
  const leaderboard = agents
    .map(agent => ({
      agentId: agent.id,
      name: agent.name,
      ticketsResolved: agent.ticketsResolved,
      avgResolutionTime: this.calculateAvgResolutionTime(agent.id),
      slaCompliance: this.calculateSLACompliance(agent.id),
      csatScore: this.calculateCSATScore(agent.id)
    }))
    .sort((a, b) => b.ticketsResolved - a.ticketsResolved)
  
  this.store.leaderboard = leaderboard
  this.store.emit('leaderboard.updated', leaderboard)
}
```

## CSAT Survey Orchestration

When a ticket is resolved:

```typescript
triggerCSATSurvey(ticketId: string) {
  const survey = {
    id: `survey-${ticketId}`,
    ticketId,
    agentId: ticket.assignedTo,
    status: 'pending',
    questions: [
      'How satisfied are you with the resolution?',
      'Was the agent helpful?',
      'Would you recommend this service?'
    ],
    createdAt: Date.now()
  }
  
  this.store.surveys.push(survey)
  this.store.emit('csat.survey-triggered', survey)
}
```

## Multi-Module Example: Ticket Assignment Flow

Here's how a single ticket assignment action ripples through the system:

```
User clicks "Assign to Sarah Johnson"
  ↓
API: POST /api/tickets/{id}/assign
  ↓
Store: ticket.assignedTo = "Sarah Johnson"
  ↓
Engine: handleTicketAssigned('ticket-123', 'Sarah Johnson')
  ↓
├─ Update Agent Dashboard
│  ├─ Sarah's ticket count: 5 → 6
│  ├─ Sarah's workload: 18% → 22%
│  └─ Emit: agent-dashboard.updated
│
├─ Add to Sarah's To-Do
│  └─ Emit: todo.refreshed
│
├─ Update Team Dashboard
│  ├─ Team workload: 65% → 67%
│  ├─ Unassigned: 8 → 7
│  └─ Emit: team-dashboard.updated
│
├─ Update Workload Breakdown
│  ├─ Sarah's section updates
│  └─ Emit: agent-workload.updated
│
├─ Update Dashboard
│  ├─ Unassigned: 8 → 7
│  ├─ In Progress: 12 → 13
│  └─ Emit: dashboard.updated
│
├─ Trigger Notification
│  ├─ "Ticket assigned to Sarah"
│  └─ Emit: notification.created
│
└─ Update Reports
   ├─ Assignment metrics
   └─ Emit: reports.updated
```

All emissions trigger UI updates via StoreProvider listeners, resulting in real-time cascading updates across the entire application.

## Performance Considerations

1. **Event Batching**: High-frequency updates are debounced
2. **Selective Updates**: Only affected modules are recalculated
3. **Lazy Metrics**: Complex calculations cached until changed
4. **Async Operations**: CSAT surveys and notifications use async handlers

## Testing the Engine

To verify the engine is working:

1. Create a ticket → Check Dashboard metrics increase
2. Assign ticket → Check Agent Dashboard and To-Do update
3. Update status → Check SLA metrics and reports update
4. Resolve ticket → Check Leaderboard, CSAT, and all dashboards update

## Integration Checklist

- [x] Business logic engine created
- [x] Store context updated with engine initialization
- [x] Event listeners configured for all module updates
- [x] TypeScript compilation successful
- [x] Real-time cascading updates implemented
- [x] SLA tracking operational
- [x] Leaderboard calculation active
- [x] Agent workload management enabled
- [x] CSAT survey orchestration ready

## Future Enhancements

1. **Predictive Analytics**: AI-powered SLA breach predictions
2. **Smart Assignment**: ML-based optimal agent assignment
3. **Knowledge Mining**: Automatic knowledge article suggestions based on ticket patterns
4. **Trend Analysis**: Anomaly detection for unusual ticket patterns
5. **Performance Alerts**: Real-time notifications for SLA breaches and high workload

