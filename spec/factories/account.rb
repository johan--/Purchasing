FactoryGirl.define do
  factory :account do
    fund 101000
    org 604150
    acct 71204

    after(:build) do |account|
      account.user = FactoryGirl.create(:user) if account.user_id.blank?
    end

    factory :account_with_purchase do
      after(:create) do |account|
        account.purchases << FactoryGirl.create(:purchase, { requester_id: account.user_id })
      end
    end
  end
end
