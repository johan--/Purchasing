FactoryGirl.define do
  factory :line_item do
    description GetRandom.string(50)
    quantity 10 + GetRandom.num(50)
    unit GetRandom.unit
    price GetRandom.num(100_00) / 100
  end
end
