FactoryGirl.define do
  factory :purchase do
    tracking_num GetRandom.string(25)
    date_requested DateTime.new.strftime('%m/%d/%y %H:%M:%S')
    purchase_type 'materials'

    factory :purchase_with_vendors do
      after(:build) do |record|
        record.vendors << FactoryGirl.create(:vendor)
        record.vendors << FactoryGirl.create(:vendor)
      end
    end

    factory :purchase_with_line do
      after(:build) do |record|
        record.line_items << FactoryGirl.create(:line_item)
      end
    end

    factory :purchase_with_lines do
      after(:build) do |record|
        record.line_items << FactoryGirl.create(:line_item)
        record.line_items << FactoryGirl.create(:line_item)
      end
    end

    factory :purchase_with_everything do
      after(:build) do |record|
        5.times do
          record.line_items << FactoryGirl.create(:line_item)
        end
        3.times do
          record.notes << FactoryGirl.create(:note)
        end
        2.times do
          line = record.line_items.sample
          record.receivings << FactoryGirl.create(:receiving_with_line, { quantity: line.quantity, line_item_id: line.id })
        end
        record.requester = FactoryGirl.create(:user)
        record.recipient = FactoryGirl.create(:user)
        record.buyer = FactoryGirl.create(:user)
        record.account = FactoryGirl.create(:account, { user_id: record.requester_id })
        3.times do
          record.attachments << FactoryGirl.create(:attachment)
        end
        3.times do
          record.tags << FactoryGirl.create(:tag)
        end
        3.times do
          record.vendors << FactoryGirl.create(:vendor)
        end
      end
    end
  end
end
