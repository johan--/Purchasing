FactoryGirl.define do
  factory :user do
    username Faker::Internet.user_name
    first_name Faker::Name.first_name
    last_name Faker::Name.last_name
    title Faker::Name.title
    email Faker::Internet.email
    
    # Department
    # Banner Org
    # Banner Acct
    # Banner Fund
  end
end
