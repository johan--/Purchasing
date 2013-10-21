FactoryGirl.define do
  factory :note do
    note { GetRandom.description(50)}
  end
end
