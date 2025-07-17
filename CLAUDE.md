# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a streaming overlay repository containing assets and interactive widgets for Twitch streaming. It includes both static graphics and dynamic HTML/CSS/JS overlays integrated with StreamElements.

## Repository Contents

### Static Assets
- `BITS.png` - Blue diamond/gem graphic (likely for Twitch Bits)
- `glowy heart.png` - Pink heart graphic with glow effect (used in sub goal widget)
- `twitch.png` - Twitch logo graphic (used in viewer count widget)

### Interactive Widgets

#### Sub Goal Widget
- `sub-goal.html` - HTML structure for subscriber goal display
- `sub-goal.css` - Styling for the sub goal widget
- `sub-goal.js` - StreamElements integration for real-time sub tracking (Goal: 100 subs)

#### Viewer Count Widget  
- `viewer-count.html` - HTML structure for viewer count display
- `viewer-count.css` - Styling for the viewer count widget
- `viewer-count.js` - StreamElements integration for real-time viewer tracking (Goal: 75 viewers)

## StreamElements Integration

Both widgets are designed to work with StreamElements overlays and use their event system:
- `onWidgetLoad` - Initial data loading
- `onEventReceived` - Real-time event updates
- `onSessionUpdate` - Session data updates

The widgets feature circular progress rings that visually track progress toward goals.

## Development Notes

- Widgets pull assets from GitHub raw URLs (https://raw.githubusercontent.com/noemiebvy/Stream-asset/)
- No build process required - files can be used directly in StreamElements custom widgets
- Progress calculations use SVG stroke-dashoffset for smooth circular animations