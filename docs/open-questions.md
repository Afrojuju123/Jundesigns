# Schools & Groups — Open Questions and Confirmations

This document tracks items in the Schools & Groups programme that require confirmation or final content from the Jun Designs team before public launch.

---

## 1. Pricing & Tier Confirmations `[CONFIRM]`

### Bronze Package Tiers (5,000 RWF for 25–65 and 66–130)
- **Current Data:**
  - 25–65 students: 5,000 RWF / student
  - 66–130 students: 5,000 RWF / student
  - 131+ students: 4,500 RWF / student
- **Question:** The first two tiers have the identical price (5,000 RWF). Is this intentional (e.g. keeping pricing flat up to 130 before discounting), or was tier 2 intended to be discounted (e.g. 4,800 RWF or similar)?
- **Current Behavior in Code:** Both 25–65 and 66–130 are priced at 5,000 RWF as provided.

### Silver Package Activity List (Omission of Guhiha-Live)
- **Current Data:**
  - Bronze activities: Storytelling, Blacksmithing, Dance, Imigongo-live, Guhiha-live
  - Silver activities: Storytelling, Blacksmithing, Imigongo-live, Imigongo-painting, Pottery, Dance
  - Gold activities: Storytelling, Blacksmithing, Imigongo-live, Pottery, Imigongo-painting, Dance, Women-weaving, Guhiha-live
- **Question:** Silver includes Imigongo-painting and Pottery, but omits *Live guhiha* (which is present in both Bronze and Gold). Is Live guhiha excluded from Silver due to time/station constraints, or should it be included?
- **Current Behavior in Code:** Silver activity list matches the provided specification without guhiha.

### Gold Package Tier Boundary ("200 & above")
- **Current Data:**
  - 50–100 students: 8,000 RWF
  - 101–200 students: 7,500 RWF
  - 201+ students: 7,000 RWF
- **Question:** Original text specified "200 & above" for the top tier while the previous tier ended at 200.
- **Current Behavior in Code:** Implemented as `201+` (201 to Infinity) so that `n = 200` falls strictly into the 101–200 tier (7,500 RWF).

---

## 2. Terminology & Craft Naming `[CONFIRM]`

### Blacksmithing: "gucura" vs "gucuru"
- **Question:** The text provided writes "Live blacksmithing (gucuru)" in one place and "gucura" in standard Kinyarwanda terminology.
- **Current Behavior in Code:** Labelled as "Live blacksmithing (gucura)".

### Imigongo Activity Naming
- **Question:** Source material refers to "Painting umugongo", while the public workshop is titled "Imigongo".
- **Current Behavior in Code:** Displayed as "Imigongo painting" for consistency with the rest of the site, with raw notes referencing "Painting umugongo".

### Explanation for "Guhiha"
- **Question:** "Live guhiha" is a specialized traditional craft term that international school coordinators, expatriate teachers, and non-Kinyarwanda speakers may not immediately understand.
- **Recommendation:** Add a one-line plain English subtitle explaining the craft (e.g. traditional gourd pyrography / carving or preparation craft).

---

## 3. Operational Policies `[CONFIRM]`

### Groups Under 25 Students
- **Question:** Minimum package threshold is 25 students. Can groups under 25 (e.g. small school clubs, homeschool pods, 15–20 students) book a custom package or minimum flat fee?
- **Current Behavior in Code:** Groups under 25 are greeted with: *"Packages start at 25 students. For smaller school clubs or custom groups under 25, please contact us directly for a custom quote."*

### Off-Site School Visits
- **Question:** Can Jun Designs artisans travel to school campuses in Kigali with materials for select activities (e.g. storytelling, dance, imigongo painting)?
- **Current Behavior in Code:** Noted in FAQ as: *"Yes, for select activities within Kigali. Transport and setup fees apply."* Needs final sign-off on travel radius and setup fees before publishing.

### Teacher & Supervisor Inclusions
- **Question:** How many teachers or adult supervisors are admitted free of charge per group?
- **Current Behavior in Code:** Listed as: *"Teachers and required chaperones attend free to supervise their students."*

---

## 4. Content Needed `[CONTENT NEEDED]`

The following short descriptions from the Jun Designs artisans/owner are needed:

1. **Storytelling on early Rwandan history and culture:**
   - One or two plain sentences describing what stories or cultural history are shared with students.
2. **Live blacksmithing (gucura):**
   - One or two plain sentences on traditional forge techniques demonstrated.
   - Safety protocol / distance note for student audiences.
3. **Traditional dance:**
   - One or two plain sentences on posture, rhythm, and group choreography taught.
4. **Live Imigongo production:**
   - One or two plain sentences on how natural clay and organic relief shaping are demonstrated.
5. **Imigongo painting:**
   - One or two plain sentences explaining that students paint prepared geometric relief boards with natural pigments to take home.
6. **Pottery:**
   - One or two plain sentences describing traditional clay shaping techniques students experience.
7. **Women weaving:**
   - One or two plain sentences explaining the sisal fiber preparation and hand-weaving demonstration.
8. **Live guhiha:**
   - One or two plain sentences explaining this traditional Rwandan craft practice.
