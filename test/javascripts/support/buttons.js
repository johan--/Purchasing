
buttons = {

// Top Bar
  newButton: 'button[title*="New"]',

  searchBoxInput: 'input[placeholder*="Search"]',
  searchAdvancedIcon: '.input-group-addon.open_advanced',
  searchStart: '.input-group-addon.start_search',
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
  actionAssignComplete: 'button.assign_selected',
  actionReconcileComplete: 'button.reconcile_selected',
  actionUnreconcileComplete: 'button.unreconcile_selected',

  // Assign Select
  assignSelect: '.form-control.ember-select:has(option:contains("Breanna"))',
  assignSelectOption: '.form-control.ember-select>option',


// Purchase.edit
  purchaseEditStar: '.star',
  purchaseEditReload: 'button:contains("Relad")',
  purchaseEditAttachments: 'li.open_attachments',
  purchaseEditSavePDF: 'li.save_req',
  purchaseEditEmail: 'li.email_req',
  purchaseEditPrint: 'li.print_req',

  purchaseRequesterTab: 'a[href*="requester"]',
  purchaseRecipientTab: 'a[href*="recipient"]',

  purchaseEditDelete: 'button.delete_req',

  purchaseGoBack: 'button:contains("Go back")',
  purchaseStartEdit: 'button:contains("Edit Record")',
  purchaseClaim: 'button:contains("Claim")',
  purchaseUnclaim: '.btn-link.unclaim_req',
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
  receivingNew: 'button.new_receiving',
  receiveAll: 'button.receive_all',

  receivingLines: '.receivings_scrollable>table>tbody>tr',
  receivingEdit: 'button.receiving_edit',
  receivingRecCancel: 'button.receving_rec_cancel',
  receivingRecSave: 'button.receving_rec_save',

  accountingTaxRate: 'button.tax_rate',
  accountingTaxSelect: '.totals>dl>dt>select',
  accountingTaxCancel: 'button.tax_rate_cancel',

  accountCurrentNumber: '#accountDropdown',
  accountMenu: '.accounts_menu',
  accountEditCancel: 'button.account_edit_cancel',
  accountEditAdd: 'button.account_edit_add',

  accountModal: '#accountAdd',
  accountNewFund: '.new_fund_field',
  accountNewOrg: '.new_org_field',
  accountNewAcct: '.new_acct_field',
  accountNewCancel: '.accountAddClose',
  accountNewSave: '.accountAddSave',

  noteText: '.note>td>input',

  tagsSelect: '.tags-select>select',
};
