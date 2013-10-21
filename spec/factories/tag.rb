FactoryGirl.define do
  factory :tag do
    sequence(:name){|n| "#{n}A new tag!" }
  end
end
