FactoryGirl.define do
  factory :attachment do
    attachment { fixture_file_upload(Rails.root.join('spec', 'support', 'test.jpg'), 'image/jpg') }
    purchase
  end
end
