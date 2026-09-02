// Central Theme Palette based on design specification:
// Primary Background: White #FFFFFF
// Secondary Background: Light Gray #F2F3F5
// Primary Text: Black #202020
// Accent / Action: Lime Green #C9F158
// Borders / Dividers: Light Gray #E4E5E8 / #F2F3F5
// Hover / Active States: Slightly darker lime #A8D940

export const COLORS = {
  primaryBg: '#FFFFFF',       // White - Clean, minimal base for readability
  secondaryBg: '#F2F3F5',     // Light Gray - Sections, cards, dashboard panels
  cardBg: '#FFFFFF',          // Card base on light gray background
  cardSecondaryBg: '#F2F3F5', // Card secondary base
  primaryText: '#202020',     // Black - Headlines, body text, and labels
  secondaryText: '#666666',   // Subtext / Muted body text
  mutedText: '#888888',       // Captions / Timestamps
  accent: '#C9F158',          // Lime Green - Buttons, highlights, key CTAs
  accentText: '#202020',      // Text on Lime Green (for high contrast readability)
  border: '#E4E5E8',          // Borders / Dividers subtle separation
  borderLight: '#F2F3F5',     // Divider background
  hoverLime: '#A8D940',       // Slightly darker lime for active/pressed states
  activeTabBg: '#C9F158',     // Active tab background
  
  // Status Colors adapted for light mode
  statusSubmitted: '#E0F2FE', // Blue tint background
  statusSubmittedText: '#0369A1',
  statusAssigned: '#FEF3C7',  // Amber tint background
  statusAssignedText: '#B45309',
  statusInProgress: '#DBEAFE',// Indigo tint background
  statusInProgressText: '#1D4ED8',
  statusResolved: '#D1FAE5',  // Emerald tint background
  statusResolvedText: '#047857',
  statusClosed: '#F3F4F6',    // Gray tint background
  statusClosedText: '#4B5563',
  
  priorityCritical: '#FEE2E2',
  priorityCriticalText: '#B91C1C',
  priorityHigh: '#FFEDD5',
  priorityHighText: '#C2410C',
  priorityMedium: '#FEF3C7',
  priorityMediumText: '#B45309',
  priorityLow: '#E0E7FF',
  priorityLowText: '#4338CA',

  danger: '#EF4444',
  dangerBg: '#FEE2E2',
  success: '#10B981',
  successBg: '#D1FAE5',
  info: '#0284C7',
  infoBg: '#E0F2FE',
};
