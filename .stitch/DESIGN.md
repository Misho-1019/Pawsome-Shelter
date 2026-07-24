# Design System: Pawsome Shelter
**Project ID:** 16974000666086678920

## 1. Visual Theme & Atmosphere

A warm, premium, editorial aesthetic that blends luxury pet branding with approachable community warmth. The design feels like a high-end lifestyle magazine — clean whitespace, generous padding, and stunning dog photography as the focal point. The mood is inviting, trustworthy, and emotionally resonant, evoking the joy of finding a new companion.

## 2. Color Palette & Roles

### Primary Colors
| Name | Hex | Role |
|------|-----|------|
| Primary | `#9E4203` | Deep warm brown — main brand color, headlines, stat numbers |
| Primary Container | `#E97A3D` | Rich warm orange — CTA buttons, active states, icons |
| On Primary | `#FFFFFF` | White text on primary backgrounds |

### Secondary Colors
| Name | Hex | Role |
|------|-----|------|
| Secondary | `#2A9D8F` | Teal — "Meet Me" button borders, volunteer section, accent elements |
| Secondary Container | `#8CF5E4` | Light teal — badge backgrounds, decorative elements |

### Tertiary Colors
| Name | Hex | Role |
|------|-----|------|
| Tertiary | `#00687C` | Deep teal — stat accents |
| Tertiary Container | `#00A7C6` | Bright teal — "How to Adopt" step 3 icon |

### Background & Surface
| Name | Hex | Role |
|------|-----|------|
| Background | `#FFF8F0` | Warm cream — page background |
| Surface | `#FFF8F0` | Same as background |
| Surface Bright | `#FFF8F6` | Slightly lighter — dog cards section |
| Surface Container | `#FEEAE2` | Warm beige — "Get Involved" section |
| Surface Container Low | `#FFF1EB` | Light warm — tag backgrounds |
| Surface Container High | `#F8E4DC` | Medium warm — filter pill inactive |
| Surface Container Highest | `#F2DED6` | Darker warm — footer background |

### Text Colors
| Name | Hex | Role |
|------|-----|------|
| On Background | `#231915` | Dark brown-black — primary text |
| On Surface | `#231915` | Same as on-background |
| On Surface Variant | `#564239` | Muted brown — secondary text, descriptions |

### Outline
| Name | Hex | Role |
|------|-----|------|
| Outline | `#8A7268` | Warm gray — borders, dividers |
| Outline Variant | `#DDC1B4` | Light warm — subtle borders |

### Error
| Name | Hex | Role |
|------|-----|------|
| Error | `#BA1A1A` | Standard error red |

## 3. Typography Rules

### Font Families
| Token | Font | Usage |
|-------|------|-------|
| headline-xl | Plus Jakarta Sans | Hero headline, section titles (48px/56px, 700) |
| headline-lg | Plus Jakarta Sans | Sub-section titles (32px/40px, 700) |
| headline-md | Plus Jakarta Sans | Card titles, small headings (24px/32px, 600) |
| body-lg | Inter | Long-form text, descriptions (18px/28px, 400) |
| body-md | Inter | Standard body text (16px/24px, 400) |
| label-md | Inter | Buttons, labels (14px/20px, 600, 0.05em tracking) |
| label-sm | Inter | Small labels, captions (12px/16px, 500) |

### Type Scale
- Hero: `text-headline-xl` (48px) → `text-6xl` on desktop
- Section titles: `text-headline-xl` (48px)
- Sub-section: `text-headline-lg` (32px)
- Card titles: `text-headline-md` (24px)
- Body large: `text-body-lg` (18px)
- Body: `text-body-md` (16px)
- Labels: `text-label-md` (14px, uppercase, 0.05em tracking)
- Small: `text-label-sm` (12px)

## 4. Component Stylings

### Buttons
- **Primary CTA** (`bg-primary-container`): Orange (#E97A3D), white text, rounded-lg, hover:opacity-90
- **Secondary** (`border-2 border-secondary`): Teal border, teal text, rounded-xl, hover:bg-secondary hover:text-white
- **Ghost** (`bg-white/10 backdrop-blur`): White translucent, white text, rounded-lg
- **Donation amounts**: border-2, rounded-xl, py-4, hover:bg-white/10

### Cards
- **Dog cards**: bg-white, rounded-2xl, overflow-hidden, premium-shadow, group hover:translateY(-4px)
- **Testimonial cards**: bg-white, p-8, rounded-3xl, premium-shadow
- **Stat blocks**: border-l-4, pl-6, colored left border
- **About image**: rounded-3xl, shadow-2xl, with decorative blur circles behind

### Shadows
- **Premium shadow**: `0px 4px 20px rgba(26, 26, 46, 0.05)` → hover: `0px 12px 32px rgba(26, 26, 46, 0.12)`
- **Soft shadow**: Same as premium
- **Hero image**: None (uses gradient overlay)

### Navigation
- **Sticky header**: `bg-surface/80 backdrop-blur-md shadow-sm`, fixed top, z-50
- **Logo**: font-headline-md, bold, text-primary
- **Nav links**: font-label-md, text-on-surface-variant, hover:text-primary
- **Mobile menu**: Hidden by default, toggle with hamburger icon

### Filter Pills
- **Active**: `bg-primary text-white`, rounded-full, px-6, py-2
- **Inactive**: `bg-surface-container-high text-on-surface-variant`, hover:bg-primary-fixed

### Tags/Badges
- **Dog tags**: `bg-surface-container-low text-primary`, px-3, py-1, rounded-full, text-xs
- **Status badge**: `bg-secondary text-white` or `bg-primary-container text-white`, absolute top-right

## 5. Layout Principles

### Spacing
- **Section padding**: `py-20 md:py-32` (80px → 128px)
- **Container max-width**: 1280px
- **Mobile margin**: 16px
- **Desktop margin**: 48px
- **Gutter (card gap)**: 24px

### Grid
- **Dog cards**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Testimonials**: `grid-cols-1 md:grid-cols-3`
- **Stats**: `grid-cols-2 gap-8`
- **About**: `grid-cols-1 lg:grid-cols-2 gap-20`
- **Contact**: `grid-cols-1 lg:grid-cols-2 gap-16`

### Responsive Breakpoints
- Mobile: < 768px (1 column, stacked)
- Tablet: 768px+ (2 columns)
- Desktop: 1024px+ (3 columns, side-by-side)
- Wide: 1280px+ (max-width container)

### Whitespace Strategy
- Generous padding on all sections
- Large gaps between section title and content (mb-12 to mb-16)
- Card padding: p-6 (dog cards), p-8 (testimonial cards), p-10-p-12 (feature cards)
- Flex gaps: gap-4 to gap-16 depending on context

## 6. Design System Notes for Stitch Generation

When generating new screens or variations, include these tokens:

**Colors:**
- Primary: #9E4203 (deep warm brown)
- Primary Container: #E97A3D (rich orange)
- Secondary: #2A9D8F (teal)
- Background: #FFF8F0 (warm cream)
- Text: #231915 (dark brown-black)
- Muted text: #564239

**Typography:**
- Headlines: Plus Jakarta Sans, 700 weight
- Body: Inter, 400 weight
- Labels: Inter, 600 weight, 0.05em tracking, uppercase

**Style keywords:**
- Premium, editorial, warm, inviting
- Rounded corners (rounded-2xl, rounded-3xl)
- Soft shadows, hover lift effects
- Photo-forward, generous whitespace
- Clean, modern, professional
