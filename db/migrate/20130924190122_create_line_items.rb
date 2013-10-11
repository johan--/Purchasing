class CreateLineItems < ActiveRecord::Migration
  def change
    create_table :line_items do |t|
      t.references :purchase, index: true

      t.string :sku, index: true
      t.string :description, index: true
      t.string :unit
      t.integer :quantity
      t.decimal :price, precision: 8, scale: 2

      t.string :last_user
      t.timestamps
    end
  end
end
