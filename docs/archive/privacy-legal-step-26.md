# MIYU Academy — Privacy / Legal Minimum
## Step 26/30 — PROPOSED FINAL PRODUCT SPEC

**Course:** `greek-mythology`  
**Status:** ready for approval

> This is a product/compliance specification, not jurisdiction-specific legal advice. Final public legal text must be reviewed against the actual controller entity, hosting/processor locations, launch countries, payment model and selected vendors.

MIYU should be designed around:

```text
collect less
separate core service data from optional analytics
keep private learning private
make certificate exposure explicit
make deletion/export possible
document processors
secure the data
```


# 1. Regulatory baseline

Build to a GDPR-grade baseline for an EU-facing launch, even if the operator is established elsewhere. Offering an online service to people in the EU can fall within GDPR territorial scope even when the service is free.

Final launch review must also consider the controller's home law, launch markets, cookie/ePrivacy rules, child-privacy rules and consumer law if the course becomes paid.

# 2. Controller identity — launch blocker

Before production launch, Privacy Notice and Terms must contain the actual:

```text
legal name
business/registered address
country of establishment
privacy contact
support contact
```

Add DPO contact only if applicable. If a non-EU controller is within GDPR Article 3(2), assess whether Article 27 requires an EU representative. Do not publish placeholder legal identity.

# 3. V1 age policy

Recommended:

```text
Accounts are for users aged 16+.
```

Public pages may be viewed without an account. MIYU is a general-audience cultural/educational service, not a child-directed service.

Do not collect date of birth solely for this gate. Use a neutral confirmation such as:

```text
I confirm that I am at least 16 years old.
```

Store only an audit field such as:

```text
age_16_plus_confirmed_at
```

If MIYU later wants under-16 learners, that requires a separate child-privacy/parental-consent design and legal review.

# 4. Terms and Privacy acknowledgment

At first account creation/sign-in completion:

```text
By creating an account, you agree to the Terms of Use and acknowledge the Privacy Notice.
```

Privacy Notice acknowledgment is not consent to all processing. Optional analytics/marketing consent must remain separate.

# 5. V1 data inventory

MIYU may process:

**Account/authentication**
- email
- session/auth metadata
- account timestamps

**Profile/preferences**
- preferred locale
- 16+ confirmation timestamp

**Learning progress**
- course/module IDs and states
- started/completed timestamps
- resume block/position
- Quick Check/Self-check state

**Final Myth Decoder**
- attempt ID
- question/option order
- selected source-answer indices
- current position
- total/category scores
- pass state
- attempt timestamps

**Certificate**
- confirmed certificate name
- completion date
- Certificate ID
- verification token
- status
- render language
- issuance timestamp

**Technical/security**
- IP/request/authentication logs where infrastructure requires them
- coarse device/browser technical data

**Optional analytics**
- only the pseudonymous event model approved in Step 25.

# 6. Data MIYU does not need in V1

Do not collect by default:

```text
postal address
phone
precise location
date of birth
gender
passport/ID
employer
contacts/address book
health data
political/religious data
biometric/genetic data
```

Do not intentionally request GDPR special-category data.

# 7. Processing-purpose map

**Core account/course/progress/assessment/certificate**  
Use the legally appropriate service basis; provisional product assumption is necessity to provide the requested service/contract. Final basis must be confirmed in the Privacy Notice.

**Security/abuse prevention**  
Likely legitimate interests and/or applicable legal obligations.

**Optional analytics**  
Privacy-first V1: consent-capable and non-essential. MIYU can apply the same opt-in behavior globally for predictability.

**Marketing email**  
Not required for V1. If added later: separate opt-in, unchecked by default, easy unsubscribe.

Do not use revocable analytics consent as the basis for storing core course progress.

# 8. Privacy Notice

Public route:

```text
/{locale}/privacy
```

Must cover:

1. controller identity/contact;
2. categories of data;
3. collection sources;
4. purposes;
5. legal bases where applicable;
6. processors/recipient categories;
7. international transfers/safeguards;
8. retention;
9. user rights;
10. privacy-request method;
11. complaint rights where applicable;
12. cookies/local storage/analytics;
13. certificate verification behavior;
14. 16+ age policy;
15. automated Final Decoder scoring;
16. effective/update date.

Provide EN and RU versions describing the same processing.

# 9. Cookies / local storage

**Strictly necessary**
- authentication/session
- security
- language preference
- consent preference

**Optional analytics**
- vendor-dependent identifiers/storage

**Advertising**
- none in V1

**Marketing trackers**
- none in V1

Recommended optional-analytics consent UI:

```text
Essential only
Allow analytics
Preferences
```

Refusal and acceptance should have comparable prominence. No pre-ticked analytics, consent wall or dark pattern.

Provide a persistent:

```text
Privacy settings
```

control. Withdrawal must be as easy as granting consent, and course functionality must remain unchanged.

A “cookieless” analytics mode is not automatically exempt from privacy/consent analysis.

# 10. No sale / behavioural ads

V1 product position:

```text
No sale of learner personal data.
No third-party behavioural advertising.
No ad-tech tracking stack.
No session replay.
```

Any future change requires a new privacy review first.

# 11. Processor / vendor inventory

Maintain an internal register for:

```text
database/auth
hosting/CDN
transactional email/auth email
optional analytics
error monitoring
PDF/file generation/storage
```

For each:

```text
legal entity
purpose
data categories
processing locations
subprocessors
DPA status
transfer mechanism
retention/config
```

Where a provider is a processor, an appropriate DPA/processor agreement is a launch requirement.

Prefer an EEA/EU primary region for database/auth data where operationally available, while documenting any other transfers honestly.

# 12. International transfers / EU representative

If EEA personal data is transferred outside the EEA, identify the applicable safeguards where required.

Do not claim “all data stays in Europe” unless the complete vendor/subprocessor chain supports it.

If the controller is outside the EU and deliberately offers MIYU to EU learners, assess Article 27 EU-representative applicability before launch; do not assume the exception.

# 13. Certificate privacy

The credential is:

```text
unlisted
noindex
accessible to anyone who has the random verification link/QR
```

Public verification shows only:

```text
certificate name
course title
completion date
Certificate ID
valid/revoked status
```

Never expose:

```text
email
auth UUID
score
attempt count
progress
analytics identity
```

Before `Generate my certificate`, show a concise privacy notice.

**EN concept**

```text
Your certificate is unlisted. Anyone with its verification link or QR code can view your certificate name, course, completion date, Certificate ID and status.
```

**RU concept**

```text
Сертификат не индексируется в поиске. Любой, у кого есть ссылка или QR-код для проверки, сможет увидеть имя в сертификате, название курса, дату завершения, ID сертификата и его статус.
```

This does not alter the locked certificate artwork. No extra checkbox is required in V1 unless final legal review requires one.

There is no public learner/certificate directory and no search by name/email/Certificate ID.

# 14. Certificate + account deletion

Recommended flow for an issued certificate:

```text
Delete account
↓
Choose credential treatment
```

**Option A — keep certificate verifiable**  
Delete normal account/progress/assessment data under retention rules, but retain only the minimal credential record:

```text
certificate name
course
completion date
Certificate ID
verification token
status
```

**Option B — remove/revoke public verification**  
Delete the account and remove/revoke active public credential verification under the applicable policy.

If the learner does not clearly elect retention, privacy-by-default should prevail rather than silently keeping identifying public verification forever.

“Permanent certificate” means stable ID/date/token while active, not immunity from lawful deletion rights.

# 15. Proposed retention schedule

| Data | V1 proposal |
|---|---|
| Account/profile/progress | While active; target deletion/anonymisation within 30 days of verified deletion request |
| Active Final Decoder attempt | Until completed, superseded under product logic, or account deletion |
| Completed-attempt detailed answers | Up to 12 months |
| Assessment summary/pass state | While account active, subject to deletion |
| Certificate record | While learner chooses verification to remain active; can outlive account only through explicit minimal-credential retention choice |
| Security/auth logs | Normally 30–90 days |
| Raw optional analytics | Up to 12 months |
| Anonymous aggregate analytics | May be retained longer |
| Support requests | ~12 months after closure |
| Backups | Target rotation/expiry ≤35 days, or disclose actual provider cycle |

Deleted data may remain in encrypted backups until normal rotation but should not be restored into ordinary active use except disaster recovery.

# 16. Account deletion / export / correction

Preferred V1 `/{locale}/account` controls:

```text
Privacy settings
Download/request my data
Delete account
Sign out
```

Deletion should use re-authentication/verification and clearly explain consequences.

Support a machine-readable export/request containing, where applicable:

- profile/preferences;
- module progress;
- completion timestamps;
- assessment summary;
- certificate metadata.

Do not include secrets unnecessarily.

Certificate name correction follows Step 12: same credential record/ID/token/date, corrected display name.

# 17. Privacy-right workflow

Support requests for access, rectification, erasure, restriction, portability, objection and consent withdrawal where applicable.

Use proportionate identity verification; do not request ID documents by default if authenticated account verification is sufficient.

For a GDPR-style process:

```text
respond without undue delay
normally within one month
```

The Privacy Notice should explain complaint routes to the applicable supervisory authority.

# 18. Automated assessment transparency

Disclose:

```text
15 questions
12/15 required
fixed answer key
automatic scoring
unlimited attempts
```

The result determines MIYU course-certificate eligibility only. It is not an employment, university-admissions, credit, medical or psychological decision.

Provide a contact path if a learner believes a scoring/technical error occurred.

# 19. Credential meaning

Terms should state that the MIYU certificate:

- confirms successful completion under MIYU’s published course criteria;
- is not a government degree;
- is not a university qualification unless a future formal partnership explicitly says so;
- does not guarantee professional competence or employment.

# 20. Terms of Use — minimum

Public route:

```text
/{locale}/terms
```

Minimum sections:

1. operator identity;
2. 16+ eligibility;
3. account responsibility;
4. personal course-access license;
5. intellectual property;
6. acceptable use;
7. assessment/certificate rules;
8. certificate integrity/misuse;
9. third-party names/trademarks;
10. service availability/changes;
11. suspension for abuse/security;
12. appropriate educational-service disclaimers;
13. liability wording reviewed for applicable consumer law;
14. governing law/jurisdiction;
15. Terms changes;
16. contacts.

Do not claim ownership of third-party public-domain works or trademarks.

Normal sharing of a learner’s genuine certificate is allowed; forging or misrepresenting credentials is not.

# 21. Paid model — deferred

Before any paid launch, add and legally review:

```text
price/currency
taxes
payment processor
refunds
cancellation/withdrawal rights
digital-content disclosures
subscription renewal if relevant
```

Do not reuse free-course Terms unchanged for paid sales.

# 22. Third-party embeds

V1 recommendation: avoid embeds that silently load trackers.

For future YouTube/Spotify/maps/social embeds use:

- privacy-enhanced/click-to-load behavior; or
- appropriate consent; or
- a normal outbound link.

# 23. Error monitoring

If used:

- scrub email/name/token/secrets;
- do not attach full DB rows;
- do not capture assessment/certificate payload unless technically necessary;
- set finite retention;
- document processor/vendor.

# 24. Security baseline

Launch requires:

- row-level access controls/RLS;
- learner-owned private records;
- service-role secrets server-side only;
- certificate issuance server-side;
- assessment scoring server-confirmed;
- high-entropy verification tokens;
- TLS;
- provider encryption at rest where available;
- least privilege;
- managed secrets;
- backups;
- dependency/security updates;
- privileged/admin auditability.

Admin certificate correction/revocation must use strong authentication and log action/admin/timestamp. Never use a shared admin password.

# 25. Breach response

Maintain a basic incident runbook:

```text
detect
contain
identify affected data/users
document
assess risk
notify required parties
remediate
```

For GDPR-covered breaches likely to risk people’s rights/freedoms, supervisory-authority notification can be required without undue delay and, where feasible, within 72 hours after awareness.

Assign an incident owner before launch.

# 26. Privacy-risk review

V1 intentionally avoids:

- sensitive-category data;
- biometrics;
- precise location;
- child-directed processing;
- behavioural ads;
- session replay;
- proctoring;
- high-impact automated decisions.

Still perform a documented launch privacy review.

Reassess DPIA/child/privacy obligations before adding:

```text
under-16 users
session replay
AI learner profiling
camera/microphone proctoring
large-scale behaviour monitoring
sensitive data
```

# 27. Footer

Keep these reachable from public and authenticated pages:

```text
Privacy
Terms
Accessibility
Credits
Privacy settings
```

# 28. Policy/version records

Where useful, record:

```text
privacy_notice_version
terms_version
analytics_consent_version
```

Material Terms changes may require renewed acceptance. Material consent-purpose changes require a new choice where applicable.

# 29. Production launch blockers

Before go-live, fill/verify:

```text
[ ] controller legal name
[ ] controller address/jurisdiction
[ ] privacy/support email
[ ] production domain
[ ] DB/auth provider and region
[ ] hosting/CDN provider and locations
[ ] email provider
[ ] analytics vendor/config
[ ] error-monitoring vendor/config
[ ] DPAs
[ ] subprocessor review
[ ] international-transfer review
[ ] Article 27 representative assessment if applicable
[ ] DPO requirement assessment
[ ] final EN/RU Privacy Notice
[ ] final EN/RU Terms
[ ] 16+ signup implementation
[ ] analytics consent/preferences
[ ] deletion/export workflow
[ ] certificate privacy notice
[ ] actual vendor retention settings
[ ] breach-response owner/contact
```

These are launch blockers, not polish.

# 30. Acceptance criteria

Step 26 is correct if:

1. Actual controller identity is required before launch.
2. EU-facing product uses a GDPR-grade privacy baseline.
3. Accounts are 16+ in V1.
4. Exact DOB is not collected solely for age gating.
5. Terms acknowledgment is separate from optional analytics consent.
6. Core course operation never depends on optional analytics.
7. Data inventory is explicit/minimal.
8. No special-category data is intentionally requested.
9. Privacy Notice explains purposes, bases, recipients, transfers, retention and rights.
10. RU/EN legal pages describe the same processing.
11. Essential storage is separated from optional analytics.
12. Optional analytics can be rejected/withdrawn without loss of course functionality.
13. No ads/data sale/behavioural tracking/session replay in V1.
14. Processors have inventory/DPA/transfer review.
15. EEA primary data region is preferred where feasible.
16. International transfers are documented honestly.
17. Non-EU controller assesses Article 27 when applicable.
18. Certificate is unlisted/noindex.
19. Verification exposes only approved credential fields.
20. Privacy notice appears before certificate issuance.
21. No public certificate directory/search exists.
22. Deletion includes an explicit credential-retention/removal path.
23. “Permanent” credential does not override privacy rights.
24. Retention is purpose-specific/finite.
25. Raw optional analytics is capped at a proposed 12 months.
26. Account deletion/export/rectification have workflows.
27. Privacy requests can be submitted electronically.
28. Automated scoring is transparent.
29. MIYU certificate is not presented as a government/university degree.
30. Terms cover account/IP/acceptable use/certificate integrity.
31. Paid consumer/payment terms remain deferred until payment exists.
32. Third-party embeds cannot silently add tracking.
33. Security controls from prior steps remain mandatory.
34. Admin credential changes are strongly authenticated/audited.
35. Breach response exists.
36. Privacy review is repeated before child/proctoring/profiling features.
37. Footer exposes legal/privacy controls.
38. Controller/vendor facts must be resolved before launch.

# 31. Proposed fixed decisions for approval

If approved, Step 26 locks these **product** decisions while final legal wording remains dependent on the actual operator/vendors/jurisdiction:

- GDPR-grade baseline;
- general-audience **16+** account service;
- no exact DOB for normal age gating;
- no ads, personal-data sale, behavioural-ad tracking or session replay in V1;
- optional analytics remains separable/reversible and never required for course use;
- public/reachable Privacy, Terms and Privacy Settings;
- unlisted/noindex certificate verification via high-entropy token only;
- visible certificate-privacy notice before issuance;
- no public certificate directory;
- deletion flow supports either minimal credential retention or removal/revocation;
- completed Final Decoder detailed answers: proposed max 12 months;
- raw optional analytics: proposed max 12 months;
- ordinary security logs: 30–90 days;
- backups: target ≤35-day rotation where available;
- GDPR-style electronic rights workflow with a one-month response baseline where applicable;
- transparent automatic scoring;
- MIYU certificate defined as course completion, not state/university accreditation;
- processor/DPA/subprocessor/international-transfer review required for launch;
- Article 27 applicability assessed for a non-EU controller targeting EU learners;
- breach-response process required;
- controller identity, vendor stack, regions and governing jurisdiction remain explicit pre-launch blockers rather than guessed placeholders.

# 32. Official basis reviewed

This product spec was checked against current official material including GDPR Articles 3, 5, 8, 12–20, 25, 27–28 and 32–34; European Commission guidance on territorial scope, user rights, children’s data and breaches; EDPB consent/privacy-by-design guidance; official EU cookie/analytics examples; and U.S. FTC COPPA materials.

Final public legal documents still require matching to MIYU’s real operator and target markets.
