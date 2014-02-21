
buttons = {

  modalBackground: '.modal.in',

// Nav Bar
  navBarPurchaseMaterials: '.nav>li>a:contains("Materials")',
  navBarPurchaseServices: '.nav>li>a:contains("Services")',
  navBarAttachments: '.nav>li>a:contains("Attachments")',
  navBarOptions: '.nav>li.dropdown>a.dropdown-toggle>i.fa-cog',
  navBarOptionsVendors: '.nav>li.dropdown>ul.dropdown-menu>li>a:contains("Vendors")',
  navBarOptionsTags: '.nav>li.dropdown>ul.dropdown-menu>li>a:contains("Tags")',
  navBarOptionsUsers: '.nav>li.dropdown>ul.dropdown-menu>li>a:contains("Users")',

// Top Bar
  newButton: 'button[title*="New"]',

  searchBoxInput: '.search_box_input',
  searchAdvancedIcon: '.input-group-addon.open_advanced',
  searchStart: '.input-group-addon.start_search',
  searchModal: '.advanced_search_box', // TODO

  searchAdvancedId: 'input[name=searchId]',
  searchAdvancedVendor: 'input[name=vendor]',
  searchAdvancedRequester: 'input[name=requester]',
  searchAdvancedBuyer: 'input[name=buyer]',
  searchAdvancedRequestedMin: '.dateRequested>input[name="min"]',
  searchAdvancedRequestedMax: '.dateRequested>input[name="max"]',
  searchAdvancedPurchasedMin: '.datePurchased>input[name="min"]',
  searchAdvancedPurchasedMax: '.datePurchased>input[name="max"]',
  searchAdvancedExpectedMin: '.dateExpected>input[name="min"]',
  searchAdvancedExpectedMax: '.dateExpected>input[name="max"]',
  searchAdvancedIncludeReceived: 'input[name=includeReceived]',
  searchAdvancedLines: 'input[name=lines]',
  searchAdvancedType: 'select[name=purType]',
  searchAdvancedDepartment: 'input[name=department]',
  searchAdvancedStart: 'button.start_advanced_search',
  searchAdvancedCancel: 'button.cancel_advanced_search',

  pageNext: 'li[title*="Go to the next page"]',
  pagePrevious: 'li[title*="Go to the previous page"]',
  pageFirst: 'li[title*="Go to the first page"]',
  pageLast: 'li[title*="Go to the last page"]',
  pageNumbers: '.pagination>li:not(:has("i"))',

// Purchases
  tabNew: 'ul.nav-tabs>li:contains("New")>a',
  tabPending: 'ul.nav-tabs>li:contains("Pending")>a',
  tabPurchased: 'ul.nav-tabs>li:contains("Purchased")>a',
  tabReceived: 'ul.nav-tabs>li:contains("Received")>a',
  tabReconciled: 'ul.nav-tabs>li:contains("Reconciled")>a',
  tabCanceled: 'ul.nav-tabs>li:contains("Canceled")>a',
  tabStarred: 'ul.nav-tabs>li:contains("Starred")>a',

  buyerHeaderCell: '.sort-buyer>a',
  buyerHeaderArrow: '.sort-buyer>div>i:last',
  dateHeaderCell: '.sort-requested>a',
  dateHeaderArrow: '.sort-requested>div>i:last',
  vendorHeaderCell: '.sort-vendor>a',
  vendorHeaderArrow: '.sort-vendor>div>i:last',
  requesterHeaderCell: '.sort-requester>a',
  requesterHeaderArrow: '.sort-requester>div>i:last',
  departmentHeaderCell: '.sort-department>a',
  departmentHeaderArrow: '.sort-department>div>i:last',

  firstRow: 'tbody>tr:first',
  firstRowStar: 'tbody>tr:first .star',
  firstRowDelete: 'tbody>tr:first .delete',
  purchaseRow: 'tbody>tr',
  purchaseClickableRows: 'tbody>tr',
  purchaseShow: 'td>.btn-group>.btn:contains("Show")',
  purchaseEdit: 'td>.btn-group>.dropdown-menu>li:contains("Edit")',
  purchaseDelete: 'td>.btn-group>.dropdown-menu>li:contains("Delete")',
  purchaseSelect: 'td>.btn-group>.dropdown-menu>li:contains("Select")',

  actionControls: '.action_controls',
  actionCheckAll: 'button:has(.fa-check)',
  actionCheckNone: 'button:has(.fa-ban)',
  actionAssignComplete: 'button.assign_selected',
  actionReconcileComplete: 'button.reconcile_selected',
  actionUnreconcileComplete: 'button.unreconcile_selected',

  // Assign Select
  assignSelect: '.form-control.ember-select:has(option:contains("Breanna"))',
  assignSelectOption: '.form-control.ember-select>option',


// Purchases hover
  purchasesHoverStart: '.row_hover_button',
  purchasesHoverClose: '.close',

// Purchase.edit
  purchaseHeader: '.title_bar.row',
  purchaseEditStar: '.star',
  purchaseEditStarClickable: '.star.clickable',
  purchaseEditReload: 'button:contains("Relad")',
  purchaseEditAttachments: 'li.open_attachments',
  purchaseEditSavePDF: 'li.save_req',
  purchaseEditEmail: 'li.email_req',
  purchaseEditPrint: 'li.print_req',

  dateRequestedField: 'dl:has(dt:contains("Date Requested"))',
  purchaseEditDelete: 'button.delete_req',
  purchaseEditCancel: 'button.cancel_req',

  purchaseGoBack: 'button:contains("Go back")',
  purchaseClaim: '.btn-default.claim_req',
  purchaseUnclaim: '.btn-link.unclaim_req',
  purchaseOrdered: 'button:contains("Ordered!")',

  purchaseStartEdit: 'button:contains("Edit Record")',
  purchaseSave: 'button.save_requisition',
  purchaseCreate: 'button.create_requisition',

  purchaseRequesterTab: '.people_tabs>.requester>a',
  purchaseRecipientTab: '.people_tabs>.recipient>a',
  purchaseVendorTokens: '.vendor_token_input>.token-input-list>.token-input-token',
  purchasePersonNameToken: '.token-input-token-large',
  purchasePersonTokenDelete: '.token-input-token-large>span',
  purchaseRequesterName: '#requester>dl:has(dt:contains("Requester"))>dd',
  purchaseRecipientName: '#recipient>dl:has(dt:contains("Recipient"))>dd',

  lineItems: '.line_items_scrollable>table>tbody>tr',
  lineDescription: 'td.description>input',
  lineUnit: 'td.unit>input',
  lineQuantity: 'td.quantity>input',
  linePrice: 'td.price>input',
  lineExtended: 'td.price:last',
  lineReceivedCount: 'td.received_count:first',
  lineReceivedHover: 'td.received_count:last',
  lineDelete: '.line_items_scrollable>table>tbody>tr>.delete_container>.delete',

  receivingBox: '.receivings_wrapper',
  receivingButtons: '.is_receiving_container',
  receivingMinus: '.receiving_left',
  receivingPlus: '.receiving_right',
  receivingNew: 'button.new_receiving',
  receiveAll: 'button.receive_all',

  receivingLines: '.receivings_scrollable>table>tbody>tr',
  receivingEdit: 'tr.receiving',
  receivingDelete: '.receiving>.delete_container',
  receivingRecCancel: 'button.receving_rec_cancel',
  receivingRecSave: 'button.receving_rec_save',

  accountingTaxRate: 'button.tax_rate',
  accountingTaxSelect: '.totals>dl>dt>select',
  accountingTaxCancel: 'button.tax_rate_cancel',

  accountCurrentNumber: '#accountDropdown',
  accountMenu: '.accounts_menu',
  accountList: '.accounts_list>li>a',
  accountEditCancel: 'button.account_edit_cancel',
  accountEditAdd: 'button.account_edit_add',

  accountModal: '#accountAdd',
  accountNewFund: '.new_fund_field',
  accountNewOrg: '.new_org_field',
  accountNewAcct: '.new_acct_field',
  accountNewCancel: '.accountAddClose',
  accountNewSave: '.accountAddSave',

  note: '.note',
  noteText: '.note>td>input',
  noteAdd: 'button:contains("New Note")',
  noteModal: '#noteModal',
  noteNewText: '#noteModal>.note_text',
  noteNewTextInput: '#noteModal>.note_text>textarea',
  noteNewSave: '.noteAddSave',
  noteNewCancel: '.noteAddClose',

  tagsSelect: '.tags-select>select',
  tagIcons: '.small_tag',

  purchaseCrumbs: '.crumb>a',

  courierSelect: '.courier_select',

  purchaseAttachmentsModal: '#attachmentsModal',
  purchaseAttachmentsAssigned: '.attachments_assigned>.attachment',
  purchaseAttachmentsUnAssigned: '.attachments_unassigned>.attachment',

  purchaseAttachmentTabOther: '.category:contains("Other")',
  purchaseAttachmentTabRequisition: '.category:contains("Requisition")',
  purchaseAttachmentTabConfirmation: '.category:contains("Confirmation")',
  purchaseAttachmentTabPackingList: '.category:contains("Packing List")',
  purchaseAttachmentTabInvoice: '.category:contains("Invoice")',
  purchaseAttachmentTabReturn: '.category:contains("Return")',

  purchaseAttachmentControls: '.attachment-controls',
  purchaseAttachmentControlsAssign: '.attachment-assign',
  purchaseAttachmentControlsClear: '.attachment-clear',
  purchaseAttachmentControlsUnAssign: '.attachment-unassign',

// Attachments

  attachment: '.attachment',
  attachmentItem: '.attachment>.attached_item',
  attachmentSelectionOverlay: '.attachment>.attached_item>.selected_overlay',

  attachmentsUnselect: '.attachments_unselect',
  attachmentsNew: '.attachments_new',
  attachmentsMaterials: '.attachments_materials',
  attachmentsServices: '.attachments_services'
};
