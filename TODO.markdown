
#### TODO:
  - Running tests is too slow... research a better testing build?
  - Ghostscript is converting at a low quality, research changing settings to increase

  - Include include_summary in canned_messages
  - Required field validation for email
  - Hard to reproduce:
    - Receiving > edit > cancel = error
    - Vendor edit: become dirty did not bring up save
    - New req > new vendor > save > edit > close failed

#### Test / Review:

  * Ember
    - Test 422 on all ajax
    - Purchases test row color priority
    - Purchases test highlihgt when going back
    - Purchases edit doesn't appear if canceled

    - Vendor show should not do dirty check on close
    - test include_purchase?
    - Purchase.edit > New vendor > click, shouldn't work
    - Purchase.new > New vendor > click, shouldn't work

    - Purchase.edit Emails tests
    - Test binding between requester and TO field
    - Tests for canned messages: test setting on email, test editing / new on modal
    - Canned messages admin

  * Rails
    - test include_purchase
    - Vendor tests for href and mailto filtering
    - Add tests for including attachments with email
    - Test sending emails with an actual server
    - Test that unassigned attachments are unique to user


## Future
  - Where are other places we can implement interactor?

  - Services edit/show:
    - Type: Auto Rental, Air, Hotel, etc.? (these could be the tabs instead of Purchased/Received)
    - Instead of line items, large description box?
    - Confirmation # instead of order #

  - Move timestamps to unix format?
  - Compare timestamps on update action and fail if the record has been updated since the download

  - Build notification system.  Add option to subscribe to changes / updates / notes of a requisition

  - Is there a better way to disconnect the modal outlet than manually removing the backdrop?
  - Spinners should be a component that is triggered by a view or controller flag
  - Should never need to manually call open on a modal... needs to be bound to a view
  - Add title binding once feature is merged https://github.com/emberjs/ember.js/pull/3689

  - Search by tag??

  - Report on shipping costs by Org
  - Report on item usage
  - Damaged check on receiving:
    - Auto send email to buyer and a note that there were damaged items on record id
    - When buyer responds, an email will be sent to Receiver with instructions

  - Include a pdf copy of requisition    http://stackoverflow.com/questions/5421615/rails-3-actionmailer-and-wicked-pdf

  - Scroll for line items should not include header
  - If tracking # is included and courier, add option to perform online track
  - Commits a56f898 & e731638 reduced number of eager loaded tables, but increased # of DB writes when saving / receiving.  Should these be reverted?

  - Investigate notifications from discourse

  - Upgrade to https://github.com/ember-addons/bootstrap-for-ember

  - Add function for receiver to generate emails for all unreceived orders past 30 days
  - Add API for Filemaker to receive items and upload signatures

  - Setup Ember History with Rails (the benefit is Rack-CAS will then remember the full URL if you are logged out)

  - Add rules for reconciling to declarative auth
  - Add FOAP to each line item
  - Attach documents to W-9
  - Need to set DPI for wkhtmltopdf (laptop is wrong DPI)
  - Sunspot is flagging a Relation#all deprecation (search.response)

  - Animations!

  - Filter by dollar amount
  - Reconcile by receiving doc
  - Report on closing old items
  - Populate empty vendor dropdown  with vendors for current requester (like Gmail TO bar)
  - Populate empty requester dropdown  with requesters for current vendor (like Gmail TO bar)
  - Since we have our notification system, how about multiple notification outlets? (such as each bar on edit)
  - Is this a better way of handeling pagination? http://blog.crowdint.com/2013/12/10/paginated-collections-with-ember-js-solr-rails.html

  - Upgrade to https://github.com/square/qunit-bdd


## Bugs for disabled features
  - Sometimes claim / unclaim triggers record dirty
  - Why do you have to push claim twice when its a new record?  Is this related to https://github.com/emberjs/ember.js/issues/4279
  - Binding for value/values of buyer select

  - test claim/unclaim on new, edit, and select
  - Test selection rules for purchases > row
  - test purchases row highlighting and priority


## Standardization
  - Need to standardize CSS classes (camelcase, underscore, or dash?)
  - Need to standardize where bootstrap cols are defined (in sub view or parent?)
  - Need to standardize capitalization of purchase_type, attachment category, and any other text fields (as well as error checking)
  - Need to standardize naming in tooltips and templates (requisition instead of purchase, etc.)
  - Need to review standardization of buttons (clear selection, go back, etc.)
  - Would be nice to standardize naming convention for methods
  - Standardize metadata access: this.get("store").metadataFor("post");
