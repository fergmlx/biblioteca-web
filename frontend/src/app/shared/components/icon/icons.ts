export type IconName =
  | "book"
  | "search"
  | "heart"
  | "user"
  | "users"
  | "loan"
  | "home"
  | "arrow"
  | "edit"
  | "trash"
  | "eye"
  | "plus"
  | "calendar"
  | "clock"
  | "pin"
  | "chart"
  | "copy"
  | "logout"
  | "menu"
  | "check"
  | "download"
  | "settings"
  | "x"

export const ICON_PATHS: Record<IconName, string> = {
  book: `<path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H11v16H7.5A3.5 3.5 0 0 0 4 21.5z" /><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H13v16h3.5a3.5 3.5 0 0 1 3.5 3.5z" />`,
  heart: `<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8z" />`,
  search: `<circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" />`,
  user: `<circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" />`,
  users: `<circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M17 14a6 6 0 0 1 4 6" />`,
  loan: `<rect x="3" y="4" width="18" height="16" rx="2" /><path d="M8 2v4M16 2v4M3 9h18M8 13h.01M12 13h.01M16 13h.01" />`,
  home: `<path d="m3 11 9-8 9 8" /><path d="M5 10v11h14V10M9 21v-7h6v7" />`,
  arrow: `<path d="M5 12h14M13 6l6 6-6 6" />`,
  edit: `<path d="M12 20h9" /><path d="m16.5 3.5 4 4L8 20l-5 1 1-5z" />`,
  trash: `<path d="M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6" />`,
  eye: `<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12" /><circle cx="12" cy="12" r="3" />`,
  plus: `<path d="M12 5v14M5 12h14" />`,
  calendar: `<rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" />`,
  clock: `<circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />`,
  pin: `<path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0" /><circle cx="12" cy="10" r="2" />`,
  chart: `<path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />`,
  copy: `<rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />`,
  logout: `<path d="M10 17l5-5-5-5M15 12H3M15 3h5a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-5" />`,
  menu: `<path d="M4 6h16M4 12h16M4 18h16" />`,
  check: `<path d="m5 12 4 4L19 6" />`,
  download: `<path d="M12 3v12M7 10l5 5 5-5M4 21h16" />`,
  settings: `<circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H3v-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V3h4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1z" />`,
  x: `<path d="m6 6 12 12M18 6 6 18" />`,
}
