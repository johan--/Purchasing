
class CannedMessages < ActiveRecord::Migration
  def change
    create_table :canned_messages do |t|
      t.string :name
      t.boolean :include_summary, default: true
      t.string :subject
      t.string :text

      t.string :note_text

      t.string :default_to
      t.string :default_cc
      t.timestamps
    end
  end
end
