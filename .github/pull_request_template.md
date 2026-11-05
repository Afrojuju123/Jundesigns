## Summary

<!-- Brief summary of what this pull request introduces or fixes. -->

## What Changed

<!-- Bullet points describing the exact changes made. -->
- 

## Visual Verification (Screenshots / Recordings)

<!-- Mandatory for UI changes: provide desktop and mobile screenshots -->
- **Desktop View**: 
- **Mobile View**: 

## Test Notes

<!-- Explain how these changes were tested (commands run, manual scenarios verified). -->
- 

## Quality & Security Checklist

- [ ] **No Secrets**: Verified no API keys, credentials, tokens, or private data are committed.
- [ ] **Secret Scan Passed**: `npm run secretlint` executed cleanly without violations.
- [ ] **No AI Slop**: Follows the strict design guidelines (no generic stock shapes, no fake trust badges, no synthetic marketing filler).
- [ ] **Accessibility (a11y)**: Semantic HTML, ARIA attributes for modal dialogs, and keyboard accessibility verified.
- [ ] **Mobile Responsiveness**: Verified on mobile viewport (375px/390px) without horizontal scroll or truncated touch targets.
- [ ] **Build Validation**: `npx tsc --noEmit` and `npm run build` completed with zero errors.
