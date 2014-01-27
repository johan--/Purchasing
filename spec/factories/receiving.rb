FactoryGirl.define do
  factory :receiving do
    package_num GetRandom.num(100)

    ignore do
      quantity 0
      line_item_id nil
    end

    factory :receiving_with_line do
      after(:create) do |record, evaluator|
        record.receiving_lines << ReceivingLine.create({ quantity: evaluator.quantity,
                                                         line_item_id: evaluator.line_item_id,
                                                      })
      end
    end
  end
end
