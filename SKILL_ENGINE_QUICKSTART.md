# Skill Engine - Quick Start Guide

## What is the Skill Engine?

The Skill Engine is an enterprise-grade competency management platform that allows managers and admins to:
- Create and manage unlimited skills without developer involvement
- Define proficiency levels for each skill
- Assign users to skills with levels
- Link certifications to skills
- Connect skills to queues, rules, and automations
- Track usage and impact in real-time
- Version and audit all changes

## Accessing the Skill Engine

Navigate to: **Assignment Engine > Skills**

The Skill Engine page displays a comprehensive table of all skills with columns for:
- Skill Name & Description
- Code (unique identifier)
- Category (Network, Security, Cloud, etc.)
- Proficiency Level Model
- Assigned Users
- Related Queues
- Related Rules
- Status
- Version

## Creating a Skill

### Method 1: Create from Scratch
1. Click the **"Create Skill"** button (top right)
2. Fill in the **General Tab**:
   - **Skill Name**: e.g., "Network Engineering"
   - **Skill Code**: e.g., "NETWORK_ENG" (must be unique)
   - **Description**: What this skill enables
   - **Category**: Select from Masters (Network, Infrastructure, Security, Cloud, Database, Application, Identity, Hardware, Custom)
   - **Status**: Leave as "Draft" initially
3. Configure **Proficiency Levels** tab:
   - System defaults to 5 levels: Beginner → Intermediate → Advanced → Expert → Architect
   - Or create custom levels like L1, L2, L3, L4
4. Assign **Certifications**:
   - Add required certifications (e.g., Cisco CCNA)
   - Mark if Required or Optional
   - Set issue/expiry dates
5. Assign **Users**:
   - Click "Assign User"
   - Select user from dropdown
   - Set proficiency level
   - Mark as Primary or Secondary skill
6. Configure **Eligibility**:
   - Set minimum skill level for assignment eligibility
   - Mark which certifications are required
7. Click **"Save Skill"**

### Method 2: Use a Template
1. Click **"Create Template"** button
2. Select from pre-built templates:
   - L1 Service Desk Agent
   - L2 Support Engineer
   - Network Engineer
   - Security Analyst
   - Cloud Engineer
3. Customize as needed
4. Save - users matching the template get the skills applied

### Method 3: Clone an Existing Skill
1. Find the skill to clone in the table
2. Click the **three-dot menu** (Actions)
3. Select **"Clone Skill"**
4. New skill created with "-CLONE" suffix in status "Draft"
5. Edit and customize as needed

## Assigning Users to Skills

### Individual Assignment
1. Open skill for editing
2. Go to **"User Assignments"** tab
3. Click **"Assign User"**
4. Select user from dropdown
5. Choose proficiency level (Beginner → Expert)
6. Check "Mark as Primary Skill" if appropriate
7. Click **"Assign"**

### Bulk Assignment
1. Use skill template to assign multiple users at once
2. Or use bulk operations in User Assignments tab

### Updating Levels
1. Open User Assignments tab
2. Click the level dropdown for any user
3. Select new level
4. Change is saved immediately

## Managing Certifications

### Add Certification
1. Open skill configuration
2. Go to **"Certifications"** tab
3. Click **"Add Certification"**
4. Select from common certifications or enter custom:
   - Name: e.g., "Azure Administrator"
   - Provider: e.g., "Microsoft"
   - Issue Date: When certification was issued
   - Expiry Date: When certification expires
   - Check "Required" if mandatory for this skill
5. Click **"Add"**

### Remove Certification
1. Click trash icon next to certification
2. Certification is removed from skill

## Configuring Eligibility

### Set Minimum Proficiency
1. Open skill detail view
2. Go to **"Eligibility"** tab
3. Select minimum skill level in dropdown
4. Only users with this level or higher are eligible for tickets requiring this skill

### Set Required Certifications
1. Go to **"Certifications"** tab in configuration
2. Check "This certification is required"
3. Users must have this certification to be eligible

## Queue Mapping

1. Open skill detail view
2. Go to **"Queues"** tab
3. Add queues that require or prefer this skill
4. Set minimum proficiency level for each queue
5. Set priority (Required/Preferred/Optional)

This ensures tickets in that queue are routed to users with appropriate skill levels.

## Skill Templates

### View Templates
1. From Skill Engine main page, scroll to Templates section
2. See all available templates with usage count

### Create Template
1. Click **"Create Template"**
2. Name it (e.g., "L2 Engineer")
3. Select role category
4. Add skills that should be in this template
5. Save

### Use Template
1. Click **"Use"** on template
2. Creates new skill based on template configuration
3. Customize further and save

## Tracking Usage

### View Analytics
1. Open skill detail view
2. Go to **"Analytics"** tab
3. See real-time metrics:
   - Total assigned users
   - Active vs. inactive users
   - Queues using this skill
   - Rules using this skill
   - Automations using this skill
   - Assignment frequency (30-day rolling)

### View Audit Log
1. Go to **"Audit Log"** tab
2. See complete history of:
   - Who created the skill
   - Who made edits
   - Who assigned users
   - When changes occurred
   - What values changed

## Advanced Actions

### Clone Skill
1. Find skill in table
2. Click three-dot menu
3. Select **"Clone Skill"**
4. New draft skill created
5. Edit and republish

### Disable Skill
1. Set status to "Disabled"
2. Skill no longer available for new assignments
3. Existing assignments continue

### Archive Skill
1. Set status to "Archived"
2. Skill hidden from active list
3. Can be recovered via audit log

### View Version History
1. Click skill name to open detail view
2. Go to **"Versions"** tab
3. Compare versions
4. Rollback to previous version if needed

## Bulk Operations

### Export Skills
1. Click **"Export Skills"** button
2. All skills downloaded as JSON file
3. Use for backups or transfer to other environments

### Import Skills
1. Click **"Import Skills"** button
2. Select JSON file previously exported
3. Skills imported with all configurations

### Bulk Update Users
1. Select multiple users in User Assignments tab
2. Click **"Bulk Update Level"**
3. Select new level for all
4. All users updated simultaneously

### Bulk Remove Users
1. Select users in User Assignments tab
2. Click **"Bulk Remove"**
3. All selected users removed from skill

## Best Practices

1. **Use Skill Codes** - Make codes meaningful and consistent (e.g., NETWORK_ENG, not SKILL_001)
2. **Set Minimum Levels** - Always configure minimum proficiency for queue/rule eligibility
3. **Link Certifications** - Connect required certifications for compliance
4. **Version Regularly** - Major changes create versions automatically
5. **Monitor Audit Log** - Track who makes changes and when
6. **Use Templates** - For consistent onboarding of similar roles
7. **Track Analytics** - Understand which skills drive assignments
8. **Verify Users** - Ensure skill assignments are accurate and up-to-date

## Troubleshooting

**Can't find a user to assign?**
- User may already be assigned to this skill
- Check existing assignments in User Assignments tab

**Skill not affecting ticket assignment?**
- Check skill status is "Active" not "Disabled"
- Verify queue mappings are configured
- Check minimum proficiency levels

**Certification requirements not enforced?**
- Mark certification as "Required" in Certifications tab
- Set minimum proficiency level in Eligibility tab
- Ensure users have required certifications

**Need to restore old skill configuration?**
- Go to Versions tab
- Find previous version
- Click "Rollback"
- Old configuration restored

## Support

For help with the Skill Engine:
1. Check SKILL_ENGINE_README.md for technical details
2. Review audit logs for change history
3. Contact your Assignment Engine administrator
