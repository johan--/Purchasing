FactoryGirl.define do
  factory :receiving do
    package_num GetRandom.num(100)
  end
end
