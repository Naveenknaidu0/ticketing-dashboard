/**
 * AdamsBridge Design Token System
 * Centralized visual constants for consistent platform styling
 * Used across all dashboards, widgets, and components
 */

// Color Palette
export const ADAMSBRIDGE_COLORS = {
  // Primary Brand Colors
  PRIMARY_TEAL: '#0B3D3B',
  SECONDARY_TEAL: '#114B46',
  ACCENT_GOLD: '#E0A04B',

  // Status Colors
  SUCCESS_GREEN: '#1FA971',
  WARNING_AMBER: '#D98B2B',
  CRITICAL_RED: '#C45B5B',

  // Neutral Palette
  NEUTRAL_50: '#F5F7F8',
  NEUTRAL_100: '#F3F1EE',
  NEUTRAL_200: '#E5E7EB',
  NEUTRAL_300: '#D1D5DB',
  NEUTRAL_500: '#6B7280',
  NEUTRAL_700: '#374151',
  NEUTRAL_900: '#1F2937',

  // Additional Colors
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  
  // Specific Use Cases
  BORDER_DEFAULT: '#E2E0DC',
  BACKGROUND_DEFAULT: '#FFFFFF',
  BACKGROUND_SUBTLE: '#FAFAF9',
  TEXT_PRIMARY: '#1a1a1a',
  TEXT_SECONDARY: '#6B6B6B',
  TEXT_TERTIARY: '#9CA3AF',
}

// Status Badge Colors
export const STATUS_COLORS = {
  OPEN: ADAMSBRIDGE_COLORS.PRIMARY_TEAL,
  IN_PROGRESS: ADAMSBRIDGE_COLORS.ACCENT_GOLD,
  RESOLVED: ADAMSBRIDGE_COLORS.SUCCESS_GREEN,
  AT_RISK: ADAMSBRIDGE_COLORS.WARNING_AMBER,
  BREACHED: ADAMSBRIDGE_COLORS.CRITICAL_RED,
  CLOSED: ADAMSBRIDGE_COLORS.SUCCESS_GREEN,
}

// Chart Colors (in order for consistent data visualization)
export const CHART_COLORS = [
  ADAMSBRIDGE_COLORS.PRIMARY_TEAL,
  ADAMSBRIDGE_COLORS.ACCENT_GOLD,
  ADAMSBRIDGE_COLORS.SUCCESS_GREEN,
  ADAMSBRIDGE_COLORS.WARNING_AMBER,
  ADAMSBRIDGE_COLORS.CRITICAL_RED,
  ADAMSBRIDGE_COLORS.SECONDARY_TEAL,
  ADAMSBRIDGE_COLORS.NEUTRAL_500,
]

// Progress Bar Colors (SLA Health, Workload, Capacity, etc.)
export const PROGRESS_BAR_COLORS = {
  CRITICAL: (percentage: number) => percentage < 80 ? ADAMSBRIDGE_COLORS.CRITICAL_RED : 
                                   percentage < 90 ? ADAMSBRIDGE_COLORS.WARNING_AMBER : 
                                   ADAMSBRIDGE_COLORS.SUCCESS_GREEN,
  CRITICAL_THRESHOLD: 80,
  WARNING_THRESHOLD: 90,
}

// Typography
export const TYPOGRAPHY = {
  FONT_SANS: "'Geist', system-ui, -apple-system, sans-serif",
  FONT_MONO: "'Geist Mono', monospace",
  
  SIZES: {
    XS: '12px',
    SM: '14px',
    BASE: '16px',
    LG: '18px',
    XL: '20px',
    '2XL': '24px',
    '3XL': '30px',
  },
  
  WEIGHTS: {
    REGULAR: 400,
    MEDIUM: 500,
    SEMIBOLD: 600,
    BOLD: 700,
  },
  
  LINE_HEIGHTS: {
    TIGHT: 1.2,
    NORMAL: 1.4,
    RELAXED: 1.6,
  },
}

// Spacing
export const SPACING = {
  XS: '4px',
  SM: '8px',
  MD: '12px',
  LG: '16px',
  XL: '20px',
  '2XL': '24px',
  '3XL': '32px',
}

// Border Radius
export const BORDER_RADIUS = {
  NONE: '0px',
  SM: '6px',
  MD: '8px',
  LG: '12px',
  XL: '16px',
  FULL: '9999px',
}

// Shadows
export const SHADOWS = {
  NONE: 'none',
  SM: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  MD: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  LG: '0 8px 16px -2px rgba(0, 0, 0, 0.1)',
  XL: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
}

// Card Styles
export const CARD_STYLES = {
  DEFAULT: {
    borderColor: ADAMSBRIDGE_COLORS.BORDER_DEFAULT,
    borderWidth: '1px',
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
    backgroundColor: ADAMSBRIDGE_COLORS.BACKGROUND_DEFAULT,
    boxShadow: SHADOWS.SM,
  },
  
  SUBTLE: {
    borderColor: ADAMSBRIDGE_COLORS.BORDER_DEFAULT,
    borderWidth: '1px',
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.MD,
    backgroundColor: ADAMSBRIDGE_COLORS.BACKGROUND_SUBTLE,
    boxShadow: SHADOWS.NONE,
  },
  
  ELEVATED: {
    borderColor: 'transparent',
    borderWidth: '0px',
    borderRadius: BORDER_RADIUS.LG,
    padding: SPACING.LG,
    backgroundColor: ADAMSBRIDGE_COLORS.BACKGROUND_DEFAULT,
    boxShadow: SHADOWS.MD,
  },
}

// Widget Header Styles
export const WIDGET_HEADER = {
  TITLE: {
    fontSize: TYPOGRAPHY.SIZES.BASE,
    fontWeight: TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    color: ADAMSBRIDGE_COLORS.TEXT_PRIMARY,
  },
  
  SUBTITLE: {
    fontSize: TYPOGRAPHY.SIZES.XS,
    fontWeight: TYPOGRAPHY.WEIGHTS.REGULAR,
    color: ADAMSBRIDGE_COLORS.TEXT_TERTIARY,
  },
  
  ACTION_BUTTON: {
    padding: SPACING.SM,
    borderRadius: BORDER_RADIUS.MD,
    color: ADAMSBRIDGE_COLORS.TEXT_SECONDARY,
    hover: {
      opacity: 0.7,
    },
  },
}

// Table Styles
export const TABLE_STYLES = {
  ROW_HEIGHT: '40px',
  HEADER_HEIGHT: '40px',
  BORDER_COLOR: ADAMSBRIDGE_COLORS.BORDER_DEFAULT,
  HEADER_BACKGROUND: ADAMSBRIDGE_COLORS.BACKGROUND_SUBTLE,
  ROW_HOVER_BACKGROUND: '#F9F9F9',
  PADDING: SPACING.MD,
}

// Progress Bar Styles
export const PROGRESS_BAR = {
  HEIGHT: '8px',
  BORDER_RADIUS: BORDER_RADIUS.FULL,
  BACKGROUND: ADAMSBRIDGE_COLORS.NEUTRAL_200,
}

// Filter Styles
export const FILTER_STYLES = {
  DROPDOWN_HEIGHT: '36px',
  BORDER_COLOR: ADAMSBRIDGE_COLORS.BORDER_DEFAULT,
  BORDER_RADIUS: BORDER_RADIUS.MD,
  PADDING: SPACING.SM,
  FONT_SIZE: TYPOGRAPHY.SIZES.SM,
}

// Icon Styles
export const ICON_STYLES = {
  SIZES: {
    XS: '16px',
    SM: '20px',
    MD: '24px',
    LG: '32px',
    XL: '48px',
  },
  
  COLOR_PRIMARY: ADAMSBRIDGE_COLORS.PRIMARY_TEAL,
  COLOR_SECONDARY: ADAMSBRIDGE_COLORS.TEXT_SECONDARY,
  COLOR_SUCCESS: ADAMSBRIDGE_COLORS.SUCCESS_GREEN,
  COLOR_WARNING: ADAMSBRIDGE_COLORS.WARNING_AMBER,
  COLOR_CRITICAL: ADAMSBRIDGE_COLORS.CRITICAL_RED,
}

// Widget Footer Styles
export const WIDGET_FOOTER = {
  PADDING_TOP: SPACING.MD,
  BORDER_TOP_COLOR: ADAMSBRIDGE_COLORS.BORDER_DEFAULT,
  BUTTON_SPACING: SPACING.SM,
  BUTTON_HEIGHT: '32px',
}

// Status Badge Styles
export const STATUS_BADGE_STYLES = {
  PADDING: `${SPACING.XS} ${SPACING.SM}`,
  BORDER_RADIUS: BORDER_RADIUS.FULL,
  FONT_SIZE: TYPOGRAPHY.SIZES.XS,
  FONT_WEIGHT: TYPOGRAPHY.WEIGHTS.MEDIUM,
}

// Export all tokens as object for easier access
export const ADAMSBRIDGE_TOKENS = {
  COLORS: ADAMSBRIDGE_COLORS,
  STATUS_COLORS,
  CHART_COLORS,
  PROGRESS_BAR_COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  CARD_STYLES,
  WIDGET_HEADER,
  TABLE_STYLES,
  PROGRESS_BAR,
  FILTER_STYLES,
  ICON_STYLES,
  WIDGET_FOOTER,
  STATUS_BADGE_STYLES,
}
