FactoryGirl.define do
  factory :canned_message do
    sequence(:name){|n| "#{n}A new canned message!" }
    subject 'Stuff and things'
    text 'More things about nothing'
    note_text 'A note text'
  end
end
