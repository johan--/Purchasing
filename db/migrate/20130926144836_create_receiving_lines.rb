class CreateReceivingLines < ActiveRecord::Migration
  def change
    create_table :receiving_lines do |t|
      t.references :line_item, index: true
      t.references :receiving, index: true

      t.integer :quantity

      t.string :last_user
      t.timestamps
    end
  end
end
