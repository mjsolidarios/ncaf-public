# Design System Strategy: The Cultural Tapestry

## 1. Overview & Creative North Star

The Creative North Star for this design system is **"Celebrating the Riches of Our Roots."** 

This system moves beyond a standard event website and into the realm of high-end editorial curation. It treats the 2026 National Culture and Arts Festival not just as a date on a calendar, but as a prestigious, breathing exhibition of heritage. To capture the spirit of *Pagsaulog* (Celebration), the UI abandons rigid, boxy layouts in favor of **Dynamic Asymmetry** and **Textural Depth**. 

Elements should feel like they are floating or "dancing" across the canvas—much like the musical notes and organic curves in the source logo. By overlapping bold serif typography with vibrant, organic motifs, we create a sense of movement and energy that feels both historically grounded and unapologetically modern.

---

## 2. Color Philosophy

Our palette is derived directly from the festival's vibrant visual identity, balanced against a sophisticated, cream-toned foundation to ensure premium legibility.

### The Palette
*   **Primary (#406e51):** The deep green of heritage and growth. Used for key navigation and foundational elements.
*   **Secondary (#9c5000):** A warm, sun-kissed orange representing energy and "Pagsaulog."
*   **Tertiary (#834aae):** A royal purple that adds depth and artistic prestige.
*   **Surface (#fefcf1):** A light cream background that provides a warmer, more human feel than a cold, digital white.

### The "No-Line" Rule
To maintain an editorial feel, **1px solid borders are strictly prohibited** for sectioning. Boundaries must be defined through:
1.  **Color Blocking:** Shifting from `surface` to `surface-container-low`.
2.  **Organic Masking:** Using large, sweeping curves (inspired by the logo’s "swoosh") to transition between sections.
3.  **Tonal Transitions:** Subtle shifts in hue rather than hard lines.

### Signature Textures & Glass
Main CTAs and hero headers should utilize a gradient transition (e.g., `primary` to `primary-container`) to provide a tactile, silk-like finish. Use **Glassmorphism** for floating navigation bars or celebratory alerts—apply a 60% opacity to your `surface` color with a 20px backdrop-blur to allow the festival's vibrant motifs to bleed through from behind.

---

## 3. Typography: Tradition Meets Clarity

The typographic system is a dialogue between the prestigious past and the accessible future.

*   **Display & Headlines (Noto Serif):** This is our "Tradition" voice. It is bold, celebratory, and carries the weight of history. Use `display-lg` (3.5rem) for hero moments and `headline-lg` (2rem) for section titles. Ensure generous letter-spacing (tracking) for a more authoritative, luxury feel.
*   **Body & Labels (Plus Jakarta Sans):** This is our "Function" voice. It is clean, geometric, and highly legible. It provides a modern counterpoint to the serif, ensuring that even dense cultural histories are easy to digest. Use `body-lg` (1rem) for primary narratives.

---

## 4. Elevation & Depth: Tonal Layering

In this system, depth is a feeling, not a shadow. We avoid the "floating card" cliché of standard material design.

*   **The Layering Principle:** Depth is achieved by "stacking" surface tiers. Place a `surface-container-lowest` card on a `surface-container-low` background. This creates a soft "lift" that mimics fine paper layered upon a desk.
*   **Ambient Shadows:** If a floating element (like a floating action button or mobile menu) is required, use a shadow with a blur of 32px and 4% opacity, tinted with `on-surface` (#383831). It should feel like a natural light source is hitting the UI.
*   **The "Ghost Border" Fallback:** If a container requires definition against a similar color, use the `outline-variant` token at **15% opacity**. This provides a whisper of a boundary without breaking the organic flow.

---

## 5. Do’s and Don’ts

### Do:
*   **DO** use the **Spacing Scale** religiously. High-end design thrives on "breathing room." When in doubt, increase the margin.
*   **DO** overlap elements. Let a photo of a cultural artifact slightly overlap a `display-lg` heading to create depth.
*   **DO** use the "Pagsaulog" theme to drive motion. Elements should fade in with a slight upward "float" (ease-out-expo).

### Don't:
*   **DON'T** use 100% black. Always use `on-surface` (#383831) for text to maintain a soft, premium contrast.
*   **DON'T** use rigid 90-degree corners for large image containers. Use the `xl` (1.5rem) or `full` roundedness scale to keep the design "organic."
*   **DON'T** use standard horizontal dividers. Use a change in background tone or a wide spacing gap (`Spacing 12`) to separate ideas.

---

**Director's Closing Note:** This design system is not a grid to be filled; it is a tapestry to be woven. Every screen should feel like a poster for a world-class exhibition. Use the colors not just to decorate, but to guide the user through the "celebration" of our heritage.