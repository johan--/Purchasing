FactoryGirl.define do
  factory :user do
    username Faker::Internet.user_name
    first_name Faker::Name.first_name
    last_name Faker::Name.last_name
    title Faker::Name.title
    email Faker::Internet.email


    factory :buyer do
      after(:create) do |user|
        user.update_roles!([:buyer], :role)
      end
    end
    factory :receiver do
      after(:create) do |user|
        user.update_roles!([:receiver], :role)
      end
    end
    factory :employee do
      after(:create) do |user|
        user.update_roles!([:employee], :role)
      end
    end
    factory :guest do
      after(:create) do |user|
        user.update_roles!([:guest], :role)
      end
    end
    factory :manager do
      after(:create) do |user|
        user.update_roles!([:manager], :role)
      end
    end
    factory :admin do
      after(:create) do |user|
        user.update_roles!([:admin], :role)
      end
    end
  end
end
