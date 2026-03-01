const S = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';

export const ICONS = [
  // ── Fitness ──
  { id: 'running', name: 'Running', svg: `<svg ${S}><path d="M13 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0"/><path d="M5 21l3-7"/><path d="M9 14l-1.286-4.286a1 1 0 0 1 .37-1.063L12 6l3.18 2.12a1 1 0 0 1 .42.7L16 12"/><path d="M10 14l5 1 3.5 3.5"/></svg>` },
  { id: 'dumbbell', name: 'Dumbbell', svg: `<svg ${S}><path d="M14.4 14.4 9.6 9.6"/><path d="M18.657 21.485a2 2 0 1 1-2.829-2.828l-1.767-1.768a2 2 0 1 1-2.829-2.829l6.364-6.364a2 2 0 1 1 2.829 2.829l1.767 1.767a2 2 0 1 1 2.829 2.829z"/><path d="m21.5 21.5-1.4-1.4"/><path d="M3.9 3.9 2.5 2.5"/><path d="M6.404 12.768a2 2 0 1 1-2.829-2.829l1.768-1.767a2 2 0 1 1-2.828-2.829l2.828-2.828a2 2 0 1 1 2.829 2.828l1.767-1.768a2 2 0 1 1 2.829 2.829z"/></svg>` },
  { id: 'yoga', name: 'Yoga', svg: `<svg ${S}><circle cx="12" cy="3.5" r="1.5"/><path d="M7 21l3-9 2 3 2-3 3 9"/><path d="M5 12h14"/></svg>` },
  { id: 'cycling', name: 'Cycling', svg: `<svg ${S}><circle cx="18" cy="18" r="3.5"/><circle cx="6" cy="18" r="3.5"/><path d="M6 18l4-8h4l3 5"/><circle cx="13" cy="6" r="1"/></svg>` },
  { id: 'swimming', name: 'Swimming', svg: `<svg ${S}><path d="M2 20c1.5-1 3.5-1 5 0s3.5 1 5 0 3.5-1 5 0 3.5 1 5 0"/><path d="M2 16c1.5-1 3.5-1 5 0s3.5 1 5 0 3.5-1 5 0 3.5 1 5 0"/><path d="M8 14V8.5c0-1.38 1.12-2.5 2.5-2.5S13 7.12 13 8.5V9"/><circle cx="16" cy="5" r="1.5"/><path d="M13 9l3 3"/></svg>` },
  { id: 'basketball', name: 'Basketball', svg: `<svg ${S}><circle cx="12" cy="12" r="10"/><path d="M4.93 4.93l14.14 14.14"/><path d="M19.07 4.93L4.93 19.07"/><path d="M12 2a15.3 15.3 0 0 1 0 20"/><path d="M12 2a15.3 15.3 0 0 0 0 20"/></svg>` },
  { id: 'tennis', name: 'Tennis', svg: `<svg ${S}><circle cx="10" cy="14" r="8"/><path d="M17.5 6.5L22 2"/><path d="M2.05 13.63a8 8 0 0 1 8.58-8.58"/><path d="M21.95 10.37a8 8 0 0 1-8.58 8.58"/></svg>` },
  { id: 'boxing', name: 'Boxing', svg: `<svg ${S}><path d="M18 11V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v5"/><path d="M6 11a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4"/><path d="M10 15v4a2 2 0 0 1-2 2H7"/><path d="M14 15v4a2 2 0 0 0 2 2h1"/><path d="M10 4V2"/><path d="M14 4V2"/></svg>` },

  // ── Health ──
  { id: 'water-drop', name: 'Water Drop', svg: `<svg ${S}><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>` },
  { id: 'salad', name: 'Salad', svg: `<svg ${S}><path d="M7 21h10"/><path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9z"/><path d="M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 4.09.58A2.4 2.4 0 0 1 21 8.5a2.4 2.4 0 0 1-1.62 3.5"/></svg>` },
  { id: 'apple', name: 'Apple', svg: `<svg ${S}><path d="M12 2c1 .5 2 2 2 3-2 0-4 1-4 4"/><path d="M8.35 7.97A3.41 3.41 0 0 0 5 10c0 6 3 10 7 10s7-4 7-10a3.41 3.41 0 0 0-3.35-2.03"/></svg>` },
  { id: 'pill', name: 'Pill', svg: `<svg ${S}><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7z"/><path d="m8.5 8.5 7 7"/></svg>` },
  { id: 'sleep', name: 'Sleep', svg: `<svg ${S}><path d="M2 4h4l2.5 5H2"/><path d="M12 2h4l2.5 5H12"/><path d="M17 21H7a2 2 0 0 1-2-2v-4a7 7 0 0 1 14 0v4a2 2 0 0 1-2 2z"/></svg>` },
  { id: 'skincare', name: 'Skincare', svg: `<svg ${S}><path d="M8 2h8l2 6v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8z"/><path d="M10 2v6"/><path d="M14 2v6"/><path d="M6 8h12"/></svg>` },
  { id: 'tooth', name: 'Tooth', svg: `<svg ${S}><path d="M12 2C8 2 5 5 5 8c0 2.5.5 4 1.5 6 .7 1.4 1 3.5 1.5 5 .3 1 1 3 2 3s1.5-1 2-3l.5-2 .5 2c.5 2 1 3 2 3s1.7-2 2-3c.5-1.5.8-3.6 1.5-5 1-2 1.5-3.5 1.5-6 0-3-3-6-7-6z"/></svg>` },
  { id: 'heart', name: 'Heart', svg: `<svg ${S}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/></svg>` },

  // ── Productivity ──
  { id: 'book', name: 'Book', svg: `<svg ${S}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>` },
  { id: 'brain', name: 'Brain', svg: `<svg ${S}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18z"/><path d="M12 5v13"/></svg>` },
  { id: 'target', name: 'Target', svg: `<svg ${S}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>` },
  { id: 'pencil', name: 'Pencil', svg: `<svg ${S}><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352 4.352-1.32a2 2 0 0 0 .83-.498z"/></svg>` },
  { id: 'notebook', name: 'Notebook', svg: `<svg ${S}><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect x="4" y="2" width="16" height="20" rx="2"/></svg>` },
  { id: 'palette', name: 'Palette', svg: `<svg ${S}><circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>` },
  { id: 'music', name: 'Music', svg: `<svg ${S}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>` },
  { id: 'puzzle', name: 'Puzzle', svg: `<svg ${S}><path d="M15.39 4.39a1 1 0 0 0 .61.22A3 3 0 0 1 19 8a1 1 0 0 0 .78.39h.22a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 1 1 0 0 0-1 1 3 3 0 0 1-3 3 1 1 0 0 0-.78.39A2 2 0 0 1 13.61 20H10a2 2 0 0 1-1.61-.78A1 1 0 0 0 7.61 19 3 3 0 0 1 5 16a1 1 0 0 0-.78-.39A2 2 0 0 1 2.61 14v-2A2 2 0 0 1 4 10a1 1 0 0 0 1-1 3 3 0 0 1 3-3 1 1 0 0 0 .78-.39A2 2 0 0 1 10.39 4h3.22a2 2 0 0 1 1.78 1.39z"/></svg>` },

  // ── Lifestyle ──
  { id: 'laptop', name: 'Laptop', svg: `<svg ${S}><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>` },
  { id: 'mail', name: 'Mail', svg: `<svg ${S}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>` },
  { id: 'broom', name: 'Broom', svg: `<svg ${S}><path d="M12 2v8"/><path d="M4.93 10.93A10 10 0 0 0 2 18v2h20v-2a10 10 0 0 0-2.93-7.07"/><path d="M9 10h6"/></svg>` },
  { id: 'plant', name: 'Plant', svg: `<svg ${S}><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>` },
  { id: 'sun', name: 'Sun', svg: `<svg ${S}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>` },
  { id: 'dog', name: 'Dog', svg: `<svg ${S}><path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"/><path d="M14.267 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"/><path d="M8 14v.5"/><path d="M16 14v.5"/><path d="M11.25 16.25h1.5L12 17z"/><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309"/></svg>` },
  { id: 'camera', name: 'Camera', svg: `<svg ${S}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/></svg>` },
  { id: 'wallet', name: 'Wallet', svg: `<svg ${S}><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>` },

  // ── General ──
  { id: 'pray', name: 'Pray', svg: `<svg ${S}><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>` },
  { id: 'smile', name: 'Smile', svg: `<svg ${S}><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>` },
  { id: 'walk', name: 'Walk', svg: `<svg ${S}><circle cx="14" cy="4" r="2"/><path d="M9 21l1-7"/><path d="M14 21l-1-4-3-4 2-3"/><path d="M6 12l4-3 2 1"/><path d="M12 6l2 4 5 1"/></svg>` },
  { id: 'gamepad', name: 'Gamepad', svg: `<svg ${S}><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/><rect x="2" y="6" width="20" height="12" rx="2"/></svg>` },
  { id: 'coffee', name: 'Coffee', svg: `<svg ${S}><path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z"/><path d="M16 8h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2"/><path d="M6 2v2"/><path d="M2 18h18"/></svg>` },
  { id: 'library', name: 'Library', svg: `<svg ${S}><path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>` },
  { id: 'flame', name: 'Flame', svg: `<svg ${S}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>` },
  { id: 'star', name: 'Star', svg: `<svg ${S}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>` },

  // ── Additional ──
  { id: 'meditation', name: 'Meditation', svg: `<svg ${S}><circle cx="12" cy="5" r="2"/><path d="M4 20c0-5 3.5-8 8-8s8 3 8 8"/><path d="M8 16l-2 4"/><path d="M16 16l2 4"/></svg>` },
  { id: 'weight-scale', name: 'Weight Scale', svg: `<svg ${S}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>` },
  { id: 'moon', name: 'Moon', svg: `<svg ${S}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/></svg>` },
  { id: 'clock', name: 'Clock', svg: `<svg ${S}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>` },
  { id: 'phone', name: 'Phone', svg: `<svg ${S}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>` },
  { id: 'home', name: 'Home', svg: `<svg ${S}><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>` },
  { id: 'flag', name: 'Flag', svg: `<svg ${S}><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>` },
  { id: 'trophy', name: 'Trophy', svg: `<svg ${S}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0z"/></svg>` },
  { id: 'chart', name: 'Chart', svg: `<svg ${S}><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>` },
  { id: 'compass', name: 'Compass', svg: `<svg ${S}><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>` },
];

export function getIconById(id) {
  return ICONS.find((icon) => icon.id === id) ?? null;
}

export function getIconSvg(id) {
  return getIconById(id)?.svg ?? null;
}
