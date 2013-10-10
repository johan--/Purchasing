FactoryGirl.define do
  factory :department do
    name Faker::Company.name
    account_num GetRandom.num(100_000)
  end
end
