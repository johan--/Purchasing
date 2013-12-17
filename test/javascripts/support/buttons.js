
buttons = {

// Top Bar
  newButton: 'button[title*="New"]',

  searchBoxInput: 'input[placeholder*="Search"]',
  searchAdvancedIcon: '.input-group-addon[title*="Advanced Search"]',
  searchStart: '.input-group-addon[title*="Start Search"]',
  searchModal: '.advanced_search_box', // TODO

  pageNext: 'li[title*="Go to the next page"]',
  pagePrevious: 'li[title*="Go to the previous page"]',
  pageFirst: 'li[title*="Go to the first page"]',
  pageLast: 'li[title*="Go to the last page"]',

// Purchases
  tabNew: 'ul.nav-tabs>li:contains("New")',
  tabPending: 'ul.nav-tabs>li:contains("Pending")',
  tabPurchased: 'ul.nav-tabs>li:contains("Purchased")',
  tabReconciled: 'ul.nav-tabs>li:contains("Reconciled")',
  tabCancelled: 'ul.nav-tabs>li:contains("Cancelled")',
  tabStarred: 'ul.nav-tabs>li:contains("Starred")',

  buyerHeaderCell: 'th>a:contains("Buyer")',
  dateHeaderCell: 'th>a:contains("Date")',
  vendorHeaderCell: 'th>a:contains("Vendor")',
  requesterHeaderCell: 'th>a:contains("Requester")',
  departmentHeaderCell: 'th>a:contains("Department")',

  firstRow: 'tbody>tr:first',
  firstRowStar: 'tbody>tr:first .star',
  firstRowDelete: 'tbody>tr:first .delete',
  purchaseRow: 'tbody>tr',
  purchaseClickableRows: 'tbody>tr',
  purchaseEdit: '.table>tbody>tr>td>.btn-group>.dropdown-menu>li:contains("Edit")',
  purchaseShow: '.table>tbody>tr>td>.btn-group>.dropdown-menu>li:contains("Show")',
  purchaseDelete: '.table>tbody>tr>td>.btn-group>.dropdown-menu>li:contains("Delete")',

  actionCheckAll: 'button:has(.fa-check)',
  actionCheckNone: 'button:has(.fa-ban)',
  actionAssignComplete: 'button[title*="Assign selected"]',
  actionReconcileComplete: 'button[title*="Reconcile selected"]',
  actionUnreconcileComplete: 'button[title*="Unreconcile selected"]',

  // Assign Select
  assignSelect: '.form-control.ember-select:has(option:contains("Breanna"))',
  assignSelectOption: '.form-control.ember-select>option'
};
