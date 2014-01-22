FactoryGirl.define do
  factory :vendor do
    sequence(:name){|n| "#{n}#{Faker::Company.name}" }
    website 'http://www.google.com'
    email Faker::Internet.email
    account_num GetRandom.num(100_000)

    factory :vendor_with_purchase do
      after(:build) do |record|
        record.purchases << FactoryGirl.create(:purchase)
      end
    end
  end
end
