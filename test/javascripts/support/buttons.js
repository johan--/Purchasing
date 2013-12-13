
buttons = {

// Top Bar
  newButton: '.circle_button[title*="New"]',
  reloadButton: '.circle_button[title*="Reload"]',

  searchBoxInput: '.search_box_input',
  searchAdvancedIcon: 'span[title*="Advanced Search"]',
  searchStart: '.circle_button[title*="search"]',
  searchModal: '.advanced_search_box',

  pageNext: 'span[title*="Go to next page"]',
  pagePrevious: 'span[title*="Go to previous page"]',

// Purchases
  tabNew: '.tab:contains("New")',
  tabPending: '.tab:contains("Pending")',
  tabPurchased: '.tab:contains("Purchased")',
  tabReconciled: '.tab:contains("Reconciled")',
  tabCancelled: '.tab:contains("Cancelled")',

  buyerHeaderCell: '.buyer_cell_header',
  dateHeaderCell: '.date_cell_header',
  vendorHeaderCell: '.vendor_cell_header',
  requesterHeaderCell: '.requester_cell_header',
  departmentHeaderCell: '.department_cell_header',

  firstRow: '.purchase:first',
  firstRowStar: '.purchase:first .star',
  firstRowDelete: '.purchase:first .delete',
  purchaseRow: '.purchase',
  purchaseClickableRows: '.purchase .tag_cells', // TODO This is ugly

  filterButton: '.button.grey:has(.fa-folder-open-o)',
  filterModal: '.modal_close_field',

  startAssigning: '.button:contains("Start Assigning")',
  startAssigning_down: '.button:contains("Start Assigning").button_down',

  startReconciling_down: '.button:contains("Start Reconciling").button_down',
  startReconciling: '.button:contains("Start Reconciling")',

  startUnReconciling_down: '.button:contains("Start Un-Reconciling").button_down',
  startUnReconciling: '.button:contains("Start Un-Reconciling")',

  actionCheckAll: '.action_button.blue:has(.fa-check)',
  actionCheckNone: '.action_button.yellow:has(.fa-ban)',
  actionComplete: '.action_button.green_back',
  actionCompleteTotal: '.action_button.green_back .total',
  actionCancel: '.action_button.red:has(.fa-times)',

};
