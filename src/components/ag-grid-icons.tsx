// AG-Grid icon renderer functions that return DOM elements
const createIconElement = (innerHTML: string) => {
  if (typeof document === 'undefined') {
    return innerHTML; // Fallback for SSR
  }
  
  const div = document.createElement('div');
  div.innerHTML = innerHTML;
  div.style.display = 'inline-flex';
  div.style.alignItems = 'center';
  div.style.justifyContent = 'center';
  div.style.width = '16px';
  div.style.height = '16px';
  return div.firstElementChild || div;
};

// AG-Grid Icon Definitions
export const AGGridIcons = {
  // Navigation icons
  first: () => createIconElement(`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m11 17-5-5 5-5M18 17l-5-5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
  
  previous: () => createIconElement(`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m15 18-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
  
  next: () => createIconElement(`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m9 18 6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
  
  last: () => createIconElement(`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m6 17 5-5-5-5M13 17l5-5-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
  
  // Dropdown arrows
  smallDown: () => createIconElement(`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m6 9 6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
  
  smallUp: () => createIconElement(`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m18 15-6-6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
  
  // Sort icons
  sortAscending: () => createIconElement(`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m7 14 5-5 5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
  
  sortDescending: () => createIconElement(`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
  
  sortUnSort: () => createIconElement(`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m7 16 4 4 4-4M7 8l4-4 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
  
  // Menu and filter icons
  menu: () => createIconElement(`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="1" fill="currentColor"/>
      <circle cx="12" cy="5" r="1" fill="currentColor"/>
      <circle cx="12" cy="19" r="1" fill="currentColor"/>
    </svg>
  `),
  
  filter: () => createIconElement(`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
  
  // Action icons
  cross: () => createIconElement(`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m18 6-12 12M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
  
  tick: () => createIconElement(`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6 9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
  
  minus: () => createIconElement(`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
  
  // Loading
  loading: () => createIconElement(`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12a9 9 0 11-6.219-8.56" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `),
  
  // Checkbox states
  checkboxChecked: () => createIconElement(`
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6 9 17l-5-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
  
  checkboxUnchecked: () => createIconElement(`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.5" fill="none"/>
    </svg>
  `),
  
  checkboxIndeterminate: () => createIconElement(`
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.5" fill="currentColor"/>
      <path d="M5 8h6" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `),
};

// AG-Grid Icons Configuration
export const getAGGridIconsConfig = () => ({
  iconMap: {
    // Pagination icons
    first: AGGridIcons.first,
    previous: AGGridIcons.previous,
    next: AGGridIcons.next,
    last: AGGridIcons.last,
    
    // Sort icons
    sortAscending: AGGridIcons.sortAscending,
    sortDescending: AGGridIcons.sortDescending,
    sortUnSort: AGGridIcons.sortUnSort,
    
    // Alternative sort icon names that AG-Grid might use
    asc: AGGridIcons.sortAscending,
    desc: AGGridIcons.sortDescending,
    
    // Dropdown icons
    smallDown: AGGridIcons.smallDown,
    smallUp: AGGridIcons.smallUp,
    
    // Menu icons
    menu: AGGridIcons.menu,
    filter: AGGridIcons.filter,
    
    // Action icons
    cross: AGGridIcons.cross,
    tick: AGGridIcons.tick,
    minus: AGGridIcons.minus,
    
    // Loading
    loading: AGGridIcons.loading,
    
    // Checkbox icons
    checkboxChecked: AGGridIcons.checkboxChecked,
    checkboxUnchecked: AGGridIcons.checkboxUnchecked,
    checkboxIndeterminate: AGGridIcons.checkboxIndeterminate,
    
    // Additional icons that AG-Grid might need
    expanded: AGGridIcons.smallUp,
    contracted: AGGridIcons.smallDown,
    columnMovePin: AGGridIcons.tick,
    columnMoveHide: AGGridIcons.cross,
    columnMoveMove: AGGridIcons.menu,
    columnMoveLeft: AGGridIcons.previous,
    columnMoveRight: AGGridIcons.next,
    columnMoveGroup: AGGridIcons.menu,
    columnMoveValue: AGGridIcons.menu,
    columnMovePivot: AGGridIcons.menu,
    dropNotAllowed: AGGridIcons.cross,
  }
});