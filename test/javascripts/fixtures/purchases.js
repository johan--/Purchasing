
App.Purchase.FIXTURES = [
  {
    id: 1,
    dateRequested: moment().subtract('days', 5).format('MMM D, YY'),
    tax_rate: .1,
    buyer: { name: 'A buyer', id: 1 },
    requester: { name: 'A requester', id: 1 },
    recipient: { name: 'A requester', id: 1 },
    trackingNum: 'blach123123'
  },
  {
    id: 2,
    dateRequested: moment().subtract('days', 6).format('MMM D, YY'),
    tax_rate: .1,
    buyer: { name: 'A buyer2', id: 2 },
    requester: { name: 'A requester2', id: 2 },
    recipient: { name: 'A requester2', id: 2 },
    trackingNum: 'blach123123'
  },
  {
    id: 3,
    dateRequested: moment().subtract('days', 7).format('MMM D, YY'),
    tax_rate: .1,
    buyer: { name: 'A buyer', id: 1 },
    requester: { name: 'A requester', id: 1 },
    recipient: { name: 'A requester', id: 1 },
    trackingNum: 'blach123123'
  },
  {
    id: 4,
    dateRequested: moment().subtract('days', 8).format('MMM D, YY'),
    tax_rate: .1,
    buyer: { name: 'A buyer', id: 1 },
    requester: { name: 'A requester', id: 1 },
    recipient: { name: 'A requester', id: 1 },
    trackingNum: 'blach123123'
  },
  {
    id: 5,
    dateRequested: moment().subtract('days', 9).format('MMM D, YY'),
    tax_rate: .1,
    buyer: { name: 'A buyer3', id: 3 },
    requester: { name: 'A requester3', id: 3 },
    recipient: { name: 'A requester3', id: 3 },
    trackingNum: 'blach123123'
  },
];

//starred
//dateRequested
//dateApproved
//dateRequired
//dateExpected
//datePurchased
//datePosted
//dateReconciled
//dateCancelled
//received
//tax_rate
//shipping
//labor
//buyer
//requester
//recipient
//trackingNum
//order_number
//order_confirmation
//courier
//titleText
//updated_at
//last_user
