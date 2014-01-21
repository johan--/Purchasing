META_FIXTURE = {
  tags: [
      { name: "Large Freight", id: 1 },
      { name: "Deliver ASAP", id: 2 },
      { name: "Office Supplies", id: 3 },
      { name: "Deliver to IT", id: 4 },
      { name: "Driver to Department", id: 5 },
      { name: "Call requester when arrives", id: 6 },
      { name: "Hold item at warehouse", id: 7 },
      { name: "Inspect before signing", id: 8 },
      { name: "Live Organisms", id: 9 }
  ],
  taxCodes: [
    "%0.0",
    "%10.0",
    "%9.75",
    "%9.5",
    "%9.25",
    "%9.0",
    "%8.75",
    "%8.5",
    "%8.25",
    "%8.0"
  ],
  buyers: [
    { name: "Breanna", id: 252 },
    { name: "Irene", id: 841 },
    { name: "Jim", id: 998 },
    { name: "Patrick", id: 1666 },
    { name: "Wendy", id: 2174  }
  ],
  tab: "Pending",
  total_pages: 1,
  page: 1,
  sort: "dateRequested",
  direction: "DESC",
  currentUser: {
    id: 5,
    username: 'testUser',
    first_name: 'test',
    last_name: 'user'
  }
};

META_FIXTURE_BACKUP = Ember.copy(META_FIXTURE);
