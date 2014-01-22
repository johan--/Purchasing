FactoryGirl.define do
  factory :account do
    fund 101000
    org 604150
    acct 71204

    after(:build) do |account|
      account.user = FactoryGirl.create(:user)
    end

    factory :account_with_purchase do
      after(:build) do |record|
        record.purchases << FactoryGirl.create(:purchase)
      end
    end
  end
end
