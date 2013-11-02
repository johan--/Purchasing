FactoryGirl.define do
  factory :purchase do
    tracking_num GetRandom.string(25)
    # line items
    # Banner Org
    # Banner Acct
    # Banner Fund
    # Notes
    # Vendor


    factory :purchase_with_vendors do
      after(:build) do |record|
        record.vendors << FactoryGirl.create(:vendor)
        record.vendors << FactoryGirl.create(:vendor)
      end
    end

  end
end
