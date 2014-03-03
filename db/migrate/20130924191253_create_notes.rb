class CreateNotes < ActiveRecord::Migration
  def change
    create_table :notes do |t|
      t.string :text, index: true

      t.references :purchase, index: true
      t.references :user, index: true
      t.timestamps
    end
  end
end
