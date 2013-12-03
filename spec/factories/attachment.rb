FactoryGirl.define do
  factory :attachment do
    attachment { fixture_file_upload(Rails.root.join('spec', 'support', 'test.jpg'), 'image/jpg') }

    factory :attachment_with_purchase do
      after(:build) do |record|
        record.purchase = FactoryGirl.create(:purchase)
      end
    end
  end
end
