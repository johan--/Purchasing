
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
  pageNumbers: '.pagination>li:not(:has("i"))',

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
  assignSelectOption: '.form-control.ember-select>option',


// Purchase.edit
  purchaseEditStar: '.star',
  purchaseEditReload: 'button:contains("Relad")',
  purchaseEditAttachments: 'li[title*="Attach"]',
  purchaseEditSavePDF: 'li[title*="Save PDF"]',
  purchaseEditEmail: 'li[title*="Email"]',
  purchaseEditPrint: 'li[title*="Print"]',

  purchaseRequesterTab: 'a[href*="requester"]',
  purchaseRecipientTab: 'a[href*="recipient"]',

  purchaseReceivingNew: 'button[title*="new receiving document"]',
  purchaseReceiveAll: 'button[title*="Recieve all"]',
  purchaseEditDelete: 'button[title*="Delete record"]',

  purchaseGoBack: 'button:contains("Go back")',
  purchaseStartEdit: 'button:contains("Edit Record")',
  purchaseClaim: 'button:contains("Claim")',
  purchaseUnclaim: '.btn-link[title*="unclaim"]',
  purchaseOrdered: 'button:contains("Ordered!")',

  lineItems: '.line_items_scrollable>table>tbody>tr',
  lineDescription: 'td.description>input',
  lineUnit: 'td.unit>input',
  lineQuantity: 'td.quantity>input',
  linePrice: 'td.price>input',
  lineExtended: 'td.price:last',
  lineReceivedCount: 'td.received_count:first',
  lineReceivedHover: 'td.received_count:last',
  lineDelete: '.line_items_scrollable>table>tbody>tr>.delete_container>.delete',

  receivingButtons: '.is_receiving_container',
  receivingMinus: '.receiving_left',
  receivingPlus: '.receiving_right',

  noteText: '.note>td>input',
  receivingLines: '.receivings_scrollable>table>tbody>tr',
  receivingEdit: 'button.receiving_edit',
  receivingCancel: 'button[title*="Cancel editing this receiving"]',

  tagsSelect: '.tags-select>select',
};
