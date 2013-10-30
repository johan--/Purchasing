class CreateNotes < ActiveRecord::Migration
  def change
    create_table :notes do |t|
      t.string :text, index: true

      t.string :last_user
      t.references :purchase, index: true
      t.timestamps
    end
  end
end
