# Assignment Engine Phase 1D - Quick Start Guide

## 📍 Where to Find Everything

### Rule Management Pages
| Page | Path | Purpose |
|------|------|---------|
| Rules List | `/assignment-engine/rules` | View, filter, sort all rules |
| Create Rule | `/assignment-engine/rules/create` | 5-step wizard to build new rules |
| Priority Engine | `/assignment-engine/rules/priority` | Manage execution order (1-5 levels) |
| Conflict Resolution | `/assignment-engine/rules/conflict` | Choose how to handle rule conflicts |
| Rule Testing | `/assignment-engine/rules/test` | Test rules before deployment |
| Version History | `/assignment-engine/rules/versions` | Track changes and rollback |

---

## 🚀 Quick Workflows

### Create Your First Rule (5 minutes)
```
1. Rules page → "Create Rule" button
2. Step 1: Enter name ("My Custom Rule"), category, priority
3. Step 2: Add trigger ("ticket-created")
4. Step 3: Add condition (priority equals "high")
5. Step 4: Add action ("assign-to-queue")
6. Step 5: Review → "Publish Rule"
```

### Test Before Deployment (2 minutes)
```
1. Create rule in DRAFT status
2. Go to Testing page
3. Select rule + test tickets
4. Click "Run Tests"
5. Review results
6. If passed: Publish rule
7. If failed: Edit and re-test
```

### Manage Rule Priority (30 seconds)
```
1. Priority Engine page
2. See rules organized by level (5=highest)
3. Click up/down arrows to reorder
4. Higher priority rules execute first
```

### Track Changes (1 minute)
```
1. Versions page
2. Browse version history
3. View who changed what and when
4. Click "Rollback" to revert any version
```

---

## 🎯 Key Concepts

### Priority Levels (1-5)
- **5 (Critical):** VIP, emergencies, highest priority
- **4 (High):** Important routing rules
- **3 (Medium):** Standard workflows
- **2 (Low):** Fallback rules
- **1 (Lowest):** Default handling

**Rule:** Higher priority rules execute before lower priority rules.

### Triggers (When Rules Activate)
- Ticket Created
- Ticket Updated
- Priority Changed
- Status Changed
- SLA Breach Risk
- Queue Overflow
- Manual Trigger
- Custom Webhook
- And 5 more...

### Conditions (Decision Logic)
- Field (priority, category, queue, etc.)
- Operator (equals, contains, greater-than, etc.)
- Value (comparison value)
- Logic: AND/OR operators, nested groups

### Actions (What Happens)
- Assign to Agent
- Assign to Queue
- Escalate
- Send Notification
- Update Field
- Add Tag
- Custom Actions

### Conflict Resolution (Multiple Matches)
- **First Match Wins** (RECOMMENDED): Execute first rule, stop
- **Last Match Wins**: Execute last rule only
- **Execute All**: Run all matching rules
- **Stop After Match**: Execute then stop

---

## 💡 Best Practices

### Do's ✓
- Use descriptive rule names ("VIP Customer Fast Track")
- Include change description when updating
- Test rules before publishing
- Use priority levels strategically (don't overuse P5)
- Review audit trail for change tracking
- Keep conditions simple and readable

### Don'ts ✗
- Don't create duplicate rules
- Don't use vague rule names ("Rule 1")
- Don't publish without testing
- Don't put all rules at same priority
- Don't ignore version history
- Don't create overly complex conditions

---

## 📊 Pre-configured Rules

### 1. Skill-Based Routing (P5)
Routes tickets to agents with matching skills. Live with 1,523 executions, 94% success.

### 2. VIP Fast Track (P5)
Immediate routing of VIP customers to specialists. 287 executions, 98% success.

### 3. Workload Balancing (P4)
Even distribution of tickets across available agents. 2,341 executions, 91% success.

### 4. After-Hours Escalation (P3)
Draft rule for escalating critical tickets after business hours.

### 5. SLA Risk Mitigation (P4 - Disabled)
Reassigns at-risk tickets to senior agents. Ready to enable when needed.

---

## 🔧 Troubleshooting

### Rule Not Triggering?
1. Check trigger selection (correct event?)
2. Verify conditions match actual ticket data
3. Check rule status is "active" not "draft"
4. Test with Testing page
5. Review execution metrics

### Wrong Rule Executing?
1. Check priority levels (higher executes first)
2. Review conflict resolution strategy
3. Test with Testing page
4. Check condition logic
5. View version history for changes

### Performance Issues?
1. Check rule condition complexity
2. Review average execution time (Testing page)
3. Simplify conditions if needed
4. Reduce number of nested groups
5. Contact support for optimization

---

## 📈 Monitoring

### Key Metrics
- **Execution Count:** How many times rule matched
- **Success Rate:** % of successful executions
- **Average Execution Time:** How long rule takes to execute

### Where to Find Metrics
- Rules List page: Top right of each rule row
- Testing page: After running tests
- Versions page: Per-version performance data

---

## 🔐 Access & Permissions

- **Create/Edit Rules:** Managers and Admins
- **Publish Rules:** Admins only
- **Test Rules:** Managers and Admins
- **View Audit Trail:** All users
- **Rollback Versions:** Admins only

---

## 📞 Need Help?

### Documentation
- See full implementation: `PHASE-1D-RULE-BUILDER-COMPLETE.md`
- Type definitions: `lib/types.ts`
- Architecture: Architecture section above

### Common Questions

**Q: Can I create unlimited rules?**
A: Yes! No limit on number of rules.

**Q: What if two rules match?**
A: Depends on conflict resolution strategy. First Match Wins is recommended.

**Q: Can I edit a rule while it's active?**
A: Yes, but best practice is to test first.

**Q: How do I undo a rule change?**
A: Go to Versions page → select previous version → Rollback.

**Q: Can managers create rules without developers?**
A: Yes! Complete manager self-service with 5-step wizard.

**Q: What's the difference between Draft and Active?**
A: Draft rules are saved but not executing. Active rules are live.

---

## 🎓 Learning Path

**Beginner (30 min)**
1. Review 5 default rules on Rules page
2. Read quick start guide (this document)
3. Explore each page to understand UI

**Intermediate (1 hour)**
1. Create your first simple rule
2. Test rule with Testing page
3. Manage priority levels
4. Review version history

**Advanced (2 hours)**
1. Create complex multi-condition rules
2. Test rule combinations
3. Implement conflict resolution strategies
4. Set up rule templates for team

---

**Happy Rule Building!**

All assignment logic is now in your hands. Create unlimited rules, test safely, and activate with confidence.
