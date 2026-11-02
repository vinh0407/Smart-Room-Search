# Smart Room Search Design System

A standardized, accessible design system for nationwide room discovery across Vietnam. Built for high clarity, fast mobile interactions, and responsive multi-platform interfaces (Web & Android).

## Brand Principles

- **Clarity First**: Essential rental attributes (monthly price, utility fees, district, distance) take visual priority over decorative elements.
- **Granular Precision**: 3-tier administrative hierarchy (Province/City -> District -> Ward) is treated as a unified cascading interaction pattern.
- **Trust & Transparency**: Verified direct owner listings are distinguished from aggregated sources (Cho Tot Nha, Batdongsan, Phongtro123) with clear color-coded source badges.

## Color Foundations

- `brand-primary` (`#ea580c` Light / `#f97316` Dark): Used exclusively for primary call-to-actions, active filter indicators, and key metric badges.
- `brand-accent` (`#10b981` Light / `#34d399` Dark): Denotes real-time live synchronization, online landlord availability, and positive statuses.
- `surface-base` (`#f7f7f5` Light / `#0c0a09` Dark): Neutral canvas background providing contrast for card surfaces.
- `surface-card` (`#ffffff` Light / `#1c1917` Dark): Elevated container for room listings, modal dialogues, and sheets.
- `border-subtle` (`#e7e5e4` Light / `#292524` Dark): 1px structural borders dividing content regions.

## Multi-Channel Source Tokens

- `source-nhatot`: Sunset Orange `#ea580c`
- `source-bds`: Royal Blue `#1d4ed8`
- `source-pt123`: Forest Green `#15803d`

## Typography

Typography relies on `Plus Jakarta Sans` with fallback to `Segoe UI` and system sans-serif.

- **Display (32px / 40px)**: Hero headings and city search banners.
- **Title LG (22px / 28px)**: Property titles on detail sheets.
- **Title MD (17px / 24px)**: Listing card headings and modal section titles.
- **Body (15px / 22px)**: Listing descriptions, form input values, and facility notes.
- **Caption (12px / 16px)**: Badges, timestamps, and utility cost labels.

## Component Standards

- **RoomCard**: 20px rounded corners (`radius-lg`), 16px padding (`space-4`), featuring 16:10 aspect image carousel, price tag, and 1-tap contact actions.
- **CascadingFilter**: Triple-segment cascading selector with clear active chip states.
- **LiveIndicator**: Pulsing emerald dot with last-updated timestamp indicator.
