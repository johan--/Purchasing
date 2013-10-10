FactoryGirl.define do
  factory :purchase do
    tracking_num GetRandom.string(25)
    # line items
    # Banner Org
    # Banner Acct
    # Banner Fund
    # Notes
    # Vendor
  end
end 
