# Phase 3A - Assignment Engine Runtime

## Overview

Phase 3A is the **execution layer** that makes the entire assignment configuration system operational. When a ticket is created, the Assignment Runtime Orchestrator automatically:

1. Routes to appropriate queue
2. Matches required skills
3. Validates agent availability
4. Checks capacity constraints
5. Evaluates assignment rules
6. Selects best agent using weighted scoring
7. Executes assignment
8. Updates workload and dashboards
9. Starts SLA clocks
10. Supports escalations and fallbacks
11. Tracks full audit trail

## Runtime Flow

```
Ticket Created
    ↓
Assignment Runtime Orchestrator
    ↓
Queue Routing Engine → Destination Queue
    ↓
Skill Matching Engine → Eligible Agents
    ↓
Availability Engine → Available Agents
    ↓
Capacity Engine → Capacitated Agents
    ↓
Rule Engine → Rule-Matched Agents
    ↓
Agent Selection Engine → Best Agent (Scored)
    ↓
Assignment Execution
    ↓
Workload Sync ← Dashboard Update ← Reports Update
    ↓
SLA Engine Sync → SLA Clocks Started
    ↓
Audit Engine → Full History Recorded
```

## Components

### 1. Assignment Runtime Orchestrator (`lib/assignment-runtime-orchestrator.ts`)

**Central execution engine** that coordinates all assignment operations.

**Methods:**
- `executeAssignment()` - Main orchestration method
- `routeToQueue()` - Route ticket to appropriate queue
- `matchSkills()` - Match agent skills with requirements
- `filterAvailableAgents()` - Remove offline/away agents
- `validateCapacity()` - Check agent capacity limits
- `evaluateRules()` - Apply assignment rules
- `selectBestAgent()` - Score and select best agent
- `executeAssignmentTransaction()` - Update ticket
- `handleFallback()` - Handle no matching agent
- `handleEscalation()` - Trigger escalation
- `syncWorkloadEngine()` - Update workload
- `syncSLAEngine()` - Start SLA clocks
- `simulateAssignment()` - Test without execution

**Usage:**
```typescript
const result = await assignmentRuntimeOrchestrator.executeAssignment(
  ticket,
  queues,
  agents,
  rules,
  escalations,
  simulationMode
)

if (result.success) {
  console.log(`Assigned to ${result.assignedAgent?.name}`)
  console.log(result.auditTrail) // Full execution trace
}
```

### 2. Escalation Engine (`lib/escalation-runtime-engine.ts`)

**Handles ticket escalation** when no response or SLA breach occurs.

**Methods:**
- `checkNoResponseEscalation()` - Check if escalation needed (60min default)
- `checkSLABreachEscalation()` - Check SLA breach status
- `executeEscalation()` - Execute escalation to next level
- `getEscalationHistory()` - View escalation timeline
- `getCurrentEscalationLevel()` - Get current level

**Escalation Levels:**
```
L1: No Response → Team Lead
L2: Team Lead No Response → Manager
L3: Manager No Response → Director
```

**Usage:**
```typescript
const result = await escalationEngine.checkNoResponseEscalation(
  ticket,
  currentAgent,
  queue,
  rules,
  60 // minutes
)

if (result.escalated) {
  console.log(`Escalated to L${result.escalationLevel}`)
}
```

### 3. Audit Engine (`lib/audit-engine.ts`)

**Comprehensive audit trail** for all assignment decisions.

**Methods:**
- `recordAssignmentDecision()` - Track assignment logic
- `recordEscalation()` - Track escalations
- `recordFallback()` - Track fallback usage
- `recordFailure()` - Track failures
- `recordSimulation()` - Track simulation runs
- `getTicketAuditTrail()` - Full history for ticket
- `getEntriesByType()` - Query by event type
- `getAuditSummary()` - Statistics for date range
- `exportAuditLog()` - Export as JSON
- `clearOldEntries()` - Retention cleanup

**Recorded Information:**
- Queue selected
- Skills evaluated
- Rules applied
- Agent selected
- Capacity used
- Fallback/Escalation/Failure events
- Complete execution trail

**Usage:**
```typescript
auditEngine.recordAssignmentDecision(
  ticketId,
  queueId,
  skillsMatched,
  rulesApplied,
  agentId,
  fallbackUsed,
  escalationTriggered,
  auditTrail
)

const history = auditEngine.getTicketAuditTrail(ticketId)
const summary = auditEngine.getAuditSummary(startDate, endDate)
```

### 4. Assignment Simulation Engine (`components/assignment-simulation-engine.tsx`)

**Manager UI for testing** assignment logic without actual execution.

**Features:**
- Test category/priority/group combinations
- See predicted queue routing
- View skill matching results
- Review rules applied
- Check agent selection scoring
- Understand assignment reasoning
- No actual assignment created

**Usage:**
```typescript
<AssignmentSimulationEngine />
```

## Agent Selection Scoring

### Weighted Scoring Formula

```
Total Score = (Skill Match × 0.40) + (Capacity × 0.25) + 
              (Availability × 0.20) + (Performance × 0.15)
```

### Breakdown

**Skill Match (40%)**
- Required skills present and at sufficient level
- Calculates: matched_skills / required_skills × 100
- Higher skill proficiency = higher score

**Capacity (25%)**
- Current workload vs max capacity
- Calculates: 100 - (active_tickets / max_capacity × 100)
- Lower utilization = higher score

**Availability (20%)**
- Agent status check
- Online = 100, Offline/Away = 0
- Must be active and available

**Performance (15%)**
- SLA compliance rate (50%)
- Customer satisfaction rating (50%)
- Calculates: (sla_compliance + rating_score) / 2
- Historical performance metric

### Example Scoring

```
Agent: Mike Chen
- Skill Match: 95/100 × 0.40 = 38 points
- Capacity: 70/100 × 0.25 = 17.5 points
- Availability: 100/100 × 0.20 = 20 points
- Performance: 90/100 × 0.15 = 13.5 points
─────────────────────────────
Total Score: 89 points
```

## Assignment Strategies

### Round Robin
Assigns to agents in rotating order, ensuring fair distribution.

### Least Loaded
Assigns to agent with lowest current workload.

### Skill Based
Prioritizes agents with highest skill match.

### Priority Based
Assigns critical tickets to most experienced agents.

### Hybrid (Recommended)
Balances skill match, capacity, and performance for optimal results.

## Fallback Handling

When no matching agent found, fallback sequence:

1. **Queue Owner** - Assign to queue owner/lead
2. **Team Lead** - Escalate to team lead
3. **Manager** - Escalate to manager
4. **Unassigned Queue** - Place in queue for manual review

Each step is tracked in audit trail.

## SLA Engine Integration

When assignment completes, SLA clocks start automatically:

```
Critical Priority:  1 hour resolution SLA
High Priority:      4 hours resolution SLA
Medium Priority:    8 hours resolution SLA
Low Priority:       24 hours resolution SLA
```

## Dashboard & Report Updates

Immediately upon successful assignment:
- Agent dashboard updated with new ticket
- Queue dashboard updated with new assignment
- Workload metrics recalculated
- Team dashboard updated
- SLA dashboards updated
- Reports queued for generation

## Simulation Mode

Manager can test assignment logic:

1. Click "Test Assignment" button
2. Enter ticket parameters (category, priority, group)
3. Select required skills
4. Click "Run Simulation"
5. View predicted queue, agent, scoring, and reasoning
6. No actual assignment created
7. Useful for validating rules before production use

## Success Criteria

✓ Ticket creation triggers Assignment Runtime automatically
✓ Queue selected automatically based on category/rules
✓ Skills evaluated for all agents
✓ Agent capacity validated
✓ Best agent selected using weighted scoring
✓ Assignment executed atomically
✓ Workload updated immediately
✓ Dashboards updated immediately
✓ SLA clocks started
✓ Escalations supported
✓ Fallbacks supported
✓ Simulation mode functional
✓ Full audit trail maintained
✓ Metrics tracked (success rate, time, etc.)

## Integration Points

### Input Configuration
- Queue Configuration (from Phase 2A)
- Skill Configuration (from Phase 2B)
- Assignment Rules (from Phase 2C)
- Automation Rules (from Phase 2D)

### Output Updates
- Ticket Assignment Fields
- Agent Workload
- Queue Metrics
- Dashboard State
- Audit Log
- SLA System

## Metrics & Monitoring

Available metrics via `assignmentRuntimeOrchestrator.getMetrics()`:

- `totalAssignments` - Total assignments executed
- `successfulAssignments` - Successful count
- `failedAssignments` - Failed count
- `averageAssignmentTime` - Milliseconds per assignment
- `escalationCount` - Total escalations
- `fallbackCount` - Total fallbacks used

## Error Handling

All errors are caught, logged, and tracked:
- Queue routing fails → Try fallback
- No skill matches → Try fallback
- No capacity available → Queue for later
- Rule evaluation error → Logged, fallback triggered
- Assignment transaction fails → Rolled back, audited

## Performance Optimization

Assignment execution is optimized for speed:
- Parallel skill matching
- Efficient capacity lookup
- Rule short-circuiting
- Agent scoring in single pass
- Async dashboard updates
- Metrics collection non-blocking

## Next Steps

Phase 3B will implement **Automated Workflow Execution** - tickets triggering automated actions based on automation rules created in Phase 2D.
