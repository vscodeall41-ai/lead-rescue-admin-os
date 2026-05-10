# Linear Backlog

Project: Lead Rescue Admin OS

Linear project: https://linear.app/rmdza/project/lead-rescue-admin-os-58600640f4c5

GitHub repository: https://github.com/vscodeall41-ai/lead-rescue-admin-os

Goal: turn the static proof-of-concept into a sellable "stop losing leads" admin automation package for existing small businesses.

## Milestone 1 - Go Live Foundation

1. Public Vercel demo is live
   - Status: Done
   - URL: https://lead-rescue-admin-os.vercel.app
   - Acceptance: public URL returns 200 without Vercel login protection.

2. Create GitHub repository
   - Status: Done
   - Suggested repo: `lead-rescue-admin-os`
   - Acceptance: local repo pushes to GitHub and Vercel is connected to the GitHub repo.

3. Connect Linear, GitHub, and Vercel
   - Status: Linear project and GitHub repo are created; blocked on Vercel GitHub App/connection grant
   - Acceptance: commits and pull requests can reference Linear issue IDs; Vercel deployments are visible from the repo workflow.
   - Required approval: grant Vercel access to `vscodeall41-ai/lead-rescue-admin-os` from the Vercel project Git settings or GitHub Vercel App installation page.

## Milestone 2 - Quote Engine

4. Build local-service quote intake
   - Capture service type, photos, measurements, location, urgency, budget, and source.
   - Acceptance: every lead produces a structured intake brief.

5. Generate quote draft
   - Convert intake into scope, assumptions, exclusions, estimate band, and owner approval checklist.
   - Acceptance: owner can copy a quote draft without rewriting from scratch.

6. Generate material and labour checklist
   - Produce a practical prep list for jobs that require materials, staff, travel, or site access.
   - Acceptance: checklist changes based on service category and urgency.

7. Generate job card
   - Convert accepted quotes into customer, site, scope, deadline, materials, and follow-up notes.
   - Acceptance: job card is ready for the operator or team member.

## Milestone 3 - Admin Automation Package

8. Follow-up reminders
   - Track first reply, quote sent, no-response delay, and next action.
   - Acceptance: each lead has a visible next follow-up date and message.

9. Invoice chasing workflow
   - Draft polite deposit, balance, and overdue payment messages.
   - Acceptance: owner can generate a collections message from lead/job status.

10. Review request workflow
   - Draft WhatsApp and Google Business review request messages after completed work.
   - Acceptance: completed jobs produce review copy and a reminder date.

11. Daily owner summary
   - Summarize hot leads, stale leads, quoted value, follow-ups due, and blocked items.
   - Acceptance: one screen shows what the owner should do today.

## Milestone 4 - Expansion Modules

12. Content repurposing factory
   - Turn job notes and photos into before-after posts, captions, Google Business updates, and quote-request CTAs.
   - Acceptance: each completed job can create three usable posts.

13. Browser workflow automation
   - Automate repeatable admin tasks such as copying leads, checking order status, downloading reports, and reconciling simple records.
   - Acceptance: first client-specific workflow has a repeatable runbook and error-handling notes.

14. Client configuration system
   - Store business profile, services, prices, messages, tone, and owner preferences outside the code.
   - Acceptance: the app can be configured for a new business without editing core JavaScript.
