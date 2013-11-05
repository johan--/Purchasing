FactoryGirl.define do
  factory :purchase do
    tracking_num GetRandom.string(25)

    factory :purchase_with_vendors do
      after(:build) do |record|
        record.vendors << FactoryGirl.create(:vendor)
        record.vendors << FactoryGirl.create(:vendor)
      end
    end

    factory :purchase_with_lines do
      after(:build) do |record|
        record.line_items << FactoryGirl.create(:line_item)
        record.line_items << FactoryGirl.create(:line_item)
      end
    end

  end
end
