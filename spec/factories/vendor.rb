FactoryGirl.define do
  factory :vendor do
    sequence(:name){|n| "#{n}#{Faker::Company.name}" }
    website 'http://www.google.com'
    email Faker::Internet.email
    account_num GetRandom.num(100_000)
  end
end
