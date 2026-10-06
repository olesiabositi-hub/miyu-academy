# MIYU Academy — Analytics Plan
## Step 25/30 — PROPOSED FINAL PRODUCT SPEC

**Course:** `greek-mythology`  
**Status:** ready for approval  
**Goal:** understand whether learners start, progress, finish, pass and use the credential — without turning MIYU into a surveillance product.

Analytics must help answer product questions such as:

```text
Do people start the course?
Where do they stop?
Which modules take longer to complete?
Do learners return?
Do they reach the Final Myth Decoder?
How many attempts are usually needed?
Do they issue/download/share the certificate?
Does RU/EN usage differ?
```

It must **not** become a second source of truth for learner progress.

---

# 1. Analytics architecture

Use two distinct data layers.

## Product truth

Supabase remains authoritative for:

- learner identity;
- module status;
- completion timestamps;
- Final Decoder attempts/scores/pass;
- certificate issuance/status.

## Product analytics

Event stream is used for:

- funnels;
- behavior patterns;
- UX effectiveness;
- aggregate reporting;
- experimentation later.

Rule:

```text
Analytics can describe what happened.
Analytics does not decide what happened.
```

Never unlock a certificate based on an analytics event.

---

# 2. Vendor-neutral event model

Define MIYU’s own event contract first.

Then send the same validated events to whatever product analytics layer is selected.

This avoids hard-coding the product around a vendor-specific naming model.

The schema should remain compatible with tools such as:

- PostHog;
- GA4;
- another event warehouse later.

No vendor decision is required to approve Step 25.

---

# 3. Event naming convention

Use:

```text
snake_case
```

Examples:

```text
course_started
module_opened
module_completed
final_decoder_started
certificate_issued
```

Prefer past-tense events for completed actions.

Do not create:

```text
ClickButtonBlue
screen2_action
event_983
```

---

# 4. Stable event identity

Analytics uses technical identifiers from Steps 18/23:

```text
course_id = greek-mythology
module_id = module-04
question_id = FMD-07
content_version = gm-v1
```

Do not rely on localized titles as IDs.

This allows RU/EN comparisons without fragmenting the same course entity.

---

# 5. Global event properties

Where relevant, include:

```text
course_id
locale
content_version
app_version
device_class
session_id
```

Only send properties that are useful.

Do not attach every possible context field to every event.

---

# 6. Analytics learner identity

Before sign-in:

```text
anonymous_session_id
```

or analytics platform equivalent.

After sign-in:

use a separate pseudonymous:

```text
analytics_user_id
```

not:

- email;
- learner name;
- certificate name;
- public Certificate ID;
- verification token.

Do not expose the raw Supabase auth UUID to third-party analytics unless there is a compelling implementation reason and privacy review approves it.

---

# 7. Identity merge

If the chosen analytics tool supports anonymous → signed-in identity merge, use it only to understand the public Course Overview → course-start funnel.

Do not merge unrelated historical browsing indefinitely merely because technically possible.

Privacy/legal basis and consent behavior are finalized in Step 26.

---

# 8. PII prohibition

Never send into product analytics:

```text
email
full name
certificate name
Certificate ID
verification token
auth UUID where avoidable
raw quiz answer text
selected option text
free-text form data
support messages
```

Certificate issuance event means:

```text
certificate_issued = true
```

not:

```text
certificate_id = MIYU-GM-...
```

---

# 9. Answer-data policy

## Quick Check / Self-check

Allowed aggregate event property:

```text
is_correct = true | false
```

Allowed:

```text
check_id
module_id
```

Do not send:

- answer text;
- option text.

This allows question-quality analysis without collecting unnecessary content payload.

## Final Myth Decoder

During active attempt:

do **not** send correctness.

Allowed:

```text
question_id
question_number
category
answer selected event
```

No selected option identity needs to leave the product backend.

After submission, aggregate score/category totals may be sent.

---

# 10. Why Final Decoder active correctness is excluded

The Final Decoder is credential-critical.

Keeping per-question correctness out of general product analytics reduces:

- answer-key leakage;
- unnecessary data;
- accidental reconstruction of individual assessment history.

Supabase attempt data remains the appropriate product record where needed.

---

# 11. Core public funnel

Primary acquisition-to-learning funnel:

```text
Course Overview viewed
↓
Course started
↓
Module 1 opened
↓
Module 1 completed
↓
...
↓
8 / 8 modules completed
↓
Final Myth Decoder started
↓
Final Myth Decoder passed
↓
Certificate issued
```

This is the core course funnel.

Do not define “conversion” only as certificate issuance; intermediate drop-off matters.

---

# 12. Core course KPIs

Recommended V1 metrics:

```text
Course start rate
Module 1 completion rate
Module-to-module completion rate
8/8 module completion rate
Final Decoder start rate
Final Decoder pass rate
Median attempts to first pass
Certificate issuance rate
Certificate download/share rate
Return/resume rate
RU vs EN usage
```

Avoid dozens of vanity metrics.

---

# 13. Course start rate

Conceptually:

```text
course_started
/
course_overview_viewed
```

Segment carefully:

- signed-in vs anonymous;
- locale;
- traffic source later if consented/available.

Do not interpret this as marketing performance without adequate acquisition context.

---

# 14. Module completion rate

For each module:

```text
unique learners who completed module
/
unique learners who opened module
```

Also useful:

```text
module completed
/
course starters
```

These answer different questions.

---

# 15. Sequence analysis

Because Step 20 allows out-of-order modules, analytics should not assume:

```text
M1 → M2 → M3
```

for every learner.

Track:

```text
entry_point
```

on `module_opened`.

Examples:

```text
continue
dashboard
next_module
direct_link
course_drawer
recommended_next
```

This lets us understand real learner behavior without labelling out-of-order use as failure.

---

# 16. Out-of-order metric

Optional useful metric:

```text
% of learners who open a higher-numbered module
before completing the recommended next module
```

Use this to learn about navigation/product design.

Do not use it to penalize learners.

---

# 17. Return/resume behavior

Key events:

```text
module_resume_restored
final_decoder_resumed
```

Useful metrics:

- learners returning after 1+ day;
- modules most often resumed;
- percentage of started Final Decoder attempts that are resumed.

Exact retention windows can be chosen in reporting, not embedded into events.

---

# 18. Reading progress telemetry

Do **not** send continuous scroll events.

Do not track every:

```text
scroll %
block entered
pixel position
```

by default.

This is noisy and privacy-costly.

Preferred V1:

- module opened;
- module completed;
- resume restored;
- Quick/Self-check interactions.

If later a specific content problem needs diagnosis, temporary sampled checkpoints can be introduced.

---

# 19. Semantic block tracking

Earlier architecture allowed `semantic_block_reached`.

Step 25 recommendation:

**Do not enable it globally in V1.**

Reason:

- 64 Visual Stops + many sections could create a high-volume event stream;
- module completion and checks already provide meaningful engagement signals;
- it risks turning reading into detailed surveillance.

Keep the technical hook available for limited debugging/research.

---

# 20. Visual Stop analytics

Default:

```text
no impression event
```

Possible future experiment:

```text
visual_stop_interacted
```

only for a genuinely interactive Visual Stop.

Static artwork does not need analytics merely because it was visible.

---

# 21. Quick Check analytics

Event:

```text
quick_check_submitted
```

Properties:

```text
course_id
module_id
check_id
is_correct
locale
```

Useful outputs:

- question difficulty;
- confusing checks;
- locale differences.

Do not show learner grades from this data.

---

# 22. Self-check analytics

Same principle:

```text
self_check_submitted
```

Question-level aggregate correctness is acceptable.

Useful for editorial QA:

```text
Which self-check question has unusually low correctness?
```

This may indicate:

- content is unclear;
- question wording is unclear;
- answer mapping is wrong.

It does not automatically mean the learner is weak.

---

# 23. Final Decoder unlock

Prefer server-side event:

```text
final_decoder_unlocked
```

emitted when backend confirms 8/8 completed.

Do not depend on a browser animation to count unlocks.

---

# 24. Final Decoder start

Server-backed event:

```text
final_decoder_started
```

Properties:

```text
attempt_number
locale
content_version
```

This counts actual attempt creation, not clicking a decorative button that failed.

---

# 25. Final Decoder question event

Optional but useful:

```text
final_decoder_question_answered
```

Properties:

```text
question_id
question_number
category
locale
changed_existing_answer
```

Do not send:

```text
selected_source_index
is_correct
```

during the active attempt.

If event volume proves unnecessary, this can be omitted without damaging core reporting.

---

# 26. Final Decoder review

Event:

```text
final_decoder_review_opened
```

Property:

```text
answered_count
```

This helps identify whether learners reach the review step.

No answer details.

---

# 27. Final Decoder submit

Canonical server event:

```text
final_decoder_submitted
```

Properties:

```text
attempt_number
score
percent
result = almost_there | passed
Recognition score
Meaning score
Connection score
locale
content_version
```

This is the main assessment event.

---

# 28. Assessment metrics

Recommended:

```text
First-attempt pass rate
Overall eventual pass rate
Median attempts to first pass
Score distribution
Category score distribution
Abandoned active-attempt rate
```

Do not publish individual rankings.

---

# 29. Question-level assessment analytics

V1 recommendation:

Do **not** put per-question correctness into general analytics.

If editorial QA later needs item analysis:

- run it from controlled backend assessment data;
- aggregate it in a restricted internal analysis;
- do not send answer-level history to general product analytics.

This is a stronger privacy boundary.

---

# 30. Almost There funnel

Track:

```text
final_decoder_submitted(result=almost_there)
↓
recommended module opened
↓
final_decoder_retake_started
↓
passed
```

This is useful for checking whether module recommendations actually help.

Do not track the exact wrong answers in the analytics funnel.

---

# 31. Certificate funnel

Core:

```text
certificate_flow_opened
↓
certificate_name_confirmed
↓
certificate_issued
↓
certificate_pdf_downloaded
or
certificate_link_copied
or
certificate_linkedin_clicked
or
certificate_shared
```

This tells us whether the credential experience is actually useful.

---

# 32. Certificate name privacy

Event:

```text
certificate_name_confirmed
```

means only:

```text
confirmation happened
```

Never send the confirmed name value.

---

# 33. Certificate issued

Prefer server-side event.

Properties:

```text
course_id
locale
content_version
```

Never send:

```text
Certificate ID
verification token
learner name
```

---

# 34. Certificate verification analytics

Public verification may emit an aggregate server event:

```text
certificate_verified
```

Properties:

```text
course_id
locale
verification_status = valid | revoked | not_found
```

Do not send:

- token;
- Certificate ID;
- learner name.

Do not use verification traffic to create a public popularity score.

---

# 35. Download/share metrics

Track action, not destination contents.

Examples:

```text
certificate_pdf_downloaded
certificate_link_copied
certificate_shared
certificate_linkedin_clicked
```

`share_method` may be:

```text
native_share
fallback
```

Do not attempt invasive tracking on what the learner does after leaving MIYU.

---

# 36. Language analytics

Track:

```text
locale
language_switched
```

Useful:

- % RU / EN course use;
- how often learners switch inside a lesson;
- where language switches occur by route type.

Do not infer nationality or ethnicity from language choice.

---

# 37. Device analytics

Use coarse:

```text
device_class = mobile | tablet | desktop
```

Avoid unnecessary fingerprinting.

Detailed hardware/browser data can stay within normal technical logs where needed.

Do not create a unique device fingerprint.

---

# 38. Traffic-source analytics

For public Course Overview:

capture standard campaign attribution only if allowed by Step 26 consent/privacy policy.

Examples:

```text
utm_source
utm_medium
utm_campaign
```

Normalize known values.

Do not propagate UTM parameters through the learning journey.

---

# 39. Reliability telemetry

Product analytics may include low-volume reliability events:

```text
sync_error_shown
sync_recovered
```

Properties:

```text
surface
operation
```

Examples:

```text
surface = final_decoder
operation = autosave
```

No answer payload.

Technical exceptions themselves belong in error monitoring/logging, not product analytics.

---

# 40. Product analytics vs error monitoring

Keep separate systems conceptually.

## Product analytics

```text
What did learners do?
```

## Error monitoring

```text
What broke?
```

Do not dump stack traces into analytics events.

Do not put learner PII into error logs either.

---

# 41. Server vs client events

Prefer server emission when the business event needs authoritative truth.

Server-preferred:

```text
module_completed
final_decoder_unlocked
final_decoder_started
final_decoder_submitted
certificate_issued
certificate_verified
```

Client is appropriate for:

```text
module_opened
language_switched
review_opened
link copied
share clicked
```

This minimizes false success events.

---

# 42. Event deduplication

Every event that can be retried should support deduplication.

For authoritative server events use a stable event key conceptually based on:

```text
event type
domain record ID / attempt ID
state transition
```

Do not double-count:

- duplicate module completion POST;
- double Final Decoder submit;
- certificate issuance retry.

---

# 43. Session definition

Use the analytics provider’s standard session concept where reasonable.

Do not make course completion depend on session boundaries.

Learning can span:

- days;
- devices;
- browsers.

Learner-level funnel metrics should use pseudonymous user identity, not a single session.

---

# 44. Time-to-completion

Useful metrics may be derived from authoritative timestamps:

```text
course_started_at
first_passed_at
module started_at/completed_at
```

Prefer backend timestamps over reconstructing duration from analytics sessions.

Session duration is not reliable learning time.

---

# 45. “Time spent” policy

Do **not** promote:

```text
time spent in lesson
```

as a primary KPI.

A long session can mean:

- engagement;
- interruption;
- open tab;
- difficulty.

If used for research later, treat cautiously and aggregate.

---

# 46. Dashboard for MIYU internal analytics

Recommended internal dashboard sections:

## Funnel
Course Overview → Start → 8/8 → Final pass → Certificate

## Modules
Opened / completed / completion rate by module

## Assessment
Starts / submissions / first-pass / eventual-pass / attempts / category scores

## Credential
Ready → issued → download/share actions

## Language/device
RU/EN and mobile/tablet/desktop splits

## Reliability
Sync-error recovery rate

Do not make learner-level browsing the default dashboard view.

---

# 47. Module drop-off interpretation

Flag possible product/content issues when a module has:

- high open rate;
- materially lower completion;
- repeated resume behavior;
- unusually low Self-check correctness.

But analytics should produce a question:

```text
Why is Module 6 harder to finish?
```

not an automatic conclusion.

Qualitative review remains necessary.

---

# 48. Cohort analysis

Useful future cohorts:

```text
course start week
locale
device class
traffic source
```

Avoid sensitive segmentation.

Do not create cohorts based on inferred ethnicity, nationality, health, or similar attributes.

---

# 49. Retention

For a single finite course, useful return metrics:

```text
returned within 1 day
returned within 7 days
resumed after leaving mid-module
resumed Final Decoder attempt
```

Do not optimize for daily streak retention.

The goal is successful learning completion, not compulsive daily usage.

---

# 50. No dark patterns in analytics goals

Do not optimize MIYU toward:

- maximizing screen time;
- maximizing clicks;
- forcing notifications;
- artificial daily engagement.

Primary success = learning progression + meaningful completion + credential use.

---

# 51. Event versioning

Add an internal analytics schema version if the event contract evolves.

Example:

```text
analytics_schema_version = 1
```

Do not silently change a property’s meaning.

If:

```text
module_completed
```

changes definition, create a schema migration/version note.

---

# 52. Content versioning

Always attach:

```text
content_version = gm-v1
```

to learning/assessment events where interpretation depends on content.

If future `gm-v2` changes assessment or module copy:

analytics can separate cohorts correctly.

---

# 53. App version

Attach deployment/app version to technical event context where possible.

Useful for:

- debugging regressions;
- rollout comparison.

This is not learner-facing.

---

# 54. Data retention

Step 26 will finalize legal/privacy retention.

Step 25 product recommendation:

- keep raw event retention finite;
- retain aggregate reports longer;
- do not keep detailed event histories forever merely because storage is cheap.

Assessment/credential product records follow their own operational retention, separate from analytics.

---

# 55. Consent-aware implementation

Analytics architecture must be capable of:

```text
analytics enabled
analytics disabled
```

without breaking:

- progress;
- assessment;
- certificate;
- verification.

No essential product function may depend on optional analytics cookies/scripts.

Step 26 determines what requires consent and how the banner/settings behave.

---

# 56. First-party fallback

Even if optional analytics is disabled, core product records still contain enough operational truth to answer:

```text
modules completed
Final Decoder passed
certificate issued
```

This is intentional.

MIYU must still function fully.

---

# 57. Analytics QA

Before launch validate:

1. event fires once where expected;
2. server events do not double-count retries;
3. client events do not fire on prefetch;
4. test/staging traffic is separable or excluded;
5. locale is correct;
6. module ID is stable;
7. content version is present;
8. no PII is present;
9. no certificate token/ID leaks;
10. raw answer text is absent;
11. result properties match backend truth;
12. disabled analytics does not break UX.

---

# 58. Debug mode

Development/staging may have an analytics debug panel/log.

It should show:

```text
event name
properties
source
```

to developers.

Never expose it in production learner UI.

---

# 59. Event catalog ownership

Keep a machine-readable event spec in the repo.

Example:

```text
/analytics/event-schema.json
```

Every new production event requires:

- purpose;
- owner;
- required properties;
- privacy review;
- QA.

Avoid ad hoc events added directly inside components.

---

# 60. Step 25 acceptance criteria

Step 25 is correct if:

1. Supabase product data remains source of truth.
2. Analytics is vendor-neutral at the product-contract level.
3. Events use stable snake_case naming.
4. Technical IDs are used instead of translated titles.
5. Learner analytics identity is pseudonymous.
6. Email/name/certificate data never enters product analytics.
7. Raw answer text is never tracked.
8. Module checks may track aggregate correctness by stable check ID.
9. Final Decoder active per-question correctness is not sent to general analytics.
10. Final Decoder aggregate result is tracked server-side.
11. Course funnel covers Overview → Start → 8/8 → Pass → Certificate.
12. Module completion rates can be measured.
13. Out-of-order behavior is supported analytically.
14. Continue/resume behavior can be measured.
15. Continuous scroll tracking is excluded from V1.
16. Semantic-block impressions are not globally enabled.
17. Static Visual Stops do not fire view events by default.
18. Assessment first-pass/eventual-pass/attempt metrics are measurable.
19. Almost There → module review → retake funnel is measurable.
20. Certificate issue/download/share actions are measurable.
21. Certificate verification analytics never include token/name/ID.
22. Locale and coarse device class may be analyzed.
23. Language choice is never treated as nationality.
24. Server emits authoritative business-state events where possible.
25. Retries/double-clicks do not double-count.
26. Backend timestamps are preferred for time-to-completion.
27. Screen time is not a core success KPI.
28. Analytics dashboard focuses on aggregate product behavior.
29. No sensitive cohorts are created.
30. Product goals avoid addictive/dark-pattern engagement metrics.
31. Content version accompanies content-sensitive analytics.
32. Event schema is versioned.
33. Analytics can be disabled without breaking the course.
34. Raw event retention is finite.
35. Event catalog is machine-readable and centrally governed.
36. Pre-launch QA checks event accuracy and PII leakage.

---

# 61. Proposed fixed decisions for approval

If approved, Step 25 locks:

- product/credential state remains authoritative in Supabase, never analytics;
- event design is vendor-neutral and can feed PostHog/GA4/another tool later;
- analytics event names use snake_case;
- use pseudonymous analytics identity, never learner name/email/certificate token;
- no raw answer text or selected option text is sent to analytics;
- Quick Check/Self-check may send `is_correct` by stable check ID;
- Final Decoder question events, if enabled, contain question/category/position but no selected answer or correctness during the active attempt;
- Final Decoder submission is a canonical server-side analytics event containing total/category scores and pass state;
- core funnel = Course Overview → Course Start → 8/8 modules → Final Decoder pass → Certificate issued;
- module open/completion, resume behavior and out-of-order entry point are measured;
- continuous scroll/block-impression surveillance is not enabled in V1;
- static Visual Stops have no analytics impression by default;
- assessment metrics include first-pass rate, eventual-pass rate and attempts-to-pass;
- certificate metrics include issue, PDF download, copy-link, share and LinkedIn actions;
- public certificate verification analytics are aggregate and contain no credential identifier;
- language and coarse device class are allowed contextual properties;
- server emits authoritative transition events when possible;
- event retries are deduplicated;
- time-to-completion uses backend timestamps rather than session duration;
- time-on-page is not a primary KPI;
- analytics is consent-capable and optional analytics must never be required for course functionality;
- machine-readable event schema is maintained centrally;
- `content_version` is attached to content-sensitive events;
- retention/privacy/legal details are finalized in Step 26.

---

# 62. Deferred intentionally

Next:

- **Step 26 — Privacy / legal minimum**

Later:

- final analytics implementation and dashboard wiring → build phase;
- event validation in vertical slice → Step 28;
- rendered/production QA → Step 29.
