FactoryGirl.define do
  factory :note do
    text GetRandom.description(50)
  end
end
