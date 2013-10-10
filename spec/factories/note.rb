FactoryGirl.define do
  factory :note do
    account_name Faker::Company.name
    account_num { GetRandom.num(100_000) }

    after(:build) do |account|
      account.users << FactoryGirl.create(:user)
    end
  end
end
