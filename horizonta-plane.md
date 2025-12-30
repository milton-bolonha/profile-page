# Horizontal Slideshow Implementation Plan

## Objective
Implement a configurable "Horizontal Slideshow" mode where the entire website flows horizontally (side-by-side sections) instead of the traditional vertical scroll. This mode will be controlled by a setting in `content/settings/theme.json`.

## 1. Configuration
Modify `content/settings/theme.json` to include a layout control variable.

```json
{
  "generalThemeSettings": {
    "layoutMode": "horizontal", // Options: "vertical", "horizontal"
    "themeStyle": "modern"
  }
}
```

## 2. Core Architecture

### Layout Strategy
We will implement a Conditional Layout Wrapper in `index.tsx` or a new `PageLayout` component.

*   **Vertical (Default)**: Existing behavior (Native Scroll).
*   **Horizontal (Slideshow)**:
    *   Container: `flex flex-row h-screen w-screen overflow-hidden` (No scrollbars).
    *   **Control Mechanism**: "Locked" scroll. Navigation is strictly controlled by state (`currentSectionIndex`).
    *   **Triggers**:
        *   **Navigator**: Clicking a dot moves directly to that slide.
        *   **Mouse Wheel**: A wheel scroll event triggers a discrete `Next` or `Previous` slide transition (debounced).
        *   **Keyboard**: Arrow keys (Left/Right) navigate slides.

### Mouse Wheel Mapping
To enable the slideshow feel:
```typescript
const handleWheel = (e) => {
  if (layoutMode === 'horizontal') {
     // 1. Check if Timeline is capturing the event (if we are ON the timeline)
     // 2. If not, and deltaY > threshold, goToNextSlide()
  }
}
```

## 3. Conflict Resolution: NewTimelineSection
The `NewTimelineSection` already implements "Scroll Hijacking" (locking the page scroll to navigate years in the top of the page).

*   **Behavior in Horizontal Mode**:
    *   The Timeline already stops propagation when locked.
    *   **Refinement**: We ensure the global `handleWheel` listener respects this.
    *   When the Global Handler receives a wheel event:
        *   If the user is currently looking at the Timeline Section (active slide = Timeline), we might strictly delegate control to the Timeline component until it releases the lock (reaches start/end).

## 4. Floating Navigator Adaptation
The `FloatingNavigator` (which the user wants to "command" the slideshow) needs to adapt its visual layout based on `layoutMode`.

*   **Vertical Mode**: Fixed right sidebar, `flex-col`.
*   **Horizontal Mode**: Fixed bottom navbar, centered.
    *   Structure: Change container from `flex-col` to `flex-row`.
    *   Position: `bottom-6 left-1/2 -translate-x-1/2`.
    *   **Icons**: Interact as normal (upright). The "bar" rotates 90deg conceptually (vertical to horizontal), but implementation is just changing flex direction.
    *   **Functionality**: This becomes the primary visual pagination indicator.

## 5. Implementation Steps

1.  **Settings**: Update `theme.json` with `"layoutMode": "vertical" | "horizontal"`.
2.  **State Management**: Create a `SlideshowContext` or use `index.tsx` state to track `currentSlide`.
3.  **Horizontal Wrapper**:
    *   Implement the wheel listener.
    *   Implement smooth scrolling to the target section (using `scrollTo` with calculated offsets `window.innerWidth * index`).
4.  **Navigator Refactor**:
    *   Update `FloatingNavigator.tsx` to accept `mode="vertical" | "horizontal"`.
    *   If `horizontal`, apply `flex-row`, `bottom-0`, `w-auto`.
5.  **Locking Logic**: Ensure the "Scroll Hijack" logic in Timeline coordinates with the global slide switcher (e.g., Timeline signals "I'm done, you can slide now").

## 6. Directory Structure
```
src/
  components/
    layouts/
      SlideshowLayout.tsx  <-- New
```

## Risks & Mitigation
*   **Mobile**: Horizontal scroll on mobile is natural (swipe), but wheel mapping isn't needed. We must detect touch vs. mouse.
*   **Dynamic Heights**: Some sections might be taller than `100vh`.
    *   *Solution*: In Slideshow mode, use `overflow-y-auto` *within* the slide if content overflows, or ensure design fits 100vh. Ideally, "Slideshow" implies fixed height.

