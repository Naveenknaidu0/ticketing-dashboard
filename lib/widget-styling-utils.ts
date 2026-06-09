/**
 * Widget Styling Utilities
 * Reusable styling functions for consistent widget appearance across all dashboards
 */

import { ADAMSBRIDGE_TOKENS } from './adamsbridge-design-tokens'

// Status Badge Styling
export function getStatusBadgeStyle(status: string): { backgroundColor: string; color: string } {
  const baseStyle = { 
    backgroundColor: '', 
    color: '#FFFFFF',
  }

  switch (status.toLowerCase()) {
    case 'open':
      return { ...baseStyle, backgroundColor: ADAMSBRIDGE_TOKENS.STATUS_COLORS.OPEN }
    case 'in-progress':
    case 'inprogress':
      return { ...baseStyle, backgroundColor: ADAMSBRIDGE_TOKENS.STATUS_COLORS.IN_PROGRESS }
    case 'resolved':
    case 'closed':
      return { ...baseStyle, backgroundColor: ADAMSBRIDGE_TOKENS.STATUS_COLORS.RESOLVED }
    case 'at-risk':
    case 'atrisk':
      return { ...baseStyle, backgroundColor: ADAMSBRIDGE_TOKENS.STATUS_COLORS.AT_RISK }
    case 'breached':
      return { ...baseStyle, backgroundColor: ADAMSBRIDGE_TOKENS.STATUS_COLORS.BREACHED }
    default:
      return { ...baseStyle, backgroundColor: ADAMSBRIDGE_TOKENS.COLORS.NEUTRAL_500 }
  }
}

// Progress Bar Color
export function getProgressBarColor(percentage: number): string {
  if (percentage < 80) {
    return ADAMSBRIDGE_TOKENS.COLORS.CRITICAL_RED
  } else if (percentage < 90) {
    return ADAMSBRIDGE_TOKENS.COLORS.WARNING_AMBER
  } else {
    return ADAMSBRIDGE_TOKENS.COLORS.SUCCESS_GREEN
  }
}

// Card Container Style
export function getCardStyle(variant: 'default' | 'subtle' | 'elevated' = 'default'): React.CSSProperties {
  return ADAMSBRIDGE_TOKENS.CARD_STYLES[variant] as React.CSSProperties
}

// Widget Header Style
export function getWidgetHeaderStyle(): React.CSSProperties {
  return {
    fontSize: ADAMSBRIDGE_TOKENS.TYPOGRAPHY.SIZES.BASE,
    fontWeight: ADAMSBRIDGE_TOKENS.TYPOGRAPHY.WEIGHTS.SEMIBOLD,
    color: ADAMSBRIDGE_TOKENS.COLORS.TEXT_PRIMARY,
    marginBottom: ADAMSBRIDGE_TOKENS.SPACING.MD,
  }
}

// Widget Action Button Style
export function getWidgetActionButtonStyle(): React.CSSProperties {
  return {
    padding: ADAMSBRIDGE_TOKENS.SPACING.SM,
    borderRadius: ADAMSBRIDGE_TOKENS.BORDER_RADIUS.MD,
    color: ADAMSBRIDGE_TOKENS.COLORS.TEXT_SECONDARY,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    border: 'none',
    backgroundColor: 'transparent',
  }
}

// Table Row Style
export function getTableRowStyle(isHeader: boolean = false): React.CSSProperties {
  return {
    height: isHeader ? ADAMSBRIDGE_TOKENS.TABLE_STYLES.HEADER_HEIGHT : ADAMSBRIDGE_TOKENS.TABLE_STYLES.ROW_HEIGHT,
    backgroundColor: isHeader ? ADAMSBRIDGE_TOKENS.TABLE_STYLES.HEADER_BACKGROUND : 'transparent',
    borderBottomColor: ADAMSBRIDGE_TOKENS.TABLE_STYLES.BORDER_COLOR,
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
  }
}

// Status Color by Type
export function getStatusColor(type: 'open' | 'in-progress' | 'resolved' | 'at-risk' | 'breached'): string {
  return ADAMSBRIDGE_TOKENS.STATUS_COLORS[type.toUpperCase().replace('-', '_') as keyof typeof ADAMSBRIDGE_TOKENS.STATUS_COLORS]
}

// Icon Color by Type
export function getIconColor(type: 'primary' | 'secondary' | 'success' | 'warning' | 'critical'): string {
  const colorKey = `COLOR_${type.toUpperCase()}` as keyof typeof ADAMSBRIDGE_TOKENS.ICON_STYLES
  return ADAMSBRIDGE_TOKENS.ICON_STYLES[colorKey] as string
}

// Chart Color Palette
export function getChartColors(): string[] {
  return ADAMSBRIDGE_TOKENS.CHART_COLORS
}

// Filter Dropdown Style
export function getFilterDropdownStyle(): React.CSSProperties {
  return {
    height: ADAMSBRIDGE_TOKENS.FILTER_STYLES.DROPDOWN_HEIGHT,
    borderColor: ADAMSBRIDGE_TOKENS.FILTER_STYLES.BORDER_COLOR,
    borderRadius: ADAMSBRIDGE_TOKENS.FILTER_STYLES.BORDER_RADIUS,
    padding: ADAMSBRIDGE_TOKENS.FILTER_STYLES.PADDING,
    fontSize: ADAMSBRIDGE_TOKENS.FILTER_STYLES.FONT_SIZE,
  }
}

// Border Styling Utilities
export function getBorderStyle(color: string = 'default', width: string = '1px', radius: string = 'lg'): React.CSSProperties {
  const colorMap: Record<string, string> = {
    default: ADAMSBRIDGE_TOKENS.COLORS.BORDER_DEFAULT,
    warning: ADAMSBRIDGE_TOKENS.COLORS.WARNING_AMBER,
    critical: ADAMSBRIDGE_TOKENS.COLORS.CRITICAL_RED,
    success: ADAMSBRIDGE_TOKENS.COLORS.SUCCESS_GREEN,
  }

  const radiusMap: Record<string, string> = {
    sm: ADAMSBRIDGE_TOKENS.BORDER_RADIUS.SM,
    md: ADAMSBRIDGE_TOKENS.BORDER_RADIUS.MD,
    lg: ADAMSBRIDGE_TOKENS.BORDER_RADIUS.LG,
    xl: ADAMSBRIDGE_TOKENS.BORDER_RADIUS.XL,
    full: ADAMSBRIDGE_TOKENS.BORDER_RADIUS.FULL,
  }

  return {
    borderColor: colorMap[color] || ADAMSBRIDGE_TOKENS.COLORS.BORDER_DEFAULT,
    borderWidth: width,
    borderStyle: 'solid',
    borderRadius: radiusMap[radius] || ADAMSBRIDGE_TOKENS.BORDER_RADIUS.LG,
  }
}

// Shadow Utilities
export function getShadow(level: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'md'): string {
  return ADAMSBRIDGE_TOKENS.SHADOWS[level]
}

// Spacing Utilities
export function getSpacing(size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'): string {
  return ADAMSBRIDGE_TOKENS.SPACING[size]
}
