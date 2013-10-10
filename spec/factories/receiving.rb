FactoryGirl.define do
  factory :receiving do
    quantity GetRandom.num(100)
  end
end
